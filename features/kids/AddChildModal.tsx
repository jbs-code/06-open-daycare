"use client";

import { ChevronDownIcon } from "@/components/icons";

const ROOM_OPTIONS = ["Soles", "Lunas", "Estrellas"] as const;

interface AddChildModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddChildModal({ open, onClose }: AddChildModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-modal-backdrop px-6 py-10">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-child-title"
        className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-border bg-auth-page shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-border px-[26px] py-5">
          <button
            type="button"
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
              id="child-full-name"
              placeholder="Ej. Martina López"
              className="w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] text-foreground outline-none placeholder:text-placeholder"
            />
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
                id="child-birth-date"
                placeholder="dd/mm/aaaa"
                className="w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] text-foreground outline-none placeholder:text-placeholder"
              />
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
                  id="child-room"
                  defaultValue="Soles"
                  className="w-full appearance-none rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] pr-10 text-[15px] font-bold text-foreground outline-none"
                >
                  {ROOM_OPTIONS.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#B0A290]" />
              </div>
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
              className="w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] text-foreground outline-none placeholder:text-placeholder"
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
              className="min-h-[90px] w-full resize-y rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[13px] text-[15px] leading-[1.5] text-foreground outline-none placeholder:text-placeholder"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
