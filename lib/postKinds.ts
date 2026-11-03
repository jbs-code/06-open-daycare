import type { PostKind } from "./mockData";

// Mapeo PostKind → UI en español (colores del mockup) — ver SPEC 01
export const POST_KIND_LABELS: Record<PostKind, string> = {
  achievement: "LOGRO",
  activity: "ACTIVIDAD",
  announcement: "ANUNCIO",
};

// Clases Tailwind completas: JIT no detecta clases construidas dinámicamente
export const POST_KIND_BADGE_CLASSES: Record<PostKind, string> = {
  achievement: "bg-achievement-soft text-achievement",
  activity: "bg-activity-soft text-activity",
  announcement: "bg-announcement-soft text-announcement",
};
