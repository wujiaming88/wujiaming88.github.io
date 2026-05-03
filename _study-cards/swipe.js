/**
 * 触摸滑动手势处理
 * 支持左滑/右滑检测
 */

/**
 * 滑动方向
 */
const SwipeDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  NONE: 'none'
};

/**
 * 检测滑动方向
 * @param {number} startX - 起始 X 坐标
 * @param {number} endX - 结束 X 坐标
 * @param {number} startY - 起始 Y 坐标
 * @param {number} endY - 结束 Y 坐标
 * @param {number} threshold - 最小滑动距离阈值(px)
 * @returns {string} 滑动方向 'left'|'right'|'none'
 */
function detectSwipe(startX, endX, startY, endY, threshold = 50) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // 横向移动距离必须大于竖向移动距离（判断为横向滑动）
  if (Math.abs(deltaX) < Math.abs(deltaY)) {
    return SwipeDirection.NONE;
  }

  // 横向移动距离必须超过阈值
  if (Math.abs(deltaX) < threshold) {
    return SwipeDirection.NONE;
  }

  return deltaX < 0 ? SwipeDirection.LEFT : SwipeDirection.RIGHT;
}

/**
 * 创建滑动手势处理器
 * @param {HTMLElement} element - 绑定的 DOM 元素
 * @param {Object} callbacks - {onSwipeLeft: fn, onSwipeRight: fn}
 * @param {number} threshold - 滑动阈值(px)
 * @returns {Function} 清理函数
 */
function createSwipeHandler(element, callbacks, threshold = 50) {
  if (!element) {
    throw new Error('Element is required');
  }

  let startX = 0;
  let startY = 0;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const direction = detectSwipe(startX, endX, startY, endY, threshold);

    if (direction === SwipeDirection.LEFT && callbacks.onSwipeLeft) {
      callbacks.onSwipeLeft(e);
    } else if (direction === SwipeDirection.RIGHT && callbacks.onSwipeRight) {
      callbacks.onSwipeRight(e);
    }
  };

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });

  // 返回清理函数
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

// Node.js 导出
/* istanbul ignore else */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SwipeDirection,
    detectSwipe,
    createSwipeHandler
  };
}

// 浏览器全局变量
/* istanbul ignore next */
if (typeof window !== 'undefined') {
  window.Swipe = {
    SwipeDirection,
    detectSwipe,
    createSwipeHandler
  };
}
