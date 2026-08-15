import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const sections = [
  {
    title: "Vocabulary",
    icon: "📘",
    text: "Build your IELTS vocabulary with topic-based words, collocations, and useful expressions for speaking and writing.",
  },
  {
    title: "Speaking",
    icon: "🎤",
    text: "Improve fluency, confidence, and idea development with guided speaking practice and common IELTS prompts.",
  },
  {
    title: "High Frequency Word",
    icon: "✨",
    text: "Strengthen your word bank with essential high-frequency IELTS words that appear across topics and tasks.",
  },
  {
    title: "Writing Task",
    icon: "✍️",
    text: "Practice task structures, paragraphing, grammar accuracy, and strong essay ideas for IELTS writing.",
  },
];

export default function Home() {
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

      <section id="home" className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Personal IELTS growth
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-900 md:text-5xl lg:text-6xl">
              Build strong IELTS skills through daily practice and clear study focus.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              This website is a personal study space for improving vocabulary, speaking confidence, high-frequency words, and writing task performance step by step.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/vocabulary"
                className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Start learning
              </Link>
              <Link
                href="/writing-task"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                Writing task
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Study focus</p>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Vocabulary</span>
                    <span>80%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 w-[80%] rounded-full bg-sky-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Speaking</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 w-[75%] rounded-full bg-sky-500" />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Writing</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 w-[72%] rounded-full bg-sky-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vocabulary" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Vocabulary</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Topic-based learning for stronger IELTS vocabulary.</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {sections.slice(0, 1).map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="speaking" className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Speaking</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Speak naturally and confidently.</h2>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-slate-600">
              Focus on clarity, pronunciation, accurate grammar, and speaking without memorizing full answers. Practice with cue cards, repeated topics, and real speaking routines.
            </p>
          </div>
        </div>
      </section>

      <section id="high-frequency-word" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">High Frequency Word</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Memorize the words that appear again and again.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              "significant",
              "impact",
              "benefit",
              "adapt",
              "challenge",
              "emphasis",
              "crucial",
              "resourceful",
            ].map((word) => (
              <div key={word} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-medium text-slate-800 shadow-sm">
                {word}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="writing-task" className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Writing Task</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Understand the structure and build strong answers.</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sections.slice(1).map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-3xl">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm text-slate-500 lg:px-8">
          <p>© 2026 Personal IELTS Study</p>
          <div className="flex gap-5">
            <Navbar />
          </div>
        </div>
      </footer>
    </main>
  );
}
