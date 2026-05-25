import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/utils/ChatAI.css";

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
    <div className="nova-typing-wrap">
      <div className="nova-bot-avatar">N</div>
      <div className="nova-typing-bubble">
        <span className="nova-typing-label">Nova is typing</span>
        <div className="nova-dots">
          {[0, 1, 2].map((i) => (
            <span key={i} className="nova-dot" style={{ animationDelay: `${i * 0.18}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onView }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = product.productImage?.[0]?.url;

  return (
    <div className="nova-card-product">
      {product.category && <span className="nova-product-badge">{product.category}</span>}
      <div className="nova-img-wrap">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.productName}
            className="nova-product-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="nova-img-fallback">
            <span className="nova-img-fallback-text">
              {product.category || product.brand || "Product"}
            </span>
          </div>
        )}
      </div>
      {product.brand && <p className="nova-card-brand">{product.brand}</p>}
      <p className="nova-card-name">{product.productName}</p>
      <p className="nova-card-price">Rs.{Number(product.productPrice).toLocaleString("en-IN")}</p>
      <button className="nova-view-btn" onClick={() => onView(product._id)}>
        View Product
      </button>
    </div>
  );
}

function Bubble({ msg, onView }) {
  const isUser = msg.type === "user";
  return (
    <div className="nova-msg-row" style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div className="nova-msg-inner" style={{ alignItems: isUser ? "flex-end" : "flex-start" }}>
        {!isUser && (
          <div className="nova-bot-meta">
            <div className="nova-bot-avatar">N</div>
            <span className="nova-bot-name">Nova</span>
          </div>
        )}
        <div className={isUser ? "nova-user-bubble" : "nova-bot-bubble"}>{msg.text}</div>
        {!isUser && msg.products?.length > 0 && (
          <div className="nova-products-row">
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
    <aside className="nova-sidebar">
      {filters.categories.length > 0 && (
        <>
          <p className="nova-sidebar-title">Categories</p>
          <div className="nova-sidebar-chips">
            {filters.categories.map((cat) => (
              <button key={cat} className="nova-sidebar-chip" onClick={() => onChipClick(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <div className="nova-sidebar-divider" />
        </>
      )}

      {filters.brands.length > 0 && (
        <>
          <p className="nova-sidebar-title">Brands</p>
          <div className="nova-sidebar-chips">
            {filters.brands.map((brand) => (
              <button key={brand} className="nova-sidebar-chip" onClick={() => onChipClick(brand)}>
                {brand}
              </button>
            ))}
          </div>
          <div className="nova-sidebar-divider" />
        </>
      )}

      <p className="nova-sidebar-title">Tips</p>
      <div className="nova-tips-list">
        {tips.map((t, i) => (
          <div key={i} className="nova-tip-item">
            <span className="nova-tip-dot" />
            <span className="nova-tip-text">{t}</span>
          </div>
        ))}
      </div>

      <div className="nova-sidebar-divider" />

      <div className="nova-card">
        <div className="nova-card-avatar">N</div>
        <div>
          <p className="nova-card-name">Nova AI</p>
          <p className="nova-card-sub">Always here to help</p>
        </div>
        <span className="nova-card-dot" />
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
        const res = await fetch(`${API_URL}/api/v1/product/all-products`);
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
    <div className="nova-root">
      <div className="nova-layout">

        <Sidebar filters={filters} onChipClick={handleChipClick} />

        {sidebarOpen && (
          <div className="nova-overlay" onClick={() => setSidebarOpen(false)}>
            <div className="nova-drawer-panel" onClick={(e) => e.stopPropagation()}>
              <Sidebar filters={filters} onChipClick={handleChipClick} />
            </div>
          </div>
        )}

        <div className="nova-chat-panel">

          <header className="nova-header">
            <div className="nova-header-left">
              <button className="nova-menu-btn" onClick={() => setSidebarOpen(true)}>
                <span className="nova-menu-line" />
                <span className="nova-menu-line" />
                <span className="nova-menu-line" />
              </button>
              <div className="nova-header-avatar">N</div>
              <div>
                <p className="nova-header-name">Nova</p>
                <p className="nova-header-status">
                  <span className="nova-status-dot" /> Online · Shopping Assistant
                </p>
              </div>
            </div>
            <div className="nova-header-right">
              <button className="nova-clear-btn" onClick={clearChat}>
                Clear Chat
              </button>
              <span className="nova-header-tag">AI Powered</span>
            </div>
          </header>

          <div className="nova-chat-area nova-scroll" ref={chatAreaRef}>
            <div className="nova-welcome-banner">
              <p className="nova-welcome-title">How can I help you shop today?</p>
              <div className="nova-quick-chips">
                {filters.categories.slice(0, 5).map((cat) => (
                  <button key={cat} className="nova-chip" onClick={() => handleChipClick(cat)}>
                    {cat}
                  </button>
                ))}
                {filters.brands.slice(0, 3).map((brand) => (
                  <button key={brand} className="nova-chip" onClick={() => handleChipClick(brand)}>
                    {brand}
                  </button>
                ))}
                <button className="nova-chip" onClick={() => handleChipClick("best deals affordable")}>
                  Best Deals
                </button>
              </div>
            </div>

            {messages.map((msg, i) => (
              <div key={i} className="nova-msg-anim">
                <Bubble msg={msg} onView={(id) => navigate(`/product/${id}`)} />
              </div>
            ))}

            {loading && <TypingDots />}

            {slowWarning && (
              <p className="nova-slow-warning">Almost there, Nova is thinking hard...</p>
            )}

            <div ref={chatEndRef} />
          </div>

          {showScrollBtn && (
            <button
              className="nova-scroll-btn"
              onClick={() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Down
            </button>
          )}

          <div className="nova-input-area">
            <div className="nova-input-wrap">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about products, budget, brands..."
                className="nova-input"
                disabled={loading}
              />
              {input && (
                <button className="nova-clear-input-btn" onClick={() => setInput("")}>
                  x
                </button>
              )}
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="nova-send-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="nova-input-hint">Press Enter to send · Products shown are from our store only</p>
          </div>

        </div>
      </div>
    </div>
  );
}