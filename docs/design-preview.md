# Cinematic portfolio preview

Local review: http://localhost:3000.

GitHub Pages target: https://agentsamad.github.io/PortfolioWebsite/

Production export preview: run the build with PAGES_BASE_PATH=/PortfolioWebsite, then run node scripts/preview-export.cjs and open http://localhost:3001/PortfolioWebsite/.

Charcoal surfaces, lime accents, ivory editorial headings, full-width navigation, real project thumbnails and responsive single-column phone layouts replace the original sidebar design.

The decorative hero was generated with the built-in image generation tool and optimized to WebP (about 209 KB). It is conceptual artwork, not a screenshot from a portfolio project.

Asset: public/assets/images/portfolio-hero.webp

Generation prompt: Cinematic wide landscape background for a professional game developer portfolio. No text, logos or UI. A dark-cloaked traveler on an ancient rocky terrace overlooks a lush valley, distant castle spires, aqueduct arches and ruins in golden evening light. Realistic painterly game concept art with charcoal shadows and muted greens, low detail on the left for page copy, the brightest composition on the right.

Verification:

- Production build and its lint checks pass; existing image/font warnings remain.
- Homepage checked at 320, 390, 768 and desktop widths without horizontal overflow.
- Mobile navigation opens, routes and closes.
- Featured and full portfolio category filters work.
- Project screenshot controls advance and expose their selected state.
- Resume, Markdown article and contact page render on phone.
- Contact form required fields checked; no live message was sent.
- Production export uses the deployment prefix for routes, images, and social metadata.
- Scary Teacher 3D is last in the full portfolio and excluded from homepage highlights.
