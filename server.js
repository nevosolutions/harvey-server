import express from "express";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", (req, res) => {
  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1]?.content || "";

  console.log("📥 Incoming:", JSON.stringify(messages, null, 2));

  // Human-like, confident cold call style reply
  let reply = "I'm glad to hear that. So I won’t take up too much of your time — the reason I’m calling is simple. Most businesses are losing money every week because of missed calls or paying too much for reception cover. That’s exactly where Nevo Solutions steps in. We provide an AI receptionist that never takes breaks, never calls in sick, and costs less than half of hiring someone. Does that sound like something that could help your business?";

  if (lastMessage) {
    reply = `Right, I hear you — "${lastMessage}". I'm glad you shared that. Look, I don’t want to keep you long, but here’s the deal: most businesses waste cash on missed calls or expensive staff. Nevo Solutions fixes that. Our AI receptionist handles every call, inbound and outbound, without ever taking a day off — and it’s half the price of a salary. How about I get you booked for a quick chat with our head office so we can run through what this could mean for you?`;
  }

  console.log("📤 Replying:", reply);

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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Harvey server running on port ${PORT}`));
