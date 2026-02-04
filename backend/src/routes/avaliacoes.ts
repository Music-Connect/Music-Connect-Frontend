import { Router } from "express";
import {
  getAvaliacoesByUserId,
  createAvaliacao,
  getMediaAvaliacoes,
} from "../controllers/avaliacoesController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/usuario/:id", getAvaliacoesByUserId);
router.get("/usuario/:id/media", getMediaAvaliacoes);
router.post("/", authMiddleware, createAvaliacao);

export default router;
