# HSFL website

The website of the Hawaiʻi Space Flight Laboratory, as plain static files: HTML, CSS, JavaScript
and images. There is no build step, no CMS and nothing to install. Edit the site files at the repository root. The primary site is
`https://www.hsfl.hawaii.edu/`. GitHub Pages hosts a mirror.

## Layout

```
./                   static website at the repository root
  index.html         home page
  about/             About Us: vision, team (profiles in about/team/<name>/), partners,
                     contact, helpful links, media (logos)
  facilities/        ADCS, clean rooms, ground stations, TVAC, vibration table, ...
  services/  projects/  missions/  research/  education/  news/
  assets/images/     images used across the site (logo, hero photos)
  assets/            shared CSS, fonts, and scripts in css/, fonts/, core/, themes/, and vendor/
  404.html           "page not found"; also sends old addresses to their new pages
  _redirects         old addresses -> new pages (used by Netlify and Cloudflare Pages)
  _headers           security and caching headers (Netlify and Cloudflare Pages)
.github/workflows/   GitHub Pages deployment
```

Each page is a folder with an `index.html`. Images used by only one page sit in that page's
`images/` folder (documents in `files/`); images shared by several pages sit in their common
parent's `images/` folder, or in `assets/images/`.

## Editing

- Change text by editing the page's `index.html` in any text editor.
- Add a picture: put it in the page's `images/` folder and reference it relatively, e.g.
  `<img src="images/photo.jpg" alt="...">`.
- New page: copy a similar page's folder, rename it and edit it, then link to it from the menu.
  The menu is repeated in every page (search for `menu-primary-menu`), so a menu change means
  updating every page; a search-and-replace across the site does it.
- All links are relative (`about/`, `../images/x.jpg`), so the site works at any address.
  Keep new links relative too.

## Preview

Any static file server works, for example:

```bash
python3 -m http.server 8080
```

then open http://localhost:8080. Opening `index.html` by double-clicking also shows the pages, but
folder links (`about/`) only work through a server.

## Deploy

- **UH web server:** upload the public site files from the repository root. Keep
  canonical URLs and the sitemap on `https://www.hsfl.hawaii.edu/`.
- **GitHub Pages mirror:** set **Settings → Pages → Source** to **GitHub Actions**.
  The deployment workflow stages the public site files and publishes them on pushes to `main`.
  Use the default GitHub Pages URL for the mirror and keep the HSFL hostname on the UH server.
- **Netlify / Cloudflare Pages:** publish the repository root with no build command.
  These hosts read `_redirects` and `_headers`.

Still loaded from other sites: YouTube and Google Maps embeds, Google Fonts, and the HIGP, SOEST
and College of Engineering logos.
