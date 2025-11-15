import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: "10mb" }));

// ✅ FIXED: Allow frontend domain
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://frontend-six-lilac-dyl41enn4v.vercel.app",
      "https://eco-waste-ai-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Roboflow API KEY
const ROBOFLOW_API_KEY = process.env.ROBOFLOW_API_KEY;

app.post("/api/classify", async (req, res) => {
  try {
    let { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: "No image data provided" });
    }

    if (imageData.includes("base64,")) {
      imageData = imageData.split("base64,")[1];
    }

    const response = await axios({
      method: "POST",
      url: "https://serverless.roboflow.com/waste-classification-uwqfy/1",
      params: { api_key: ROBOFLOW_API_KEY },
      data: imageData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.json({ results: response.data });

  } catch (err) {
    res.status(500).json({
      error: "Failed to classify image",
      details: err.response?.data || err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








