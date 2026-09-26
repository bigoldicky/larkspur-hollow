import { hasFlag } from './state.js';
import { escapeHtml } from './ui.js';

export function renderNotebook(state, notebookData, root) {
  const tier =
    state.difficulty === 'senior'
      ? 'senior'
      : state.difficulty === 'master'
        ? 'master'
        : 'junior';
  const tasks =
    notebookData.starterTasks[tier] || notebookData.starterTasks.junior || [];
  const taskHtml = tasks
    .map((t) => {
      const done = hasFlag(state, t.doneFlag);
      return `<li class="${done ? 'done' : ''}">${escapeHtml(t.text)}</li>`;
    })
    .join('');

  const entries =
    state.notebookEntries
      .map((e) => `<li class="entry">${escapeHtml(e)}</li>`)
      .join('') || '<li class="entry">No observations yet — poke around.</li>';

  const tod = state.timeOfDay === 'night' ? 'Night' : 'Day';
  root.innerHTML = `
    <div class="note-section">Time of day: ${tod}</div>
    <div class="note-section">Tasks (${tier} detective)</div>
    <ul class="note-list">${taskHtml}</ul>
    <div class="note-section">Observations</div>
    <ul class="note-list">${entries}</ul>
  `;
}
