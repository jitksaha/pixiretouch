import logoAurora from "@/assets/logo-aurora.png";
import logoNilaya from "@/assets/logo-nilaya.png";
import logoWebb from "@/assets/logo-webb.png";
import logoNorthwind from "@/assets/logo-northwind.png";
import logoLagos from "@/assets/logo-lagos.png";
import logoMaison from "@/assets/logo-maison.png";
import logoPebble from "@/assets/logo-pebble.png";
import logoAtlas from "@/assets/logo-atlas.png";

const LOGOS = [
  { name: "Aurora Apparel", src: logoAurora },
  { name: "Nilaya Jewels", src: logoNilaya },
  { name: "Webb Studio", src: logoWebb },
  { name: "Northwind Goods", src: logoNorthwind },
  { name: "Lagos Lookbook", src: logoLagos },
  { name: "Maison Lume", src: logoMaison },
  { name: "Pebble & Pine", src: logoPebble },
  { name: "Atlas Outfitters", src: logoAtlas },
];

export function LogoBar() {
  return (
    <div className="grid grid-cols-2 items-center gap-x-6 gap-y-4 px-2 sm:grid-cols-4 lg:grid-cols-8">
      {LOGOS.map((logo) => (
        <div key={logo.name} className="flex items-center justify-center px-3 py-1">
          <img
            src={logo.src}
            alt={logo.name}
            loading="lazy"
            className="h-12 w-auto object-contain grayscale opacity-60 transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-14"
          />
        </div>
      ))}
    </div>
  );
}
