import { pool } from "./postgres";
import { PoolClient } from "pg";

/**
 * The Ultimate Plan ETL - Transforms raw MGNREGA data into clean KPIs
 * This calculates the 10 key metrics that answer 3 questions:
 * 1. "काम मिला?" (Did We Get Work?)
 * 2. "काम पूरा हुआ?" (Is the Work Done?)
 * 3. "क्या यह सबके लिए है?" (Is it Fair for Everyone?)
 */
export async function transformAndStorePerformanceData(): Promise<void> {
  console.log("🔄 Starting ETL: Transforming raw MGNREGA data into KPIs...");
  const client: PoolClient = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Clear existing data
    console.log("   🗑️  Clearing old performance data...");
    await client.query("TRUNCATE TABLE district_monthly_performance RESTART IDENTITY");
    await client.query("TRUNCATE TABLE state_monthly_averages RESTART IDENTITY");

    // Step 1: Calculate District-Level KPIs
    console.log("   📊 Calculating district KPIs...");
    const districtQuery = `
      INSERT INTO district_monthly_performance (
        fin_year, month, state_code, state_name, district_code, district_name,
        families_worked, total_person_days, on_time_payment_percent, total_expenditure,
        completed_works, ongoing_works, hundred_day_completion_rate, households_completed_100_days,
        percent_women, percent_sc, percent_st,
        is_latest_month
      )
      SELECT 
        fin_year,
        month,
        state_code,
        state_name,
        district_code,
        district_name,
        
        -- Section 1: "काम मिला?" (Did We Get Work?)
        COALESCE(total_households_worked, 0) AS families_worked,
        COALESCE(persondays_of_central_liability_so_far, 0) AS total_person_days,
        COALESCE(percentage_payments_gererated_within_15_days, 0) AS on_time_payment_percent,
        COALESCE(total_exp, 0) AS total_expenditure,
        
        -- Section 2: "काम पूरा हुआ?" (Is the Work Done?)
        COALESCE(number_of_completed_works, 0) AS completed_works,
        COALESCE(number_of_ongoing_works, 0) AS ongoing_works,
        CASE 
          WHEN COALESCE(total_households_worked, 0) > 0 
          THEN ROUND((COALESCE(total_no_of_hhs_completed_100_days_of_wage_employment, 0)::NUMERIC 
                      / total_households_worked::NUMERIC) * 100, 2)
          ELSE 0
        END AS hundred_day_completion_rate,
        COALESCE(total_no_of_hhs_completed_100_days_of_wage_employment, 0) AS households_completed_100_days,
        
        -- Section 3: "क्या यह सबके लिए है?" (Is it Fair for Everyone?)
        CASE 
          WHEN COALESCE(persondays_of_central_liability_so_far, 0) > 0 
          THEN ROUND((COALESCE(women_persondays, 0)::NUMERIC 
                      / persondays_of_central_liability_so_far::NUMERIC) * 100, 2)
          ELSE 0
        END AS percent_women,
        CASE 
          WHEN COALESCE(persondays_of_central_liability_so_far, 0) > 0 
          THEN ROUND((COALESCE(sc_persondays, 0)::NUMERIC 
                      / persondays_of_central_liability_so_far::NUMERIC) * 100, 2)
          ELSE 0
        END AS percent_sc,
        CASE 
          WHEN COALESCE(persondays_of_central_liability_so_far, 0) > 0 
          THEN ROUND((COALESCE(st_persondays, 0)::NUMERIC 
                      / persondays_of_central_liability_so_far::NUMERIC) * 100, 2)
          ELSE 0
        END AS percent_st,
        
        FALSE AS is_latest_month
      FROM mgnrega_data
    `;
    
    const districtResult = await client.query(districtQuery);
    console.log(`   ✅ Calculated KPIs for ${districtResult.rowCount} district-month records`);

    // Step 2: Mark the latest month for each district
    console.log("   🏷️  Marking latest months...");
    await client.query(`
      UPDATE district_monthly_performance dmp
      SET is_latest_month = TRUE
      FROM (
        SELECT district_code, MAX(created_at) AS latest_date
        FROM district_monthly_performance
        GROUP BY district_code
      ) latest
      WHERE dmp.district_code = latest.district_code 
        AND dmp.created_at = latest.latest_date
    `);

    // Step 3: Calculate State-Level Averages
    console.log("   🗺️  Calculating state averages...");
    const stateQuery = `
      INSERT INTO state_monthly_averages (
        fin_year, month, state_code, state_name,
        avg_families_worked, avg_total_person_days, avg_on_time_payment_percent, 
        avg_total_expenditure, avg_completed_works, avg_ongoing_works,
        avg_hundred_day_completion_rate, avg_households_completed_100_days,
        avg_percent_women, avg_percent_sc, avg_percent_st
      )
      SELECT 
        fin_year,
        month,
        state_code,
        state_name,
        ROUND(AVG(families_worked)::NUMERIC, 2) AS avg_families_worked,
        ROUND(AVG(total_person_days)::NUMERIC, 0)::BIGINT AS avg_total_person_days,
        ROUND(AVG(on_time_payment_percent)::NUMERIC, 2) AS avg_on_time_payment_percent,
        ROUND(AVG(total_expenditure)::NUMERIC, 2) AS avg_total_expenditure,
        ROUND(AVG(completed_works)::NUMERIC, 2) AS avg_completed_works,
        ROUND(AVG(ongoing_works)::NUMERIC, 2) AS avg_ongoing_works,
        ROUND(AVG(hundred_day_completion_rate)::NUMERIC, 2) AS avg_hundred_day_completion_rate,
        ROUND(AVG(households_completed_100_days)::NUMERIC, 2) AS avg_households_completed_100_days,
        ROUND(AVG(percent_women)::NUMERIC, 2) AS avg_percent_women,
        ROUND(AVG(percent_sc)::NUMERIC, 2) AS avg_percent_sc,
        ROUND(AVG(percent_st)::NUMERIC, 2) AS avg_percent_st
      FROM district_monthly_performance
      GROUP BY fin_year, month, state_code, state_name
    `;
    
    const stateResult = await client.query(stateQuery);
    console.log(`   ✅ Calculated state averages for ${stateResult.rowCount} state-month records`);

    await client.query("COMMIT");
    console.log("✅ ETL Complete! All KPIs calculated and stored.");
    
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ ETL failed:", errorMessage);
    throw err;
  } finally {
    client.release();
  }
}
