// Собирает форму заявления на возврат zayavlenie-na-vozvrat.pdf в корне
// репозитория из _src/zayavlenie.html. Нужен Playwright с Chromium.
// Запуск: node _src/build_pdf.js
// Когда появится ИНН, впишите его в INN и пересоберите PDF.
const INN = '';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const here = __dirname;
let html = fs.readFileSync(path.join(here, 'zayavlenie.html'), 'utf8');
for (const name of ['golos400', 'golos600']) {
  const b64 = fs.readFileSync(path.join(here, 'fonts', `${name}.woff2`)).toString('base64');
  html = html.replace(`FONT:${name}`, 'data:font/woff2;base64,' + b64);
}
html = html.replace('INN_PLACEHOLDER', INN || '____________________');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(here, '..', 'zayavlenie-na-vozvrat.pdf');
  await page.pdf({ path: out, format: 'A4', preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log(out, fs.statSync(out).size, 'байт');
})();
