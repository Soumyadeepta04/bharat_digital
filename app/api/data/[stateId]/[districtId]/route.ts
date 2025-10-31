import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/data/postgres";
import { ingestData } from "@/data/ingestData";

// const API_URL = `https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?format=json&api-key=${process.env.DATA_GOV_API_KEY}`;
const API_URL = `https://api.data.gov.iource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?format=json&api-key=${process.env.DATA_GOV_API_KEY}`;

interface Params {
  stateId: string;
  districtId: string;
}

export async function GET(req: NextRequest, context: { params: Promise<Params> }) {
  const { stateId, districtId } = await context.params;

  if (!stateId || !districtId) {
    return NextResponse.json({ error: "State and district required" }, { status: 400 });
  }

  try {
    // 1️⃣ Try API first
    console.log(`🌍 Fetching from live API for ${stateId}/${districtId}...`);
    const url = `${API_URL}&limit=1000&filters[state_name]=${stateId}&filters[district_name]=${districtId}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    const records = data?.records || [];

    if (records.length > 0) {
      await ingestData(records);
      console.log(`💾 Stored ${records.length} new records from API.`);
      return NextResponse.json({ success: true, source: "api", data: records });
    }

    console.warn("⚠️ API returned no records, checking DB...");
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("⚠️ API fetch failed, using DB fallback:", errorMessage);
  }

  // 2️⃣ Fallback to DB (fetch all months, latest year first)
  try {
    const dbRes = await pool.query(
      `
      SELECT * FROM mgnrega_data
      WHERE state_name ILIKE $1 AND district_name ILIKE $2
      ORDER BY 
        fin_year DESC,
        CASE
          WHEN month ILIKE 'Jan%' THEN 1
          WHEN month ILIKE 'Feb%' THEN 2
          WHEN month ILIKE 'Mar%' THEN 3
          WHEN month ILIKE 'Apr%' THEN 4
          WHEN month ILIKE 'May%' THEN 5
          WHEN month ILIKE 'Jun%' THEN 6
          WHEN month ILIKE 'Jul%' THEN 7
          WHEN month ILIKE 'Aug%' THEN 8
          WHEN month ILIKE 'Sep%' THEN 9
          WHEN month ILIKE 'Oct%' THEN 10
          WHEN month ILIKE 'Nov%' THEN 11
          WHEN month ILIKE 'Dec%' THEN 12
          ELSE 13
        END ASC;
      `,
      [stateId, districtId]
    );

    if (dbRes.rows.length > 0) {
      console.log(`📦 Fetched ${dbRes.rows.length} records from DB for ${stateId}/${districtId}.`);
      return NextResponse.json({ success: true, source: "db", data: dbRes.rows });
    } else {
      return NextResponse.json({
        success: false,
        message: "No data available from API or DB.",
      });
    }
  } catch (dbErr: unknown) {
    const errorMessage = dbErr instanceof Error ? dbErr.message : "Unknown database error";
    console.error("❌ DB query failed:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
