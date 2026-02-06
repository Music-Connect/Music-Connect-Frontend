import { Router } from "express";
import {
  getPropostasRecebidas,
  getPropostasEnviadas,
  getPropostaById,
  createProposta,
  updatePropostaStatus,
  getMinhasPropostas,
  getAllPropostas,
} from "../controllers/propostasController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Public route - no authentication required
router.get("/", getAllPropostas);

// Protected routes - authentication required
router.get("/minhas", authMiddleware, getMinhasPropostas);
router.get("/recebidas", authMiddleware, getPropostasRecebidas);
router.get("/enviadas", authMiddleware, getPropostasEnviadas);
router.get("/:id", authMiddleware, getPropostaById);
router.post("/", authMiddleware, createProposta);
router.put("/:id/status", authMiddleware, updatePropostaStatus);

export default router;
