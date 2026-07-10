const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Direct connection (might require network with direct DB access)
const config = {
  host: 'db.bssaasbcxooihfjxbnzn.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '07039Suco2004$',
  ssl: { rejectUnauthorized: false }
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
