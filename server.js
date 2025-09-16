// server.js
import express from "express";

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ Harvey server running");
});

// Chat completions endpoint
app.post("/v1/chat/completions", async (req, res) => {
  console.log("📥 Incoming request:", JSON.stringify(req.body, null, 2));

  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1];
  const userText =
    lastMessage?.role === "user" ? lastMessage.content : "Hello there!";

  const replyText = `Hi, this is Harvey from Nevo Solutions. You said: "${userText}". I'm glad you picked up — let me quickly explain how we help businesses never miss a call.`; 

  console.log("📤 Replying with:", replyText);

  res.json({
    id: "chatcmpl-" + Date.now(),
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: "harvey-1",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: replyText,
        },
        text: replyText, // ✅ for Vapi fallback
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: messages.length * 10,
      completion_tokens: replyText.split(" ").length,
      total_tokens:
        messages.length * 10 + replyText.split(" ").length,
    },
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Harvey server running on port ${PORT}`);
});
