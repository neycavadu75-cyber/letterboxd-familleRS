import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Film, Sparkles, BarChart3, Bookmark, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { familyMembers, currentUserId } from "@/data/family";
import { mediaItems as initialMediaItems, reviews as initialReviews, recommendations as initialRecommendations, MediaItem, Review, Recommendation } from "@/data/media";
import { cn } from "@/lib/utils";
import { DiscoverView } from "@/components/DiscoverView";
import { RecommendationsView } from "@/components/RecommendationsView";
import { WatchlistView } from "@/components/WatchlistView";
import { StatsView } from "@/components/StatsView";
import { AddMediaModal } from "@/components/AddMediaModal";
import { MediaDetailModal } from "@/components/MediaDetailModal";

type Tab = "discover" | "recommendations" | "watchlist" | "stats";

const tabs: { id: Tab; label: string; icon: typeof Film }[] = [
  { id: "discover", label: "Fil d'actu", icon: Film },
  { id: "recommendations", label: "Recommandations", icon: Sparkles },
  { id: "watchlist", label: "Watchlist", icon: Bookmark },
  { id: "stats", label: "Profil & Stats", icon: BarChart3 },
];

const STORAGE_KEY = "cinefamille_data_v2";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [selectedMemberId, setSelectedMemberId] = useState(currentUserId);
  const [darkMode, setDarkMode] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.mediaItems) setMediaItems(data.mediaItems);
        if (data.reviews) setReviews(data.reviews);
        if (data.recommendations) setRecommendations(data.recommendations);
        if (data.watchlist) setWatchlist(data.watchlist);
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mediaItems, reviews, recommendations, watchlist }));
  }, [mediaItems, reviews, recommendations, watchlist]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const unreadRecsCount = useMemo(() => {
    return recommendations.filter(r => r.toUserId === selectedMemberId && !r.read).length;
  }, [recommendations, selectedMemberId]);

  const handleAddMedia = (item: MediaItem, reviewData: Omit<Review, "id" | "userId" | "date">, recs: Omit<Recommendation, "id" | "fromUserId" | "date" | "read">[]) => {
    const exists = mediaItems.find((m) => m.id === item.id);
    if (!exists) {
      setMediaItems((prev) => [item, ...prev]);
    }
    
    const newReview: Review = {
      ...reviewData,
      id: `r-${Date.now()}`,
      userId: selectedMemberId,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [newReview, ...prev]);

    if (recs.length > 0) {
      const newRecs: Recommendation[] = recs.map((r, i) => ({
        ...r,
        id: `rec-${Date.now()}-${i}`,
        fromUserId: selectedMemberId,
        date: new Date().toISOString().split("T")[0],
        read: false,
      }));
      setRecommendations((prev) => [...newRecs, ...prev]);
    }
    
    setAddModalOpen(false);
  };

  const handleShare = (item: MediaItem, review?: Review) => {
    const rating = review ? `${"⭐️".repeat(Math.floor(review.rating))}${review.rating % 1 ? "½" : ""} - ` : "";
    const comment = review && review.comment ? ` - "${review.comment.substring(0, 100)}${review.comment.length > 100 ? '...' : ''}"` : "";
    const text = `${rating}${item.title}${comment} - Découvrez-le sur CinéFamille !`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleAddToWatchlist = (mediaId: string) => {
    setWatchlist((prev) => [...new Set([...prev, mediaId])]);
  };

  const handleRemoveFromWatchlist = (mediaId: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== mediaId));
  };

  const handleRecommend = (mediaId: string, toUserId: string, message: string) => {
    const newRec: Recommendation = {
      id: `rec-${Date.now()}`,
      fromUserId: selectedMemberId,
      toUserId,
      mediaId,
      message,
      date: new Date().toISOString().split("T")[0],
      read: false,
    };
    setRecommendations((prev) => [newRec, ...prev]);
  };

  const handleMarkRecAsRead = (recId: string) => {
    setRecommendations((prev) => prev.map(r => r.id === recId ? { ...r, read: true } : r));
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-stone-50/80 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold leading-none">CinéFamille</h1>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Le Letterboxd de la famille</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setAddModalOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full h-10 px-4"
              >
                <Plus className="w-4 h-4 mr-1" /> Ajouter
              </Button>

              <div className="hidden md:flex items-center gap-2">
                {familyMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedMemberId(member.id)}
                    className={cn(
                      "relative transition-all",
                      selectedMemberId === member.id ? "scale-110" : "opacity-60 hover:opacity-100"
                    )}
                    title={`Voir en tant que ${member.name}`}
                  >
                    <Avatar className="w-9 h-9 border-2 border-transparent data-[selected=true]:border-rose-500">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className={member.color}>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {selectedMemberId === member.id && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-stone-50 dark:border-stone-950" />
                    )}
                  </button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
            {familyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMemberId(member.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border whitespace-nowrap transition-all",
                  selectedMemberId === member.id
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                    : "border-stone-200 dark:border-stone-800 opacity-60"
                )}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className={member.color + " text-xs"}>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{member.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "discover" && (
              <DiscoverView
                mediaItems={mediaItems}
                reviews={reviews}
                currentUserId={selectedMemberId}
                familyMembers={familyMembers}
                onShare={handleShare}
                onOpenDetail={setDetailItem}
              />
            )}
            {activeTab === "recommendations" && (
              <RecommendationsView
                mediaItems={mediaItems}
                reviews={reviews}
                recommendations={recommendations}
                currentUserId={selectedMemberId}
                familyMembers={familyMembers}
                onMarkAsRead={handleMarkRecAsRead}
                onOpenDetail={setDetailItem}
              />
            )}
            {activeTab === "watchlist" && (
              <WatchlistView
                mediaItems={mediaItems}
                reviews={reviews}
                watchlist={watchlist}
                currentUserId={selectedMemberId}
                familyMembers={familyMembers}
                onRemove={handleRemoveFromWatchlist}
                onShare={handleShare}
                onOpenDetail={setDetailItem}
              />
            )}
            {activeTab === "stats" && (
              <StatsView
                mediaItems={mediaItems}
                reviews={reviews}
                currentUserId={selectedMemberId}
                familyMembers={familyMembers}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-stone-50/90 dark:bg-stone-950/90 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all relative",
                  isActive ? "text-rose-500" : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
                  {tab.id === "recommendations" && unreadRecsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
                      {unreadRecsCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-px h-0.5 w-12 bg-rose-500 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <AddMediaModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddMedia}
        familyMembers={familyMembers}
        currentUserId={selectedMemberId}
      />
      
      <MediaDetailModal
        item={detailItem}
        reviews={reviews}
        familyMembers={familyMembers}
        currentUserId={selectedMemberId}
        onClose={() => setDetailItem(null)}
        onShare={handleShare}
        onAddToWatchlist={handleAddToWatchlist}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        isInWatchlist={detailItem ? watchlist.includes(detailItem.id) : false}
        onRecommend={handleRecommend}
      />
    </div>
  );
}