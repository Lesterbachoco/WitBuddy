import { useState } from 'react';
import { GraduationCap, RotateCcw } from 'lucide-react';
import ChatWindow from './components/ChatWindow.jsx';
import { useLocalStorage } from './lib/useLocalStorage.js';
import { sendChat } from './lib/api.js';

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi, I'm **WitBuddy**, your WIT school assistant. Ask me about campuses and office hours, grades and INC, clearance signing, school life, or anything you need help with.\n\nTry: *\"What time do offices open?\"* or *\"Where is the IT head?\"*",
};

export default function App() {
  const [messages, setMessages] = useLocalStorage('witbuddy.messages', [WELCOME]);
  const [loading, setLoading] = useState(false);

  const ask = async (text) => {
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    const reply = await sendChat(history);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: reply.answer, official: reply.official, general: reply.general, source: reply.source },
    ].slice(-60)); // keep storage small
    setLoading(false);
  };

  const newChat = () => {
    if (messages.length > 1 && !confirm('Start a new chat? This clears the current conversation.')) return;
    setMessages([WELCOME]);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 bg-ink px-4 py-3 text-white">
        <GraduationCap size={24} aria-hidden />
        <div>
          <h1 className="font-display text-lg font-bold leading-tight">WitBuddy</h1>
          <p className="text-xs text-slate-300">Western Institute of Technology</p>
        </div>
        <button onClick={newChat} aria-label="New chat" className="ml-auto flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-white/10">
          <RotateCcw size={16} aria-hidden /> New chat
        </button>
      </header>

      <main className="min-h-0 flex-1">
        <ChatWindow messages={messages} loading={loading} onSend={ask} />
      </main>
    </div>
  );
}