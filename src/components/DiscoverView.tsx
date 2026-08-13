import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Share2, Search, Film, BookOpen, Tv, Heart, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MediaItem, Review } from "@/data/media";
import { FamilyMember } from "@/data/family";
import { cn } from "@/lib/utils";
import { PosterImage } from "@/components/PosterImage";

interface Props {
  mediaItems: MediaItem[];
  reviews: Review[];
  currentUserId: string;
  familyMembers: FamilyMember[];
  onShare: (item: MediaItem, review?: Review) => void;
  onOpenDetail: (item: MediaItem) => void;
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(Math.max(rating - (i - 1), 0), 1);
        return (
          <div key={i} className="relative">
            <Star className={cn(sizes[size], "text-stone-300 dark:text-stone-700")} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn(sizes[size], "fill-amber-400 text-amber-400")} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MediaCard({ item, reviews, familyMembers, onShare, onOpenDetail }: { item: MediaItem; reviews: Review[]; familyMembers: FamilyMember[]; onShare: (item: MediaItem, review?: Review) => void; onOpenDetail: (item: MediaItem) => void }) {
  const itemReviews = reviews.filter((r) => r.mediaId === item.id);
  const avgRating = itemReviews.length > 0 ? itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length : 0;
  const favorites = itemReviews.filter((r) => r.favorite).length;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
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
        {favorites > 0 && (
          <div className="absolute bottom-12 right-3 flex items-center gap-1 bg-rose-500/80 backdrop-blur-sm px-2 py-1 rounded-full">
            <Heart className="w-3 h-3 fill-white text-white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{item.title || "Titre inconnu"}</h3>
          <p className="text-white/70 text-xs mt-1">{item.year || "—"}</p>
        </div>
      </div>

      {itemReviews.length > 0 && (
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex -space-x-2">
            {itemReviews.slice(0, 4).map((r) => {
              const member = familyMembers.find((m) => m.id === r.userId);
              if (!member) return null;
              return (
                <Avatar key={r.id} className="w-6 h-6 border-2 border-stone-50 dark:border-stone-950">
                  <AvatarFallback className={cn(member.color, "text-xs")}>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              );
            })}
            {itemReviews.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-800 border-2 border-stone-50 dark:border-stone-950 flex items-center justify-center text-xs font-bold text-stone-500">
                +{itemReviews.length - 4}
              </div>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onShare(item); }}
          >
            <Share2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}

export function DiscoverView({ mediaItems, reviews, currentUserId, familyMembers, onShare, onOpenDetail }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "film" | "serie" | "livre">("all");

  const filtered = useMemo(() => {
    return mediaItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.genres.some((g) => g.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter = filter === "all" || item.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [mediaItems, search, filter]);

  const filters: { id: "all" | "film" | "serie" | "livre"; label: string }[] = [
    { id: "all", label: "Tout" },
    { id: "film", label: "Films" },
    { id: "serie", label: "Séries" },
    { id: "livre", label: "Livres" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="relative">
          <h2 className="font-serif text-3xl font-bold mb-2">Bonjour famille</h2>
          <p className="text-white/80 max-w-md">Découvrez ce que les autres ont regardé et lu. Notez, critiquez, partagez.</p>
          <div className="flex gap-4 mt-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-2xl font-bold">{mediaItems.length}</div>
              <div className="text-xs text-white/70">Œuvres</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-2xl font-bold">{reviews.length}</div>
              <div className="text-xs text-white/70">Critiques</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <div className="text-2xl font-bold">{familyMembers.length}</div>
              <div className="text-xs text-white/70">Membres</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="Rechercher un film, une série, un livre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                filter === f.id
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-rose-300"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <MediaCard key={item.id} item={item} reviews={reviews} familyMembers={familyMembers} onShare={onShare} onOpenDetail={onOpenDetail} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun résultat pour "{search}"</p>
        </div>
      )}
    </div>
  );
}