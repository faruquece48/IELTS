import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const structures = [
  {
    title: "Completely agree",
    style: "border-emerald-200 bg-emerald-50 text-emerald-700",
    intro: <>It is widely argued that <Slot>paraphrased statement</Slot>. I fully agree because <Slot>reason 1</Slot> and <Slot>reason 2</Slot>.</>,
    conclusion: <>In conclusion, I strongly believe that <Slot>restated position</Slot>, as <Slot>reason 1</Slot> and <Slot>reason 2</Slot>.</>,
    question: "Schools should teach children how to manage money.",
    example: "It is widely argued that financial management should be taught at school. I fully agree because it encourages responsible spending and prepares children for adult life.",
  },
  {
    title: "Completely disagree",
    style: "border-rose-200 bg-rose-50 text-rose-700",
    intro: <>It is widely argued that <Slot>paraphrased statement</Slot>. I completely disagree because <Slot>reason 1</Slot> and <Slot>reason 2</Slot>.</>,
    conclusion: <>In conclusion, I firmly reject the idea that <Slot>restated claim</Slot>, mainly because <Slot>reason 1</Slot> and <Slot>reason 2</Slot>.</>,
    question: "Technology has made life more complicated rather than easier.",
    example: "It is often claimed that modern technology has made daily life more complicated. I completely disagree because it saves time and makes essential services easier to access.",
  },
  {
    title: "Partly agree",
    style: "border-violet-200 bg-violet-50 text-violet-700",
    intro: <>Although I accept that <Slot>valid opposing point</Slot>, I believe <Slot>stronger position</Slot> because <Slot>reason 1</Slot> and <Slot>reason 2</Slot>.</>,
    conclusion: <>In conclusion, while <Slot>acknowledgement</Slot>, I remain convinced that <Slot>stronger position</Slot> due to <Slot>reason 1</Slot> and <Slot>reason 2</Slot>.</>,
    question: "Online education will eventually replace classroom teaching.",
    example: "Although online learning is flexible and accessible, I believe classrooms will remain essential because students need direct guidance and meaningful social interaction.",
  },
] as const;

function Slot({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-amber-100 px-1 font-semibold text-amber-900">[{children}]</span>;
}

function Formula({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{title}</p><p className="mt-2 leading-8 text-slate-700">{children}</p></div>;
}

export default function OpinionPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/writing-task/task2" className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-800"><span aria-hidden>←</span> All essay types</Link>
        <div className="mt-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">01</span><span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Agree or disagree</span></div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Opinion</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">Choose one clear position and preview the two ideas you will develop.</p>
        </div>

        <div className="mt-8 space-y-7">
          {structures.map((item, index) => (
            <article key={item.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4"><span className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-black ${item.style}`}>0{index + 1}</span><h2 className="text-2xl font-black text-slate-900">{item.title}</h2></div>
                  <div className="mt-7 space-y-5"><Formula title="Introduction formula">{item.intro}</Formula><Formula title="Conclusion formula">{item.conclusion}</Formula></div>
                </div>
                <div className={`border-t p-6 md:p-8 lg:border-l lg:border-t-0 ${item.style}`}>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">Worked example</span>
                  <p className="mt-5 text-sm font-semibold leading-6">{item.question}</p>
                  <blockquote className="mt-4 border-l-4 border-current pl-5 text-lg font-medium leading-8 text-slate-800">{item.example}</blockquote>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-300">Essay map</p><h2 className="mt-2 text-2xl font-black">A simple four-paragraph plan</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {[["Introduction", "Paraphrase + position + two reasons"], ["Body one", "Reason 1 + explanation + example"], ["Body two", "Reason 2 + explanation + result"], ["Conclusion", "Restate position + reasons"]].map(([title, text], index) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-xs font-black text-violet-300">0{index + 1}</span><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}