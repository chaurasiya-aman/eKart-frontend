import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NOVA_GREETING = {
  type: "bot",
  text: "Hey there! 👋 I'm Nova, your personal shopping assistant. Tell me what you're looking for and I'll find the best options for you!",
  products: [],
};

function TypingDots() {
  return (
    <div style={S.typingWrap}>
      <span style={S.typingLabel}>Nova is typing</span>
      <div style={S.dots}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ ...S.dot, animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
      <style>{dotAnim}</style>
    </div>
  );
}

function ProductCard({ product, onView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ ...S.card, ...(hovered ? S.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Category badge */}
      <span style={S.badge}>{product.category}</span>

      {/* Product image placeholder */}
      <div style={S.imgWrap}>
        <div style={S.imgPlaceholder}>
          <span style={S.imgIcon}>
            {product.category?.toLowerCase().includes("mobile") ? "📱"
              : product.category?.toLowerCase().includes("laptop") ? "💻"
              : product.category?.toLowerCase().includes("tab") ? "📲"
              : "🛍️"}
          </span>
        </div>
      </div>

      <p style={S.cardName}>{product.productName}</p>
      <p style={S.cardPrice}>₹{Number(product.productPrice).toLocaleString("en-IN")}</p>

      <button
        style={{ ...S.viewBtn, ...(hovered ? S.viewBtnHover : {}) }}
        onClick={() => onView(product._id)}
      >
        View Product →
      </button>
    </div>
  );
}

function Bubble({ msg, onView }) {
  const isUser = msg.type === "user";
  return (
    <div style={{ ...S.msgRow, justifyContent: isUser ? "flex-end" : "flex-start" }} >
      <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start", gap: 10 }}>

        {/* Avatar for bot */}
        {!isUser && (
          <div style={S.botMeta}>
            <div style={S.botAvatar}>N</div>
            <span style={S.botName}>Nova</span>
          </div>
        )}

        {/* Bubble */}
        <div style={isUser ? S.userBubble : S.botBubble}>
          {msg.text}
        </div>

        {/* Products */}
        {!isUser && msg.products?.length > 0 && (
          <div style={S.productsRow}>
            {msg.products.map((p, i) => (
              <ProductCard key={i} product={p} onView={onView} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function ChatAI() {
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState([NOVA_GREETING]);
  const [loading, setLoading]   = useState(false);
  const chatEndRef              = useRef(null);
  const inputRef                = useRef(null);
  const navigate                = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { type: "user", text: trimmed, products: [] };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      /* Build history from prior turns (skip greeting, skip current user msg) */
      const historyToSend = updated
        .slice(1, -1)
        .map(({ type, text }) => ({
          role: type === "user" ? "user" : "assistant",
          content: text,
        }));
      const res = await fetch(`${API_URL}/api/v1/chat/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          conversationHistory: historyToSend,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply, products: data.products || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Oops! Something went wrong. Please try again. ❌", products: [] },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={S.page} >
      <style>{globalCSS}</style>

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.headerAvatar}>N</div>
          <div>
            <p style={S.headerName}>Nova</p>
            <p style={S.headerStatus}>
              <span style={S.statusDot} /> Online · Shopping Assistant
            </p>
          </div>
        </div>
        <div style={S.headerRight}>
          <span style={S.headerTag}>AI Powered</span>
        </div>
      </header>

      {/* ── MESSAGES ── */}
      <div style={S.chatArea} className="nova-scroll">
        {/* Welcome banner */}
        <div style={S.welcomeBanner}>
          <p style={S.welcomeTitle}>How can I help you shop today?</p>
          <div style={S.quickChips}>
            {["📱 Mobiles", "💻 Laptops", "📲 Tablets", "💰 Under ₹20,000"].map((chip) => (
              <button
                key={chip}
                style={S.chip}
                className="chip-btn"
                onClick={() => {
                  setInput(chip.replace(/^[^\s]+\s/, ""));
                  inputRef.current?.focus();
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{ animation: "fadeSlide 0.3s ease forwards", opacity: 0,
              animationDelay: "0.05s" }}
          >
            <Bubble msg={msg} onView={(id) => navigate(`/product/${id}`)} />
          </div>
        ))}

        {/* Typing */}
        {loading && <TypingDots />}

        <div ref={chatEndRef} />
      </div>

      {/* ── INPUT ── */}
      <div style={S.inputArea}>
        <div style={S.inputWrap}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about mobiles, laptops, budget..."
            style={S.input}
            disabled={loading}
            className="nova-input"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              ...S.sendBtn,
              opacity: loading || !input.trim() ? 0.45 : 1,
            }}
            className="send-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p style={S.inputHint}>Press Enter to send · Products shown are from our store only</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
const S = {
  page: {
    width: "100%",
    maxWidth: 780,
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f0f13",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#f0ece4",
    position: "relative",
    overflow: "hidden",
  },

  /* Header */
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    background: "rgba(255,255,255,0.03)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backdropFilter: "blur(12px)",
    flexShrink: 0,
  },
  headerLeft: {
    display: "flex", alignItems: "center", gap: 12,
  },
  headerAvatar: {
    width: 42, height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c9a84c, #f0d080)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 18, color: "#0f0f13",
    boxShadow: "0 0 0 3px rgba(201,168,76,0.2)",
  },
  headerName: {
    margin: 0, fontWeight: 700, fontSize: 16, color: "#f0ece4",
    letterSpacing: "0.3px",
  },
  headerStatus: {
    margin: "2px 0 0", fontSize: 12, color: "#8a8a9a",
    display: "flex", alignItems: "center", gap: 5,
  },
  statusDot: {
    display: "inline-block", width: 7, height: 7,
    borderRadius: "50%", background: "#4ade80",
    boxShadow: "0 0 6px #4ade80",
  },
  headerRight: {},
  headerTag: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.8px",
    textTransform: "uppercase",
    color: "#c9a84c",
    border: "1px solid rgba(201,168,76,0.35)",
    padding: "4px 10px", borderRadius: 20,
  },

  /* Chat area */
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  /* Welcome banner */
  welcomeBanner: {
    textAlign: "center",
    padding: "24px 0 20px",
    marginBottom: 8,
  },
  welcomeTitle: {
    margin: "0 0 14px",
    fontSize: 15,
    color: "#8a8a9a",
    letterSpacing: "0.2px",
  },
  quickChips: {
    display: "flex", flexWrap: "wrap",
    gap: 8, justifyContent: "center",
  },
  chip: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#c9c4ba",
    padding: "7px 14px",
    borderRadius: 20,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },

  /* Messages */
  msgRow: {
    display: "flex",
    marginBottom: 4,
  },
  botMeta: {
    display: "flex", alignItems: "center", gap: 7, marginBottom: 2,
  },
  botAvatar: {
    width: 26, height: 26,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c9a84c, #f0d080)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 11, color: "#0f0f13",
  },
  botName: {
    fontSize: 12, fontWeight: 600, color: "#c9a84c", letterSpacing: "0.3px",
  },
  botBubble: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#e8e4dc",
    padding: "12px 16px",
    borderRadius: "4px 16px 16px 16px",
    fontSize: 14.5,
    lineHeight: 1.6,
    backdropFilter: "blur(8px)",
    maxWidth: 480,
  },
  userBubble: {
    background: "linear-gradient(135deg, #c9a84c, #e8c560)",
    color: "#0f0f13",
    padding: "12px 16px",
    borderRadius: "16px 4px 16px 16px",
    fontSize: 14.5,
    fontWeight: 500,
    lineHeight: 1.6,
    maxWidth: 380,
  },

  /* Products */
  productsRow: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 6,
    maxWidth: "100%",
  },
  card: {
    minWidth: 170,
    maxWidth: 180,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 14,
    padding: "14px 13px",
    flexShrink: 0,
    transition: "all 0.25s ease",
    cursor: "default",
  },
  cardHover: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(201,168,76,0.35)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  badge: {
    fontSize: 10, fontWeight: 600, letterSpacing: "0.6px",
    textTransform: "uppercase",
    color: "#c9a84c",
    background: "rgba(201,168,76,0.12)",
    border: "1px solid rgba(201,168,76,0.25)",
    padding: "3px 8px",
    borderRadius: 20,
  },
  imgWrap: {
    margin: "10px 0 8px",
  },
  imgPlaceholder: {
    height: 64,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  imgIcon: {
    fontSize: 28,
  },
  cardName: {
    margin: "0 0 4px",
    fontSize: 12.5,
    fontWeight: 600,
    color: "#e0dcd4",
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardPrice: {
    margin: "0 0 10px",
    fontSize: 15,
    fontWeight: 700,
    color: "#c9a84c",
  },
  viewBtn: {
    width: "100%",
    padding: "7px 0",
    background: "rgba(201,168,76,0.12)",
    border: "1px solid rgba(201,168,76,0.3)",
    borderRadius: 8,
    color: "#c9a84c",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
    letterSpacing: "0.3px",
  },
  viewBtnHover: {
    background: "#c9a84c",
    color: "#0f0f13",
  },

  /* Typing */
  typingWrap: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 0",
  },
  typingLabel: {
    fontSize: 12, color: "#8a8a9a", fontStyle: "italic",
  },
  dots: {
    display: "flex", gap: 4, alignItems: "center",
  },
  dot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "#c9a84c",
    display: "inline-block",
    animation: "dotBounce 1.2s ease infinite",
  },

  /* Input area */
  inputArea: {
    padding: "14px 20px 18px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(12px)",
    flexShrink: 0,
  },
  inputWrap: {
    display: "flex",
    gap: 10,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: "6px 6px 6px 16px",
    alignItems: "center",
    transition: "border-color 0.2s",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f0ece4",
    fontSize: 14.5,
    fontFamily: "inherit",
    padding: "6px 0",
    caretColor: "#c9a84c",
  },
  sendBtn: {
    width: 40, height: 40,
    borderRadius: 10,
    background: "linear-gradient(135deg, #c9a84c, #e8c560)",
    border: "none",
    color: "#0f0f13",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  inputHint: {
    margin: "8px 0 0",
    fontSize: 11,
    color: "#4a4a5a",
    textAlign: "center",
    letterSpacing: "0.2px",
  },
};

/* ══════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════ */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  body { margin: 0; }

  .nova-scroll::-webkit-scrollbar { width: 4px; }
  .nova-scroll::-webkit-scrollbar-track { background: transparent; }
  .nova-scroll::-webkit-scrollbar-thumb {
    background: rgba(201,168,76,0.25);
    border-radius: 4px;
  }

  .chip-btn:hover {
    background: rgba(201,168,76,0.12) !important;
    border-color: rgba(201,168,76,0.35) !important;
    color: #c9a84c !important;
    transform: translateY(-1px);
  }

  .nova-input::placeholder { color: #4a4a5a; }

  .send-btn:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(201,168,76,0.4);
  }

  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const dotAnim = `
  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-5px); opacity: 1; }
  }
`;