-- ===============================================
-- Drop existing tables (fresh start)
-- ===============================================
DROP TABLE IF EXISTS state_monthly_averages CASCADE;
DROP TABLE IF EXISTS district_monthly_performance CASCADE;
DROP TABLE IF EXISTS mgnrega_data CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ===============================================
-- MGNREGA Raw Data Table (Matches API Structure)
-- ===============================================

CREATE TABLE IF NOT EXISTS mgnrega_data (
  id SERIAL PRIMARY KEY,
  fin_year TEXT NOT NULL,
  month TEXT NOT NULL,
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,
  
  -- Raw API fields (exact field names from data.gov.in)
  approved_labour_budget NUMERIC,
  average_wage_rate_per_day_per_person NUMERIC,
  average_days_of_employment_provided_per_household NUMERIC,
  differently_abled_persons_worked INTEGER,
  material_and_skilled_wages NUMERIC,
  number_of_completed_works INTEGER,
  number_of_gps_with_nil_exp INTEGER,
  number_of_ongoing_works INTEGER,
  persondays_of_central_liability_so_far BIGINT,
  sc_persondays BIGINT,
  sc_workers_against_active_workers INTEGER,
  st_persondays BIGINT,
  st_workers_against_active_workers INTEGER,
  total_adm_expenditure NUMERIC,
  total_exp NUMERIC,
  total_households_worked INTEGER,
  total_individuals_worked INTEGER,
  total_no_of_active_job_cards INTEGER,
  total_no_of_active_workers INTEGER,
  total_no_of_hhs_completed_100_days_of_wage_employment INTEGER,
  total_no_of_jobcards_issued INTEGER,
  total_no_of_workers INTEGER,
  total_no_of_works_takenup INTEGER,
  wages NUMERIC,
  women_persondays BIGINT,
  percent_of_category_b_works NUMERIC,
  percent_of_expenditure_on_agriculture_allied_works NUMERIC,
  percent_of_nrm_expenditure NUMERIC,
  percentage_payments_gererated_within_15_days NUMERIC,
  remarks TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_mgnrega_entry UNIQUE (fin_year, month, state_code, district_code)
);

-- Optional index for faster lookups by state/district
CREATE INDEX IF NOT EXISTS idx_mgnrega_state_district
  ON mgnrega_data (state_name, district_name);

-- Trigger to auto-update 'updated_at' on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON mgnrega_data;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON mgnrega_data
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- District Monthly Performance (Calculated KPIs)
-- The "Ultimate Plan" - Answers 3 Questions
-- ===============================================

CREATE TABLE IF NOT EXISTS district_monthly_performance (
  id SERIAL PRIMARY KEY,
  fin_year TEXT NOT NULL,
  month TEXT NOT NULL,
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  district_name TEXT NOT NULL,

  -- Section 1: "काम मिला?" (Did We Get Work?) - 4 Hero KPIs
  families_worked INTEGER,                    -- कितने परिवारों को काम मिला?
  total_person_days BIGINT,                   -- कुल कितने दिन काम दिया गया?
  on_time_payment_percent DECIMAL(6,2),      -- समय पर भुगतान?
  total_expenditure DECIMAL(20,2),           -- कुल कितना पैसा खर्च हुआ? (in lakhs)

  -- Section 2: "काम पूरा हुआ?" (Is the Work Done?)
  completed_works INTEGER,                    -- पूरे हुए काम
  ongoing_works INTEGER,                      -- चल रहे काम
  hundred_day_completion_rate DECIMAL(6,2),  -- 100-दिन पूरा करने वाले परिवार %
  households_completed_100_days INTEGER,      -- कितने परिवारों ने 100 दिन पूरे किए

  -- Section 3: "क्या यह सबके लिए है?" (Is it Fair for Everyone?)
  percent_women DECIMAL(6,2),                -- महिलाएँ %
  percent_sc DECIMAL(6,2),                   -- SC %
  percent_st DECIMAL(6,2),                   -- ST %

  is_latest_month BOOLEAN DEFAULT FALSE,     -- Flag for quick "latest" queries
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_district_performance UNIQUE (fin_year, month, state_code, district_code)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_district_perf_lookup 
  ON district_monthly_performance (state_code, district_code, fin_year, month);

CREATE INDEX IF NOT EXISTS idx_district_perf_latest 
  ON district_monthly_performance (district_code, is_latest_month) 
  WHERE is_latest_month = TRUE;

-- ===============================================
-- State Monthly Averages (Pre-calculated for comparison)
-- ===============================================

CREATE TABLE IF NOT EXISTS state_monthly_averages (
  id SERIAL PRIMARY KEY,
  fin_year TEXT NOT NULL,
  month TEXT NOT NULL,
  state_code TEXT NOT NULL,
  state_name TEXT NOT NULL,

  -- Same KPIs as district table (state-level averages)
  avg_families_worked DECIMAL(12,2),
  avg_total_person_days BIGINT,
  avg_on_time_payment_percent DECIMAL(6,2),
  avg_total_expenditure DECIMAL(20,2),
  avg_completed_works DECIMAL(12,2),
  avg_ongoing_works DECIMAL(12,2),
  avg_hundred_day_completion_rate DECIMAL(6,2),
  avg_households_completed_100_days DECIMAL(12,2),
  avg_percent_women DECIMAL(6,2),
  avg_percent_sc DECIMAL(6,2),
  avg_percent_st DECIMAL(6,2),

  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_state_avg UNIQUE (fin_year, month, state_code)
);

CREATE INDEX IF NOT EXISTS idx_state_avg_lookup 
  ON state_monthly_averages (state_code, fin_year, month);