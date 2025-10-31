import { NextResponse } from "next/server";
import { pool } from "@/data/postgres";

export async function GET(){
  try{
    const result = await pool.query(`
      SELECT DISTINCT state_code, state_name
      FROM district_monthly_performance
      ORDER BY state_name
      `)

      return NextResponse.json({
        success: true,
        data: result.rows,
      })
  }catch(err: unknown){
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error fetching states:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}