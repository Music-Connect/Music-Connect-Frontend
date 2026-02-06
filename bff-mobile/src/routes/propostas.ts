import { Express, Request, Response, NextFunction } from "express";
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
        const authorization = req.headers.authorization || "";

        if (!id_artista) {
          res.status(400).json({
            success: false,
            error: "ID do artista é obrigatório",
          });
          return;
        }

        const response = await axios.get<ApiResponse<PropostaComDetalhes[]>>(
          `${backendUrl}/api/propostas/recebidas?id_artista=${id_artista}`,
          {
            headers: {
              ...(authorization && { Authorization: authorization }),
            },
          },
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
        const authorization = req.headers.authorization || "";

        if (!id_contratante) {
          res.status(400).json({
            success: false,
            error: "ID do contratante é obrigatório",
          });
          return;
        }

        const response = await axios.get<ApiResponse<PropostaComDetalhes[]>>(
          `${backendUrl}/api/propostas/enviadas?id_contratante=${id_contratante}`,
          {
            headers: {
              ...(authorization && { Authorization: authorization }),
            },
          },
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

  // Get my proposals (current user)
  app.get("/api/mobile/propostas/me", async (req: Request, res: Response) => {
    try {
      // Forward Authorization header to backend
      const authorization = req.headers.authorization || "";

      // eslint-disable-next-line no-console
      console.log(
        "[BFF] GET /propostas/me - Authorization:",
        authorization ? `${authorization.substring(0, 30)}...` : "NONE",
      );

      // Since we can't determine user ID from token on BFF, we need to fetch from a backend endpoint
      // that uses the auth middleware to return current user's proposals
      const response = await axios.get<ApiResponse<{ propostas: any[] }>>(
        `${backendUrl}/api/propostas/minhas`,
        {
          headers: {
            ...(authorization && { Authorization: authorization }),
          },
        },
      );

      // eslint-disable-next-line no-console
      console.log(
        "[BFF] Backend /propostas/minhas response:",
        response.data.success,
      );

      // Map backend fields to mobile-expected format
      const rawPropostas =
        response.data.data?.propostas || response.data.data || [];
      const propostas = (Array.isArray(rawPropostas) ? rawPropostas : []).map(
        (p: any) => ({
          ...p,
          data: p.data_evento || p.data,
          local: p.local_evento || p.local,
          valor: p.valor_oferecido
            ? `R$ ${parseFloat(p.valor_oferecido).toFixed(2)}`
            : p.valor,
          contratante: p.nome_outro || p.contratante || "Desconhecido",
          hora: p.hora_evento ? p.hora_evento.substring(0, 5) : "--:--",
        }),
      );

      res.json({
        success: true,
        data: {
          propostas,
        },
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
  });

  // Get proposal by ID
  // NOTE: This must use 'next' to skip reserved route names that come after
  app.get(
    "/api/mobile/propostas/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const idStr = Array.isArray(id) ? id[0] : id;

      // Skip if id is a reserved route name (these routes are defined later)
      if (["recomendacoes", "me", "recebidas", "enviadas"].includes(idStr)) {
        return next();
      }

      try {
        const response = await axios.get<ApiResponse<PropostaComDetalhes>>(
          `${backendUrl}/api/propostas/${idStr}`,
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
    },
  );

  // Create proposal
  app.post("/api/mobile/propostas", async (req: Request, res: Response) => {
    try {
      console.log(
        "[BFF-MOBILE] POST /api/mobile/propostas - Received data:",
        JSON.stringify(req.body, null, 2),
      );
      const authorization = req.headers.authorization || "";

      console.log(
        "[BFF-MOBILE] Authorization header:",
        authorization ? `${authorization.substring(0, 50)}...` : "MISSING",
      );

      if (!authorization) {
        console.error("[BFF-MOBILE] Missing authorization header");
        res.status(401).json({
          success: false,
          error: "Token de autenticação é obrigatório",
        });
        return;
      }

      // Get current user to obtain id_contratante
      console.log(
        "[BFF-MOBILE] Fetching current user from:",
        `${backendUrl}/api/usuarios/me`,
      );

      let userResponse;
      try {
        userResponse = await axios.get<ApiResponse<any>>(
          `${backendUrl}/api/usuarios/me`,
          {
            headers: { Authorization: authorization },
          },
        );
      } catch (userError) {
        console.error("[BFF-MOBILE] Error fetching current user:", userError);
        if (axios.isAxiosError(userError) && userError.response) {
          console.error(
            "[BFF-MOBILE] Backend error response:",
            userError.response.data,
          );
          res.status(userError.response.status).json({
            success: false,
            error:
              userError.response.data.error || "Erro ao identificar usuário",
          });
        } else {
          res.status(500).json({
            success: false,
            error: "Não foi possível identificar o usuário",
          });
        }
        return;
      }

      console.log(
        "[BFF-MOBILE] User response structure:",
        JSON.stringify(userResponse.data, null, 2),
      );

      // The backend returns { success: true, data: { ...user } }
      const currentUser = userResponse.data.data;
      console.log(
        "[BFF-MOBILE] Current user:",
        currentUser?.id_usuario,
        currentUser?.usuario,
      );

      if (!currentUser || !currentUser.id_usuario) {
        console.error(
          "[BFF-MOBILE] Could not get current user. Response:",
          userResponse.data,
        );
        res.status(401).json({
          success: false,
          error: "Não foi possível identificar o usuário",
        });
        return;
      }

      // Map mobile fields to backend expected fields
      const {
        id_artista,
        titulo,
        descricao,
        local,
        endereco_completo,
        tipo_evento,
        duracao_horas,
        publico_esperado,
        equipamento_incluso,
        nome_responsavel,
        telefone_contato,
        observacoes,
        data,
        hora,
        valor,
      } = req.body;

      const backendPayload = {
        id_contratante: currentUser.id_usuario,
        id_artista: Number(id_artista),
        titulo: titulo || "Proposta",
        descricao: descricao || "",
        local_evento: local || "A definir",
        endereco_completo: endereco_completo || null,
        tipo_evento: tipo_evento || null,
        duracao_horas: duracao_horas ? Number(duracao_horas) : null,
        publico_esperado: publico_esperado ? Number(publico_esperado) : null,
        equipamento_incluso: equipamento_incluso || false,
        nome_responsavel: nome_responsavel || null,
        telefone_contato: telefone_contato || null,
        observacoes: observacoes || null,
        data_evento: data, // Should be in YYYY-MM-DD format
        hora_evento: hora || null,
        valor_oferecido: Number(valor),
      };

      console.log(
        "[BFF-MOBILE] Sending to backend:",
        JSON.stringify(backendPayload, null, 2),
      );

      const response = await axios.post<ApiResponse<PropostaComDetalhes>>(
        `${backendUrl}/api/propostas`,
        backendPayload,
        {
          headers: { Authorization: authorization },
        },
      );

      console.log("[BFF-MOBILE] Backend response:", response.data.success);

      res.status(201).json({
        success: true,
        data: { proposta: response.data.data },
      });
    } catch (error) {
      console.error("[BFF-MOBILE] Error creating proposal:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            "[BFF-MOBILE] Backend error response:",
            JSON.stringify(error.response.data, null, 2),
          );
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao criar proposta",
          });
        } else if (error.request) {
          console.error("[BFF-MOBILE] No response from backend");
          res.status(503).json({
            success: false,
            error:
              "Backend não está respondendo. Verifique se o serviço está rodando.",
          });
        } else {
          console.error("[BFF-MOBILE] Request setup error:", error.message);
          res.status(500).json({
            success: false,
            error: "Erro ao preparar requisição",
          });
        }
      } else {
        console.error(
          "[BFF-MOBILE] Unknown error:",
          error instanceof Error ? error.message : error,
        );
        res.status(500).json({
          success: false,
          error: "Erro inesperado ao criar proposta",
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
        const authorization = req.headers.authorization || "";

        const response = await axios.put<ApiResponse<PropostaComDetalhes>>(
          `${backendUrl}/api/propostas/${id}/status`,
          req.body,
          {
            headers: {
              ...(authorization && { Authorization: authorization }),
            },
          },
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

  // Get recommended proposals for feed (personalized discovery)
  app.get(
    "/api/mobile/propostas/recomendacoes",
    async (req: Request, res: Response) => {
      try {
        const authorization = req.headers.authorization || "";
        const {
          generos,
          local,
          tipo_evento,
          limit = "20",
          offset = "0",
        } = req.query;

        console.log("[BFF] GET /propostas/recomendacoes - Incoming request:", {
          hasAuthHeader: !!req.headers.authorization,
          authHeaderPreview: req.headers.authorization
            ? req.headers.authorization.substring(0, 40) + "..."
            : "MISSING",
          authorizationValue: authorization,
          authorizationLength: authorization.length,
          authorizationPreview: authorization
            ? authorization.substring(0, 40) + "..."
            : "EMPTY",
        });

        console.log("[BFF] GET /propostas/recomendacoes - Filters:", {
          generos,
          local,
          tipo_evento,
          limit,
          offset,
          hasAuth: !!authorization,
        });

        // Get current user to filter out their own proposals (optional)
        let currentUser = null;
        if (authorization && authorization.length > 0) {
          console.log("[BFF] Token present, fetching current user...");
          try {
            const userResponse = await axios.get<ApiResponse<any>>(
              `${backendUrl}/api/usuarios/me`,
              {
                headers: { Authorization: authorization },
              },
            );
            currentUser = userResponse.data.data;
            console.log("[BFF] Authenticated user:", currentUser?.id_usuario);
          } catch (error) {
            console.log(
              "[BFF] Could not authenticate user, showing public feed",
            );
            // Continue without authentication - show all proposals
          }
        } else {
          console.log("[BFF] No authentication provided, showing public feed");
        }

        // Fetch all pending proposals from artists endpoint
        // We'll filter by user type to show relevant proposals
        // For artists, show open proposals from contractors
        // For contractors, show open proposals from other contractors or artists looking for work
        let allProposals: any[] = [];

        try {
          // Get user's own genre preferences if they're an artist
          let userGenres: string[] = [];
          if (
            currentUser?.tipo_usuario === "artista" &&
            currentUser?.id_usuario
          ) {
            try {
              const artistResponse = await axios.get<ApiResponse<any>>(
                `${backendUrl}/api/artistas/${currentUser.id_usuario}`,
              );
              userGenres = artistResponse.data.data?.generos || [];
            } catch (error) {
              console.log(
                "[BFF] Could not fetch artist genres, continuing without filters",
              );
            }
          }

          // Fetch all proposals (we'll filter more specifically on backend later)
          // For now, we'll work with what we have
          console.log("[BFF] Fetching all proposals from backend:", {
            url: `${backendUrl}/api/propostas`,
            hasAuth: !!authorization,
            authPreview: authorization
              ? authorization.substring(0, 30) + "..."
              : "none",
          });

          console.log("[BFF] Calling backend /api/propostas with headers:", {
            url: `${backendUrl}/api/propostas`,
            hasAuthorization: !!authorization,
            authLength: authorization?.length || 0,
            authPreview: authorization
              ? authorization.substring(0, 40) + "..."
              : "EMPTY",
            headersToSend: authorization
              ? { Authorization: authorization }
              : "NO HEADERS",
          });

          const proposalsResponse = await axios.get<ApiResponse<any>>(
            `${backendUrl}/api/propostas`,
            {
              // Always include headers object, even if empty
              headers:
                authorization.length > 0
                  ? { Authorization: authorization }
                  : {},
            },
          );

          console.log("[BFF] Backend proposals response:", {
            success: proposalsResponse.data.success,
            proposalsCount: proposalsResponse.data.data?.length || 0,
            responseStatus: proposalsResponse.status,
          });

          allProposals = proposalsResponse.data.data || [];
        } catch (error) {
          console.error("[BFF] Error fetching proposals from backend:", {
            error: error instanceof Error ? error.message : String(error),
            isAxiosError: axios.isAxiosError(error),
            responseStatus: axios.isAxiosError(error)
              ? error.response?.status
              : "N/A",
            responseData: axios.isAxiosError(error)
              ? error.response?.data
              : "N/A",
            requestUrl: axios.isAxiosError(error) ? error.config?.url : "N/A",
            requestHeaders: axios.isAxiosError(error)
              ? error.config?.headers
              : "N/A",
          });
          allProposals = [];
        }

        // Filter proposals for feed:
        // 1. Only pending proposals
        // 2. Not created by current user (if authenticated)
        // 3. Match genre/location filters if provided
        const isArtist = currentUser?.tipo_usuario === "artista";

        let filteredProposals = allProposals.filter((p: any) => {
          // Only show pending proposals
          if (p.status !== "pendente") return false;

          // Don't show user's own proposals (if authenticated)
          if (currentUser) {
            if (p.id_contratante === currentUser.id_usuario) return false;
            if (p.id_artista === currentUser.id_usuario) return false;

            // If artist, only show proposals where they could be hired
            // (proposals without an assigned artist or open to applications)
            if (
              isArtist &&
              p.id_artista &&
              p.id_artista !== currentUser.id_usuario
            ) {
              return false;
            }
          }

          return true;
        });

        // Apply filters if provided
        if (generos && typeof generos === "string") {
          const generosList = generos
            .split(",")
            .map((g) => g.trim().toLowerCase());
          filteredProposals = filteredProposals.filter((p: any) => {
            // Match based on tipo_evento or future genre field
            const eventType = (p.tipo_evento || "").toLowerCase();
            return generosList.some((g) => eventType.includes(g));
          });
        }

        if (local && typeof local === "string") {
          const localSearch = local.toLowerCase();
          filteredProposals = filteredProposals.filter((p: any) => {
            const proposalLocal = (
              p.local_evento ||
              p.local ||
              ""
            ).toLowerCase();
            return proposalLocal.includes(localSearch);
          });
        }

        if (tipo_evento && typeof tipo_evento === "string") {
          const tipoSearch = tipo_evento.toLowerCase();
          filteredProposals = filteredProposals.filter((p: any) => {
            const proposalTipo = (p.tipo_evento || "").toLowerCase();
            return proposalTipo.includes(tipoSearch);
          });
        }

        // Sort by most recent first
        filteredProposals.sort((a: any, b: any) => {
          const dateA = new Date(a.data_criacao || 0).getTime();
          const dateB = new Date(b.data_criacao || 0).getTime();
          return dateB - dateA;
        });

        // Apply pagination
        const limitNum = parseInt(limit as string, 10);
        const offsetNum = parseInt(offset as string, 10);
        const paginatedProposals = filteredProposals.slice(
          offsetNum,
          offsetNum + limitNum,
        );

        // Format proposals for mobile
        const formattedProposals = paginatedProposals.map((p: any) => ({
          id_proposta: p.id_proposta,
          titulo: p.titulo || "Proposta sem título",
          descricao: p.descricao || "",
          valor_oferecido: p.valor_oferecido,
          status: p.status,
          data: p.data_evento || p.data,
          hora: p.hora_evento ? p.hora_evento.substring(0, 5) : "",
          local: p.local_evento || p.local || "Local não especificado",
          tipo_evento: p.tipo_evento || "Evento",
          data_criacao: p.data_criacao,
          contratante_nome: p.nome_contratante || "Contratante",
          contratante_id: p.id_contratante,
          // Additional feed-specific fields
          publico_esperado: p.publico_esperado,
          duracao_horas: p.duracao_horas,
        }));

        res.json({
          success: true,
          data: {
            propostas: formattedProposals,
            total: filteredProposals.length,
            limit: limitNum,
            offset: offsetNum,
            hasMore: offsetNum + limitNum < filteredProposals.length,
          },
        });
      } catch (error) {
        console.error("[BFF] Error in recomendacoes:", error);
        if (axios.isAxiosError(error) && error.response) {
          res.status(error.response.status).json({
            success: false,
            error: error.response.data.error || "Erro ao buscar recomendações",
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
