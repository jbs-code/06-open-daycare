import type { CurrentUser } from "@/lib/mockData";
import { SidebarContent } from "./SidebarContent";

// Sidebar desktop: sticky, 248px. Bajo md se oculta (lo reemplaza MobileSidebar)
export function Sidebar({ user }: { user: CurrentUser }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] flex-none flex-col border-r border-border bg-surface px-4 py-6 md:flex">
      <SidebarContent user={user} />
    </aside>
  );
}
