// Data ficticia de niños — textos y colores de references/pantallas/ninos.dc.html
export type ParentStatus = "active" | "pending";

export interface Parent {
  fullName: string;
  initial: string;
  relation: string; // "Mamá" | "Papá"
  status: ParentStatus;
  avatarBg: string;
}

export type BadgeTone = "alert" | "action";

export interface ChildBadge {
  label: string; // "MANÍ" | "LACTOSA" | "VINCULAR"
  tone: BadgeTone;
}

export interface Child {
  slug: string;
  fullName: string;
  initial: string;
  ageYears: number;
  avatarBg: string;
  avatarInk: string;
  badge?: ChildBadge;
  birthDate: string;
  roomName: string;
  admission: string;
  allergies?: string; // solo Mateo
  parents: Parent[];
}

export const children: Child[] = [
  {
    slug: "mateo-fernandez",
    fullName: "Mateo Fernández",
    initial: "M",
    ageYears: 3,
    avatarBg: "#A9D9E8",
    avatarInk: "#1F7A93",
    badge: { label: "MANÍ", tone: "alert" },
    birthDate: "12 mar 2022",
    roomName: "Soles",
    admission: "feb 2025",
    allergies:
      "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    parents: [
      {
        fullName: "Lucía Fernández",
        initial: "L",
        relation: "Mamá",
        status: "active",
        avatarBg: "#C9B6E8",
      },
      {
        fullName: "Diego Fernández",
        initial: "D",
        relation: "Papá",
        status: "pending",
        avatarBg: "#A9C7E8",
      },
    ],
  },
  {
    slug: "sofia-mendez",
    fullName: "Sofía Méndez",
    initial: "S",
    ageYears: 2,
    avatarBg: "#F4B8CC",
    avatarInk: "#C44A7A",
    birthDate: "05 jul 2023",
    roomName: "Soles",
    admission: "mar 2025",
    parents: [
      {
        fullName: "Rocío Méndez",
        initial: "R",
        relation: "Mamá",
        status: "active",
        avatarBg: "#C9B6E8",
      },
    ],
  },
  {
    slug: "benjamin-ruiz",
    fullName: "Benjamín Ruiz",
    initial: "B",
    ageYears: 3,
    avatarBg: "#B9DEC4",
    avatarInk: "#3E8B62",
    birthDate: "28 sep 2022",
    roomName: "Soles",
    admission: "abr 2025",
    parents: [
      {
        fullName: "Paula Ruiz",
        initial: "P",
        relation: "Mamá",
        status: "active",
        avatarBg: "#F4B8CC",
      },
      {
        fullName: "Andrés Ruiz",
        initial: "A",
        relation: "Papá",
        status: "active",
        avatarBg: "#A9C7E8",
      },
    ],
  },
  {
    slug: "valentina-soto",
    fullName: "Valentina Soto",
    initial: "V",
    ageYears: 2,
    avatarBg: "#F4DC8E",
    avatarInk: "#9A7B1E",
    badge: { label: "VINCULAR", tone: "action" },
    birthDate: "19 ene 2023",
    roomName: "Soles",
    admission: "ago 2025",
    parents: [],
  },
  {
    slug: "tomas-diaz",
    fullName: "Tomás Díaz",
    initial: "T",
    ageYears: 3,
    avatarBg: "#C9B6E8",
    avatarInk: "#7B5FC0",
    badge: { label: "LACTOSA", tone: "alert" },
    birthDate: "02 feb 2022",
    roomName: "Soles",
    admission: "ene 2025",
    parents: [
      {
        fullName: "Camila Díaz",
        initial: "C",
        relation: "Mamá",
        status: "pending",
        avatarBg: "#C9B6E8",
      },
    ],
  },
  {
    slug: "emma-castro",
    fullName: "Emma Castro",
    initial: "E",
    ageYears: 2,
    avatarBg: "#F4B8CC",
    avatarInk: "#C44A7A",
    birthDate: "14 jun 2023",
    roomName: "Soles",
    admission: "set 2025",
    parents: [
      {
        fullName: "Natalia Castro",
        initial: "N",
        relation: "Mamá",
        status: "active",
        avatarBg: "#B9DEC4",
      },
    ],
  },
  {
    slug: "lucas-romero",
    fullName: "Lucas Romero",
    initial: "L",
    ageYears: 3,
    avatarBg: "#A9D9E8",
    avatarInk: "#1F7A93",
    birthDate: "21 nov 2021",
    roomName: "Soles",
    admission: "may 2025",
    parents: [
      {
        fullName: "Verónica Romero",
        initial: "V",
        relation: "Mamá",
        status: "active",
        avatarBg: "#F4DC8E",
      },
    ],
  },
  {
    slug: "olivia-vega",
    fullName: "Olivia Vega",
    initial: "O",
    ageYears: 2,
    avatarBg: "#B9DEC4",
    avatarInk: "#3E8B62",
    birthDate: "08 ago 2023",
    roomName: "Soles",
    admission: "jul 2025",
    parents: [
      {
        fullName: "Silvia Vega",
        initial: "S",
        relation: "Mamá",
        status: "active",
        avatarBg: "#F4B8CC",
      },
    ],
  },
];

export const childrenRoomLabel: string = "SALA SOLES";

export function getChildBySlug(slug: string): Child | undefined {
  return children.find((child) => child.slug === slug);
}

export function childSubtitle(child: Child): string {
  const age = `${child.ageYears} años`;
  const parentCount = child.parents.length;

  if (parentCount === 0) return `${age} · sin padres vinculados`;
  if (parentCount === 1) return `${age} · 1 padre vinculado`;
  return `${age} · ${parentCount} padres vinculados`;
}
