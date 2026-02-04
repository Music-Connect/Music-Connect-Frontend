import { Router } from "express";
import {
  getAllArtistas,
  getArtistaById,
  createArtista,
  updateArtista,
} from "../controllers/artistasController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllArtistas);
router.get("/:id", getArtistaById);
router.post("/", createArtista);
router.put("/:id", authMiddleware, updateArtista);

export default router;
