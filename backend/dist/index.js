import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { testConnection } from "./database.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "Backend is running" });
});
// Status
app.get("/api/status", async (req, res) => {
    const dbConnected = await testConnection();
    res.json({
        backend: "running",
        database: dbConnected ? "connected" : "disconnected",
        timestamp: new Date(),
    });
});
// Start Server
const startServer = async () => {
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error("❌ Falha ao conectar no banco de dados");
        process.exit(1);
    }
    app.listen(PORT, () => {
        console.log(`✅ Backend rodando em http://localhost:${PORT}`);
    });
};
startServer();
//# sourceMappingURL=index.js.map