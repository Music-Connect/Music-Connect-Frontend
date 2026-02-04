import { Express, Request, Response } from "express";
import axios from "axios";
import { ApiResponse, Usuario } from "../types/index";

export function setupAuthRoutes(app: Express, backendUrl: string) {
  // Login - Web optimized (cookies, sessions)
  app.post("/api/web/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios",
        });
        return;
      }

      const response = await axios.post<
        ApiResponse<{ user: Usuario; token: string }>
      >(`${backendUrl}/api/usuarios/auth/login`, { email, senha });

      // Web-optimized response (ready for Next.js server actions)
      res.json({
        success: true,
        data: {
          token: response.data.data?.token,
          user: response.data.data?.user,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao fazer login",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Register
  app.post("/api/web/auth/register", async (req: Request, res: Response) => {
    try {
      const response = await axios.post<
        ApiResponse<{ user: Usuario; token: string }>
      >(`${backendUrl}/api/usuarios/auth/register`, req.body);

      res.status(201).json({
        success: true,
        data: response.data.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao registrar",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Session check (for Next.js middleware)
  app.get("/api/web/auth/session", (req: Request, res: Response) => {
    // This would validate JWT token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: "Não autenticado",
      });
      return;
    }

    // In production, validate JWT here
    res.json({
      success: true,
      authenticated: true,
    });
  });

  // Logout
  app.post("/api/web/auth/logout", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Logout realizado com sucesso",
    });
  });
}
