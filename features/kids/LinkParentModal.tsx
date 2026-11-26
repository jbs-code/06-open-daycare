"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { CloseIcon, InfoIcon, SendIcon } from "@/components/icons";

const PARENT_RELATIONS = ["Mamá", "Papá", "Tutor/a"] as const;
type ParentRelation = (typeof PARENT_RELATIONS)[number];

interface LinkParentForm {
  fullName: string;
  email: string;
  relation: ParentRelation;
}

type FieldErrors = Partial<Record<"email", string>>;

const INITIAL_FORM: LinkParentForm = {
  fullName: "",
  email: "",
  relation: "Mamá",
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Ingresá el correo electrónico.";
  if (!isValidEmail(value)) return "Ingresá un correo válido.";
  return undefined;
}

function pillClassName(
  relation: ParentRelation,
  selectedRelation: ParentRelation,
): string {
  const selected = relation === selectedRelation;

  return `flex-1 rounded-full border-[1.5px] px-3 py-[11px] text-[14px] font-extrabold ${
    selected
      ? "border-[#9FB8EC] bg-announcement-soft text-announcement"
      : "border-border bg-surface text-nav"
  }`;
}

function inputClassName(hasError: boolean): string {
  return `w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-foreground outline-none placeholder:text-placeholder ${
    hasError ? "border-coral-deep" : "border-field-border"
  }`;
}

interface LinkParentModalProps {
  open: boolean;
  onClose: () => void;
  childName: string;
}

// Réplica de references/pantallas/vincular-padre.dc.html
export function LinkParentModal({
  open,
  onClose,
  childName,
}: LinkParentModalProps) {
  const [form, setForm] = useState<LinkParentForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const closeAndReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    nameInputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndReset();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, closeAndReset]);

  if (!open) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeAndReset();
  };

  const handleEmailBlur = () => {
    setErrors({ email: validateEmail(form.email) });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setForm((prev) => ({ ...prev, email }));

    setErrors((prev) => {
      if (!prev.email) return prev;
      return { ...prev, email: validateEmail(email) };
    });
  };

  const handleSubmit = () => {
    const emailError = validateEmail(form.email);
    setErrors({ email: emailError });

    if (emailError) {
      emailInputRef.current?.focus();
      return;
    }

    closeAndReset();
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
            onClick={closeAndReset}
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
              value={form.fullName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, fullName: event.target.value }))
              }
              className={inputClassName(false)}
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
              ref={emailInputRef}
              id="link-parent-email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "link-parent-email-error" : undefined
              }
              className={inputClassName(Boolean(errors.email))}
            />
            {errors.email ? (
              <p
                id="link-parent-email-error"
                className="mt-2 text-[13px] font-semibold text-coral-deep"
              >
                {errors.email}
              </p>
            ) : null}
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
                  aria-pressed={relation === form.relation}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, relation }))
                  }
                  className={pillClassName(relation, form.relation)}
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
            onClick={handleSubmit}
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
