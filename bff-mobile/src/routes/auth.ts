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
      console.log(
        "[BFF-MOBILE] Received registration request:",
        JSON.stringify(req.body, null, 2),
      );

      // Map mobile fields to backend expected fields
      const { nome, email, senha, tipo, telefone, ...rest } = req.body;

      console.log("[BFF-MOBILE] Extracted fields:", {
        nome,
        email,
        senha: "***",
        tipo,
        telefone,
      });

      // Validate required fields
      if (!nome || !email || !senha || !tipo) {
        console.error("[BFF-MOBILE] Validation failed - missing fields:", {
          nome: !!nome,
          email: !!email,
          senha: !!senha,
          tipo: !!tipo,
        });
        res.status(400).json({
          success: false,
          error: "Campos obrigatórios: nome, email, senha, tipo",
        });
        return;
      }

      // Transform data to match backend expectations
      const backendPayload = {
        usuario: nome, // Mobile sends 'nome', backend expects 'usuario'
        email,
        senha,
        tipo_usuario: tipo, // Mobile sends 'tipo', backend expects 'tipo_usuario'
        telefone,
        ...rest,
      };

      console.log("[BFF-MOBILE] Sending to backend:", {
        ...backendPayload,
        senha: "***",
      });

      const response = await axios.post<BackendAuthResponse>(
        `${backendUrl}/api/usuarios/auth/register`,
        backendPayload,
      );

      console.log(
        "[BFF-MOBILE] Backend register SUCCESS:",
        JSON.stringify(response.data, null, 2),
      );
      console.log("[BFF-MOBILE] Token from backend:", response.data.token);

      res.status(201).json({
        success: true,
        data: {
          token: response.data.token,
          user: response.data.user,
          registeredAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("[BFF-MOBILE] Registration error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("[BFF-MOBILE] Backend error response:", {
          status: error.response.status,
          data: error.response.data,
        });
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao registrar",
        });
      } else {
        console.error(
          "[BFF-MOBILE] Network or unknown error:",
          error instanceof Error ? error.message : error,
        );
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Forgot Password
  app.post(
    "/api/mobile/auth/forgot-password",
    async (req: Request, res: Response) => {
      try {
        const { email } = req.body;

        if (!email) {
          res.status(400).json({
            success: false,
            error: "Email é obrigatório",
          });
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/usuarios/auth/forgot-password`,
          { email },
        );

        res.json({
          success: true,
          message:
            response.data.message ||
            "Se o email existir, você receberá instruções para redefinir sua senha",
          ...(response.data.resetToken && {
            resetToken: response.data.resetToken,
          }),
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error:
              error.response.data.error ||
              "Erro ao solicitar recuperação de senha",
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Erro ao conectar com o servidor",
          });
        }
      }
    },
  );

  // Reset Password
  app.post(
    "/api/mobile/auth/reset-password",
    async (req: Request, res: Response) => {
      try {
        const { token, novaSenha } = req.body;

        if (!token || !novaSenha) {
          res.status(400).json({
            success: false,
            error: "Token e nova senha são obrigatórios",
          });
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/usuarios/auth/reset-password`,
          { token, novaSenha },
        );

        res.json({
          success: true,
          message: response.data.message || "Senha alterada com sucesso",
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao redefinir senha",
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Erro ao conectar com o servidor",
          });
        }
      }
    },
  );

  // Verify Email
  app.post(
    "/api/mobile/auth/verify-email",
    async (req: Request, res: Response) => {
      try {
        const { token } = req.body;

        if (!token) {
          res.status(400).json({
            success: false,
            error: "Token e obrigatorio",
          });
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/usuarios/auth/verify-email`,
          { token },
        );

        res.json(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao verificar email",
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Erro ao conectar com o servidor",
          });
        }
      }
    },
  );

  // Resend Verification
  app.post(
    "/api/mobile/auth/resend-verification",
    async (req: Request, res: Response) => {
      try {
        const { email } = req.body;

        if (!email) {
          res.status(400).json({
            success: false,
            error: "Email e obrigatorio",
          });
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/usuarios/auth/resend-verification`,
          { email },
        );

        res.json(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao reenviar verificacao",
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Erro ao conectar com o servidor",
          });
        }
      }
    },
  );

  // Logout (stateless, just for logging purposes)
  app.post("/api/mobile/auth/logout", (req: Request, res: Response) => {
    // Limpa cookie httpOnly se existir
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Logout realizado com sucesso",
      instructions: "Por favor, limpe o token do AsyncStorage no cliente",
      timestamp: new Date().toISOString(),
    });
  });
}
