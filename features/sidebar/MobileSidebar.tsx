"use client";

import { useState } from "react";
import { MenuIcon, SunIcon } from "@/components/icons";
import type { CurrentUser } from "@/lib/mockData";
import { SidebarContent } from "./SidebarContent";

// Versión móvil del sidebar (bajo md): barra superior + drawer superpuesto
export function MobileSidebar({ user }: { user: CurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5 md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          className="flex size-10 flex-none items-center justify-center rounded-xl text-nav"
        >
          <MenuIcon className="size-6" />
        </button>
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
            <SunIcon className="size-[18px] text-white" />
          </span>
          <span className="font-fredoka text-[16px] font-semibold text-foreground">
            OpenDayCare
          </span>
        </a>
      </header>

      {/* Overlay: cierra el drawer al tocarlo */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel deslizante desde la izquierda */}
      <aside
        inert={!isOpen}
        aria-label="Menú principal"
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border bg-surface px-4 py-6 transition-transform duration-200 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent user={user} onNavigate={close} />
      </aside>
    </>
  );
}
