import { useState } from 'react';
const BACKEND_URL= import.meta.env.VITE_BACKEND_URL;

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'bot', text: data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: '⚠️ Error talking to AI' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="w-full">
      <div className="h-64 overflow-y-auto border rounded p-2 mb-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-1 ${
              m.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block bg-muted px-3 py-2 rounded-lg">
              {m.text}
            </span>
          </div>
        ))}
        {loading && (
          <p className="text-sm text-muted-foreground">AI is typing...</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="text-black border rounded px-3 py-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about games..."
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-primary-foreground px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
