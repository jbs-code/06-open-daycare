import type { Child } from "@/lib/children";

// Cabecera del perfil: avatar 84px + nombre + botón "Editar"
export function ChildProfileHeader({ child }: { child: Child }) {
  return (
    <div className="flex items-center gap-[18px]">
      <span
        className="flex size-[84px] flex-none items-center justify-center rounded-full font-fredoka text-[34px] font-semibold"
        style={{ backgroundColor: child.avatarBg, color: child.avatarInk }}
      >
        {child.initial}
      </span>
      <span className="min-w-0 flex-1">
        <h1 className="font-fredoka text-[28px] font-semibold break-words text-foreground [overflow-wrap:anywhere]">
          {child.fullName}
        </h1>
        <p className="mt-[3px] text-[15px] text-muted-strong">
          {child.ageYears} años · Sala {child.roomName}
        </p>
      </span>
      <a
        href="#"
        className="flex-none rounded-xl border-[1.5px] border-border bg-surface px-4 py-[9px] text-sm font-bold text-nav"
      >
        Editar
      </a>
    </div>
  );
}
