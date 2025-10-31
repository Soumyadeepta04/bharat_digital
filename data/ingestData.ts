import { pool } from './postgres';
import { PoolClient } from 'pg';

/**
 * Interface matching the EXACT structure from data.gov.in API
 * Field names must match exactly (case-sensitive)
 */
export interface RawAPIRecord {
  fin_year: string;
  month: string;
  state_code: string;
  state_name: string;
  district_code: string;
  district_name: string;
  Approved_Labour_Budget: string | number;
  Average_Wage_rate_per_day_per_person: string | number;
  Average_days_of_employment_provided_per_Household: string | number;
  Differently_abled_persons_worked: string | number;
  Material_and_skilled_Wages: string | number;
  Number_of_Completed_Works: string | number;
  Number_of_Ongoing_Works: string | number;
  Number_of_GPs_with_NIL_exp: string | number;
  Persondays_of_Central_Liability_so_far: string | number;
  SC_persondays: string | number;
  SC_workers_against_active_workers: string | number;
  ST_persondays: string | number;
  ST_workers_against_active_workers: string | number;
  Total_Adm_Expenditure: string | number;
  Total_Exp: string | number;
  Total_Households_Worked: string | number;
  Total_Individuals_Worked: string | number;
  Total_No_of_Active_Job_Cards: string | number;
  Total_No_of_Active_Workers: string | number;
  Total_No_of_HHs_completed_100_Days_of_Wage_Employment: string | number;
  Total_No_of_JobCards_issued: string | number;
  Total_No_of_Workers: string | number;
  Total_No_of_Works_Takenup: string | number;
  Wages: string | number;
  Women_Persondays: string | number;
  percent_of_Category_B_Works: string | number;
  percent_of_Expenditure_on_Agriculture_Allied_Works: string | number;
  percent_of_NRM_Expenditure: string | number;
  percentage_payments_gererated_within_15_days: string | number;
  Remarks?: string;
}

/**
 * Safely parse a value to number, handling "NA" and invalid values
 */
function parseNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === '' || value === 'NA') {
    return null;
  }
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Ingests raw API records into the mgnrega_data table
 */
export async function ingestData(records: RawAPIRecord[]): Promise<void> {
  if (!records || records.length === 0) {
    console.log('⚠️  No records to ingest');
    return;
  }

  const client: PoolClient = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log(`📥 Ingesting ${records.length} records...`);

    const values: string[] = [];
    const params: (string | number | null)[] = [];

    records.forEach((rec, i) => {
      const baseIndex = i * 36;
      values.push(
        `(${Array.from({ length: 36 }, (_, j) => `$${baseIndex + j + 1}`).join(', ')})`
      );

      params.push(
        rec.fin_year,
        rec.month,
        rec.state_code,
        rec.state_name,
        rec.district_code,
        rec.district_name,
        parseNumber(rec.Approved_Labour_Budget),
        parseNumber(rec.Average_Wage_rate_per_day_per_person),
        parseNumber(rec.Average_days_of_employment_provided_per_Household),
        parseNumber(rec.Differently_abled_persons_worked),
        parseNumber(rec.Material_and_skilled_Wages),
        parseNumber(rec.Number_of_Completed_Works),
        parseNumber(rec.Number_of_Ongoing_Works),
        parseNumber(rec.Number_of_GPs_with_NIL_exp),
        parseNumber(rec.Persondays_of_Central_Liability_so_far),
        parseNumber(rec.SC_persondays),
        parseNumber(rec.SC_workers_against_active_workers),
        parseNumber(rec.ST_persondays),
        parseNumber(rec.ST_workers_against_active_workers),
        parseNumber(rec.Total_Adm_Expenditure),
        parseNumber(rec.Total_Exp),
        parseNumber(rec.Total_Households_Worked),
        parseNumber(rec.Total_Individuals_Worked),
        parseNumber(rec.Total_No_of_Active_Job_Cards),
        parseNumber(rec.Total_No_of_Active_Workers),
        parseNumber(rec.Total_No_of_HHs_completed_100_Days_of_Wage_Employment),
        parseNumber(rec.Total_No_of_JobCards_issued),
        parseNumber(rec.Total_No_of_Workers),
        parseNumber(rec.Total_No_of_Works_Takenup),
        parseNumber(rec.Wages),
        parseNumber(rec.Women_Persondays),
        parseNumber(rec.percent_of_Category_B_Works),
        parseNumber(rec.percent_of_Expenditure_on_Agriculture_Allied_Works),
        parseNumber(rec.percent_of_NRM_Expenditure),
        parseNumber(rec.percentage_payments_gererated_within_15_days),
        rec.Remarks || null
      );
    });

    const insertQuery = `
      INSERT INTO mgnrega_data (
        fin_year, month, state_code, state_name, district_code, district_name,
        approved_labour_budget, average_wage_rate_per_day_per_person, 
        average_days_of_employment_provided_per_household,
        differently_abled_persons_worked, material_and_skilled_wages, 
        number_of_completed_works, number_of_ongoing_works, number_of_gps_with_nil_exp,
        persondays_of_central_liability_so_far,
        sc_persondays, sc_workers_against_active_workers, 
        st_persondays, st_workers_against_active_workers,
        total_adm_expenditure, total_exp,
        total_households_worked, total_individuals_worked, 
        total_no_of_active_job_cards, total_no_of_active_workers, 
        total_no_of_hhs_completed_100_days_of_wage_employment,
        total_no_of_jobcards_issued, total_no_of_workers, total_no_of_works_takenup,
        wages, women_persondays, 
        percent_of_category_b_works, percent_of_expenditure_on_agriculture_allied_works,
        percent_of_nrm_expenditure, percentage_payments_gererated_within_15_days, 
        remarks
      )
      VALUES ${values.join(',')}
      ON CONFLICT (fin_year, month, state_code, district_code)
      DO UPDATE SET
        updated_at = NOW(),
        approved_labour_budget = EXCLUDED.approved_labour_budget,
        average_wage_rate_per_day_per_person = EXCLUDED.average_wage_rate_per_day_per_person,
        average_days_of_employment_provided_per_household = EXCLUDED.average_days_of_employment_provided_per_household,
        differently_abled_persons_worked = EXCLUDED.differently_abled_persons_worked,
        material_and_skilled_wages = EXCLUDED.material_and_skilled_wages,
        number_of_completed_works = EXCLUDED.number_of_completed_works,
        number_of_ongoing_works = EXCLUDED.number_of_ongoing_works,
        number_of_gps_with_nil_exp = EXCLUDED.number_of_gps_with_nil_exp,
        persondays_of_central_liability_so_far = EXCLUDED.persondays_of_central_liability_so_far,
        sc_persondays = EXCLUDED.sc_persondays,
        sc_workers_against_active_workers = EXCLUDED.sc_workers_against_active_workers,
        st_persondays = EXCLUDED.st_persondays,
        st_workers_against_active_workers = EXCLUDED.st_workers_against_active_workers,
        total_adm_expenditure = EXCLUDED.total_adm_expenditure,
        total_exp = EXCLUDED.total_exp,
        total_households_worked = EXCLUDED.total_households_worked,
        total_individuals_worked = EXCLUDED.total_individuals_worked,
        total_no_of_active_job_cards = EXCLUDED.total_no_of_active_job_cards,
        total_no_of_active_workers = EXCLUDED.total_no_of_active_workers,
        total_no_of_hhs_completed_100_days_of_wage_employment = EXCLUDED.total_no_of_hhs_completed_100_days_of_wage_employment,
        total_no_of_jobcards_issued = EXCLUDED.total_no_of_jobcards_issued,
        total_no_of_workers = EXCLUDED.total_no_of_workers,
        total_no_of_works_takenup = EXCLUDED.total_no_of_works_takenup,
        wages = EXCLUDED.wages,
        women_persondays = EXCLUDED.women_persondays,
        percent_of_category_b_works = EXCLUDED.percent_of_category_b_works,
        percent_of_expenditure_on_agriculture_allied_works = EXCLUDED.percent_of_expenditure_on_agriculture_allied_works,
        percent_of_nrm_expenditure = EXCLUDED.percent_of_nrm_expenditure,
        percentage_payments_gererated_within_15_days = EXCLUDED.percentage_payments_gererated_within_15_days,
        remarks = EXCLUDED.remarks;
    `;

    const result = await client.query(insertQuery, params);
    await client.query('COMMIT');
    console.log(`✅ Successfully ingested ${records.length} records (${result.rowCount} inserted/updated)`);
  } catch (err: unknown) {
    await client.query('ROLLBACK');
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('❌ Error ingesting data:', errorMessage);
    throw err;
  } finally {
    client.release();
  }
}
