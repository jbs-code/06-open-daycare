"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "@/components/icons";

const ROOM_OPTIONS = ["Soles", "Lunas", "Estrellas"] as const;
type Room = (typeof ROOM_OPTIONS)[number];

interface AddChildForm {
  fullName: string;
  birthDate: string;
  room: Room | "";
  allergies: string;
  medicalNotes: string;
}

type RequiredField = "fullName" | "birthDate" | "room";
type FieldErrors = Partial<Record<RequiredField, string>>;

const INITIAL_FORM: AddChildForm = {
  fullName: "",
  birthDate: "",
  room: "Soles",
  allergies: "",
  medicalNotes: "",
};

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(month: number, year: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

function isValidDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > getDaysInMonth(month, year)) return false;

  return true;
}

function validateField(
  field: RequiredField,
  form: AddChildForm,
): string | undefined {
  if (field === "fullName") {
    if (!form.fullName.trim()) return "Ingresá el nombre completo.";
    return undefined;
  }

  if (field === "birthDate") {
    if (!form.birthDate.trim()) return "Ingresá la fecha de nacimiento.";
    if (!isValidDate(form.birthDate)) return "Ingresá una fecha válida (dd/mm/aaaa).";
    return undefined;
  }

  if (field === "room") {
    if (!form.room) return "Seleccioná una sala.";
    return undefined;
  }

  return undefined;
}

interface AddChildModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddChildModal({ open, onClose }: AddChildModalProps) {
  const [form, setForm] = useState<AddChildForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);
  const roomSelectRef = useRef<HTMLSelectElement>(null);

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
  }, []);

  const closeAndReset = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) return;

    nameInputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAndReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, closeAndReset]);

  if (!open) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeAndReset();
    }
  };

  const handleBlur = (field: RequiredField) => {
    const error = validateField(field, form);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFieldChange = (field: keyof AddChildForm, value: string) => {
    const nextForm = { ...form, [field]: value } as AddChildForm;
    setForm(nextForm);

    if (field === "fullName" || field === "birthDate" || field === "room") {
      setErrors((prev) => {
        if (!prev[field]) return prev;
        return { ...prev, [field]: validateField(field, nextForm) };
      });
    }
  };

  const handleSave = () => {
    const nextErrors: FieldErrors = {
      fullName: validateField("fullName", form),
      birthDate: validateField("birthDate", form),
      room: validateField("room", form),
    };

    setErrors(nextErrors);

    const firstInvalidField = ([
      "fullName",
      "birthDate",
      "room",
    ] as RequiredField[]).find((field) => nextErrors[field]);

    if (firstInvalidField) {
      if (firstInvalidField === "fullName") nameInputRef.current?.focus();
      if (firstInvalidField === "birthDate") birthDateInputRef.current?.focus();
      if (firstInvalidField === "room") roomSelectRef.current?.focus();
      return;
    }

    closeAndReset();
  };

  const inputClassName = (hasError: boolean) =>
    `w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-foreground outline-none placeholder:text-placeholder ${
      hasError ? "border-coral-deep" : "border-field-border"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-modal-backdrop px-6 py-10"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-child-title"
        className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-border bg-auth-page shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-border px-[26px] py-5">
          <button
            type="button"
            onClick={closeAndReset}
            className="text-[15px] font-bold text-muted-strong"
          >
            Cancelar
          </button>
          <span
            id="add-child-title"
            className="font-fredoka text-[18px] font-semibold text-foreground"
          >
            Agregar niño
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="text-[15px] font-extrabold text-coral-deep"
          >
            Guardar
          </button>
        </div>

        <div className="px-6 py-6 sm:px-[26px]">
          <div className="mb-[18px]">
            <label
              htmlFor="child-full-name"
              className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              NOMBRE COMPLETO
            </label>
            <input
              ref={nameInputRef}
              id="child-full-name"
              placeholder="Ej. Martina López"
              value={form.fullName}
              onChange={(event) => handleFieldChange("fullName", event.target.value)}
              onBlur={() => handleBlur("fullName")}
              className={inputClassName(Boolean(errors.fullName))}
            />
            {errors.fullName ? (
              <p className="mt-2 text-[13px] font-semibold text-coral-deep">
                {errors.fullName}
              </p>
            ) : null}
          </div>

          <div className="mb-[18px] flex gap-[14px]">
            <div className="flex-1">
              <label
                htmlFor="child-birth-date"
                className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
              >
                FECHA DE NACIMIENTO
              </label>
              <input
                ref={birthDateInputRef}
                id="child-birth-date"
                placeholder="dd/mm/aaaa"
                value={form.birthDate}
                onChange={(event) =>
                  handleFieldChange("birthDate", event.target.value)
                }
                onBlur={() => handleBlur("birthDate")}
                className={inputClassName(Boolean(errors.birthDate))}
              />
              {errors.birthDate ? (
                <p className="mt-2 text-[13px] font-semibold text-coral-deep">
                  {errors.birthDate}
                </p>
              ) : null}
            </div>
            <div className="flex-1">
              <label
                htmlFor="child-room"
                className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
              >
                SALA
              </label>
              <div className="relative">
                <select
                  ref={roomSelectRef}
                  id="child-room"
                  value={form.room}
                  onChange={(event) =>
                    handleFieldChange("room", event.target.value)
                  }
                  onBlur={() => handleBlur("room")}
                  className={`${inputClassName(Boolean(errors.room))} appearance-none pr-10 font-bold`}
                >
                  {ROOM_OPTIONS.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#B0A290]" />
              </div>
              {errors.room ? (
                <p className="mt-2 text-[13px] font-semibold text-coral-deep">
                  {errors.room}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor="child-allergies"
              className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              ALERGIAS (ETIQUETAS)
            </label>
            <input
              id="child-allergies"
              placeholder="Ej. Maní, Lactosa"
              value={form.allergies}
              onChange={(event) =>
                handleFieldChange("allergies", event.target.value)
              }
              className={inputClassName(false)}
            />
          </div>

          <div>
            <label
              htmlFor="child-medical-notes"
              className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              NOTAS MÉDICAS
            </label>
            <textarea
              id="child-medical-notes"
              placeholder="Indicaciones, medicación, contactos…"
              value={form.medicalNotes}
              onChange={(event) =>
                handleFieldChange("medicalNotes", event.target.value)
              }
              className={`${inputClassName(false)} min-h-[90px] resize-y leading-[1.5]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
