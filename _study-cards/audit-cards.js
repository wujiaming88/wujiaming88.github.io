const fs = require('fs');
const path = require('path');

const cardsFile = path.join(__dirname, 'cards-data.json');
const cards = JSON.parse(fs.readFileSync(cardsFile, 'utf-8'));

console.log(`Total cards: ${cards.length}\n`);

const issues = [];
const fixes = [];
const toDelete = new Set();

// 检查函数
function isTableFragment(text) {
  if (!text) return false;
  const lines = text.trim().split('\n');
  // 单行包含管道符且不是完整表格
  if (lines.length === 1 && text.includes('|')) {
    return true;
  }
  // 多行但缺少表头分隔符
  if (lines.length > 1 && text.includes('|')) {
    const hasSeparator = lines.some(line => /^\|?\s*[-:]+\s*\|/.test(line));
    if (!hasSeparator) {
      return true;
    }
  }
  return false;
}

function isListFragment(text) {
  if (!text) return false;
  const trimmed = text.trim();
  // 单行列表项
  return /^[-*]\s+[^\n]+$/.test(trimmed) && !trimmed.includes('\n');
}

function isEmpty(text) {
  if (!text) return true;
  return /^[\s\p{P}]*$/u.test(text);
}

function isValidQuestion(text) {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 3) return false;
  if (isTableFragment(trimmed)) return false;
  if (isListFragment(trimmed)) return false;
  return true;
}

function isValidAnswer(text) {
  if (!text) return false;
  if (isEmpty(text)) return false;
  return true;
}

function isCompleteTable(text) {
  if (!text || !text.includes('|')) return false;
  const lines = text.trim().split('\n').filter(l => l.trim());
  if (lines.length < 3) return false; // 至少需要表头、分隔符、一行数据

  const hasSeparator = lines.some(line => /^\|?\s*[-:]+\s*\|/.test(line));
  return hasSeparator;
}

// 审查所有卡片
cards.forEach((card, index) => {
  const id = `[${index}] ${card.chapter}`;

  // 检查 front
  if (!isValidQuestion(card.front)) {
    if (isTableFragment(card.front)) {
      issues.push(`${id}: front is table fragment: "${card.front.substring(0, 60)}"`);
    } else if (isListFragment(card.front)) {
      issues.push(`${id}: front is list fragment: "${card.front}"`);
    } else if (!card.front || card.front.trim().length < 3) {
      issues.push(`${id}: front is too short or empty: "${card.front}"`);
    }
  }

  // 检查 back
  if (!isValidAnswer(card.back)) {
    issues.push(`${id}: back is empty or invalid: "${card.back}"`);
  } else if (isTableFragment(card.back)) {
    issues.push(`${id}: back is table fragment: "${card.back.substring(0, 60)}"`);
  } else if (card.back.includes('|') && !isCompleteTable(card.back)) {
    issues.push(`${id}: back has incomplete table: "${card.back.substring(0, 60)}"`);
  }

  // 检查表格行数
  if (card.back && card.back.includes('|')) {
    const lines = card.back.trim().split('\n').filter(l => l.trim() && l.includes('|'));
    if (lines.length > 6) { // 表头 + 分隔符 + 4行数据
      issues.push(`${id}: back table too long (${lines.length} lines)`);
    }
  }
});

// 检查重复
const seen = new Map();
cards.forEach((card, index) => {
  const key = `${card.front}|||${card.back}`;
  if (seen.has(key)) {
    issues.push(`[${index}] Duplicate of [${seen.get(key)}]: "${card.front.substring(0, 40)}"`);
    toDelete.add(index);
  } else {
    seen.set(key, index);
  }
});

console.log(`\n=== ISSUES FOUND (${issues.length}) ===\n`);
issues.forEach(issue => console.log(issue));

console.log(`\n=== DUPLICATES TO DELETE (${toDelete.size}) ===\n`);
console.log([...toDelete].sort((a, b) => a - b).join(', '));

console.log(`\n=== SUMMARY ===`);
console.log(`Total cards: ${cards.length}`);
console.log(`Issues found: ${issues.length}`);
console.log(`Duplicates to delete: ${toDelete.size}`);
console.log(`Cards after cleanup: ${cards.length - toDelete.size}`);
