import Link from "next/link";

// Formulario del login — réplica de login.dc.html sin el selector de rol
export function LoginForm() {
  return (
    <div>
      <h2 className="mb-[6px] font-fredoka text-[30px] font-semibold text-foreground">
        Iniciar sesión
      </h2>
      <p className="mb-[28px] text-[15px] text-muted-strong">
        Ingresá para ver el día de hoy.
      </p>

      <label
        htmlFor="login-email"
        className="mb-[8px] block text-xs font-bold tracking-[0.7px] text-muted-strong"
      >
        EMAIL
      </label>
      <input
        id="login-email"
        name="email"
        type="email"
        placeholder="tu@email.com"
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white p-[14px] text-[15px] text-foreground placeholder:text-placeholder"
      />

      <label
        htmlFor="login-password"
        className="mb-[8px] block text-xs font-bold tracking-[0.7px] text-muted-strong"
      >
        CONTRASEÑA
      </label>
      <input
        id="login-password"
        name="password"
        type="password"
        placeholder="••••••••"
        className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-field-border bg-white p-[14px] text-[15px] text-foreground placeholder:text-placeholder"
      />

      <div className="mb-[20px] text-right">
        <span className="text-[13.5px] font-bold text-coral-strong">
          ¿Olvidaste tu contraseña?
        </span>
      </div>

      <Link
        href="#"
        className="block w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-[15px] text-center text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
      >
        Iniciar sesión
      </Link>

      <p className="mt-6 text-center text-[14.5px] text-muted-strong">
        ¿Te invitó la guardería?{" "}
        <Link href="#" className="font-extrabold text-coral-strong">
          Activá tu cuenta
        </Link>
      </p>
    </div>
  );
}
