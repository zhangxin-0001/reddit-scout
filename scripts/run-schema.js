const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase-schema.sql'), 'utf8')

const client = new Client({
  connectionString:
    'postgresql://postgres.qadifbfslxvptdrkxsdq:ZXmima.1213@aws-0-us-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
})

async function run() {
  try {
    await client.connect()
    console.log('Connected to Supabase')
    await client.query(sql)
    console.log('SQL schema executed successfully')

    const res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    )
    console.log('Tables:', res.rows.map((r) => r.table_name).join(', '))

    await client.end()
  } catch (err) {
    console.error('Failed:', err.message)
    process.exit(1)
  }
}

run()
