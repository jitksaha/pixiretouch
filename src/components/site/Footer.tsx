import { Link } from "@tanstack/react-router";
import { Container } from "./Container";
import { BRAND, SERVICES } from "@/content/site";
import { Logo } from "./Logo";
import dynimeLogoAsset from "@/assets/dynime-logo.svg.asset.json";

export function Footer() {
  return (
    <footer className="ink-section">
      <Container className="pt-10 pb-6 md:pt-12 md:pb-6">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label={BRAND.name} className="inline-flex">
              <Logo variant="dark" size="lg" />
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink-foreground/70">
              {BRAND.description}
            </p>
            <p className="mt-3 text-sm text-ink-foreground/60">
              Part of the{" "}
              <a
                href={BRAND.parentBrand.url}
                target="_blank"
                rel="noreferrer"
                className="text-ink-foreground underline-offset-4 hover:underline"
              >
                {BRAND.parentBrand.name}
              </a>{" "}
              family of creative brands.
            </p>
          </div>

          <FooterCol title="Services">
            {SERVICES.slice(0, 7).map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                >
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground">
                All services
              </Link>
            </li>
          </FooterCol>

          <FooterCol title="Explore">
            <SimpleLink to="/">Home</SimpleLink>
            <SimpleLink to="/sample">Sample</SimpleLink>
            <SimpleLink to="/pricing">Pricing</SimpleLink>
            <SimpleLink to="/blog">Blog</SimpleLink>
            <SimpleLink to="/contact">Contact Us</SimpleLink>
          </FooterCol>

          <FooterCol title="Get in touch">
            <SimpleLink to="/contact">Free Quote</SimpleLink>
            <li>
              <a className="text-sm text-ink-foreground/70 hover:text-ink-foreground" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </li>
            <li>
              <a className="text-sm text-ink-foreground/70 hover:text-ink-foreground" href={BRAND.whatsappLink}>WhatsApp: {BRAND.whatsapp}</a>
            </li>
          </FooterCol>
        </div>

        <div className="mt-8 border-t border-white/15" />

        <div className="mt-4 flex flex-col gap-3 pt-2 text-xs text-ink-foreground/60 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://dynime.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-ink-foreground"
            >
              Crafted by
              <img
                src={dynimeLogoAsset.url}
                alt="dynime"
                className="h-5 w-auto opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-sm uppercase tracking-[0.16em] text-ink-foreground/60">{title}</h3>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function SimpleLink({ to, children }: { to: "/" | "/sample" | "/pricing" | "/blog" | "/contact" | "/services"; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground">
        {children}
      </Link>
    </li>
  );
}
