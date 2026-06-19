import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { BRAND, SERVICES } from "@/content/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", hasSubmenu: false },
  { to: "/services", label: "Services", hasSubmenu: true },
  { to: "/sample", label: "Sample", hasSubmenu: false },
  { to: "/contact", label: "Contact Us", hasSubmenu: false },
  { to: "/pricing", label: "Pricing", hasSubmenu: false },
  { to: "/blog", label: "Blog", hasSubmenu: false },
] as const;

// Curated submenu — only these services appear in the Services dropdown.
const NAV_SERVICE_SLUGS: { slug: string; label: string }[] = [
  { slug: "clipping-path", label: "Photoshop Clipping Path" },
  { slug: "product-photo-retouching", label: "Photo Retouching" },
  { slug: "shadow-creation", label: "Shadow Creation" },
  { slug: "background-removal", label: "Background Removing" },
  { slug: "neck-joint", label: "Neck Joint" },
  { slug: "ecommerce-image-editing", label: "Ecommerce Image Editing" },
];
const NAV_SERVICES = NAV_SERVICE_SLUGS
  .map((n) => {
    const s = SERVICES.find((x) => x.slug === n.slug);
    return s ? { slug: s.slug, title: n.label } : null;
  })
  .filter((x): x is { slug: string; title: string } => Boolean(x));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all",
        scrolled
          ? "border-b border-border bg-background shadow-soft"
          : "bg-background"
      )}
    >
      <Container className="flex h-14 items-center justify-between md:h-16">
        <Link to="/" aria-label={BRAND.name} className="shrink-0">
          <Logo variant="light" size={scrolled ? "sm" : "md"} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((n) =>
            n.hasSubmenu ? (
              <div
                key={n.to}
                className="group relative"
              >
                <Link
                  to={n.to}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {n.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </Link>

                <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible">
                  <div className="w-[420px] rounded-xl border border-border bg-background p-2 shadow-lift">
                    <div className="grid grid-cols-2 gap-1">
                      {NAV_SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to="/services/$slug"
                          params={{ slug: s.slug }}
                          className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-1 border-t border-border pt-1">
                      <Link
                        to="/services"
                        className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        View all services →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild size="sm">
            <Link to="/contact">Get a Quote</Link>
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((n) =>
              n.hasSubmenu ? (
                <div key={n.to}>
                  <button
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base text-foreground hover:bg-muted"
                  >
                    {n.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        mobileServicesOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {mobileServicesOpen && (
                    <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                      {NAV_SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to="/services/$slug"
                          params={{ slug: s.slug }}
                          onClick={() => setOpen(false)}
                          className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {s.title}
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        View all services
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-base text-foreground hover:bg-muted"
                >
                  {n.label}
                </Link>
              )
            )}
            <div className="mt-3 pt-3 hairline">
              <Button asChild className="w-full">
                <Link to="/contact" onClick={() => setOpen(false)}>Get a Quote</Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
