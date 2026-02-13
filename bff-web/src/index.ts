import express from "express";
//@ts-ignore

import cors from "cors";
import { setupAuthRoutes } from "./routes/auth";
import { setupUsuariosRoutes } from "./routes/usuarios";
import { setupArtistasRoutes } from "./routes/artistas";
import { setupPropostasRoutes } from "./routes/propostas";
import { setupAvaliacoesRoutes } from "./routes/avaliacoes";
import { setupDashboardRoutes } from "./routes/dashboard";

const app = express();
const PORT = process.env.PORT || 3003;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const corsOrigins = CORS_ORIGIN.split(",").map((origin) => origin.trim());

// Middleware
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "BFF Web is running",
    backend: BACKEND_URL,
    timestamp: new Date().toISOString(),
  });
});

// Setup routes - Web optimized (SSR/ISR friendly)
setupAuthRoutes(app, BACKEND_URL);
setupUsuariosRoutes(app, BACKEND_URL);
setupArtistasRoutes(app, BACKEND_URL);
setupPropostasRoutes(app, BACKEND_URL);
setupAvaliacoesRoutes(app, BACKEND_URL);
setupDashboardRoutes(app, BACKEND_URL);

app.listen(PORT, () => {
  console.log(`🌐 BFF Web running on port ${PORT}`);
  console.log(`🔗 Backend URL: ${BACKEND_URL}`);
});
