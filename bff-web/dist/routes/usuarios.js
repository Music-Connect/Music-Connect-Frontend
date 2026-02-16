"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUsuariosRoutes = setupUsuariosRoutes;
const axios_1 = __importDefault(require("axios"));
function setupUsuariosRoutes(app, backendUrl) {
    // Get all users (for admin or search)
    app.get("/api/web/usuarios", async (req, res) => {
        try {
            const response = await axios_1.default.get(`${backendUrl}/api/usuarios`);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar usuários",
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
    // Get user profile with full data (web shows all)
    app.get("/api/web/usuarios/:id", async (req, res) => {
        try {
            const { id } = req.params;
            // Fetch all related data in parallel
            const [userResponse, avaliacoesResponse, mediaResponse] = await Promise.all([
                axios_1.default.get(`${backendUrl}/api/usuarios/${id}`),
                axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}`),
                axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}/media`),
            ]);
            // Full profile for web
            // Backend returns media_nota and total_avaliacoes in data object
            res.json({
                success: true,
                data: {
                    ...userResponse.data.data,
                    avaliacoes: avaliacoesResponse.data.data, // All reviews for web
                    media_avaliacoes: mediaResponse.data.data?.media_nota,
                    total_avaliacoes: mediaResponse.data.data?.total_avaliacoes,
                },
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar usuário",
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
    // Update user profile
    app.put("/api/web/usuarios/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios_1.default.put(`${backendUrl}/api/usuarios/${id}`, req.body);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao atualizar usuário",
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
    // Delete user
    app.delete("/api/web/usuarios/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios_1.default.delete(`${backendUrl}/api/usuarios/${id}`);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao deletar usuário",
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
