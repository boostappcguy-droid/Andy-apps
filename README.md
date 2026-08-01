# State Cool AC & Heating — Website

A responsive front-end marketing site for **State Cool AC & Heating**, a family-owned HVAC company serving the Houston metro area (Houston, Tomball, Conroe, The Woodlands) since 2012.

## Structure

- `index.html` — single-page site (hero, services, about, service area with zip checker, reviews/accreditation, contact form, footer)
- `css/styles.css` — all styling (responsive, mobile nav, animations)
- `js/main.js` — mobile nav toggle, scroll reveal, zip coverage checker, contact form validation
- `assets/logo.png` / `assets/logo-header.png` — official logo (full-res and header-sized)
- `assets/favicon.svg` — site favicon
- `statecool-standalone.html` — single-file build with all assets inlined (regenerate with `python3 build-standalone.py`)
- `under-construction.html` — self-contained holding page for pre-launch
- `robots.txt` / `sitemap.xml` — crawl directives + sitemap for search engines

## SEO

On-page and technical SEO baked into `index.html`:

- Keyword-optimized `<title>` and meta description (AC repair & installation,
  Houston/Tomball/Conroe/The Woodlands)
- Canonical URL, robots directives, geo meta tags
- Open Graph + Twitter Card tags for link previews (uses `assets/photo-van.jpg`)
- **`HVACBusiness` JSON-LD structured data** (name, phone, address, geo, area
  served, services, social profiles) for local rich results
- `robots.txt` + `sitemap.xml` at the site root

After launch, submit the site in **Google Search Console** (verify the domain,
submit `https://statecool.com/sitemap.xml`) and confirm the Google Business
Profile NAP (name/address/phone) matches the JSON-LD exactly.

## Running locally

No build step required — it's static HTML/CSS/JS.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Google Reviews setup

The Reviews section can display live Google reviews (rating, count, and the 5
most recent) via `netlify/functions/reviews.js`, a serverless function that
calls the Google Places API server-side so the API key is never exposed in
page source. Responses are cached ~6 hours to stay well within free quota.

To activate it:

1. In [Google Cloud Console](https://console.cloud.google.com): create/select a
   project → enable the **Places API** → create an **API key** (restrict it to
   the Places API).
2. In Netlify: Site configuration → **Environment variables** → add
   `GOOGLE_MAPS_API_KEY` → redeploy.

The State Cool Place ID (`ChIJO5VUgpHLQIYRW82NC0Z1q7k`) is built into the
function as the default; set `GOOGLE_PLACE_ID` only to point at a different
listing.

The section stays hidden automatically until the function returns reviews, so
nothing breaks while unconfigured. Note: functions require the site to be
deployed from GitHub (or Netlify CLI) — anonymous Drop deploys don't run them.

## Notes

- The contact form validates client-side and shows a confirmation message; it is not wired to a backend or email service yet.
- The zip code checker is a front-end demo based on Houston-area zip prefixes (770–777) and always encourages calling to confirm.
- Business info (phone numbers, service area, accreditation) sourced from the company's public profiles (BBB, Facebook, Instagram).
