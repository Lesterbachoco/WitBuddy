import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, GraduationCap } from 'lucide-react';
import ChatWindow from './components/ChatWindow.jsx';
import ClearanceTracker from './components/ClearanceTracker.jsx';
import { useLocalStorage } from './lib/useLocalStorage.js';
import { sendChat } from './lib/api.js';
import { OFFICES } from "../shared/clearanceData.js";
import { officeCard } from "../shared/fallback.js";

const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi, I'm **WitBuddy**. Ask me anything: school life, study help, campus and office hours, or your clearance signing.\n\nTry: *\"Who signs my clearance first?\"* or *\"What time do offices open?\"*",
};

export default function App() {
  // Two separate persisted states: chatting never touches progress.
  const [completed, setCompleted] = useLocalStorage('witbuddy.completed', []);
  const [messages, setMessages] = useLocalStorage('witbuddy.messages', [WELCOME]);
  // Last office shown by "Next office" or marked cleared, so Next keeps moving forward
  const [cursor, setCursor] = useLocalStorage('witbuddy.cursor', 0);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default on phones

  const toggleStep = (step) =>
    setCompleted((c) => (c.includes(step) ? c.filter((s) => s !== step) : [...c, step].sort((a, b) => a - b)));

  const addMessages = (...msgs) => setMessages((prev) => [...prev, ...msgs].slice(-60));
  const newId = () => crypto.randomUUID();

  /** Mark an office cleared (or undo) and move the "next" pointer to it. */
  const markCleared = (step) => {
    toggleStep(step);
    setCursor(step);
  };

  /** "Next office" button: answered locally, advances each press. */
  const goNext = () => {
    setSidebarOpen(false);
    const pending = OFFICES.filter((o) => !completed.includes(o.step));
    const user = { id: newId(), role: 'user', content: "What's my next office?" };
    if (!pending.length) {
      return addMessages(user, { id: newId(), role: 'assistant', official: true, source: 'local',
        content: "All offices are cleared. Claim your clearance certificate at the Registrar's Office if you have not yet." });
    }
    const o = pending.find((x) => x.step > cursor) || pending[0]; // wrap around
    setCursor(o.step);
    addMessages(user, { id: newId(), role: 'assistant', official: true, source: 'local', step: o.step,
      content: `${cursor === 0 ? 'Start here:' : 'Next:'}\n\n${officeCard(o)}\n\nDone here? Tap **Mark as cleared**, then ask for the next office.` });
  };

  const ask = async (text) => {
    // Typed "next" questions behave exactly like the Next office button
    if (/^\s*(what'?s|what is)?\s*(my\s+)?next( office)?\s*[?!.]*\s*$/i.test(text)) return goNext();
    const userMsg = { id: crypto.randomUUID(), role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setSidebarOpen(false);
    setLoading(true);

    const reply = await sendChat(history, completed, cursor);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', content: reply.answer, official: reply.official, general: reply.general, source: reply.source },
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
          <h1 className="font-display text-lg font-bold leading-tight">WitBuddy</h1>
          <p className="text-xs text-slate-300">Western Institute of Technology</p>
        </div>
        <p className="ml-auto text-sm font-semibold">{OFFICES.filter((o) => completed.includes(o.step)).length}/{OFFICES.length} cleared</p>
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
          <ChatWindow messages={messages} loading={loading} onSend={ask} onNext={goNext} completed={completed} onMarkCleared={markCleared} />
        </main>
      </div>
    </div>
  );
}