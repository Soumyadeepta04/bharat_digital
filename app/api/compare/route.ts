import { NextResponse } from "next/server";
import { pool } from "@/data/postgres";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const d1 = searchParams.get("d1");
    const d2 = searchParams.get("d2");

    if (!d1 || !d2) {
      return NextResponse.json(
        {
          success: false,
          error: "Both d1 and d2 query parameters are required",
        },
        { status: 400 }
      );
    }

    // ✅ Get latest KPIs for both districts (using proper financial year logic)
    const result = await pool.query(
      `
      WITH latest_data AS (
        SELECT 
          district_code,
          district_name,
          state_name,
          fin_year,
          month,
          families_worked,
          total_person_days,
          on_time_payment_percent,
          total_expenditure,
          completed_works,
          ongoing_works,
          hundred_day_completion_rate,
          households_completed_100_days,
          percent_women,
          percent_sc,
          percent_st,
          created_at,
          ROW_NUMBER() OVER (
            PARTITION BY district_code 
            ORDER BY 
              SPLIT_PART(fin_year, '-', 1)::INTEGER DESC,
              SPLIT_PART(fin_year, '-', 2)::INTEGER DESC,
              CASE month
                WHEN 'Apr' THEN 1 WHEN 'May' THEN 2 WHEN 'Jun' THEN 3
                WHEN 'July' THEN 4 WHEN 'Aug' THEN 5 WHEN 'Sep' THEN 6
                WHEN 'Oct' THEN 7 WHEN 'Nov' THEN 8 WHEN 'Dec' THEN 9
                WHEN 'Jan' THEN 10 WHEN 'Feb' THEN 11 WHEN 'Mar' THEN 12
              END DESC
          ) as rn
        FROM district_monthly_performance 
        WHERE district_code IN ($1, $2)
      )
      SELECT 
        district_code,
        district_name,
        state_name,
        fin_year,
        month,
        families_worked,
        total_person_days,
        on_time_payment_percent,
        total_expenditure,
        completed_works,
        ongoing_works,
        hundred_day_completion_rate,
        households_completed_100_days,
        percent_women,
        percent_sc,
        percent_st,
        created_at
      FROM latest_data
      WHERE rn = 1
      ORDER BY district_code
    `,
      [d1, d2]
    );

    // Get first and second district data
    const district1Data = result.rows.find((row) => row.district_code === d1);
    const district2Data = result.rows.find((row) => row.district_code === d2);

    if (!district1Data || !district2Data) {
      return NextResponse.json(
        {
          success: false,
          error: "One or both districts not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        district1: district1Data,
        district2: district2Data,
      },
    });
  } catch (error: unknown) {
    console.error("Error comparing districts:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}