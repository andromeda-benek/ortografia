const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('statyczna strona udostępnia wybór sesji, trening, podsumowanie i wykres', () => {
  const html = read('index.html');

  assert.match(html, /data-count="10"/);
  assert.match(html, /data-count="20"/);
  assert.match(html, /id="training-screen"/);
  assert.match(html, /id="summary-screen"/);
  assert.match(html, /id="history-chart"/);
  assert.match(html, /<script defer src="\.\/app\/logic\.js"><\/script>/);
  assert.match(html, /<script defer src="\.\/app\/browser\.js"><\/script>/);
  assert.doesNotMatch(html, /type="module"/);
});

test('ekran startowy nie pokazuje usuniętych tekstów pomocniczych ani komunikatu gotowości', () => {
  const source = `${read('index.html')}\n${read('app/browser.js')}`;

  assert.doesNotMatch(source, /Nauka przez krótkie serie/i);
  assert.doesNotMatch(source, /Uzupełniaj słowa i obserwuj swoje postępy\./i);
  assert.doesNotMatch(source, /Gotowe:/i);
});

test('kontroler pobiera edytowalną listę słów i używa wersjonowanego localStorage', () => {
  const browser = read('app/browser.js');

  assert.match(browser, /\.\/data\/slowa\.txt/);
  assert.match(browser, /ortografia\.history\.v1/);
  assert.match(browser, /textContent/);
});
