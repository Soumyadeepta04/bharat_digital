import fs from "fs";
import path from "path";
import { Client } from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔌 Connecting to database...");
    await client.connect();
    console.log("✅ Connected!");

    const schemaPath = path.join(__dirname, "schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log("📝 Executing schema...");
    
    // Smart SQL statement splitting that handles dollar-quoted strings
    const statements = [];
    let current = "";
    let inDollarQuote = false;
    let dollarTag = "";
    
    const lines = schema.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comment-only lines
      if (trimmed.startsWith("--") && !inDollarQuote) {
        continue;
      }
      
      current += line + "\n";
      
      // Check for dollar-quote start/end
      const dollarMatches = line.match(/\$\$|\$[a-zA-Z_][a-zA-Z0-9_]*\$/g);
      if (dollarMatches) {
        for (const match of dollarMatches) {
          if (!inDollarQuote) {
            inDollarQuote = true;
            dollarTag = match;
          } else if (match === dollarTag) {
            inDollarQuote = false;
            dollarTag = "";
          }
        }
      }
      
      // Split on semicolon only if not in dollar-quote
      if (trimmed.endsWith(";") && !inDollarQuote) {
        const stmt = current.trim();
        if (stmt && !stmt.match(/^--/)) {
          statements.push(stmt);
        }
        current = "";
      }
    }
    
    console.log(`   Found ${statements.length} SQL statements\n`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await client.query(stmt);
        // Extract table/index/function name for display
        const match = stmt.match(/(?:TABLE|INDEX|FUNCTION|TRIGGER)\s+(?:IF NOT EXISTS\s+)?(?:OR REPLACE\s+)?(\w+)/i);
        const name = match ? match[1] : `Statement ${i + 1}`;
        console.log(`   ✓ Executed: ${name}`);
      } catch (err) {
        if (err.message.includes("already exists")) {
          const match = stmt.match(/(?:TABLE|INDEX|FUNCTION|TRIGGER)\s+(?:IF NOT EXISTS\s+)?(?:OR REPLACE\s+)?(\w+)/i);
          const name = match ? match[1] : `Statement ${i + 1}`;
          console.log(`   ⚠ Already exists: ${name}`);
        } else {
          console.error(`\n❌ Failed on statement ${i + 1}:`);
          console.error(stmt.substring(0, 200) + "...");
          throw err;
        }
      }
    }

    console.log("\n✅ Schema migrated successfully!");

    // Check created tables
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log("\n📋 Tables in database:");
    result.rows.forEach(row => console.log(`   ✓ ${row.tablename}`));

  } catch (error) {
    console.error("\n❌ Migration Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Disconnected from database");
  }
}

migrateSchema();
