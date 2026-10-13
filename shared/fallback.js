import { OFFICES, VERIFY_AT } from './clearanceData.js';

const card = (o) =>
  `### Step ${o.step}: ${o.office}\n` +
  `**Where:** ${o.location}\n\n` +
  `**Bring / requirements:**\n${o.requirements.map((r) => `- ${r}`).join('\n')}\n\n` +
  `**Note:** ${o.notes}`;

const mentionsOffice = (q) => OFFICES.some((o) => o.keywords.some((k) => q.includes(k)));

/**
 * Rule-based answer built only from the knowledge base.
 * Used when the AI API is down, rate limited, or not configured.
 * @param {string} question
 * @param {number[]} completed step numbers the student already cleared
 * @returns {{answer: string, official: boolean}}
 */
export function fallbackAnswer(question = '', completed = []) {
  const q = question.toLowerCase();
  const next = OFFICES.find((o) => !completed.includes(o.step));

  // Lost form: not in the knowledge base, so never claim it is official.
  if (/lost|missing|misplaced/.test(q) && /(form|clearance)/.test(q)) {
    return {
      official: false,
      answer:
        `Losing your clearance form happens, but the replacement process is not in my records.\n\n` +
        `**Where to verify:** Ask at ${VERIFY_AT} before visiting any other office.`,
    };
  }

  if (/(first|start|begin)/.test(q) && /(sign|office|where|who)/.test(q)) {
    return { official: true, answer: `Start with the **${OFFICES[0].office}**.\n\n${card(OFFICES[0])}` };
  }

  if (/(next|what now|after this)/.test(q) && !mentionsOffice(q)) {
    return next
      ? { official: true, answer: `Your next office is the **${next.office}**.\n\n${card(next)}` }
      : { official: true, answer: "All offices are marked as cleared. Claim your clearance certificate at the Registrar's Office if you have not yet." };
  }

  if (/(all|list|steps|process|offices|order|sequence)/.test(q) && !mentionsOffice(q)) {
    return {
      official: true,
      answer: '**Clearance order:**\n' + OFFICES.map((o) => `${o.step}. **${o.office}** (${o.location})`).join('\n'),
    };
  }

  const hit = OFFICES.find((o) => o.keywords.some((k) => q.includes(k)));
  if (hit) return { official: true, answer: card(hit) };

  return {
    official: false,
    answer:
      `I can't answer that from my clearance records.\n\n` +
      `**Where to verify:** Ask at ${VERIFY_AT}. You can also ask me about any office, its location, its requirements, or what to do next.`,
  };
}
