import { Express, Request, Response } from "express";
import axios from "axios";
import {
  ApiResponse,
  PropostaComDetalhes,
  MobilePropostaList,
} from "../types/index";

export function setupPropostasRoutes(app: Express, backendUrl: string) {
  // Get received proposals (artist view) - Mobile optimized
  app.get(
    "/api/mobile/propostas/recebidas",
    async (req: Request, res: Response) => {
      try {
        const { id_artista } = req.query;

        if (!id_artista) {
          res.status(400).json({
            success: false,
            error: "ID do artista é obrigatório",
          });
          return;
        }

        const response = await axios.get<ApiResponse<PropostaComDetalhes[]>>(
          `${backendUrl}/api/propostas/recebidas?id_artista=${id_artista}`,
        );

        const propostas = response.data.data || [];

        // Calculate statistics for mobile dashboard
        const mobileList: MobilePropostaList = {
          propostas,
          count: propostas.length,
          pendentes: propostas.filter((p) => p.status === "pendente").length,
          aceitas: propostas.filter((p) => p.status === "aceita").length,
          recusadas: propostas.filter((p) => p.status === "recusada").length,
        };

        res.json({
          success: true,
          data: mobileList,
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao buscar propostas",
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

  // Get sent proposals (contractor view) - Mobile optimized
  app.get(
    "/api/mobile/propostas/enviadas",
    async (req: Request, res: Response) => {
      try {
        const { id_contratante } = req.query;

        if (!id_contratante) {
          res.status(400).json({
            success: false,
            error: "ID do contratante é obrigatório",
          });
          return;
        }

        const response = await axios.get<ApiResponse<PropostaComDetalhes[]>>(
          `${backendUrl}/api/propostas/enviadas?id_contratante=${id_contratante}`,
        );

        const propostas = response.data.data || [];

        const mobileList: MobilePropostaList = {
          propostas,
          count: propostas.length,
          pendentes: propostas.filter((p) => p.status === "pendente").length,
          aceitas: propostas.filter((p) => p.status === "aceita").length,
          recusadas: propostas.filter((p) => p.status === "recusada").length,
        };

        res.json({
          success: true,
          data: mobileList,
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao buscar propostas",
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

  // Get proposal by ID
  app.get("/api/mobile/propostas/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await axios.get<ApiResponse<PropostaComDetalhes>>(
        `${backendUrl}/api/propostas/${id}`,
      );

      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao buscar proposta",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Create proposal
  app.post("/api/mobile/propostas", async (req: Request, res: Response) => {
    try {
      const response = await axios.post<ApiResponse<PropostaComDetalhes>>(
        `${backendUrl}/api/propostas`,
        req.body,
      );

      res.status(201).json({
        success: true,
        data: response.data.data,
        message: "Proposta criada com sucesso!",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error || "Erro ao criar proposta",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Erro ao conectar com o servidor",
        });
      }
    }
  });

  // Update proposal status (accept/reject)
  app.put(
    "/api/mobile/propostas/:id/status",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const response = await axios.put<ApiResponse<PropostaComDetalhes>>(
          `${backendUrl}/api/propostas/${id}/status`,
          req.body,
        );

        res.json({
          success: true,
          data: response.data.data,
          message: "Status atualizado com sucesso!",
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao atualizar status",
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
