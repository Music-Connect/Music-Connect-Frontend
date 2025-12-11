import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "5432"),
});

db.on("connect", () => {
  console.log("Base de dados conectada com sucesso!");
});

db.on("error", (err) => {
  console.error("Erro inesperado no cliente do banco de dados", err);
  process.exit(-1);
});

export default db;
