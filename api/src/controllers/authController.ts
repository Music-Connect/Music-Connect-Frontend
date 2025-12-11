import type { Request, Response } from "express";
import db from "../config/database.js";
import { RegisterDataValidator } from "../utils/validators.js";

export async function registerContractor(req: Request, res: Response) {
  try {
    const {
      email,
      password,
      confirmarSenha,
      usuario,
      telefone,
      local,
      organizacao,
    } = req.body;

    RegisterDataValidator({ email, password, confirmarSenha, usuario });

    const queryUser = `
            INSERT INTO usuario (email, senha, usuario, telefone, local_atuacao, tipo_usuario) 
            VALUES ($1, $2, $3, $4, $5, 'contratante')
            RETURNING id_usuario
        `;

    const userResult = await db.query(queryUser, [
      email,
      password,
      usuario,
      telefone,
      local,
    ]);
    const newUserId = userResult.rows[0].id_usuario;

    const queryCon = `INSERT INTO contratante (id_usuario, organizacao) VALUES ($1, $2)`;
    await db.query(queryCon, [newUserId, organizacao]);

    return res.status(201).json({
      message: "Contratante cadastrado com sucesso!",
      user: { id: newUserId, email, usuario, organizacao },
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: error.message || "Erro desconhecido" });
  }
}

export async function registerArtist(req: Request, res: Response) {
  try {
    const { email, password, confirmarSenha, usuario, telefone, local } =
      req.body;

    RegisterDataValidator({ email, password, confirmarSenha, usuario });

    const query = `
            INSERT INTO usuario (email, senha, usuario, telefone, local_atuacao, tipo_usuario) 
            VALUES ($1, $2, $3, $4, $5, 'artista')
            RETURNING id_usuario
        `;

    const result = await db.query(query, [
      email,
      password,
      usuario,
      telefone,
      local,
    ]);

    return res.status(201).json({
      message: "Artista cadastrado com sucesso!",
      id: result.rows[0].id_usuario,
    });
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: error.message || "Erro desconhecido" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const query = `
        SELECT u.*, c.organizacao 
        FROM usuario u
        LEFT JOIN contratante c ON u.id_usuario = c.id_usuario
        WHERE u.email = $1 AND u.senha = $2
    `;

  try {
    const result = await db.query(query, [email, password]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        user: user,
        type: user.tipo_usuario,
      });
    }

    return res.status(401).json({ error: "Email ou senha incorretos." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
