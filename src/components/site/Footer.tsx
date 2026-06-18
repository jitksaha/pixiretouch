import { Link } from "@tanstack/react-router";
import { Container } from "./Container";
import { BRAND, SERVICES } from "@/content/site";
import dynimeLogoAsset from "@/assets/dynime-logo.svg.asset.json";

export function Footer() {
  return (
    <footer className="ink-section">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-ink-foreground text-ink">
                <span className="font-display text-base leading-none">P</span>
              </span>
              <span className="font-display text-xl">{BRAND.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-ink-foreground/70">
              {BRAND.description}
            </p>
            <p className="mt-6 text-sm text-ink-foreground/60">
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
              <FooterLink key={s.slug} to="/services/$slug" params={{ slug: s.slug }}>
                {s.title}
              </FooterLink>
            ))}
            <FooterLink to="/services">All services</FooterLink>
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink to="/about">About us</FooterLink>
            <FooterLink to="/portfolio">Portfolio</FooterLink>
            <FooterLink to="/before-after">Before / After</FooterLink>
            <FooterLink to="/pricing">Pricing</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
          </FooterCol>

          <FooterCol title="Get in touch">
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/quote">Free Quote</FooterLink>
            <FooterLink to="/quote">Free Trial</FooterLink>
            <li>
              <a className="text-sm text-ink-foreground/70 hover:text-ink-foreground" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
            </li>
            <li>
              <a className="text-sm text-ink-foreground/70 hover:text-ink-foreground" href={BRAND.whatsappLink}>WhatsApp: {BRAND.whatsapp}</a>
            </li>
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-ink-foreground/60 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/privacy" className="hover:text-ink-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink-foreground">Terms & Conditions</Link>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FooterLink({ to, params, children }: { to: any; params?: any; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        params={params}
        className="text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
