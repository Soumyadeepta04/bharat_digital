import { NextResponse } from "next/server";
import { fetchAndStoreAllData } from "@/cron";

export async function POST() {
  try {
    console.log("🧭 Manual ingestion triggered via API...");
    await fetchAndStoreAllData();
    return NextResponse.json({ success: true, message: "Manual ingestion completed." });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Manual ingestion failed:", errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}