import { SunIcon } from "@/components/icons";

// Panel de marca del login — réplica de login.dc.html
export function LoginBrandPanel() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)] px-6 py-10 text-white lg:px-[60px] lg:py-14">
      <div className="absolute -top-[140px] -right-[120px] size-[420px] rounded-full bg-white/[.12]" />
      <div className="absolute -bottom-[110px] -left-[80px] size-[300px] rounded-full bg-white/10" />

      <div className="relative flex items-center gap-[13px]">
        <div className="flex size-[46px] items-center justify-center rounded-[14px] bg-white/[.22]">
          <SunIcon className="size-[26px]" />
        </div>
        <span className="font-fredoka text-[21px] font-semibold tracking-[0.5px]">
          OpenDayCare
        </span>
      </div>

      <div className="relative">
        <h1 className="mb-[18px] font-fredoka text-[30px] font-semibold leading-[1.12] lg:text-[42px]">
          El día de cada niño,
          <br />
          compartido con su familia.
        </h1>
        <p className="max-w-[430px] text-[15px] leading-[1.6] text-white/[.92] lg:text-[17px]">
          Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar.
        </p>
      </div>

      <div className="relative text-sm text-white/90">🌿 Guardería Sala Soles</div>
    </div>
  );
}
