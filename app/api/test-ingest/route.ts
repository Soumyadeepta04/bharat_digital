import { NextResponse } from "next/server";

export async function GET() {
  try {
    const BASE_API_URL =
      "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?format=json&api-key=" +
      process.env.DATA_GOV_API_KEY;

    console.log("Fetching data from data.gov.in...");

    const res = await fetch(`${BASE_API_URL}&offset=0&limit=10`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    const records = data.records;

    console.log(`Fetched ${records.length} records`);

    // ✅ Return only the raw API response
    return NextResponse.json({
      success: true,
      total: records.length,
      data: records,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching data:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
