import Link from "next/link";
import Navbar from "@/components/Navbar";

const speakingTips = [
  "Speak with fluency and natural pacing instead of memorizing full answers.",
  "Use connectors like however, in contrast, and on the other hand to sound more natural.",
  "Practice short speaking routines on common IELTS topics every day.",
  "Focus on clear ideas, good examples, and simple but accurate vocabulary.",
];

export default function SpeakingPage() {
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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Speaking</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Speak more clearly and naturally.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Good speaking is about confidence, structure, and clear ideas. This section helps you organize answers and sound more natural.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { title: "Part 1", href: "/speaking/part1" },
            { title: "Part 2", href: "/speaking/part2" },
            { title: "Part 3", href: "/speaking/part3" },
          ].map((part) => (
            <Link
              key={part.title}
              href={part.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
            >
              <div className="text-2xl font-bold text-slate-900">{part.title}</div>
              <p className="mt-2 text-slate-600">Open this speaking section to practice and review.</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 space-y-5">
          {speakingTips.map((tip, index) => (
            <div key={tip} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
                  {index + 1}
                </span>
                <p className="text-lg text-slate-700">{tip}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
