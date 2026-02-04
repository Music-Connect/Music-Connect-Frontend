import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.js";

export interface AuthRequest extends Request {
  user?: {
    id_usuario: number;
    email: string;
    tipo_usuario: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = req.cookies?.token;

    if (!token) {
      token = req.headers.authorization?.replace("Bearer ", "");
    }

    if (!token) {
      res.status(401).json({ success: false, error: "Token não fornecido" });
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Token inválido" });
  }
};
