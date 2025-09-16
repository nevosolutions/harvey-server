import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simulated LLM (replace with real model call later)
function generateResponse(messages) {
  const lastUserMessage = messages.filter(m => m.role === "user").pop();
  const reply = `Hello, this is Harvey. I heard you say: "${lastUserMessage?.content}". Can you hear me okay?`;
  return reply;
}

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const { model, messages } = req.body;

    // Create reply text
    const reply = generateResponse(messages);

    // Respond in OpenAI-compatible format
    res.json({
      id: "chatcmpl-" + Date.now(),
      object: "chat.completion",
      created: Date.now(),
      model: model || "harvey-1",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: reply
          },
          finish_reason: "stop"
        }
      ],
      usage: {
        prompt_tokens: messages.reduce((acc, m) => acc + (m.content?.split(" ").length || 0), 0),
        completion_tokens: reply.split(" ").length,
        total_tokens: messages.reduce((acc, m) => acc + (m.content?.split(" ").length || 0), 0) + reply.split(" ").length
      }
    });
  } catch (err) {
    console.error("Error in /v1/chat/completions:", err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Harvey server is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Harvey server running on port ${PORT}`);
});
