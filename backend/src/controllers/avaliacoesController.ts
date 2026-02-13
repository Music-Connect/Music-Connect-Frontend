import { Request, Response } from "express";
import pool from "../database.js";
import { Avaliacao, CreateAvaliacaoDTO, ApiResponse } from "../types/index.js";
import { QueryResult } from "pg";

export const getAvaliacoesByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        a.*,
        avaliador.usuario as nome_avaliador,
        avaliador.imagem_perfil_url as imagem_avaliador
      FROM avaliacoes a
      LEFT JOIN usuarios avaliador ON avaliador.id_usuario = a.id_avaliador
      WHERE a.id_avaliado = $1
      ORDER BY a.created_at DESC
    `;

    const result: QueryResult<Avaliacao> = await pool.query(query, [id]);

    const response: ApiResponse<Avaliacao[]> = {
      success: true,
      data: result.rows,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao buscar avaliações" });
  }
};

export const createAvaliacao = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // ✅ ID do avaliador vem do token, não do body!
    const id_avaliador = (req as any).user?.id_usuario;
    const { id_avaliado, nota, comentario } = req.body;

    if (!id_avaliador) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    if (!id_avaliado || !nota) {
      res.status(400).json({
        success: false,
        error: "Campos obrigatórios: id_avaliado, nota",
      });
      return;
    }

    if (nota < 1 || nota > 5) {
      res.status(400).json({
        success: false,
        error: "A nota deve estar entre 1 e 5",
      });
      return;
    }

    if (id_avaliador === id_avaliado) {
      res.status(400).json({
        success: false,
        error: "Você não pode avaliar a si mesmo",
      });
      return;
    }

    // Verificar se usuários existem
    const usuariosCheck: QueryResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE id_usuario IN ($1, $2)",
      [id_avaliador, id_avaliado],
    );

    if (usuariosCheck.rows.length < 2) {
      res.status(404).json({
        success: false,
        error: "Um ou ambos os usuários não foram encontrados",
      });
      return;
    }

    const relacaoCheck: QueryResult = await pool.query(
      `SELECT 1 FROM propostas
       WHERE status = 'aceita'
         AND ((id_contratante = $1 AND id_artista = $2)
           OR (id_contratante = $2 AND id_artista = $1))
       LIMIT 1`,
      [id_avaliador, id_avaliado],
    );

    if (relacaoCheck.rows.length === 0) {
      res.status(403).json({
        success: false,
        error: "Avaliacao permitida apenas entre usuarios com proposta aceita",
      });
      return;
    }

    const result: QueryResult<Avaliacao> = await pool.query(
      `INSERT INTO avaliacoes 
       (id_avaliador, id_avaliado, nota, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_avaliador, id_avaliado, nota, comentario || null],
    );

    const response: ApiResponse<Avaliacao> = {
      success: true,
      data: result.rows[0],
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    res.status(500).json({ success: false, error: "Erro ao criar avaliação" });
  }
};

export const getMediaAvaliacoes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        COUNT(*) as total_avaliacoes,
        ROUND(AVG(nota)::numeric, 1) as media_nota
      FROM avaliacoes
      WHERE id_avaliado = $1
    `;

    const result: QueryResult = await pool.query(query, [id]);

    const response: ApiResponse<{
      total_avaliacoes: number;
      media_nota: number;
    }> = {
      success: true,
      data: {
        total_avaliacoes: parseInt(result.rows[0].total_avaliacoes) || 0,
        media_nota: parseFloat(result.rows[0].media_nota) || 0,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao calcular média de avaliações:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao calcular média de avaliações" });
  }
};
