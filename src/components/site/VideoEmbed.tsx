import { useState } from "react";
import { Play } from "lucide-react";
import type { VideoItem } from "@/content/site";

export function VideoEmbed({ video }: { video: VideoItem }) {
  const [active, setActive] = useState(false);

  const src =
    video.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${video.videoId}?autoplay=1`;

  const poster =
    video.provider === "youtube"
      ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
      : `https://vumbnail.com/${video.videoId}.jpg`;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-ink">
      {active ? (
        <iframe
          src={src}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      ) : (
        <button
          onClick={() => setActive(true)}
          className="relative h-full w-full"
          aria-label={`Play video: ${video.title}`}
        >
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover opacity-80 transition group-hover:opacity-95"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-foreground shadow-lift transition-transform group-hover:scale-105">
              <Play className="ml-1 h-6 w-6" fill="currentColor" />
            </span>
          </span>
          <span className="absolute bottom-3 left-3 right-3 rounded-md bg-black/55 px-3 py-1.5 text-left text-xs text-white backdrop-blur">
            {video.title}
          </span>
        </button>
      )}
    </div>
  );
}
