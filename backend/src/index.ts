import express from "express";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// TODO: Implement core business logic here
app.get("/api/users", (req, res) => {
  res.json({ message: "Users endpoint" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
