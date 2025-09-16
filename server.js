import express from "express";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", (req, res) => {
  console.log("📥 Incoming:", JSON.stringify(req.body, null, 2));

  const reply = "Hello, this is Harvey speaking! Can you hear me now?";

  const responseJson = {
    output: reply   // 👈 what Vapi expects in custom-llm mode
  };

  console.log("📤 Sending JSON:", JSON.stringify(responseJson, null, 2));
  res.json(responseJson);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Harvey custom-llm server running on port ${PORT}`)
);
