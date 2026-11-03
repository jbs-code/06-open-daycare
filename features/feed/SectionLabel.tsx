export function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-3.5 flex items-center gap-3.5">
      <span className="text-[12.5px] font-extrabold tracking-[.8px] text-section">
        {label}
      </span>
      <span className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}
