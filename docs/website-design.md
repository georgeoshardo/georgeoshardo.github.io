# Scholar's desk website

Working theme on branch `scholar-desk-makeover`, developed in the isolated `website-design-studies` worktree. The personal website identity and approved sunlit-library design are implemented in Jekyll. No deployment is part of this change.

## Content and templates

- `_layouts/default.html`: shared page shell, sidebar, main landmark and footer.
- `_layouts/home.html`: approved introduction, three-panel mother-machine illustration, research summaries, and the full pre-existing homepage text.
- `_layouts/archive.html` and `_layouts/single.html`: list pages and document pages. Other legacy layouts inherit these to avoid duplicate sidebars or main landmarks.
- `_pages/publications.html`: reverse-chronological year groups, original author/citation text, venue and paper/BibTeX links. Citations use native HTML disclosure controls.
- `_pages/teaching.html`: all existing courses and student projects, with their original descriptions and detail-page links.
- `_pages/cv-json.md` and `_includes/cv-template.html`: the existing CV JSON data in an editorial layout, with print styles.
- `_includes/desk/`: shared navigation, resource links, research graphics and the editable mother-machine figure.
- `assets/css/desk.css`: shared typography, colour, page layouts, mobile presentation, focus styles and print rules.

Publication records, teaching records and `_data/cv.json` are unchanged. Homepage prose is retained; its two same-site publication links now use `relative_url` so they work in the preview as well as production. Existing URLs and redirects are retained. The illustration is conceptual rather than experimental data.

## Artwork and fonts

`assets/images/desk/` contains the approved artwork. The device and feeding-lane panels retain the user-supplied SVG channel paths. The feeding-lane hatch marks are simplified vector contours derived from imagegen artwork. The approved cell close-up remains raster. The figure include loads the three panels independently and keeps captions, flow arrows, zoom boxes and connectors editable. On narrow screens, it stacks the panels. A portable SVG supports the homepage's full-figure link.

EB Garamond is served locally from `assets/fonts/eb-garamond/`; its Open Font License is included. There is no external font service or client-side theme framework. MathJax can be enabled with `mathjax: true` in page front matter. Production analytics retain the existing provider; local preview analytics are disabled.

The `design-studies/` folder retains the mockups and illustration experiments locally. It, `tools/`, `docs/`, logs and local builds are excluded from the published site. No development server scripts, model prompts or intermediate images are exposed in the build.

## Build and checks

The existing Ruby 3.2 and Bundler 2.4.19 installation was used successfully. The global Ruby 4 Bundler wrapper remains untouched.

```sh
env PATH=/opt/homebrew/opt/ruby@3.2/bin:/opt/homebrew/bin:/usr/bin:/bin bundle _2.4.19_ exec jekyll build --safe --destination local/production
python3 tools/check_site.py local/production
```

When the original baseline build is available, also compare content and routes:

```sh
python3 tools/check_site.py local/production --baseline local/baseline
```

Validation completed on 24 September 2026:

- Safe-mode production build succeeds using the existing Gemfile and locally available dependencies.
- All 21 main and publication/teaching detail pages have valid local targets, required assets, one H1, unique IDs and valid accessible labels.
- Existing HTML routes, original page paragraphs and CV content pass comparison against the baseline build.
- Main pages reviewed in the actual browser at desktop and narrow-phone widths; no horizontal overflow found on the four main pages.
- Native citation disclosure, keyboard skip link, publication detail navigation and course detail navigation checked in the browser.
- No browser console errors or warnings observed during those checks. Main text/link palette was checked for at least 4.5:1 contrast against the paper background.
- The local preview is a real Jekyll server, not a file-viewer mockup. External scholarly sites and actual printing were not exhaustively tested.

## Current local preview

Address: `http://127.0.0.1:4173/`. It is bound to loopback only and uses `local/preview.yml` to disable analytics and set the local URL. The built site is in `local/site/`.

Tmux session: `georgeoshardo.github.io_scholar-desk-preview_20260924_011403`

```sh
tmux attach -t '=georgeoshardo.github.io_scholar-desk-preview_20260924_011403'
```

Detach with `Ctrl-b`, then `d`. Log: `local/logs/georgeoshardo.github.io_scholar-desk-preview_20260924_011403.log`. The matching `.done` or `.failed` marker appears only when the server exits. No heartbeat automation was created.

To stop only this preview:

```sh
tmux kill-session -t '=georgeoshardo.github.io_scholar-desk-preview_20260924_011403'
```

To restart in the foreground from the worktree:

```sh
env PATH=/opt/homebrew/opt/ruby@3.2/bin:/opt/homebrew/bin:/usr/bin:/bin bundle _2.4.19_ exec jekyll serve --host 127.0.0.1 --port 4173 --config _config.yml,local/preview.yml --destination local/site
```

The preview configuration and baseline are local development files, not committed site content. Review the four main pages together before deciding to publish.

## Approved stronger hatching

The user approved the stronger feeding-lane preview with a final 20% opacity increase. The exact approved standalone panel and full-figure SVG are now installed. Hatching extends 1.9 times farther from the walls, with the stronger preview’s 1.65 opacity multiplier followed by the approved 1.2 multiplier. Channel geometry, medium colour, and cell artwork remain unchanged. The local illustration builder reproduces these settings and preserves internal references when embedding the SVG. This update is local to the makeover branch and is not a deployment.

## Approved stronger pencil-line overview

The stronger pencil preview is installed on the left-hand mother-machine schematic, including the full-size composition. The original 956 channel path definitions are unchanged. The treatment uses coarser graphite grain, stronger pressure variation and more visible faint companion strokes. Existing pending captions/layout edits and the other two panels are preserved. This remains local to the makeover branch; it is not a deployment.

## Approved cell panel with nutrient medium

The user-approved cell close-up is installed in both the independent panel and full-size composition. It has regular rod-shaped cells, cleaned borders, stronger scientific-pencil hatching, and a deeper yellow nutrient-medium tint around cells inside trenches and in the broad feeding lane. Solid material above and between trenches remains lighter. The normalized PNG has identical decoded RGB pixels to the approved image. Other pending content/layout changes are preserved, and nothing has been published.
