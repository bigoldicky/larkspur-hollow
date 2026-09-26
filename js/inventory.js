import { escapeHtml } from './ui.js';

export function renderInventory(state, itemsData, barEl, onSelect) {
  const slots = state.inventory
    .map((id) => {
      const item = itemsData[id];
      if (!item) return '';
      const sel = state.selectedItem === id ? 'selected' : '';
      return `<button class="inv-slot ${sel}" data-item="${id}" title="${escapeHtml(item.description)}">
        <span class="ico">${item.icon}</span>
        <span>${escapeHtml(item.name)}</span>
      </button>`;
    })
    .join('');

  barEl.innerHTML =
    `<div class="label">Inventory</div>` +
    (slots || `<div class="inv-empty">Empty pockets. For now.</div>`);

  barEl.querySelectorAll('[data-item]').forEach((btn) => {
    btn.addEventListener('click', () => onSelect(btn.dataset.item));
  });
}

export function describeItem(itemsData, id) {
  return itemsData[id]?.description || 'A mysterious object.';
}
