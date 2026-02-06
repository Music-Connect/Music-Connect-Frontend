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

    console.log(
      "[AUTH-MIDDLEWARE] Token present:",
      !!token,
      token ? `${token.substring(0, 30)}...` : "NONE",
    );

    if (!token) {
      console.error("[AUTH-MIDDLEWARE] No token provided");
      res.status(401).json({ success: false, error: "Token não fornecido" });
      return;
    }

    const decoded = verifyToken(token);
    console.log(
      "[AUTH-MIDDLEWARE] Token decoded successfully. User ID:",
      decoded.id_usuario,
    );
    req.user = decoded;
    next();
  } catch (error) {
    console.error(
      "[AUTH-MIDDLEWARE] Token validation failed:",
      error instanceof Error ? error.message : error,
    );
    res.status(401).json({ success: false, error: "Token inválido" });
  }
};
