import { Request, Response } from "express";
import pool from "../database.js";
import {
  Proposta,
  CreatePropostaDTO,
  UpdatePropostaStatusDTO,
  PropostaComDetalhes,
  ApiResponse,
} from "../types/index.js";
import { QueryResult } from "pg";

export const getMinhasPropostas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get user ID from auth middleware
    const userId = (req as any).user?.id_usuario;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    // Get both received and sent proposals
    const queryRecebidas = `
      SELECT 
        p.*,
        u.usuario as nome_outro,
        u.email as email_outro,
        u.imagem_perfil_url,
        'recebida' as tipo_proposta
      FROM propostas p
      LEFT JOIN usuarios u ON u.id_usuario = p.id_contratante
      WHERE p.id_artista = $1
      ORDER BY p.created_at DESC
    `;

    const queryEnviadas = `
      SELECT 
        p.*,
        u.usuario as nome_outro,
        u.email as email_outro,
        u.imagem_perfil_url,
        'enviada' as tipo_proposta
      FROM propostas p
      LEFT JOIN usuarios u ON u.id_usuario = p.id_artista
      WHERE p.id_contratante = $1
      ORDER BY p.created_at DESC
    `;

    const [resultRecebidas, resultEnviadas] = await Promise.all([
      pool.query<PropostaComDetalhes>(queryRecebidas, [userId]),
      pool.query<PropostaComDetalhes>(queryEnviadas, [userId]),
    ]);

    // Combine and sort by most recent
    const propostas = [...resultRecebidas.rows, ...resultEnviadas.rows].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const response: ApiResponse<{ propostas: PropostaComDetalhes[] }> = {
      success: true,
      data: {
        propostas,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar minhas propostas:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar propostas" });
  }
};

export const getPropostasRecebidas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user?.id_usuario;
    const { id_artista } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    if (id_artista !== undefined) {
      const requestedId = Number(id_artista);
      if (Number.isNaN(requestedId)) {
        res.status(400).json({
          success: false,
          error: "id_artista inválido",
        });
        return;
      }

      if (requestedId !== userId) {
        res.status(403).json({
          success: false,
          error: "Você não pode acessar propostas de outro artista",
        });
        return;
      }
    }

    const query = `
      SELECT 
        p.*,
        u.usuario as nome_outro,
        u.email as email_outro,
        u.imagem_perfil_url
      FROM propostas p
      LEFT JOIN usuarios u ON u.id_usuario = p.id_contratante
      WHERE p.id_artista = $1
      ORDER BY p.created_at DESC
    `;

    const result: QueryResult<PropostaComDetalhes> = await pool.query(query, [
      userId,
    ]);

    const publicPropostas = result.rows.map((row) => {
      const { email_contratante, email_artista, ...rest } = row as any;
      return rest;
    });

    const response: ApiResponse<
      Array<Omit<PropostaComDetalhes, "email_contratante" | "email_artista">>
    > = {
      success: true,
      data: publicPropostas,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar propostas recebidas:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao buscar propostas recebidas" });
  }
};

export const getPropostasEnviadas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = (req as any).user?.id_usuario;
    const { id_contratante } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    if (id_contratante !== undefined) {
      const requestedId = Number(id_contratante);
      if (Number.isNaN(requestedId)) {
        res.status(400).json({
          success: false,
          error: "id_contratante inválido",
        });
        return;
      }

      if (requestedId !== userId) {
        res.status(403).json({
          success: false,
          error: "Você não pode acessar propostas de outro contratante",
        });
        return;
      }
    }

    const query = `
      SELECT 
        p.*,
        u.usuario as nome_outro,
        u.email as email_outro,
        u.imagem_perfil_url
      FROM propostas p
      LEFT JOIN usuarios u ON u.id_usuario = p.id_artista
      WHERE p.id_contratante = $1
      ORDER BY p.created_at DESC
    `;

    const result: QueryResult<PropostaComDetalhes> = await pool.query(query, [
      userId,
    ]);

    const response: ApiResponse<PropostaComDetalhes[]> = {
      success: true,
      data: result.rows,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar propostas enviadas:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao buscar propostas enviadas" });
  }
};

export const getPropostaById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id_usuario;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    const query = `
      SELECT 
        p.*,
        a.usuario as nome_artista,
        a.email as email_artista,
        c.usuario as nome_contratante,
        c.email as email_contratante
      FROM propostas p
      LEFT JOIN usuarios a ON a.id_usuario = p.id_artista
      LEFT JOIN usuarios c ON c.id_usuario = p.id_contratante
      WHERE p.id_proposta = $1
        AND (p.id_artista = $2 OR p.id_contratante = $2)
    `;

    const result: QueryResult<PropostaComDetalhes> = await pool.query(query, [
      id,
      userId,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Proposta não encontrada",
      });
      return;
    }

    const response: ApiResponse<PropostaComDetalhes> = {
      success: true,
      data: result.rows[0],
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar proposta:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar proposta" });
  }
};

export const createProposta = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log(
      "[BACKEND] POST /api/propostas - Received data:",
      JSON.stringify(req.body, null, 2),
    );

    // ✅ ID do contratante vem do token, não do body!
    const id_contratante = (req as any).user?.id_usuario;

    if (!id_contratante) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    const {
      id_artista,
      titulo,
      descricao,
      local_evento,
      endereco_completo,
      tipo_evento,
      duracao_horas,
      publico_esperado,
      equipamento_incluso,
      nome_responsavel,
      telefone_contato,
      observacoes,
      data_evento,
      hora_evento,
      valor_oferecido,
    } = req.body;

    console.log("[BACKEND] Extracted fields:", {
      id_contratante,
      id_artista,
      titulo: !!titulo,
      descricao: !!descricao,
      local_evento: !!local_evento,
      data_evento: !!data_evento,
      hora_evento: hora_evento || "not provided",
      valor_oferecido: !!valor_oferecido,
    });

    if (
      !id_contratante ||
      !id_artista ||
      !titulo ||
      !descricao ||
      !local_evento ||
      !data_evento ||
      !valor_oferecido
    ) {
      console.error("[BACKEND] Validation failed - missing fields");
      res.status(400).json({
        success: false,
        error:
          "Campos obrigatórios: id_contratante, id_artista, titulo, descricao, local_evento, data_evento, valor_oferecido",
      });
      return;
    }

    // Verificar se artista existe
    console.log("[BACKEND] Checking if artist exists:", id_artista);
    const artistaCheck: QueryResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE id_usuario = $1 AND tipo_usuario = 'artista'",
      [id_artista],
    );

    if (artistaCheck.rows.length === 0) {
      console.error("[BACKEND] Artist not found:", id_artista);
      res.status(404).json({
        success: false,
        error: "Artista não encontrado",
      });
      return;
    }

    // Verificar se contratante existe (qualquer usuário que não seja o próprio artista)
    console.log("[BACKEND] Checking if contractor exists:", id_contratante);
    const contratanteCheck: QueryResult = await pool.query(
      "SELECT id_usuario, tipo_usuario FROM usuarios WHERE id_usuario = $1",
      [id_contratante],
    );

    if (contratanteCheck.rows.length === 0) {
      console.error("[BACKEND] Contractor (user) not found:", id_contratante);
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    // Verificar se o contratante não é o próprio artista
    if (id_contratante === id_artista) {
      console.error("[BACKEND] User cannot send proposal to themselves");
      res.status(400).json({
        success: false,
        error: "Você não pode enviar proposta para si mesmo",
      });
      return;
    }

    console.log(
      "[BACKEND] Contractor validated:",
      contratanteCheck.rows[0].tipo_usuario,
    );

    console.log("[BACKEND] Inserting proposal into database...");
    const result: QueryResult<Proposta> = await pool.query(
      `INSERT INTO propostas 
       (id_contratante, id_artista, titulo, descricao, local_evento, endereco_completo,
        tipo_evento, duracao_horas, publico_esperado, equipamento_incluso,
        nome_responsavel, telefone_contato, observacoes, data_evento, hora_evento, valor_oferecido, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'pendente')
       RETURNING *`,
      [
        id_contratante,
        id_artista,
        titulo,
        descricao,
        local_evento,
        endereco_completo || null,
        tipo_evento || null,
        duracao_horas || null,
        publico_esperado || null,
        equipamento_incluso || false,
        nome_responsavel || null,
        telefone_contato || null,
        observacoes || null,
        data_evento,
        hora_evento || null,
        valor_oferecido,
      ],
    );

    console.log(
      "[BACKEND] Proposal created successfully, ID:",
      result.rows[0].id_proposta,
    );
    const response: ApiResponse<Proposta> = {
      success: true,
      data: result.rows[0],
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("[BACKEND] ERROR creating proposal:", error);
    console.error(
      "[BACKEND] Error stack:",
      error instanceof Error ? error.stack : "N/A",
    );

    // Check if it's a database constraint error
    if (error && typeof error === "object" && "code" in error) {
      const pgError = error as any;
      if (pgError.code === "23503") {
        res.status(400).json({
          success: false,
          error: "Erro de referência: verifique se o artista existe",
        });
        return;
      }
      if (pgError.code === "23505") {
        res.status(400).json({
          success: false,
          error: "Proposta duplicada",
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar proposta",
    });
  }
};

export const updatePropostaStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id_usuario;
    const { status, mensagem_resposta }: UpdatePropostaStatusDTO = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    if (!status) {
      res.status(400).json({
        success: false,
        error: "Status é obrigatório",
      });
      return;
    }

    if (!["pendente", "aceita", "recusada", "cancelada"].includes(status)) {
      res.status(400).json({
        success: false,
        error: "Status inválido. Use: pendente, aceita, recusada ou cancelada",
      });
      return;
    }
    // ✅ NOVO: Buscar proposta e validar que o usuário é o artista
    const propostaCheck: QueryResult<Proposta> = await pool.query(
      "SELECT id_artista, id_contratante, status FROM propostas WHERE id_proposta = $1",
      [id],
    );

    if (propostaCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Proposta não encontrada",
      });
      return;
    }

    const proposta = propostaCheck.rows[0];

    // ✅ NOVO: Apenas o artista pode aceitar/recusar propostas
    if (proposta.id_artista !== userId) {
      res.status(403).json({
        success: false,
        error: "Apenas o artista pode aceitar ou recusar propostas",
      });
      return;
    }
    const result: QueryResult<Proposta> = await pool.query(
      `UPDATE propostas 
       SET status = $1, mensagem_resposta = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id_proposta = $3
       RETURNING *`,
      [status, mensagem_resposta, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Proposta não encontrada",
      });
      return;
    }

    const response: ApiResponse<Proposta> = {
      success: true,
      data: result.rows[0],
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao atualizar status da proposta:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao atualizar status da proposta" });
  }
};

/**
 * Get all pending proposals - used for public feed
 * No authentication required
 */
export const getAllPropostas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const query = `
      SELECT 
        p.*,
        c.usuario as nome_contratante,
        c.email as email_contratante,
        c.imagem_perfil_url as imagem_contratante,
        a.usuario as nome_artista,
        a.email as email_artista,
        a.imagem_perfil_url as imagem_artista
      FROM propostas p
      LEFT JOIN usuarios c ON c.id_usuario = p.id_contratante
      LEFT JOIN usuarios a ON a.id_usuario = p.id_artista
      ORDER BY p.created_at DESC
    `;

    const result: QueryResult<PropostaComDetalhes> = await pool.query(query);

    const response: ApiResponse<PropostaComDetalhes[]> = {
      success: true,
      data: result.rows,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar propostas" });
  }
};
