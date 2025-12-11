import type { Request, Response } from "express";
import db from "../config/database.js";

export async function createContract(req: Request, res: Response) {
  const {
    id_contratante,
    id_usuario,
    local_evento,
    data_evento,
    valor_servico,
    mensagem,
  } = req.body;

  const query = `
        INSERT INTO contrato (id_contratante, id_usuario, local_evento, data_evento, valor_servico, mensagem)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_contrato
    `;

  try {
    const result = await db.query(query, [
      id_contratante,
      id_usuario,
      local_evento,
      data_evento,
      valor_servico,
      mensagem,
    ]);
    return res.status(201).json({
      message: "Proposta de contrato enviada!",
      id: result.rows[0].id_contrato,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getContracts(req: Request, res: Response) {
  const { userId, type } = req.query;
  let query = "";

  if (type === "artista") {
    query = `
            SELECT c.*, u.usuario as nome_outro, u.imagem_perfil_url 
            FROM contrato c
            JOIN usuario u ON c.id_contratante = u.id_usuario
            WHERE c.id_usuario = $1
            ORDER BY c.id_contrato DESC
        `;
  } else {
    query = `
            SELECT c.*, u.usuario as nome_outro, u.imagem_perfil_url 
            FROM contrato c
            JOIN usuario u ON c.id_usuario = u.id_usuario
            WHERE c.id_contratante = $1
            ORDER BY c.id_contrato DESC
        `;
  }

  try {
    const result = await db.query(query, [userId]);
    return res.status(200).json(result.rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateContractStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query("UPDATE contrato SET status = $1 WHERE id_contrato = $2", [
      status,
      id,
    ]);
    return res.status(200).json({ message: `Contrato ${status}!` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getUserAgenda(req: Request, res: Response) {
  const { id } = req.params;

  const query = `
        SELECT id_contrato, local_evento, data_evento, valor_servico 
        FROM contrato 
        WHERE id_usuario = $1 
        AND status = 'Aceito' 
        ORDER BY data_evento ASC
    `;

  try {
    const result = await db.query(query, [id]);
    return res.status(200).json(result.rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
