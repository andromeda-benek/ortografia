const test = require('node:test');
const assert = require('node:assert/strict');

const {
  parseWordList,
  generateTasks,
  createSession,
  evaluateAnswer,
  summarizeResults,
  appendHistory,
} = require('../app/logic.js');

test('lista słów jest czyszczona z pustych wierszy i duplikatów', () => {
  assert.deepEqual(parseWordList('\n nóż \n\nkura\nnóż\n'), ['nóż', 'kura']);
});

test('każde wystąpienie ó/u, ż/rz i h/ch tworzy osobne zadanie', () => {
  const tasks = generateTasks(['przejażdżka', 'Józek', 'pachnący']);

  assert.equal(tasks.length, 5);
  assert.deepEqual(
    tasks.map(({ word, missing, pair, display }) => ({ word, missing, pair, display })),
    [
      { word: 'przejażdżka', missing: 'rz', pair: ['ż', 'rz'], display: 'p__ejażdżka' },
      { word: 'przejażdżka', missing: 'ż', pair: ['ż', 'rz'], display: 'przeja__dżka' },
      { word: 'przejażdżka', missing: 'ż', pair: ['ż', 'rz'], display: 'przejażd__ka' },
      { word: 'Józek', missing: 'ó', pair: ['u', 'ó'], display: 'J__zek' },
      { word: 'pachnący', missing: 'ch', pair: ['h', 'ch'], display: 'pa__nący' },
    ],
  );
});

test('sesja zawiera żądaną liczbę unikalnych zadań', () => {
  const words = parseWordList('nóż\nktóry\nwakacjach\npachnący\nduży\nbrzydki\nprzejażdżka\nwłożyły\nłódka\nkubek\nJózek\nprzyniósł\nwrócił\nsłup\nteż\nwłożył\nważne\nkura');
  const session = createSession(generateTasks(words), 20, () => 0.42);

  assert.equal(session.length, 20);
  assert.equal(new Set(session.map((task) => task.id)).size, 20);
  assert.throws(() => createSession(generateTasks(['kura']), 10), /Za mało zadań/);
});

test('ocena odpowiedzi zwraca poprawny pełny wyraz i wynik', () => {
  const [task] = generateTasks(['Józek']);

  assert.deepEqual(evaluateAnswer(task, 'ó'), {
    taskId: task.id,
    word: 'Józek',
    correct: true,
    selected: 'ó',
  });
  assert.equal(evaluateAnswer(task, 'u').correct, false);
  assert.equal(evaluateAnswer(task, 'u').word, 'Józek');
});

test('podsumowanie liczy procent i dzieli słowa: błędne przed poprawnymi', () => {
  const results = [
    { word: 'kura', correct: true },
    { word: 'nóż', correct: false },
    { word: 'łódka', correct: true },
    { word: 'też', correct: false },
  ];

  assert.deepEqual(summarizeResults(results), {
    correctCount: 2,
    total: 4,
    accuracy: 50,
    incorrect: [results[1], results[3]],
    correct: [results[0], results[2]],
  });
});

test('historia zachowuje najwyżej 100 najnowszych podsumowań', () => {
  const history = Array.from({ length: 100 }, (_, index) => ({ accuracy: index }));
  const next = appendHistory(history, { accuracy: 100 }, 100);

  assert.equal(next.length, 100);
  assert.equal(next[0].accuracy, 1);
  assert.equal(next[99].accuracy, 100);
});
