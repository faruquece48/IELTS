import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const topics = [
  {
    title: "Line Graph",
    icon: "📈",
    description: "sample answers describing crime statistics and book sales line charts",
    href: "/writing-task/task1/line-graph",
  },
];

export default function Task1Page() {
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

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Writing task 1</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  {topic.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900">{topic.title}</div>
              </div>
              <p className="text-sm leading-6 text-slate-600">{topic.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
