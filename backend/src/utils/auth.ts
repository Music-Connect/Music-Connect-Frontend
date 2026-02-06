import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Usuario } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: Omit<Usuario, "senha">): string => {
  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export const verifyToken = (
  token: string,
): { id_usuario: number; email: string; tipo_usuario: string } => {
  return jwt.verify(token, JWT_SECRET) as {
    id_usuario: number;
    email: string;
    tipo_usuario: string;
  };
};

export const removePasswordFromUser = (
  user: Usuario,
): Omit<Usuario, "senha"> => {
  const { senha, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashResetToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
