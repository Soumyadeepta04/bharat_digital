import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const API_URL = `https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?format=json&api-key=${process.env.DATA_GOV_API_KEY}`;
const BATCH_SIZE = 1000;
const FETCH_TIMEOUT = 30000; // 30 seconds timeout

// Normalize month names to consistent 3-letter format
function normalizeMonth(month) {
  if (!month) return null;
  
  const monthMap = {
    // Full names to 3-letter
    'January': 'Jan', 'February': 'Feb', 'March': 'Mar',
    'April': 'Apr', 'May': 'May', 'June': 'Jun',
    'July': 'July', 'August': 'Aug', 'September': 'Sep',
    'October': 'Oct', 'November': 'Nov', 'December': 'Dec',
    // Lowercase variants
    'january': 'Jan', 'february': 'Feb', 'march': 'Mar',
    'april': 'Apr', 'may': 'May', 'june': 'Jun',
    'july': 'July', 'august': 'Aug', 'september': 'Sep',
    'october': 'Oct', 'november': 'Nov', 'december': 'Dec',
    // Already normalized (return as-is)
    'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar',
    'Apr': 'Apr', 'Jun': 'Jun',
    'Aug': 'Aug', 'Sep': 'Sep',
    'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dec'
  };
  
  return monthMap[month] || month;
}

async function fetchWithTimeout(url, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '' || value === 'NA') return null;
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

async function ingestData(records) {
  if (!records || records.length === 0) return 0;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const valueRows = [];
    const params = [];
    let paramIndex = 1;

    for (const rec of records) {
      const rowParams = [
        rec.fin_year, normalizeMonth(rec.month), rec.state_code, rec.state_name, rec.district_code, rec.district_name,
        parseNumber(rec.Approved_Labour_Budget), parseNumber(rec.Average_Wage_rate_per_day_per_person), 
        parseNumber(rec.Average_days_of_employment_provided_per_Household),
        parseNumber(rec.Differently_abled_persons_worked), parseNumber(rec.Material_and_skilled_Wages), 
        parseNumber(rec.Number_of_Completed_Works), parseNumber(rec.Number_of_Ongoing_Works), 
        parseNumber(rec.Number_of_GPs_with_NIL_exp), parseNumber(rec.Persondays_of_Central_Liability_so_far),
        parseNumber(rec.SC_persondays), parseNumber(rec.SC_workers_against_active_workers), 
        parseNumber(rec.ST_persondays), parseNumber(rec.ST_workers_against_active_workers),
        parseNumber(rec.Total_Adm_Expenditure), parseNumber(rec.Total_Exp),
        parseNumber(rec.Total_Households_Worked), parseNumber(rec.Total_Individuals_Worked), 
        parseNumber(rec.Total_No_of_Active_Job_Cards), parseNumber(rec.Total_No_of_Active_Workers), 
        parseNumber(rec.Total_No_of_HHs_completed_100_Days_of_Wage_Employment),
        parseNumber(rec.Total_No_of_JobCards_issued), parseNumber(rec.Total_No_of_Workers), 
        parseNumber(rec.Total_No_of_Works_Takenup), parseNumber(rec.Wages), parseNumber(rec.Women_Persondays), 
        parseNumber(rec.percent_of_Category_B_Works), parseNumber(rec.percent_of_Expenditure_on_Agriculture_Allied_Works),
        parseNumber(rec.percent_of_NRM_Expenditure), parseNumber(rec.percentage_payments_gererated_within_15_days), 
        rec.Remarks || null
      ];
      params.push(...rowParams);
      const placeholders = rowParams.map((_, i) => `$${paramIndex + i}`).join(',');
      valueRows.push(`(${placeholders})`);
      paramIndex += rowParams.length;
    }

    const insertQuery = `INSERT INTO mgnrega_data (fin_year, month, state_code, state_name, district_code, district_name, approved_labour_budget, average_wage_rate_per_day_per_person, average_days_of_employment_provided_per_household, differently_abled_persons_worked, material_and_skilled_wages, number_of_completed_works, number_of_ongoing_works, number_of_gps_with_nil_exp, persondays_of_central_liability_so_far, sc_persondays, sc_workers_against_active_workers, st_persondays, st_workers_against_active_workers, total_adm_expenditure, total_exp, total_households_worked, total_individuals_worked, total_no_of_active_job_cards, total_no_of_active_workers, total_no_of_hhs_completed_100_days_of_wage_employment, total_no_of_jobcards_issued, total_no_of_workers, total_no_of_works_takenup, wages, women_persondays, percent_of_category_b_works, percent_of_expenditure_on_agriculture_allied_works, percent_of_nrm_expenditure, percentage_payments_gererated_within_15_days, remarks) VALUES ${valueRows.join(',')} ON CONFLICT (fin_year, month, state_code, district_code) DO NOTHING`;

    const result = await client.query(insertQuery, params);
    await client.query('COMMIT');
    return result.rowCount || 0;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('   ❌ Database error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function calculateAllKPIsForBatch() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // Calculate KPIs for ALL new/updated records in one go
    const districtQuery = `
      INSERT INTO district_monthly_performance (
        fin_year, month, state_code, state_name, district_code, district_name,
        families_worked, total_person_days, on_time_payment_percent, total_expenditure,
        completed_works, ongoing_works, hundred_day_completion_rate, households_completed_100_days,
        percent_women, percent_sc, percent_st, is_latest_month
      )
      SELECT 
        fin_year, month, state_code, state_name, district_code, district_name,
        COALESCE(total_households_worked, 0) AS families_worked,
        COALESCE(persondays_of_central_liability_so_far, 0) AS total_person_days,
        LEAST(COALESCE(percentage_payments_gererated_within_15_days, 0), 100) AS on_time_payment_percent,
        COALESCE(total_exp, 0) AS total_expenditure,
        COALESCE(number_of_completed_works, 0) AS completed_works,
        COALESCE(number_of_ongoing_works, 0) AS ongoing_works,
        LEAST(
          CASE 
            WHEN NULLIF(total_households_worked, 0) IS NOT NULL 
            THEN ROUND((COALESCE(total_no_of_hhs_completed_100_days_of_wage_employment, 0)::NUMERIC / NULLIF(total_households_worked, 0)::NUMERIC) * 100, 2)
            ELSE 0
          END,
          100
        ) AS hundred_day_completion_rate,
        COALESCE(total_no_of_hhs_completed_100_days_of_wage_employment, 0) AS households_completed_100_days,
        LEAST(
          CASE 
            WHEN NULLIF(persondays_of_central_liability_so_far, 0) IS NOT NULL 
            THEN ROUND((COALESCE(women_persondays, 0)::NUMERIC / NULLIF(persondays_of_central_liability_so_far, 0)::NUMERIC) * 100, 2)
            ELSE 0
          END,
          100
        ) AS percent_women,
        LEAST(
          CASE 
            WHEN NULLIF(persondays_of_central_liability_so_far, 0) IS NOT NULL 
            THEN ROUND((COALESCE(sc_persondays, 0)::NUMERIC / NULLIF(persondays_of_central_liability_so_far, 0)::NUMERIC) * 100, 2)
            ELSE 0
          END,
          100
        ) AS percent_sc,
        LEAST(
          CASE 
            WHEN NULLIF(persondays_of_central_liability_so_far, 0) IS NOT NULL 
            THEN ROUND((COALESCE(st_persondays, 0)::NUMERIC / NULLIF(persondays_of_central_liability_so_far, 0)::NUMERIC) * 100, 2)
            ELSE 0
          END,
          100
        ) AS percent_st,
        FALSE AS is_latest_month
      FROM mgnrega_data
      ON CONFLICT (fin_year, month, state_code, district_code)
      DO UPDATE SET
        state_name = EXCLUDED.state_name,
        district_name = EXCLUDED.district_name,
        families_worked = EXCLUDED.families_worked,
        total_person_days = EXCLUDED.total_person_days,
        on_time_payment_percent = EXCLUDED.on_time_payment_percent,
        total_expenditure = EXCLUDED.total_expenditure,
        completed_works = EXCLUDED.completed_works,
        ongoing_works = EXCLUDED.ongoing_works,
        hundred_day_completion_rate = EXCLUDED.hundred_day_completion_rate,
        households_completed_100_days = EXCLUDED.households_completed_100_days,
        percent_women = EXCLUDED.percent_women,
        percent_sc = EXCLUDED.percent_sc,
        percent_st = EXCLUDED.percent_st
    `;
    
    const districtResult = await client.query(districtQuery);
    
    // Calculate state averages for ALL states/months in one go
    const stateQuery = `
      INSERT INTO state_monthly_averages (
        fin_year, month, state_code, state_name,
        avg_families_worked, avg_total_person_days, avg_on_time_payment_percent, 
        avg_total_expenditure, avg_completed_works, avg_ongoing_works,
        avg_hundred_day_completion_rate, avg_households_completed_100_days,
        avg_percent_women, avg_percent_sc, avg_percent_st
      )
      SELECT 
        fin_year, month, state_code, state_name,
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
      ON CONFLICT (fin_year, month, state_code)
      DO UPDATE SET
        state_name = EXCLUDED.state_name,
        avg_families_worked = EXCLUDED.avg_families_worked,
        avg_total_person_days = EXCLUDED.avg_total_person_days,
        avg_on_time_payment_percent = EXCLUDED.avg_on_time_payment_percent,
        avg_total_expenditure = EXCLUDED.avg_total_expenditure,
        avg_completed_works = EXCLUDED.avg_completed_works,
        avg_ongoing_works = EXCLUDED.avg_ongoing_works,
        avg_hundred_day_completion_rate = EXCLUDED.avg_hundred_day_completion_rate,
        avg_households_completed_100_days = EXCLUDED.avg_households_completed_100_days,
        avg_percent_women = EXCLUDED.avg_percent_women,
        avg_percent_sc = EXCLUDED.avg_percent_sc,
        avg_percent_st = EXCLUDED.avg_percent_st
    `;
    
    await client.query(stateQuery);
    await client.query("COMMIT");
    
    return districtResult.rowCount || 0;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function fetchAndStoreAllData() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 MGNREGA Data Ingestion & KPI Calculation Pipeline");
  console.log("⚡ Ultra-Fast Mode: Processing all 60K+ records");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  let offset = 0;
  let totalRecordsReceived = 0;
  let totalIngested = 0;
  let totalKPIsCalculated = 0;
  let batchNumber = 0;
  let consecutiveEmptyBatches = 0;

  while (true) {
    const url = `${API_URL}&limit=${BATCH_SIZE}&offset=${offset}`;
    
    try {
      batchNumber++;
      console.log(`\n📡 Batch ${batchNumber}: Fetching ${BATCH_SIZE} records (offset ${offset})...`);
      
      // Use fetch with timeout
      const res = await fetchWithTimeout(url);
      
      if (!res.ok) {
        console.log(`   └─ ⚠️  HTTP ${res.status}: ${res.statusText}`);
        offset += BATCH_SIZE;
        continue;
      }
      
      const data = await res.json();
      const records = data?.records ?? [];
      
      // Check for empty batches
      if (records.length === 0) {
        consecutiveEmptyBatches++;
        console.log(`   └─ ⚠️  Empty batch (${consecutiveEmptyBatches}/2)`);
        if (consecutiveEmptyBatches >= 2) {
          console.log(`\n✅ API has no more data to fetch\n`);
          break;
        }
        offset += BATCH_SIZE;
        continue;
      }

      consecutiveEmptyBatches = 0;
      totalRecordsReceived += records.length;
      console.log(`   └─ ✅ Received ${records.length} records from API`);
      
      // 🆕 Store records
      const insertedCount = await ingestData(records);
      totalIngested += insertedCount;
      
      const duplicateCount = records.length - insertedCount;
      
      console.log(`   └─ ✅ Inserted: ${insertedCount} new | Skipped: ${duplicateCount} duplicates`);
      
      // ⚡ FAST MODE: Skip KPI calculation if 100% duplicates
      if (insertedCount === 0) {
        console.log(`   └─ ⚡ Fast-forward (all duplicates)`);
        
        // Show progress summary every 10 batches to reduce console spam
        if (batchNumber % 10 === 0) {
          console.log(`\n� Progress: ${batchNumber} batches | ${totalRecordsReceived} received | ${totalIngested} stored | ${totalKPIsCalculated} KPIs\n`);
        }
        
        offset += BATCH_SIZE;
        continue; // Skip to next batch immediately
      }
      
      // 🆕 Calculate KPIs only for batches with new data
      console.log(`🧮 Calculating KPIs...`);
      try {
        const kpiCount = await calculateAllKPIsForBatch();
        totalKPIsCalculated += kpiCount;
        console.log(`   └─ ✅ KPIs updated: ${kpiCount} district-months`);
      } catch (err) {
        console.error(`   └─ ⚠️  KPI calculation failed: ${err.message}`);
      }
      
      // Show progress summary every 10 batches or when significant data inserted
      if (batchNumber % 10 === 0 || insertedCount > 100) {
        console.log(`\n📊 Progress: ${batchNumber} batches | ${totalRecordsReceived} received | ${totalIngested} stored | ${totalKPIsCalculated} KPIs\n`);
      }
      
      offset += BATCH_SIZE;
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error(`\n⏱️  Timeout at batch ${batchNumber} - API took too long to respond`);
        console.log(`   Skipping to next batch...\n`);
        offset += BATCH_SIZE;
        continue; // Try next batch instead of stopping
      }
      
      console.error(`\n❌ Error at batch ${batchNumber}: ${err.message}`);
      console.log(`   Skipping to next batch...\n`);
      offset += BATCH_SIZE;
      
      // Only stop after 5 consecutive errors
      consecutiveEmptyBatches++;
      if (consecutiveEmptyBatches >= 5) {
        console.log(`\n🛑 Too many consecutive errors. Stopping pipeline.\n`);
        break;
      }
      continue;
    }
  }

  // Final summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Pipeline Complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  const rawCount = await pool.query("SELECT COUNT(*) FROM mgnrega_data");
  const districtCount = await pool.query("SELECT COUNT(*) FROM district_monthly_performance");
  const stateCount = await pool.query("SELECT COUNT(*) FROM state_monthly_averages");
  
  console.log("📋 Final Database Status:");
  console.log(`   ✅ mgnrega_data: ${rawCount.rows[0].count} records`);
  console.log(`   ✅ district_monthly_performance: ${districtCount.rows[0].count} records`);
  console.log(`   ✅ state_monthly_averages: ${stateCount.rows[0].count} records\n`);
  
  console.log("🚀 Your Dashboard is Ready!");
  console.log("   Start server: npm run dev");
  console.log("   Test API: http://localhost:3000/api/states\n");
  
  await pool.end();
  process.exit(0);
}

fetchAndStoreAllData().catch((err) => {
  console.error("❌ Pipeline failed:", err.message);
  pool.end();
  process.exit(1);
});