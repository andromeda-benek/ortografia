(function attachOrthographyLogic(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.OrthographyLogic = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createOrthographyLogic() {
  'use strict';

  const PAIRS = {
    u: ['u', 'ó'],
    ó: ['u', 'ó'],
    h: ['h', 'ch'],
    ch: ['h', 'ch'],
    ż: ['ż', 'rz'],
    rz: ['ż', 'rz'],
  };

  function parseWordList(text) {
    const seen = new Set();
    return String(text)
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .map((word) => word.trim())
      .filter((word) => word && !word.startsWith('#'))
      .filter((word) => {
        const key = word.toLocaleLowerCase('pl');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function generateTasks(words) {
    const tasks = [];
    for (const word of words) {
      const matches = word.matchAll(/ch|rz|ó|u|ż|h/giu);
      for (const match of matches) {
        const original = match[0];
        const missing = original.toLocaleLowerCase('pl');
        const index = match.index;
        tasks.push({
          id: `${word}:${index}:${missing}`,
          word,
          missing,
          pair: [...PAIRS[missing]],
          display: `${word.slice(0, index)}_${word.slice(index + original.length)}`,
          index,
          length: original.length,
        });
      }
    }
    return tasks;
  }

  function createSession(tasks, count, random = Math.random) {
    if (!Number.isInteger(count) || count < 1) throw new Error('Nieprawidłowa liczba zadań.');
    if (tasks.length < count) throw new Error(`Za mało zadań: potrzeba ${count}, dostępne ${tasks.length}.`);

    const shuffled = [...tasks];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled.slice(0, count);
  }

  function evaluateAnswer(task, selected) {
    return {
      taskId: task.id,
      word: task.word,
      correct: String(selected).toLocaleLowerCase('pl') === task.missing,
      selected: String(selected).toLocaleLowerCase('pl'),
    };
  }

  function summarizeResults(results) {
    const correct = results.filter((result) => result.correct);
    const incorrect = results.filter((result) => !result.correct);
    return {
      correctCount: correct.length,
      total: results.length,
      accuracy: results.length ? Math.round((correct.length / results.length) * 100) : 0,
      incorrect,
      correct,
    };
  }

  function appendHistory(history, entry, limit = 100) {
    const safeHistory = Array.isArray(history) ? history : [];
    return [...safeHistory, entry].slice(-limit);
  }

  return {
    PAIRS,
    parseWordList,
    generateTasks,
    createSession,
    evaluateAnswer,
    summarizeResults,
    appendHistory,
  };
});
