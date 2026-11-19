import { LoginBrandPanel } from "@/features/auth/LoginBrandPanel";
import { LoginForm } from "@/features/auth/LoginForm";

// Réplica de references/pantallas/login.dc.html — sin selector de rol (SPEC 03)
export default function LoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-auth-page lg:grid-cols-[1.05fr_1fr]">
      <LoginBrandPanel />
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-[392px]">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
