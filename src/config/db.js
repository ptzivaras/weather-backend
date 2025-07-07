const { Pool } = require('pg');

// Use environment variables for security
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'weatherdb',
});

module.exports = pool;

//TODO: Later, you’ll put the actual credentials in a .env file.