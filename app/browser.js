(() => {
  'use strict';

  const logic = window.OrthographyLogic;
  const HISTORY_KEY = 'ortografia.history.v1';
  const FALLBACK_WORDS = `nóż
który
wakacjach
pachnący
duży
brzydki
przejażdżka
włożyły
łódka
kubek
Józek
przyniósł
wrócił
słup
też
włożył
ważne
kura`;

  const elements = {
    setup: document.querySelector('#setup-screen'),
    training: document.querySelector('#training-screen'),
    summary: document.querySelector('#summary-screen'),
    loadStatus: document.querySelector('#load-status'),
    sessionButtons: [...document.querySelectorAll('[data-count]')],
    progressLabel: document.querySelector('#progress-label'),
    progressFill: document.querySelector('#progress-fill'),
    liveScore: document.querySelector('#live-score'),
    word: document.querySelector('#word-with-gap'),
    options: document.querySelector('#answer-options'),
    feedback: document.querySelector('#feedback'),
    next: document.querySelector('#next-button'),
    summaryScore: document.querySelector('#summary-score'),
    incorrectSection: document.querySelector('#incorrect-section'),
    incorrectList: document.querySelector('#incorrect-list'),
    correctList: document.querySelector('#correct-list'),
    restart: document.querySelector('#restart-button'),
    chart: document.querySelector('#history-chart'),
    clearHistory: document.querySelector('#clear-history'),
  };

  let allTasks = [];
  let session = [];
  let results = [];
  let currentIndex = 0;

  function setScreen(screen) {
    elements.setup.hidden = screen !== 'setup';
    elements.training.hidden = screen !== 'training';
    elements.summary.hidden = screen !== 'summary';
  }

  function shuffledPair(pair) {
    return Math.random() < 0.5 ? [...pair] : [...pair].reverse();
  }

  function startSession(count) {
    session = logic.createSession(allTasks, count);
    results = [];
    currentIndex = 0;
    setScreen('training');
    renderTask();
  }

  function renderTask() {
    const task = session[currentIndex];
    elements.progressLabel.textContent = `Słowo ${currentIndex + 1} z ${session.length}`;
    elements.progressFill.style.width = `${(currentIndex / session.length) * 100}%`;
    elements.liveScore.textContent = `Poprawne: ${results.filter((result) => result.correct).length}`;
    elements.word.textContent = task.display;
    elements.options.replaceChildren();
    elements.feedback.hidden = true;
    elements.feedback.className = 'feedback';
    elements.next.hidden = true;

    for (const answer of shuffledPair(task.pair)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-tile';
      button.textContent = answer;
      button.dataset.answer = answer;
      button.addEventListener('click', () => submitAnswer(answer));
      elements.options.append(button);
    }
  }

  function submitAnswer(answer) {
    const task = session[currentIndex];
    const result = logic.evaluateAnswer(task, answer);
    results.push(result);

    for (const button of elements.options.querySelectorAll('button')) {
      button.disabled = true;
      if (button.dataset.answer === task.missing) button.classList.add('correct');
      if (button.dataset.answer === answer && !result.correct) button.classList.add('wrong');
    }

    elements.feedback.textContent = result.correct
      ? `Dobrze! Poprawny zapis: ${task.word}.`
      : `Niestety, to nie ten zapis. Poprawnie: ${task.word}.`;
    elements.feedback.classList.add(result.correct ? 'correct' : 'wrong');
    elements.feedback.hidden = false;
    elements.liveScore.textContent = `Poprawne: ${results.filter((item) => item.correct).length}`;
    elements.progressFill.style.width = `${((currentIndex + 1) / session.length) * 100}%`;
    elements.next.textContent = currentIndex === session.length - 1 ? 'Zobacz podsumowanie' : 'Dalej';
    elements.next.hidden = false;
    elements.next.focus();
  }

  function goNext() {
    if (currentIndex >= session.length - 1) {
      finishSession();
      return;
    }
    currentIndex += 1;
    renderTask();
  }

  function appendWords(list, items) {
    list.replaceChildren();
    for (const item of items) {
      const row = document.createElement('li');
      row.textContent = item.word;
      list.append(row);
    }
  }

  function finishSession() {
    const summary = logic.summarizeResults(results);
    elements.summaryScore.textContent = `${summary.correctCount}/${summary.total} — ${summary.accuracy}% poprawnych`;
    appendWords(elements.incorrectList, summary.incorrect);
    appendWords(elements.correctList, summary.correct);
    elements.incorrectSection.hidden = summary.incorrect.length === 0;

    const entry = {
      date: new Date().toISOString(),
      accuracy: summary.accuracy,
      correct: summary.correctCount,
      total: summary.total,
    };
    saveHistory(logic.appendHistory(loadHistory(), entry, 100));
    renderChart();
    setScreen('summary');
    window.scrollTo({ top: elements.summary.offsetTop - 16, behavior: 'smooth' });
  }

  function loadHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.slice(-100) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-100)));
  }

  function svgElement(name, attributes = {}) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  }

  function renderChart() {
    const history = loadHistory();
    const chart = elements.chart;
    chart.replaceChildren();
    const left = 58;
    const right = 780;
    const top = 18;
    const bottom = 220;

    for (const value of [0, 25, 50, 75, 100]) {
      const y = bottom - ((value / 100) * (bottom - top));
      chart.append(svgElement('line', { x1: left, x2: right, y1: y, y2: y, class: 'chart-grid' }));
      const label = svgElement('text', { x: 46, y: y + 5, class: 'chart-label', 'text-anchor': 'end' });
      label.textContent = `${value}%`;
      chart.append(label);
    }

    if (history.length === 0) {
      const empty = svgElement('text', { x: 410, y: 128, class: 'chart-empty' });
      empty.textContent = 'Ukończ trening, aby zobaczyć pierwszy wynik.';
      chart.append(empty);
      return;
    }

    const points = history.map((entry, index) => {
      const x = history.length === 1 ? (left + right) / 2 : left + (index / (history.length - 1)) * (right - left);
      const accuracy = Math.max(0, Math.min(100, Number(entry.accuracy) || 0));
      const y = bottom - ((accuracy / 100) * (bottom - top));
      return { x, y, accuracy };
    });

    if (points.length > 1) {
      chart.append(svgElement('polyline', {
        points: points.map((point) => `${point.x},${point.y}`).join(' '),
        class: 'chart-line',
      }));
    }
    for (const point of points) {
      const circle = svgElement('circle', { cx: point.x, cy: point.y, r: 6, class: 'chart-point' });
      circle.append(svgElement('title'));
      circle.firstChild.textContent = `${point.accuracy}%`;
      chart.append(circle);
    }
  }

  async function loadWords() {
    elements.sessionButtons.forEach((button) => { button.disabled = true; });
    elements.loadStatus.hidden = false;
    let text;
    try {
      const response = await fetch('./data/slowa.txt', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      text = await response.text();
    } catch {
      text = FALLBACK_WORDS;
    }

    const words = logic.parseWordList(text);
    allTasks = logic.generateTasks(words);
    if (allTasks.length < 20) {
      elements.loadStatus.textContent = `Lista daje tylko ${allTasks.length} zadań. Dodaj więcej słów do data/slowa.txt.`;
      elements.loadStatus.classList.add('error');
      return;
    }

    elements.sessionButtons.forEach((button) => { button.disabled = false; });
    elements.loadStatus.textContent = '';
    elements.loadStatus.hidden = true;
  }

  elements.sessionButtons.forEach((button) => {
    button.addEventListener('click', () => startSession(Number(button.dataset.count)));
  });
  elements.next.addEventListener('click', goNext);
  elements.restart.addEventListener('click', () => {
    setScreen('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  elements.clearHistory.addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderChart();
  });

  renderChart();
  loadWords();
})();
