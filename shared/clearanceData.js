/**
 * Single source of truth for the clearance process.
 * Edit this file to update offices, requirements or locations everywhere.
 * `keywords` are only used by the offline fallback matcher.
 */
export const OFFICES = [
  {
    step: 1,
    office: 'Library',
    location: 'Main Campus - 2nd Floor Library Building',
    requirements: ['Return all borrowed books', 'Settle overdue fines (if any)', 'Present Student ID'],
    notes: 'Must be cleared before the Student Affairs Office.',
    keywords: ['library', 'book', 'books', 'fine', 'fines', 'overdue'],
  },
  {
    step: 2,
    office: 'Department Chairperson / Faculty',
    location: 'Respective Department Building / Faculty Room',
    requirements: ['Complete evaluation form', 'Pass departmental clearance checklist'],
    notes: 'Verify grade status with department secretary.',
    keywords: ['department', 'chair', 'chairperson', 'faculty', 'dean', 'evaluation', 'grade', 'grades'],
  },
  {
    step: 3,
    office: 'Accounting Office / Finance',
    location: 'Administration Building - Ground Floor',
    requirements: ['Official receipts for tuition/miscellaneous fees', 'Exam permits'],
    notes: 'Longest queue hours are usually 10 AM - 2 PM.',
    keywords: ['accounting', 'finance', 'cashier', 'tuition', 'receipt', 'receipts', 'payment', 'permit', 'permits', 'balance'],
  },
  {
    step: 4,
    office: 'Guidance & Counseling Office',
    location: 'Student Services Building - 1st Floor',
    requirements: ['Exit interview form (for graduating/transferees)', 'Guidance inventory update'],
    notes: 'Transferees must present preliminary credit evaluation.',
    keywords: ['guidance', 'counseling', 'counselling', 'exit', 'interview', 'transferee', 'transferees', 'transfer'],
  },
  {
    step: 5,
    office: 'Office of Student Affairs (OSA)',
    location: 'Student Services Building - 2nd Floor',
    requirements: ['Good Moral Certificate request form', 'Validated Student ID'],
    notes: 'Requires prior clearance from Library and Department Chair.',
    keywords: ['osa', 'student affairs', 'good moral', 'moral', 'affairs'],
  },
  {
    step: 6,
    office: "Registrar's Office",
    location: 'Administration Building - 1st Floor',
    requirements: ['Completed signature form from all previous offices'],
    notes: 'Final clearance approval and clearance certificate issuance.',
    keywords: ['registrar', 'final', 'certificate', 'tor', 'records'],
  },
];

/** Where students should confirm anything the chatbot cannot answer. */
export const VERIFY_AT = "the Registrar's Office (Administration Building - 1st Floor)";
