import { Express, Request, Response } from "express";
import axios from "axios";
import {
  ApiResponse,
  Usuario,
  MobileUserProfile,
  Avaliacao,
  BackendMediaAvaliacoes,
} from "../types/index";

export function setupUsuariosRoutes(app: Express, backendUrl: string) {
  // Get current authenticated user (using cookie/token)
  app.get("/api/mobile/usuarios/me", async (req: Request, res: Response) => {
    try {
      // Forward both cookies AND Authorization header from mobile client to backend
      const cookies = req.headers.cookie || "";
      const authorization = req.headers.authorization || "";

      // eslint-disable-next-line no-console
      console.log(
        "[BFF] GET /usuarios/me - Authorization:",
        authorization ? `${authorization.substring(0, 30)}...` : "NONE",
      );

      const response = await axios.get<ApiResponse<Usuario>>(
        `${backendUrl}/api/usuarios/me`,
        {
          headers: {
            ...(cookies && { Cookie: cookies }),
            ...(authorization && { Authorization: authorization }),
          },
        },
      );

      // eslint-disable-next-line no-console
      console.log("[BFF] Backend response success:", response.data.success);

      // Return in mobile-friendly format
      res.json({
        success: true,
        data: {
          user: response.data.data,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao buscar usuário",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Get user profile with aggregated data (mobile optimized)
  app.get("/api/mobile/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Fetch user data and evaluations in parallel
      const [userResponse, avaliacoesResponse, mediaResponse] =
        await Promise.all([
          axios.get<ApiResponse<Usuario>>(`${backendUrl}/api/usuarios/${id}`),
          axios.get<ApiResponse<Avaliacao[]>>(
            `${backendUrl}/api/avaliacoes/usuario/${id}`,
          ),
          axios.get<ApiResponse<BackendMediaAvaliacoes>>(
            `${backendUrl}/api/avaliacoes/usuario/${id}/media`,
          ),
        ]);

      // Aggregate data for mobile
      // Backend returns media_nota and total_avaliacoes
      const mobileProfile: MobileUserProfile = {
        ...userResponse.data.data!,
        avaliacoes_recebidas: avaliacoesResponse.data.data?.slice(0, 5), // Only last 5 for mobile
        media_avaliacoes: mediaResponse.data.data?.media_nota,
        total_avaliacoes: mediaResponse.data.data?.total_avaliacoes,
      };

      res.json({
        success: true,
        data: mobileProfile,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao buscar usuário",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Update user profile
  app.put("/api/mobile/usuarios/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const authorization = req.headers.authorization || "";

      const response = await axios.put<ApiResponse<Usuario>>(
        `${backendUrl}/api/usuarios/${id}`,
        req.body,
        {
          headers: {
            ...(authorization && { Authorization: authorization }),
          },
        },
      );

      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao atualizar usuário",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Delete user
  app.delete(
    "/api/mobile/usuarios/:id",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const response = await axios.delete(`${backendUrl}/api/usuarios/${id}`);

        res.json(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao deletar usuário",
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
}
