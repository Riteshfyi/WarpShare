import { useState, useEffect, useRef } from "react";

export default function Chat({
  disabled,
  onSendMessage,
  connectedPeerId,
  messages,
  userId,
}) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
   
      <div className="flex-1 bg-gray-600 rounded-t-md p-4 overflow-auto">
        {messages.length === 0 ? (
          <p className="text-gray-300 italic">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 flex ${
                msg.from === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-md max-w-xs break-words ${
                  msg.from === userId
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

    
      <div className="bg-gray-700 rounded-b-md p-2 flex items-center">
        <textarea
          rows="1"
          placeholder={
            connectedPeerId
              ? `Send message to ${connectedPeerId}`
              : "Not connected"
          }
          className="flex-1 bg-gray-600 rounded-l-md p-2 text-gray-100 focus:outline-none resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-r-md"
          onClick={handleSend}
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </div>
  );
}
