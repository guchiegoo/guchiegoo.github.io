# Wulesport storefront

The Wulesport shop: a fast, static site with Home, Shop, Product, Story, FAQ and Thanks pages. There is no server. Every product, price, colour, size and stock count comes from `public/catalog.json`. Buy buttons open Stripe Payment Links; until a variant has a link, its button reads **Coming soon**.

Built with Vite, React 19, TypeScript and react-router.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5190
```

## Test and build

```bash
npm test           # Vitest + Testing Library
npm run build      # type-check, build to dist/, copy index.html -> 404.html
npm run check:size # fails if initial JS is over 200 KB gzipped
npm run preview    # serve dist/ locally on port 5190
```

`404.html` is a copy of `index.html`, so deep links such as `/p/HD` still load on GitHub Pages.

## Where the product data comes from

`public/catalog.json` is **written by the space-station Business module**. Don't edit it by hand: the station overwrites it each time stock, prices or payment links change. It then commits and pushes the file, and the push triggers a rebuild.

The file you see now is sample data copied from the station on 2026-10-02, with every `buyUrl` set to `null`.

Shape:

```json
{
  "generatedAt": "2026-10-02T16:00:00.000Z",
  "business": "Wulesport",
  "shippingCents": 600,
  "styles": [
    {
      "code": "HD", "name": "Oversize Fleeced Hoodie", "priceCents": 4800,
      "images": ["images/HD/main.jpg"],
      "variants": [
        { "sku": "WULE-HD-PINK-M", "color": "Pink", "size": "M", "priceCents": 4800,
          "available": 1, "buyUrl": "https://buy.stripe.com/..." }
      ]
    }
  ]
}
```

Rules the site follows:

- A variant can be bought only when `available > 0` **and** `buyUrl` is set.
- With stock but no `buyUrl`, the button reads "Coming soon" and is disabled.
- Sold-out colours, sizes and styles stay visible with a "Sold out" tag.
- When 1 or 2 are left, the page shows "Only N left".
- The shipping price shown everywhere comes from `shippingCents`.

## Product photos

1. Put the photos in `public/images/{styleCode}/`, for example `public/images/HD/main.jpg`.
2. List them in that style's `images` array in `catalog.json`, for example `"images": ["images/HD/main.jpg"]`. The first image is the main one; any extra images appear as thumbnails on the product page.

The station should write the `images` list, so add images through the station and they will survive the next publish. Until a style has photos, or when a photo fails to load, the site draws a garment illustration in the selected colour.

## Editable copy

- `src/content/story.ts`: the home page, story and mission text.
- `src/content/policies.ts`: shipping, returns, sizing and contact.

Lines marked **PLACEHOLDER** (the charity line, the returns policy, sizing advice, the 3-day ship time and the contact email) need the owner's confirmation before launch.

## Deploy to GitHub Pages

The repo includes `.github/workflows/deploy.yml`. On every push to `main` it tests, builds, checks the bundle size and publishes `dist/`.

**Important: the site is built for the root of a domain** (`base: '/'`). It works at a custom domain such as `wulesport.com`, or at `https://<username>.github.io` when the repo is named `<username>.github.io`. A project URL like `https://<username>.github.io/wulesport-site/` will **not** work unless you change `base` in `vite.config.ts`, add a matching `basename` to `BrowserRouter`, and fetch `catalog.json` relative to that base.

Checklist:

- [ ] On github.com, click **+** (top right) → **New repository**.
- [ ] Name it (for example `wulesport-site`, or `<username>.github.io` if you won't use a custom domain). Leave **Add a README** unticked. Click **Create repository**.
- [ ] In this folder, connect and push:
  ```bash
  git remote add origin https://github.com/<username>/<repo>.git
  git push -u origin main
  ```
- [ ] On the repo page, go to **Settings** → **Pages** (left sidebar, under *Code and automation*).
- [ ] Under **Build and deployment** → **Source**, choose **GitHub Actions**.
- [ ] Open the **Actions** tab, and wait for **Deploy to GitHub Pages** to finish with a green tick. If it ran before Pages was enabled, open it and click **Re-run all jobs**.
- [ ] Back in **Settings** → **Pages**, the site URL is shown at the top. Open it and check Home, Shop and a product page.
- [ ] Optional custom domain: in **Settings** → **Pages** → **Custom domain**, enter the domain, click **Save**, then add the DNS records GitHub lists at your domain registrar. Tick **Enforce HTTPS** once it becomes available.
- [ ] In the station, set the site URL (used for Stripe's return page, `{siteUrl}/thanks`).

Once this is set up, the station's own commits to `public/catalog.json` redeploy the site automatically.
