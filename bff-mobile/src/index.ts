import express from "express";
//@ts-ignore
import cors from "cors";
import { setupUserRoutes } from "./routes/users";
import { setupAudioRoutes } from "./routes/audio";

const app = express();
const PORT = process.env.PORT || 3002;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "BFF Mobile is running" });
});

// Setup routes
setupUserRoutes(app, BACKEND_URL);
setupAudioRoutes(app, BACKEND_URL);

app.listen(PORT, () => {
  console.log(`BFF Mobile running on port ${PORT}`);
  console.log(`Backend URL: ${BACKEND_URL}`);
});
