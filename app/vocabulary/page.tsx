import Link from "next/link";
import Navbar from "@/components/Navbar";

const topics = [
  "Education and learning",
  "Health and lifestyle",
  "Environment and climate",
  "Technology and innovation",
  "Work and career",
  "Travel and culture",
];

export default function VocabularyPage() {
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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Vocabulary</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Improve your IELTS word power.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Learning vocabulary is not only about memorizing words. It is also about using them naturally in speaking and writing.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {topics.map((topic) => (
            <div key={topic} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="mb-3 text-2xl">📘</div>
              <h2 className="text-xl font-bold text-slate-900">{topic}</h2>
              <p className="mt-2 text-slate-600">
                Learn key terms, collocations, and example sentences for a clear IELTS topic-based vocabulary set.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
