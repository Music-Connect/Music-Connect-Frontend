"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupArtistasRoutes = setupArtistasRoutes;
const axios_1 = __importDefault(require("axios"));
function setupArtistasRoutes(app, backendUrl) {
    // Get all artists with filtering - Web optimized (SSR)
    app.get("/api/web/artistas", async (req, res) => {
        try {
            const { genero, local } = req.query;
            const params = new URLSearchParams();
            if (genero)
                params.append("genero", genero);
            if (local)
                params.append("local", local);
            const response = await axios_1.default.get(`${backendUrl}/api/artistas?${params.toString()}`);
            const artistas = response.data.data || [];
            // Extract unique genres and locations for filters
            const generos = [
                ...new Set(artistas.map((a) => a.genero_musical).filter(Boolean)),
            ];
            const locais = [
                ...new Set(artistas
                    .map((a) => `${a.cidade}, ${a.estado}`)
                    .filter((c) => c !== ", ")),
            ];
            const exploreData = {
                artistas,
                filters: {
                    generos: generos,
                    locais,
                },
                total: artistas.length,
            };
            res.json({
                success: true,
                data: exploreData,
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar artistas",
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
    // Get artist by ID with complete data
    app.get("/api/web/artistas/:id", async (req, res) => {
        try {
            const { id } = req.params;
            // Fetch artist and all related data
            const [artistaResponse, avaliacoesResponse, mediaResponse] = await Promise.all([
                axios_1.default.get(`${backendUrl}/api/artistas/${id}`),
                axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}`),
                axios_1.default.get(`${backendUrl}/api/avaliacoes/usuario/${id}/media`),
            ]);
            res.json({
                success: true,
                data: {
                    ...artistaResponse.data.data,
                    avaliacoes: avaliacoesResponse.data.data, // All for web
                    media_avaliacoes: mediaResponse.data.data?.media_nota,
                    total_avaliacoes: mediaResponse.data.data?.total_avaliacoes,
                },
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar artista",
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
    // Create artist profile
    app.post("/api/web/artistas", async (req, res) => {
        try {
            const response = await axios_1.default.post(`${backendUrl}/api/artistas`, req.body);
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
    app.put("/api/web/artistas/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios_1.default.put(`${backendUrl}/api/artistas/${id}`, req.body);
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
