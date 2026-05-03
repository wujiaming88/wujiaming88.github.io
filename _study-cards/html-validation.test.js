/**
 * HTML文件验证测试
 */

const fs = require('fs');
const path = require('path');

describe('HTML File Validation', () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(
      path.join(__dirname, '../study-cards.html'),
      'utf-8'
    );
  });

  test('HTML file exists and is not empty', () => {
    expect(htmlContent).toBeDefined();
    expect(htmlContent.length).toBeGreaterThan(1000);
  });

  test('contains SM2 algorithm code', () => {
    expect(htmlContent).toContain('function calculateSM2');
    expect(htmlContent).toContain('function mapButtonToQuality');
    expect(htmlContent).toContain('function getNextReviewDate');
    expect(htmlContent).toContain('function isDue');
  });

  test('contains CardQueue code', () => {
    expect(htmlContent).toContain('function buildQueue');
    expect(htmlContent).toContain('function initCardState');
    expect(htmlContent).toContain('function updateCardState');
    expect(htmlContent).toContain('function getStats');
    expect(htmlContent).toContain('function filterCards');
    expect(htmlContent).toContain('function getDueCards');
  });

  test('contains CARDS_DATA', () => {
    expect(htmlContent).toContain('const CARDS_DATA =');
    // 验证数据格式
    const match = htmlContent.match(/const CARDS_DATA = (\[[\s\S]*?\]);/);
    expect(match).toBeTruthy();
    if (match) {
      const data = JSON.parse(match[1]);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(100);

      // 验证第一张卡片
      const card = data[0];
      expect(card).toHaveProperty('chapter');
      expect(card).toHaveProperty('color');
      expect(card).toHaveProperty('front');
      expect(card).toHaveProperty('back');
      expect(card).toHaveProperty('tags');
    }
  });

  test('contains required HTML elements', () => {
    expect(htmlContent).toContain('id="cardContainer"');
    expect(htmlContent).toContain('id="card"');
    expect(htmlContent).toContain('id="cardFront"');
    expect(htmlContent).toContain('id="cardBack"');
    expect(htmlContent).toContain('id="buttonsContainer"');
    expect(htmlContent).toContain('id="statToday"');
    expect(htmlContent).toContain('id="statDue"');
    expect(htmlContent).toContain('id="statNew"');
    expect(htmlContent).toContain('id="statMastery"');
    expect(htmlContent).toContain('id="filterPanel"');
    expect(htmlContent).toContain('id="emptyState"');
  });

  test('contains action buttons', () => {
    expect(htmlContent).toContain('btn-again');
    expect(htmlContent).toContain('btn-hard');
    expect(htmlContent).toContain('btn-good');
    expect(htmlContent).toContain('btn-easy');
    expect(htmlContent).toContain('onclick="rateCard(1)"');
    expect(htmlContent).toContain('onclick="rateCard(2)"');
    expect(htmlContent).toContain('onclick="rateCard(3)"');
    expect(htmlContent).toContain('onclick="rateCard(4)"');
  });

  test('contains CSS styles', () => {
    expect(htmlContent).toContain('.card-container');
    expect(htmlContent).toContain('.card-face');
    expect(htmlContent).toContain('.action-btn');
    expect(htmlContent).toContain('.filter-panel');
    expect(htmlContent).toContain('@media (prefers-color-scheme: dark)');
  });

  test('contains application logic', () => {
    expect(htmlContent).toContain('function init()');
    expect(htmlContent).toContain('function showNextCard()');
    expect(htmlContent).toContain('function rateCard');
    expect(htmlContent).toContain('function flipCard()');
    expect(htmlContent).toContain('function updateQueue()');
    expect(htmlContent).toContain('function updateStats()');
    expect(htmlContent).toContain('localStorage');
  });

  test('contains mobile viewport meta tag', () => {
    expect(htmlContent).toContain('viewport');
    expect(htmlContent).toContain('width=device-width');
  });

  test('has proper HTML structure', () => {
    expect(htmlContent).toMatch(/^<!DOCTYPE html>/);
    expect(htmlContent).toContain('<html lang="zh-CN">');
    expect(htmlContent).toContain('</html>');
    expect(htmlContent).toContain('<head>');
    expect(htmlContent).toContain('</head>');
    expect(htmlContent).toContain('<body>');
    expect(htmlContent).toContain('</body>');
  });

  test('does not contain test-related code', () => {
    expect(htmlContent).not.toContain('module.exports');
    expect(htmlContent).not.toContain('require(');
    expect(htmlContent).not.toContain('istanbul ignore');
  });

  test('SM2 browser export is present', () => {
    expect(htmlContent).toContain('window.SM2');
  });

  test('CardQueue browser export is present', () => {
    expect(htmlContent).toContain('window.CardQueue');
  });

  test('file size is reasonable', () => {
    const stats = fs.statSync(path.join(__dirname, '../study-cards.html'));
    const sizeKB = stats.size / 1024;
    expect(sizeKB).toBeGreaterThan(50); // 至少50KB
    expect(sizeKB).toBeLessThan(500);   // 不超过500KB
  });

  test('contains color filter buttons', () => {
    expect(htmlContent).toContain('data-filter="color"');
    expect(htmlContent).toContain('data-value="red"');
    expect(htmlContent).toContain('data-value="yellow"');
    expect(htmlContent).toContain('data-value="green"');
  });

  test('contains chapter filter container', () => {
    expect(htmlContent).toContain('id="chapterFilters"');
    expect(htmlContent).toContain('章节筛选');
  });
});
