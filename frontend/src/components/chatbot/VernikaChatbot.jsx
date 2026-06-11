import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

const CHAT_SOCKET_URL =
  import.meta.env.VITE_CHAT_SOCKET_URL || "http://localhost:5000";

const WELCOME_MESSAGE =
  "Hi beautiful 👋 I’m Vernika Beauty Assistant. How can I help you today?";

const MAIN_QUICK_REPLIES = [
  "Ingredient Purity & Certifications",
  "Skin/Hair Consultation",
  "How to Use & Product Safety",
  "Orders, Shipping & Payments",
  "Talk to Beauty Expert",
];

const CATEGORY_QUICK_REPLIES = {
  "Ingredient Purity & Certifications": [
    "Are your products 100% organic and natural?",
    "What are Ecocert and COSMOS ingredients?",
    "Are your products free from sulfates, parabens, and synthetic fragrances?",
    "Are your products cruelty-free and vegan?",
  ],
  "Skin/Hair Consultation": [
    "What is your skin concern?",
    "Is this product suitable for my skin type?",
    "Which product is best for glowing and healthy skin?",
    "Can pregnant or breastfeeding women use your products?",
  ],
  "How to Use & Product Safety": [
    "How do I use this product for best results?",
    "How long will it take to see visible results?",
    "Do natural products have side effects? Should I do a patch test?",
    "What is the shelf life of your organic products?",
  ],
  "Orders, Shipping & Payments": [
    "I want to order now",
    "Do you offer COD and Free Shipping?",
    "How can I track my order status?",
    "What is your return or exchange policy?",
  ],
  "Talk to Beauty Expert": [
    "Talk to a Beauty Expert",
    "Chat with a Human",
    "I need help choosing a product",
    "I have a specific skin concern",
  ],
};

const CONCERN_QUICK_REPLIES = [
  "Acne & Pimples 🛑",
  "Dark Spots & Pigmentation ✨",
  "Dryness & Dull Skin 💧",
  "Anti-Aging & Wrinkles ⏳",
];

const SKIN_TYPE_QUICK_REPLIES = [
  "Dry",
  "Oily",
  "Sensitive",
  "Combination",
  "Normal",
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

const createMessage = (sender, text, status = "sent", extra = {}) => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  sender,
  text,
  status,
  ...extra,
});

const getWhatsAppUrl = (whatsappNumber) => {
  const digits = String(whatsappNumber || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");
  const normalizedDigits = digits.startsWith("91") ? digits : `91${digits}`;
  const message = encodeURIComponent(
    "Hi Vernika, I need help with beauty product guidance",
  );

  return `https://wa.me/${normalizedDigits}?text=${message}`;
};

const createContactCard = (contactInfo) =>
  createMessage(
    "bot",
    contactInfo?.message || "Talk to Vernika beauty expert",
    "sent",
    {
      type: "contact",
      inquiryNumber: contactInfo?.inquiryNumber,
      whatsappNumber: contactInfo?.whatsappNumber,
    },
  );

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
  const [quickReplies, setQuickReplies] = useState(MAIN_QUICK_REPLIES);
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

    socket.on("contact_info", (payload) => {
      if (!payload?.inquiryNumber && !payload?.whatsappNumber) return;

      setMessages((currentMessages) => [
        ...currentMessages,
        createContactCard(payload),
      ]);
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

  const getNextQuickReplies = (reply) => {
    if (CATEGORY_QUICK_REPLIES[reply]) {
      return CATEGORY_QUICK_REPLIES[reply];
    }

    if (
      reply === "What is your skin concern?" ||
      reply === "I have a specific skin concern" ||
      reply === "I need help choosing a product"
    ) {
      return CONCERN_QUICK_REPLIES;
    }

    if (CONCERN_QUICK_REPLIES.includes(reply)) {
      return SKIN_TYPE_QUICK_REPLIES;
    }

    if (reply === "Is this product suitable for my skin type?") {
      return SKIN_TYPE_QUICK_REPLIES;
    }

    return quickReplies;
  };

  const handleQuickReply = (reply) => {
    setQuickReplies(getNextQuickReplies(reply));
    sendMessage(reply);
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

                if (message.type === "contact") {
                  const whatsappUrl = getWhatsAppUrl(message.whatsappNumber);

                  return (
                    <div key={message.id} className="flex justify-start">
                      <div className="max-w-[86%] rounded-2xl rounded-bl-md border border-[#F7C8D5] bg-gradient-to-br from-white to-[#FFF0F5] px-4 py-4 text-[#2B2B2B] shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E88BA5] text-white">
                            <Sparkles className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#B76E79]">
                              Talk to Vernika beauty expert
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-[#2B2B2B]">
                              <Phone
                                className="h-4 w-4 shrink-0 text-[#B76E79]"
                                aria-hidden="true"
                              />
                              <span>{message.inquiryNumber}</span>
                            </div>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E88BA5] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#E88BA5]/25 transition hover:bg-[#B76E79] focus:outline-none focus:ring-2 focus:ring-[#E88BA5]/50"
                            >
                              <MessageCircle
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
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
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
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
