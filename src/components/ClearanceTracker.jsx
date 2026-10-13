import { Check, MapPin, RotateCcw, ArrowRight } from 'lucide-react';
import { OFFICES } from '../../shared/clearanceData.js';

/**
 * Progress checklist styled like a clearance slip.
 * State lives in App (persisted), so chatting never resets it.
 */
export default function ClearanceTracker({ completed, onToggle, onReset, onAsk }) {
  const total = OFFICES.length;
  const done = completed.length;
  const pct = Math.round((done / total) * 100);
  const next = OFFICES.find((o) => !completed.includes(o.step));

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-4">
        <h2 className="font-display text-lg font-bold">Clearance progress</h2>
        <p className="mt-1 text-sm" aria-live="polite">
          <span className="font-semibold">{done} out of {total}</span> offices cleared ({pct}%)
        </p>
        <div
          className="mt-2 h-2.5 overflow-hidden rounded-full bg-line"
          role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Clearance progress"
        >
          <div className="h-full bg-stamp transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        {next ? (
          <button
            onClick={() => onAsk(`What do I need for the ${next.office}?`)}
            className="mt-3 flex w-full items-center justify-between rounded-lg border-2 border-next bg-amber-50 px-3 py-2 text-left text-sm"
          >
            <span><span className="block text-xs text-slate-600">Go to next</span><span className="font-semibold">{next.office}</span></span>
            <ArrowRight size={16} aria-hidden />
          </button>
        ) : (
          <p className="mt-3 rounded-lg border-2 border-stamp bg-emerald-50 px-3 py-2 text-sm font-semibold text-stamp">
            All offices cleared. Claim your certificate at the Registrar.
          </p>
        )}
      </div>

      <ol className="flex-1 space-y-2 overflow-y-auto p-4">
        {OFFICES.map((o) => {
          const isDone = completed.includes(o.step);
          const isNext = next?.step === o.step;
          return (
            <li
              key={o.step}
              className={`rounded-lg border p-3 ${isDone ? 'border-stamp/40 bg-emerald-50' : isNext ? 'border-next bg-white' : 'border-line bg-white'}`}
            >
              <div className="flex items-start gap-3">
                <button
                  role="checkbox" aria-checked={isDone} aria-label={`Mark ${o.office} as cleared`}
                  onClick={() => onToggle(o.step)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 ${isDone ? 'border-stamp bg-stamp text-white' : 'border-slate-400 bg-white'}`}
                >
                  {isDone && <Check size={16} strokeWidth={3} aria-hidden />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${isDone ? 'text-slate-500 line-through' : ''}`}>{o.step}. {o.office}</p>
                  <p className="mt-0.5 flex items-start gap-1 text-xs text-slate-600"><MapPin size={12} className="mt-0.5 shrink-0" aria-hidden />{o.location}</p>
                  <button onClick={() => onAsk(`What are the requirements for the ${o.office}?`)} className="mt-1.5 text-xs font-semibold text-stamp underline">
                    See what to bring
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-line p-3">
        <button
          onClick={() => { if (confirm('Reset your clearance progress?')) onReset(); }}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-ink"
        >
          <RotateCcw size={14} aria-hidden /> Reset progress
        </button>
      </div>
    </div>
  );
}
