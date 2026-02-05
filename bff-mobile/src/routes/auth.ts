import { Express, Request, Response } from "express";
import axios from "axios";
import { BackendAuthResponse } from "../types/index";

export function setupAuthRoutes(app: Express, backendUrl: string) {
  // Login - Mobile optimized response
  app.post("/api/mobile/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios",
        });
        return;
      }

      const response = await axios.post<BackendAuthResponse>(
        `${backendUrl}/api/usuarios/auth/login`,
        { email, senha },
      );

      // eslint-disable-next-line no-console
      console.log(
        "[BFF] Backend login response:",
        JSON.stringify(response.data, null, 2),
      );
      // eslint-disable-next-line no-console
      console.log("[BFF] Token from backend:", response.data.token);

      // Mobile-optimized response
      res.json({
        success: true,
        data: {
          token: response.data.token,
          user: response.data.user,
          // Mobile-specific metadata
          loginTime: new Date().toISOString(),
          deviceType: "mobile",
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

  // Register - Mobile optimized
  app.post("/api/mobile/auth/register", async (req: Request, res: Response) => {
    try {
      const response = await axios.post<BackendAuthResponse>(
        `${backendUrl}/api/usuarios/auth/register`,
        req.body,
      );

      // eslint-disable-next-line no-console
      console.log(
        "[BFF] Backend register response:",
        JSON.stringify(response.data, null, 2),
      );
      // eslint-disable-next-line no-console
      console.log("[BFF] Token from backend:", response.data.token);

      res.status(201).json({
        success: true,
        data: {
          token: response.data.token,
          user: response.data.user,
          registeredAt: new Date().toISOString(),
        },
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

  // Logout (stateless, just for logging purposes)
  app.post("/api/mobile/auth/logout", (req: Request, res: Response) => {
    res.json({
      success: true,
      message: "Logout realizado com sucesso",
      timestamp: new Date().toISOString(),
    });
  });
}
