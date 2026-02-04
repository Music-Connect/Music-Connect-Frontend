import { Express, Request, Response } from "express";
import axios from "axios";
import {
  ApiResponse,
  Usuario,
  WebExploreData,
  Avaliacao,
} from "../types/index";

export function setupArtistasRoutes(app: Express, backendUrl: string) {
  // Get all artists with filtering - Web optimized (SSR)
  app.get("/api/web/artistas", async (req: Request, res: Response) => {
    try {
      const { genero, local } = req.query;

      const params = new URLSearchParams();
      if (genero) params.append("genero", genero as string);
      if (local) params.append("local", local as string);

      const response = await axios.get<ApiResponse<Usuario[]>>(
        `${backendUrl}/api/artistas?${params.toString()}`,
      );

      const artistas = response.data.data || [];

      // Extract unique genres and locations for filters
      const generos = [
        ...new Set(artistas.map((a) => a.genero_musical).filter(Boolean)),
      ];
      const locais = [
        ...new Set(
          artistas
            .map((a) => `${a.cidade}, ${a.estado}`)
            .filter((c) => c !== ", "),
        ),
      ];

      const exploreData: WebExploreData = {
        artistas,
        filters: {
          generos: generos as string[],
          locais,
        },
        total: artistas.length,
      };

      res.json({
        success: true,
        data: exploreData,
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

  // Get artist by ID with complete data
  app.get("/api/web/artistas/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Fetch artist and all related data
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
          avaliacoes: avaliacoesResponse.data.data, // All for web
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
  app.post("/api/web/artistas", async (req: Request, res: Response) => {
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
  app.put("/api/web/artistas/:id", async (req: Request, res: Response) => {
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
