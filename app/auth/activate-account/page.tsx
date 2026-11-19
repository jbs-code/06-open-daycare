import { ActivationForm } from "@/features/auth/ActivationForm";

// Réplica de references/pantallas/activar-cuenta.dc.html
export default function ActivateAccountPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-auth-page p-6 lg:p-10">
      <div className="w-full max-w-[440px]">
        <ActivationForm />
      </div>
    </main>
  );
}
