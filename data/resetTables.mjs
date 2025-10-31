import dotenv from "dotenv";
dotenv.config();

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function resetTables() {
  try {
    console.log("🗑️  Clearing all tables...\n");
    
    await pool.query("TRUNCATE TABLE state_monthly_averages CASCADE");
    console.log("   ✅ Cleared state_monthly_averages");
    
    await pool.query("TRUNCATE TABLE district_monthly_performance CASCADE");
    console.log("   ✅ Cleared district_monthly_performance");
    
    await pool.query("TRUNCATE TABLE mgnrega_data CASCADE");
    console.log("   ✅ Cleared mgnrega_data");
    
    console.log("\n✅ All tables reset successfully!\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await pool.end();
  }
}

resetTables();
