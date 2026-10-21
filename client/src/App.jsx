import { useEffect, useRef, useState } from 'react';

const time = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function App() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m RuleBot 🤖 Ask me something, or type "help".', time: time() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch('/api/suggestions')
      .then((r) => r.json())
      .then((d) => setSuggestions(d.suggestions || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function send(text) {
    const message = text.trim();
    if (!message || typing) return;

    setMessages((m) => [...m, { from: 'user', text: message, time: time() }]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      // Small delay so the "typing" indicator feels natural
      await new Promise((r) => setTimeout(r, 400));
      setMessages((m) => [...m, { from: 'bot', text: data.reply, time: time() }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          from: 'bot',
          text: '⚠️ Cannot reach the server. Start it from the chatbot folder with: npm run dev (or cd server, then npm start).',
          time: time(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="page">
      <div className="chat">
        <header className="chat-header">
          <div className="avatar">🤖</div>
          <div>
            <h1>RuleBot</h1>
            <span className="status">● Online</span>
          </div>
        </header>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`row ${m.from}`}>
              <div className="bubble">
                {m.text}
                <span className="time">{m.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="row bot">
              <div className="bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chips">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} disabled={typing}>
              {s}
            </button>
          ))}
        </div>

        <form
          className="composer"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            autoFocus
          />
          <button type="submit" disabled={!input.trim() || typing}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
