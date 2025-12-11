import type { Request, Response } from "express";
import db from "../config/database.js";

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const {
    usuario,
    telefone,
    local_atuacao,
    descricao,
    organizacao,
    cor_tema,
    cor_banner,
  } = req.body;

  const queryUser = `
        UPDATE usuario 
        SET usuario = $1, telefone = $2, local_atuacao = $3, descricao = $4, cor_tema = $5, cor_banner = $6
        WHERE id_usuario = $7
    `;

  try {
    await db.query(queryUser, [
      usuario,
      telefone,
      local_atuacao,
      descricao,
      cor_tema,
      cor_banner,
      id,
    ]);

    if (organizacao) {
      const queryCon = `UPDATE contratante SET organizacao = $1 WHERE id_usuario = $2`;
      await db.query(queryCon, [organizacao, id]);
    }

    return res.status(200).json({
      message: "Perfil atualizado com sucesso!",
      user: { ...req.body, id_usuario: id },
    });
  } catch (error: any) {
    console.error("Erro ao atualizar usuario:", error);
    return res.status(500).json({ error: "Erro ao atualizar dados." });
  }
}

export async function getUsers(req: Request, res: Response) {
  const { type, search } = req.query;

  let query = `
        SELECT usuario.id_usuario, usuario, local_atuacao, imagem_perfil_url, descricao, tipo_usuario, organizacao 
        FROM usuario 
        LEFT JOIN contratante ON usuario.id_usuario = contratante.id_usuario 
        WHERE 1=1
    `;

  const params: any[] = [];
  let counter = 1;

  if (type) {
    query += ` AND tipo_usuario = $${counter}`;
    params.push(type);
    counter++;
  }

  if (search) {
    query += ` AND (usuario ILIKE $${counter} OR descricao ILIKE $${
      counter + 1
    })`;
    params.push(`%${search}%`, `%${search}%`);
    counter += 2;
  }

  try {
    const result = await db.query(query, params);
    return res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Erro na busca:", error);
    return res.status(500).json({ error: "Erro ao buscar usuários." });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM usuario WHERE id_usuario = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Conta excluída com sucesso!" });
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ error: "Erro ao excluir conta." });
  }
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;

  const query = `
        SELECT u.id_usuario, u.usuario, u.email, u.telefone, u.local_atuacao, 
               u.descricao, u.tipo_usuario, u.cor_tema, u.cor_banner,
               c.organizacao 
        FROM usuario u
        LEFT JOIN contratante c ON u.id_usuario = c.id_usuario 
        WHERE u.id_usuario = $1
    `;

  try {
    const result = await db.query(query, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });
    return res.status(200).json(result.rows[0]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
