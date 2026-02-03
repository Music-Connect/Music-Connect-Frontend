import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`✅ Query executada em ${duration}ms`);
        return result;
    }
    catch (error) {
        console.error("❌ Erro na query:", error);
        throw error;
    }
};
export const testConnection = async () => {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("✅ Conectado ao banco de dados");
        return true;
    }
    catch (error) {
        console.error("❌ Erro ao conectar no banco:", error);
        return false;
    }
};
export default pool;
//# sourceMappingURL=database.js.map