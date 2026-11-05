# NJAcreative — A Playground of Ideas (Upgrade)

Website: https://njacreatives.my.id/

This package is a **full interactive upgrade** of your existing soft portfolio.

## What was preserved

- Hero text: “Creating little things, dreaming big.”
- Spring carousel images (slide-1 to slide-4)
- Creative Journey (Curious → Creating → Becoming) + expandable notes
- My Little Store products:
  - Flower Pin — Rp 25.000
  - Flower Clay Rings — Rp 35.000
  - Fluffy Doll — Rp 45.000
- All Instagram / order links
- Quote: “Create something that feels like you.”
- Let’s Talk / Instagram CTA
- Music file path (`music/cozy-jazz.mp3`)
- SEO meta, favicons, OG image paths
- Brand identity & soft spring tone

## What was added

| Section | Features |
|--------|----------|
| **Navigation** | Desktop links + mobile hamburger, theme toggle |
| **Creative Archive** | Filter by category, search, project cards, detail modal |
| **Inspiration Lab** | Palettes (copy hex), typography, mood, save favorites (localStorage) |
| **Behind the Creation** | 5-step process + before/after slider |
| **Idea Generator** | Random prompts, copy, save, clear (localStorage) |
| **Creative Playground** | Stickers, text, shapes, drag & drop, backgrounds, export PNG |
| **Little Guestbook** | Name + message, sticky notes, localStorage only |
| **Meet the Creator** | Link to https://kanja41-a11y.github.io/aboutme/ |
| **Global** | Custom cursor, music player (no autoplay), reading progress bar, light/dark theme, back-to-top, scroll reveal, reduced-motion support |

## How to deploy

1. **Backup** your current repo first.
2. Copy these files into your repo root (or merge carefully):
   - `index.html` → replace existing
   - `css/main.css` → new folder
   - `js/main.js` → new folder
   - `data/*.json` → new folder
3. Keep your existing folders:
   - `images/` (all product & slide images)
   - `music/`
   - `favicon.ico`, `site.webmanifest`, `robots.txt`, `sitemap.xml`, `CNAME`
4. Push to branch `mainn` (or whatever GitHub Pages uses).
5. Hard-refresh the live site (Ctrl+Shift+R).

## Editable data

| File | What you can edit |
|------|-------------------|
| `data/products.json` | Product name, price, description, image, link |
| `data/projects.json` | Portfolio projects (add real ones, remove placeholders) |
| `data/ideas.json` | Idea generator word lists |
| `data/inspiration.json` | Palettes, type pairs, moods |

## Notes

- Guestbook uses **localStorage** only (messages stay in each visitor’s browser).
- Playground export uses html2canvas from CDN (needs internet on the visitor’s side).
- Dark theme is saved in localStorage (`nja-theme`).
- Placeholders in Archive are clearly marked — replace with your real projects when ready.
- No Firebase secrets in frontend.

Made with curiosity & a little sparkle ♡
