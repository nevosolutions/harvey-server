import express from "express";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const { messages } = req.body;

    // Grab the latest user message
    const userMessage = messages.findLast(m => m.role === "user")?.content || "";

    // Build a reply
    let reply = "Hello, this is Harvey, your AI receptionist. How can I help you today?";
    if (userMessage) {
      reply = `Hello, this is Harvey. I heard you say: "${userMessage}". Can you hear me okay?`;
    }

    // Respond in OpenAI-compatible format (NO "text" field)
    res.json({
      id: `chatcmpl-${Date.now()}`,
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
          finish_reason: "stop"
        }
      ],
      usage: {
        prompt_tokens: messages.length,
        completion_tokens: reply.split(" ").length,
        total_tokens: messages.length + reply.split(" ").length
      }
    });
  } catch (err) {
    console.error("Error in /v1/chat/completions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Harvey server running on port ${PORT}`);
});
