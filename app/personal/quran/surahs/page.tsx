import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { surahs } from "@/lib/quran";

export const metadata = { title: "Surah Index | Quran Reader" };

export default function SurahIndexPage() {
  return (
    <main className="min-h-screen bg-emerald-50/60 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-emerald-100 bg-white/90 backdrop-blur-sm"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
      <section className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
        <Link href="/personal/quran" className="font-semibold text-emerald-700">← Quran reader</Link>
        <h1 className="mt-4 text-4xl font-bold text-slate-950">All 114 Surahs</h1>
        <p className="mt-3 text-slate-600">Select a Surah to open its starting page in the scanned Quran.</p>
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {surahs.map((surah) => (
            <li key={surah.number}>
              <Link href={`/personal/quran?page=${surah.page}`} className="group flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-800">{surah.number}</span>
                <span className="min-w-0 flex-1"><span className="block font-bold text-slate-900 group-hover:text-emerald-800">{surah.name}</span><span className="text-sm text-slate-500">Page {surah.page}</span></span>
                <span lang="ar" dir="rtl" className="text-xl font-semibold text-slate-800">{surah.arabic}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
