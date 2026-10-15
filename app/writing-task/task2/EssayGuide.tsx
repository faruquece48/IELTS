import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Task2QuestionList from "./Task2QuestionList";

type EssayGuideProps = {
  number: string;
  title: string;
  label: string;
  description: string;
  steps: readonly { title: string; text: string }[];
  structureTitle: string;
  formulas: readonly { title: string; text: string }[];
  exampleTheme: string;
  example: readonly string[];
};

function TemplateText({ text }: { text: string }) {
  return text.split(/(\[[^\]]+\])/g).map((part, index) => part.startsWith("[") && part.endsWith("]")
    ? <span key={index} className="rounded bg-amber-100 px-1 font-semibold text-amber-900">{part}</span>
    : part);
}

export function StructureBlock({ structureTitle, formulas, exampleTheme, example }: Pick<EssayGuideProps, "structureTitle" | "formulas" | "exampleTheme" | "example">) {
  return (
    <article className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-sm font-black text-violet-700">01</span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Default structure</p><h2 className="mt-1 text-2xl font-black text-slate-900">{structureTitle}</h2></div></div>
          <div className="mt-7 space-y-5">
            {formulas.map((formula) => <div key={formula.title}><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{formula.title}</p><p className="mt-2 leading-8 text-slate-700"><TemplateText text={formula.text} /></p></div>)}
          </div>
        </div>
        <div className="border-t border-violet-200 bg-violet-50 p-6 md:p-8 lg:border-l lg:border-t-0">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">Worked example</span>
          <p className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-violet-700">Theme: {exampleTheme}</p>
          <div className="mt-4 space-y-4 text-base font-medium leading-7 text-slate-800">{example.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        </div>
      </div>
    </article>
  );
}

export default function EssayGuide({ number, title, label, description, steps, structureTitle, formulas, exampleTheme, example }: EssayGuideProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/writing-task/task2" className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-800"><span aria-hidden>←</span> All essay types</Link>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">{number}</span>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">{label}</span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        </div>

        <StructureBlock structureTitle={structureTitle} formulas={formulas} exampleTheme={exampleTheme} example={example} />

        <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-300">Essay map</p>
          <h2 className="mt-2 text-2xl font-black">A clear four-paragraph plan</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="text-xs font-black text-violet-300">0{index + 1}</span>
                <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.text}</p>
              </article>
            ))}
          </div>
        </div>

        <section className="mt-12" aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-questions-title`}>
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">Practice</p>
            <h2 id={`${title.toLowerCase().replaceAll(" ", "-")}-questions-title`} className="mt-2 text-3xl font-black tracking-tight text-slate-950">Questions and answers</h2>
            <p className="mt-2 text-slate-600">Select a question to reveal its planning notes.</p>
          </div>
          <Task2QuestionList />
        </section>
      </section>
    </main>
  );
}
