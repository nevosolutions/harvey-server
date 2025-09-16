import express from "express";

const app = express();
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Harvey server is running");
});

// Chat completions route
app.post("/v1/chat/completions", async (req, res) => {
  console.log("📥 Incoming request:", JSON.stringify(req.body, null, 2));

  // You can add logic here to generate different replies based on user messages
  let reply = "I'm glad to hear from you! Can I quickly confirm what you’re calling about today?";

  // Basic check: look at the last user message if available
  const messages = req.body.messages || [];
  const lastUserMessage = messages.filter(m => m.role === "user").pop();
  if (lastUserMessage) {
    if (/hello/i.test(lastUserMessage.content)) {
      reply = "Hi there, this is Harvey speaking. How can I help you today?";
    } else if (/booking/i.test(lastUserMessage.content)) {
      reply = "Perfect, I can help you with that booking. May I take your name first?";
    }
  }

  const response = {
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
        finish_reason: "stop"
      }
    ]
  };

  console.log("📤 Sending response:", JSON.stringify(response, null, 2));
  res.json(response);
});

// Render uses PORT from env vars
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Harvey server running on port ${PORT}`);
});
