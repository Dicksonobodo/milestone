const ChatBubble = ({ message, isUser }) => {
  const time = message.timestamp?.toDate
    ? message.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center mr-2 mt-1 shrink-0">
          <span className="text-white text-[10px] font-bold">M</span>
        </div>
      )}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? "bg-indigo-600 text-white rounded-br-sm"
          : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
      }`}>
        <p>{message.text}</p>
        {time && (
          <p className={`text-[10px] mt-1 ${isUser ? "text-indigo-200" : "text-gray-400"} text-right`}>
            {time}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;