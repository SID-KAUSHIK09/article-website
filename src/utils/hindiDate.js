// convert between date input values (2026-01-05) and the Hindi format we store (5 जनवरी 2026)

export const HINDI_MONTHS = [
  'जनवरी',
  'फरवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर',
];

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

// "2026-01-05" -> "5 जनवरी 2026"
// parsing manually because new Date("2026-01-05") is UTC and gives the wrong day in some timezones
export const isoToHindiDate = (isoDate) => {
  const match = ISO_DATE.exec(isoDate ?? '');
  if (!match) return '';

  const [, year, month, day] = match.map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return '';

  return `${day} ${HINDI_MONTHS[month - 1]} ${year}`;
};

// "5 जनवरी 2026" -> "2026-01-05", returns '' if it can't parse
export const hindiDateToIso = (hindiDate) => {
  const parts = (hindiDate ?? '').trim().split(/\s+/);
  if (parts.length !== 3) return '';

  const day = Number.parseInt(parts[0], 10);
  const monthIndex = HINDI_MONTHS.indexOf(parts[1]);
  const year = Number.parseInt(parts[2], 10);
  if (Number.isNaN(day) || monthIndex === -1 || Number.isNaN(year)) return '';
  if (day < 1 || day > 31) return '';

  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};
