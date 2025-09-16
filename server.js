import express from "express";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", (req, res) => {
  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1]?.content || "";

  console.log("📥 Incoming:", JSON.stringify(messages, null, 2));

  // Simple, human sales-pitch style reply
  let reply = "I'm glad to hear that. I won’t take up too much of your time — most businesses lose money every week on missed calls or staff costs. That’s why Nevo Solutions provides AI receptionists that never take breaks, never call in sick, and cost half of hiring a person. Would you be open to a quick chat with our head office to see how this could help your business?";

  if (lastMessage) {
    reply = `Right, I hear you — "${lastMessage}". Look, I don’t want to keep you long. The reason I’m calling is simple: most businesses are missing calls or overpaying for staff. Nevo Solutions fixes that with an AI receptionist that runs 24/7 at half the cost. How about I book you in with our head office to explore this?`;
  }

  console.log("📤 Replying:", reply);

  // ✅ OpenAI-style JSON + "text" field so Vapi will speak it
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
        text: reply,  // 👈 important for Vapi to actually speak it
        finish_reason: "stop",
      },
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Harvey server running on port ${PORT}`));
