import { AlertTriangleIcon } from "@/components/icons";

// Caja roja de alergias — el mockup solo la muestra en Mateo
export function AllergyAlert({ text }: { text: string }) {
  return (
    <div className="flex gap-[14px] rounded-2xl bg-[#FBDAD6] px-[18px] py-4">
      <span className="flex size-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
        <AlertTriangleIcon className="size-[22px] text-white" />
      </span>
      <div className="min-w-0">
        <div className="mb-0.5 text-[15px] font-extrabold text-[#C5413A]">
          Alergias y notas
        </div>
        <div className="text-[14.5px] leading-normal text-[#B25249]">{text}</div>
      </div>
    </div>
  );
}
