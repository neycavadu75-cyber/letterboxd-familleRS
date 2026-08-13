import { useMemo } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MediaItem, Review } from "@/data/media";
import { FamilyMember } from "@/data/family";
import { cn } from "@/lib/utils";

interface Props {
  mediaItems: MediaItem[];
  reviews: Review[];
  currentUserId: string;
  familyMembers: FamilyMember[];
}

const COLORS = ["#f43f5e", "#8b5cf6", "#10b981", "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6"];

export function StatsView({ mediaItems, reviews, currentUserId, familyMembers }: Props) {
  const userReviews = reviews.filter((r) => r.userId === currentUserId);
  const currentUser = familyMembers.find((m) => m.id === currentUserId)!;

  const monthlyActivity = useMemo(() => {
    const months: Record<string, number> = {};
    userReviews.forEach((r) => {
      const month = r.date.substring(0, 7);
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months)
      .map(([month, count]) => ({ month: month.substring(5) + "/" + month.substring(2, 4), count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [userReviews]);

  const genreDistribution = useMemo(() => {
    const genres: Record<string, number> = {};
    userReviews.forEach((r) => {
      const media = mediaItems.find((m) => m.id === r.mediaId);
      if (media) {
        media.genres.forEach((g) => {
          genres[g] = (genres[g] || 0) + 1;
        });
      }
    });
    return Object.entries(genres)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [userReviews, mediaItems]);

  const ratingEvolution = useMemo(() => {
    return [...userReviews]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r, i) => ({ review: i + 1, rating: r.rating }));
  }, [userReviews]);

  const avgRating = userReviews.length > 0 ? userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length : 0;
  const familyAvg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const favoritesCount = userReviews.filter(r => r.favorite).length;

  const radarData = useMemo(() => {
    const memberGenres: Record<string, Record<string, number>> = {};
    familyMembers.forEach((m) => {
      memberGenres[m.id] = {};
      reviews.filter((r) => r.userId === m.id).forEach((r) => {
        const media = mediaItems.find((m2) => m2.id === r.mediaId);
        if (media) {
          media.genres.forEach((g) => {
            memberGenres[m.id][g] = (memberGenres[m.id][g] || 0) + r.rating;
          });
        }
      });
    });
    const allGenres = Array.from(new Set(mediaItems.flatMap((m) => m.genres))).slice(0, 6);
    return allGenres.map((genre) => ({
      genre,
      user: memberGenres[currentUserId]?.[genre] || 0,
      family: Object.values(memberGenres).reduce((sum, g) => sum + (g[genre] || 0), 0) / familyMembers.length,
    }));
  }, [reviews, mediaItems, familyMembers, currentUserId]);

  const mostActiveMember = useMemo(() => {
    const counts: Record<string, number> = {};
    reviews.forEach((r) => {
      counts[r.userId] = (counts[r.userId] || 0) + 1;
    });
    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return familyMembers.find((m) => m.id === topId);
  }, [reviews, familyMembers]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-700 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <h2 className="font-serif text-3xl font-bold mb-2">Profil de {currentUser.name}</h2>
        <p className="text-white/80">Vos statistiques et celles de la famille</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardContent className="p-5">
            <div className="text-3xl font-bold text-rose-500">{userReviews.length}</div>
            <div className="text-xs text-stone-500 mt-1">Critiques écrites</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardContent className="p-5">
            <div className="text-3xl font-bold text-amber-500">{avgRating.toFixed(1)}</div>
            <div className="text-xs text-stone-500 mt-1">Note moyenne</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardContent className="p-5">
            <div className="text-3xl font-bold text-rose-500">{favoritesCount}</div>
            <div className="text-xs text-stone-500 mt-1">Coups de cœur</div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardContent className="p-5">
            <div className="text-3xl font-bold text-violet-500">{familyAvg.toFixed(1)}</div>
            <div className="text-xs text-stone-500 mt-1">Moyenne familiale</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Activité mensuelle</CardTitle>
            <CardDescription>Nombre de critiques par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyActivity}>
                <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 12, color: "#fff" }} />
                <Bar dataKey="count" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Répartition des genres</CardTitle>
            <CardDescription>Vos préférences</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genreDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {genreDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 12, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {genreDistribution.map((g, i) => (
                <div key={g.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-stone-500">{g.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Évolution de la sévérité</CardTitle>
            <CardDescription>Vos notes au fil du temps</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ratingEvolution}>
                <XAxis dataKey="review" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 12, color: "#fff" }} />
                <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Vous vs Famille</CardTitle>
            <CardDescription>Comparaison par genre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#444" />
                <PolarAngleAxis dataKey="genre" tick={{ fill: "#888", fontSize: 11 }} />
                <Radar name="Vous" dataKey="user" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                <Radar name="Famille" dataKey="family" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Tooltip contentStyle={{ background: "#1c1917", border: "none", borderRadius: 12, color: "#fff" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-stone-50 to-white dark:from-stone-900 dark:to-stone-950 border-stone-200 dark:border-stone-800">
        <CardHeader>
          <CardTitle className="font-serif text-lg">Statistiques familiales</CardTitle>
          <CardDescription>La famille dans son ensemble</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20">
              <div className="text-2xl font-bold text-rose-500 mb-1">
                {genreDistribution[0]?.name || "—"}
              </div>
              <div className="text-xs text-stone-500">Genre préféré collectif</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20">
              <div className="text-2xl font-bold text-amber-500 mb-1">{familyAvg.toFixed(1)}/5</div>
              <div className="text-xs text-stone-500">Note moyenne familiale</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20">
              {mostActiveMember && (
                <>
                  <Avatar className="w-10 h-10 mx-auto mb-1">
                    <AvatarFallback className={cn(mostActiveMember.color, "text-sm")}>
                      {mostActiveMember.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-bold text-emerald-500">{mostActiveMember.name}</div>
                  <div className="text-xs text-stone-500">Le plus actif</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}