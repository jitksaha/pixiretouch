## Goal
Match the **Clipping Friend** layout language across all public pages, keeping our **rose copper** brand color and **content-rich** density.

## Visual system (kept consistent across all pages)
- Soft pastel **section bands** (alternating cream / muted rose / off-white) with generous rounded outer corners
- Large display headings (Italiana for accents, existing sans for body)
- Pill-shaped primary CTA in rose copper
- Zigzag (image ↔ text) row pattern for service & feature sections
- Side-by-side before/after thumbnail pairs as the dominant visual motif
- 4-up icon "Why us" cards, numbered process strip

## Page-by-page

### 1. Home (`src/routes/index.tsx`)
Replace current sections with this order:
1. **Hero** — split: headline + paragraph + "Get a quote" CTA on left, hero product photo on right with soft pastel rounded background
2. **Studio intro band** — illustration left, "We're a virtual photo editing studio" right + "Order now"
3. **"Professional Photoshop Services" overview** — 6 zigzag rows (Clipping Path, Background Removing, Photo Retouching, Image Masking, Shadow Making, Ghost Mannequin / Neck Joint). Each row: title, paragraph, sub-service bullet list, "Read more" → service detail, two before/after thumbs
4. **Why Choose Us** — 4 icon cards (Fast FTP, 3-step QC, 24/7 support, Pay after job)
5. **Large file CTA band** — copy + "FTP / Free trial" button (opens TrialDialog)
6. **How It Works** — 3 numbered process steps with illustration
7. Existing pre-footer + footer (unchanged structure)

### 2. Services list (`src/routes/services.index.tsx` + `services.tsx`)
Rebuild as the same zigzag pattern but expanded — full description, longer bullet lists, larger before/after pairs per service, anchor links from header submenu.

### 3. Service detail (`src/routes/services.$slug.tsx`)
Keep existing rich content (hero, before/after slider, process, deliverables, FAQ) but reskin section backgrounds to alternating pastel bands and adopt the zigzag row pattern for "Related services" and "What's included".

### 4. Sample / Portfolio (`src/routes/sample.tsx`)
Rebuild as a **masonry of before/after pairs** grouped by service category, with category chips at top and a sticky "Get a quote" CTA. Each pair uses the existing `BeforeAfter` slider component in a card.

### 5. Shared
- Add 1 illustration asset (studio scene) + reuse existing service images
- Tighten footer spacing to match the airy-but-content-rich rhythm
- No changes to Header behavior, Pricing, About, Blog, Contact, Admin

## Technical notes
- All content in TSX (no DB changes)
- New shared components:
  - `src/components/site/ServiceZigzag.tsx` (one zigzag service row)
  - `src/components/site/WhyUsGrid.tsx`
  - `src/components/site/HowItWorks.tsx`
- New section background tokens added to `src/styles.css` (`--surface-cream`, `--surface-rose-soft`) — derived from existing rose copper, no palette shift
- Generate 1 new studio illustration image; reuse existing before/after assets from `serviceImages.ts`
- No changes to routing, auth, or admin

## Out of scope
Pricing, About, Blog, Contact, Admin, Auth pages, Header/TrialDialog behavior.
