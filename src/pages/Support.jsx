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

const Support = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bottomRef = useRef(null);

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
        .forEach((m) => {
          updateDoc(doc(db, "chats", currentUser.uid, "messages", m.id), { read: true });
        });
    });
    return unsub;
  }, [currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    setSending(true);
    await addDoc(collection(db, "chats", currentUser.uid, "messages"), {
      text: text.trim(),
      sender: "user",
      senderName: userData?.fullName || "User",
      timestamp: serverTimestamp(),
      read: false,
    });
    setText("");
    setSending(false);
  };

  return (
    <div style={{ minHeight: "100svh", background: "#f0f1f8", display: "flex", flexDirection: "column", paddingBottom: 88 }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(160deg, #3730a3 0%, #4f46e5 100%)", padding: "52px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* back */}
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

          {/* agent info */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, color: "#fff",
              }}>
                M
              </div>
              <span style={{
                position: "absolute", bottom: 1, right: 1,
                width: 11, height: 11, borderRadius: "50%",
                background: "#34d399",
                border: "2px solid #4338ca",
              }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>
                Milestone Support
              </p>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#6ee7b7", margin: 0, letterSpacing: "0.2px" }}>
                Online · replies within minutes
              </p>
            </div>
          </div>

          {/* unread badge */}
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
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>

        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60, paddingBottom: 40 }}>
            {/* icon card */}
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: "#fff",
              border: "1px solid #e8eaf0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 30, marginBottom: 16,
            }}>
              💬
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
              How can we help?
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, textAlign: "center", maxWidth: 220, lineHeight: 1.6, margin: 0 }}>
              Send us a message and our support team will get back to you shortly.
            </p>

            {/* quick prompts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24, width: "100%" }}>
              {[
                "How do I make a transfer?",
                "My transaction is pending",
                "I need help with my account",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setText(prompt)}
                  style={{
                    width: "100%", padding: "11px 16px",
                    borderRadius: 12,
                    background: "#fff",
                    border: "1px solid #e8eaf0",
                    fontSize: 13, fontWeight: 500, color: "#4f46e5",
                    textAlign: "left", cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isUser={msg.sender === "user"} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── INPUT BAR ── */}
      <div style={{
        position: "fixed", bottom: 68, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        background: "#fff",
        borderTop: "1px solid #f0f1f8",
        padding: "10px 16px",
        zIndex: 30,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1, height: 44, borderRadius: 22,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              padding: "0 16px",
              fontSize: 14, color: "#111827",
              outline: "none", fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            style={{
              width: 44, height: 44, flexShrink: 0,
              borderRadius: "50%",
              background: sending || !text.trim()
                ? "#e0e7ff"
                : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: sending || !text.trim() ? "#a5b4fc" : "#fff",
              cursor: sending || !text.trim() ? "not-allowed" : "pointer",
              transition: "all 0.15s",
            }}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <BottomNav unreadSupport={unreadCount > 0} />
    </div>
  );
};

export default Support;