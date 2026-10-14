import { OFFICES, CAMPUSES, POLICIES, FAQS, DEPT_HEADS, PROGRAMS, VERIFY_AT } from './clearanceData.js';

/** Markdown card for one clearance office (only shows facts that exist). */
export const officeCard = (o) =>
  `### Step ${o.step}: ${o.office}\n` +
  (o.location ? `**Where:** ${o.location}\n\n` : '') +
  (o.byProgram ? DEPT_HEADS.map((d) => `- **${d.program}:** ${d.location}`).join('\n') + '\n\n' : '') +
  `**Office hours:** ${CAMPUSES.officeHours}\n\n` +
  (o.requirements.length
    ? `**Requirements:**\n${o.requirements.map((r) => `- ${r}`).join('\n')}`
    : '**Requirements:** none') +
  (o.notes ? `\n\n**Note:** ${o.notes}` : '');

const hoursAnswer = () =>
  `**Campuses:** ${CAMPUSES.sites.join(', ')}\n\n` +
  `- **Campus open:** ${CAMPUSES.campusHours}\n` +
  `- **Office hours:** ${CAMPUSES.officeHours} (${CAMPUSES.officeHoursApplyTo})`;

const mentionsOffice = (q) => OFFICES.some((o) => o.keywords.some((k) => q.includes(k)));

/**
 * Rule-based answer built only from the knowledge base.
 * Used when the AI API is down, rate limited, or not configured.
 * @returns {{answer: string, official: boolean}}
 */
export function fallbackAnswer(question = '') {
  const q = question.toLowerCase();
  const words = q.split(/[^a-z0-9']+/);

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

  // Department Head location by program ("IT" is matched in capitals only, since "it" is a common word)
  const dept = DEPT_HEADS.find((d) => d.keywords.some(matches)) || (/\bIT\b/.test(question) ? DEPT_HEADS.find((d) => d.program.includes('Information Technology')) : null);
  if (dept && /(head|chair|dean|sign|clearance|where|office|department|dept|located|location)/.test(q)) {
    return dept.location
      ? { official: true, answer: `**Department Head, ${dept.program}**\n\n**Where:** ${dept.location}\n\n**Office hours:** ${CAMPUSES.officeHours}` }
      : { official: false, answer: `**Department Head, ${dept.program}**\n\nI don't have the office location for this program yet.\n\n**Where to verify:** ${VERIFY_AT}.` };
  }

  // Programs offered
  if (/\b(programs?|courses?|degrees?|offered|offer|offers)\b/.test(q)) {
    return { official: true, answer: '**Programs offered at WIT:**\n' + PROGRAMS.map((x) => `- ${x}`).join('\n') };
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

  if (/\b(all|list|steps?|process|procedure|offices|order|sequence|clearance)\b/.test(q) && !mentionsOffice(q)) {
    return {
      official: true,
      answer:
        '**Clearance signing, step by step:**\n' +
        OFFICES.map((o) => `${o.step}. **${o.office}**${o.location ? ` (${o.location.toLowerCase().startsWith('depends') ? 'location depends on your program, just ask me' : o.location})` : ''}`).join('\n') +
        `\n\n**Office hours:** ${CAMPUSES.officeHours}`,
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