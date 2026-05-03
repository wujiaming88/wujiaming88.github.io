const { calculateSM2, mapButtonToQuality, getNextReviewDate, isDue } = require('./sm2');

describe('SM-2 Algorithm', () => {
  describe('calculateSM2', () => {
    test('quality < 3 resets repetitions', () => {
      const result = calculateSM2(2, 5, 2.5, 10);
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    test('first repetition (quality >= 3)', () => {
      const result = calculateSM2(4, 0, 2.5, 0);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
    });

    test('second repetition', () => {
      const result = calculateSM2(4, 1, 2.5, 1);
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    test('subsequent repetitions multiply by easeFactor', () => {
      const result = calculateSM2(4, 2, 2.5, 6);
      expect(result.interval).toBe(15); // 6 * 2.5 = 15
      expect(result.repetitions).toBe(3);
    });

    test('easeFactor increases with quality 5', () => {
      const result = calculateSM2(5, 2, 2.5, 6);
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    test('easeFactor decreases with quality 3', () => {
      const result = calculateSM2(3, 2, 2.5, 6);
      expect(result.easeFactor).toBeLessThan(2.5);
    });

    test('easeFactor minimum is 1.3', () => {
      const result = calculateSM2(0, 0, 1.3, 0);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    test('throws error for invalid quality', () => {
      expect(() => calculateSM2(6, 0, 2.5, 0)).toThrow('Quality must be between 0 and 5');
      expect(() => calculateSM2(-1, 0, 2.5, 0)).toThrow('Quality must be between 0 and 5');
    });

    test('handles easeFactor below 1.3', () => {
      const result = calculateSM2(4, 0, 1.0, 0);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe('mapButtonToQuality', () => {
    test('maps button 1 (忘了) to quality 0', () => {
      expect(mapButtonToQuality(1)).toBe(0);
    });

    test('maps button 2 (困难) to quality 3', () => {
      expect(mapButtonToQuality(2)).toBe(3);
    });

    test('maps button 3 (良好) to quality 4', () => {
      expect(mapButtonToQuality(3)).toBe(4);
    });

    test('maps button 4 (简单) to quality 5', () => {
      expect(mapButtonToQuality(4)).toBe(5);
    });

    test('returns default 3 for invalid button', () => {
      expect(mapButtonToQuality(0)).toBe(3);
      expect(mapButtonToQuality(5)).toBe(3);
    });
  });

  describe('getNextReviewDate', () => {
    test('returns future timestamp for positive days', () => {
      const now = Date.now();
      const result = getNextReviewDate(1);
      expect(result).toBeGreaterThan(now);
      expect(result).toBeLessThan(now + 2 * 24 * 60 * 60 * 1000); // within 2 days
    });

    test('calculates correct offset for multiple days', () => {
      const now = Date.now();
      const result = getNextReviewDate(7);
      const expected = now + 7 * 24 * 60 * 60 * 1000;
      expect(Math.abs(result - expected)).toBeLessThan(100); // within 100ms
    });

    test('handles 0 days (immediate review)', () => {
      const now = Date.now();
      const result = getNextReviewDate(0);
      expect(result).toBeGreaterThanOrEqual(now);
      expect(result).toBeLessThan(now + 1000); // within 1 second
    });
  });

  describe('isDue', () => {
    test('returns true for past timestamp', () => {
      const past = Date.now() - 1000;
      expect(isDue(past)).toBe(true);
    });

    test('returns true for current timestamp', () => {
      const now = Date.now();
      expect(isDue(now)).toBe(true);
    });

    test('returns false for future timestamp', () => {
      const future = Date.now() + 1000000;
      expect(isDue(future)).toBe(false);
    });
  });
});
