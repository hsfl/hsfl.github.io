# hsfl.github.io

Organization landing page for the **Hawaiʻi Space Flight Laboratory (HSFL)** at the University of Hawaiʻi at Mānoa, served by GitHub Pages at <https://hsfl.github.io>.

## Structure

- `index.html` — home page (About, Missions, Software, featured repositories, Education, Contact)
- `repositories.html` — every public repository, live from the GitHub API, with search and language filter
- `publications.html` — publications grouped by year, with search
- `data/publications.json` — the publication list; add an entry here to publish a new paper
- `assets/style.css` — styles (light/dark, responsive)
- `assets/main.js` — shared nav and helpers
- `assets/repos.js`, `assets/publications.js` — repository and publication lists
- `.nojekyll` — serve files as-is, no Jekyll build

## Adding a publication

Append an object to `data/publications.json`:

```json
{
  "year": 2026,
  "title": "Paper title",
  "authors": "A. Author, B. Author",
  "venue": "Conference or journal",
  "url": "https://link-to-paper",
  "tags": ["Mission name"]
}
```

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publishing

In the repository's **Settings → Pages**, set the source to *Deploy from a branch*, branch `master`, folder `/ (root)`.
