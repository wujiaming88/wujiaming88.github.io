#!/usr/bin/env node
/**
 * 构建最终的单文件 HTML
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE_FILE = path.join(__dirname, 'study-cards-template.html');
const SM2_FILE = path.join(__dirname, 'sm2.js');
const QUEUE_FILE = path.join(__dirname, 'queue.js');
const SWIPE_FILE = path.join(__dirname, 'swipe.js');
const DATA_FILE = path.join(__dirname, 'cards-data.json');
const OUTPUT_FILE = path.join(__dirname, '../study-cards.html');

function build() {
  console.log('Building study-cards.html...');

  // 读取文件
  let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');
  const sm2Code = fs.readFileSync(SM2_FILE, 'utf-8');
  const queueCode = fs.readFileSync(QUEUE_FILE, 'utf-8');
  const swipeCode = fs.readFileSync(SWIPE_FILE, 'utf-8');
  const cardsData = fs.readFileSync(DATA_FILE, 'utf-8');

  // 清理代码(移除Node.js导出部分)
  const cleanSM2 = sm2Code
    .replace(/\/\/ Node\.js 导出[\s\S]*?\/\/ 浏览器全局变量/m, '// 浏览器全局变量')
    .replace(/\/\*\s*istanbul ignore.*?\*\//g, '')
    .trim();

  const cleanQueue = queueCode
    .replace(/\/\/ Node\.js 导出[\s\S]*?\/\/ 浏览器全局变量/m, '// 浏览器全局变量')
    .replace(/\/\*\s*istanbul ignore.*?\*\//g, '')
    .trim();

  const cleanSwipe = swipeCode
    .replace(/\/\/ Node\.js 导出[\s\S]*?\/\/ 浏览器全局变量/m, '// 浏览器全局变量')
    .replace(/\/\*\s*istanbul ignore.*?\*\//g, '')
    .trim();

  // 注入代码
  template = template.replace('// INJECT_SM2_HERE', cleanSM2);
  template = template.replace('// INJECT_QUEUE_HERE', cleanQueue);
  template = template.replace('// INJECT_SWIPE_HERE', cleanSwipe);
  template = template.replace('// INJECT_CARDS_DATA_HERE', `const CARDS_DATA = ${cardsData};`);

  // 写入输出文件
  fs.writeFileSync(OUTPUT_FILE, template);

  console.log(`✓ Built successfully: ${OUTPUT_FILE}`);
  console.log(`  File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
}

build();
