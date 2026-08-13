import { useState, useEffect } from "react";
import { Film, BookOpen, Tv } from "lucide-react";
import { MediaItem } from "@/data/media";
import { cn } from "@/lib/utils";

interface PosterImageProps {
  item: Partial<MediaItem>;
  className?: string;
}

export function PosterImage({ item, className }: PosterImageProps) {
  const [imgError, setImgError] = useState(false);
  const safeTitle = item.title || "Titre inconnu";
  const safeType = item.type || "film";
  const safeColor = item.posterColor || "from-stone-700 to-stone-900";
  const safeUrl = item.posterUrl || "";

  useEffect(() => {
    setImgError(false);
  }, [safeUrl]);

  if (!safeUrl || imgError) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-white/90 p-2 text-center bg-gradient-to-br w-full h-full",
          safeColor,
          className
        )}
      >
        <div className="mb-2 opacity-50">
          {safeType === "film" && <Film className="w-8 h-8" />}
          {safeType === "serie" && <Tv className="w-8 h-8" />}
          {safeType === "livre" && <BookOpen className="w-8 h-8" />}
        </div>
        <span className="font-bold text-sm line-clamp-4">{safeTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={safeUrl}
      alt={safeTitle}
      loading="lazy"
      onError={() => setImgError(true)}
      className={cn("object-cover w-full h-full", className)}
    />
  );
}