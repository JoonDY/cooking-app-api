const { Pool } = require('pg');

const connection = {
  development: new Pool(),
  production: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  }),
};

const db = process.env.DB_ENVIRONMENT || 'development';
const pool = connection[db];

module.exports = {
  query: (text, params) => pool.query(text, params),
};
