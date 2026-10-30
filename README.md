# hsfl.github.io

Organization landing page for the **Hawaiʻi Space Flight Laboratory (HSFL)** at the University of Hawaiʻi at Mānoa, served by GitHub Pages at <https://hsfl.github.io>.

## Structure

- `index.html` — the page (About, Missions, Software, Repositories, Education, Contact)
- `assets/style.css` — styles (light/dark, responsive)
- `assets/main.js` — mobile nav and the live repository list from the GitHub API
- `.nojekyll` — serve files as-is, no Jekyll build

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publishing

In the repository's **Settings → Pages**, set the source to *Deploy from a branch*, branch `master`, folder `/ (root)`.
