import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type EssayGuideProps = {
  number: string;
  title: string;
  label: string;
  description: string;
  steps: readonly { title: string; text: string }[];
};

export default function EssayGuide({ number, title, label, description, steps }: EssayGuideProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/writing-task/task2" className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-800"><span aria-hidden>←</span> All essay types</Link>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">{number}</span>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">{label}</span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
        </div>

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
      </section>
    </main>
  );
}