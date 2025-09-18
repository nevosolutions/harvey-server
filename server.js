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

    let reply;

    if (lastUserMsg && lastUserMsg.content?.trim()) {
      // Echo user input with assistant-like style
      reply = `I heard you say: "${lastUserMsg.content}". How can I help further?`;
    } else {
      // Default fallback if user said nothing or parsing failed
      reply = "Hello, I’m Harvey, your receptionist. How can I help you today?";
    }

    // Send OpenAI-style completion with guaranteed content
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

    // Always respond with safe fallback
    res.json({
      id: "chatcmpl-error-" + Date.now(),
      object: "chat.completion",
      created: Date.now(),
      model: "harvey-1",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Sorry, I ran into a glitch. Can you repeat that?"
          },
          finish_reason: "stop"
        }
      ]
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Harvey server is running");
});

app.listen(port, () => {
  console.log(`🚀 Harvey server running on port ${port}`);
});
