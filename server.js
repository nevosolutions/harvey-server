import express from "express";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", (req, res) => {
  console.log("📥 Incoming:", JSON.stringify(req.body, null, 2));

  const responseJson = {
    id: "chatcmpl-" + Date.now(),
    object: "chat.completion",
    created: Date.now(),
    model: "harvey-1",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: "Hello, this is Harvey speaking! Can you hear me now?",
        },
        finish_reason: "stop",
      },
    ],
  };

  console.log("📤 Sending JSON:", JSON.stringify(responseJson, null, 2));
  res.json(responseJson);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Harvey Hello World server running on port ${PORT}`)
);
