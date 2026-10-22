import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Task2QuestionList from "../Task2QuestionList";
import { StructureBlock } from "../EssayGuide";

const steps = [
  { title: "Introduction", text: "Paraphrase the topic and give a brief answer to both questions." },
  { title: "Body one", text: "Explain the value of long holidays with support and an example." },
  { title: "Body two", text: "Present the arguments for shorter holidays with support and an example." },
  { title: "Conclusion", text: "Summarise both answers without adding a new idea." },
] as const;

const formulas = [
  { title: "Introduction", text: "[Paraphrase the topic]. [Direct answer to Question 1], while [direct answer to Question 2]." },
  { title: "Body 1 — Answer Question 1", text: "The main [value / reason / cause] is [Answer 1]. This is because [explanation]. For example, [specific example]. As a result, [result that directly answers Question 1]." },
  { title: "Body 2 — Answer Question 2", text: "Regarding the second question, [Answer 2]. In other words, [explanation]. For instance, [specific example]. Therefore, [result that directly answers Question 2]." },
  { title: "Conclusion", text: "In conclusion, [summarise the answer to Question 1], while [summarise the answer to Question 2]." },
] as const;

const example = [
  "Many primary and secondary schools close for an extended summer break. Long holidays are valuable because they give pupils time to recover and be with their families, while shorter holidays are beneficial because they prevent learning loss and preserve a consistent study routine.",
  "The main value of long school holidays is that they give children enough time to rest physically and mentally after an intensive school year. This is because a lengthy break provides time to recover and allows families to travel together without conflicting with lessons. For example, parents can arrange longer visits to relatives or educational trips during this period. As a result, students can return to school refreshed and more motivated.",
  "Regarding the second question, the main argument for shorter school holidays is that they protect students’ knowledge and study habits. In other words, spending less time away from structured learning makes pupils less likely to forget important material or require weeks of revision after returning. For instance, a balanced calendar could replace one lengthy summer holiday with shorter, more frequent breaks. Therefore, pupils can maintain continuity in their studies while still having regular opportunities to rest.",
  "In conclusion, long holidays provide valuable recovery and family time, while shorter holidays reduce learning loss and help students maintain discipline throughout the year.",
] as const;

export default function MultiPartPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/writing-task/task2" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-800"><span aria-hidden>←</span> All essay types</Link>
        <div className="mt-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">03</span><span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Two-part question</span></div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Multi Part</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">Answer every part of the prompt clearly and give both questions equal attention.</p>
        </div>

        <StructureBlock structureTitle="Answer each question separately in its own body paragraph" formulas={formulas} exampleTheme="long and short school holidays" example={example} />

        <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">Essay map</p>
          <h2 className="mt-2 text-2xl font-black">A balanced four-paragraph plan</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-xs font-black text-emerald-300">0{index + 1}</span><h3 className="mt-3 font-bold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p></article>
            ))}
          </div>
        </div>

        <section className="mt-12" aria-labelledby="multi-part-questions-title">
          <div className="mb-6"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">Practice</p><h2 id="multi-part-questions-title" className="mt-2 text-3xl font-black tracking-tight text-slate-950">Questions and answers</h2><p className="mt-2 text-slate-600">Select a question to reveal its planning notes.</p></div>

          <Task2QuestionList>
          <details className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-emerald-300 open:ring-2 open:ring-emerald-100">
            <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-700">1.</span>
              <span className="flex-1 font-bold leading-7 text-slate-900">In many countries, primary and secondary schools close for two months or more in summer holidays. What is the value of long holidays? What are the arguments in favor of shorter school holidays?</span>
              <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-emerald-600 transition-transform group-open:rotate-45">+</span>
            </summary>

            <div className="border-t border-emerald-100 bg-emerald-50/60 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div><h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Approach</h3><span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Answer both questions directly</span></div>
                <div><p className="font-black text-emerald-700">Question 1: Value of long holidays</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>Give students <strong>time to rest and recover</strong></li><li>Allow more <strong>family time and travel</strong></li></ul></div>
                <div><p className="font-black text-violet-700">Question 2: Case for shorter holidays</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>Prevent <strong>learning loss</strong></li><li>Maintain <strong>study routine and discipline</strong></li></ul></div>
              </div>
            </div>
          </details>
          </Task2QuestionList>
        </section>
      </section>
    </main>
  );
}
