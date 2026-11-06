import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { childSubtitle, type BadgeTone, type Child } from "@/lib/children";

// Colores exactos del mockup por tono de badge
const BADGE_STYLES: Record<BadgeTone, string> = {
  alert: "bg-[#FBD8CC] text-[#D9684A]",
  action: "bg-[#F9D2DE] text-[#C56486]",
};

export function KidCard({ child }: { child: Child }) {
  return (
    <Link
      href={`/kids/${child.slug}`}
      className="flex items-center gap-[14px] rounded-[18px] border border-border bg-surface p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,0.5)] transition duration-150 hover:-translate-y-[2px] hover:border-[#F2A78E]"
    >
      <span
        className="flex size-12 flex-none items-center justify-center rounded-full font-fredoka text-[19px] font-semibold"
        style={{ backgroundColor: child.avatarBg, color: child.avatarInk }}
      >
        {child.initial}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-fredoka text-base font-semibold text-foreground">
          {child.fullName}
        </span>
        <span className="block text-[13px] text-muted">
          {childSubtitle(child)}
        </span>
      </span>
      {child.badge ? (
        <span
          className={`flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold ${BADGE_STYLES[child.badge.tone]}`}
        >
          {child.badge.label}
        </span>
      ) : (
        <ChevronRightIcon className="size-[18px] flex-none text-[#CBB89F]" />
      )}
    </Link>
  );
}
