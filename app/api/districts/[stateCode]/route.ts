import { NextResponse } from "next/server";
import { pool } from "@/data/postgres";

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ stateCode: string }> }
) {
  try {
    // ✅ Await params before accessing properties
    const { stateCode } = await params;
    
    const result = await pool.query(
      `
      SELECT DISTINCT district_code, district_name 
      FROM district_monthly_performance 
      WHERE state_code = $1
      ORDER BY district_name
      `,
      [stateCode]
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error: unknown) {
    console.error("Error fetching districts: ", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// ✅ Disable caching
export const dynamic = 'force-dynamic';