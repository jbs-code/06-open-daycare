import { CheckIcon, SunIcon } from "@/components/icons";
import { ActivationInviteCard } from "@/features/auth/ActivationInviteCard";

// Formulario de activación — réplica de activar-cuenta.dc.html
export function ActivationForm() {
  return (
    <div>
      <div className="mb-[22px] flex size-[58px] items-center justify-center rounded-[18px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] shadow-[0_12px_26px_-10px_rgba(238,129,100,0.65)]">
        <SunIcon className="size-[30px] text-white" />
      </div>

      <h1 className="mb-[8px] font-fredoka text-[32px] font-semibold leading-[1.15] text-foreground">
        Bienvenida a OpenDayCare
      </h1>
      <p className="mb-[26px] text-[15.5px] leading-[1.55] text-muted-strong">
        Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
      </p>

      <ActivationInviteCard />

      <label
        htmlFor="activation-code"
        className="mb-[8px] block text-xs font-bold tracking-[0.7px] text-muted-strong"
      >
        CÓDIGO DE INVITACIÓN
      </label>
      <input
        id="activation-code"
        name="code"
        defaultValue="7K4P9"
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] font-fredoka text-[18px] font-bold tracking-[3px] text-foreground"
      />

      <label
        htmlFor="activation-email"
        className="mb-[8px] block text-xs font-bold tracking-[0.7px] text-muted-strong"
      >
        EMAIL
      </label>
      <input
        id="activation-email"
        name="email"
        type="email"
        defaultValue="lucia.fernandez@gmail.com"
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white px-4 py-[14px] text-[15px] text-foreground"
      />

      <label
        htmlFor="activation-password"
        className="mb-[8px] block text-xs font-bold tracking-[0.7px] text-muted-strong"
      >
        CREAR CONTRASEÑA
      </label>
      <input
        id="activation-password"
        name="password"
        type="password"
        defaultValue="contraseña"
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#F2A78E] bg-white px-4 py-[14px] text-[15px] text-foreground"
      />

      <label className="mb-[24px] flex cursor-pointer items-start gap-3 rounded-[14px] bg-consent-bg px-4 py-[14px]">
        <input type="checkbox" name="authorization" defaultChecked className="sr-only" />
        <span className="mt-px flex size-6 flex-none items-center justify-center rounded-[8px] bg-consent-check text-white">
          <CheckIcon className="size-[15px]" />
        </span>
        <span className="text-[14px] leading-[1.45] text-consent-ink">
          Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.
        </span>
      </label>

      <a
        href="#"
        className="block w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-center text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
      >
        Activar mi cuenta
      </a>

      <p className="mt-[22px] text-center text-[14.5px] text-muted-strong">
        ¿Ya tenés cuenta?{" "}
        <a href="#" className="font-extrabold text-coral-strong">
          Iniciar sesión
        </a>
      </p>
    </div>
  );
}
