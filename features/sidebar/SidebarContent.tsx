"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellIcon,
  HomeIcon,
  LogoutIcon,
  PlusIcon,
  SunIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import type { CurrentUser } from "@/lib/mockData";

interface NavItem {
  label: string;
  Icon: ComponentType<{ className?: string }>;
  href: string;
}

// Avisos y Mi cuenta aún no existen → href="#" para no romper con 404 (SPEC 01)
const NAV_ITEMS: NavItem[] = [
  { label: "Feed", Icon: HomeIcon, href: "/" },
  { label: "Niños", Icon: UsersIcon, href: "/kids" },
  { label: "Avisos", Icon: BellIcon, href: "#" },
  { label: "Mi cuenta", Icon: UserIcon, href: "#" },
];

// "#" nunca está activo; "/" solo con match exacto; el resto cubre subrutas (/kids/...)
function isActiveRoute(href: string, pathname: string): boolean {
  if (href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarContentProps {
  user: CurrentUser;
  // En el drawer móvil cierra el panel al tocar cualquier link
  onNavigate?: () => void;
}

export function SidebarContent({ user, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      <a href="#" onClick={onNavigate} className="flex items-center gap-[11px] px-2 pt-1 pb-[22px]">
        <span className="flex size-[38px] flex-none items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
          <SunIcon className="size-[21px] text-white" />
        </span>
        <span>
          <span className="block font-fredoka text-[17px] leading-none font-semibold text-foreground">
            OpenDayCare
          </span>
          <span className="mt-0.5 block text-[11.5px] text-muted">
            {user.roomName}
          </span>
        </span>
      </a>

      <a
        href="#"
        onClick={onNavigate}
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.75)]"
      >
        <PlusIcon className="size-[17px]" />
        Nueva publicación
      </a>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, Icon, href }) => {
          const active = isActiveRoute(href, pathname);
          const className = `flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] ${
            active
              ? "bg-coral-soft font-extrabold text-coral-deep"
              : "font-semibold text-nav"
          }`;
          const content = (
            <>
              <Icon className="size-[19px]" />
              {label}
            </>
          );

          // Rutas reales navegan en SPA; los placeholders siguen en <a>
          return href === "#" ? (
            <a key={label} href={href} onClick={onNavigate} className={className}>
              {content}
            </a>
          ) : (
            <Link key={label} href={href} onClick={onNavigate} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2.5 border-t border-border pt-3.5">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <span className="flex size-[38px] flex-none items-center justify-center rounded-full bg-coral-bright font-fredoka text-base font-semibold text-white">
            {user.initial}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold text-foreground">
              {user.fullName}
            </span>
            <span className="block text-xs text-muted">{user.role}</span>
          </span>
          <a
            href="#"
            onClick={onNavigate}
            title="Cerrar sesión"
            className="flex size-8 flex-none items-center justify-center rounded-[10px] bg-page text-muted-strong"
          >
            <LogoutIcon className="size-4" />
          </a>
        </div>
      </div>
    </>
  );
}
