import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const CHAT_SOCKET_URL =
  import.meta.env.VITE_CHAT_SOCKET_URL || "http://localhost:5000";

const WELCOME_MESSAGE =
  "Hi beautiful 👋 I’m Vernika Beauty Assistant. Tell me your skin concern and I’ll help you choose the right product.";

const QUICK_REPLIES = [
  "Depuffing",
  "Brightening",
  "Protection",
  "How to use",
  "Order now",
];

const MotionButton = motion.button;
const MotionSection = motion.section;
const MotionSpan = motion.span;

const getSessionId = () => {
  const storageKey = "vernika_beauty_chat_session";
  const existingSession = localStorage.getItem(storageKey);

  if (existingSession) return existingSession;

  const nextSession =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `vernika-${Date.now()}`;

  localStorage.setItem(storageKey, nextSession);
  return nextSession;
};

const createMessage = (sender, text, status = "sent") => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  sender,
  text,
  status,
});

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-[#F7C8D5]/45 px-4 py-3 text-[#2B2B2B] shadow-sm">
    <span className="h-2 w-2 animate-bounce rounded-full bg-[#B76E79]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-[#B76E79] [animation-delay:120ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-[#B76E79] [animation-delay:240ms]" />
  </div>
);

const VernikaChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => [
    createMessage("bot", WELCOME_MESSAGE),
  ]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasShownConnectionErrorRef = useRef(false);
  const sessionId = useMemo(() => getSessionId(), []);

  useEffect(() => {
    if (!isOpen) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return undefined;
    }

    const socket = io(CHAT_SOCKET_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnectionAttempts: 2,
      timeout: 5000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      hasShownConnectionErrorRef.current = false;
    });

    socket.on("connect_error", () => {
      setIsTyping(false);

      if (hasShownConnectionErrorRef.current) return;
      hasShownConnectionErrorRef.current = true;

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "bot",
          "Vernika Beauty Assistant is offline right now. Please start the AI chat server and try again.",
          "error",
        ),
      ]);
    });

    socket.on("bot_typing", (payload) => {
      setIsTyping(Boolean(payload?.isTyping));
    });

    socket.on("bot_reply", (payload) => {
      if (!payload?.message) return;

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("bot", payload.message),
      ]);
      setIsTyping(false);
    });

    socket.on("chat_error", (error) => {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "bot",
          error?.message ||
            "Vernika Beauty Assistant is unavailable right now. Please try again shortly.",
          "error",
        ),
      ]);
      setIsTyping(false);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const sendMessage = (messageText = inputValue) => {
    const text = messageText.trim();

    if (!text) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage("user", text),
    ]);
    setInputValue("");
    setIsTyping(true);

    if (!socketRef.current?.connected) {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "bot",
          "Vernika Beauty Assistant is offline right now. Please start the AI chat server and try again.",
          "error",
        ),
      ]);
      setIsTyping(false);
      return;
    }

    socketRef.current?.emit("user_message", {
      sessionId,
      message: text,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <MotionSection
            key="vernika-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-x-3 bottom-20 flex h-[min(620px,calc(100vh-6.5rem))] flex-col overflow-hidden rounded-[26px] border border-[#F7C8D5] bg-[#FFF7F9] text-[#2B2B2B] shadow-2xl shadow-[#B76E79]/20 sm:inset-x-auto sm:right-6 sm:w-[390px]"
          >
            <div className="flex items-center justify-between bg-[#E88BA5] px-5 py-4 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold">
                    Vernika Beauty Assistant
                  </h2>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-white/85">
                    <span className="h-2 w-2 rounded-full bg-white" />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((message) => {
                const isUser = message.sender === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? "rounded-br-md bg-[#E88BA5] text-white"
                          : "rounded-bl-md bg-white text-[#2B2B2B]"
                      } ${
                        message.status === "error"
                          ? "border border-[#B76E79]/40 bg-[#F7C8D5]/35"
                          : ""
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[#F7C8D5]/70 bg-white/70 px-4 py-4 backdrop-blur">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="shrink-0 rounded-full border border-[#F7C8D5] bg-white px-3 py-2 text-xs font-medium text-[#B76E79] transition hover:border-[#E88BA5] hover:bg-[#FFF7F9] focus:outline-none focus:ring-2 focus:ring-[#E88BA5]/50"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <label htmlFor="vernika-chat-input" className="sr-only">
                  Message Vernika Beauty Assistant
                </label>
                <textarea
                  id="vernika-chat-input"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask about your skin concern..."
                  className="max-h-24 min-h-11 flex-1 resize-none rounded-2xl border border-[#F7C8D5] bg-white px-4 py-3 text-sm text-[#2B2B2B] outline-none transition placeholder:text-[#B76E79]/55 focus:border-[#E88BA5] focus:ring-2 focus:ring-[#E88BA5]/25"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E88BA5] text-white shadow-lg shadow-[#E88BA5]/30 transition hover:bg-[#B76E79] focus:outline-none focus:ring-2 focus:ring-[#E88BA5]/50 disabled:cursor-not-allowed disabled:bg-[#F7C8D5]"
                  aria-label="Send message"
                >
                  {isTyping ? (
                    <Loader2
                      className="h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Send className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </form>
            </div>
          </MotionSection>
        )}
      </AnimatePresence>

      <MotionButton
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E88BA5] text-white shadow-xl shadow-[#B76E79]/30 transition hover:bg-[#B76E79] focus:outline-none focus:ring-4 focus:ring-[#F7C8D5]"
        aria-label={isOpen ? "Close Vernika chat" : "Open Vernika chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <MotionSpan
            key={isOpen ? "heart" : "message"}
            initial={{ opacity: 0, rotate: -18, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 18, scale: 0.8 }}
            transition={{ duration: 0.16 }}
          >
            {isOpen ? (
              <Heart className="h-7 w-7 fill-white" aria-hidden="true" />
            ) : (
              <MessageCircle className="h-7 w-7" aria-hidden="true" />
            )}
          </MotionSpan>
        </AnimatePresence>
      </MotionButton>
    </div>
  );
};

export default VernikaChatbot;
