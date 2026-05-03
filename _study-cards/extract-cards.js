#!/usr/bin/env node
/**
 * 从三色卡 markdown 提取卡片数据
 * 输出 cards-data.json
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = process.env.SOURCE_FILE || '/root/.openclaw/workspace/project/awesome-ruankao/study-guides/architecture/three-color-cards.md';
const OUTPUT_FILE = path.join(__dirname, 'cards-data.json');

function parseMarkdown(content) {
  const lines = content.split('\n');
  const cards = [];
  let currentChapter = '';
  let inTable = false;
  let tableHeaders = [];
  let tableData = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 章节标题
    if (line.match(/^##\s+\d+\./)) {
      currentChapter = line.replace(/^##\s+/, '').replace(/（.*?）/g, '').trim();
      continue;
    }

    // 三级标题(知识点)
    const colorMatch = line.match(/^###\s+(🔴|🟡|🟢)\s+(.+)/);
    if (colorMatch) {
      const colorEmoji = colorMatch[1];
      const title = colorMatch[2].replace(/（.*?）/g, '').trim();
      const color = colorEmoji === '🔴' ? 'red' : colorEmoji === '🟡' ? 'yellow' : 'green';

      // 读取后续内容
      const contentLines = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].match(/^###\s+/)) {
        contentLines.push(lines[j]);
        j++;
      }

      const sectionContent = contentLines.join('\n');

      // 提取表格
      const tableMatch = sectionContent.match(/\|.*\|/g);
      if (tableMatch && tableMatch.length > 2) {
        // 有表格,生成对比类卡片
        const tableText = tableMatch.join('\n');
        cards.push({
          chapter: currentChapter,
          color: color,
          front: `${title}的对比/分类是什么?`,
          back: tableText,
          tags: [title]
        });
      }

      // 提取列表项(必背要点等)
      const listItems = sectionContent.match(/^[-*]\s+\*\*(.+?)\*\*[：:]\s*(.+)$/gm);
      if (listItems) {
        listItems.forEach(item => {
          const keyMatch = item.match(/[-*]\s+\*\*(.+?)\*\*[：:]\s*(.+)/);
          if (keyMatch) {
            cards.push({
              chapter: currentChapter,
              color: color,
              front: `${title}: ${keyMatch[1]}是什么?`,
              back: keyMatch[2].trim(),
              tags: [title]
            });
          }
        });
      }

      // 提取关键定义(第一个bullet point或段落)
      const firstPara = contentLines.find(l => l.trim() && !l.match(/^[#>|]/));
      if (firstPara && firstPara.length < 200 && firstPara.match(/[-*]\s+/)) {
        const cleanPara = firstPara.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim();
        cards.push({
          chapter: currentChapter,
          color: color,
          front: `什么是${title}?`,
          back: cleanPara,
          tags: [title]
        });
      }

      continue;
    }
  }

  return cards;
}

function main() {
  console.log(`Reading from: ${SOURCE_FILE}`);
  const content = fs.readFileSync(SOURCE_FILE, 'utf-8');
  const cards = parseMarkdown(content);

  console.log(`Extracted ${cards.length} cards`);
  console.log(`Color distribution:
    Red: ${cards.filter(c => c.color === 'red').length}
    Yellow: ${cards.filter(c => c.color === 'yellow').length}
    Green: ${cards.filter(c => c.color === 'green').length}
  `);

  // 去重
  const uniqueCards = [];
  const seen = new Set();
  for (const card of cards) {
    const key = `${card.front}||${card.back}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueCards.push(card);
    }
  }

  console.log(`After deduplication: ${uniqueCards.length} cards`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueCards, null, 2));
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

main();
