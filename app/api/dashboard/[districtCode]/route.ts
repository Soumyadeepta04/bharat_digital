import { NextResponse } from "next/server";
import { pool } from "@/data/postgres";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ districtCode: string }> } // ✅ Changed to Promise
) {
  try {
    const { districtCode } = await params; // ✅ Already has await

    // ✅ Get the LATEST financial year (by year value, not timestamp)
    const latestYearResult = await pool.query(
      `
      SELECT fin_year
      FROM district_monthly_performance 
      WHERE district_code = $1
      ORDER BY 
        SPLIT_PART(fin_year, '-', 1)::INTEGER DESC,
        SPLIT_PART(fin_year, '-', 2)::INTEGER DESC
      LIMIT 1
      `,
      [districtCode]
    );

    if (latestYearResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "District not found" },
        { status: 404 }
      );
    }

    const latestFinYear = latestYearResult.rows[0].fin_year;

    // ✅ Get latest month's KPIs from that financial year
    const latestKpisResult = await pool.query(
      `
      SELECT 
        fin_year, month, state_code, state_name, district_code, district_name,
        families_worked, total_person_days, on_time_payment_percent, total_expenditure,
        completed_works, ongoing_works, hundred_day_completion_rate,
        households_completed_100_days, percent_women, percent_sc, percent_st, created_at
      FROM district_monthly_performance 
      WHERE district_code = $1 AND fin_year = $2
      ORDER BY 
        CASE month
          WHEN 'Apr' THEN 1 WHEN 'May' THEN 2 WHEN 'Jun' THEN 3
          WHEN 'July' THEN 4 WHEN 'Aug' THEN 5 WHEN 'Sep' THEN 6
          WHEN 'Oct' THEN 7 WHEN 'Nov' THEN 8 WHEN 'Dec' THEN 9
          WHEN 'Jan' THEN 10 WHEN 'Feb' THEN 11 WHEN 'Mar' THEN 12
        END DESC
      LIMIT 1
      `,
      [districtCode, latestFinYear]
    );

    const latestKpis = latestKpisResult.rows[0];
    const stateCode = latestKpis.state_code;

    // ✅ Get all months from latest financial year (chronologically ordered)
    const historicalDataResult = await pool.query(
      `
      SELECT 
        fin_year, month, families_worked, total_person_days, on_time_payment_percent,
        total_expenditure, completed_works, ongoing_works, hundred_day_completion_rate,
        households_completed_100_days, percent_women, percent_sc, percent_st, created_at
      FROM district_monthly_performance 
      WHERE district_code = $1 AND fin_year = $2
      ORDER BY 
        CASE month
          WHEN 'Apr' THEN 1 WHEN 'May' THEN 2 WHEN 'Jun' THEN 3
          WHEN 'July' THEN 4 WHEN 'Aug' THEN 5 WHEN 'Sep' THEN 6
          WHEN 'Oct' THEN 7 WHEN 'Nov' THEN 8 WHEN 'Dec' THEN 9
          WHEN 'Jan' THEN 10 WHEN 'Feb' THEN 11 WHEN 'Mar' THEN 12
        END ASC
      `,
      [districtCode, latestFinYear]
    );

    // ✅ Get state averages for same financial year (chronologically ordered)
    const stateAverageDataResult = await pool.query(
      `
      SELECT 
        fin_year, month, avg_families_worked, avg_total_person_days,
        avg_on_time_payment_percent, avg_total_expenditure, avg_completed_works,
        avg_ongoing_works, avg_hundred_day_completion_rate, avg_households_completed_100_days,
        avg_percent_women, avg_percent_sc, avg_percent_st, created_at
      FROM state_monthly_averages 
      WHERE state_code = $1 AND fin_year = $2
      ORDER BY 
        CASE month
          WHEN 'Apr' THEN 1 WHEN 'May' THEN 2 WHEN 'Jun' THEN 3
          WHEN 'July' THEN 4 WHEN 'Aug' THEN 5 WHEN 'Sep' THEN 6
          WHEN 'Oct' THEN 7 WHEN 'Nov' THEN 8 WHEN 'Dec' THEN 9
          WHEN 'Jan' THEN 10 WHEN 'Feb' THEN 11 WHEN 'Mar' THEN 12
        END ASC
      `,
      [stateCode, latestFinYear]
    );

    return NextResponse.json({
      success: true,
      data: {
        latestKpis: latestKpis,
        historicalData: historicalDataResult.rows,
        stateAverageData: stateAverageDataResult.rows,
        metadata: {
          financial_year: latestFinYear,
          district_months_available: historicalDataResult.rows.length,
          state_months_available: stateAverageDataResult.rows.length,
          note: `Data for financial year ${latestFinYear}`
        }
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// ✅ Add this to disable caching
export const dynamic = 'force-dynamic';