import { useState, useEffect, useRef } from "react";
import { getAllUsers } from "../../firebase/firestore";
import { db } from "../../firebase/config";
import {
  collection, addDoc, onSnapshot, serverTimestamp,
  query, orderBy, updateDoc, doc,
} from "firebase/firestore";
import ChatBubble from "../ui/ChatBubble";
import { ArrowLeft, Send, MessageCircle, Search } from "lucide-react";

const AdminSupport = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    getAllUsers().then((all) => {
      const list = all.filter((u) => u.role !== "admin");
      setUsers(list);
      setFiltered(list);
      setLoadingUsers(false);
    });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter((u) =>
      u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ));
  }, [search, users]);

  useEffect(() => {
    if (!selectedUser) return;
    const q = query(
      collection(db, "chats", selectedUser.uid, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      msgs.filter((m) => m.sender === "user" && !m.read).forEach((m) =>
        updateDoc(doc(db, "chats", selectedUser.uid, "messages", m.id), { read: true })
      );
    });
    return unsub;
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!text.trim() || !selectedUser || sending) return;
    setSending(true);
    const content = text.trim();
    setText("");
    await addDoc(collection(db, "chats", selectedUser.uid, "messages"), {
      text: content,
      sender: "admin",
      senderName: "Milestone Support",
      timestamp: serverTimestamp(),
      read: false,
    });
    setSending(false);
    inputRef.current?.focus();
  };

  // ── USER LIST ──────────────────────────────────────────────────────────────
  if (!selectedUser) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Search bar */}
        <div style={{ position: "relative" }}>
          <Search size={15} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            style={{
              width: "100%", height: 44, borderRadius: 14,
              border: "1px solid #e8eaf0", background: "#fff",
              paddingLeft: 40, paddingRight: 16,
              fontSize: 13, color: "#111827", fontFamily: "inherit",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "1.2px", textTransform: "uppercase", margin: 0 }}>
          {filtered.length} conversation{filtered.length !== 1 ? "s" : ""}
        </p>

        {loadingUsers ? (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8eaf0", padding: "40px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8eaf0", padding: "40px 20px", textAlign: "center" }}>
            <MessageCircle size={28} color="#e5e7eb" style={{ display: "block", margin: "0 auto 10px" }} />
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>No users found</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((u) => (
              <button
                key={u.uid}
                onClick={() => { setSelectedUser(u); setMessages([]); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", background: "#fff", borderRadius: 16,
                  border: "1px solid #e8eaf0", cursor: "pointer",
                  fontFamily: "inherit", textAlign: "left",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800, color: "#fff",
                  boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
                }}>
                  {u.fullName[0]}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{u.fullName}</p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.email}
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8,
                    background: u.tier === 2 ? "#d1fae5" : "#eef2ff",
                    color: u.tier === 2 ? "#065f46" : "#4f46e5",
                  }}>
                    Tier {u.tier || 1}
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>
                    ${Number(u.balance || 0).toLocaleString()}
                  </div>
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
      height: "62vh", maxHeight: 520,
    }}>
      {/* Chat header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", borderBottom: "1px solid #f0f1f8",
        flexShrink: 0, background: "#fff",
      }}>
        <button
          onClick={() => { setSelectedUser(null); setMessages([]); }}
          style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: "#f0f1f8", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={15} color="#6b7280" />
        </button>

        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color: "#fff",
          boxShadow: "0 3px 10px rgba(79,70,229,0.25)",
        }}>
          {selectedUser.fullName[0]}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0 }}>{selectedUser.fullName}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {selectedUser.email}
          </p>
        </div>

        <div style={{
          fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
          background: selectedUser.tier === 2 ? "#d1fae5" : "#eef2ff",
          color: selectedUser.tier === 2 ? "#065f46" : "#4f46e5", flexShrink: 0,
        }}>
          Tier {selectedUser.tier || 1}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "12px 16px",
        background: "#f9fafb", WebkitOverflowScrolling: "touch",
      }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
            <MessageCircle size={24} color="#e5e7eb" />
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>No messages yet</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} isUser={msg.sender === "admin"} />
        ))}
        <div ref={bottomRef} style={{ height: 4 }} />
      </div>

      {/* Input */}
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
          onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
          placeholder="Reply to user..."
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
          onClick={sendReply}
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
    </div>
  );
};

export default AdminSupport;