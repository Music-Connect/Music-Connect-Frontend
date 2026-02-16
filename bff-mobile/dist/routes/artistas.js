"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupArtistasRoutes = setupArtistasRoutes;
const axios_1 = __importDefault(require("axios"));
function setupArtistasRoutes(app, backendUrl) {
    // Get all artists with mobile-optimized pagination
    app.get("/api/mobile/artistas", async (req, res) => {
        try {
            console.log("[BFF-MOBILE] GET /api/mobile/artistas - Query params:", req.query);
            const { genero, local, limit = 20 } = req.query;
            const params = new URLSearchParams();
            if (genero)
                params.append("genero", genero);
            if (local)
                params.append("local", local);
            console.log("[BFF-MOBILE] Requesting from backend:", `${backendUrl}/api/artistas?${params.toString()}`);
            const response = await axios_1.default.get(`${backendUrl}/api/artistas?${params.toString()}`);
            console.log("[BFF-MOBILE] Backend response received:", response.data.data?.length, "artistas");
            // Limit results for mobile (pagination)
            const artistas = response.data.data || [];
            const limitNum = parseInt(limit, 10);
            const paginatedArtistas = artistas.slice(0, limitNum);
            console.log("[BFF-MOBILE] Sending response with", paginatedArtistas.length, "artistas");
            res.json({
                success: true,
                data: {
                    artistas: paginatedArtistas,
                    total: artistas.length,
                },
                meta: {
                    total: artistas.length,
                    limit: limitNum,
                    hasMore: artistas.length > limitNum,
                },
            });
        }
        catch (error) {
            console.error("[BFF-MOBILE] Error fetching artistas:", error);
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error("[BFF-MOBILE] Backend error response:", error.response.data);
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar artistas",
                });
            }
            else {
                console.error("[BFF-MOBILE] Network or unknown error:", error instanceof Error ? error.message : error);
                res.status(500).json({
                    success: false,
                    error: "Erro ao conectar com o servidor",
                });
            }
        }
    });
    // Get artist by ID with reviews
    app.get("/api/mobile/artistas/:id", async (req, res) => {
        try {
            console.log("[BFF-MOBILE] GET /api/mobile/artistas/:id - ID:", req.params.id);
            const { id } = req.params;
            // Fetch artist and reviews in parallel
            const [artistaResponse, avaliacoesResponse, mediaResponse] = await Promise.all([
                axios_1.default.get(`${backendUrl}/api/artistas/${id}`),
                axios_1.default
                    .get(`${backendUrl}/api/avaliacoes/usuario/${id}`)
                    .catch(() => ({ data: { data: [] } })),
                axios_1.default
                    .get(`${backendUrl}/api/avaliacoes/usuario/${id}/media`)
                    .catch(() => ({
                    data: { data: { media_nota: 0, total_avaliacoes: 0 } },
                })),
            ]);
            console.log("[BFF-MOBILE] Artist data received:", artistaResponse.data.data);
            res.json({
                success: true,
                data: {
                    artista: {
                        ...artistaResponse.data.data,
                        avaliacoes: avaliacoesResponse.data.data?.slice(0, 10) || [], // Limit for mobile
                        media_avaliacoes: mediaResponse.data.data?.media_nota || 0,
                        total_avaliacoes: mediaResponse.data.data?.total_avaliacoes || 0,
                    },
                },
            });
        }
        catch (error) {
            console.error("[BFF-MOBILE] Error fetching artist details:", error);
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error("[BFF-MOBILE] Backend error response:", error.response.data);
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar artista",
                });
            }
            else {
                console.error("[BFF-MOBILE] Network or unknown error:", error instanceof Error ? error.message : error);
                res.status(500).json({
                    success: false,
                    error: "Erro ao conectar com o servidor",
                });
            }
        }
    });
    // Create artist profile
    app.post("/api/mobile/artistas", async (req, res) => {
        try {
            const authorization = req.headers.authorization || "";
            const response = await axios_1.default.post(`${backendUrl}/api/artistas`, req.body, {
                headers: {
                    ...(authorization && { Authorization: authorization }),
                },
            });
            res.status(201).json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao criar artista",
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
    // Update artist profile
    app.put("/api/mobile/artistas/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const authorization = req.headers.authorization || "";
            const response = await axios_1.default.put(`${backendUrl}/api/artistas/${id}`, req.body, {
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
                    error: error.response.data.error || "Erro ao atualizar artista",
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
