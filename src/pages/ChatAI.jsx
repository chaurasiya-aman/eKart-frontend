import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NOVA_GREETING = {
  type: "bot",
  text: "Hey there! I am Nova, your personal shopping assistant. Tell me what you are looking for and I will find the best options for you!",
  products: [],
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem("nova-chat");
    return saved ? JSON.parse(saved) : [NOVA_GREETING];
  } catch {
    return [NOVA_GREETING];
  }
};

const saveToStorage = (messages) => {
  const trimmed = messages.slice(-30).map((msg) => ({ ...msg, products: [] }));
  try {
    localStorage.setItem("nova-chat", JSON.stringify(trimmed));
  } catch (err) {
    if (err.name === "QuotaExceededError") {
      try {
        localStorage.setItem("nova-chat", JSON.stringify(trimmed.slice(-10)));
      } catch {
        localStorage.removeItem("nova-chat");
      }
    }
  }
};

function TypingDots() {
  return (
    <div style={S.typingWrap}>
      <div style={S.botAvatar}>N</div>
      <div style={S.typingBubble}>
        <span style={S.typingLabel}>Nova is typing</span>
        <div style={S.dots}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ ...S.dot, animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onView }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imageUrl = product.productImage?.[0]?.url;

  return (
    <div
      style={{ ...S.card, ...(hovered ? S.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {product.category && <span style={S.badge}>{product.category}</span>}
      <div style={S.imgWrap}>
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.productName}
            style={S.productImg}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={S.imgFallback}>
            <span style={S.imgFallbackText}>
              {product.category || product.brand || "Product"}
            </span>
          </div>
        )}
      </div>
      {product.brand && <p style={S.cardBrand}>{product.brand}</p>}
      <p style={S.cardName}>{product.productName}</p>
      <p style={S.cardPrice}>Rs.{Number(product.productPrice).toLocaleString("en-IN")}</p>
      <button
        style={{ ...S.viewBtn, ...(hovered ? S.viewBtnHover : {}) }}
        onClick={() => onView(product._id)}
      >
        View Product
      </button>
    </div>
  );
}

function Bubble({ msg, onView }) {
  const isUser = msg.type === "user";
  return (
    <div style={{ ...S.msgRow, justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div style={{
        maxWidth: "80%", display: "flex", flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start", gap: 8,
      }}>
        {!isUser && (
          <div style={S.botMeta}>
            <div style={S.botAvatar}>N</div>
            <span style={S.botName}>Nova</span>
          </div>
        )}
        <div style={isUser ? S.userBubble : S.botBubble}>{msg.text}</div>
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

function Sidebar({ filters, onChipClick }) {
  const tips = [
    "Ask for recommendations by use-case",
    "Mention your budget for better results",
    "Ask Nova to compare two products",
    "Need a gift? Nova can help pick one",
  ];

  return (
    <aside style={S.sidebar} className="desktop-sidebar">
      {filters.categories.length > 0 && (
        <>
          <p style={S.sidebarTitle}>Categories</p>
          <div style={S.sidebarChips}>
            {filters.categories.map((cat) => (
              <button key={cat} style={S.sidebarChip} className="sidebar-chip" onClick={() => onChipClick(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div style={S.sidebarDivider} />
        </>
      )}

      {filters.brands.length > 0 && (
        <>
          <p style={S.sidebarTitle}>Brands</p>
          <div style={S.sidebarChips}>
            {filters.brands.map((brand) => (
              <button key={brand} style={S.sidebarChip} className="sidebar-chip" onClick={() => onChipClick(brand)}>
                {brand}
              </button>
            ))}
          </div>
          <div style={S.sidebarDivider} />
        </>
      )}

      <p style={S.sidebarTitle}>Tips</p>
      <div style={S.tipsList}>
        {tips.map((t, i) => (
          <div key={i} style={S.tipItem}>
            <span style={S.tipDot} />
            <span style={S.tipText}>{t}</span>
          </div>
        ))}
      </div>

      <div style={S.sidebarDivider} />

      <div style={S.novaCard}>
        <div style={S.novaCardAvatar}>N</div>
        <div>
          <p style={S.novaCardName}>Nova AI</p>
          <p style={S.novaCardSub}>Always here to help</p>
        </div>
        <span style={S.novaCardDot} />
      </div>
    </aside>
  );
}

export default function ChatAI() {
  const [input, setInput]                 = useState("");
  const [messages, setMessages]           = useState(loadFromStorage);
  const [loading, setLoading]             = useState(false);
  const [slowWarning, setSlowWarning]     = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [filters, setFilters]             = useState({ categories: [], brands: [] });
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  const chatEndRef  = useRef(null);
  const chatAreaRef = useRef(null);
  const inputRef    = useRef(null);
  const navigate    = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/products`);
        const data = await res.json();
        const products = data.products || data || [];
        const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
        const brands     = [...new Set(products.map((p) => p.brand).filter(Boolean))];
        setFilters({ categories, brands });
      } catch {
        setFilters({ categories: [], brands: [] });
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    saveToStorage(messages);
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = chatAreaRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScrollBtn(el.scrollTop < el.scrollHeight - el.clientHeight - 120);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { type: "user", text: trimmed, products: [] };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setSlowWarning(false);

    const slowTimer    = setTimeout(() => setSlowWarning(true), 5000);
    const controller   = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 15000);

    try {
      const historyToSend = updated
        .slice(1, -1)
        .slice(-10)
        .map(({ type, text: t }) => ({
          role: type === "user" ? "user" : "assistant",
          content: t,
        }));

      const res = await fetch(`${API_URL}/api/v1/chat/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, conversationHistory: historyToSend }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (updated.length > 40) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Our chat is getting long. Consider clearing it for faster responses.", products: [] },
        ]);
      }

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply, products: data.products || [] },
      ]);
    } catch (err) {
      const errText = err.name === "AbortError"
        ? "That took too long. Please try again or rephrase your question."
        : "Oops! Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { type: "bot", text: errText, products: [] }]);
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(timeoutTimer);
      setLoading(false);
      setSlowWarning(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChipClick = (query) => {
    setSidebarOpen(false);
    sendMessage(query);
  };

  const clearChat = () => {
    setMessages([NOVA_GREETING]);
    localStorage.removeItem("nova-chat");
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div style={S.root}>
        <div style={S.layout}>

          <Sidebar filters={filters} onChipClick={handleChipClick} />

          {sidebarOpen && (
            <div style={S.overlay} onClick={() => setSidebarOpen(false)}>
              <div style={S.drawerPanel} onClick={(e) => e.stopPropagation()}>
                <Sidebar filters={filters} onChipClick={handleChipClick} />
              </div>
            </div>
          )}

          <div style={S.chatPanel}>

            <header style={S.header}>
              <div style={S.headerLeft}>
                <button style={S.menuBtn} className="menu-btn" onClick={() => setSidebarOpen(true)}>
                  <span style={S.menuLine} />
                  <span style={S.menuLine} />
                  <span style={S.menuLine} />
                </button>
                <div style={S.headerAvatar}>N</div>
                <div>
                  <p style={S.headerName}>Nova</p>
                  <p style={S.headerStatus}>
                    <span style={S.statusDot} /> Online · Shopping Assistant
                  </p>
                </div>
              </div>
              <div style={S.headerRight}>
                <button style={S.clearBtn} className="clear-btn" onClick={clearChat}>
                  Clear Chat
                </button>
                <span style={S.headerTag} className="header-tag">AI Powered</span>
              </div>
            </header>

            <div style={S.chatArea} className="nova-scroll" ref={chatAreaRef}>
              <div style={S.welcomeBanner}>
                <p style={S.welcomeTitle}>How can I help you shop today?</p>
                <div style={S.quickChips}>
                  {filters.categories.slice(0, 5).map((cat) => (
                    <button key={cat} style={S.chip} className="chip-btn" onClick={() => handleChipClick(cat)}>
                      {cat}
                    </button>
                  ))}
                  {filters.brands.slice(0, 3).map((brand) => (
                    <button key={brand} style={S.chip} className="chip-btn" onClick={() => handleChipClick(brand)}>
                      {brand}
                    </button>
                  ))}
                  <button style={S.chip} className="chip-btn" onClick={() => handleChipClick("best deals affordable")}>
                    Best Deals
                  </button>
                </div>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className="msg-anim">
                  <Bubble msg={msg} onView={(id) => navigate(`/product/${id}`)} />
                </div>
              ))}

              {loading && <TypingDots />}

              {slowWarning && (
                <p style={S.slowWarning}>Almost there, Nova is thinking hard...</p>
              )}

              <div ref={chatEndRef} />
            </div>

            {showScrollBtn && (
              <button
                style={S.scrollBtn}
                className="scroll-btn"
                onClick={() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Down
              </button>
            )}

            <div style={S.inputArea}>
              <div style={S.inputWrap} className="input-wrap">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask about products, budget, brands..."
                  style={S.input}
                  disabled={loading}
                  className="nova-input"
                />
                {input && (
                  <button style={S.clearInputBtn} className="clear-input-btn" onClick={() => setInput("")}>
                    x
                  </button>
                )}
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{ ...S.sendBtn, opacity: loading || !input.trim() ? 0.45 : 1 }}
                  className="send-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p style={S.inputHint}>Press Enter to send · Products shown are from our store only</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

const gold      = "#c9a84c";
const goldLight = "#e8c560";
const dark      = "#0f0f13";
const border    = "rgba(255,255,255,0.08)";
const textColor = "#f0ece4";
const muted     = "#8a8a9a";

const S = {
  root: {
    minHeight: "100vh",
    width: "100%",
    background: dark,
    display: "flex",
    alignItems: "stretch",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: textColor,
  },
  layout: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: "rgba(255,255,255,0.02)",
    borderRight: `1px solid ${border}`,
    padding: "24px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },
  sidebarTitle: {
    margin: "0 0 6px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: muted,
  },
  sidebarChips: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  sidebarChip: {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${border}`,
    color: "#c9c4ba",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 13,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    transition: "all 0.2s",
  },
  sidebarDivider: {
    height: 1,
    background: border,
    margin: "6px 0",
  },
  tipsList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tipItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
  },
  tipDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: gold,
    flexShrink: 0,
    marginTop: 5,
    opacity: 0.7,
  },
  tipText: {
    fontSize: 12,
    color: muted,
    lineHeight: 1.5,
  },
  novaCard: {
    marginTop: "auto",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px",
    background: "rgba(201,168,76,0.06)",
    border: `1px solid rgba(201,168,76,0.2)`,
    borderRadius: 12,
    position: "relative",
  },
  novaCardAvatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 12,
    color: dark,
  },
  novaCardName: { margin: 0, fontSize: 13, fontWeight: 700, color: textColor },
  novaCardSub:  { margin: "2px 0 0", fontSize: 11, color: muted },
  novaCardDot: {
    position: "absolute", top: 10, right: 10,
    width: 7, height: 7, borderRadius: "50%",
    background: "#4ade80", boxShadow: "0 0 6px #4ade80",
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.65)",
    zIndex: 200,
    backdropFilter: "blur(4px)",
    display: "flex",
  },
  drawerPanel: {
    width: 260,
    height: "100%",
    background: "#14141a",
    overflowY: "auto",
    borderRight: `1px solid ${border}`,
  },
  chatPanel: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    position: "relative",
    minWidth: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 18px",
    background: "rgba(255,255,255,0.025)",
    borderBottom: `1px solid ${border}`,
    backdropFilter: "blur(12px)",
    flexShrink: 0,
    gap: 8,
  },
  headerLeft:   { display: "flex", alignItems: "center", gap: 10, minWidth: 0 },
  menuBtn: {
    display: "none",
    flexDirection: "column",
    gap: 4,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    flexShrink: 0,
  },
  menuLine: {
    display: "block",
    width: 20, height: 2,
    background: muted, borderRadius: 2,
  },
  headerAvatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 16, color: dark,
    boxShadow: `0 0 0 3px rgba(201,168,76,0.2)`,
    flexShrink: 0,
  },
  headerName:   { margin: 0, fontWeight: 700, fontSize: 15, color: textColor },
  headerStatus: {
    margin: "2px 0 0", fontSize: 11, color: muted,
    display: "flex", alignItems: "center", gap: 5,
  },
  statusDot: {
    display: "inline-block", width: 6, height: 6,
    borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  clearBtn: {
    background: "transparent", border: `1px solid ${border}`,
    color: muted, padding: "5px 10px", borderRadius: 8,
    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
    transition: "all 0.2s", whiteSpace: "nowrap",
  },
  headerTag: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.9px",
    textTransform: "uppercase", color: gold,
    border: `1px solid rgba(201,168,76,0.35)`,
    padding: "4px 8px", borderRadius: 20, whiteSpace: "nowrap",
  },
  chatArea: {
    flex: 1, overflowY: "auto",
    padding: "20px 16px",
    display: "flex", flexDirection: "column", gap: 6,
  },
  welcomeBanner: {
    textAlign: "center",
    padding: "20px 0 18px",
    marginBottom: 6,
  },
  welcomeTitle: {
    margin: "0 0 14px", fontSize: 14,
    color: muted, letterSpacing: "0.2px",
  },
  quickChips: {
    display: "flex", flexWrap: "wrap",
    gap: 7, justifyContent: "center",
  },
  chip: {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${border}`,
    color: "#c9c4ba", padding: "6px 13px",
    borderRadius: 20, fontSize: 12.5,
    cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
  },
  msgRow:  { display: "flex", marginBottom: 4 },
  botMeta: { display: "flex", alignItems: "center", gap: 7, marginBottom: 2 },
  botAvatar: {
    width: 26, height: 26, borderRadius: "50%",
    background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 11, color: dark, flexShrink: 0,
  },
  botName: { fontSize: 12, fontWeight: 600, color: gold, letterSpacing: "0.3px" },
  botBubble: {
    background: "rgba(255,255,255,0.055)",
    border: `1px solid rgba(255,255,255,0.09)`,
    color: "#e8e4dc", padding: "12px 16px",
    borderRadius: "4px 16px 16px 16px",
    fontSize: 14, lineHeight: 1.65,
    backdropFilter: "blur(8px)", maxWidth: "100%",
  },
  userBubble: {
    background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
    color: dark, padding: "12px 16px",
    borderRadius: "16px 4px 16px 16px",
    fontSize: 14, fontWeight: 500, lineHeight: 1.65, maxWidth: "100%",
  },
  productsRow: {
    display: "flex", gap: 12,
    overflowX: "auto", paddingBottom: 8, maxWidth: "100%",
  },
  card: {
    minWidth: 160, maxWidth: 175,
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${border}`,
    borderRadius: 14, padding: "12px",
    flexShrink: 0, transition: "all 0.25s ease",
  },
  cardHover: {
    background: "rgba(255,255,255,0.08)",
    border: `1px solid rgba(201,168,76,0.35)`,
    transform: "translateY(-3px)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
  },
  badge: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.7px",
    textTransform: "uppercase", color: gold,
    background: "rgba(201,168,76,0.1)",
    border: `1px solid rgba(201,168,76,0.22)`,
    padding: "2px 7px", borderRadius: 20,
  },
  imgWrap: {
    margin: "10px 0 8px", borderRadius: 10,
    overflow: "hidden", height: 110,
  },
  productImg: {
    width: "100%", height: "100%",
    objectFit: "cover", display: "block", borderRadius: 10,
  },
  imgFallback: {
    width: "100%", height: "100%",
    background: "rgba(255,255,255,0.04)", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  imgFallbackText: { fontSize: 11, color: muted, textAlign: "center", padding: "0 8px" },
  cardBrand: {
    margin: "0 0 2px", fontSize: 10, fontWeight: 600,
    color: muted, textTransform: "uppercase", letterSpacing: "0.5px",
  },
  cardName: {
    margin: "0 0 4px", fontSize: 12.5, fontWeight: 600,
    color: "#e0dcd4", lineHeight: 1.4,
    display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  cardPrice: { margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: gold },
  viewBtn: {
    width: "100%", padding: "7px 0",
    background: "rgba(201,168,76,0.1)",
    border: `1px solid rgba(201,168,76,0.28)`,
    borderRadius: 8, color: gold, fontSize: 12, fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s",
    fontFamily: "inherit", letterSpacing: "0.3px",
  },
  viewBtnHover:  { background: gold, color: dark },
  typingWrap:    { display: "flex", alignItems: "center", gap: 10, padding: "8px 0" },
  typingBubble: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${border}`,
    padding: "8px 14px", borderRadius: "4px 14px 14px 14px",
  },
  typingLabel:   { fontSize: 12, color: muted, fontStyle: "italic" },
  dots:          { display: "flex", gap: 4, alignItems: "center" },
  dot: {
    width: 5, height: 5, borderRadius: "50%", background: gold,
    display: "inline-block", animation: "dotBounce 1.2s ease infinite",
  },
  slowWarning: {
    textAlign: "center", fontSize: 12,
    color: muted, margin: "4px 0", fontStyle: "italic",
  },
  scrollBtn: {
    position: "absolute", bottom: 86, right: 16,
    padding: "6px 12px", borderRadius: 20,
    background: gold, color: dark, border: "none",
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    transition: "transform 0.2s", zIndex: 10,
  },
  inputArea: {
    padding: "12px 16px 16px",
    borderTop: `1px solid ${border}`,
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(12px)", flexShrink: 0,
  },
  inputWrap: {
    display: "flex", gap: 8,
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${border}`,
    borderRadius: 14, padding: "6px 6px 6px 14px",
    alignItems: "center", transition: "border-color 0.2s",
  },
  input: {
    flex: 1, background: "transparent",
    border: "none", outline: "none",
    color: textColor, fontSize: 14,
    fontFamily: "inherit", padding: "6px 0",
    caretColor: gold, minWidth: 0,
  },
  clearInputBtn: {
    background: "transparent", border: "none",
    color: muted, fontSize: 13, cursor: "pointer",
    padding: "0 4px", lineHeight: 1, flexShrink: 0, fontFamily: "inherit",
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 10,
    background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
    border: "none", color: dark, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "all 0.2s", fontFamily: "inherit",
  },
  inputHint: {
    margin: "7px 0 0", fontSize: 11,
    color: "#3a3a4a", textAlign: "center", letterSpacing: "0.2px",
  },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { margin: 0; padding: 0; background: #0f0f13; height: 100%; }

  .nova-scroll::-webkit-scrollbar { width: 4px; }
  .nova-scroll::-webkit-scrollbar-track { background: transparent; }
  .nova-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.22); border-radius: 4px; }

  .chip-btn:hover, .sidebar-chip:hover {
    background: rgba(201,168,76,0.1) !important;
    border-color: rgba(201,168,76,0.35) !important;
    color: #c9a84c !important;
    transform: translateY(-1px);
  }

  .nova-input::placeholder { color: #3a3a4a; }

  .input-wrap:focus-within {
    border-color: rgba(201,168,76,0.4) !important;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
  }

  .send-btn:hover:not(:disabled) {
    transform: scale(1.06);
    box-shadow: 0 4px 18px rgba(201,168,76,0.4);
  }

  .clear-btn:hover {
    border-color: rgba(255,255,255,0.2) !important;
    color: #f0ece4 !important;
  }

  .scroll-btn:hover  { transform: scale(1.05); }
  .clear-input-btn:hover { color: #f0ece4 !important; }

  .msg-anim {
    animation: fadeSlide 0.28s ease forwards;
    opacity: 0;
  }

  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40%           { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .desktop-sidebar { display: none !important; }
    .menu-btn        { display: flex !important; }
    .header-tag      { display: none !important; }
  }
`;