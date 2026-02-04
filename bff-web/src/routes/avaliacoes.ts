import { Express, Request, Response } from "express";
import axios from "axios";
import { ApiResponse, Avaliacao } from "../types/index";

export function setupAvaliacoesRoutes(app: Express, backendUrl: string) {
  // Get user reviews (all for web)
  app.get(
    "/api/web/avaliacoes/usuario/:id",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const response = await axios.get<ApiResponse<Avaliacao[]>>(
          `${backendUrl}/api/avaliacoes/usuario/${id}`,
        );

        res.json(response.data);
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
    "/api/web/avaliacoes/usuario/:id/media",
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
  app.post("/api/web/avaliacoes", async (req: Request, res: Response) => {
    try {
      const response = await axios.post<ApiResponse<Avaliacao>>(
        `${backendUrl}/api/avaliacoes`,
        req.body,
      );

      res.status(201).json(response.data);
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
