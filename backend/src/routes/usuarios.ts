import { Router } from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getAllUsuarios,
  getUsuarioById,
  getCurrentUser,
  updateUsuario,
  deleteUsuario,
} from "../controllers/usuariosController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Auth routes (públicas)
router.post("/auth/login", login);
router.post("/auth/register", register);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/verify-email", verifyEmail);
router.post("/auth/resend-verification", resendVerification);
router.post("/auth/logout", (req, res) => {
  // Limpa cookie httpOnly
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Em produção, você poderia adicionar o JWT a uma blacklist
  // Por enquanto, apenas removemos o cookie do servidor
  // O cliente é responsável por limpar o token do localStorage/AsyncStorage

  res.json({
    success: true,
    message: "Logout realizado com sucesso",
    timestamp: new Date().toISOString(),
  });
});

// Get current user (protegida)
router.get("/me", authMiddleware, getCurrentUser);

// CRUD routes
router.get("/", getAllUsuarios);
router.get("/:id", getUsuarioById);
router.put("/:id", authMiddleware, updateUsuario); // Protegida
router.delete("/:id", authMiddleware, deleteUsuario); // Protegida

export default router;
