"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAvaliacoesRoutes = setupAvaliacoesRoutes;
const axios_1 = __importDefault(require("axios"));
function setupAvaliacoesRoutes(app, backendUrl) {
    // Get user reviews (limited for mobile)
    app.get("/api/mobile/avaliacoes/usuario/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { limit = 10 } = req.query;
            const response = await axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}`);
            const avaliacoes = response.data.data || [];
            const limitNum = parseInt(limit, 10);
            res.json({
                success: true,
                data: avaliacoes.slice(0, limitNum),
                meta: {
                    total: avaliacoes.length,
                    showing: Math.min(limitNum, avaliacoes.length),
                    hasMore: avaliacoes.length > limitNum,
                },
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar avaliações",
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: "Erro ao conectar com o servidor",
                });
            }
        }
    });
    // Get average rating
    app.get("/api/mobile/avaliacoes/usuario/:id/media", async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}/media`);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao calcular média",
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: "Erro ao conectar com o servidor",
                });
            }
        }
    });
    // Create review
    app.post("/api/mobile/avaliacoes", async (req, res) => {
        try {
            const authorization = req.headers.authorization || "";
            const response = await axios_1.default.post(`${backendUrl}/api/avaliacoes`, req.body, {
                headers: {
                    ...(authorization && { Authorization: authorization }),
                },
            });
            res.status(201).json({
                success: true,
                data: response.data.data,
                message: "Avaliação criada com sucesso!",
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao criar avaliação",
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: "Erro ao conectar com o servidor",
                });
            }
        }
    });
}
