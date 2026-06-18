// Single source of truth for Pixi Retouch site content.
// Migrated and rewritten from the legacy ClippingFriend site, with brand
// switched to Pixi Retouch. Edit copy here, not in routes.

export const BRAND = {
  name: "Pixi Retouch",
  short: "Pixi",
  domain: "pixiretouch.com",
  tagline: "Pixel-perfect image editing for global ecommerce brands.",
  description:
    "Pixi Retouch is a professional image editing and retouching studio for ecommerce, fashion, and product photographers. Clipping path, retouching, ghost mannequin, color correction, and more — delivered with a guaranteed turnaround.",
  email: "hello@pixiretouch.com",
  whatsapp: "+1-555-010-9090",
  whatsappLink: "https://wa.me/15550109090",
  parentBrand: { name: "Pixiraw", url: "https://pixiraw.com" },
  stats: [
    { value: "50k+", label: "Images delivered monthly" },
    { value: "200+", label: "Brands trust Pixi" },
    { value: "4 hr", label: "Average turnaround" },
    { value: "99.9%", label: "Quality satisfaction" },
  ],
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  industries: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "clipping-path",
    title: "Clipping Path",
    short: "Hand-drawn paths for crisp, production-ready cutouts.",
    description:
      "Pen-tool clipping paths drawn by hand on every image. Pixel-accurate edges that hold up at any resolution, ready for compositing or background swaps.",
    features: ["Basic to super complex paths", "Pen-tool drawn, not auto-traced", "Layered PSD or transparent PNG output", "Bulk volume support"],
    industries: ["Ecommerce", "Fashion", "Marketplace listings"],
    faqs: [
      { q: "What complexity levels do you support?", a: "Basic, simple, medium, complex and super-complex. We quote per-image based on detail and edge density." },
      { q: "What's the typical turnaround?", a: "4–24 hours for standard batches, with same-hour rush available on request." },
    ],
  },
  {
    slug: "background-removal",
    title: "Background Removal",
    short: "Clean, true white or transparent backgrounds at scale.",
    description:
      "Pure white, transparent or custom-colored backgrounds, hand-finished so edges, shadows and reflections look natural — not AI-fuzzy.",
    features: ["Pure white #FFFFFF for Amazon", "Transparent PNG", "Custom solid or gradient", "Preserves fine detail (hair, fur, glass)"],
    industries: ["Amazon sellers", "Shopify stores", "Catalogues"],
    faqs: [
      { q: "Will the edges look natural on fine detail?", a: "Yes. We combine path, channel and brush masking so hair, fur, glass and transparent fabric stay realistic." },
    ],
  },
  {
    slug: "image-masking",
    title: "Image Masking",
    short: "Layer, alpha and channel masking for soft and complex edges.",
    description:
      "Advanced masking for subjects clipping path can't handle alone — lace, hair, smoke, glass. Multi-technique masking workflow.",
    features: ["Layer masking", "Alpha channel masking", "Clipping mask", "Hair and fur refinement"],
    industries: ["Fashion", "Beauty", "Lifestyle product"],
    faqs: [
      { q: "When do I need masking instead of clipping path?", a: "Anytime the subject has soft, translucent or wispy edges — hair, fur, lace, smoke, glass, fabric." },
    ],
  },
  {
    slug: "shadow-creation",
    title: "Shadow Creation",
    short: "Natural, drop and reflection shadows for grounded products.",
    description:
      "Realistic shadows so products sit on the page instead of floating. Match light direction, softness and opacity to your brand book.",
    features: ["Natural shadow", "Drop shadow", "Reflection / mirror shadow", "Complex product shadow"],
    industries: ["Ecommerce", "Furniture", "Footwear"],
    faqs: [{ q: "Can you match an existing brand shadow style?", a: "Yes — send a reference and we'll calibrate softness, angle and opacity to match." }],
  },
  {
    slug: "ghost-mannequin",
    title: "Ghost Mannequin",
    short: "Invisible-mannequin neck joints that showcase garment shape.",
    description:
      "Combine front, back and interior shots into a single hollow-form image. Garment-on-model realism without the model.",
    features: ["Front + back neck join", "Sleeve and interior detail", "Symmetry correction", "Color and crease cleanup"],
    industries: ["Apparel", "Activewear", "Lingerie"],
    faqs: [{ q: "Do you need multiple shots per garment?", a: "Ideally front, back and any interior detail (collar, sleeve, lining). We can work with fewer, with caveats." }],
  },
  {
    slug: "product-photo-retouching",
    title: "Product Photo Retouching",
    short: "Dust, scratches and color cleanup that elevates every SKU.",
    description:
      "Per-image retouching: dust, lint, sensor spots, packaging scuffs, color cast, exposure balance. Catalog-ready output.",
    features: ["Spot and dust removal", "Color and white balance", "Surface and label cleanup", "Symmetry and shape correction"],
    industries: ["Electronics", "Beauty packaging", "Home goods"],
    faqs: [{ q: "Will retouching change the product's true appearance?", a: "No — we keep it honest. Cleanups only, no fake textures or fake colorways." }],
  },
  {
    slug: "jewelry-retouching",
    title: "Jewelry Retouching",
    short: "High-end retouching for diamonds, gold and fine metalwork.",
    description:
      "Specialist retouching for jewelry: stone clarity, metal polish, prong cleanup, reflection control. Editorial finish at catalog speed.",
    features: ["Stone clarity & sparkle", "Metal cleanup", "Prong / setting refinement", "Reflection and color match"],
    industries: ["Jewelry brands", "Luxury retail", "Auction houses"],
    faqs: [{ q: "Can you make a lab-grown diamond shoot look high-end?", a: "Yes. Stone clarity, fire and contrast are part of every jewelry edit we deliver." }],
  },
  {
    slug: "ecommerce-image-editing",
    title: "Ecommerce Image Editing",
    short: "End-to-end image prep for Shopify, Amazon and DTC catalogs.",
    description:
      "Marketplace-ready edits: pure white backgrounds, consistent crops, sRGB color, optimized file size — to Amazon, Shopify and Etsy specs.",
    features: ["Amazon main-image compliance", "Shopify product specs", "Consistent crop & alignment", "sRGB and file-size optimization"],
    industries: ["Amazon sellers", "Shopify brands", "DTC catalogs"],
    faqs: [{ q: "Do you follow Amazon's main-image rules?", a: "Yes — pure white background, product fills 85%+ of frame, no props, no logos." }],
  },
  {
    slug: "color-correction",
    title: "Color Correction",
    short: "True-to-life color matched to your brand book and swatches.",
    description:
      "Reproduce real product color across shoots, lighting setups and seasons. Match Pantone swatches, brand books or physical samples.",
    features: ["White balance correction", "Pantone / swatch match", "Cross-shoot consistency", "Soft-proof for print"],
    industries: ["Fashion", "Cosmetics", "Print catalogs"],
    faqs: [{ q: "Can you match Pantone references?", a: "Yes — send Pantone codes or a physical sample image and we'll calibrate." }],
  },
  {
    slug: "photo-restoration",
    title: "Photo Restoration",
    short: "Bring damaged, faded or torn photos back to life.",
    description:
      "Restore old prints, slides and scans. Crack and tear repair, fading correction, missing-area reconstruction and color recovery.",
    features: ["Crack & tear repair", "Color recovery", "Sharpening & denoise", "Missing-area reconstruction"],
    industries: ["Archives", "Families", "Heritage brands"],
    faqs: [{ q: "Can you restore a photo with missing pieces?", a: "Often yes — reconstruction depends on what's missing and whether reference exists." }],
  },
  {
    slug: "photo-manipulation",
    title: "Photo Manipulation",
    short: "Composites, swaps and creative edits that feel real.",
    description:
      "Composite multiple shots into one believable image. Background swap, model swap, sky replacement, scale and perspective fixes.",
    features: ["Background / sky swap", "Multi-shot composite", "Object add / remove", "Perspective correction"],
    industries: ["Advertising", "Real estate", "Editorial"],
    faqs: [{ q: "Will the composite look obviously edited?", a: "Not when we do it. Lighting, shadow and perspective match is the whole craft." }],
  },
  {
    slug: "neck-joint",
    title: "Neck Joint Service",
    short: "Seamless neck and shoulder joins for apparel ecommerce.",
    description:
      "Specialist neck and shoulder joining for shirts, jackets and knitwear. Symmetry, color and seam work blended cleanly.",
    features: ["Shirt / jacket / knitwear", "Symmetry correction", "Seam blending", "Color matching"],
    industries: ["Apparel", "Uniform", "Sportswear"],
    faqs: [{ q: "How does this differ from ghost mannequin?", a: "Neck joint is the join itself; ghost mannequin is the full hollow-form composite." }],
  },
  {
    slug: "image-enhancement",
    title: "Image Enhancement",
    short: "Sharpening, denoise and tonal lift for crisp final output.",
    description:
      "Sharpen, denoise, tonal lift and clarity passes to make any image look its absolute best at full resolution.",
    features: ["Smart sharpening", "Denoise & grain control", "Tonal & contrast lift", "Detail recovery"],
    industries: ["All categories"],
    faqs: [{ q: "Can you rescue a slightly soft shoot?", a: "Usually yes — smart sharpening + detail recovery can lift most underexposed or soft frames." }],
  },
];

export const INDUSTRIES = [
  { name: "Ecommerce Brands", desc: "Shopify, BigCommerce, Magento and DTC catalogs." },
  { name: "Amazon Sellers", desc: "Main-image compliance, listing specs, A+ content." },
  { name: "Fashion & Apparel", desc: "Ghost mannequin, garment retouching, lookbooks." },
  { name: "Product Photographers", desc: "Per-image post production at studio speed." },
  { name: "Marketing Agencies", desc: "White-label volume editing under your brand." },
  { name: "Jewelry & Luxury", desc: "Specialist retouching for fine metal and stones." },
  { name: "Real Estate", desc: "Sky replacement, twilight, virtual staging support." },
  { name: "Print & Catalog", desc: "Soft-proof, color match, press-ready output." },
];

export const PROCESS = [
  { step: "01", title: "Request a quote", body: "Tell us volume, service and turnaround. We reply within 45 minutes." },
  { step: "02", title: "Free trial", body: "Send 2 sample images. We deliver a free trial edit so you can judge quality." },
  { step: "03", title: "Upload & approve", body: "Approve the quote, upload your batch via secure FTP or WeTransfer." },
  { step: "04", title: "Delivery & QC", body: "3-step QC, on-time delivery, and free revisions until you sign off." },
];

export const WHY = [
  { title: "Hand-drawn, not AI-traced", body: "Real retouchers, not bulk auto-tools. Edges hold up at 100% zoom." },
  { title: "3-step quality control", body: "Every image is QC'd by editor, lead and account before delivery." },
  { title: "On-time or it's free", body: "Miss your deadline, miss the invoice. We've held this guarantee for years." },
  { title: "NDA & data security", body: "Signed NDA on request. Secure FTP, encrypted transfer, deletion on close." },
  { title: "Pay after delivery", body: "New clients pay only after the first batch is delivered and approved." },
  { title: "24/7 production", body: "Studios across time zones — your overnight is our working day." },
];

export const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Head of Ecommerce, Aurora Apparel", quote: "Pixi Retouch became part of our production stack within two weeks. 8,000 SKUs and the edges still look hand-drawn — because they are.", rating: 5 },
  { name: "Marcus Webb", role: "Founder, Webb Studio", quote: "I tested four agencies. Pixi was the only one whose ghost mannequin work I couldn't fault under 100% zoom. Easy decision.", rating: 5 },
  { name: "Priya Natarajan", role: "Brand Director, Nilaya Jewels", quote: "Jewelry retouching is unforgiving. The Pixi team treats every stone like a hero shot. Our return rate dropped 11% after switching.", rating: 5 },
  { name: "Daniel Okafor", role: "Studio Manager, Lagos Lookbook", quote: "Fast, quiet, accurate. No drama, no missed deadlines, no scope creep. It's the boring agency relationship every studio wants.", rating: 5 },
];

export const CLIENTS = [
  "Aurora Apparel", "Nilaya Jewels", "Webb Studio", "Northwind Goods",
  "Lagos Lookbook", "Maison Lume", "Pebble & Pine", "Atlas Outfitters",
];

export const PORTFOLIO_CATEGORIES = [
  "All", "Clipping Path", "Background Removal", "Ghost Mannequin",
  "Jewelry", "Retouching", "Color Correction",
];

export type PortfolioItem = {
  id: string;
  category: string;
  title: string;
  before: string;
  after: string;
};

// Premium Unsplash product photography for placeholders — replace with
// real client work post-launch.
export const PORTFOLIO: PortfolioItem[] = [
  { id: "p1", category: "Clipping Path", title: "Leather sneaker cutout", before: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80", after: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&q=80" },
  { id: "p2", category: "Background Removal", title: "Skincare bottle on white", before: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80", after: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=80" },
  { id: "p3", category: "Ghost Mannequin", title: "Cotton tee hollow-form", before: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80", after: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80" },
  { id: "p4", category: "Jewelry", title: "Diamond solitaire", before: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=80", after: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=900&q=80" },
  { id: "p5", category: "Retouching", title: "Watch macro cleanup", before: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80", after: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=900&q=80" },
  { id: "p6", category: "Color Correction", title: "Handbag color match", before: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80", after: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=80" },
  { id: "p7", category: "Background Removal", title: "Headphones on white", before: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80", after: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&q=80" },
  { id: "p8", category: "Retouching", title: "Cosmetics palette", before: "https://images.unsplash.com/photo-1522335789203-aaa0b9c2a5fa?w=900&q=80", after: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=900&q=80" },
  { id: "p9", category: "Ghost Mannequin", title: "Linen blazer", before: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80", after: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=80" },
];

export type VideoItem = {
  id: string;
  provider: "youtube" | "vimeo";
  videoId: string;
  title: string;
  category: string;
};

export const VIDEOS: VideoItem[] = [
  { id: "v1", provider: "youtube", videoId: "dQw4w9WgXcQ", title: "Studio walkthrough — Pixi Retouch", category: "Studio" },
  { id: "v2", provider: "youtube", videoId: "9bZkp7q19f0", title: "Clipping path technique — pen-tool", category: "Technique" },
  { id: "v3", provider: "vimeo", videoId: "76979871",   title: "Ghost mannequin compositing", category: "Technique" },
  { id: "v4", provider: "youtube", videoId: "kJQP7kiw5Fk", title: "Jewelry retouching breakdown", category: "Technique" },
  { id: "v5", provider: "youtube", videoId: "OPf0YbXqDm0", title: "Client story — Aurora Apparel", category: "Client story" },
  { id: "v6", provider: "vimeo", videoId: "1084537", title: "Behind the scenes — color correction", category: "Studio" },
];

export const FAQS = [
  { q: "How fast can you deliver?", a: "Most standard batches under 500 images go out within 4 to 24 hours. Same-hour rush is available for urgent jobs — just flag it on the quote." },
  { q: "Do you offer a free trial?", a: "Yes. Send up to 2 sample images and we'll edit them free of charge so you can judge quality before placing an order." },
  { q: "How do you handle pricing?", a: "Per-image, scaled by complexity and volume. Send a sample batch and we'll come back with a transparent per-image rate within 45 minutes." },
  { q: "Is my image data secure?", a: "Signed NDA on request, encrypted file transfer, and project files deleted on close. We work with brands that have strict data policies." },
  { q: "What file formats do you accept?", a: "PSD, TIFF, JPEG, PNG, RAW. We can deliver layered PSDs, transparent PNGs or flat JPEGs to your spec." },
  { q: "Do you offer revisions?", a: "Yes, free revisions until you sign off. Quality control is on us, not you." },
  { q: "Can you handle high-volume catalogs?", a: "We routinely run 5,000–50,000+ image batches for ecommerce catalogs and seasonal launches." },
  { q: "How do I send my files?", a: "Secure FTP, WeTransfer, Dropbox, Google Drive — whichever fits your workflow. We'll set up a dedicated FTP account on request." },
  { q: "Do you sign NDAs?", a: "Yes — we sign a standard mutual NDA on request before any sample edit." },
  { q: "Who owns the final files?", a: "You do. Full IP and usage rights transfer on delivery." },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  cover: string;
  body: string;
};

export const BLOG: BlogPost[] = [
  {
    slug: "amazon-main-image-rules-2026",
    title: "Amazon Main Image Rules — The 2026 Checklist",
    excerpt: "Pure white, 85% frame fill, no logos. The full Amazon main-image spec for sellers, with practical examples.",
    date: "2026-05-04",
    author: "Pixi Retouch Editorial",
    category: "Ecommerce",
    cover: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1600&q=80",
    body: "Amazon's main image rules sound simple — until your listing gets suppressed.\n\nIn this guide we walk through the 2026 spec: pure #FFFFFF background, product fills at least 85% of the frame, no props or logos, sRGB color space, and minimum 1000px on the longest edge for zoom.\n\nEach rule comes with a real before/after from our queue so you can see exactly where listings get rejected.",
  },
  {
    slug: "ghost-mannequin-vs-flat-lay",
    title: "Ghost Mannequin vs. Flat Lay — Which Converts Better?",
    excerpt: "We A/B tested 40 SKUs across both styles. Here's what the data said about clicks, dwell time and add-to-cart.",
    date: "2026-04-19",
    author: "Pixi Retouch Editorial",
    category: "Fashion",
    cover: "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=1600&q=80",
    body: "Flat lay is cheaper. Ghost mannequin converts better — usually. We ran a 40-SKU A/B across two DTC apparel brands to settle the debate.\n\nResults: ghost mannequin won 31 of 40 SKUs on add-to-cart rate. The exceptions were minimalist basics (plain tees, socks) where flat lay performed equally well at a third of the cost.",
  },
  {
    slug: "color-correction-pantone-workflow",
    title: "A Pantone-Matched Color Correction Workflow",
    excerpt: "How we calibrate product color to a physical Pantone swatch across shoots, screens and final print.",
    date: "2026-03-22",
    author: "Pixi Retouch Editorial",
    category: "Color",
    cover: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600&q=80",
    body: "Color is the most-returned-for reason in fashion ecommerce. This is the workflow we use to keep brand color true from shoot day to print catalog — including the calibration steps most teams skip.",
  },
  {
    slug: "outsource-image-editing-when",
    title: "When to Outsource Image Editing (and When Not To)",
    excerpt: "A practical break-even framework for studios and brands deciding between in-house and external retouching.",
    date: "2026-02-10",
    author: "Pixi Retouch Editorial",
    category: "Operations",
    cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    body: "Outsourcing image editing isn't a yes/no decision — it's a volume and turnaround math problem. This is the simple break-even framework we share with new clients.",
  },
  {
    slug: "jewelry-retouching-secrets",
    title: "Five Jewelry Retouching Moves That Lift Conversion",
    excerpt: "Stone clarity, prong refinement, reflection control — small moves with measurable impact on the buy button.",
    date: "2026-01-15",
    author: "Pixi Retouch Editorial",
    category: "Jewelry",
    cover: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80",
    body: "Jewelry photography lives or dies on the details. Five specific retouching moves we apply to every jewelry SKU — and the conversion lift our clients see.",
  },
  {
    slug: "ai-vs-human-retouching",
    title: "AI vs. Human Retouching — A Studio's Honest Take",
    excerpt: "Where AI cutout tools are good enough, where they fail, and where human retouchers are still irreplaceable.",
    date: "2025-12-08",
    author: "Pixi Retouch Editorial",
    category: "Industry",
    cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
    body: "We use AI internally — for the right jobs. This is our honest map of where it works, where it fails, and why human retouching isn't going anywhere for premium product work.",
  },
];

export const QUOTE_SERVICES = SERVICES.map((s) => ({ value: s.slug, label: s.title }));
export const TURNAROUNDS = [
  { value: "rush", label: "Rush (under 4 hours)" },
  { value: "standard", label: "Standard (12–24 hours)" },
  { value: "bulk", label: "Bulk (2–5 days)" },
  { value: "flexible", label: "Flexible (best price)" },
];
