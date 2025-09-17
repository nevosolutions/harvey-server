import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/v1/chat/completions", async (req, res) => {
  const { messages } = req.body;
  console.log("📥 Incoming:", JSON.stringify(messages, null, 2));

  // Get the last user message
  const lastUser = messages?.filter(m => m.role === "user").pop();
  let reply = "Hello, this is Harvey. How can I help you today?";

  if (lastUser && lastUser.content) {
    reply = `I heard you say: "${lastUser.content}". How can I assist?`;
  }

  // Hard fallback
  if (!reply || reply.trim() === "") {
    reply = "Sorry, I didn’t catch that. Could you repeat?";
  }

  // ✅ Strictly return OpenAI-compatible format
  const response = {
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
    usage: {
      prompt_tokens: messages?.length || 0,
      completion_tokens: reply.split(" ").length,
      total_tokens: (messages?.length || 0) + reply.split(" ").length,
    },
  };

  console.log("📤 Outgoing:", JSON.stringify(response, null, 2));
  res.json(response);
});

app.listen(10000, () => {
  console.log("✅ Harvey server running on port 10000");
});
