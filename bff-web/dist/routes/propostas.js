"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPropostasRoutes = setupPropostasRoutes;
const axios_1 = __importDefault(require("axios"));
function setupPropostasRoutes(app, backendUrl) {
    // Get received proposals (artist view)
    app.get("/api/web/propostas/recebidas", async (req, res) => {
        try {
            const { id_artista } = req.query;
            if (!id_artista) {
                res.status(400).json({
                    success: false,
                    error: "ID do artista é obrigatório",
                });
                return;
            }
            const response = await axios_1.default.get(`${backendUrl}/api/propostas/recebidas?id_artista=${id_artista}`);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar propostas",
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
    // Get sent proposals (contractor view)
    app.get("/api/web/propostas/enviadas", async (req, res) => {
        try {
            const { id_contratante } = req.query;
            if (!id_contratante) {
                res.status(400).json({
                    success: false,
                    error: "ID do contratante é obrigatório",
                });
                return;
            }
            const response = await axios_1.default.get(`${backendUrl}/api/propostas/enviadas?id_contratante=${id_contratante}`);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar propostas",
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
    // Get proposal by ID
    app.get("/api/web/propostas/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios_1.default.get(`${backendUrl}/api/propostas/${id}`);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao buscar proposta",
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
    // Create proposal
    app.post("/api/web/propostas", async (req, res) => {
        try {
            const response = await axios_1.default.post(`${backendUrl}/api/propostas`, req.body);
            res.status(201).json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao criar proposta",
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
    // Update proposal status
    app.put("/api/web/propostas/:id/status", async (req, res) => {
        try {
            const { id } = req.params;
            const response = await axios_1.default.put(`${backendUrl}/api/propostas/${id}/status`, req.body);
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao atualizar status",
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
