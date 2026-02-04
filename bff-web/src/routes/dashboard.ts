import { Express, Request, Response } from "express";
import axios from "axios";
import {
  ApiResponse,
  Usuario,
  PropostaComDetalhes,
  WebDashboardData,
} from "../types/index";

export function setupDashboardRoutes(app: Express, backendUrl: string) {
  // Get aggregated dashboard data (for SSR)
  app.get("/api/web/dashboard", async (req: Request, res: Response) => {
    try {
      const { id, tipo } = req.query;

      if (!id || !tipo) {
        res.status(400).json({
          success: false,
          error: "ID e tipo de usuário são obrigatórios",
        });
        return;
      }

      // Fetch all dashboard data in parallel
      const propostas_url =
        tipo === "artista"
          ? `${backendUrl}/api/propostas/recebidas?id_artista=${id}`
          : `${backendUrl}/api/propostas/enviadas?id_contratante=${id}`;

      const [userResponse, propostasResponse, mediaResponse] =
        await Promise.all([
          axios.get<ApiResponse<Usuario>>(`${backendUrl}/api/usuarios/${id}`),
          axios.get<ApiResponse<PropostaComDetalhes[]>>(propostas_url),
          axios.get<ApiResponse<{ media: number; total: number }>>(
            `${backendUrl}/api/avaliacoes/usuario/${id}/media`,
          ),
        ]);

      const propostas = propostasResponse.data.data || [];

      // Aggregate dashboard data
      const dashboardData: WebDashboardData = {
        usuario: userResponse.data.data!,
        propostas_recentes: propostas.slice(0, 5), // Last 5
        stats: {
          total_propostas: propostas.length,
          propostas_pendentes: propostas.filter((p) => p.status === "pendente")
            .length,
          propostas_aceitas: propostas.filter((p) => p.status === "aceita")
            .length,
          media_avaliacoes: mediaResponse.data.data?.media,
        },
      };

      res.json({
        success: true,
        data: dashboardData,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error:
            error.response.data.error || "Erro ao buscar dados do dashboard",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Get explore page data (SSR optimized)
  app.get("/api/web/explore", async (req: Request, res: Response) => {
    try {
      const { genero, local } = req.query;

      const params = new URLSearchParams();
      if (genero) params.append("genero", genero as string);
      if (local) params.append("local", local as string);

      const response = await axios.get<ApiResponse<Usuario[]>>(
        `${backendUrl}/api/artistas?${params.toString()}`,
      );

      const artistas = response.data.data || [];

      // Extract filters for SSR
      const generos = [
        ...new Set(artistas.map((a) => a.genero_musical).filter(Boolean)),
      ];
      const locais = [
        ...new Set(
          artistas
            .filter((a) => a.cidade && a.estado)
            .map((a) => `${a.cidade}, ${a.estado}`),
        ),
      ];

      res.json({
        success: true,
        data: {
          artistas,
          filters: {
            generos,
            locais,
          },
          total: artistas.length,
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
}
