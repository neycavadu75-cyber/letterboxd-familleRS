import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Inbox, Send, Star, Film, BookOpen, Tv, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MediaItem, Review, Recommendation } from "@/data/media";
import { FamilyMember } from "@/data/family";
import { cn } from "@/lib/utils";
import { PosterImage } from "@/components/PosterImage";

interface Props {
  mediaItems: MediaItem[];
  reviews: Review[];
  recommendations: Recommendation[];
  currentUserId: string;
  familyMembers: FamilyMember[];
  onMarkAsRead: (recId: string) => void;
  onOpenDetail: (item: MediaItem) => void;
}

export function RecommendationsView({ mediaItems, reviews, recommendations, currentUserId, familyMembers, onMarkAsRead, onOpenDetail }: Props) {
  const incomingRecs = useMemo(() => {
    return recommendations
      .filter((r) => r.toUserId === currentUserId)
      .map((r) => {
        const fromMember = familyMembers.find((m) => m.id === r.fromUserId)!;
        const media = mediaItems.find((m) => m.id === r.mediaId)!;
        return { ...r, fromMember, media };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [recommendations, currentUserId, familyMembers, mediaItems]);

  const autoDiscoveries = useMemo(() => {
    const userReviews = reviews.filter((r) => r.userId === currentUserId && r.rating >= 4);
    const seenIds = userReviews.map((r) => r.mediaId);
    return mediaItems.filter((m) => !seenIds.includes(m.id)).slice(0, 6);
  }, [mediaItems, reviews, currentUserId]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <Sparkles className="w-8 h-8 mb-3" />
        <h2 className="font-serif text-3xl font-bold mb-2">Recommandations</h2>
        <p className="text-white/80 max-w-md">Les découvertes de votre famille et suggestions automatiques.</p>
      </div>

      <div>
        <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
          <Inbox className="w-5 h-5 text-rose-500" />
          Recommandé pour toi par la famille
          {incomingRecs.some((r) => !r.read) && (
            <Badge className="bg-rose-500 text-white">Nouveau</Badge>
          )}
        </h3>
        <div className="space-y-3">
          {incomingRecs.length === 0 && (
            <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
              <CardContent className="p-6 text-center text-stone-500">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucune recommandation pour le moment.</p>
              </CardContent>
            </Card>
          )}
          {incomingRecs.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:shadow-md transition-shadow cursor-pointer",
                !rec.read && "border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20"
              )}>
                <CardContent className="p-4 flex gap-4">
                  <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 shadow-md" onClick={() => onOpenDetail(rec.media)}>
                    <PosterImage item={rec.media} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className={cn(rec.fromMember.color, "text-xs")}>
                          {rec.fromMember.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{rec.fromMember.name}</span>
                      <span className="text-xs text-stone-400">vous a recommandé</span>
                      {!rec.read && <Badge className="bg-rose-500 text-white text-xs">Nouveau</Badge>}
                    </div>
                    <h4 className="font-bold text-sm truncate" onClick={() => onOpenDetail(rec.media)}>{rec.media.title || "Titre inconnu"}</h4>
                    <p className="text-xs text-stone-500 mt-1 italic line-clamp-2">"{rec.message}"</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => onOpenDetail(rec.media)}
                      >
                        Voir la fiche
                      </Button>
                      {!rec.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => onMarkAsRead(rec.id)}
                        >
                          <Check className="w-3 h-3 mr-1" /> Marquer comme lu
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          Découvertes automatiques
        </h3>
        <p className="text-sm text-stone-500 mb-4">Basé sur vos notes de 4 étoiles et plus.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {autoDiscoveries.map((media, i) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="cursor-pointer"
              onClick={() => onOpenDetail(media)}
            >
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md bg-gradient-to-br">
                <PosterImage item={media} />
              </div>
              <h4 className="text-xs font-medium mt-2 line-clamp-1">{media.title || "Titre inconnu"}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}