import { SearchIcon } from "@/components/icons";
import { KidCard } from "@/features/kids/KidCard";
import { KidsHeader } from "@/features/kids/KidsHeader";
import { MobileSidebar } from "@/features/sidebar/MobileSidebar";
import { Sidebar } from "@/features/sidebar/Sidebar";
import { children, childrenRoomLabel } from "@/lib/children";
import { currentUser } from "@/lib/mockData";

// Réplica de references/pantallas/ninos.dc.html
export default function KidsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-page md:flex-row">
      <MobileSidebar user={currentUser} />
      <Sidebar user={currentUser} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[880px] px-10 pt-[34px] pb-20">
          <KidsHeader />

          {/* Búsqueda solo visual: sin estado ni filtro (SPEC 02) */}
          <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-border bg-surface px-4 py-3">
            <SearchIcon className="size-[18px] flex-none text-[#B0A290]" />
            <input
              placeholder="Buscar niño…"
              className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-foreground outline-none placeholder:text-[#B6A99B]"
            />
          </div>

          <div className="mb-[14px] flex items-center gap-3">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-foreground">
              {childrenRoomLabel}
            </span>
            <span className="text-[13px] text-muted">{children.length} niños</span>
            <span className="h-px flex-1 bg-border-subtle" />
          </div>

          <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
            {children.map((child) => (
              <KidCard key={child.slug} child={child} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
