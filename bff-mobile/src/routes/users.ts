import { Express } from "express";
import axios from "axios";

export function setupUserRoutes(app: Express, backendUrl: string) {
  // Get user profile
  app.get("/api/v1/users/profile", async (req, res) => {
    try {
      const response = await axios.get(`${backendUrl}/api/users`, {
        headers: req.headers,
      });

      // Transform data for mobile
      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch user profile",
      });
    }
  });

  // Login
  app.post("/api/v1/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Call backend authentication
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: "Authentication failed",
      });
    }
  });

  // Logout
  app.post("/api/v1/auth/logout", (req, res) => {
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
}
