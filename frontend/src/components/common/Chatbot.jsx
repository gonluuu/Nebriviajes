// src/components/common/Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../api/chat";
import "./Chatbot.css";

const QUICK_REPLIES = [
  "¿Qué vuelos tienen disponibles?",
  "¿Cuáles son las mejores ofertas?",
  "¿Qué hoteles tenéis?",
];

function Chatbot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [showQuick, setShowQuick] = useState(true);
  const messagesEndRef            = useRef(null);
  const inputRef                  = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 280);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => addBotMsg(
        "¡Hola! 👋 Soy el asistente de NebriViajes. Puedo ayudarte a encontrar vuelos, hoteles, trenes, vehículos, cruceros, paquetes y ofertas. ¿En qué puedo ayudarte?"
      ), 380);
    }
  }, [isOpen]);

  const now = () =>
    new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  function addBotMsg(text) {
    setMessages((prev) => [...prev, { role: "assistant", content: text, time: now() }]);
  }

  async function handleSend(text) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg = { role: "user", content: userText, time: now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setShowQuick(false);

    try {
      const history = updated.map(({ role, content }) => ({ role, content }));
      const reply   = await sendChatMessage(history);
      addBotMsg(reply);
    } catch {
      addBotMsg("Lo siento, ha habido un error de conexión. Asegúrate de que el backend está corriendo.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function handleInputChange(e) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px";
  }

  return (
    <>
      <button
        className="chatbot-toggle"
        onClick={() => isOpen ? setIsOpen(false) : (setIsOpen(true), setShowBadge(false))}
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente de viajes"}
      >
        {showBadge && !isOpen && <span className="chatbot-badge">1</span>}
        {isOpen ? <IconClose /> : <IconChat />}
      </button>

      <div className={`chatbot-window${isOpen ? " open" : ""}`} role="dialog" aria-label="Asistente NebriViajes">
        <div className="chatbot-header">
          <div className="chatbot-header-avatar"><IconPlane /></div>
          <div className="chatbot-header-info">
            <h3>Asistente NebriViajes</h3>
            <p><span className="chatbot-online-dot" /> En línea ahora</p>
          </div>
        </div>

        <div className="chatbot-messages" role="log" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg ${msg.role === "user" ? "user" : "bot"}`}>
              <div className="chatbot-bubble">{msg.content}</div>
              <span className="chatbot-msg-time">{msg.time}</span>
            </div>
          ))}
          {loading && (
            <div className="chatbot-msg bot chatbot-typing">
              <div className="chatbot-bubble">
                <span className="chatbot-dot" /><span className="chatbot-dot" /><span className="chatbot-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {showQuick && messages.length <= 1 && !loading && (
          <div className="chatbot-quick-replies">
            {QUICK_REPLIES.map((qr, i) => (
              <button key={i} className="chatbot-qr-btn" onClick={() => handleSend(qr)}>{qr}</button>
            ))}
          </div>
        )}

        <div className="chatbot-footer">
          <textarea
            ref={inputRef}
            className="chatbot-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta..."
            rows={1}
            disabled={loading}
            aria-label="Mensaje al asistente"
          />
          <button
            className="chatbot-send-btn"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            aria-label="Enviar"
          >
            <IconSend />
          </button>
        </div>
      </div>
    </>
  );
}

function IconChat() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/></svg>;
}
function IconClose() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>;
}
function IconPlane() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconSend() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default Chatbot;
