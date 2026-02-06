import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { testConnection } from "./database.js";
import { verifyEmailConfig } from "./utils/emailService.js";

// Import routes
import usuariosRouter from "./routes/usuarios.js";
import artistasRouter from "./routes/artistas.js";
import propostasRouter from "./routes/propostas.js";
import avaliacoesRouter from "./routes/avaliacoes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());
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
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Global error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  },
);

// ============================================
// START SERVER
// ============================================

const startServer = async () => {
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error("❌ Falha ao conectar no banco de dados");
    process.exit(1);
  }

  // Check email configuration (non-blocking)
  const emailConfigured = await verifyEmailConfig();
  if (!emailConfigured) {
    console.warn(
      "⚠️  Email service not configured. Password reset emails will not be sent.",
    );
    console.warn(
      "   Configure EMAIL_USER and EMAIL_PASSWORD in .env to enable email functionality.",
    );
  }

  app.listen(PORT, () => {
    console.log(`✅ Backend rodando em http://localhost:${PORT}`);
  });
};

startServer();
