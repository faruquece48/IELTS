"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import "./print.css";

const sources = [
  ["Opinion", "/writing-task/task2/opinion"],
  ["Discussion", "/writing-task/task2/discussion"],
  ["Multi Part", "/writing-task/task2/multi-part"],
  ["Cause and Solution", "/writing-task/task2/cause-and-solution"],
  ["Advantages and Disadvantages", "/writing-task/task2/advantages-and-disadvantages"],
  ["Positive and Negative", "/writing-task/task2/positive-and-negative"],
] as const;

type Guide = {
  title: string;
  structureHtml: string[];
  questionsHtml: string[];
};

function prepareCopy(element: Element) {
  const copy = element.cloneNode(true) as HTMLElement;
  copy.querySelectorAll("[hidden]").forEach((item) => item.removeAttribute("hidden"));
  copy.querySelectorAll("details").forEach((details) => {
    details.open = true;
    details.removeAttribute("name");
  });
  if (copy instanceof HTMLDetailsElement) {
    copy.open = true;
    copy.removeAttribute("name");
  }
  return copy.outerHTML;
}

export default function Task2PreviewPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all(sources.map(async ([title, path]) => {
      const html = await fetch(path).then((response) => response.text());
      const document = new DOMParser().parseFromString(html, "text/html");
      const practiceSection = [...document.querySelectorAll("section")].find((section) => section.querySelector("details"));
      const structureHtml = [...document.querySelectorAll("main article")]
        .filter((article) => !practiceSection?.contains(article))
        .map(prepareCopy);
      const questionsHtml = practiceSection
        ? [...practiceSection.querySelectorAll(":scope details")].map(prepareCopy)
        : [];
      return { title, structureHtml, questionsHtml };
    })).then((result) => { if (active) setGuides(result); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <main className="min-h-screen bg-slate-100 text-slate-900">
    <header className="task2-toolbar sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <div className="task2-toolbar mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6"><div><Link href="/writing-task/task2" className="text-sm font-bold text-violet-700">← Back to Writing Task 2</Link><h1 className="mt-2 text-3xl font-black">Task 2 Common A4 Preview</h1><p className="mt-1 text-sm text-slate-600">The actual structures, worked examples, questions, and side-by-side planning hints from all six guides.</p></div><button type="button" disabled={loading} onClick={() => window.print()} className="rounded-xl bg-violet-700 px-5 py-3 text-sm font-black text-white shadow-sm disabled:cursor-wait disabled:opacity-50">{loading ? "Preparing full guide…" : "Save as PDF"}</button></div>

    <article className="task2-document mx-auto max-w-6xl bg-white px-5 py-8 shadow-xl sm:px-8 lg:px-12">
      <header className="task2-print-heading border-b-2 border-violet-700 pb-5 text-center"><p className="text-xs font-black uppercase tracking-[.22em] text-violet-700">IELTS Writing Task 2</p><h1 className="mt-1 text-3xl font-black">Complete Structures, Examples & Planning Hints</h1></header>
      {loading && <p className="mt-8 rounded-xl bg-amber-50 p-5 text-center font-bold text-amber-900">Collecting the complete content from all six essay guides…</p>}
      <div className="space-y-14">{guides.map((guide, guideIndex) => <section key={guide.title} className="task2-guide pt-8">
        <header className="task2-guide-heading mb-5 flex items-center gap-3 border-b border-slate-300 pb-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-700 text-sm font-black text-white">{guideIndex + 1}</span><div><p className="text-xs font-black uppercase tracking-wider text-violet-700">Essay type</p><h2 className="text-2xl font-black">{guide.title}</h2></div></header>
        <div className="task2-actual-structures space-y-5">{guide.structureHtml.map((html, index) => <div key={index} className="task2-structure-copy" dangerouslySetInnerHTML={{ __html: html }} />)}</div>
        <section className="task2-question-section mt-8"><h3 className="mb-4 text-xl font-black text-slate-950">Questions and answer-planning hints <span className="text-sm text-slate-400">({guide.questionsHtml.length})</span></h3>{guide.questionsHtml.length ? <div className="space-y-4">{guide.questionsHtml.map((html, index) => <div key={index} className="task2-question-copy" dangerouslySetInnerHTML={{ __html: html }} />)}</div> : <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">No practice questions have been added to this guide yet.</p>}</section>
      </section>)}</div>
    </article>
  </main>;
}
