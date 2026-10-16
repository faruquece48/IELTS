import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { placeCues } from "../placesData";
import PrintButton from "./PrintButton";
import "./print.css";

const columns = [
  { title: "Home & village", ids: [9,15,16,24], tone: "bg-amber-50 border-amber-200" },
  { title: "Calm city life", ids: [1,2,4,14,19,21], tone: "bg-sky-50 border-sky-200" },
  { title: "Busy city, work & learning", ids: [6,8,10,23,25,26,27], tone: "bg-violet-50 border-violet-200" },
  { title: "Coast & islands", ids: [3,5,17,18,28,30], tone: "bg-cyan-50 border-cyan-200" },
  { title: "Hills & natural places", ids: [7,11,12,20], tone: "bg-emerald-50 border-emerald-200" },
  { title: "Future & heritage", ids: [13,22,29], tone: "bg-rose-50 border-rose-200" },
];

export default function PlacesPreviewPage() {
  return <main className="min-h-screen bg-slate-100 text-slate-900">
    <header className="place-print-toolbar sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-2"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <div className="place-print-toolbar mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-5 py-5"><div><Link href="/speaking/part2/places" className="text-sm font-bold text-emerald-700">← Back to the 30 topics</Link><p className="mt-1 text-sm text-slate-500">Designed for one A4 landscape page. Select “Save as PDF” as the destination when the PDF window opens.</p></div><PrintButton /></div>
    <div className="place-print-wrap mx-auto max-w-[1500px] px-5 pb-8">
      <section className="place-print-sheet mx-auto overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl">
        <div className="place-print-title text-center"><h1 className="text-2xl font-black tracking-tight text-emerald-950">Places Vocabulary & Phrase Memory Route</h1><p className="mt-1 text-xs font-semibold text-slate-500">Follow the topic numbers from home → city → work → coast → nature → future. Say every phrase from top to bottom.</p></div>
        <div className="place-print-columns mt-4 grid gap-2.5">
          {columns.map((column) => <section key={column.title} className={`place-print-column rounded-xl border p-3 ${column.tone}`}>
            <h2 className="border-b border-current/15 pb-2 text-xs font-black uppercase tracking-wider text-slate-800">{column.title}</h2>
            {column.ids.map((id) => {
              const cue = placeCues.find((item) => item.id === id)!;
              return <article key={id} className="place-print-topic mt-2 border-t border-slate-900/10 pt-2 first:border-0 first:pt-0">
                <h3 className="text-[11px] font-black leading-tight text-emerald-950"><Link href={`/speaking/part2/places#topic-${id}`}>#{id} · {cue.place}</Link></h3>
                <ol className="mt-1">{cue.vocabulary.map((phrase,index) => <li key={phrase} className="mt-0.5 text-[9px] font-semibold leading-tight text-slate-700"><span className="mr-1 text-emerald-700">{index+1}.</span>{phrase}</li>)}</ol>
              </article>;
            })}
          </section>)}
        </div>
      </section>
    </div>
  </main>;
}
