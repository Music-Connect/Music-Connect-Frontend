"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//@ts-ignore
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const usuarios_1 = require("./routes/usuarios");
const artistas_1 = require("./routes/artistas");
const propostas_1 = require("./routes/propostas");
const avaliacoes_1 = require("./routes/avaliacoes");
const dashboard_1 = require("./routes/dashboard");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3003;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
const corsOrigins = CORS_ORIGIN.split(",").map((origin) => origin.trim());
// Middleware
app.use((0, cors_1.default)({
    origin: corsOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "BFF Web is running",
        backend: BACKEND_URL,
        timestamp: new Date().toISOString(),
    });
});
// Setup routes - Web optimized (SSR/ISR friendly)
(0, auth_1.setupAuthRoutes)(app, BACKEND_URL);
(0, usuarios_1.setupUsuariosRoutes)(app, BACKEND_URL);
(0, artistas_1.setupArtistasRoutes)(app, BACKEND_URL);
(0, propostas_1.setupPropostasRoutes)(app, BACKEND_URL);
(0, avaliacoes_1.setupAvaliacoesRoutes)(app, BACKEND_URL);
(0, dashboard_1.setupDashboardRoutes)(app, BACKEND_URL);
app.listen(PORT, () => {
    console.log(`🌐 BFF Web running on port ${PORT}`);
    console.log(`🔗 Backend URL: ${BACKEND_URL}`);
});
