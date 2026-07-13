const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Direct connection (requires DB DNS + password from env or .env.local)
const config = {
  host: process.env.SUPABASE_DB_HOST || 'db.bssaasbcxooihfjxbnzn.supabase.co',
  port: parseInt(process.env.SUPABASE_DB_PORT || '5432', 10),
  database: process.env.SUPABASE_DB_NAME || 'postgres',
  user: process.env.SUPABASE_DB_USER || 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
}

if (!config.password) {
  console.error('ERROR: SUPABASE_DB_PASSWORD env var is required for direct DB migration.')
  console.error('Set it in your environment or .env.local (do NOT commit).')
  process.exit(1)
}

async function migrate() {
  console.log('Attempting direct DB connection...')
  const client = new Client(config)
  await client.connect()
  console.log('Connected!')

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
  const files = fs.readdirSync(migrationsDir).sort()

  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    console.log(`\nRunning: ${file}...`)
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'))
    let count = 0
    for (const stmt of statements) {
      try {
        await client.query(stmt + ';')
        count++
      } catch (err) {
        if (err.message.includes('already exists') || err.message.includes('duplicate key')) {
          // skip
        } else {
          console.error(`  ${err.message}`)
        }
      }
    }
    console.log(`  ${count} statements executed`)
  }

  console.log('\nAll done!')
  await client.end()
}

migrate().catch(err => console.error('Failed:', err.message))
