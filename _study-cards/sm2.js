/**
 * SM-2 间隔重复算法
 * https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

/**
 * 计算下次复习间隔
 * @param {number} quality - 评分 0-5 (0=完全忘记, 3=困难, 4=容易, 5=非常容易)
 * @param {number} repetitions - 连续正确次数
 * @param {number} easeFactor - 容易度因子(>=1.3)
 * @param {number} interval - 当前间隔(天)
 * @returns {{interval: number, repetitions: number, easeFactor: number}}
 */
function calculateSM2(quality, repetitions, easeFactor, interval) {
  // 输入验证
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5');
  }
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  let newRepetitions = repetitions;
  let newEaseFactor = easeFactor;
  let newInterval = interval;

  // 评分 < 3: 重新开始
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1; // 1天后重新学习
  } else {
    // 评分 >= 3: 继续复习
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions = repetitions + 1;
  }

  // 更新容易度因子
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: parseFloat(newEaseFactor.toFixed(2))
  };
}

/**
 * 映射 Anki 风格按钮到 SM-2 评分
 * @param {number} buttonType - 1=忘了, 2=困难, 3=良好, 4=简单
 * @returns {number} SM-2 quality (0-5)
 */
function mapButtonToQuality(buttonType) {
  const mapping = {
    1: 0, // 忘了 -> 完全忘记
    2: 3, // 困难 -> 勉强记得
    3: 4, // 良好 -> 正确但费力
    4: 5  // 简单 -> 完美回忆
  };
  return mapping[buttonType] !== undefined ? mapping[buttonType] : 3;
}

/**
 * 计算下次复习时间(毫秒时间戳)
 * @param {number} intervalDays - 间隔天数
 * @returns {number} 时间戳
 */
function getNextReviewDate(intervalDays) {
  const now = Date.now();
  return now + intervalDays * 24 * 60 * 60 * 1000;
}

/**
 * 判断是否到期需要复习
 * @param {number} nextReview - 下次复习时间戳
 * @returns {boolean}
 */
function isDue(nextReview) {
  return Date.now() >= nextReview;
}

// Node.js 导出
/* istanbul ignore else */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateSM2,
    mapButtonToQuality,
    getNextReviewDate,
    isDue
  };
}

// 浏览器全局变量
/* istanbul ignore next */
if (typeof window !== 'undefined') {
  window.SM2 = {
    calculateSM2,
    mapButtonToQuality,
    getNextReviewDate,
    isDue
  };
}
