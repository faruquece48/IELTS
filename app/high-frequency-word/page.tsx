import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const words = [
  "significant",
  "impact",
  "benefit",
  "adapt",
  "challenge",
  "emphasis",
  "crucial",
  "resourceful",
  "efficient",
  "relevant",
];

export default function HighFrequencyWordPage() {
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

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">High Frequency Word</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Learn the words that help in every IELTS task.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Repeating high-frequency IELTS words improves vocabulary accuracy and helps you write and speak with more flexibility.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {words.map((word) => (
            <div key={word} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-lg font-medium text-slate-800 shadow-sm">
              {word}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
