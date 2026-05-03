const { SwipeDirection, detectSwipe, createSwipeHandler } = require('./swipe');

describe('Swipe Gesture Handler', () => {
  describe('detectSwipe', () => {
    test('detects left swipe when deltaX < -threshold', () => {
      expect(detectSwipe(100, 0, 50, 50, 50)).toBe(SwipeDirection.LEFT);
    });

    test('detects right swipe when deltaX > threshold', () => {
      expect(detectSwipe(0, 100, 50, 50, 50)).toBe(SwipeDirection.RIGHT);
    });

    test('returns none when horizontal movement < threshold', () => {
      expect(detectSwipe(50, 70, 50, 50, 50)).toBe(SwipeDirection.NONE);
    });

    test('returns none when vertical movement > horizontal movement', () => {
      expect(detectSwipe(50, 120, 50, 150, 50)).toBe(SwipeDirection.NONE);
    });

    test('uses custom threshold', () => {
      expect(detectSwipe(0, 40, 50, 50, 100)).toBe(SwipeDirection.NONE);
      expect(detectSwipe(0, 110, 50, 50, 100)).toBe(SwipeDirection.RIGHT);
    });

    test('handles negative coordinates', () => {
      expect(detectSwipe(-50, -150, 0, 0, 50)).toBe(SwipeDirection.LEFT);
      expect(detectSwipe(-150, -50, 0, 0, 50)).toBe(SwipeDirection.RIGHT);
    });

    test('handles equal x and y deltas as horizontal (prioritizes horizontal)', () => {
      // When deltaX == deltaY, horizontal takes priority (not less than vertical)
      expect(detectSwipe(0, 100, 0, 100, 50)).toBe(SwipeDirection.RIGHT);
    });

    test('handles exactly at threshold boundary (inclusive)', () => {
      expect(detectSwipe(0, 50, 0, 0, 50)).toBe(SwipeDirection.RIGHT);
      expect(detectSwipe(50, 0, 0, 0, 50)).toBe(SwipeDirection.LEFT);
    });

    test('handles exactly below threshold boundary (exclusive)', () => {
      expect(detectSwipe(0, 49, 0, 0, 50)).toBe(SwipeDirection.NONE);
    });

    test('uses default threshold of 50 when not provided', () => {
      expect(detectSwipe(0, 60, 0, 0)).toBe(SwipeDirection.RIGHT);
      expect(detectSwipe(0, 40, 0, 0)).toBe(SwipeDirection.NONE);
    });
  });

  describe('createSwipeHandler', () => {
    let element;

    beforeEach(() => {
      element = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };
    });

    test('throws error when element is null', () => {
      expect(() => createSwipeHandler(null, {})).toThrow('Element is required');
    });

    test('throws error when element is undefined', () => {
      expect(() => createSwipeHandler(undefined, {})).toThrow('Element is required');
    });

    test('registers touchstart and touchend listeners', () => {
      createSwipeHandler(element, {}, 50);
      expect(element.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: true });
      expect(element.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function), { passive: true });
    });

    test('cleanup function removes listeners', () => {
      const cleanup = createSwipeHandler(element, {}, 50);
      cleanup();
      expect(element.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(element.removeEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
    });

    test('calls onSwipeLeft when swiping left', () => {
      const onSwipeLeft = jest.fn();
      createSwipeHandler(element, { onSwipeLeft }, 50);

      const touchStartHandler = element.addEventListener.mock.calls[0][1];
      const touchEndHandler = element.addEventListener.mock.calls[1][1];

      touchStartHandler({ touches: [{ clientX: 200, clientY: 100 }] });
      touchEndHandler({ changedTouches: [{ clientX: 50, clientY: 100 }] });

      expect(onSwipeLeft).toHaveBeenCalled();
    });

    test('calls onSwipeRight when swiping right', () => {
      const onSwipeRight = jest.fn();
      createSwipeHandler(element, { onSwipeRight }, 50);

      const touchStartHandler = element.addEventListener.mock.calls[0][1];
      const touchEndHandler = element.addEventListener.mock.calls[1][1];

      touchStartHandler({ touches: [{ clientX: 50, clientY: 100 }] });
      touchEndHandler({ changedTouches: [{ clientX: 200, clientY: 100 }] });

      expect(onSwipeRight).toHaveBeenCalled();
    });

    test('does not call callbacks when swipe is below threshold', () => {
      const onSwipeLeft = jest.fn();
      const onSwipeRight = jest.fn();
      createSwipeHandler(element, { onSwipeLeft, onSwipeRight }, 100);

      const touchStartHandler = element.addEventListener.mock.calls[0][1];
      const touchEndHandler = element.addEventListener.mock.calls[1][1];

      touchStartHandler({ touches: [{ clientX: 100, clientY: 100 }] });
      touchEndHandler({ changedTouches: [{ clientX: 130, clientY: 100 }] });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    test('does not call callbacks when swipe is vertical', () => {
      const onSwipeLeft = jest.fn();
      const onSwipeRight = jest.fn();
      createSwipeHandler(element, { onSwipeLeft, onSwipeRight }, 50);

      const touchStartHandler = element.addEventListener.mock.calls[0][1];
      const touchEndHandler = element.addEventListener.mock.calls[1][1];

      touchStartHandler({ touches: [{ clientX: 100, clientY: 100 }] });
      touchEndHandler({ changedTouches: [{ clientX: 130, clientY: 250 }] });

      expect(onSwipeLeft).not.toHaveBeenCalled();
      expect(onSwipeRight).not.toHaveBeenCalled();
    });

    test('handles missing callbacks gracefully', () => {
      createSwipeHandler(element, {}, 50);

      const touchStartHandler = element.addEventListener.mock.calls[0][1];
      const touchEndHandler = element.addEventListener.mock.calls[1][1];

      expect(() => {
        touchStartHandler({ touches: [{ clientX: 200, clientY: 100 }] });
        touchEndHandler({ changedTouches: [{ clientX: 50, clientY: 100 }] });
      }).not.toThrow();
    });
  });
});
