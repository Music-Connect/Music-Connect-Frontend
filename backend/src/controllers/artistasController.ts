import { Request, Response } from "express";
import pool from "../database.js";
import { Usuario, ApiResponse, QueryParams } from "../types/index.js";
import { removePasswordFromUser } from "../utils/auth.js";
import { QueryResult } from "pg";

export const getAllArtistas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { genero, local, cidade, estado }: QueryParams = req.query;

    let query = "SELECT * FROM usuarios WHERE tipo_usuario = 'artista'";
    const params: string[] = [];
    let paramCount = 1;

    if (genero && typeof genero === "string") {
      query += ` AND genero_musical ILIKE $${paramCount}`;
      params.push(`%${genero}%`);
      paramCount++;
    }

    if (local && typeof local === "string") {
      query += ` AND (cidade ILIKE $${paramCount} OR estado ILIKE $${paramCount})`;
      params.push(`%${local}%`);
      paramCount++;
    }

    if (cidade && typeof cidade === "string") {
      query += ` AND cidade ILIKE $${paramCount}`;
      params.push(`%${cidade}%`);
      paramCount++;
    }

    if (estado && typeof estado === "string") {
      query += ` AND estado ILIKE $${paramCount}`;
      params.push(`%${estado}%`);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";

    const result: QueryResult<Usuario> = await pool.query(query, params);

    const artistasWithoutPassword = result.rows.map((artista) =>
      removePasswordFromUser(artista),
    );

    const response: ApiResponse<Omit<Usuario, "senha">[]> = {
      success: true,
      data: artistasWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar artistas:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar artistas" });
  }
};

export const getArtistaById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const result: QueryResult<Usuario> = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1 AND tipo_usuario = 'artista'",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Artista não encontrado",
      });
      return;
    }

    const artistaWithoutPassword = removePasswordFromUser(result.rows[0]);

    const response: ApiResponse<Omit<Usuario, "senha">> = {
      success: true,
      data: artistaWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar artista:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar artista" });
  }
};

export const createArtista = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      usuario,
      email,
      senha,
      descricao,
      telefone,
      cidade,
      estado,
      genero_musical,
    } = req.body;

    if (!usuario || !email || !senha) {
      res.status(400).json({
        success: false,
        error: "Campos obrigatórios: usuario, email, senha",
      });
      return;
    }

    // Verificar se email já existe
    const emailCheck: QueryResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE email = $1",
      [email],
    );

    if (emailCheck.rows.length > 0) {
      res.status(400).json({
        success: false,
        error: "Email já cadastrado",
      });
      return;
    }

    const result: QueryResult<Usuario> = await pool.query(
      `INSERT INTO usuarios 
       (usuario, email, senha, tipo_usuario, descricao, telefone, cidade, estado, genero_musical)
       VALUES ($1, $2, $3, 'artista', $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        usuario,
        email,
        senha,
        descricao || null,
        telefone || null,
        cidade || null,
        estado || null,
        genero_musical || null,
      ],
    );

    const artistaWithoutPassword = removePasswordFromUser(result.rows[0]);

    const response: ApiResponse<Omit<Usuario, "senha">> = {
      success: true,
      data: artistaWithoutPassword,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao criar artista:", error);
    res.status(500).json({ success: false, error: "Erro ao criar artista" });
  }
};

export const updateArtista = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updates = req.body;

    const allowedFields = [
      "usuario",
      "descricao",
      "telefone",
      "cidade",
      "estado",
      "genero_musical",
      "cor_tema",
      "cor_banner",
      "imagem_perfil_url",
    ];

    const updateFields: string[] = [];
    const values: (string | number | undefined | null)[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value as string | number | undefined | null);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      res.status(400).json({
        success: false,
        error: "Nenhum campo válido para atualizar",
      });
      return;
    }

    values.push(parseInt(id));

    const query = `
      UPDATE usuarios 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id_usuario = $${paramCount} AND tipo_usuario = 'artista'
      RETURNING *
    `;

    const result: QueryResult<Usuario> = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Artista não encontrado",
      });
      return;
    }

    const artistaWithoutPassword = removePasswordFromUser(result.rows[0]);

    const response: ApiResponse<Omit<Usuario, "senha">> = {
      success: true,
      data: artistaWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao atualizar artista:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao atualizar artista" });
  }
};
