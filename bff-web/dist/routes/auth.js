"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuthRoutes = setupAuthRoutes;
const axios_1 = __importDefault(require("axios"));
function setupAuthRoutes(app, backendUrl) {
    // Login - Web optimized (cookies, sessions)
    app.post("/api/web/auth/login", async (req, res) => {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
                res.status(400).json({
                    success: false,
                    error: "Email e senha são obrigatórios",
                });
                return;
            }
            const response = await axios_1.default.post(`${backendUrl}/api/usuarios/auth/login`, { email, senha });
            // Web-optimized response (ready for Next.js server actions)
            // Backend returns { success, user, token } directly (not wrapped in data)
            res.json({
                success: true,
                data: {
                    token: response.data.token,
                    user: response.data.user,
                },
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao fazer login",
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
    // Register
    app.post("/api/web/auth/register", async (req, res) => {
        try {
            const { usuario, email, senha, tipo_usuario } = req.body;
            // Validate required fields
            if (!usuario || !email || !senha || !tipo_usuario) {
                res.status(400).json({
                    success: false,
                    error: "Campos obrigatórios: usuario, email, senha, tipo_usuario",
                });
                return;
            }
            const response = await axios_1.default.post(`${backendUrl}/api/usuarios/auth/register`, req.body);
            // Backend returns { success, user, token } directly (not wrapped in data)
            res.status(201).json({
                success: true,
                data: {
                    user: response.data.user,
                    token: response.data.token,
                },
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao registrar",
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
    // Session check (for Next.js middleware)
    app.get("/api/web/auth/session", async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                success: false,
                error: "Não autenticado",
            });
            return;
        }
        try {
            const response = await axios_1.default.get(`${backendUrl}/api/usuarios/me`, {
                headers: {
                    Authorization: authHeader,
                },
            });
            res.json({
                success: true,
                authenticated: true,
                user: response.data.data,
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Não autenticado",
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
    // Forgot Password
    app.post("/api/web/auth/forgot-password", async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({
                    success: false,
                    error: "Email é obrigatório",
                });
                return;
            }
            const response = await axios_1.default.post(`${backendUrl}/api/usuarios/auth/forgot-password`, { email });
            res.json({
                success: true,
                message: response.data.message ||
                    "Se o email existir, você receberá instruções para redefinir sua senha",
                ...(response.data.resetToken && {
                    resetToken: response.data.resetToken,
                }),
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error ||
                        "Erro ao solicitar recuperação de senha",
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
    // Reset Password
    app.post("/api/web/auth/reset-password", async (req, res) => {
        try {
            const { token, novaSenha } = req.body;
            if (!token || !novaSenha) {
                res.status(400).json({
                    success: false,
                    error: "Token e nova senha são obrigatórios",
                });
                return;
            }
            const response = await axios_1.default.post(`${backendUrl}/api/usuarios/auth/reset-password`, { token, novaSenha });
            res.json({
                success: true,
                message: response.data.message || "Senha alterada com sucesso",
            });
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao redefinir senha",
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
    // Verify Email
    app.post("/api/web/auth/verify-email", async (req, res) => {
        try {
            const { token } = req.body;
            if (!token) {
                res.status(400).json({
                    success: false,
                    error: "Token e obrigatorio",
                });
                return;
            }
            const response = await axios_1.default.post(`${backendUrl}/api/usuarios/auth/verify-email`, { token });
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao verificar email",
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
    // Resend Verification
    app.post("/api/web/auth/resend-verification", async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({
                    success: false,
                    error: "Email e obrigatorio",
                });
                return;
            }
            const response = await axios_1.default.post(`${backendUrl}/api/usuarios/auth/resend-verification`, { email });
            res.json(response.data);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                res.status(error.response.status).json({
                    success: false,
                    error: error.response.data.error || "Erro ao reenviar verificacao",
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
    // Logout
    app.post("/api/web/auth/logout", (req, res) => {
        // Limpa cookie httpOnly se existir
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        res.json({
            success: true,
            message: "Logout realizado com sucesso",
            instructions: "Por favor, limpe o token do localStorage no cliente",
        });
    });
}
