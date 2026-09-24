# DayBloc landing page + SEO structure

## Structure

- `index.html` — main landing page, preserving the existing interactive experience
- `assets/css/main.css` — extracted homepage styles + SEO strip
- `assets/js/main.js` — extracted homepage interactions
- `assets/css/seo.css` — lightweight shared styles for SEO pages
- `time-blocking-app/` — core keyword landing page
- `offline-time-blocking/` — offline/no-account landing page
- `adhd-planner/` — cautious ADHD-oriented planning page
- `time-blocking-for-students/` — student page
- `vs/structured/` — comparison page
- `vs/tiimo/` — comparison page
- `changelog/` — crawlable update page
- `robots.txt` — crawler rules + sitemap location
- `sitemap.xml` — pages to submit to Google Search Console

## Existing files to keep

Keep your existing `favicon-96x96.png`, `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`, and `privacy_policy.txt` in the project root. They were not part of the uploaded source file, so this package does not fabricate replacements.

## Deployment

Upload the contents of this folder as the web root for `daybloc.app`. Then submit `https://daybloc.app/sitemap.xml` in Google Search Console.

## Important platform note

This implementation treats DayBloc as Android-only because the current product strategy is Android-first. If the iOS app is currently live, restore the App Store button in `index.html` and adjust the Android-only wording.
