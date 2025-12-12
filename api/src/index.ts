import express from "express";
import cors from "cors";
import authRoutes from "./routers/authRoutes.js";
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.listen(config.server.port, () => {
  console.log(`Servidor rodando na porta ${config.server.port}`);
});
