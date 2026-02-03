import { Express } from "express";
import axios from "axios";

export function setupAudioRoutes(app: Express, backendUrl: string) {
  // Get all tracks with detailed info
  app.get("/api/audio/tracks", async (req, res) => {
    try {
      const { limit = 50, offset = 0, search = "" } = req.query;

      const response = await axios.get(`${backendUrl}/api/audio/tracks`, {
        params: { limit, offset, search },
      });

      res.json({
        success: true,
        data: response.data,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch tracks",
      });
    }
  });

  // Get track with full metadata
  app.get("/api/audio/tracks/:trackId", async (req, res) => {
    try {
      const { trackId } = req.params;

      const response = await axios.get(
        `${backendUrl}/api/audio/tracks/${trackId}`,
      );

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch track",
      });
    }
  });

  // Get playlists
  app.get("/api/audio/playlists", async (req, res) => {
    try {
      const response = await axios.get(`${backendUrl}/api/audio/playlists`);

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch playlists",
      });
    }
  });

  // Create playlist
  app.post("/api/audio/playlists", async (req, res) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/audio/playlists`,
        req.body,
      );

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to create playlist",
      });
    }
  });

  // Add track to playlist
  app.post("/api/audio/playlists/:playlistId/tracks", async (req, res) => {
    try {
      const { playlistId } = req.params;
      const { trackId } = req.body;

      const response = await axios.post(
        `${backendUrl}/api/audio/playlists/${playlistId}/tracks`,
        { trackId },
      );

      res.json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to add track to playlist",
      });
    }
  });
}
