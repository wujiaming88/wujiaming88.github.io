/**
 * 卡片队列管理
 * 负责筛选、排序、状态追踪
 */

/**
 * 卡片状态
 */
const CardState = {
  NEW: 'new',           // 新卡
  LEARNING: 'learning', // 学习中
  REVIEW: 'review',     // 复习
  MATURE: 'mature'      // 已掌握 (interval >= 21天)
};

/**
 * 初始化卡片状态
 * @param {Object} card - 卡片数据
 * @returns {Object} 带状态的卡片
 */
function initCardState(card) {
  return {
    ...card,
    id: card.id || generateId(card),
    state: CardState.NEW,
    repetitions: 0,
    easeFactor: 2.5,
    interval: 0,
    nextReview: Date.now(), // 新卡立即可学
    lastReview: null,
    reviewCount: 0
  };
}

/**
 * 生成卡片ID
 */
function generateId(card) {
  return `${card.chapter}-${card.front.substring(0, 20)}`.replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * 筛选卡片
 * @param {Array} cards - 卡片列表
 * @param {Object} filters - {colors: ['red'], chapters: ['1. xxx']}
 * @returns {Array} 筛选后的卡片
 */
function filterCards(cards, filters) {
  let result = cards;

  if (filters.colors && filters.colors.length > 0) {
    result = result.filter(card => filters.colors.includes(card.color));
  }

  if (filters.chapters && filters.chapters.length > 0) {
    result = result.filter(card => filters.chapters.includes(card.chapter));
  }

  return result;
}

/**
 * 获取到期卡片
 * @param {Array} cards - 卡片列表
 * @returns {Array} 到期卡片
 */
function getDueCards(cards) {
  const now = Date.now();
  return cards.filter(card => card.nextReview <= now);
}

/**
 * Fisher-Yates 洗牌算法
 * @param {Array} arr - 输入数组（会被原地修改）
 * @returns {Array} 打乱后的数组
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 获取新卡
 * @param {Array} cards - 卡片列表
 * @param {number} limit - 限制数量
 * @returns {Array} 新卡
 */
function getNewCards(cards, limit = 30) {
  return cards
    .filter(card => card.state === CardState.NEW)
    .slice(0, limit);
}

/**
 * 构建学习队列
 * @param {Array} cards - 所有卡片
 * @param {number} queueLimit - 每批队列总数限制（新卡+复习卡）
 * @returns {Array} 今日学习队列（随机排列）
 */
function buildQueue(cards, queueLimit = 30) {
  const dueCards = getDueCards(cards).filter(card => card.state !== CardState.NEW);
  const newCards = getNewCards(cards, queueLimit);

  // Fisher-Yates 随机打乱复习卡和新卡
  shuffle(dueCards);
  shuffle(newCards);

  // 合并并限制总数
  const combined = [...dueCards, ...newCards];
  return combined.slice(0, queueLimit);
}

/**
 * 更新卡片状态
 * @param {Object} card - 卡片
 * @param {Object} sm2Result - SM-2算法结果 {interval, repetitions, easeFactor}
 * @param {number} nextReview - 下次复习时间戳
 * @returns {Object} 更新后的卡片
 */
function updateCardState(card, sm2Result, nextReview) {
  const newCard = {
    ...card,
    repetitions: sm2Result.repetitions,
    easeFactor: sm2Result.easeFactor,
    interval: sm2Result.interval,
    nextReview: nextReview,
    lastReview: Date.now(),
    reviewCount: card.reviewCount + 1
  };

  // 更新状态
  if (sm2Result.repetitions === 0) {
    newCard.state = CardState.LEARNING;
  } else if (sm2Result.interval >= 21) {
    newCard.state = CardState.MATURE;
  } else {
    newCard.state = CardState.REVIEW;
  }

  return newCard;
}

/**
 * 统计数据
 * @param {Array} cards - 卡片列表
 * @returns {Object} 统计结果
 */
function getStats(cards) {
  const total = cards.length;
  const byState = {
    new: cards.filter(c => c.state === CardState.NEW).length,
    learning: cards.filter(c => c.state === CardState.LEARNING).length,
    review: cards.filter(c => c.state === CardState.REVIEW).length,
    mature: cards.filter(c => c.state === CardState.MATURE).length
  };
  const due = getDueCards(cards).length;
  const reviewedToday = cards.filter(c => {
    if (!c.lastReview) return false;
    const today = new Date().setHours(0, 0, 0, 0);
    return c.lastReview >= today;
  }).length;

  return {
    total,
    byState,
    due,
    reviewedToday,
    masteryRate: total > 0 ? ((byState.mature / total) * 100).toFixed(1) : 0
  };
}

/**
 * 获取所有章节列表
 * @param {Array} cards - 卡片列表
 * @returns {Array} 章节列表
 */
function getChapters(cards) {
  const chapters = new Set();
  cards.forEach(card => chapters.add(card.chapter));
  return Array.from(chapters).sort();
}

// Node.js 导出
/* istanbul ignore else */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CardState,
    initCardState,
    filterCards,
    getDueCards,
    getNewCards,
    buildQueue,
    updateCardState,
    getStats,
    getChapters,
    shuffle
  };
}

// 浏览器全局变量
/* istanbul ignore next */
if (typeof window !== 'undefined') {
  window.CardQueue = {
    CardState,
    initCardState,
    filterCards,
    getDueCards,
    getNewCards,
    buildQueue,
    updateCardState,
    getStats,
    getChapters,
    shuffle
  };
}
