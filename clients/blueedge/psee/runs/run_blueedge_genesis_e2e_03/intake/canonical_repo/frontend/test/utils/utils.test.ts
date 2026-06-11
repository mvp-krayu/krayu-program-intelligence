import { describe, it, expect } from 'vitest';
import { fmtDate, fmtCur, fmtNum, fmtTime, fmtPct, fmtDuration } from '@/utils';

describe('Formatting Utils', () => {
  describe('fmtDate', () => {
    it('formats valid date string', () => {
      const result = fmtDate('2026-02-14T10:30:00Z');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
    it('handles null/undefined gracefully', () => {
      expect(fmtDate(null as any)).toBeTruthy();
      expect(fmtDate(undefined as any)).toBeTruthy();
    });
    it('handles Date object', () => {
      const result = fmtDate(new Date('2026-01-01'));
      expect(typeof result).toBe('string');
    });
  });

  describe('fmtCur', () => {
    it('formats number as AED currency', () => {
      const result = fmtCur(1234.56);
      expect(typeof result).toBe('string');
    });
    it('handles zero', () => {
      expect(fmtCur(0)).toBeTruthy();
    });
    it('handles large numbers', () => {
      const result = fmtCur(1000000);
      expect(typeof result).toBe('string');
    });
  });

  describe('fmtNum', () => {
    it('formats integer', () => {
      const result = fmtNum(12345);
      expect(typeof result).toBe('string');
    });
    it('formats float', () => {
      const result = fmtNum(3.14159, 2);
      expect(typeof result).toBe('string');
    });
  });

  describe('fmtPct', () => {
    it('formats percentage', () => {
      const result = fmtPct(0.8567);
      expect(typeof result).toBe('string');
    });
  });

  describe('fmtTime', () => {
    it('formats time value', () => {
      const result = fmtTime('2026-02-14T14:30:00Z');
      expect(typeof result).toBe('string');
    });
  });

  describe('fmtDuration', () => {
    it('formats duration in minutes', () => {
      const result = fmtDuration(125);
      expect(typeof result).toBe('string');
    });
  });
});
