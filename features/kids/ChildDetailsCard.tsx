import type { Child } from "@/lib/children";

const rows: { label: string; value: (child: Child) => string }[] = [
  { label: "Fecha de nacimiento", value: (child) => child.birthDate },
  { label: "Sala", value: (child) => child.roomName },
  { label: "Ingreso", value: (child) => child.admission },
];

// Tarjeta de detalles: Fecha de nacimiento / Sala / Ingreso
export function ChildDetailsCard({ child }: { child: Child }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      {rows.map(({ label, value }, index) => (
        <div
          key={label}
          className={`flex items-center justify-between px-[18px] py-[15px] ${
            index < rows.length - 1 ? "border-b border-border-soft" : ""
          }`}
        >
          <span className="text-[14.5px] text-muted-strong">{label}</span>
          <span className="text-[14.5px] font-extrabold text-foreground">
            {value(child)}
          </span>
        </div>
      ))}
    </div>
  );
}
