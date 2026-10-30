// Publications, loaded from data/publications.json and grouped by year.
const pubList = document.getElementById('pub-list');
const pubFilter = document.getElementById('pub-filter');
const pubCount = document.getElementById('pub-count');
let pubs = [];

function renderPubs() {
  const q = pubFilter.value.trim().toLowerCase();
  const shown = pubs.filter(p => !q ||
    [p.title, p.authors, p.venue, String(p.year), ...(p.tags || [])].join(' ').toLowerCase().includes(q));
  pubCount.textContent = `${shown.length} of ${pubs.length} publications`;
  if (!shown.length) {
    pubList.innerHTML = '<p class="muted">No matching publications.</p>';
    return;
  }
  const years = [...new Set(shown.map(p => p.year))].sort((a, b) => b - a);
  pubList.innerHTML = years.map(y => `
    <section class="pub-year">
      <h2>${y}</h2>
      <ol class="pubs">
        ${shown.filter(p => p.year === y).map(p => `
          <li class="pub">
            ${p.url
              ? `<a class="pub-title" href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a>`
              : `<span class="pub-title">${escapeHtml(p.title)}</span>`}
            ${p.authors ? `<div class="pub-authors">${escapeHtml(p.authors)}</div>` : ''}
            <div class="pub-venue">${escapeHtml(p.venue)}</div>
            ${(p.tags || []).length ? `<div class="pub-tags">${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
          </li>`).join('')}
      </ol>
    </section>`).join('');
}

fetch('data/publications.json')
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(data => { pubs = data; renderPubs(); })
  .catch(() => { pubList.innerHTML = '<p class="muted">Couldn’t load publications.</p>'; });

pubFilter.addEventListener('input', renderPubs);
