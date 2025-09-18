import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Main chat endpoint
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const { messages } = req.body;

    // Find last user message
    const lastUserMsg = messages?.filter(m => m.role === "user").pop();

    // Simple response logic (replace with smarter later)
    let reply;
    if (lastUserMsg && lastUserMsg.content) {
      reply = `You said: "${lastUserMsg.content}". I can help with that.`;
    } else {
      reply = "Hello, I'm Harvey. How can I help you today?";
    }

    // Send valid OpenAI-style completion
    res.json({
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      created: Date.now(),
      model: "harvey-1",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: reply },
          finish_reason: "stop"
        }
      ]
    });
  } catch (error) {
    console.error("Error in /v1/chat/completions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Harvey server is running");
});

app.listen(port, () => {
  console.log(`🚀 Harvey server running on port ${port}`);
});
