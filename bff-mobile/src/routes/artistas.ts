import { Express, Request, Response } from "express";
import axios from "axios";
import { ApiResponse, Usuario, Avaliacao } from "../types/index";

export function setupArtistasRoutes(app: Express, backendUrl: string) {
  // Get all artists with mobile-optimized pagination
  app.get("/api/mobile/artistas", async (req: Request, res: Response) => {
    try {
      const { genero, local, limit = 20 } = req.query;

      const params = new URLSearchParams();
      if (genero) params.append("genero", genero as string);
      if (local) params.append("local", local as string);

      const response = await axios.get<ApiResponse<Usuario[]>>(
        `${backendUrl}/api/artistas?${params.toString()}`,
      );

      // Limit results for mobile (pagination)
      const artistas = response.data.data || [];
      const limitNum = parseInt(limit as string, 10);
      const paginatedArtistas = artistas.slice(0, limitNum);

      res.json({
        success: true,
        data: paginatedArtistas,
        meta: {
          total: artistas.length,
          limit: limitNum,
          hasMore: artistas.length > limitNum,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao buscar artistas",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Get artist by ID with reviews
  app.get("/api/mobile/artistas/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Fetch artist and reviews in parallel
      const [artistaResponse, avaliacoesResponse, mediaResponse] =
        await Promise.all([
          axios.get<ApiResponse<Usuario>>(`${backendUrl}/api/artistas/${id}`),
          axios.get<ApiResponse<Avaliacao[]>>(
            `${backendUrl}/api/avaliacoes/usuario/${id}`,
          ),
          axios.get<ApiResponse<{ media: number; total: number }>>(
            `${backendUrl}/api/avaliacoes/usuario/${id}/media`,
          ),
        ]);

      res.json({
        success: true,
        data: {
          ...artistaResponse.data.data,
          avaliacoes: avaliacoesResponse.data.data?.slice(0, 10), // Limit for mobile
          media_avaliacoes: mediaResponse.data.data?.media,
          total_avaliacoes: mediaResponse.data.data?.total,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao buscar artista",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Create artist profile
  app.post("/api/mobile/artistas", async (req: Request, res: Response) => {
    try {
      const response = await axios.post<ApiResponse<Usuario>>(
        `${backendUrl}/api/artistas`,
        req.body,
      );

      res.status(201).json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao criar artista",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Update artist profile
  app.put("/api/mobile/artistas/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await axios.put<ApiResponse<Usuario>>(
        `${backendUrl}/api/artistas/${id}`,
        req.body,
      );

      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao atualizar artista",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });
}
