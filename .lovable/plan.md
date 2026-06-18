
# Pixi Retouch — Full Site Build Plan

A complete rebrand and redesign of clippingfriend.com into "Pixi Retouch" — a premium, conversion-focused image editing agency site. Frontend only for now; forms and quote system will use client-side validation with a placeholder submit (ready to wire to a backend later).

## Phase 1 — Content migration (scrape)

Use the Firecrawl connector to capture the existing site so nothing is lost.

1. Connect Firecrawl (you'll get a prompt to approve).
2. `map` clippingfriend.com to list every URL (services, blog posts, portfolio, FAQs, legal).
3. `crawl` in batches (markdown + html + links + screenshots) — capped to keep credits sane.
4. Save the raw scrape to `src/content/source/` (gitignored from build) and produce normalized JSON:
   - `services.json` (13 services: title, slug, description, features, FAQs, pricing notes)
   - `portfolio.json` (items: category, before image URL, after image URL, title)
   - `videos.json` (YouTube/Vimeo embeds + categories)
   - `testimonials.json`
   - `faqs.json`
   - `blog.json` (posts: slug, title, excerpt, body markdown, hero image, date, author)
   - `legal.json` (privacy + terms bodies)
   - `stats.json`, `industries.json`, `clients.json`
5. Rewrite every "ClippingFriend" → "Pixi Retouch" in the normalized JSON. Keep URLs/slugs identical where possible to preserve SEO.
6. Mirror referenced images to `/public/migrated/...` (or keep remote URLs with lazy + WebP `<picture>` fallback) so the live site doesn't hotlink broken assets.

## Phase 2 — Design direction (you pick 1 of 3)

Call `design--create_directions` with:
- Locked brand: Pixi Retouch, premium image-editing agency
- Audience: ecommerce/Shopify/Amazon/fashion/agencies
- Mood: premium, modern, clean, trustworthy, SaaS-grade, lots of whitespace, soft gradients, dark-contrast sections, smooth motion
- Variants differ on composition / density / hero treatment / motion register — palette family stays in the premium professional zone across all three.

Each direction will include a homepage hero, services overview, before/after slider, portfolio grid, testimonials, and CTA so you can judge real composition. You pick one; I lock its tokens (colors, type, radius, spacing) into `src/styles.css` verbatim.

## Phase 3 — Architecture

Routes under `src/routes/` (TanStack Start, file-based):

```text
__root.tsx                 sitewide shell, header, footer, sticky CTAs, WhatsApp button
index.tsx                  Home
about.tsx
services.tsx               services overview
services.$slug.tsx         individual service page (13 services)
pricing.tsx
portfolio.tsx
before-after.tsx           dedicated B/A gallery
blog.tsx                   blog index
blog.$slug.tsx             post page
faq.tsx
contact.tsx
quote.tsx                  multi-step free quote
privacy.tsx
terms.tsx
api/public/healthz.ts      placeholder
```

Each route gets its own `head()` with unique title, description, og:title, og:description, canonical (relative), and JSON-LD where it applies (Organization, Service, Article, FAQPage, BreadcrumbList).

## Phase 4 — Component library

Shared, reusable, design-token driven:

- Layout: `Header` (transparent→solid on scroll), `Footer`, `Section`, `Container`
- Hero variants, `TrustBar` (client logos), `StatsStrip`
- `ServiceCard`, `ServiceGrid`, `IndustryCard`, `ProcessSteps`
- `BeforeAfterSlider` (drag handle, keyboard accessible)
- `PortfolioGrid` with category filter chips + lightbox
- `VideoSection` (YouTube + Vimeo lazy-iframe with poster)
- `TestimonialCarousel`, `QualityBadges`
- `FAQAccordion` (shadcn Accordion + FAQPage JSON-LD)
- `CTASection`, `StickyQuoteButton`, `WhatsAppFAB`
- `QuoteWizard` (4 steps: service → quantity/turnaround → files → contact → success), with Zod validation and a `react-dropzone`-style upload UI (client-side only, ready to POST later)
- `BlogCard`, `BlogPost` (renders markdown with `react-markdown`)

## Phase 5 — Conversion + SEO polish

- Sticky "Get Free Quote" CTA on every page; WhatsApp floating action button
- Free trial / instant quote / request estimate CTAs distributed per page
- Trust badges row, results-driven hero copy
- All images: `loading="lazy"`, `decoding="async"`, explicit width/height, `<picture>` with WebP source
- Strategic Pixiraw.com mentions in About (parent brand), Footer (family of brands), and a sidebar note on blog posts
- robots.txt + sitemap.xml generated from the route list
- JSON-LD: Organization (root), Service (per service page), Article (per blog), FAQPage (FAQ + service pages), BreadcrumbList (deep routes), ImageObject for portfolio
- A11y: semantic landmarks, single `<main>` per route, aria-labels on icon buttons, color tokens for contrast, keyboard-reachable before/after slider and lightbox

## Phase 6 — Performance

- Route-level code splitting (TanStack does this automatically)
- Preload LCP hero image per route via `head().links`
- Defer non-critical scripts; lazy-mount video iframes on intersection
- Avoid heavy libs; use Motion for React only where it adds value

## Phase 7 — QA pass

- Build, fix any TS errors
- Walk all 13 routes in the preview, check responsive at 360 / 768 / 1280
- Verify head metadata is unique per route
- Confirm no "ClippingFriend" string remains anywhere in source or scraped content

## Out of scope (deferred)

- Backend (Lovable Cloud) — quote submissions and blog CMS will be wired up in a follow-up. Forms validate client-side and show a success state.
- Real email/WhatsApp delivery
- Admin dashboard

## Technical notes

- Stack: TanStack Start v1 + React 19 + Tailwind v4 + shadcn/ui (already in template)
- Tokens: defined in `src/styles.css` via `@theme inline` after design direction is picked; no `tailwind.config.js`
- Fonts: loaded via `<link>` in `__root.tsx` head (Tailwind v4 rule)
- Content: static JSON under `src/content/` imported at build time — fast, no runtime fetch
- File uploads in the quote wizard: kept in component state with previews; no upload target yet
- Firecrawl: server-only via TanStack server functions; one-time scrape script, results committed as JSON so the live site has zero Firecrawl dependency at runtime

## What I need from you to start

Approve this plan. After approval I'll: (1) connect Firecrawl and run the scrape, (2) generate the 3 design directions and ask you to pick one, (3) build everything.
