import { Express } from "express";
import axios from "axios";

export function setupAudioRoutes(app: Express, backendUrl: string) {
  // Get available tracks
  app.get("/api/v1/audio/tracks", async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;

      const response = await axios.get(`${backendUrl}/api/audio/tracks`, {
        params: { limit, offset },
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

  // Stream audio
  app.get("/api/v1/audio/stream/:trackId", async (req, res) => {
    try {
      const { trackId } = req.params;

      const response = await axios.get(
        `${backendUrl}/api/audio/stream/${trackId}`,
        { responseType: "stream" },
      );

      response.data.pipe(res);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to stream audio",
      });
    }
  });

  // Get track metadata
  app.get("/api/v1/audio/tracks/:trackId", async (req, res) => {
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
}
