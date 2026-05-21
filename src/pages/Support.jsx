import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase/config";
import {
  collection, addDoc, onSnapshot, serverTimestamp,
  query, orderBy, updateDoc, doc,
} from "firebase/firestore";
import BottomNav from "../components/ui/BottomNav";
import ChatBubble from "../components/ui/ChatBubble";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QUICK_PROMPTS = [
  "How do I make a transfer?",
  "My transaction is pending",
  "I need help with my account",
];

const Support = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "chats", currentUser.uid, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      const unread = msgs.filter((m) => m.sender === "admin" && !m.read).length;
      setUnreadCount(unread);
      msgs
        .filter((m) => m.sender === "admin" && !m.read)
        .forEach((m) =>
          updateDoc(doc(db, "chats", currentUser.uid, "messages", m.id), { read: true })
        );
    });
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText) => {
    const content = (messageText || text).trim();
    if (!content || sending) return;
    setSending(true);
    if (!messageText) setText("");
    await addDoc(collection(db, "chats", currentUser.uid, "messages"), {
      text: content,
      sender: "user",
      senderName: userData?.fullName || "User",
      timestamp: serverTimestamp(),
      read: false,
    });
    setSending(false);
    inputRef.current?.focus();
  };

  const handleQuickPrompt = (prompt) => {
    sendMessage(prompt);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      maxWidth: 430,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      background: "#f0f1f8",
      overflow: "hidden",
    }}>

      {/* ── HEADER ── */}
      <div style={{
        flexShrink: 0,
        background: "linear-gradient(160deg, #3730a3 0%, #5b5bd6 100%)",
        padding: "52px 20px 18px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", cursor: "pointer",
            }}
          >
            <ArrowLeft size={17} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 800, color: "#fff",
              }}>
                M
              </div>
              <span style={{
                position: "absolute", bottom: 1, right: 1,
                width: 11, height: 11, borderRadius: "50%",
                background: "#34d399", border: "2px solid #4338ca",
              }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>
                Milestone Support
              </p>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#6ee7b7", margin: 0 }}>
                Online · replies within minutes
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <div style={{
              background: "#ef4444", color: "#fff",
              fontSize: 10, fontWeight: 700,
              minWidth: 20, height: 20, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 5px",
            }}>
              {unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 16px 8px",
        WebkitOverflowScrolling: "touch",
        display: "flex",
        flexDirection: "column",
      }}>
        {messages.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", flex: 1,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: "#fff", border: "1px solid #e8eaf0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, marginBottom: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            }}>
              💬
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
              How can we help?
            </p>
            <p style={{
              fontSize: 12, color: "#9ca3af", fontWeight: 500,
              textAlign: "center", maxWidth: 220, lineHeight: 1.65, margin: 0,
            }}>
              Send us a message and our support team will get back to you shortly.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24, width: "100%", maxWidth: 280 }}>
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleQuickPrompt(p)}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 14,
                    background: "#fff", border: "1px solid #e8eaf0",
                    fontSize: 13, fontWeight: 600, color: "#4f46e5",
                    textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "#eef2ff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 14,
                  }}>
                    {p.includes("transfer") ? "↔" : p.includes("pending") ? "⏳" : "👤"}
                  </span>
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} isUser={msg.sender === "user"} />
            ))}
            <div ref={bottomRef} style={{ height: 8 }} />
          </>
        )}
      </div>

      {/* ── INPUT BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px", borderTop: "1px solid #f0f1f8",
        background: "#fff", flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Type a message..."
          style={{
            flex: 1, height: 42, borderRadius: 21,
            border: "1.5px solid #e5e7eb", background: "#f9fafb",
            padding: "0 16px", fontSize: 14, color: "#111827",
            outline: "none", fontFamily: "inherit", transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#6366f1"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !text.trim()}
          style={{
            width: 42, height: 42, flexShrink: 0,
            borderRadius: "50%",
            background: sending || !text.trim()
              ? "#e0e7ff"
              : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: sending || !text.trim() ? "#a5b4fc" : "#fff",
            cursor: sending || !text.trim() ? "not-allowed" : "pointer",
            boxShadow: sending || !text.trim() ? "none" : "0 4px 12px rgba(79,70,229,0.3)",
            transition: "all 0.15s",
          }}
        >
          <Send size={15} />
        </button>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{ flexShrink: 0 }}>
        <BottomNav unreadSupport={unreadCount > 0} />
      </div>
    </div>
  );
};

export default Support;