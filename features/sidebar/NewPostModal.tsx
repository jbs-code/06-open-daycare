"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ImageIcon, PlusIcon } from "@/components/icons";

const RECIPIENTS = [
  { id: "mateo", name: "Mateo", initial: "M", bg: "#A9D9E8", ink: "#1F7A93" },
  { id: "sofia", name: "Sofía", initial: "S", bg: "#F4B8CC", ink: "#C44A7A" },
  {
    id: "benjamin",
    name: "Benjamín",
    initial: "B",
    bg: "#B9DEC4",
    ink: "#3E8B62",
  },
] as const;

type RecipientId = (typeof RECIPIENTS)[number]["id"];

const POST_TYPES = [
  "Comida",
  "Siesta",
  "Actividad",
  "Logro",
  "Ánimo",
  "Foto",
  "Anuncio",
] as const;

type PostType = (typeof POST_TYPES)[number];

const POST_TYPE_COLORS: Record<PostType, string> = {
  Comida: "bg-meal text-white",
  Siesta: "bg-nap-soft text-nap",
  Actividad: "bg-activity text-white",
  Logro: "bg-achievement-soft text-achievement",
  Ánimo: "bg-mood-soft text-mood",
  Foto: "bg-photo-type-soft text-photo-type",
  Anuncio: "bg-announcement-soft text-announcement",
};

const INITIAL_DESCRIPTION =
  "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón.";

interface NewPostModalProps {
  open: boolean;
  onClose: () => void;
}

function recipientClassName(selected: boolean): string {
  return `flex items-center gap-2 rounded-full border-[1.5px] py-[6px] pr-[14px] pl-[6px] text-[14px] font-bold ${
    selected
      ? "border-foreground bg-foreground text-white"
      : "border-border bg-surface text-nav"
  }`;
}

function roomClassName(selected: boolean): string {
  return `rounded-full border-[1.5px] px-4 py-[6px] text-[14px] font-bold ${
    selected
      ? "border-foreground bg-foreground text-white"
      : "border-border bg-surface text-nav"
  }`;
}

// Réplica de references/pantallas/crear-publicacion.dc.html
export function NewPostModal({ open, onClose }: NewPostModalProps) {
  const [selectedChildren, setSelectedChildren] = useState<RecipientId[]>([]);
  const [wholeRoom, setWholeRoom] = useState(false);
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [description, setDescription] = useState(INITIAL_DESCRIPTION);

  const firstRecipientRef = useRef<HTMLButtonElement>(null);

  const closeAndReset = useCallback(() => {
    setSelectedChildren([]);
    setWholeRoom(false);
    setSelectedType(null);
    setDescription(INITIAL_DESCRIPTION);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    firstRecipientRef.current?.focus();

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

  const toggleChild = useCallback((id: RecipientId) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((childId) => childId !== id) : [...prev, id],
    );
    setWholeRoom(false);
  }, []);

  const selectWholeRoom = useCallback(() => {
    setSelectedChildren([]);
    setWholeRoom(true);
  }, []);

  if (!open || typeof document === "undefined") return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeAndReset();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-modal-backdrop px-6 py-10"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-title"
        className="w-full max-w-[580px] overflow-hidden rounded-[24px] border border-border bg-auth-page shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <header className="flex items-center justify-between border-b border-border px-[26px] py-5">
          <button
            type="button"
            onClick={closeAndReset}
            className="text-[15px] font-bold text-muted-strong"
          >
            Cancelar
          </button>
          <h2
            id="new-post-title"
            className="whitespace-nowrap font-fredoka text-[18px] font-semibold text-foreground"
          >
            Nueva publicación
          </h2>
          <button
            type="button"
            onClick={closeAndReset}
            className="text-[15px] font-extrabold text-coral-deep"
          >
            Publicar
          </button>
        </header>

        <div className="px-6 py-6 sm:px-[26px]">
          <section className="mb-[22px]">
            <div
              id="new-post-recipients-label"
              className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              PARA
            </div>
            <div
              role="group"
              aria-labelledby="new-post-recipients-label"
              className="flex flex-wrap gap-[9px]"
            >
              {RECIPIENTS.map((recipient, index) => {
                const selected = selectedChildren.includes(recipient.id);

                return (
                  <button
                    key={recipient.id}
                    ref={index === 0 ? firstRecipientRef : undefined}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleChild(recipient.id)}
                    className={recipientClassName(selected)}
                  >
                    <span
                      className="flex size-[26px] items-center justify-center rounded-full font-fredoka text-[13px] font-semibold"
                      style={{ backgroundColor: recipient.bg, color: recipient.ink }}
                    >
                      {recipient.initial}
                    </span>
                    {recipient.name}
                  </button>
                );
              })}
              <button
                type="button"
                aria-pressed={wholeRoom}
                onClick={selectWholeRoom}
                className={roomClassName(wholeRoom)}
              >
                Toda la sala
              </button>
            </div>
          </section>

          <section className="mb-[22px]">
            <div
              id="new-post-types-label"
              className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              TIPO
            </div>
            <div
              role="group"
              aria-labelledby="new-post-types-label"
              className="flex flex-wrap gap-[9px]"
            >
              {POST_TYPES.map((type) => {
                const selected = selectedType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedType(type)}
                    className={`rounded-full border-none px-4 py-2 text-[13.5px] font-extrabold ${POST_TYPE_COLORS[type]} ${
                      selected
                        ? "ring-2 ring-foreground/70 ring-offset-2 ring-offset-auth-page"
                        : ""
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mb-[22px]">
            <label
              htmlFor="new-post-description"
              className="mb-[10px] block text-[12px] font-extrabold tracking-[0.7px] text-muted-strong"
            >
              DESCRIPCIÓN
            </label>
            <textarea
              id="new-post-description"
              placeholder="Contá cómo le fue hoy…"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] leading-[1.5] text-foreground outline-none placeholder:text-placeholder"
            />
          </section>

          <section>
            <div className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-muted-strong">
              FOTOS
            </div>
            <div className="flex gap-3">
              <div className="flex size-24 items-center justify-center rounded-[14px] border border-border bg-surface-sunken text-photo-ink">
                <ImageIcon className="size-[26px]" />
              </div>
              <div className="flex size-24 flex-col items-center justify-center gap-[6px] rounded-[14px] border-[1.5px] border-dashed border-photo-border bg-surface-sunken text-photo-ink">
                <PlusIcon className="size-[22px] text-coral-strong" />
                <span className="text-[12px]">Agregar</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
