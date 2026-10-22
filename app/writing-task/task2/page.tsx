import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const essayTypes = [
  { title: "Opinion", label: "Agree or disagree", description: "State a clear position and support it with two reasons.", color: "border-violet-200 bg-violet-50 text-violet-700", href: "/writing-task/task2/opinion" },
  { title: "Discussion", label: "Discuss both views", description: "Examine both perspectives, then give your own view.", color: "border-sky-200 bg-sky-50 text-sky-700", href: "/writing-task/task2/discussion" },
  { title: "Multi Part", label: "Two-part question", description: "Answer every question directly and balance the response.", color: "border-emerald-200 bg-emerald-50 text-emerald-700", href: "/writing-task/task2/multi-part" },
  { title: "Cause and Solution", label: "Problems and solutions", description: "Explain the causes and suggest practical solutions.", color: "border-amber-200 bg-amber-50 text-amber-700", href: "/writing-task/task2/cause-and-solution" },
  { title: "Advantages and Disadvantages", label: "Benefits and drawbacks", description: "Compare both sides with specific support.", color: "border-rose-200 bg-rose-50 text-rose-700", href: "/writing-task/task2/advantages-and-disadvantages" },
  { title: "Positive and Negative", label: "Development or trend", description: "Decide whether a change is mainly helpful or harmful.", color: "border-cyan-200 bg-cyan-50 text-cyan-700", href: "/writing-task/task2/positive-and-negative" },
];

export default function Task2Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex justify-end"><Link href="/writing-task/task2/preview" className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-violet-700">Common A4 preview & PDF</Link></div>
        <nav aria-label="Essay types" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {essayTypes.map((type, index) => (
            <Link key={type.title} href={type.href} className="group flex min-h-52 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${type.color}`}>{type.label}</span>
                <span className="text-sm font-black text-slate-300">0{index + 1}</span>
              </div>
              <h1 className="mt-8 text-2xl font-black text-slate-900 transition group-hover:text-violet-700">{type.title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{type.description}</p>
              <span className="mt-auto pt-5 text-sm font-bold text-violet-600">Open guide <span aria-hidden>→</span></span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
