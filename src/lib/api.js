import { fallbackAnswer } from '../../shared/fallback.js';

/**
 * Send the conversation to /api/chat.
 * If the server is unreachable (or errors), answer locally from the knowledge base.
 */
export async function sendChat(history, completed) {
  const messages = history
    .filter((m) => m.id !== 'welcome')
    .map(({ role, content }) => ({ role, content }));

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, completed }),
    });
    if (res.status === 429) {
      return { answer: 'You are sending messages quickly. Please wait a minute and try again.', official: false, source: 'error' };
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    const last = messages[messages.length - 1]?.content ?? '';
    return { ...fallbackAnswer(last, completed), source: 'offline' };
  }
}
