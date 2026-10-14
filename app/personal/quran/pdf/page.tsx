import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import QuranPdfEmbed from "./QuranPdfEmbed";

export const metadata = { title: "Quran PDF | Personal" };

const pdfUrl = "/quran.pdf?v=13";

export default function QuranPdfPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><Link href="/personal/quran" className="font-semibold text-emerald-700">← Quran reader</Link><h1 className="mt-3 text-3xl font-bold text-slate-950">Complete Quran PDF</h1><p className="mt-2 text-slate-600">All 611 unique scans, with a clickable Surah navigation section directly after the cover.</p></div><a href={pdfUrl} download="quran.pdf" className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Download PDF</a></div>
        <QuranPdfEmbed pdfUrl={pdfUrl} />
      </section>
    </main>
  );
}
