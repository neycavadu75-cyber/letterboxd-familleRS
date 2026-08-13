import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Share2, X, Heart, Send, Bookmark, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MediaItem, Review, Recommendation } from "@/data/media";
import { FamilyMember } from "@/data/family";
import { cn } from "@/lib/utils";

interface Props {
  item: MediaItem | null;
  reviews: Review[];
  familyMembers: FamilyMember[];
  currentUserId: string;
  onClose: () => void;
  onShare: (item: MediaItem, review?: Review) => void;
  onAddToWatchlist: (mediaId: string) => void;
  onRemoveFromWatchlist: (mediaId: string) => void;
  isInWatchlist: boolean;
  onRecommend: (mediaId: string, toUserId: string, message: string) => void;
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

export function MediaDetailModal({ item, reviews, familyMembers, currentUserId, onClose, onShare, onAddToWatchlist, onRemoveFromWatchlist, isInWatchlist, onRecommend }: Props) {
  const [showRecForm, setShowRecForm] = useState(false);
  const [recTarget, setRecTarget] = useState<string>("");
  const [recMessage, setRecMessage] = useState("");
  const [imgError, setImgError] = useState(false);

  const itemReviews = useMemo(() => {
    if (!item) return [];
    return reviews.filter((r) => r.mediaId === item.id);
  }, [reviews, item]);

  const avgRating = useMemo(() => {
    if (itemReviews.length === 0) return 0;
    return itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length;
  }, [itemReviews]);

  const handleSendRec = () => {
    if (!item || !recTarget || !recMessage.trim()) return;
    onRecommend(item.id, recTarget, recMessage);
    setRecTarget("");
    setRecMessage("");
    setShowRecForm(false);
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-stone-50 dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="relative h-48 shrink-0">
              {item.posterUrl && !imgError ? (
                <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover blur-sm scale-105" onError={() => setImgError(true)} />
              ) : (
                <div className={cn("w-full h-full bg-gradient-to-br", item.posterColor)} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-50 dark:from-stone-900 via-stone-50/50 dark:via-stone-900/50 to-transparent" />
              <Button size="icon" variant="ghost" className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 -mt-20 relative">
              <div className="flex gap-4">
                <div className="w-28 shrink-0">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-xl border-4 border-stone-50 dark:border-stone-900">
                    {item.posterUrl && !imgError ? (
                      <img src={item.posterUrl} alt={item.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                    ) : (
                      <div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center p-2 text-center", item.posterColor)}>
                        <span className="text-white font-bold text-sm">{item.title}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 pt-16">
                  <Badge variant="secondary" className="mb-2">
                    {item.type === "film" ? "Film" : item.type === "serie" ? "Série" : "Livre"}
                  </Badge>
                  <h2 className="font-serif text-2xl font-bold">{item.title}</h2>
                  <p className="text-sm text-stone-500 mb-2">
                    {item.year} {item.director && `• ${item.director}`} {item.author && `• ${item.author}`}
                  </p>
                  {itemReviews.length > 0 && (
                    <div className="flex items-center gap-2">
                      <StarRating rating={avgRating} size="md" />
                      <span className="text-sm font-bold">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-stone-400">({itemReviews.length} avis)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-serif text-lg font-bold mb-2">Synopsis</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">{item.synopsis}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant={isInWatchlist ? "secondary" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => isInWatchlist ? onRemoveFromWatchlist(item.id) : onAddToWatchlist(item.id)}
                >
                  {isInWatchlist ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {isInWatchlist ? "Dans ma watchlist" : "Ajouter à ma watchlist"}
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => onShare(item)}
                >
                  <Share2 className="w-4 h-4" /> Partager sur WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setShowRecForm(!showRecForm)}
                >
                  <Send className="w-4 h-4" /> Recommander à...
                </Button>
              </div>

              {showRecForm && (
                <div className="mt-4 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
                  <h4 className="font-medium text-sm mb-3">Recommander à un membre de la famille</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {familyMembers.filter(m => m.id !== currentUserId).map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setRecTarget(member.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all",
                          recTarget === member.id ? "bg-rose-500 text-white border-rose-500" : "border-stone-200 dark:border-stone-700"
                        )}
                      >
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className={cn(member.color, "text-xs")}>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {member.name}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Écrivez un petit mot..."
                    value={recMessage}
                    onChange={(e) => setRecMessage(e.target.value)}
                    className="min-h-16 resize-none mb-2"
                  />
                  <Button size="sm" className="bg-rose-500 hover:bg-rose-600 text-white" onClick={handleSendRec} disabled={!recTarget || !recMessage.trim()}>
                    <Send className="w-3.5 h-3.5 mr-1" /> Envoyer
                  </Button>
                </div>
              )}

              <div className="mt-8">
                <h3 className="font-serif text-lg font-bold mb-4">Avis de la famille</h3>
                <div className="space-y-4">
                  {itemReviews.length === 0 && (
                    <p className="text-sm text-stone-500">Aucun avis pour le moment. Soyez le premier à noter !</p>
                  )}
                  {itemReviews.map((review) => {
                    const member = familyMembers.find((m) => m.id === review.userId)!;
                    return (
                      <div key={review.id} className="flex gap-3 pb-4 border-b border-stone-100 dark:border-stone-800 last:border-0 last:pb-0">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className={cn(member.color, "text-xs")}>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{member.name}</span>
                            <span className="text-xs text-stone-400">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <StarRating rating={review.rating} size="sm" />
                            {review.favorite && (
                              <Badge className="bg-rose-500 text-white text-xs gap-1">
                                <Heart className="w-2.5 h-2.5 fill-white" /> Coup de cœur
                              </Badge>
                            )}
                          </div>
                          {review.comment && (
                            <p className="text-sm text-stone-600 dark:text-stone-400 italic">"{review.comment}"</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}