import Image from "next/image";
import Navbar from "@/components/Navbar";

const sentences = [
  "I foresee a blended approach combining both methods becoming the norm.",
  "This keeps their minds engaged and gives them a sense of purpose.",
  "Therefore, these skills will allow individuals to react, respond to crises, and save themselves and others.",
];

export default function SentencePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={80}
              height={80}
              className="rounded-full"
              unoptimized
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">IELTS</p>
              <p className="text-lg font-bold text-slate-900">Personal Study</p>
            </div>
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
          Sentence library
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Sentence</h1>

        <ol className="mt-10 space-y-4">
          {sentences.map((sentence, index) => (
            <li
              key={sentence}
              className="flex gap-4 rounded-2xl border border-sky-100 bg-sky-50/60 px-5 py-4 text-lg leading-relaxed text-slate-700 shadow-sm"
            >
              <span className="font-bold text-sky-700">{index + 1}.</span>
              <span>{sentence}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
