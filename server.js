import express from "express";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", async (req, res) => {
  console.log("📥 Incoming request:", JSON.stringify(req.body, null, 2));

  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage?.role === "user" ? lastMessage.content : "";

  const reply =
    userInput && userInput.trim().length > 0
      ? `Hello, this is Harvey. I heard you say: "${userInput}". Can you hear me okay?`
      : "Hi, this is Harvey speaking. How can I help?";

  const responsePayload = {
    id: `chatcmpl-${Date.now()}`,
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
    // 👇 Add this so Vapi always has top-level `content`
    response: {
      content: reply,
    },
  };

  console.log("📤 Sending response:", JSON.stringify(responsePayload, null, 2));
  res.json(responsePayload);
});

app.listen(10000, () => {
  console.log("✅ Harvey Hello World server running on port 10000");
});
