import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import QuranReader from "./QuranReader";
import { QURAN_FIRST_PAGE, QURAN_LAST_PAGE } from "@/lib/quran";

export const metadata = { title: "Quran Reader | Personal" };

export default async function QuranPage({ searchParams }: PageProps<"/personal/quran">) {
  const rawPage = Number((await searchParams).page);
  const initialPage = Number.isInteger(rawPage) && rawPage >= QURAN_FIRST_PAGE && rawPage <= QURAN_LAST_PAGE ? rawPage : QURAN_FIRST_PAGE;

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized /></Link>
          <Navbar />
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:h-[calc(100svh-77px)] md:py-4 lg:px-8">
        <QuranReader initialPage={initialPage} />
      </div>
    </main>
  );
}
