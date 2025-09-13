require('dotenv').config();
const { Pool } = require('pg');

console.log('Environment check:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('\n🔄 Testing connection...');
    const client = await pool.connect();
    console.log('✅ Connected to database');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executed successfully');
    console.log('📅 Current time:', result.rows[0].now);
    
    client.release();
    console.log('✅ Connection released');
    
    await pool.end();
    console.log('✅ Pool closed');
    
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Error code:', err.code);
    console.error('Error details:', err);
  }
}

testConnection();



