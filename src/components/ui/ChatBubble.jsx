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
      marginBottom: 16,
      padding: "0 4px",
    }}>
      {/* Admin avatar */}
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#fff",
          marginBottom: 2,
        }}>
          M
        </div>
      )}

      <div style={{
        maxWidth: "75%",
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 4,
      }}>
        <div style={{
          padding: "11px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser
            ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
            : "#fff",
          color: isUser ? "#fff" : "#111827",
          fontSize: 14,
          lineHeight: 1.6,
          boxShadow: isUser
            ? "0 4px 14px rgba(79,70,229,0.25)"
            : "0 1px 6px rgba(0,0,0,0.07)",
          border: isUser ? "none" : "1px solid #ebebf5",
          wordBreak: "break-word",
        }}>
          <p style={{ margin: 0 }}>{message.text}</p>
        </div>

        {time && (
          <span style={{
            fontSize: 10,
            color: "#9ca3af",
            fontWeight: 500,
            paddingLeft: isUser ? 0 : 4,
            paddingRight: isUser ? 4 : 0,
          }}>
            {time}
          </span>
        )}
      </div>

      {/* User avatar */}
      {isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
          background: "#e0e7ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#4f46e5",
          marginBottom: 2,
        }}>
          U
        </div>
      )}
    </div>
  );
};

export default ChatBubble;