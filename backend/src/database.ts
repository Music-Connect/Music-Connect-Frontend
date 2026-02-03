import { Pool, type QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config(); // Isso carrega o arquivo .env que criamos no Passo 1

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    console.log("✅ Conectado ao banco de dados com sucesso!");
    client.release();
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    return false;
  }
};

export default pool;
