"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PrintButton from "../../part2/places/preview/PrintButton";
import { qaList } from "../page";
import "./print.css";

export default function Part3PreviewPage() {
  return <main className="min-h-screen bg-slate-100 text-slate-900">
    <header className="part3-toolbar sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <div className="part3-toolbar mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6"><div><Link href="/speaking/part3" className="text-sm font-bold text-sky-700">← Back to Speaking Part 3</Link><h1 className="mt-2 text-3xl font-black text-slate-950">Part 3 Questions & Answers</h1><p className="mt-1 text-sm text-slate-600">All {qaList.length} questions and model answers in one printable document.</p></div><PrintButton /></div>
    <article className="part3-document mx-auto max-w-6xl bg-white px-5 py-8 shadow-xl sm:px-8 lg:px-12">
      <div className="part3-print-heading mb-8 border-b-2 border-sky-700 pb-4 text-center"><p className="text-xs font-black uppercase tracking-[.22em] text-sky-700">IELTS Speaking</p><h1 className="mt-1 text-3xl font-black text-slate-950">Part 3 Questions & Model Answers</h1><p className="mt-2 text-sm text-slate-500">Complete revision collection · {qaList.length} questions</p></div>
      <div className="part3-list space-y-4">{qaList.map((item, index) => <section key={item.question} className="part3-answer rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-700 text-xs font-black text-white">{index + 1}</span><div><h2 className="font-black leading-6 text-slate-950">{item.question}</h2><p className="mt-3 leading-7 text-slate-700"><strong className="mr-1 text-sky-800">Answer:</strong>{item.answer}</p></div></div></section>)}</div>
    </article>
  </main>;
}
