#!/usr/bin/env node
/**
 * 验证 study-cards.html 的完整性
 */

const fs = require('fs');
const path = require('path');

const HTML_FILE = path.join(__dirname, '../study-cards.html');

const checks = [
  {
    name: 'File exists',
    test: () => fs.existsSync(HTML_FILE)
  },
  {
    name: 'File size > 50KB',
    test: () => fs.statSync(HTML_FILE).size > 50 * 1024
  },
  {
    name: 'Contains SM2 algorithm',
    test: () => {
      const content = fs.readFileSync(HTML_FILE, 'utf-8');
      return content.includes('function calculateSM2') &&
             content.includes('window.SM2');
    }
  },
  {
    name: 'Contains CardQueue',
    test: () => {
      const content = fs.readFileSync(HTML_FILE, 'utf-8');
      return content.includes('function buildQueue') &&
             content.includes('window.CardQueue');
    }
  },
  {
    name: 'Contains card data',
    test: () => {
      const content = fs.readFileSync(HTML_FILE, 'utf-8');
      const match = content.match(/const CARDS_DATA = (\[[\s\S]*?\]);/);
      if (!match) return false;
      const data = JSON.parse(match[1]);
      return data.length > 100;
    }
  },
  {
    name: 'All required HTML elements present',
    test: () => {
      const content = fs.readFileSync(HTML_FILE, 'utf-8');
      const required = [
        'id="cardContainer"',
        'id="card"',
        'id="cardFront"',
        'id="cardBack"',
        'id="buttonsContainer"',
        'id="filterPanel"',
        'onclick="rateCard'
      ];
      return required.every(el => content.includes(el));
    }
  },
  {
    name: 'No test artifacts',
    test: () => {
      const content = fs.readFileSync(HTML_FILE, 'utf-8');
      return !content.includes('module.exports') &&
             !content.includes('istanbul ignore');
    }
  },
  {
    name: 'Valid HTML structure',
    test: () => {
      const content = fs.readFileSync(HTML_FILE, 'utf-8');
      return content.startsWith('<!DOCTYPE html>') &&
             content.includes('</html>');
    }
  }
];

console.log('\n🔍 Verifying study-cards.html...\n');

let passed = 0;
let failed = 0;

checks.forEach(check => {
  try {
    const result = check.test();
    if (result) {
      console.log(`✅ ${check.name}`);
      passed++;
    } else {
      console.log(`❌ ${check.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${check.name} - Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! The file is ready for deployment.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please review and rebuild.\n');
  process.exit(1);
}
