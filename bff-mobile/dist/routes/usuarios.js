"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUsuariosRoutes = setupUsuariosRoutes;
const axios_1 = __importDefault(require("axios"));
function setupUsuariosRoutes(app, backendUrl) {
    // Get current authenticated user (using cookie/token)
    app.get("/api/mobile/usuarios/me", async (req, res) => {
        try {
            // Forward both cookies AND Authorization header from mobile client to backend
            const cookies = req.headers.cookie || "";
            const authorization = req.headers.authorization || "";
            // eslint-disable-next-line no-console
            console.log("[BFF] GET /usuarios/me - Authorization:", authorization ? `${authorization.substring(0, 30)}...` : "NONE");
            const response = await axios_1.default.get(`${backendUrl}/api/usuarios/me`, {
                headers: {
                    ...(cookies && { Cookie: cookies }),
                    ...(authorization && { Authorization: authorization }),
                },
            });
            // eslint-disable-next-line no-console
            console.log("[BFF] Backend response success:", response.data.success);
            // Return in mobile-friendly format
            res.json({
                success: true,
                data: {
                    user: response.data.data,
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
    // Get user profile with aggregated data (mobile optimized)
    app.get("/api/mobile/usuarios/:id", async (req, res) => {
        try {
            const { id } = req.params;
            // Fetch user data and evaluations in parallel
            const [userResponse, avaliacoesResponse, mediaResponse] = await Promise.all([
                axios_1.default.get(`${backendUrl}/api/usuarios/${id}`),
                axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}`),
                axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}/media`),
            ]);
            // Aggregate data for mobile
            // Backend returns media_nota and total_avaliacoes
            const mobileProfile = {
                ...userResponse.data.data,
                avaliacoes_recebidas: avaliacoesResponse.data.data?.slice(0, 5), // Only last 5 for mobile
                media_avaliacoes: mediaResponse.data.data?.media_nota,
                total_avaliacoes: mediaResponse.data.data?.total_avaliacoes,
            };
            res.json({
                success: true,
                data: mobileProfile,
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
    app.put("/api/mobile/usuarios/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const authorization = req.headers.authorization || "";
            const response = await axios_1.default.put(`${backendUrl}/api/usuarios/${id}`, req.body, {
                headers: {
                    ...(authorization && { Authorization: authorization }),
                },
            });
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
    app.delete("/api/mobile/usuarios/:id", async (req, res) => {
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
