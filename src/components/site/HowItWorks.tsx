import studioImg from "@/assets/studio-illustration.png";

const STEPS = [
  { n: "01", title: "Request a quote", body: "Tell us volume, service and turnaround. We reply within 45 minutes — flat per-image pricing, no surprises." },
  { n: "02", title: "Approve & upload", body: "Approve the quote and upload via FTP, Dropbox, WeTransfer or Drive. We'll set up a dedicated FTP account if you need one." },
  { n: "03", title: "Delivery & QC", body: "3-step quality control, on-time delivery, and free revisions until you sign off on every image." },
];

export function HowItWorks() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-[color:var(--surface-rose)]" />
        <img
          src={studioImg}
          alt="Pixi Retouch studio at work"
          width={1024}
          height={1024}
          loading="lazy"
          className="mx-auto max-h-[520px] w-full max-w-md object-contain"
        />
      </div>
      <ol className="relative space-y-6">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="relative rounded-2xl border border-border bg-background p-6 pl-20 shadow-soft md:p-8 md:pl-24"
          >
            <span className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground md:left-6 md:top-6 md:h-14 md:w-14 md:text-xl">
              {s.n}
            </span>
            <h3 className="font-display text-xl md:text-2xl">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
