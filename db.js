import pg from "pg";
const { Pool } = pg;

let localPoolConfing = {
  user: "postgres",
  password: "1234",
  host: "localhost",
  port: "5432",
  database: "node_auth",
};

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : localPoolConfing;

const pool = new Pool(poolConfig);

export default pool;
