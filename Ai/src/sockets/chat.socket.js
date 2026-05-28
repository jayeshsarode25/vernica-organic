const {
  getRecentMessages,
  saveMessage,
} = require("../services/chatHistory.service");
const {
  BOT_NAME,
  getBeautyAssistantReply,
} = require("../services/gemini.service");

const normalizePayload = (payload) => {
  if (typeof payload === "string") {
    return {
      message: payload,
    };
  }

  return payload || {};
};

const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("user_message", async (payload) => {
      const { message, sessionId: payloadSessionId } = normalizePayload(payload);
      const text = typeof message === "string" ? message.trim() : "";
      const sessionId = payloadSessionId || socket.id;

      if (!text) {
        socket.emit("chat_error", {
          success: false,
          message: "Message is required",
        });
        return;
      }

      try {
        const history = await getRecentMessages(sessionId);

        await saveMessage({
          sessionId,
          socketId: socket.id,
          sender: "user",
          text,
        });

        socket.emit("bot_typing", {
          sessionId,
          isTyping: true,
          botName: BOT_NAME,
        });

        const reply = await getBeautyAssistantReply({
          message: text,
          history,
        });

        const savedReply = await saveMessage({
          sessionId,
          socketId: socket.id,
          sender: "bot",
          text: reply,
        });

        socket.emit("bot_typing", {
          sessionId,
          isTyping: false,
          botName: BOT_NAME,
        });

        socket.emit("bot_reply", {
          success: true,
          sessionId,
          botName: BOT_NAME,
          message: reply,
          createdAt: savedReply.createdAt,
        });
      } catch (error) {
        console.error("Chat error:", error.message);

        socket.emit("bot_typing", {
          sessionId,
          isTyping: false,
          botName: BOT_NAME,
        });

        socket.emit("chat_error", {
          success: false,
          sessionId,
          message: "Vernika Beauty Assistant is unavailable right now. Please try again shortly.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = registerChatSocket;
