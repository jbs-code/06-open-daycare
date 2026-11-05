import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon, SunIcon } from "@/components/icons";
import { AllergyAlert } from "@/features/kids/AllergyAlert";
import { ChildDetailsCard } from "@/features/kids/ChildDetailsCard";
import { ChildProfileHeader } from "@/features/kids/ChildProfileHeader";
import { ParentsCard } from "@/features/kids/ParentsCard";
import { MobileSidebar } from "@/features/sidebar/MobileSidebar";
import { Sidebar } from "@/features/sidebar/Sidebar";
import { children, getChildBySlug } from "@/lib/children";
import { currentUser } from "@/lib/mockData";

// Cache Components (Next 16): los 8 slugs se prerenderizan en build;
// los desconocidos se resuelven en runtime y caen en notFound()
export async function generateStaticParams() {
  return children.map((child) => ({ slug: child.slug }));
}

// Next 16 valida que params esté fuera de <Suspense> para navegaciones
// instantáneas; esta ruta está permitida para bloquear (fix del propio error)
export const instant = false;

interface ChildProfilePageProps {
  params: Promise<{ slug: string }>;
}

// Réplica de references/pantallas/perfil-nino.dc.html
export default async function ChildProfilePage({
  params,
}: ChildProfilePageProps) {
  const { slug } = await params;
  const child = getChildBySlug(slug);
  if (!child) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-page md:flex-row">
      <MobileSidebar user={currentUser} />
      <Sidebar user={currentUser} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[820px] px-10 pt-[34px] pb-20">
          <Link
            href="/kids"
            className="mb-5 flex w-fit items-center gap-[7px] text-sm font-bold text-muted-strong"
          >
            <ChevronLeftIcon className="size-[18px]" />
            Volver a Niños
          </Link>

          <div className="flex flex-wrap items-start gap-[26px]">
            <div className="flex min-w-0 flex-1 flex-col gap-[18px] sm:min-w-[300px]">
              <ChildProfileHeader child={child} />
              {child.allergies && <AllergyAlert text={child.allergies} />}
              <ChildDetailsCard child={child} />
            </div>

            <div className="flex w-full flex-none flex-col gap-[14px] sm:w-[300px]">
              <a
                href="#"
                className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-foreground p-[13px] text-[15px] font-extrabold text-white"
              >
                <SunIcon className="size-[18px]" />
                Resumen del día
              </a>
              <ParentsCard parents={child.parents} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
