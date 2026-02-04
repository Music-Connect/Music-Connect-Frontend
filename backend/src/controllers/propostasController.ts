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

export const getPropostasRecebidas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id_artista } = req.query;

    if (!id_artista) {
      res.status(400).json({
        success: false,
        error: "id_artista é obrigatório",
      });
      return;
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
      id_artista,
    ]);

    const response: ApiResponse<PropostaComDetalhes[]> = {
      success: true,
      data: result.rows,
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
    const { id_contratante } = req.query;

    if (!id_contratante) {
      res.status(400).json({
        success: false,
        error: "id_contratante é obrigatório",
      });
      return;
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
      id_contratante,
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
    `;

    const result: QueryResult<PropostaComDetalhes> = await pool.query(query, [
      id,
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
    const {
      id_contratante,
      id_artista,
      titulo,
      descricao,
      local_evento,
      data_evento,
      valor_oferecido,
    }: CreatePropostaDTO = req.body;

    if (
      !id_contratante ||
      !id_artista ||
      !titulo ||
      !descricao ||
      !local_evento ||
      !data_evento ||
      !valor_oferecido
    ) {
      res.status(400).json({
        success: false,
        error:
          "Campos obrigatórios: id_contratante, id_artista, titulo, descricao, local_evento, data_evento, valor_oferecido",
      });
      return;
    }

    // Verificar se artista existe
    const artistaCheck: QueryResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE id_usuario = $1 AND tipo_usuario = 'artista'",
      [id_artista],
    );

    if (artistaCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Artista não encontrado",
      });
      return;
    }

    // Verificar se contratante existe
    const contratanteCheck: QueryResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE id_usuario = $1 AND tipo_usuario = 'contratante'",
      [id_contratante],
    );

    if (contratanteCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Contratante não encontrado",
      });
      return;
    }

    const result: QueryResult<Proposta> = await pool.query(
      `INSERT INTO propostas 
       (id_contratante, id_artista, titulo, descricao, local_evento, data_evento, valor_oferecido, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendente')
       RETURNING *`,
      [
        id_contratante,
        id_artista,
        titulo,
        descricao,
        local_evento,
        data_evento,
        valor_oferecido,
      ],
    );

    const response: ApiResponse<Proposta> = {
      success: true,
      data: result.rows[0],
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao criar proposta:", error);
    res.status(500).json({ success: false, error: "Erro ao criar proposta" });
  }
};

export const updatePropostaStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, mensagem_resposta }: UpdatePropostaStatusDTO = req.body;

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
