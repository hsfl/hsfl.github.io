// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') links.classList.remove('open');
});

document.getElementById('year').textContent = new Date().getFullYear();

// Repositories, loaded from the public GitHub API
const LANG_COLORS = {
  'C++': '#f34b7d', C: '#555555', Python: '#3572A5', TypeScript: '#3178c6',
  JavaScript: '#f1e05a', Java: '#b07219', HTML: '#e34c26', 'C#': '#178600',
  CMake: '#DA3434', Shell: '#89e051', MATLAB: '#e16737', 'Jupyter Notebook': '#DA5B0B', QML: '#44a51c'
};
const list = document.getElementById('repo-list');
const filter = document.getElementById('repo-filter');
let repos = [];

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function render() {
  const q = filter.value.trim().toLowerCase();
  const shown = repos.filter(r =>
    !q || r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q) || (r.language || '').toLowerCase().includes(q));
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
    render();
  } catch (err) {
    list.innerHTML = '<p class="muted">Couldn’t load repositories right now. <a href="https://github.com/orgs/hsfl/repositories">Browse them on GitHub</a>.</p>';
  }
}

filter.addEventListener('input', render);
loadRepos();
