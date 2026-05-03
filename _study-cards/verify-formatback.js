#!/usr/bin/env node
/**
 * Verify formatBack() rendering logic for all 225 cards
 */

const fs = require('fs');
const path = require('path');

// Load cards data
const cardsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cards-data.json'), 'utf8'));

// Copy the actual formatBack function from study-cards.html
function formatBack(text) {
  // HTML转义函数防止XSS (simplified for Node.js)
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Handle markdown bold (先转义再添加允许的HTML)
  function processBold(str) {
    return escapeHtml(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  // 检测是否是表格（含单行表格）
  const tableLines = text.split('\n').filter(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
  if (tableLines.length >= 1) {
    const lines = text.split('\n').filter(l => l.trim());
    let html = '<div class="table-wrapper"><table>';
    lines.forEach((line, i) => {
      if (line.match(/^[\s\-|:]+$/)) return; // 跳过分隔行
      if (!line.includes('|')) {
        // 非表格行，跳过
        return;
      }
      const cells = line.split('|').filter(c => c.trim()).map(c => processBold(c.trim()));
      const tag = (i === 0 && tableLines.length > 1) ? 'th' : 'td';
      html += '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
    });
    html += '</table></div>';
    // 处理表格外的非管道行
    const nonTableLines = text.split('\n').filter(l => l.trim() && !l.includes('|') && !l.match(/^[\s\-|:]+$/));
    if (nonTableLines.length > 0) {
      html += '<br>' + nonTableLines.map(l => processBold(l)).join('<br>');
    }
    return html;
  }

  // 处理列表（无序 - 和有序 1. 2.）
  let result = text;
  const hasUnorderedList = /^- .+$/m.test(result);
  const hasOrderedList = /^\d+\. .+$/m.test(result);

  if (hasUnorderedList || hasOrderedList) {
    const lines = result.split('\n');
    const htmlLines = lines.map(line => {
      const ulMatch = line.match(/^- (.+)$/);
      if (ulMatch) {
        return '<li>' + processBold(ulMatch[1]) + '</li>';
      }
      const olMatch = line.match(/^\d+\.\s*(.+)$/);
      if (olMatch) {
        return '<oli>' + processBold(olMatch[1]) + '</oli>';
      }
      return processBold(line);
    });
    result = htmlLines.join('\n');
    // 包裹无序列表
    result = result.replace(/((?:<li>.+<\/li>\n?)+)/g, '<ul>$1</ul>');
    // 包裹有序列表（用临时 <oli> 标记）
    result = result.replace(/((?:<oli>.+<\/oli>\n?)+)/g, function(match) {
      return '<ol>' + match.replace(/<\/?oli>/g, function(tag) {
        return tag.replace('oli', 'li');
      }) + '</ol>';
    });
  } else {
    result = processBold(result);
  }
  // 清理列表标签之间的换行，避免多余 <br>
  result = result.replace(/<\/li>\n<li>/g, '</li><li>');
  result = result.replace(/<\/li>\n<oli>/g, '</li><oli>');
  result = result.replace(/\n/g, '<br>');
  return result;
}

// Test patterns to detect rendering issues
const issues = [];

function checkForIssues(cardIndex, card, output) {
  const problems = [];

  // Check 1: ESCAPED HTML tags appearing (these should NOT be escaped)
  const escapedTagPatterns = [
    /&lt;ul&gt;/i, /&lt;\/ul&gt;/i, /&lt;li&gt;/i, /&lt;\/li&gt;/i,
    /&lt;ol&gt;/i, /&lt;\/ol&gt;/i,
    /&lt;table&gt;/i, /&lt;\/table&gt;/i,
    /&lt;br&gt;/i
  ];

  for (const pattern of escapedTagPatterns) {
    if (pattern.test(output)) {
      problems.push(`Escaped HTML tag found in output: ${pattern.source} - HTML is being rendered as text`);
      break;
    }
  }

  // Check 2: Empty output for non-empty input
  if (card.back && card.back.trim() && !output.trim()) {
    problems.push('Empty output for non-empty back content');
  }

  // Check 3: Malformed table structure
  if (output.includes('<table>')) {
    // Count opening and closing tags
    const openTr = (output.match(/<tr>/g) || []).length;
    const closeTr = (output.match(/<\/tr>/g) || []).length;
    const openTh = (output.match(/<th>/g) || []).length;
    const closeTh = (output.match(/<\/th>/g) || []).length;
    const openTd = (output.match(/<td>/g) || []).length;
    const closeTd = (output.match(/<\/td>/g) || []).length;

    if (openTr !== closeTr) {
      problems.push(`Unmatched <tr> tags: ${openTr} open, ${closeTr} close`);
    }
    if (openTh !== closeTh) {
      problems.push(`Unmatched <th> tags: ${openTh} open, ${closeTh} close`);
    }
    if (openTd !== closeTd) {
      problems.push(`Unmatched <td> tags: ${openTd} open, ${closeTd} close`);
    }

    // Check for <br> inside table cells (should not happen in table mode)
    if (/<t[dh]>.*<br>.*<\/t[dh]>/i.test(output)) {
      problems.push('Found <br> inside table cells (mixing table and text mode)');
    }
  }

  // Check 4: Lists should be wrapped in <ul> or <ol>
  if (!output.includes('<table>') && /^- .+$/m.test(card.back)) {
    // The back content has list markers, check if they're wrapped
    if (!output.includes('<ul>') && !output.includes('<li>')) {
      problems.push('List markers found but not wrapped in <ul>/<li>');
    }
  }
  if (!output.includes('<table>') && /^\d+\. .+$/m.test(card.back)) {
    // The back content has numbered list markers
    if (!output.includes('<ol>') && !output.includes('<li>')) {
      problems.push('Numbered list markers found but not wrapped in <ol>/<li>');
    }
  }

  // Check 5: Front or back is empty
  if (!card.front || !card.front.trim()) {
    problems.push('Empty front content');
  }
  if (!card.back || !card.back.trim()) {
    problems.push('Empty back content');
  }

  return problems;
}

// Process all cards
console.log('='.repeat(80));
console.log(`Verifying formatBack() for ${cardsData.length} cards...`);
console.log('='.repeat(80));
console.log();

let totalIssues = 0;
let cardsWithIssues = 0;
let emptyCards = 0;
let tableCards = 0;
let textCards = 0;

cardsData.forEach((card, index) => {
  const output = formatBack(card.back);
  const problems = checkForIssues(index, card, output);

  if (output.includes('<table>')) {
    tableCards++;
  } else {
    textCards++;
  }

  if (!card.front || !card.back) {
    emptyCards++;
  }

  if (problems.length > 0) {
    totalIssues += problems.length;
    cardsWithIssues++;

    console.log(`Card #${index + 1} (${card.chapter})`);
    console.log(`Front: ${card.front.substring(0, 60)}...`);
    console.log(`Back (first 100 chars): ${card.back.substring(0, 100)}...`);
    console.log(`Problems:`);
    problems.forEach(p => console.log(`  - ${p}`));
    console.log(`Output (first 200 chars): ${output.substring(0, 200)}...`);
    console.log('-'.repeat(80));
    console.log();
  }
});

// Summary
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total cards: ${cardsData.length}`);
console.log(`Cards with issues: ${cardsWithIssues}`);
console.log(`Total issues found: ${totalIssues}`);
console.log(`Empty cards (missing front/back): ${emptyCards}`);
console.log(`Table cards: ${tableCards}`);
console.log(`Text cards: ${textCards}`);
console.log();

if (totalIssues === 0) {
  console.log('✅ All cards render correctly!');
  process.exit(0);
} else {
  console.log('❌ Issues found - review output above');
  process.exit(1);
}
