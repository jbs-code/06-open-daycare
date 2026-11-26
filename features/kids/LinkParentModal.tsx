"use client";

import { useEffect, useRef } from "react";

import { CloseIcon, InfoIcon, SendIcon } from "@/components/icons";

const PARENT_RELATIONS = ["Mamá", "Papá", "Tutor/a"] as const;
type ParentRelation = (typeof PARENT_RELATIONS)[number];

const INITIAL_RELATION: ParentRelation = "Mamá";

interface LinkParentModalProps {
  open: boolean;
  onClose: () => void;
  childName: string;
}

function pillClassName(relation: ParentRelation): string {
  const selected = relation === INITIAL_RELATION;

  return `flex-1 rounded-full border-[1.5px] px-3 py-[11px] text-[14px] font-extrabold ${
    selected
      ? "border-[#9FB8EC] bg-announcement-soft text-announcement"
      : "border-border bg-surface text-nav"
  }`;
}

// Réplica de references/pantallas/vincular-padre.dc.html
export function LinkParentModal({
  open,
  onClose,
  childName,
}: LinkParentModalProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    nameInputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-modal-backdrop px-6 py-10"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-parent-title"
        className="w-full max-w-[480px] overflow-hidden rounded-[24px] border border-border bg-auth-page shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5 sm:px-[26px]">
          <div>
            <h2
              id="link-parent-title"
              className="font-fredoka text-[18px] font-semibold text-foreground"
            >
              Vincular padre
            </h2>
            <p className="text-[13px] text-muted">a {childName}</p>
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            className="flex size-[34px] flex-none items-center justify-center rounded-[10px] bg-border-soft text-muted-strong"
          >
            <CloseIcon className="size-[18px]" />
          </button>
        </div>

        <div className="px-6 py-[22px] sm:px-[26px]">
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-info-banner px-4 py-[13px]">
            <InfoIcon className="mt-[1px] size-5 flex-none text-announcement" />
            <span className="text-[13.5px] leading-[1.45] text-info-banner-ink">
              Le enviaremos un correo con un código para que active su cuenta.
              Solo verá el feed de Mateo.
            </span>
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor="link-parent-full-name"
              className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              NOMBRE DEL PADRE/MADRE
            </label>
            <input
              ref={nameInputRef}
              id="link-parent-full-name"
              type="text"
              placeholder="Ej. Diego Fernández"
              className="w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] text-foreground outline-none placeholder:text-placeholder"
            />
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor="link-parent-email"
              className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              EMAIL
            </label>
            <input
              id="link-parent-email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] text-foreground outline-none placeholder:text-placeholder"
            />
          </div>

          <div className="mb-5">
            <div
              id="link-parent-relation-label"
              className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              PARENTESCO
            </div>
            <div
              role="group"
              aria-labelledby="link-parent-relation-label"
              className="flex gap-[9px]"
            >
              {PARENT_RELATIONS.map((relation) => (
                <button
                  key={relation}
                  type="button"
                  aria-pressed={relation === INITIAL_RELATION}
                  className={pillClassName(relation)}
                >
                  {relation}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-invite-code-border bg-consent-bg p-[18px] text-center">
            <div className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-invite-code-ink">
              CÓDIGO DE INVITACIÓN
            </div>
            <div className="font-fredoka text-[34px] font-semibold tracking-[7px] text-consent-ink">
              7K4P9
            </div>
            <div className="mt-[6px] text-[13px] text-invite-code-ink">
              Vence en 7 días
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-gradient-to-b from-coral-from to-coral-to p-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
          >
            <SendIcon className="size-[19px]" />
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}
