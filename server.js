import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Root check
app.get("/", (req, res) => {
  res.send("✅ Harvey server is running");
});

// Chat completions endpoint
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    // Last user message
    const userMessage =
      messages[messages.length - 1]?.content || "No message received";

    // --- GENERATE A GUARANTEED REPLY ---
    const reply = `Harvey here. I heard you say: "${userMessage}". How can I help further?`;

    // Format response for Vapi
    res.json({
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      created: Date.now(),
      model: "harvey-1",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: reply,
          },
          finish_reason: "stop",
        },
      ],
    });
  } catch (error) {
    console.error("❌ Error in /chat/completions:", error.message);
    res.status(500).json({
      error: "Server error: " + error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Harvey server running on port ${PORT}`);
});
