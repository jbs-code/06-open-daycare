// Data ficticia del feed — textos exactos de references/pantallas/feed.dc.html
export type PostKind = "achievement" | "activity" | "announcement";

export interface FeedPost {
  id: string;
  kind: PostKind;
  authorName: string;
  authorInitial: string; // vacío → se usa ícono en lugar de avatar
  time: string;
  audience: string;
  body: string;
  photo?: { label: string }; // placeholder visual, sin imagen real
  likes: number;
  comments: number;
}

export interface CurrentUser {
  fullName: string;
  initial: string;
  role: string;
  roomName: string;
  childrenCount: number;
}

export const currentUser: CurrentUser = {
  fullName: "Caro Giménez",
  initial: "C",
  role: "Maestra · Soles",
  roomName: "Sala Soles",
  childrenCount: 12,
};

export const feedDateLabel: string = "martes 17 jun";

export const feedPosts: FeedPost[] = [
  {
    id: "post-1",
    kind: "achievement",
    authorName: "Mateo",
    authorInitial: "M",
    time: "14:20 · publicado por vos",
    audience: "Para: familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
  },
  {
    id: "post-2",
    kind: "activity",
    authorName: "Mateo",
    authorInitial: "M",
    time: "09:40 · publicado por vos",
    audience: "Para: familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    photo: { label: "Foto · pintando con témperas" },
    likes: 5,
    comments: 2,
  },
  {
    id: "post-3",
    kind: "announcement",
    authorName: "Anuncio general",
    authorInitial: "",
    time: "07:50 · publicado por vos",
    audience: "Para: toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
  },
];
