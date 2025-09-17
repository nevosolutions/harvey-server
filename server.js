import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/v1/chat/completions", async (req, res) => {
  console.log("📥 Incoming request:", JSON.stringify(req.body, null, 2));

  const userMessage = req.body.messages.find(m => m.role === "user")?.content || "Hello";

  // --- Simple reply logic for now ---
  const reply = `Hello, this is Harvey. I heard you say: "${userMessage}". How can I help you?`;

  const responsePayload = {
    id: "chatcmpl-" + Date.now(),
    object: "chat.completion",
    created: Date.now(),
    model: "harvey-1",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: reply
        },
        // 👇 THIS is the field Vapi reads for speech
        text: reply,
        finish_reason: "stop"
      }
    ]
  };

  console.log("📤 Sending response:", JSON.stringify(responsePayload, null, 2));
  res.json(responsePayload);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Harvey server running on port ${PORT}`);
});
