export interface MediaItem {
  id: string;
  title: string;
  type: "film" | "serie" | "livre";
  year: number;
  director?: string;
  author?: string;
  genres: string[];
  duration?: string;
  pages?: number;
  posterUrl: string;
  posterColor: string;
  synopsis: string;
  providers?: string[];
}

export interface Review {
  id: string;
  mediaId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  watched: boolean;
  favorite?: boolean;
}

export interface Recommendation {
  id: string;
  fromUserId: string;
  toUserId: string;
  mediaId: string;
  message: string;
  date: string;
  read: boolean;
}

export const mediaItems: MediaItem[] = [
  {
    id: "m1",
    title: "Le Seigneur des Anneaux : La Communauté de l'Anneau",
    type: "film",
    year: 2001,
    director: "Peter Jackson",
    genres: ["Aventure", "Fantastique", "Action"],
    duration: "3h 48m",
    posterUrl: "https://image.tmdb.org/t/p/w500/6F5N0t1OmoUf0nD6Dy5mW2R2Y.jpg",
    posterColor: "from-amber-700 to-amber-950",
    synopsis: "Un jeune hobbit hérite d'un anneau magique et entreprend un voyage périlleux pour le détruire.",
    providers: ["Netflix", "Prime"],
  },
  {
    id: "m2",
    title: "Parasite",
    type: "film",
    year: 2019,
    director: "Bong Joon-ho",
    genres: ["Thriller", "Drame", "Comédie"],
    duration: "2h 12m",
    posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYqC2IIqmgxI.jpg",
    posterColor: "from-stone-700 to-stone-950",
    synopsis: "Une famille pauvre s'infiltre une par une dans la maison d'une famille riche.",
    providers: ["Prime"],
  },
  {
    id: "m3",
    title: "Le Voyage de Chihiro",
    type: "film",
    year: 2001,
    director: "Hayao Miyazaki",
    genres: ["Animation", "Fantastique", "Aventure"],
    duration: "2h 05m",
    posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyfLDHkY7jxXpo.jpg",
    posterColor: "from-sky-500 to-blue-900",
    synopsis: "Une jeune fille pénètre dans le monde des esprits et doit sauver ses parents transformés en cochons.",
    providers: ["Netflix"],
  },
  {
    id: "m4",
    title: "Interstellar",
    type: "film",
    year: 2014,
    director: "Christopher Nolan",
    genres: ["Science-Fiction", "Drame", "Aventure"],
    duration: "2h 49m",
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QdEORZp4W6OLOz6ftC8z7K.jpg",
    posterColor: "from-orange-600 to-stone-950",
    synopsis: "Un groupe d'explorateurs voyage à travers un trou de ver pour sauver l'humanité.",
    providers: ["Netflix", "Prime"],
  },
  {
    id: "m5",
    title: "La La Land",
    type: "film",
    year: 2016,
    director: "Damien Chazelle",
    genres: ["Comédie musicale", "Romance", "Drame"],
    duration: "2h 08m",
    posterUrl: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWEoM2xqE6B5vB9J.jpg",
    posterColor: "from-purple-600 to-indigo-900",
    synopsis: "Un jazziste et une actrice tombent amoureux à Los Angeles tout en poursuivant leurs rêves.",
    providers: ["Disney+"],
  },
  {
    id: "m6",
    title: "Breaking Bad",
    type: "serie",
    year: 2008,
    director: "Vince Gilligan",
    genres: ["Drame", "Thriller", "Crime"],
    duration: "5 saisons",
    posterUrl: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCgOJ7h7p4yK.jpg",
    posterColor: "from-yellow-600 to-stone-950",
    synopsis: "Un professeur de chimie atteint d'un cancer fabrique de la méthamphétamine pour assurer l'avenir de sa famille.",
    providers: ["Netflix"],
  },
  {
    id: "m7",
    title: "Le Labyrinthe des Esprits",
    type: "livre",
    year: 2019,
    author: "Carlos Ruiz Zafón",
    genres: ["Roman", "Mystère", "Historique"],
    pages: 528,
    posterUrl: "https://covers.openlibrary.org/b/isbn/9782266281146-L.jpg",
    posterColor: "from-rose-800 to-stone-950",
    synopsis: "Dans le Barcelone des années 1950, un mystérieux livre mène à une enquête sur le passé.",
  },
  {
    id: "m8",
    title: "L'Étranger",
    type: "livre",
    year: 1942,
    author: "Albert Camus",
    genres: ["Roman", "Philosophique", "Classique"],
    pages: 184,
    posterUrl: "https://covers.openlibrary.org/b/isbn/9782070360024-L.jpg",
    posterColor: "from-orange-800 to-stone-950",
    synopsis: "L'histoire d'un homme indifférent qui commet un meurtre absurde sur une plage algérienne.",
  },
];

export const reviews: Review[] = [
  { id: "r1", mediaId: "m1", userId: "papa", rating: 5, comment: "Un chef-d'œuvre absolu. La musique d'Howard Shore me donne des frissons à chaque fois.", date: "2024-03-10", watched: true, favorite: true },
  { id: "r2", mediaId: "m1", userId: "maman", rating: 4.5, comment: "Magnifique épopée, un peu long tout de même sur la fin.", date: "2024-03-12", watched: true },
  { id: "r3", mediaId: "m1", userId: "soeur", rating: 4, comment: "Super univers mais j'ai eu du mal avec la longueur.", date: "2024-03-15", watched: true },
  { id: "r4", mediaId: "m2", userId: "papa", rating: 4.5, comment: "Brillante critique sociale. La mise en scène est bluffante.", date: "2024-04-01", watched: true },
  { id: "r5", mediaId: "m2", userId: "maman", rating: 5, comment: "Coup de cœur total. Le twist est magistral.", date: "2024-04-03", watched: true, favorite: true },
  { id: "r6", mediaId: "m3", userId: "soeur", rating: 5, comment: "Miyazaki est un génie. L'univers est magique et poétique.", date: "2024-04-10", watched: true, favorite: true },
  { id: "r7", mediaId: "m3", userId: "maman", rating: 4.5, comment: "Une merveille visuelle. Chihiro est touchante.", date: "2024-04-12", watched: true },
  { id: "r8", mediaId: "m4", userId: "timothee", rating: 5, comment: "L'espace, les trous noirs, tout est parfait.", date: "2024-05-03", watched: true, favorite: true },
  { id: "r9", mediaId: "m4", userId: "papa", rating: 5, comment: "La science est fascinante et l'émotion est au rendez-vous.", date: "2024-05-01", watched: true },
  { id: "r10", mediaId: "m5", userId: "soeur", rating: 5, comment: "La musique, les couleurs, l'amour... Tout est parfait.", date: "2024-05-10", watched: true, favorite: true },
  { id: "r11", mediaId: "m6", userId: "timothee", rating: 5, comment: "La meilleure série de tous les temps. Walter White est iconique.", date: "2024-06-01", watched: true, favorite: true },
  { id: "r12", mediaId: "m6", userId: "papa", rating: 4.5, comment: "Tension constante, écriture brillante.", date: "2024-06-03", watched: true },
  { id: "r13", mediaId: "m7", userId: "maman", rating: 4.5, comment: "Une plongée littéraire magnifique dans Barcelone.", date: "2024-06-10", watched: true },
  { id: "r14", mediaId: "m8", userId: "maman", rating: 5, comment: "Un classique qui ne vieillit pas. La réflexion sur l'absurdité est frappante.", date: "2024-07-01", watched: true, favorite: true },
];

export const recommendations: Recommendation[] = [
  { id: "rec1", fromUserId: "papa", toUserId: "maman", mediaId: "m4", message: "Tu dois absolument voir ça, c'est ton genre !", date: "2024-05-04", read: false },
  { id: "rec2", fromUserId: "soeur", toUserId: "maman", mediaId: "m5", message: "On peut le regarder ensemble ce week-end ?", date: "2024-05-11", read: false },
  { id: "rec3", fromUserId: "timothee", toUserId: "papa", mediaId: "m6", message: "Papa, cette série est incroyable. Les personnages sont profonds.", date: "2024-06-02", read: false },
];