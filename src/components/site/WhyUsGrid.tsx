import { Server, ShieldCheck, Headphones, Wallet, type LucideIcon } from "lucide-react";

const ITEMS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Server, title: "Fastest FTP server", body: "Dedicated FTP for bulk file transfer — no size limits, no headaches." },
  { icon: ShieldCheck, title: "3-step quality control", body: "Editor, lead and account QC every image before delivery." },
  { icon: Headphones, title: "24/7 support", body: "Always-on production across time zones. Your overnight is our working day." },
  { icon: Wallet, title: "Pay after delivery", body: "New clients pay only after the first batch is delivered and approved." },
];

export function WhyUsGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="group rounded-2xl border border-border bg-background p-7 transition hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--surface-rose)] text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="mt-5 font-display text-xl">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}
