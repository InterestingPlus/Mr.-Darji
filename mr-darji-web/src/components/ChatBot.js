import React, { useState } from "react";
import { Bot, X, Send } from "lucide-react";

const ChatBot = ({ shopName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`chatbot-wrapper ${isOpen ? "open" : ""}`}>
      {!isOpen ? (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <Bot size={30} />
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <span>{shopName} AI</span>
            <X onClick={() => setIsOpen(false)} style={{ cursor: "pointer" }} />
          </div>
          <div className="chat-body">
            <div className="msg ai">
              Namaste! Main aapka order status check kar sakta hoon.
            </div>
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="Type message..." />
            <button>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
