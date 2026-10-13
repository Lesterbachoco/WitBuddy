import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, GraduationCap } from 'lucide-react';
import ChatWindow from './components/ChatWindow.jsx';
import ClearanceTracker from './components/ClearanceTracker.jsx';
import { useLocalStorage } from './lib/useLocalStorage.js';
import { sendChat } from './lib/api.js';
import { OFFICES } from "../shared/clearanceData.js";

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi, I'm **WitBuddy**. I can tell you which clearance office to visit next, where it is, and what to bring.\n\nTry: *\"Who signs my clearance first?\"* or tap an office below.",
};

export default function App() {
  // Two separate persisted states: chatting never touches progress.
  const [completed, setCompleted] = useLocalStorage('witbuddy.completed', []);
  const [messages, setMessages] = useLocalStorage('witbuddy.messages', [WELCOME]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default on phones

  const toggleStep = (step) =>
    setCompleted((c) => (c.includes(step) ? c.filter((s) => s !== step) : [...c, step].sort((a, b) => a - b)));

  const ask = async (text) => {
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setSidebarOpen(false);
    setLoading(true);

    const reply = await sendChat(history, completed);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: reply.answer, official: reply.official, source: reply.source },
    ].slice(-60)); // keep storage small
    setLoading(false);
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 bg-ink px-4 py-3 text-white">
        <button onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle progress tracker" aria-expanded={sidebarOpen}
          className="rounded-md p-1.5 hover:bg-white/10">
          {sidebarOpen ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}
        </button>
        <GraduationCap size={24} aria-hidden />
        <div>
          <h1 className="font-display text-lg font-bold leading-tight">WitBuddy Clearance</h1>
          <p className="text-xs text-slate-300">Western Institute of Technology</p>
        </div>
        <p className="ml-auto text-sm font-semibold">{completed.length}/{OFFICES.length} cleared</p>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Mobile: slides over the chat. Desktop: sits beside it and can be collapsed. */}
        {sidebarOpen && <div className="absolute inset-0 z-10 bg-black/30 md:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside
          className={`absolute inset-y-0 left-0 z-20 w-80 max-w-[85%] border-r border-line bg-mist transition-transform duration-200
            md:static md:max-w-none md:shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}`}
        >
          <ClearanceTracker completed={completed} onToggle={toggleStep} onReset={() => setCompleted([])} onAsk={ask} />
        </aside>

        <main className="min-w-0 flex-1">
          <ChatWindow messages={messages} loading={loading} onSend={ask} />
        </main>
      </div>
    </div>
  );
}
