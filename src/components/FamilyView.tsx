import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Trophy, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MediaItem, Review } from "@/data/media";
import { FamilyMember } from "@/data/family";
import { cn } from "@/lib/utils";
import { PosterImage } from "@/components/PosterImage";

interface Props {
  mediaItems: MediaItem[];
  reviews: Review[];
  familyMembers: FamilyMember[];
}

export function FamilyView({ mediaItems, reviews, familyMembers }: Props) {
  const activityFeed = useMemo(() => {
    return [...reviews]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 10)
      .map((r) => {
        const member = familyMembers.find((m) => m.id === r.userId)!;
        const media = mediaItems.find((m) => m.id === r.mediaId)!;
        return { review: r, member, media };
      });
  }, [reviews, familyMembers, mediaItems]);

  const topRated = useMemo(() => {
    const mediaRatings: Record<string, { sum: number; count: number }> = {};
    reviews.forEach((r) => {
      if (!mediaRatings[r.mediaId]) mediaRatings[r.mediaId] = { sum: 0, count: 0 };
      mediaRatings[r.mediaId].sum += r.rating;
      mediaRatings[r.mediaId].count += 1;
    });
    return Object.entries(mediaRatings)
      .map(([id, { sum, count }]) => ({
        media: mediaItems.find((m) => m.id === id)!,
        avg: sum / count,
        count,
      }))
      .filter((x) => x.count >= 2)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, [reviews, mediaItems]);

  const memberStats = useMemo(() => {
    return familyMembers.map((m) => {
      const memberReviews = reviews.filter((r) => r.userId === m.id);
      const avg = memberReviews.length > 0 ? memberReviews.reduce((s, r) => s + r.rating, 0) / memberReviews.length : 0;
      return { member: m, count: memberReviews.length, avg };
    }).sort((a, b) => b.count - a.count);
  }, [reviews, familyMembers]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <Users className="w-8 h-8 mb-3" />
        <h2 className="font-serif text-3xl font-bold mb-2">La famille</h2>
        <p className="text-white/80">Activité, classements et souvenirs</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {memberStats.map(({ member, count, avg }, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="text-center bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Avatar className="w-14 h-14 mx-auto mb-2">
                  <AvatarFallback className={cn(member.color, "text-lg font-bold")}>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-sm">{member.name}</h3>
                <p className="text-xs text-stone-500 mb-2">{member.role}</p>
                <div className="flex justify-center gap-3 text-xs">
                  <div>
                    <div className="font-bold">{count}</div>
                    <div className="text-stone-400">critiques</div>
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {avg.toFixed(1)}
                    </div>
                    <div className="text-stone-400">moyenne</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Flux d'activité
            </CardTitle>
            <CardDescription>Dernières critiques de la famille</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {activityFeed.map(({ review, member, media }) => (
              <div key={review.id} className="flex gap-3 pb-4 border-b border-stone-100 dark:border-stone-800 last:border-0 last:pb-0">
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className={cn(member.color, "text-xs")}>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{member.name}</span>
                    <span className="text-xs text-stone-400">a noté</span>
                    <span className="font-medium text-sm truncate">{media.title || "Titre inconnu"}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => {
                      const fill = Math.min(Math.max(review.rating - (s - 1), 0), 1);
                      return (
                        <div key={s} className="relative">
                          <Star className="w-3 h-3 text-stone-300 dark:text-stone-700" />
                          <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          </div>
                        </div>
                      );
                    })}
                    <span className="text-xs text-stone-400 ml-1">{review.date}</span>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 italic">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Top 5 familial
            </CardTitle>
            <CardDescription>Les mieux notés par la famille</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topRated.map(({ media, avg, count }, i) => (
              <div key={media.id} className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                  i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" :
                  i === 1 ? "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200" :
                  i === 2 ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                  "bg-stone-100 text-stone-500 dark:bg-stone-800"
                )}>
                  {i + 1}
                </div>
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <PosterImage item={media} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{media.title || "Titre inconnu"}</h4>
                  <Badge variant="secondary" className="text-xs mt-0.5">
                    {media.type === "film" ? "Film" : media.type === "serie" ? "Série" : "Livre"}
                  </Badge>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-sm">{avg.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-stone-400">{count} avis</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-stone-900 border-violet-200 dark:border-violet-900">
        <CardHeader>
          <CardTitle className="font-serif text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-500" />
            Watchlist partagée
          </CardTitle>
          <CardDescription>Les œuvres que la famille veut voir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mediaItems.filter((m) => !reviews.some((r) => r.mediaId === m.id && r.watched)).slice(0, 5).map((media) => (
              <div key={media.id} className="shrink-0 w-28">
                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2">
                  <PosterImage item={media} />
                </div>
                <h4 className="text-xs font-medium line-clamp-1">{media.title || "Titre inconnu"}</h4>
                <p className="text-xs text-stone-400">{media.year || "—"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}