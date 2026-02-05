import { Express, Request, Response } from "express";
import axios from "axios";
import { ApiResponse, Avaliacao } from "../types/index";

export function setupAvaliacoesRoutes(app: Express, backendUrl: string) {
  // Get user reviews (limited for mobile)
  app.get(
    "/api/mobile/avaliacoes/usuario/:id",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { limit = 10 } = req.query;

        const response = await axios.get<ApiResponse<Avaliacao[]>>(
          `${backendUrl}/api/avaliacoes/usuario/${id}`,
        );

        const avaliacoes = response.data.data || [];
        const limitNum = parseInt(limit as string, 10);

        res.json({
          success: true,
          data: avaliacoes.slice(0, limitNum),
          meta: {
            total: avaliacoes.length,
            showing: Math.min(limitNum, avaliacoes.length),
            hasMore: avaliacoes.length > limitNum,
          },
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao buscar avaliações",
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

  // Get average rating
  app.get(
    "/api/mobile/avaliacoes/usuario/:id/media",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const response = await axios.get<
          ApiResponse<{ media: number; total: number }>
        >(`${backendUrl}/api/avaliacoes/usuario/${id}/media`);

        res.json(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao calcular média",
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

  // Create review
  app.post("/api/mobile/avaliacoes", async (req: Request, res: Response) => {
    try {
      const authorization = req.headers.authorization || "";

      const response = await axios.post<ApiResponse<Avaliacao>>(
        `${backendUrl}/api/avaliacoes`,
        req.body,
        {
          headers: {
            ...(authorization && { Authorization: authorization }),
          },
        },
      );

      res.status(201).json({
        success: true,
        data: response.data.data,
        message: "Avaliação criada com sucesso!",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao criar avaliação",
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
