// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Harvey server is running.");
});

app.post("/v1/chat/completions", (req, res) => {
  console.log("📥 Incoming request:", JSON.stringify(req.body, null, 2));

  // Grab last user message
  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1];
  let replyText = "";

  if (lastMessage && lastMessage.role === "user") {
    const userContent = lastMessage.content.toLowerCase();
    if (userContent.includes("hello")) {
      replyText = "Hello, this is Harvey. How can I help you today?";
    } else {
      replyText = `I heard you say: "${lastMessage.content}". Can you tell me more?`;
    }
  } else {
    replyText = "Hi, this is Harvey. What can I do for you?";
  }

  // Always send back Vapi-compatible JSON
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
          content: replyText || "Sorry, I didn’t catch that."
        },
        finish_reason: "stop"
      }
    ]
  };

  console.log("📤 Sending response:", JSON.stringify(response, null, 2));
  res.json(response);
});

app.listen(port, () => {
  console.log(`✅ Harvey Hello World server running on port ${port}`);
});
