import Image from "next/image";
import Navbar from "@/components/Navbar";

const sentences = [
  "I foresee a blended approach combining both methods becoming the norm.",
  "This keeps their minds engaged and gives them a sense of purpose.",
  "Therefore, these skills will allow individuals to react, respond to crises, and save themselves and others.",
  "They capture these moments and then, way down the line, they can flick back through them and relive exactly what was happening at that time",
  "Honestly, it's a way to freeze a split second and make it last forever, even when the actual moment's long gone.",
  "The more you practice, the better you get.",
];

export default function SentencePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={60}
              height={60}
              className="rounded-full"
              unoptimized
            />
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">        
        <h1 className="mt-2 text-4xl font-bold text-sky-600">Sentence library</h1>

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
