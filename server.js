import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const { messages } = req.body;

    console.log("📥 Incoming:", JSON.stringify(req.body, null, 2));

    // Normally, you'd call OpenAI or your logic here
    let aiReply = "Hello, this is Harvey. How can I help you today?";

    // Try to grab user message if it exists
    const lastUserMsg = messages?.filter(m => m.role === "user").pop();
    if (lastUserMsg && lastUserMsg.content) {
      aiReply = `I heard you say: "${lastUserMsg.content}". How can I assist further?`;
    }

    // Guarantee fallback if for any reason aiReply is empty
    if (!aiReply || aiReply.trim() === "") {
      aiReply = "Sorry, I didn’t quite catch that. Could you repeat?";
    }

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
            content: aiReply,
          },
          finish_reason: "stop",
        },
      ],
      // 👇 This "response" field makes sure Vapi sees plain text
      response: {
        content: aiReply,
      },
    };

    console.log("📤 Outgoing:", JSON.stringify(response, null, 2));
    res.json(response);
  } catch (err) {
    console.error("❌ Error:", err);

    // Always reply with fallback, even on error
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
            content: "Sorry, I ran into a problem. Could you try again?",
          },
          finish_reason: "stop",
        },
      ],
      response: {
        content: "Sorry, I ran into a problem. Could you try again?",
      },
    });
  }
});

app.listen(10000, () => {
  console.log("✅ Harvey Hello World server running on port 10000");
});
