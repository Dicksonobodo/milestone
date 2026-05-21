import { useState, useEffect, useRef } from "react";
import { getAllUsers } from "../../firebase/firestore";
import { db } from "../../firebase/config";
import {
  collection, addDoc, onSnapshot, serverTimestamp,
  query, orderBy, updateDoc, doc,
} from "firebase/firestore";
import ChatBubble from "../ui/ChatBubble";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";

const AdminSupport = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    getAllUsers().then((all) => {
      setUsers(all.filter((u) => u.role !== "admin"));
      setLoadingUsers(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const q = query(
      collection(db, "chats", selectedUser.uid, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      msgs.filter((m) => m.sender === "user" && !m.read).forEach((m) => {
        updateDoc(doc(db, "chats", selectedUser.uid, "messages", m.id), { read: true });
      });
    });
    return unsub;
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!text.trim() || !selectedUser) return;
    setSending(true);
    await addDoc(collection(db, "chats", selectedUser.uid, "messages"), {
      text: text.trim(),
      sender: "admin",
      senderName: "Milestone Support",
      timestamp: serverTimestamp(),
      read: false,
    });
    setText("");
    setSending(false);
  };

  // ── USER LIST ──────────────────────────────────────────────────────────────
  if (!selectedUser) {
    return (
      <div>
        <span style={{
          fontSize: 10, fontWeight: 600, color: "#9ca3af",
          letterSpacing: "1.4px", textTransform: "uppercase",
          display: "block", marginBottom: 10,
        }}>
          User conversations
        </span>

        {loadingUsers ? (
          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #e8eaf0",
            padding: "40px 20px", textAlign: "center",
          }}>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #e8eaf0",
            padding: "40px 20px", textAlign: "center",
          }}>
            <MessageCircle size={28} color="#e5e7eb" style={{ margin: "0 auto 10px" }} />
            <p style={{ fontSize: 13, color: "#9ca3af" }}>No users yet</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {users.map((u) => (
              <button
                key={u.uid}
                onClick={() => { setSelectedUser(u); setMessages([]); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px",
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #e8eaf0",
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "#eef2ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 700, color: "#4f46e5", flexShrink: 0,
                }}>
                  {u.fullName[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                    {u.fullName}
                  </p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.email}
                  </p>
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  padding: "3px 8px", borderRadius: 8,
                  background: "#eef2ff", color: "#4f46e5", flexShrink: 0,
                }}>
                  Tier {u.tier || 1}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── CHAT VIEW ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: "#fff", borderRadius: 20, border: "1px solid #e8eaf0",
      overflow: "hidden", display: "flex", flexDirection: "column",
      height: "62vh",
    }}>
      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid #f0f1f8",
        flexShrink: 0,
      }}>
        <button
          onClick={() => { setSelectedUser(null); setMessages([]); }}
          style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "#f0f1f8", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Back"
        >
          <ArrowLeft size={15} color="#6b7280" />
        </button>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#eef2ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700, color: "#4f46e5", flexShrink: 0,
        }}>
          {selectedUser.fullName[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0 }}>{selectedUser.fullName}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedUser.email}
          </p>
        </div>
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", background: "#f9fafb" }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <MessageCircle size={24} color="#e5e7eb" style={{ marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: "#9ca3af" }}>No messages yet</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isUser={msg.sender === "admin"} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px",
        borderTop: "1px solid #f0f1f8",
        background: "#fff", flexShrink: 0,
      }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendReply()}
          placeholder="Reply to user..."
          style={{
            flex: 1, height: 42, borderRadius: 21,
            border: "1px solid #e5e7eb", background: "#f9fafb",
            padding: "0 16px", fontSize: 14, color: "#111827",
            outline: "none", fontFamily: "inherit",
          }}
        />
        <button
          onClick={sendReply}
          disabled={sending || !text.trim()}
          style={{
            width: 42, height: 42, flexShrink: 0,
            borderRadius: "50%",
            background: sending || !text.trim() ? "#e0e7ff" : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: sending || !text.trim() ? "#a5b4fc" : "#fff",
            cursor: sending || !text.trim() ? "not-allowed" : "pointer",
          }}
          aria-label="Send"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

export default AdminSupport;