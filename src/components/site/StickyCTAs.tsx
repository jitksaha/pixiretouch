import { Link } from "@tanstack/react-router";
import { MessageCircle, ArrowRight } from "lucide-react";
import { BRAND } from "@/content/site";

export function StickyCTAs() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-end gap-3 p-4 md:p-6">
      <a
        href={BRAND.whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <Link
        to="/quote"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-lift transition-transform hover:scale-[1.02] md:hidden"
      >
        Get Free Quote
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
