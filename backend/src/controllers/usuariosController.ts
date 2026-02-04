import { Request, Response } from "express";
import pool from "../database.js";
import {
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  LoginDTO,
  Usuario,
  AuthResponse,
  ApiResponse,
} from "../types/index.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
  removePasswordFromUser,
} from "../utils/auth.js";
import { QueryResult } from "pg";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha }: LoginDTO = req.body;

    if (!email || !senha) {
      res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios",
      });
      return;
    }

    const result: QueryResult<Usuario> = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
      return;
    }

    const user = result.rows[0];
    const isValidPassword = await comparePassword(senha, user.senha || "");

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
      return;
    }

    const userWithoutPassword = removePasswordFromUser(user);
    const token = generateToken(userWithoutPassword);

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response: AuthResponse = {
      success: true,
      user: userWithoutPassword,
      token, // Still send in response for backward compatibility
      type: user.tipo_usuario,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ success: false, error: "Erro ao fazer login" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      usuario,
      email,
      senha,
      tipo_usuario,
      descricao,
      telefone,
      cidade,
      estado,
      genero_musical,
    }: CreateUsuarioDTO = req.body;

    // Validações
    if (!usuario || !email || !senha || !tipo_usuario) {
      res.status(400).json({
        success: false,
        error: "Campos obrigatórios: usuario, email, senha, tipo_usuario",
      });
      return;
    }

    // Combinar cidade e estado em local
    const local =
      cidade && estado ? `${cidade}, ${estado}` : cidade || estado || null;

    if (!["artista", "contratante"].includes(tipo_usuario)) {
      res.status(400).json({
        success: false,
        error: 'tipo_usuario deve ser "artista" ou "contratante"',
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

    const hashedPassword = await hashPassword(senha);

    const result: QueryResult<Usuario> = await pool.query(
      `INSERT INTO usuarios 
       (nome, email, senha, tipo_usuario, bio, telefone, local, genero)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        usuario,
        email,
        hashedPassword,
        tipo_usuario,
        descricao || null,
        telefone || null,
        local,
        genero_musical || null,
      ],
    );

    const newUser = result.rows[0];
    const userWithoutPassword = removePasswordFromUser(newUser);
    const token = generateToken(userWithoutPassword);

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response: AuthResponse = {
      success: true,
      user: userWithoutPassword,
      token, // Still send in response for backward compatibility
      type: newUser.tipo_usuario,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Erro ao registrar:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao registrar usuário" });
  }
};

export const getAllUsuarios = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, tipo_usuario } = req.query;

    let query = "SELECT * FROM usuarios WHERE 1=1";
    const params: (string | undefined)[] = [];
    let paramCount = 1;

    if (search && typeof search === "string") {
      query += ` AND (usuario ILIKE $${paramCount} OR email ILIKE $${paramCount} OR cidade ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (tipo_usuario && typeof tipo_usuario === "string") {
      query += ` AND tipo_usuario = $${paramCount}`;
      params.push(tipo_usuario);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";

    const result: QueryResult<Usuario> = await pool.query(query, params);

    const usersWithoutPassword = result.rows.map((user) =>
      removePasswordFromUser(user),
    );

    const response: ApiResponse<Omit<Usuario, "senha">[]> = {
      success: true,
      data: usersWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar usuários" });
  }
};

export const getUsuarioById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const result: QueryResult<Usuario> = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    const userWithoutPassword = removePasswordFromUser(result.rows[0]);

    const response: ApiResponse<Omit<Usuario, "senha">> = {
      success: true,
      data: userWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar usuário" });
  }
};

export const updateUsuario = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const updates: UpdateUsuarioDTO = req.body;

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
      WHERE id_usuario = $${paramCount}
      RETURNING *
    `;

    const result: QueryResult<Usuario> = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    const userWithoutPassword = removePasswordFromUser(result.rows[0]);

    const response: ApiResponse<Omit<Usuario, "senha">> = {
      success: true,
      data: userWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res
      .status(500)
      .json({ success: false, error: "Erro ao atualizar usuário" });
  }
};

export const deleteUsuario = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const result: QueryResult = await pool.query(
      "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    const response: ApiResponse<null> = {
      success: true,
      message: "Usuário deletado com sucesso",
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ success: false, error: "Erro ao deletar usuário" });
  }
};
