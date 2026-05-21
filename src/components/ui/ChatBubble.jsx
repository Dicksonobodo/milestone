const ChatBubble = ({ message, isUser }) => {
  const time = message.timestamp?.toDate
    ? message.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12,
    }}>
      {/* Admin avatar */}
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, color: "#fff",
          boxShadow: "0 2px 8px rgba(79,70,229,0.3)",
        }}>
          M
        </div>
      )}

      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {/* Bubble */}
        <div style={{
          padding: "10px 14px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
            : "#fff",
          color: isUser ? "#fff" : "#111827",
          fontSize: 14,
          lineHeight: 1.55,
          boxShadow: isUser
            ? "0 4px 16px rgba(79,70,229,0.25)"
            : "0 1px 4px rgba(0,0,0,0.07)",
          border: isUser ? "none" : "1px solid #f0f0f8",
          wordBreak: "break-word",
        }}>
          <p style={{ margin: 0 }}>{message.text}</p>
        </div>

        {/* Time */}
        {time && (
          <span style={{
            fontSize: 10, color: "#9ca3af", fontWeight: 500,
            marginTop: 4, paddingLeft: isUser ? 0 : 2, paddingRight: isUser ? 2 : 0,
          }}>
            {time}
          </span>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: "#e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, color: "#4f46e5",
        }}>
          U
        </div>
      )}
    </div>
  );
};

export default ChatBubble;