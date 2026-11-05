import { PlusIcon } from "@/components/icons";
import type { Parent, ParentStatus } from "@/lib/children";

// Texto secundario del padre según estado (del mockup)
const STATUS_TEXT: Record<ParentStatus, string> = {
  active: "activa",
  pending: "invitación enviada",
};

const BADGE_STYLES: Record<ParentStatus, string> = {
  active: "bg-achievement-soft text-achievement",
  pending: "bg-[#F7E7A6] text-[#9A7B1E]",
};

const BADGE_LABEL: Record<ParentStatus, string> = {
  active: "ACTIVA",
  pending: "PENDIENTE",
};

// Tarjeta "PADRES VINCULADOS" de la columna derecha del perfil
export function ParentsCard({ parents }: { parents: Parent[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-[18px] py-4">
      <div className="mb-[14px] text-[12.5px] font-extrabold tracking-[0.8px] text-section">
        PADRES VINCULADOS
      </div>
      <div className="flex flex-col gap-[14px]">
        {parents.map((parent) => (
          <div key={parent.fullName} className="flex items-center gap-3">
            <span
              className="flex size-10 flex-none items-center justify-center rounded-full font-fredoka text-base font-semibold text-white"
              style={{ backgroundColor: parent.avatarBg }}
            >
              {parent.initial}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-extrabold text-foreground">
                {parent.fullName}
              </span>
              <span className="block text-[12.5px] text-muted">
                {parent.relation} · {STATUS_TEXT[parent.status]}
              </span>
            </span>
            <span
              className={`flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${BADGE_STYLES[parent.status]}`}
            >
              {BADGE_LABEL[parent.status]}
            </span>
          </div>
        ))}
        <a href="#" className="flex items-center gap-3 pt-2">
          <span className="flex size-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
            <PlusIcon className="size-[18px]" />
          </span>
          <span className="text-[14.5px] font-extrabold text-coral-strong">
            Vincular otro padre
          </span>
        </a>
      </div>
    </div>
  );
}
