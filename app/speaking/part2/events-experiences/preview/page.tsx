import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PrintButton from "../../places/preview/PrintButton";
import { eventCues } from "../eventsData";
import { eventStories } from "../page";
import { eventCardStory } from "../../cardStories";
import "./print.css";

const tones = ["event-amber", "event-sky", "event-rose", "event-violet", "event-emerald"] as const;

export default function EventsPreviewPage() {
  return <main className="min-h-screen bg-slate-100 text-slate-900">
    <header className="event-toolbar sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-2"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <div className="event-toolbar mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-5 py-5"><div><Link href="/speaking/part2/events-experiences" className="text-sm font-bold text-emerald-700">← Back to the 30 cards</Link><p className="mt-1 text-sm text-slate-500">Two A4 landscape pages: the event vocabulary route and five reusable stories.</p></div><PrintButton /></div>
    <div className="event-print-wrap mx-auto max-w-[1500px] px-5 pb-8">
      <section className="event-sheet mx-auto overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl">
        <div className="text-center"><h1 className="text-2xl font-black text-emerald-950">Events & Experiences Vocabulary Route</h1><p className="mt-1 text-xs font-semibold text-slate-500">Thirty cue cards grouped into five reusable event stories</p></div>
        <div className="event-columns mt-4 grid gap-2.5">{eventStories.map((story, storyIndex) => <section key={story.id} className={`event-column rounded-xl border p-3 ${tones[storyIndex]}`}><h2 className="border-b border-current/15 pb-2 text-xs font-black uppercase tracking-wider">{story.title}</h2>{story.ids.map((id) => { const card = eventCues.find((item) => item.id === id)!; return <article key={id} className="event-topic mt-2 border-t border-slate-900/10 pt-2 first:border-0 first:pt-0"><h3 className="text-[10px] font-black leading-tight text-emerald-950">#{id} · {card.question}</h3><ol className="mt-1">{card.vocabulary.map((phrase, index) => <li key={phrase} className="mt-0.5 text-[8px] font-semibold leading-tight text-slate-700"><span className="mr-1 text-emerald-700">{index + 1}.</span>{phrase}</li>)}</ol></article>; })}</section>)}</div>
      </section>
      <section className="event-story-sheet mx-auto mt-8 flex flex-col overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl">
        <div className="event-story-grid grid flex-1 gap-3">{eventStories.map((story, index) => <article key={story.id} className="event-story rounded-xl border border-emerald-200 bg-emerald-50/60 p-4"><div className="flex gap-2"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-800 text-xs font-black text-white">{index + 1}</span><div><h2 className="text-sm font-black text-emerald-950">{story.title}</h2><p className="text-[11px] font-bold text-emerald-700">{story.story}</p></div></div><div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">{story.paragraphs.map(([label, text]) => <p key={label}><strong className="text-emerald-900">{label}:</strong> {text}</p>)}</div></article>)}</div>
      </section>
      {Array.from({ length: 5 }, (_, page) => <section key={page} className="event-card-sheet mx-auto mt-8 overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl"><h1 className="text-center text-xl font-black text-emerald-950">Event card-specific stories · {page * 6 + 1}–{page * 6 + 6}</h1><div className="event-card-grid mt-4 grid grid-cols-2 gap-3">{eventCues.slice(page * 6, page * 6 + 6).map((card) => <article key={card.id} className="event-card-story rounded-xl border border-emerald-200 bg-emerald-50/50 p-3"><h2 className="text-xs font-black text-emerald-950">#{card.id} · {card.question}</h2><div className="mt-2 space-y-1.5 text-[10px] leading-relaxed text-slate-700">{eventCardStory(card).map(([label, text]) => <p key={label}><strong className="text-emerald-900">{label}:</strong> {text}</p>)}</div></article>)}</div></section>)}
    </div>
  </main>;
}
