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

  const replyText = `Right, I hear you — "${userText}". Look, I don’t want to keep you long. The reason I’m calling is simple: most businesses are missing calls or overpaying for staff. Nevo Solutions fixes that with an AI receptionist that runs 24/7 at half the cost. How about I book you in with our head office to explore this?`;

  console.log("📤 Replying with:", replyText);

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
          content: replyText,
        },
        text: replyText, // ✅ added for Vapi compatibility
        finish_reason: "stop",
      },
    ],
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Harvey server running on port ${PORT}`);
});
