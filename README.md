# Sansiro WebApp

A sleek, lightweight e-commerce platform designed for Sansiro Kenya, a perfume retail business.

## Coming Soon Page

This is the introductory landing page for SANSIRO Perfume. It displays a minimalist "Coming Soon" message with brand imagery.

### Tech Stack

- **Frontend:** React / Next.js (App Router)
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages (static export)

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

The static site is exported to the `out/` directory.

### Deploy to Cloudflare Pages

1. Push this repository to GitHub (or GitLab / Bitbucket).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select this repository and configure:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   - **Node.js version:** 22 (or set via `.node-version`)
4. Deploy.

Alternatively, deploy manually with Wrangler:

```bash
npm run build
npx wrangler pages deploy out --project-name=sansiro-webapp
```

## Roadmap

- Frictionless browsing of the perfume catalog
- Dynamic inventory powered by Supabase
- WhatsApp checkout integration
