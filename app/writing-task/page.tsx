import Link from "next/link";
import Navbar from "@/components/Navbar";

const writingSteps = [
  "Understand the task question before planning your answer.",
  "Write a clear introduction that directly responds to the prompt.",
  "Use topic-related vocabulary and examples to support your ideas.",
  "End with a short conclusion or final opinion when needed.",
];

export default function WritingTaskPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">
              I
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">IELTS</p>
              <p className="text-lg font-bold text-slate-900">Personal Study</p>
            </div>
          </div>

          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Writing task</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Plan clearly and write with purpose.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          IELTS writing improves through better structure, strong examples, and accurate grammar. Follow a simple pattern and keep your ideas focused.
        </p>

        <div className="mt-10 space-y-5">
          {writingSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
                  {index + 1}
                </span>
                <p className="text-lg text-slate-700">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
