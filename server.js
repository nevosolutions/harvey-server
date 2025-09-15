import express from "express";

const app = express();
app.use(express.json());

app.post("/v1/chat/completions", (req, res) => {
  const messages = req.body.messages || [];
  const lastMessage = messages[messages.length - 1]?.content || "";

  // Default sales-style response
  let reply = "Hey, this is Harvey from Nevo Solutions. How’s your day going so far?";

  if (lastMessage) {
    reply = generateHarveyResponse(lastMessage);
  }

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

// --- Harvey's style and logic ---
function generateHarveyResponse(userInput) {
  const lower = userInput.toLowerCase();

  // If user shows interest
  if (lower.includes("yes") || lower.includes("okay") || lower.includes("tell me")) {
    return "Right, that makes sense. So... let me break this down real quick. At Nevo Solutions, we provide AI receptionists that never take breaks, never call in sick, and cost about half of what a human receptionist would. The best part? We can even handle outbound calls like this one, generating leads for you on autopilot. Would you be open to booking a quick call with my team so we can show you exactly how this works?";
  }

  // If user hesitates
  if (lower.includes("busy") || lower.includes("not interested")) {
    return "I get it, totally. Time’s valuable, right? Uh, the reason I’m reaching out is because what we’re doing is literally saving companies thousands every year. So... would you be against me setting up a short, no-pressure call with our head office so you can see if this fits your business?";
  }

  // If user asks about price
  if (lower.includes("price") || lower.includes("cost")) {
    return "Great question — I don’t handle pricing myself. What I can do is book you in with my head office team, who’ll walk you through the numbers and options. When’s a good time for a quick chat?";
  }

  // Default fallback
  return "Uh, yeah, I hear you. So... here’s the thing: our AI receptionists basically run 24/7, never miss a call, never take holidays — and they do it for half the cost of a full-time hire. What makes the most sense is for me to get you on a quick call with my team so they can dive deeper. Does that sound fair?";
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Harvey server running on port ${PORT}`));
