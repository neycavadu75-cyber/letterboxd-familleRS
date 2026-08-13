import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Film, BookOpen, Tv, Loader2, Star, Check, Heart, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MediaItem, Review, Recommendation } from "@/data/media";
import { FamilyMember } from "@/data/family";
import { cn } from "@/lib/utils";
import { PosterImage } from "@/components/PosterImage";

const TMDB_API_KEY = "95271071621da1a924331e67922247c6";
const TMDB_IMG_URL = "https://image.tmdb.org/t/p/w500";

interface SearchResult {
  id: string;
  title: string;
  year: number;
  type: "film" | "serie" | "livre";
  posterUrl: string;
  posterColor: string;
  author?: string;
  director?: string;
  genres: string[];
  synopsis: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (item: MediaItem, review: Omit<Review, "id" | "userId" | "date">, recommendations: Omit<Recommendation, "id" | "fromUserId" | "date" | "read">[]) => void;
  familyMembers: FamilyMember[];
  currentUserId: string;
}

const posterColors = [
  "from-rose-700 to-stone-950",
  "from-blue-700 to-stone-950",
  "from-emerald-700 to-stone-950",
  "from-amber-700 to-stone-950",
  "from-purple-700 to-stone-950",
  "from-indigo-700 to-stone-950",
];

export function AddMediaModal({ open, onClose, onAdd, familyMembers, currentUserId }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<"film" | "livre">("film");
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [recommendTo, setRecommendTo] = useState<Record<string, string>>({});

  const searchTMDB = async (q: string) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(q)}`);
      const data = await res.json();
      const mapped: SearchResult[] = (data.results || [])
        .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, 10)
        .map((item: any, index: number) => ({
          id: `tmdb-${item.id}`,
          title: item.title || item.name || "Titre inconnu",
          year: new Date(item.release_date || item.first_air_date || Date.now()).getFullYear(),
          type: item.media_type === "movie" ? "film" : "serie",
          posterUrl: item.poster_path ? `${TMDB_IMG_URL}${item.poster_path}` : "",
          posterColor: posterColors[index % posterColors.length],
          director: "Inconnu",
          genres: [],
          synopsis: item.overview || "Pas de synopsis disponible.",
        }));
      setResults(mapped);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const searchBooks = async (q: string) => {
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`);
      const data = await res.json();
      const mapped: SearchResult[] = (data.docs || []).slice(0, 10).map((doc: any, index: number) => ({
        id: `ol-${doc.key}`,
        title: doc.title || "Titre inconnu",
        year: doc.first_publish_year || new Date().getFullYear(),
        type: "livre" as const,
        posterUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : "",
        posterColor: posterColors[index % posterColors.length],
        author: doc.author_name?.[0] || "Inconnu",
        genres: ["Roman"],
        synopsis: doc.first_sentence?.[0] || "Pas de synopsis disponible.",
      }));
      setResults(mapped);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    if (searchType === "film") {
      searchTMDB(q);
    } else {
      searchBooks(q);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setSelectedItem(result);
    setRating(0);
    setComment("");
    setFavorite(false);
    setRecommendTo({});
  };

  const handlePublish = () => {
    if (!selectedItem || rating === 0) return;

    const newMedia: MediaItem = {
      id: selectedItem.id,
      title: selectedItem.title,
      type: selectedItem.type,
      year: selectedItem.year,
      director: selectedItem.director,
      author: selectedItem.author,
      genres: selectedItem.genres.length > 0 ? selectedItem.genres : ["Inconnu"],
      posterUrl: selectedItem.posterUrl,
      posterColor: selectedItem.posterColor,
      synopsis: selectedItem.synopsis,
    };

    const reviewData: Omit<Review, "id" | "userId" | "date"> = {
      mediaId: newMedia.id,
      rating,
      comment,
      watched: true,
      favorite: rating === 5 ? true : favorite,
    };

    const recs: Omit<Recommendation, "id" | "fromUserId" | "date" | "read">[] = Object.entries(recommendTo)
      .filter(([_, msg]) => msg.trim() !== "")
      .map(([toUserId, msg]) => ({
        toUserId,
        mediaId: newMedia.id,
        message: msg,
      }));

    onAdd(newMedia, reviewData, recs);

    setSelectedItem(null);
    setQuery("");
    setResults([]);
    setRating(0);
    setComment("");
    setFavorite(false);
    setRecommendTo({});
  };

  const handleClose = () => {
    setSelectedItem(null);
    setQuery("");
    setResults([]);
    setRating(0);
    setComment("");
    setFavorite(false);
    setRecommendTo({});
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-stone-50 dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800 shrink-0">
              <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-500" />
                {selectedItem ? "Noter et publier" : "Ajouter une œuvre"}
              </h2>
              <Button size="icon" variant="ghost" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-y-auto flex-1">
              {!selectedItem ? (
                <>
                  <div className="flex gap-2 p-4 pb-2">
                    <button
                      onClick={() => { setSearchType("film"); setQuery(""); setResults([]); }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                        searchType === "film" ? "bg-rose-500 text-white border-rose-500" : "border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                      )}
                    >
                      <Film className="w-4 h-4" /> Films & Séries
                    </button>
                    <button
                      onClick={() => { setSearchType("livre"); setQuery(""); setResults([]); }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                        searchType === "livre" ? "bg-rose-500 text-white border-rose-500" : "border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400"
                      )}
                    >
                      <BookOpen className="w-4 h-4" /> Livres
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input
                        placeholder={searchType === "film" ? "Rechercher un film ou une série..." : "Rechercher un livre (via Open Library)..."}
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    {loading && (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
                      </div>
                    )}
                    {!loading && results.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {results.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSelect(result)}
                            className="group relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-left hover:shadow-lg transition-shadow"
                          >
                            <div className="aspect-[2/3] relative overflow-hidden">
                              <PosterImage item={result as any} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <span className="text-white text-xs font-medium flex items-center gap-1">
                                  <Plus className="w-3 h-3" /> Sélectionner
                                </span>
                              </div>
                            </div>
                            <div className="p-2">
                              <h3 className="font-bold text-xs line-clamp-1">{result.title}</h3>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-stone-500">{result.year}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {result.type === "film" ? "Film" : result.type === "serie" ? "Série" : "Livre"}
                                </Badge>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {!loading && query.length >= 2 && results.length === 0 && (
                      <div className="text-center py-12 text-stone-400">
                        <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Aucun résultat trouvé pour "{query}"</p>
                      </div>
                    )}
                    {!loading && query.length < 2 && (
                      <div className="text-center py-12 text-stone-400">
                        <p className="text-sm">Commencez à taper pour rechercher...</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="w-32 shrink-0">
                      <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-lg">
                        <PosterImage item={selectedItem as any} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="mb-2">
                        {selectedItem.type === "film" ? "Film" : selectedItem.type === "serie" ? "Série" : "Livre"}
                      </Badge>
                      <h3 className="font-serif text-xl font-bold">{selectedItem.title}</h3>
                      <p className="text-sm text-stone-500 mb-2">{selectedItem.year} {selectedItem.author && `• ${selectedItem.author}`}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-4">{selectedItem.synopsis}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Votre note</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => {
                          const half = i - 0.5;
                          return (
                            <div key={i} className="relative">
                              <button
                                onClick={() => setRating(half)}
                                onMouseEnter={() => setHoverRating(half)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="absolute left-0 top-0 w-1/2 h-full z-10"
                              />
                              <button
                                onClick={() => setRating(i)}
                                onMouseEnter={() => setHoverRating(i)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="absolute right-0 top-0 w-1/2 h-full z-10"
                              />
                              <div className="relative">
                                <Star className="w-8 h-8 text-stone-300 dark:text-stone-700" />
                                <div
                                  className="absolute inset-0 overflow-hidden"
                                  style={{
                                    width: `${Math.min(Math.max((hoverRating || rating) - (i - 1), 0), 1) * 100}%`,
                                  }}
                                >
                                  <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <span className="ml-2 text-sm font-medium text-stone-500">
                          {rating > 0 ? `${rating} étoile${rating > 1 ? "s" : ""}` : "Cliquez pour noter"}
                        </span>
                      </div>
                      {rating === 5 && (
                        <div className="mt-2 flex items-center gap-2 text-rose-500 text-sm font-medium">
                          <Heart className="w-4 h-4 fill-rose-500" />
                          Coup de cœur automatique !
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Votre avis (optionnel)</label>
                      <Textarea
                        placeholder="Écrivez votre critique..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-24 resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                        <Send className="w-4 h-4 text-violet-500" />
                        Recommander à...
                      </label>
                      <div className="space-y-2">
                        {familyMembers.filter(m => m.id !== currentUserId).map((member) => (
                          <div key={member.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`rec-${member.id}`}
                              checked={!!recommendTo[member.id]}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRecommendTo(prev => ({ ...prev, [member.id]: "" }));
                                } else {
                                  setRecommendTo(prev => {
                                    const copy = { ...prev };
                                    delete copy[member.id];
                                    return copy;
                                  });
                                }
                              }}
                              className="w-4 h-4 rounded border-stone-300 text-rose-500 focus:ring-rose-500"
                            />
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className={cn(member.color, "text-xs")}>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{member.name}</span>
                            {recommendTo[member.id] !== undefined && (
                              <Input
                                placeholder="Un petit mot..."
                                value={recommendTo[member.id]}
                                onChange={(e) => setRecommendTo(prev => ({ ...prev, [member.id]: e.target.value }))}
                                className="flex-1 h-8 text-xs"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <Button variant="ghost" onClick={() => setSelectedItem(null)}>
                        Retour
                      </Button>
                      <Button
                        onClick={handlePublish}
                        disabled={rating === 0}
                        className="bg-rose-500 hover:bg-rose-600 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" /> Publier
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}