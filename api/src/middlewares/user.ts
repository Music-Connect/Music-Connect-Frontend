import type { Request, Response, NextFunction } from "express";

export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password, confirmarSenha, usuario } = req.body;

  if (!email) {
    res.status(400).json({ error: "O email é obrigatório." });
    return;
  }
  if (!usuario) {
    res.status(400).json({ error: "O nome de usuário é obrigatório." });
    return;
  }
  if (!password) {
    res.status(400).json({ error: "A senha é obrigatória." });
    return;
  }
  if (password !== confirmarSenha) {
    res.status(400).json({ error: "As senhas não conferem." });
    return;
  }

  next();
}
