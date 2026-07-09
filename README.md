# State Cool AC & Heating — Website

A responsive front-end marketing site for **State Cool AC & Heating**, a family-owned HVAC company serving the Houston metro area (Houston, Tomball, Conroe, The Woodlands) since 2012.

## Structure

- `index.html` — single-page site (hero, services, about, service area with zip checker, reviews/accreditation, contact form, footer)
- `css/styles.css` — all styling (responsive, mobile nav, animations)
- `js/main.js` — mobile nav toggle, scroll reveal, zip coverage checker, contact form validation
- `assets/favicon.svg` — site favicon

## Running locally

No build step required — it's static HTML/CSS/JS.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

- The contact form validates client-side and shows a confirmation message; it is not wired to a backend or email service yet.
- The zip code checker is a front-end demo based on Houston-area zip prefixes (770–777) and always encourages calling to confirm.
- Business info (phone numbers, service area, accreditation) sourced from the company's public profiles (BBB, Facebook, Instagram).
