import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function WritingTaskPage() {
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

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { title: "Task 1", href: "/writing-task/task1", desc: "Describe charts, graphs, tables, maps, and processes." },
            { title: "Task 2", href: "/writing-task/task2", desc: "Write structured essays with clear arguments and examples." },
          ].map((part) => (
            <Link
              key={part.title}
              href={part.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
            >
              <div className="text-2xl font-bold text-slate-900">{part.title}</div>
              <p className="mt-2 text-slate-600">{part.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
