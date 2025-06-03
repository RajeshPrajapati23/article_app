import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Pool, Client } = pg;

const { PG_HOST, PG_PORT, PG_USER, PG_PASSWORD, PG_DATABASE } = process.env;

// Set up the connection string for PostgreSQL
export const pool = new Pool({
  host: PG_HOST, // 'db.supabase.co'
  port: PG_PORT, // default PostgreSQL port
  user: PG_USER, // database username
  password: PG_PASSWORD, // database password
  database: PG_DATABASE, // database name
});

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL!"))
  .catch((err) => console.error("Connection error", err.stack));

export default pool;
