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
  generateResetToken,
  hashResetToken,
} from "../utils/auth.js";
import {
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
} from "../utils/emailService.js";
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

    const response: AuthResponse & { message?: string } = {
      success: true,
      user: userWithoutPassword,
      token, // Still send in response for backward compatibility
      type: user.tipo_usuario,
      message: userWithoutPassword.email_verificado
        ? undefined
        : "Email ainda nao verificado",
    };

    res.json(response);
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ success: false, error: "Erro ao fazer login" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: "Email é obrigatório",
      });
      return;
    }

    // Check if user exists
    const result: QueryResult<Usuario> = await pool.query(
      "SELECT id_usuario, email FROM usuarios WHERE email = $1",
      [email],
    );

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      res.json({
        success: true,
        message:
          "Se o email existir, você receberá instruções para redefinir sua senha",
      });
      return;
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this user
    await pool.query(
      "DELETE FROM password_reset_tokens WHERE id_usuario = $1",
      [user.id_usuario],
    );

    // Save hashed token to database
    await pool.query(
      `INSERT INTO password_reset_tokens (id_usuario, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id_usuario, hashedToken, expiresAt],
    );

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      // In development, log the token if email service is not configured
      console.log(`[PASSWORD RESET] Token for ${email}: ${resetToken}`);
      console.log(
        `[PASSWORD RESET] Reset URL: /reset-password?token=${resetToken}`,
      );
    }

    res.json({
      success: true,
      message:
        "Se o email existir, você receberá instruções para redefinir sua senha",
      // Only for development - remove in production!
      ...(process.env.NODE_ENV !== "production" &&
        !emailSent && { resetToken }),
    });
  } catch (error) {
    console.error("Erro ao solicitar reset de senha:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao processar solicitação",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      res.status(400).json({
        success: false,
        error: "Token e nova senha são obrigatórios",
      });
      return;
    }

    if (novaSenha.length < 6) {
      res.status(400).json({
        success: false,
        error: "A senha deve ter pelo menos 6 caracteres",
      });
      return;
    }

    const hashedToken = hashResetToken(token);

    // Find valid token
    const tokenResult: QueryResult = await pool.query(
      `SELECT id_usuario FROM password_reset_tokens 
       WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP AND used = FALSE`,
      [hashedToken],
    );

    if (tokenResult.rows.length === 0) {
      res.status(400).json({
        success: false,
        error: "Token inválido ou expirado",
      });
      return;
    }

    const userId = tokenResult.rows[0].id_usuario;
    const hashedPassword = await hashPassword(novaSenha);

    // Update password
    await pool.query(
      "UPDATE usuarios SET senha = $1, updated_at = CURRENT_TIMESTAMP WHERE id_usuario = $2",
      [hashedPassword, userId],
    );

    // Mark token as used
    await pool.query(
      "UPDATE password_reset_tokens SET used = TRUE WHERE token = $1",
      [hashedToken],
    );

    res.json({
      success: true,
      message: "Senha alterada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao redefinir senha",
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(
      "[BACKEND] Received registration request:",
      JSON.stringify({ ...req.body, senha: "***" }, null, 2),
    );

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

    console.log("[BACKEND] Extracted fields:", {
      usuario,
      email,
      senha: "***",
      tipo_usuario,
      telefone,
      cidade,
      estado,
    });

    // Validações
    if (!usuario || !email || !senha || !tipo_usuario) {
      console.error("[BACKEND] Validation failed - missing required fields:", {
        usuario: !!usuario,
        email: !!email,
        senha: !!senha,
        tipo_usuario: !!tipo_usuario,
      });
      res.status(400).json({
        success: false,
        error: "Campos obrigatórios: usuario, email, senha, tipo_usuario",
      });
      return;
    }

    if (!["artista", "contratante"].includes(tipo_usuario)) {
      res.status(400).json({
        success: false,
        error: 'tipo_usuario deve ser "artista" ou "contratante"',
      });
      return;
    }

    // Verificar se email já existe
    console.log("[BACKEND] Checking if email exists:", email);
    const emailCheck: QueryResult = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE email = $1",
      [email],
    );

    if (emailCheck.rows.length > 0) {
      console.warn("[BACKEND] Email already exists:", email);
      res.status(400).json({
        success: false,
        error: "Email já cadastrado",
      });
      return;
    }

    console.log("[BACKEND] Hashing password...");
    const hashedPassword = await hashPassword(senha);

    console.log("[BACKEND] Inserting user into database...");
    console.log("[BACKEND] Insert values:", {
      usuario,
      email,
      tipo_usuario,
      telefone,
      cidade,
      estado,
      genero_musical,
    });

    const result: QueryResult<Usuario> = await pool.query(
      `INSERT INTO usuarios 
       (usuario, email, senha, tipo_usuario, descricao, telefone, cidade, estado, genero_musical)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        usuario,
        email,
        hashedPassword,
        tipo_usuario,
        descricao || null,
        telefone || null,
        cidade || null,
        estado || null,
        genero_musical || null,
      ],
    );

    console.log(
      "[BACKEND] User inserted successfully, ID:",
      result.rows[0]?.id_usuario,
    );
    const newUser = result.rows[0];
    console.log("[BACKEND] Removing password from user object...");
    const userWithoutPassword = removePasswordFromUser(newUser);

    console.log("[BACKEND] Generating JWT token...");
    const token = generateToken(userWithoutPassword);

    // Set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const verificationToken = generateResetToken();
    const hashedVerificationToken = hashResetToken(verificationToken);
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      "DELETE FROM email_verification_tokens WHERE id_usuario = $1",
      [newUser.id_usuario],
    );

    await pool.query(
      `INSERT INTO email_verification_tokens (id_usuario, token, expires_at)
       VALUES ($1, $2, $3)`,
      [newUser.id_usuario, hashedVerificationToken, verificationExpiresAt],
    );

    const emailSent = await sendEmailVerificationEmail(
      newUser.email,
      verificationToken,
    );

    if (!emailSent) {
      console.log(
        `[EMAIL VERIFICATION] Token for ${newUser.email}: ${verificationToken}`,
      );
      console.log(
        `[EMAIL VERIFICATION] Verify URL: /verify-email?token=${verificationToken}`,
      );
    }

    const response: AuthResponse & { message?: string } = {
      success: true,
      user: userWithoutPassword,
      token, // Still send in response for backward compatibility
      type: newUser.tipo_usuario,
      message: userWithoutPassword.email_verificado
        ? undefined
        : "Email ainda nao verificado",
    };

    const responseWithToken = {
      ...response,
      ...(process.env.NODE_ENV !== "production" && !emailSent
        ? { verificationToken }
        : {}),
    };

    console.log("[BACKEND] Registration successful, sending response");
    res.status(201).json(responseWithToken);
  } catch (error) {
    console.error("[BACKEND] ERROR during registration:", error);
    console.error(
      "[BACKEND] Error stack:",
      error instanceof Error ? error.stack : "N/A",
    );
    res
      .status(500)
      .json({ success: false, error: "Erro ao registrar usuário" });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        error: "Token e obrigatorio",
      });
      return;
    }

    const hashedToken = hashResetToken(token);

    const tokenResult: QueryResult = await pool.query(
      `SELECT id_usuario FROM email_verification_tokens
       WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP AND used = FALSE`,
      [hashedToken],
    );

    if (tokenResult.rows.length === 0) {
      res.status(400).json({
        success: false,
        error: "Token invalido ou expirado",
      });
      return;
    }

    const userId = tokenResult.rows[0].id_usuario;

    await pool.query(
      `UPDATE usuarios
       SET email_verificado = TRUE, email_verificado_em = CURRENT_TIMESTAMP
       WHERE id_usuario = $1`,
      [userId],
    );

    await pool.query(
      "UPDATE email_verification_tokens SET used = TRUE WHERE token = $1",
      [hashedToken],
    );

    res.json({
      success: true,
      message: "Email verificado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao verificar email:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao verificar email",
    });
  }
};

export const resendVerification = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: "Email e obrigatorio",
      });
      return;
    }

    const result: QueryResult<Usuario> = await pool.query(
      "SELECT id_usuario, email, email_verificado FROM usuarios WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0 || result.rows[0].email_verificado) {
      res.json({
        success: true,
        message:
          "Se o email existir, voce recebera instrucoes para verificar sua conta",
      });
      return;
    }

    const user = result.rows[0];
    const verificationToken = generateResetToken();
    const hashedVerificationToken = hashResetToken(verificationToken);
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      "DELETE FROM email_verification_tokens WHERE id_usuario = $1",
      [user.id_usuario],
    );

    await pool.query(
      `INSERT INTO email_verification_tokens (id_usuario, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id_usuario, hashedVerificationToken, verificationExpiresAt],
    );

    const emailSent = await sendEmailVerificationEmail(
      user.email,
      verificationToken,
    );

    if (!emailSent) {
      console.log(
        `[EMAIL VERIFICATION] Token for ${user.email}: ${verificationToken}`,
      );
      console.log(
        `[EMAIL VERIFICATION] Verify URL: /verify-email?token=${verificationToken}`,
      );
    }

    res.json({
      success: true,
      message:
        "Se o email existir, voce recebera instrucoes para verificar sua conta",
      ...(process.env.NODE_ENV !== "production" && !emailSent
        ? { verificationToken }
        : {}),
    });
  } catch (error) {
    console.error("Erro ao reenviar verificacao de email:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao reenviar verificacao de email",
    });
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

    const publicUsers = usersWithoutPassword.map((user) => {
      const { email, ...rest } = user;
      return rest;
    });

    const response: ApiResponse<Omit<Usuario, "senha" | "email">[]> = {
      success: true,
      data: publicUsers,
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

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get user ID from auth middleware (req.user is set by authMiddleware)
    const userId = (req as any).user?.id_usuario;

    console.log("[BACKEND] GET /api/usuarios/me - User ID from token:", userId);

    if (!userId) {
      console.error("[BACKEND] User not authenticated - no userId in token");
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    const result: QueryResult<Usuario> = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [userId],
    );

    if (result.rows.length === 0) {
      console.error("[BACKEND] User not found in database:", userId);
      res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
      return;
    }

    const userWithoutPassword = removePasswordFromUser(result.rows[0]);

    console.log(
      "[BACKEND] Sending user data:",
      userWithoutPassword.id_usuario,
      userWithoutPassword.usuario,
    );

    const response: ApiResponse<Omit<Usuario, "senha">> = {
      success: true,
      data: userWithoutPassword,
    };

    res.json(response);
  } catch (error) {
    console.error("Erro ao buscar usuário atual:", error);
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
    const userId = (req as any).user?.id_usuario;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    if (userId !== parseInt(id)) {
      res.status(403).json({
        success: false,
        error: "Você não pode atualizar outro usuário",
      });
      return;
    }

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
      "preco_minimo",
      "preco_maximo",
      "portfolio",
      "spotify_url",
      "instagram_url",
      "youtube_url",
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
    const userId = (req as any).user?.id_usuario;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
      return;
    }

    if (userId !== parseInt(id)) {
      res.status(403).json({
        success: false,
        error: "Você não pode deletar outro usuário",
      });
      return;
    }

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
