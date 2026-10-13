import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, ShieldCheck, TriangleAlert, WifiOff } from 'lucide-react';
import { OFFICES, VERIFY_AT } from '../../shared/clearanceData.js';

const SHORT_NAMES = ['Library', 'Department', 'Accounting', 'Guidance', 'OSA', 'Registrar'];

/** Trust badge shown under assistant answers. */
function TrustBadge({ official, source }) {
  return (
    <div className="mt-2 space-y-1">
      {official ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-stamp">
          <ShieldCheck size={13} aria-hidden /> Official information, verified
        </span>
      ) : (
        <p className="flex items-start gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-900">
          <TriangleAlert size={13} className="mt-0.5 shrink-0" aria-hidden />
          <span><strong>Where to verify:</strong> confirm with {VERIFY_AT}.</span>
        </p>
      )}
      {source === 'offline' && (
        <p className="flex items-center gap-1 text-xs text-slate-500"><WifiOff size={12} aria-hidden /> Offline answer from saved clearance data.</p>
      )}
    </div>
  );
}

function Bubble({ m }) {
  const isUser = m.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed sm:max-w-[75%] ${isUser ? 'rounded-br-sm bg-ink text-white' : 'rounded-bl-sm border border-line bg-white'}`}>
        {isUser ? <p>{m.content}</p> : <div className="md"><ReactMarkdown>{m.content}</ReactMarkdown></div>}
        {!isUser && m.id !== 'welcome' && m.official !== undefined && <TrustBadge official={m.official} source={m.source} />}
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, loading, onSend }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  // Auto-scroll to the newest message / typing indicator
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading]);

  const submit = (text) => {
    const t = text.trim();
    if (!t || loading) return;
    onSend(t);
    setInput('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
        {messages.map((m) => <Bubble key={m.id} m={m} />)}
        {loading && (
          <div className="flex justify-start" aria-label="WitBuddy is typing">
            <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 overflow-x-auto border-t border-line bg-white px-3 py-2">
        <button onClick={() => submit("What's my next office?")} className="shrink-0 rounded-full bg-next px-3 py-1.5 text-sm font-semibold">Next office</button>
        {OFFICES.map((o, i) => (
          <button key={o.step} onClick={() => submit(`Where is the ${o.office} and what do I bring?`)}
            className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm hover:bg-mist">
            {SHORT_NAMES[i] ?? o.office}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="flex gap-2 border-t border-line bg-white p-3">
        <input
          value={input} onChange={(e) => setInput(e.target.value)} maxLength={500}
          placeholder="Ask about any clearance office…" aria-label="Your question"
          className="min-w-0 flex-1 rounded-full border border-line bg-mist px-4 py-2.5 text-[15px]"
        />
        <button type="submit" disabled={!input.trim() || loading} aria-label="Send"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-stamp text-white disabled:opacity-40">
          <Send size={18} aria-hidden />
        </button>
      </form>
    </div>
  );
}
