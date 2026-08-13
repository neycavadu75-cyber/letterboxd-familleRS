import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bookmark, Trash2, Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaItem, Review } from "@/data/media";
import { FamilyMember } from "@/data/family";
import { cn } from "@/lib/utils";
import { PosterImage } from "@/components/PosterImage";

interface Props {
  mediaItems: MediaItem[];
  reviews: Review[];
  watchlist: string[];
  currentUserId: string;
  familyMembers: FamilyMember[];
  onRemove: (mediaId: string) => void;
  onShare: (item: MediaItem) => void;
  onOpenDetail: (item: MediaItem) => void;
}

export function WatchlistView({ mediaItems, reviews, watchlist, currentUserId, familyMembers, onRemove, onShare, onOpenDetail }: Props) {
  const items = useMemo(() => {
    return watchlist.map(id => mediaItems.find(m => m.id === id)).filter(Boolean) as MediaItem[];
  }, [watchlist, mediaItems]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <Bookmark className="w-8 h-8 mb-3" />
        <h2 className="font-serif text-3xl font-bold mb-2">Ma Watchlist</h2>
        <p className="text-white/80">Les œuvres que vous voulez voir ou lire.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Votre watchlist est vide.</p>
          <p className="text-sm mt-2">Ajoutez des œuvres depuis la recherche ou les fiches détaillées.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item, i) => {
            const itemReviews = reviews.filter((r) => r.mediaId === item.id);
            const avgRating = itemReviews.length > 0 ? itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length : 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer"
                onClick={() => onOpenDetail(item)}
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br">
                  <PosterImage item={item} />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/40 text-white border-0 backdrop-blur-sm">
                      {item.type === "film" ? "Film" : item.type === "serie" ? "Série" : "Livre"}
                    </Badge>
                  </div>
                  {itemReviews.length > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-white">{avgRating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{item.title || "Titre inconnu"}</h3>
                    <p className="text-white/70 text-xs mt-1">{item.year || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-stone-500 hover:text-rose-500"
                    onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Retirer
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onShare(item); }}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}