import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/v1/chat/completions", async (req, res) => {
  console.log("📥 Incoming request:", JSON.stringify(req.body, null, 2));

  // Extract messages
  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage?.content || "";

  // Generate reply (basic echo for now)
  const reply = `Hello, this is Harvey. I heard you say: "${userInput}". Can you hear me okay?`;

  // Format response in a way Vapi expects
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
          content: reply
        },
        finish_reason: "stop"
      }
    ],
    // 👇 THIS is what Vapi looks for
    response: {
      content: reply
    }
  };

  console.log("📤 Sending response:", JSON.stringify(responsePayload, null, 2));
  res.json(responsePayload);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Harvey server running on port ${PORT}`);
});
