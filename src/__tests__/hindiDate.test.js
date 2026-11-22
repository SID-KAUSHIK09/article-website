import { describe, it, expect } from 'vitest';
import { isoToHindiDate, hindiDateToIso, HINDI_MONTHS } from '../utils/hindiDate';

describe('isoToHindiDate', () => {
  it('formats an ISO date in Hindi', () => {
    expect(isoToHindiDate('2026-01-05')).toBe('5 जनवरी 2026');
  });

  it('uses the right month for every month of the year', () => {
    HINDI_MONTHS.forEach((name, i) => {
      const mm = String(i + 1).padStart(2, '0');
      expect(isoToHindiDate(`2025-${mm}-15`)).toBe(`15 ${name} 2025`);
    });
  });

  it('does not shift the day with the local time zone', () => {
    // new Date('2026-03-01') is UTC midnight, which is 28 Feb in the Americas.
    expect(isoToHindiDate('2026-03-01')).toBe('1 मार्च 2026');
  });

  it('returns an empty string for empty or malformed input', () => {
    expect(isoToHindiDate('')).toBe('');
    expect(isoToHindiDate(undefined)).toBe('');
    expect(isoToHindiDate('05/01/2026')).toBe('');
    expect(isoToHindiDate('2026-13-01')).toBe('');
  });
});

describe('hindiDateToIso', () => {
  it('parses a Hindi date back to ISO', () => {
    expect(hindiDateToIso('5 जनवरी 2026')).toBe('2026-01-05');
  });

  it('round-trips with isoToHindiDate', () => {
    for (const iso of ['2024-02-29', '2025-12-31', '2026-07-09']) {
      expect(hindiDateToIso(isoToHindiDate(iso))).toBe(iso);
    }
  });

  it('tolerates extra whitespace', () => {
    expect(hindiDateToIso('  12   अगस्त  2025 ')).toBe('2025-08-12');
  });

  it('returns an empty string for text it cannot parse', () => {
    expect(hindiDateToIso('')).toBe('');
    expect(hindiDateToIso(null)).toBe('');
    expect(hindiDateToIso('5 January 2026')).toBe('');
    expect(hindiDateToIso('कल')).toBe('');
  });
});
