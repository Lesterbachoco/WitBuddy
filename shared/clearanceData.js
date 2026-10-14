/**
 * Single source of truth for WIT facts. Edit this file to update the UI,
 * the AI's knowledge and the offline fallback together.
 *
 * Fill in `location` for each office when you have it. Missing values are
 * hidden in the UI and never guessed by the AI.
 * `keywords` are only used by the offline fallback matcher.
 */

// Clearance signing order (no requirements listed per office)
export const OFFICES = [
  {
    step: 1,
    office: 'Librarian',
    shortName: 'Librarian',
    location: 'RTS Marine Building',
    requirements: [],
    notes: '',
    keywords: ['librarian', 'library', 'book', 'books', 'fine', 'fines', 'overdue'],
  },
  {
    step: 2,
    office: 'Chem Lab Custodian',
    shortName: 'Chem Lab',
    location: 'Main Building - 1st Floor',
    requirements: [],
    notes: '',
    keywords: ['chem', 'chemistry', 'lab', 'laboratory', 'custodian'],
  },
  {
    step: 3,
    office: 'Supply Inventory Officer',
    shortName: 'Supply',
    location: 'Main Building - 1st Floor',
    requirements: [],
    notes: '',
    keywords: ['supply', 'supplies', 'inventory', 'equipment'],
  },
  {
    step: 4,
    office: 'Department Head',
    shortName: 'Dept. Head',
    location: 'Depends on your program',
    byProgram: true, // see DEPT_HEADS below
    requirements: [],
    notes: '',
    keywords: ['department head', 'dept head', 'department', 'dept', 'head', 'chair', 'chairperson'],
  },
];

// Department Head location depends on the student's program.
// Order matters for the offline matcher: more specific programs come first.
export const DEPT_HEADS = [
  { program: 'Marine Engineering', location: 'Marine Building - 1st Floor', keywords: ['marine engineering', 'marine eng', 'marine'] },
  { program: 'Engineering', location: 'Engineering Building - 1st Floor', keywords: ['engineering', 'engineer', 'engg'] },
  { program: 'IT (Information Technology)', location: 'RTS IT Building - 3rd Floor', keywords: ['information technology', 'bsit', 'it program'] },
  { program: 'HM (Hospitality Management)', location: 'Main Building - 3rd Floor', keywords: ['hm', 'hrm', 'hospitality'] },
  { program: 'Accountancy', location: 'Main Building - 3rd Floor', keywords: ['accountancy', 'accounting', 'bsa'] },
  { program: 'Biochemistry', location: 'Main Building - 3rd Floor', keywords: ['biochem', 'biochemistry'] },
  { program: 'AB English Language', location: 'Main Building - 3rd Floor', keywords: ['english'] },
  { program: 'AB Political Science', location: 'Main Building - 3rd Floor', keywords: ['political science', 'polsci', 'political'] },
];

// Campuses and hours
export const CAMPUSES = {
  sites: ['RTS Campus', 'Main Campus'],
  campusHours: '6:30 AM - 10:00 PM (both campuses)',
  officeHours: '9:00 AM - 12:00 PM and 1:00 PM - 4:00 PM',
  officeHoursApplyTo: 'all offices, including the Registrar and the Accounting Office',
};

// Policies and FAQs
export const POLICIES = [
  {
    topic: 'Unclear / disputed grades, missing grades, INC (Incomplete)',
    answer:
      "If a professor hasn't encoded your grades yet, or you have an INC (Incomplete) mark that is delaying your departmental clearance, wait for the announcement on the official WIT page. Applying to resolve an INC costs 80 pesos per INC.",
    keywords: ['inc', 'incomplete', 'grade', 'grades', 'encode', 'encoded', 'disputed', 'professor', 'prof'],
  },
];

/**
 * PLACEHOLDER school FAQs. `confirmed: false` means "sample text, not verified by WIT".
 * The bot still uses them but tells students they are unconfirmed and where to verify.
 * To go live: replace the answer with the real WIT answer, then set `confirmed: true`.
 */
export const FAQS = [
  { topic: 'Enrollment', confirmed: false,
    answer: 'Enrollment happens at the start of each semester. Watch the official WIT page for the enrollment schedule and the documents you need to bring.',
    keywords: ['enroll', 'enrol', 'enrollment', 'enrolment', 'enrolling', 'registration', 'register'] },
  { topic: 'Lost or replacement student ID', confirmed: false,
    answer: 'For a lost or damaged student ID, report it to the Registrar or the office that issues IDs and ask about the replacement steps and fee.',
    keywords: ['id', 'ids', 'identification'] },
  { topic: 'Requesting TOR and other school documents', confirmed: false,
    answer: 'Documents such as the Transcript of Records (TOR) are requested at the Registrar. Ask about the request form, processing time and fee.',
    keywords: ['tor', 'transcript', 'transcripts', 'certificate', 'certification', 'diploma', 'document', 'documents'] },
  { topic: 'Good Moral Certificate', confirmed: false,
    answer: 'A Good Moral Certificate is normally requested through the student affairs or guidance office. Ask them about the form and processing time.',
    keywords: ['good moral', 'moral'] },
  { topic: 'Tuition and payments', confirmed: false,
    answer: `Tuition and fees are paid at the Accounting Office during office hours (${CAMPUSES.officeHours}). Keep your official receipts.`,
    keywords: ['tuition', 'payment', 'payments', 'fee', 'fees', 'cashier', 'receipt', 'receipts', 'balance'] },
  { topic: 'Scholarships and financial aid', confirmed: false,
    answer: 'Watch the official WIT page for scholarship announcements, or ask the office handling scholarships about requirements and deadlines.',
    keywords: ['scholarship', 'scholarships', 'scholar', 'discount', 'grant', 'financial'] },
  { topic: 'Shifting courses or transferring', confirmed: false,
    answer: 'To shift to another course or transfer, talk to your current Department Head and the Registrar about the process and deadlines.',
    keywords: ['shift', 'shifting', 'transfer', 'transferee', 'transferring'] },
  { topic: 'Uniform and dress code', confirmed: false,
    answer: 'WIT has uniform and dress code rules. Check your student handbook or ask the student affairs office for the current policy.',
    keywords: ['uniform', 'dress', 'dresscode', 'handbook'] },
  { topic: 'Graduation and clearance deadlines', confirmed: false,
    answer: 'Graduation and clearance deadlines are announced each term on the official WIT page. Complete your clearance signing early.',
    keywords: ['graduation', 'graduate', 'graduating', 'deadline', 'deadlines'] },
];

/** Where students should confirm anything the chatbot cannot answer. */
export const VERIFY_AT = `the Registrar's Office (office hours: ${CAMPUSES.officeHours}) or the official WIT page`;