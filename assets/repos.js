// Repositories, loaded from the public GitHub API.
// #repo-list[data-mode="search"] shows results only while filtering (home page);
// data-mode="all" lists every repository (repositories page).
const LANG_COLORS = {
  'C++': '#f34b7d', C: '#555555', Python: '#3572A5', TypeScript: '#3178c6',
  JavaScript: '#f1e05a', Java: '#b07219', HTML: '#e34c26', 'C#': '#178600',
  CMake: '#DA3434', Shell: '#89e051', MATLAB: '#e16737', 'Jupyter Notebook': '#DA5B0B', QML: '#44a51c'
};
const list = document.getElementById('repo-list');
const filter = document.getElementById('repo-filter');
const langSelect = document.getElementById('repo-lang');
const count = document.getElementById('repo-count');
const searchOnly = list.dataset.mode === 'search';
let repos = [];
let failed = false;

function render() {
  const q = filter.value.trim().toLowerCase();
  const lang = langSelect ? langSelect.value : '';
  if (searchOnly && !q) {
    list.innerHTML = '';
    return;
  }
  if (failed) {
    list.innerHTML = '<p class="muted">Couldn’t load repositories right now. <a href="https://github.com/orgs/hsfl/repositories">Browse them on GitHub</a>.</p>';
    return;
  }
  if (!repos.length) {
    list.innerHTML = '<p class="muted">Loading repositories…</p>';
    return;
  }
  const shown = repos.filter(r =>
    (!lang || r.language === lang) &&
    (!q || r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q) ||
      (r.language || '').toLowerCase().includes(q) || (r.topics || []).some(t => t.includes(q))));
  if (count) count.textContent = `${shown.length} of ${repos.length} repositories`;
  if (!shown.length) {
    list.innerHTML = '<p class="muted">No matching repositories.</p>';
    return;
  }
  list.innerHTML = shown.map(r => `
    <a class="card repo" href="${r.html_url}">
      <h4>${escapeHtml(r.name)}</h4>
      <p>${escapeHtml(r.description || 'No description provided.')}</p>
      <div class="meta">
        ${r.language ? `<span><i class="lang-dot" style="background:${LANG_COLORS[r.language] || ''}"></i>${escapeHtml(r.language)}</span>` : ''}
        ${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ''}
        <span>Updated ${new Date(r.pushed_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
      </div>
    </a>`).join('');
}

async function loadRepos() {
  try {
    const res = await fetch('https://api.github.com/orgs/hsfl/repos?per_page=100&type=public&sort=pushed');
    if (!res.ok) throw new Error(res.status);
    repos = (await res.json())
      .filter(r => !r.fork && !r.archived && r.name !== '.github' && r.name !== 'hsfl.github.io')
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at));
    if (langSelect) {
      const langs = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();
      langSelect.insertAdjacentHTML('beforeend', langs.map(l => `<option>${escapeHtml(l)}</option>`).join(''));
    }
  } catch (err) {
    failed = true;
  }
  render();
}

filter.addEventListener('input', render);
if (langSelect) langSelect.addEventListener('change', render);
render();
loadRepos();
