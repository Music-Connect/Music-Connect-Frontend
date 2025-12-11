// src/routers/authRoutes.ts
import { Router } from "express";
import { validateRegister } from "../middlewares/user.js";

// Importar dos novos controllers
import * as AuthController from "../controllers/authController.js";
import * as UserController from "../controllers/userController.js";
import * as ContractController from "../controllers/contractController.js";

const router = Router();

router.post(
  "/registerCon",
  validateRegister,
  AuthController.registerContractor
);
router.post("/registerArt", validateRegister, AuthController.registerArtist);
router.post("/login", AuthController.login);

router.put("/users/:id", UserController.updateUser);
router.get("/users", UserController.getUsers);
router.delete("/users/:id", UserController.deleteUser);
router.get("/users/:id", UserController.getUserById);

router.post("/contracts", ContractController.createContract);
router.get("/contracts", ContractController.getContracts);
router.put("/contracts/:id", ContractController.updateContractStatus);
router.get("/users/:id/agenda", ContractController.getUserAgenda);

export default router;
