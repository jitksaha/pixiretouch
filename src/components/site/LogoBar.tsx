import { CLIENTS } from "@/content/site";

export function LogoBar() {
  return (
    <div className="grid grid-cols-2 items-center gap-x-10 gap-y-6 opacity-70 sm:grid-cols-4 lg:grid-cols-8">
      {CLIENTS.map((name) => (
        <div key={name} className="text-center font-display text-base tracking-tight text-muted-foreground">
          {name}
        </div>
      ))}
    </div>
  );
}
