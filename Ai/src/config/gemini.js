const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const getGeminiGenerateContentUrl = () => {
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  return `${GEMINI_API_BASE_URL}/${model}:generateContent`;
};

module.exports = {
  getGeminiGenerateContentUrl,
};
