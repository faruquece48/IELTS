import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Part1Page() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">IELTS</p>
              <p className="text-lg font-bold text-slate-900">Personal Study</p>
            </div>
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Speaking / Part 1</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Part 1: Introduction and familiar topics</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Part 1 focuses on everyday life questions. Keep answers natural, clear, and not too long. Use simple but accurate language to sound confident.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            "Describe your hometown or home area.",
            "What kind of music do you enjoy?",
            "Do you prefer to study alone or with others?",
            "What do you usually do in your free time?",
          ].map((question) => (
            <div key={question} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <p className="text-slate-700">{question}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
