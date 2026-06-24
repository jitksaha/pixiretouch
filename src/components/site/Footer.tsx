import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BRAND, SERVICES } from "@/content/site";
import { Logo } from "./Logo";
import dynimeLogoAsset from "@/assets/dynime-logo.svg.asset.json";

export function Footer() {
  return (
    <footer className="ink-section px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] shadow-2xl">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4 border-b border-white/5 p-8 md:border-b-0 md:border-r md:p-10">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <Link to="/" aria-label={BRAND.name} className="inline-flex">
                  <Logo variant="dark" size="lg" />
                </Link>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-foreground/60">
                  {BRAND.description}
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-foreground/50">
                  Part of the{" "}
                  <a
                    href={BRAND.parentBrand.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-foreground/80 hover:text-ink-foreground"
                  >
                    {BRAND.parentBrand.name}
                  </a>{" "}
                  family
                </span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-8 grid grid-cols-2 gap-px bg-white/5 lg:grid-cols-3">
            {/* Services */}
            <div className="bg-ink p-8 md:p-10">
              <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Services
              </h4>
              <ul className="space-y-3">
                {SERVICES.slice(0, 7).map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="text-sm text-ink-foreground/60 transition-colors hover:text-ink-foreground"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    to="/services"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-ink-foreground"
                  >
                    All services
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div className="bg-ink p-8 md:p-10">
              <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Explore
              </h4>
              <ul className="space-y-3">
                <SimpleLink to="/">Home</SimpleLink>
                <SimpleLink to="/sample">Sample</SimpleLink>
                <SimpleLink to="/pricing">Pricing</SimpleLink>
                <SimpleLink to="/blog">Blog</SimpleLink>
                <SimpleLink to="/contact">Contact Us</SimpleLink>
              </ul>
            </div>

            {/* Get in touch */}
            <div className="col-span-2 border-t border-white/5 bg-ink p-8 md:p-10 lg:col-span-1 lg:border-t-0">
              <h4 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Get in touch
              </h4>
              <div className="space-y-6">
                <Link
                  to="/contact"
                  className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Free Quote
                </Link>
                <div className="space-y-4">
                  <div>
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-foreground/40">
                      Email
                    </span>
                    <a
                      href={`mailto:${BRAND.email}`}
                      className="text-sm text-ink-foreground transition-colors hover:text-primary"
                    >
                      {BRAND.email}
                    </a>
                  </div>
                  <div>
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-foreground/40">
                      WhatsApp
                    </span>
                    <a
                      href={BRAND.whatsappLink}
                      className="text-sm text-ink-foreground transition-colors hover:text-primary"
                    >
                      {BRAND.whatsapp}
                    </a>
                  </div>
                  <div>
                    <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-foreground/40">
                      Phone
                    </span>
                    <a
                      href={BRAND.phoneLink}
                      className="text-sm text-ink-foreground transition-colors hover:text-primary"
                    >
                      {BRAND.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 bg-black/30 px-8 py-5 md:flex-row md:px-10">
          <div className="text-xs text-ink-foreground/50">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </div>
          <a
            href="https://dynime.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-xs text-ink-foreground/50 transition-colors hover:text-ink-foreground"
          >
            Crafted by
            <img
              src={dynimeLogoAsset.url}
              alt="dynime"
              className="h-4 w-auto opacity-70 transition-opacity group-hover:opacity-100"
              loading="lazy"
            />
          </a>
        </div>

        {/* Giant brand wordmark */}
        <div
          className="relative overflow-hidden px-4 md:px-8"
          style={{ height: "clamp(2.5rem, 7vw, 7rem)" }}
        >
          <h2
            aria-hidden="true"
            className="select-none whitespace-nowrap text-center font-bold italic leading-[0.9] tracking-tight text-ink-foreground/[0.08]"
            style={{
              fontFamily: "'Italiana', serif",
              fontSize: "clamp(3.5rem, 14vw, 13rem)",
              letterSpacing: "0.01em",
            }}
          >
            {BRAND.name}
          </h2>
        </div>
      </div>
    </footer>
  );
}

function SimpleLink({
  to,
  children,
}: {
  to: "/" | "/sample" | "/pricing" | "/blog" | "/contact" | "/services";
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-ink-foreground/60 transition-colors hover:text-ink-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
