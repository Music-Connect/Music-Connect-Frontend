import { Express } from "express";
import axios from "axios";

export function setupUserRoutes(app: Express, backendUrl: string) {
  // Get user profile with full data
  app.get("/api/users/profile", async (req, res) => {
    try {
      const response = await axios.get(`${backendUrl}/api/users`, {
        headers: req.headers,
      });

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
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

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

  // Get user preferences
  app.get("/api/users/preferences", async (req, res) => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/preferences`);

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch preferences",
      });
    }
  });

  // Update user preferences
  app.put("/api/users/preferences", async (req, res) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/users/preferences`,
        req.body,
      );

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to update preferences",
      });
    }
  });
}
