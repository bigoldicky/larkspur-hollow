import { requiresMet, setFlags, addNotebook, addItem } from './state.js';
import { escapeHtml } from './ui.js';
import { playTick } from './audio.js';

export function openDialogue(npcId, dialogueData, state, panelEls, onClose, onStateChange) {
  const npc = dialogueData[npcId];
  if (!npc) return;

  const { overlay, portrait, nameEl, textEl, choicesEl } = panelEls;
  portrait.textContent = npc.portrait;
  portrait.style.borderColor = npc.color || '#7eb8a0';
  nameEl.textContent = npc.name;
  nameEl.style.color = npc.color || '#7eb8a0';

  let queue = [];
  let qi = 0;

  function showLine() {
    if (qi < queue.length) {
      const line = queue[qi++];
      const who = line.speaker === 'mira' ? 'Mira Quill' : npc.name;
      nameEl.textContent = who;
      textEl.textContent = line.text;
      choicesEl.innerHTML = `<button type="button" id="dlg-cont">Continue</button>`;
      playTick();
      choicesEl.querySelector('#dlg-cont').onclick = showLine;
      return;
    }
    renderTopics();
  }

  function renderTopics() {
    nameEl.textContent = npc.name;
    textEl.textContent = npc.greeting;
    const topics = (npc.topics || []).filter((t) => {
      if (!requiresMet(state, t.requires || [])) return false;
      if (t.once && state.topicsDone[`${npcId}:${t.id}`]) return false;
      return true;
    });

    const buttons = topics
      .map(
        (t) =>
          `<button type="button" data-topic="${t.id}">${escapeHtml(t.label)}</button>`
      )
      .join('');

    choicesEl.innerHTML =
      buttons +
      `<button type="button" class="secondary" data-topic="__bye">Leave conversation</button>`;

    choicesEl.querySelectorAll('[data-topic]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tid = btn.dataset.topic;
        if (tid === '__bye') {
          overlay.classList.add('hidden');
          onClose?.();
          return;
        }
        const topic = npc.topics.find((x) => x.id === tid);
        if (!topic) return;
        state.topicsDone[`${npcId}:${tid}`] = true;
        setFlags(state, topic.sets || []);
        if (topic.giveItem) addItem(state, topic.giveItem);
        addNotebook(state, topic.notebook);
        queue = topic.lines || [];
        qi = 0;
        onStateChange?.();
        showLine();
      });
    });
  }

  overlay.classList.remove('hidden');
  renderTopics();
}
