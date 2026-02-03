import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { testConnection } from "./database.js";

// Import routes
import usuariosRouter from "./routes/usuarios.js";
import artistasRouter from "./routes/artistas.js";
import propostasRouter from "./routes/propostas.js";
import avaliacoesRouter from "./routes/avaliacoes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// HEALTH & STATUS ROUTES
// ============================================

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.get("/api/status", async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    backend: "running",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date(),
  });
});

// ============================================
// API ROUTES
// ============================================

app.use("/api/usuarios", usuariosRouter);
app.use("/api/artistas", artistasRouter);
app.use("/api/propostas", propostasRouter);
app.use("/api/avaliacoes", avaliacoesRouter);

// ============================================
// START SERVER
// ============================================

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
