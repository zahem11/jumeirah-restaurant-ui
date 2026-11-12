# JUMEIRÀH Restaurant & Cafe — UI/UX Showcase

A fully client-side restaurant showcase: interactive bilingual (Arabic RTL) menu,
cart with local persistence, item customization, a full table-reservation flow,
and a mock owner dashboard — zero backend, zero API calls, zero build step.

**Live demo:** https://zahem11.github.io/jumeirah-restaurant-ui/

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Interactive menu — categories, favorites, cart drawer, service modes (delivery / pickup / reservation) |
| `customize.html` | Build-your-own sandwich flow with live pricing and a mock order confirmation |
| `reservation.html` | Table reservation — guest count, date/time, occasion, paid add-ons, confirmation code |
| `admin.html` | Owner dashboard — live order pipeline (new → preparing → delivered), simulated incoming orders, menu price/availability control |

## Tech

- Pure HTML5 / CSS3 / vanilla JavaScript (no frameworks, no build step)
- Client-side state via `localStorage` (cart, favorites, admin menu edits)
- Toast + modal confirmations instead of network calls
- Google Fonts (Cairo, Cormorant Garamond, Aref Ruqaa) + Unsplash imagery

## Run locally

```bash
python -m http.server 5199
# then open http://127.0.0.1:5199/index.html
```

(or serve with any static file server — `npx serve`, VS Code Live Server, etc.)
