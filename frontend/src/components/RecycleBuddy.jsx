import {useState, useContext, useRef, useEffect} from "react";
import { AuthContext } from "../context/AuthContext";

function RecycleBuddy({onClose}) {
    const {token, user} = useContext(AuthContext);
    
    const initialMessage = 
        user?.role === "Producer"
        ? {
            role: "assistant",
            content:
                "Hi! I'm GreenAssistant. I can help you manage sustainable logistics, optimize packing workflows, reduce waste and improve your green operations."
        } : {
            role: "assistant",
            content:
            "Hi! I'm RecycleBuddy. ask me anything about sustainability, eco-friendly living, or how PackBack helps the planet!"
        };
    
    const [messages, setMessages] = useState([initialMessage]);

    const [input, setInput] = useState("");
        const [isLoading, setIsLoading] = useState (false);
        const bottomRef = useRef(null);

        useEffect(() => {
            bottomRef.current?.scrollIntoView({behavior: "smooth"});
        }, [messages]);

        const sendMessage = async () => {
            if (!input.trim())
                return;
            const userMessage = { role: "user", content: input};
            const updateMessages =  [...messages, userMessage];
            setMessages(updateMessages);
            setInput("");
            setIsLoading(true);
            
            try {
                const response = await fetch (`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        messages: updateMessages,
                        role: user?.role,
                    }),
                });
                const data = await response.json();
                setMessages(prev => [...prev, {role: "assistant", content: data.reply}]);
            } catch {
                setMessages (prev => [...prev, {role: "assistant", content: "Sorry, something went wrong, try later thank you."}]);
            } finally {
                setIsLoading (false);
            }
        };
        
        return (
            <div className="chat-overlay"
            onClick={onClose}>
                <div className="chat-drawer"
                onClick = {(e) =>  e.stopPropagation()}>
                    <div className="chat-header">
                        <h3>
                            {user?.role === "Producer"
                            ?
                            "GreenAssistant"
                            :
                            "RecycleBuddy"
                        }</h3>
                        <button className="bt-close-chat"
                        onClick={onClose}>Close chat </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message-${msg.role === "user" ? "user" : "assistant"}`}>
                                <p>{msg.content}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-mesage-assistant">
                                <p>Thinking...</p>
                            </div>
                        )}
                        <div ref={bottomRef}/>
                    </div>

                    <div className="chat-input-container">
                        <input
                        className="chat-input"
                        type="text"
                        placeholder={
                            user?.role === "Producer" ? 
                            "Ask about logistics, packaging or sustainability" 
                            :
                            "Ask me something green..."
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {if (e.key === "Enter") sendMessage();
                        }}
                        />
                        <button className="chat-send-btn"
                        onClick= {sendMessage}>➤</button>
                    </div>
                </div>
            </div>
        );
}

export default RecycleBuddy;