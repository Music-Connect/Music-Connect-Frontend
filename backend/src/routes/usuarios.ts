import { Router } from "express";
import {
  login,
  register,
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
router.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logout realizado com sucesso" });
});

// Get current user (protegida)
router.get("/me", authMiddleware, getCurrentUser);

// CRUD routes
router.get("/", getAllUsuarios);
router.get("/:id", getUsuarioById);
router.put("/:id", authMiddleware, updateUsuario); // Protegida
router.delete("/:id", authMiddleware, deleteUsuario); // Protegida

export default router;
