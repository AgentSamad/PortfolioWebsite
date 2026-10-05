# Abdus Samad — Senior Game Developer

Responsive portfolio built with Next.js 15, React 19, and Tailwind CSS. Includes project galleries, experience, developer articles, and contact forms with animations and reduced-motion support.

## Run locally

Double-click `start-server.bat`, or:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Edit `src/data/content.json` for profile and experience, `src/data/portfolio.json` for projects, and `src/data/blogs.json` for articles.

## Contact

Contact email: **samadprogrammer@gmail.com**. Create a Web3Forms access key for this address and set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env.local` to enable direct delivery. For deployment, set the matching GitHub Actions repository secret. Rebuild after changing the key.

Without a key, submitting the form opens an email draft addressed to Samad. The visitor must send it from their email app.

## Verification and deployment

Run `npm run lint` and `npm run build`. Next.js exports to `out`. GitHub Actions builds with `PAGES_BASE_PATH=/PortfolioWebsite` and publishes pushes to `main` at https://agentsamad.github.io/PortfolioWebsite/.
