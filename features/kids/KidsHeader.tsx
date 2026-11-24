"use client";

import { useState } from "react";

import { PlusIcon } from "@/components/icons";
import { AddChildModal } from "@/features/kids/AddChildModal";

// Encabezado de /kids — réplica de ninos.dc.html
export function KidsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mb-[22px] flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-coral-deep">
            GESTIÓN
          </div>
          <h1 className="font-fredoka text-[30px] font-semibold text-foreground">
            Niños
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex flex-none items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)]"
        >
          <PlusIcon className="size-[17px]" />
          Agregar niño
        </button>
      </div>
      <AddChildModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
