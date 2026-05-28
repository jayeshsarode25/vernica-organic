const { getGeminiGenerateContentUrl } = require("../config/gemini");

const BOT_NAME = "Vernika Beauty Assistant";

const SYSTEM_PROMPT = `
You are ${BOT_NAME}, the helpful chatbot for Vernika, a beauty and skincare brand.

Answer only as a beauty and skincare product assistant. Reply in the same language as the user.

You can explain these Vernika product benefits:
- Depuffing
- Brightening
- Protection
- Suitable for all skin types
- Product size: 50gm

Safety rules:
- Do not provide medical advice.
- Do not diagnose skin conditions.
- Do not guarantee results.
- If the user asks about allergies, reactions, skin disease, pregnancy, medication, or medical treatment, suggest consulting a dermatologist or qualified healthcare professional.
- Keep replies warm, concise, and brand-friendly.
`.trim();

const toGeminiContents = (history) => {
  return history.map((message) => ({
    role: message.sender === "bot" ? "model" : "user",
    parts: [{ text: message.text }],
  }));
};

const extractGeminiText = (responseBody) => {
  return responseBody?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("")
    .trim();
};

const getBeautyAssistantReply = async ({ message, history = [] }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("your_")) {
    throw new Error("GEMINI_API_KEY is missing or still uses the placeholder value");
  }

  const response = await fetch(getGeminiGenerateContentUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        ...toGeminiContents(history),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 280,
      },
    }),
  });

  const responseBody = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      responseBody?.error?.message || "Gemini API request failed",
    );
  }

  return (
    extractGeminiText(responseBody) ||
    "I am sorry, I could not prepare a reply right now. Please try again."
  );
};

module.exports = {
  BOT_NAME,
  getBeautyAssistantReply,
};
