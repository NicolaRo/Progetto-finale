import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RecycleBuddyProps {
  onClose: () => void;
}

function RecycleBuddy({ onClose }: RecycleBuddyProps) {
  const { token, user } = useAuth();

  const initialMessage: Message =
    user?.role === "Producer"
      ? {
          role: "assistant",
          content:
            "Hi! I'm GreenAssistant. I can help you manage sustainable logistics, optimize packing workflows, reduce waste and improve your green operations.",
        }
      : {
          role: "assistant",
          content:
            "Hi! I'm RecycleBuddy. Ask me anything about sustainability, eco-friendly living, or how PackBack helps the planet!",
        };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const updateMessages = [...messages, userMessage];
    setMessages(updateMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messages: updateMessages,
            role: user?.role,
          }),
        }
      );
      if (!response.ok) throw new Error();

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong, try later thank you.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-overlay" onClick={onClose}>
      <div
        className="chat-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={
          user?.role === "Producer"
            ? "GreenAssistant chat"
            : "RecycleBuddy chat"
        }
      >
        <div className="chat-header">
          <h3 className="text-h2">
            {user?.role === "Producer" ? "GreenAssistant" : "RecycleBuddy"}
          </h3>
          <button
            className="btn-close-chat btn btn--destructive"
            onClick={onClose}
          >
            Close chat{" "}
          </button>
        </div>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message-${
                msg.role === "user" ? "user" : "assistant"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message-assistant">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
                <p>Thinking...</p>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-container">
          <input
            className="chat-input"
            type="text"
            placeholder={
              user?.role === "Producer"
                ? "Ask about logistics, packaging or sustainability"
                : "Ask me something green..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            className="chat-send-btn btn btn--primary"
            onClick={sendMessage}
            aria-label="Send message"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecycleBuddy;
