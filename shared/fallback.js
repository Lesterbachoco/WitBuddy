import { OFFICES, CAMPUSES, POLICIES, FAQS, VERIFY_AT } from './clearanceData.js';

/** Markdown card for one clearance office (only shows facts that exist). */
export const officeCard = (o) =>
  `### Step ${o.step}: ${o.office}\n` +
  (o.location ? `**Where:** ${o.location}\n\n` : '') +
  `**Office hours:** ${CAMPUSES.officeHours}\n\n` +
  (o.requirements.length
    ? `**Requirements:**\n${o.requirements.map((r) => `- ${r}`).join('\n')}`
    : '**Requirements:** none listed') +
  (o.notes ? `\n\n**Note:** ${o.notes}` : '');

const hoursAnswer = () =>
  `**Campuses:** ${CAMPUSES.sites.join(' and ')}\n\n` +
  `- **Campus open:** ${CAMPUSES.campusHours}\n` +
  `- **Office hours:** ${CAMPUSES.officeHours} (${CAMPUSES.officeHoursApplyTo})`;

const mentionsOffice = (q) => OFFICES.some((o) => o.keywords.some((k) => q.includes(k)));

/**
 * Rule-based answer built only from the knowledge base.
 * Used when the AI API is down, rate limited, or not configured.
 * @returns {{answer: string, official: boolean}}
 */
export function fallbackAnswer(question = '', completed = [], lastStep = 0) {
  const q = question.toLowerCase();
  const words = q.split(/[^a-z0-9']+/);
  const pending = OFFICES.filter((o) => !completed.includes(o.step));
  // Next = first uncleared office after the last one shown, wrapping around
  const next = pending.find((o) => o.step > lastStep) || pending[0];

  // INC / grades policy
  const policy = POLICIES.find((p) => p.keywords.some((k) => words.includes(k)));
  if (policy) return { official: true, answer: policy.answer };

  // School FAQs (placeholders are flagged as unconfirmed)
  const matches = (k) => (k.includes(' ') ? q.includes(k) : words.includes(k));
  const faq = !(/lost|missing|misplaced/.test(q) && /(form|clearance)/.test(q)) && FAQS.find((f) => f.keywords.some(matches));
  if (faq) {
    return faq.confirmed
      ? { official: true, answer: faq.answer }
      : { official: false, answer: `**${faq.topic}**\n\n${faq.answer}\n\n*This info is not confirmed by WIT yet.*` };
  }

  // Lost form: not in the knowledge base, so never claim it is official
  if (/lost|missing|misplaced/.test(q) && /(form|clearance)/.test(q)) {
    return {
      official: false,
      answer: `Losing your clearance form happens, but the replacement process is not in my records.\n\n**Where to verify:** ${VERIFY_AT}.`,
    };
  }

  // Campuses and hours
  if (/\b(open|opens|opening|close|closes|closing|hours|schedule|rts|main campus|campus|campuses)\b/.test(q)) {
    return { official: true, answer: hoursAnswer() };
  }

  if (/(first|start|begin)/.test(q) && /(sign|office|where|who)/.test(q)) {
    return { official: true, answer: `Start with the **${OFFICES[0].office}**.\n\n${officeCard(OFFICES[0])}` };
  }

  if (/(next|what now|after this)/.test(q) && !mentionsOffice(q)) {
    return next
      ? { official: true, answer: `Your next office is the **${next.office}**.\n\n${officeCard(next)}` }
      : { official: true, answer: 'All offices are marked as cleared. Your clearance signing is complete.' };
  }

  if (/\b(all|list|steps|process|offices|order|sequence)\b/.test(q) && !mentionsOffice(q)) {
    return {
      official: true,
      answer: '**Clearance signing order:**\n' + OFFICES.map((o) => `${o.step}. **${o.office}**`).join('\n'),
    };
  }

  const hit = OFFICES.find((o) => o.keywords.some((k) => (k.includes(' ') ? q.includes(k) : words.includes(k))));
  if (hit) return { official: true, answer: officeCard(hit) };

  return {
    official: false,
    answer:
      `I can't answer that right now. Offline, I only know the clearance steps, campus hours, the INC policy and a few basic school topics.\n\n` +
      `**Where to verify:** ${VERIFY_AT}.`,
  };
}