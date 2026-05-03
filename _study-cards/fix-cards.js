const fs = require('fs');
const path = require('path');

const cardsFile = path.join(__dirname, 'cards-data.json');
const cards = JSON.parse(fs.readFileSync(cardsFile, 'utf-8'));

console.log(`Original total: ${cards.length} cards`);

// 要删除的卡片索引（表格碎片，且有其他完整卡片覆盖相同知识点）
const toDelete = [24, 262];

console.log(`\nDeleting ${toDelete.length} cards with table fragments:\n`);
toDelete.forEach(idx => {
  console.log(`[${idx}] ${cards[idx].front}`);
  console.log(`  → back: "${cards[idx].back}"`);
});

// 创建新数组，排除要删除的卡片
const fixedCards = cards.filter((card, index) => !toDelete.includes(index));

console.log(`\n=== FIX SUMMARY ===`);
console.log(`Original cards: ${cards.length}`);
console.log(`Deleted cards: ${toDelete.length}`);
console.log(`Final cards: ${fixedCards.length}`);

// 保存修复后的文件
fs.writeFileSync(cardsFile, JSON.stringify(fixedCards, null, 2), 'utf-8');
console.log(`\n✓ Saved to ${cardsFile}`);
