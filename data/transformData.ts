import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { ingestData, RawAPIRecord } from "./ingestData";
import { pool } from "./postgres";
import { transformAndStorePerformanceData } from "./transformAndStorePerformanceData";

/**
 * The Ultimate Plan - Data Ingestion Pipeline
 * 
 * This file fetches raw MGNREGA data from data.gov.in API and stores it in PostgreSQL.
 * The ETL job then transforms this raw data into clean KPIs.
 */

const API_URL = `https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?format=json&api-key=${process.env.DATA_GOV_API_KEY}`;
const BATCH_SIZE = 1000;

interface APIResponse {
  records?: RawAPIRecord[];
  total?: number;
  count?: number;
}

/**
 * Fetches all data from the government API and stores it in the database
 * Then runs the ETL to calculate KPIs
 */
export async function fetchAndStoreAllData(): Promise<void> {
  console.log("🌐 Starting MGNREGA Data Ingestion Pipeline...");
  console.log(`   API: ${API_URL.substring(0, 80)}...`);
  
  let offset = 0;
  let totalIngested = 0;

  while (true) {
    const url = `${API_URL}&limit=${BATCH_SIZE}&offset=${offset}`;
    let records: RawAPIRecord[] = [];

    try {
      console.log(`   📡 Fetching batch at offset ${offset}...`);
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = (await res.json()) as APIResponse;
      records = data?.records ?? [];
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error(`   ❌ API fetch failed: ${errorMessage}`);
      break;
    }

    if (records.length === 0) {
      console.log("   ✅ No more records to fetch");
      break;
    }

    // Ingest this batch
    await ingestData(records);
    totalIngested += records.length;
    offset += BATCH_SIZE;

    console.log(`   � Batch ${Math.ceil(offset / BATCH_SIZE)} complete (${records.length} records)`);
    
    // Safety check: if we get less than BATCH_SIZE, we're probably done
    if (records.length < BATCH_SIZE) {
      console.log("   ✅ Last batch received");
      break;
    }
  }

  // Count total records
  const countRes = await pool.query("SELECT COUNT(*) FROM mgnrega_data");
  const totalRecords = countRes.rows[0].count;
  console.log(`\n📊 Total records in database: ${totalRecords}`);
  console.log(`   New records ingested this run: ${totalIngested}`);

  // Run ETL to calculate KPIs
  console.log("\n🔄 Running ETL to calculate KPIs...");
  await transformAndStorePerformanceData();
  
  console.log("\n✅ Pipeline Complete! Dashboard is ready.");
}

/**
 * Manual run (for testing)
 */
if (require.main === module) {
  (async () => {
    try {
      await fetchAndStoreAllData();
      process.exit(0);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ Pipeline failed:", errorMessage);
      process.exit(1);
    }
  })();
}
