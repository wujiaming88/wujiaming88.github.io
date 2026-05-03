const {
  CardState,
  initCardState,
  filterCards,
  getDueCards,
  getNewCards,
  buildQueue,
  updateCardState,
  getStats,
  getChapters
} = require('./queue');

describe('Card Queue Management', () => {
  const mockCard = {
    chapter: '1. 软件架构设计',
    color: 'red',
    front: '什么是MVC?',
    back: 'Model-View-Controller',
    tags: ['MVC']
  };

  describe('initCardState', () => {
    test('initializes new card with default state', () => {
      const card = initCardState(mockCard);
      expect(card.state).toBe(CardState.NEW);
      expect(card.repetitions).toBe(0);
      expect(card.easeFactor).toBe(2.5);
      expect(card.interval).toBe(0);
      expect(card.reviewCount).toBe(0);
      expect(card.nextReview).toBeLessThanOrEqual(Date.now());
    });

    test('generates unique ID', () => {
      const card1 = initCardState(mockCard);
      const card2 = initCardState({ ...mockCard, front: '什么是MVP?' });
      expect(card1.id).toBeDefined();
      expect(card2.id).toBeDefined();
      expect(card1.id).not.toBe(card2.id);
    });

    test('preserves original card data', () => {
      const card = initCardState(mockCard);
      expect(card.chapter).toBe(mockCard.chapter);
      expect(card.color).toBe(mockCard.color);
      expect(card.front).toBe(mockCard.front);
      expect(card.back).toBe(mockCard.back);
    });
  });

  describe('filterCards', () => {
    const cards = [
      { ...mockCard, color: 'red', chapter: '1. A' },
      { ...mockCard, color: 'yellow', chapter: '1. A' },
      { ...mockCard, color: 'green', chapter: '2. B' },
      { ...mockCard, color: 'red', chapter: '2. B' }
    ];

    test('filters by single color', () => {
      const result = filterCards(cards, { colors: ['red'] });
      expect(result.length).toBe(2);
      expect(result.every(c => c.color === 'red')).toBe(true);
    });

    test('filters by multiple colors', () => {
      const result = filterCards(cards, { colors: ['red', 'yellow'] });
      expect(result.length).toBe(3);
    });

    test('filters by chapter', () => {
      const result = filterCards(cards, { chapters: ['1. A'] });
      expect(result.length).toBe(2);
      expect(result.every(c => c.chapter === '1. A')).toBe(true);
    });

    test('filters by color and chapter', () => {
      const result = filterCards(cards, { colors: ['red'], chapters: ['1. A'] });
      expect(result.length).toBe(1);
      expect(result[0].color).toBe('red');
      expect(result[0].chapter).toBe('1. A');
    });

    test('returns all cards when no filters', () => {
      const result = filterCards(cards, {});
      expect(result.length).toBe(4);
    });

    test('returns empty array when no match', () => {
      const result = filterCards(cards, { colors: ['blue'] });
      expect(result.length).toBe(0);
    });
  });

  describe('getDueCards', () => {
    test('returns cards due now', () => {
      const cards = [
        { ...initCardState(mockCard), nextReview: Date.now() - 1000 },
        { ...initCardState(mockCard), nextReview: Date.now() + 1000 }
      ];
      const result = getDueCards(cards);
      expect(result.length).toBe(1);
    });

    test('returns empty array when no cards due', () => {
      const cards = [
        { ...initCardState(mockCard), nextReview: Date.now() + 10000 }
      ];
      const result = getDueCards(cards);
      expect(result.length).toBe(0);
    });

    test('includes cards with past due dates', () => {
      const cards = [
        { ...initCardState(mockCard), nextReview: Date.now() - 86400000 } // 1 day ago
      ];
      const result = getDueCards(cards);
      expect(result.length).toBe(1);
    });
  });

  describe('getNewCards', () => {
    test('returns only new cards', () => {
      const cards = [
        { ...initCardState(mockCard), state: CardState.NEW },
        { ...initCardState(mockCard), state: CardState.LEARNING },
        { ...initCardState(mockCard), state: CardState.NEW }
      ];
      const result = getNewCards(cards);
      expect(result.length).toBe(2);
      expect(result.every(c => c.state === CardState.NEW)).toBe(true);
    });

    test('respects limit parameter', () => {
      const cards = Array(30).fill(null).map(() =>
        ({ ...initCardState(mockCard), state: CardState.NEW })
      );
      const result = getNewCards(cards, 10);
      expect(result.length).toBe(10);
    });

    test('returns fewer cards when less than limit', () => {
      const cards = [
        { ...initCardState(mockCard), state: CardState.NEW }
      ];
      const result = getNewCards(cards, 20);
      expect(result.length).toBe(1);
    });
  });

  describe('buildQueue', () => {
    test('combines due cards and new cards', () => {
      const cards = [
        { ...initCardState(mockCard), state: CardState.REVIEW, nextReview: Date.now() - 1000 },
        { ...initCardState(mockCard), state: CardState.NEW }
      ];
      const result = buildQueue(cards);
      expect(result.length).toBe(2);
    });

    test('sorts due cards by nextReview time', () => {
      const cards = [
        { ...initCardState(mockCard), state: CardState.REVIEW, nextReview: Date.now() - 1000 },
        { ...initCardState(mockCard), state: CardState.REVIEW, nextReview: Date.now() - 5000 }
      ];
      const result = buildQueue(cards);
      expect(result[0].nextReview).toBeLessThan(result[1].nextReview);
    });

    test('respects new card limit', () => {
      const cards = Array(30).fill(null).map(() =>
        ({ ...initCardState(mockCard), state: CardState.NEW })
      );
      const result = buildQueue(cards, 5);
      expect(result.length).toBe(5);
    });

    test('excludes new cards from due card filtering', () => {
      const cards = [
        { ...initCardState(mockCard), state: CardState.NEW, nextReview: Date.now() - 1000 }
      ];
      const result = buildQueue(cards, 0);
      expect(result.length).toBe(0);
    });
  });

  describe('updateCardState', () => {
    const card = initCardState(mockCard);
    const sm2Result = { interval: 1, repetitions: 1, easeFactor: 2.6 };
    const nextReview = Date.now() + 86400000;

    test('updates SM-2 parameters', () => {
      const result = updateCardState(card, sm2Result, nextReview);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.easeFactor).toBe(2.6);
      expect(result.nextReview).toBe(nextReview);
    });

    test('increments review count', () => {
      const result = updateCardState(card, sm2Result, nextReview);
      expect(result.reviewCount).toBe(1);
    });

    test('sets lastReview to now', () => {
      const now = Date.now();
      const result = updateCardState(card, sm2Result, nextReview);
      expect(result.lastReview).toBeGreaterThanOrEqual(now);
      expect(result.lastReview).toBeLessThanOrEqual(Date.now());
    });

    test('sets state to LEARNING when repetitions reset', () => {
      const result = updateCardState(card, { ...sm2Result, repetitions: 0 }, nextReview);
      expect(result.state).toBe(CardState.LEARNING);
    });

    test('sets state to MATURE when interval >= 21', () => {
      const result = updateCardState(card, { ...sm2Result, interval: 21 }, nextReview);
      expect(result.state).toBe(CardState.MATURE);
    });

    test('sets state to REVIEW for normal progression', () => {
      const result = updateCardState(card, { ...sm2Result, interval: 6 }, nextReview);
      expect(result.state).toBe(CardState.REVIEW);
    });
  });

  describe('getStats', () => {
    test('calculates correct totals', () => {
      const cards = [
        { ...initCardState(mockCard), state: CardState.NEW },
        { ...initCardState(mockCard), state: CardState.LEARNING },
        { ...initCardState(mockCard), state: CardState.REVIEW },
        { ...initCardState(mockCard), state: CardState.MATURE }
      ];
      const stats = getStats(cards);
      expect(stats.total).toBe(4);
      expect(stats.byState.new).toBe(1);
      expect(stats.byState.learning).toBe(1);
      expect(stats.byState.review).toBe(1);
      expect(stats.byState.mature).toBe(1);
    });

    test('counts due cards', () => {
      const cards = [
        { ...initCardState(mockCard), nextReview: Date.now() - 1000 },
        { ...initCardState(mockCard), nextReview: Date.now() + 1000 }
      ];
      const stats = getStats(cards);
      expect(stats.due).toBe(1);
    });

    test('counts cards reviewed today', () => {
      const today = new Date().setHours(0, 0, 0, 0);
      const cards = [
        { ...initCardState(mockCard), lastReview: today + 1000 },
        { ...initCardState(mockCard), lastReview: today - 86400000 },
        { ...initCardState(mockCard), lastReview: null }
      ];
      const stats = getStats(cards);
      expect(stats.reviewedToday).toBe(1);
    });

    test('calculates mastery rate', () => {
      const cards = [
        { ...initCardState(mockCard), state: CardState.MATURE },
        { ...initCardState(mockCard), state: CardState.MATURE },
        { ...initCardState(mockCard), state: CardState.NEW },
        { ...initCardState(mockCard), state: CardState.REVIEW }
      ];
      const stats = getStats(cards);
      expect(stats.masteryRate).toBe('50.0');
    });

    test('handles empty card list', () => {
      const stats = getStats([]);
      expect(stats.total).toBe(0);
      expect(stats.masteryRate).toBe(0);
    });
  });

  describe('getChapters', () => {
    test('returns unique chapters', () => {
      const cards = [
        { ...mockCard, chapter: '1. A' },
        { ...mockCard, chapter: '2. B' },
        { ...mockCard, chapter: '1. A' },
        { ...mockCard, chapter: '3. C' }
      ];
      const result = getChapters(cards);
      expect(result).toEqual(['1. A', '2. B', '3. C']);
    });

    test('sorts chapters', () => {
      const cards = [
        { ...mockCard, chapter: '3. C' },
        { ...mockCard, chapter: '1. A' },
        { ...mockCard, chapter: '2. B' }
      ];
      const result = getChapters(cards);
      expect(result).toEqual(['1. A', '2. B', '3. C']);
    });

    test('handles empty card list', () => {
      const result = getChapters([]);
      expect(result).toEqual([]);
    });
  });
});
