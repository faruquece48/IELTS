import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Task2QuestionList from "../Task2QuestionList";

function Slot({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-amber-100 px-1 font-semibold text-amber-900">[{children}]</span>;
}

function Formula({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <p className="mt-2 leading-8 text-slate-700">{children}</p>
    </div>
  );
}

const essayMap = [
  ["Introduction", "Paraphrase the topic + mention both views + state your opinion"],
  ["Body one", "Explain View A + reason + explanation + example + result"],
  ["Body two", "Explain View B + reason + explanation + example + your position"],
  ["Conclusion", "Summarise both views + restate your opinion"],
] as const;

export default function DiscussionPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/writing-task/task2" className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-800">
          <span aria-hidden>←</span> All essay types
        </Link>

        <div className="mt-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-700">02</span>
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Discuss both views</span>
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Discussion</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Present both perspectives fairly, develop each one clearly, and state which view you find more convincing.
          </p>
        </div>

        <article className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sm font-black text-sky-700">01</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Default structure</p>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">Both views + your opinion</h2>
                </div>
              </div>

              <div className="mt-7 space-y-5">
                <Formula title="Introduction">
                  People have different views about whether <Slot>paraphrase View A</Slot> or <Slot>paraphrase View B</Slot>. While both perspectives have merit, I believe that <Slot>your preferred view</Slot> because <Slot>main reason</Slot>.
                </Formula>
                <Formula title="Body 1 — View A">
                  On the one hand, some people believe that <Slot>View A</Slot>. The main reason is that <Slot>reason for View A</Slot>. In other words, <Slot>explanation</Slot>. For example, <Slot>specific example</Slot>. As a result, <Slot>result</Slot>. Therefore, it is understandable why this view is supported.
                </Formula>
                <Formula title="Body 2 — View B + opinion">
                  On the other hand, others argue that <Slot>View B</Slot>. This is because <Slot>reason for View B</Slot>. For instance, <Slot>specific example</Slot>. Consequently, <Slot>result</Slot>. I find this view more convincing because <Slot>why it is stronger</Slot>.
                </Formula>
                <Formula title="Conclusion">
                  In conclusion, although <Slot>brief summary of View A</Slot>, I believe that <Slot>restate your preferred view</Slot> because <Slot>restate the main reason</Slot>.
                </Formula>
              </div>
            </div>

            <div className="border-t border-sky-200 bg-sky-50 p-6 md:p-8 lg:border-l lg:border-t-0">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">Structure example</span>
              <p className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-sky-700">Theme: transport investment</p>
              <div className="mt-4 space-y-4 text-base font-medium leading-7 text-slate-800">
                <p>People have different views about whether governments should invest more in roads or public transport. While improving roads can reduce some immediate traffic problems, I believe that public transport deserves greater investment because it provides a more sustainable long-term solution.</p>
                <p>On the one hand, some people believe that governments should spend more money on roads. The main reason is that wider and better-maintained roads can improve the movement of private vehicles and commercial traffic. In other words, removing bottlenecks may shorten journeys and help businesses transport goods more efficiently. For example, an additional lane on a heavily congested highway can initially reduce delays. As a result, road investment can offer visible short-term benefits, which explains why this view attracts support.</p>
                <p>On the other hand, others argue that public transport should receive more funding. This is because reliable trains and buses can carry large numbers of passengers while using less road space. For instance, commuters may leave their cars at home when affordable and frequent services are available. Consequently, cities can reduce congestion and air pollution at the same time. I find this view more convincing because it addresses the underlying dependence on private cars rather than simply creating more space for them.</p>
                <p>In conclusion, although better roads can improve traffic flow in the short term, I believe that investing in public transport is the stronger approach because it can produce cleaner, less congested and more sustainable cities.</p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-12 rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-300">Essay map</p>
          <h2 className="mt-2 text-2xl font-black">A balanced four-paragraph plan</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {essayMap.map(([title, text], index) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="text-xs font-black text-sky-300">0{index + 1}</span>
                <h3 className="mt-3 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-12" aria-labelledby="discussion-questions-title">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">Practice</p>
            <h2 id="discussion-questions-title" className="mt-2 text-3xl font-black tracking-tight text-slate-950">Questions and answers</h2>
            <p className="mt-2 text-slate-600">Select a question to reveal its planning notes.</p>
          </div>

          <Task2QuestionList>
          <details className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-sky-300 open:ring-2 open:ring-sky-100">
            <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">1.</span>
              <span className="flex-1 font-bold leading-7 text-slate-900">Some university students want to learn about other subjects in addition to their main subjects. Others believe it is more important to give all their time and attention to studying for a qualification. Discuss both views and give your own opinion.</span>
              <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-sky-600 transition-transform group-open:rotate-45">+</span>
            </summary>

            <div className="border-t border-sky-100 bg-sky-50/60 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                  <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-700">Both views; prioritise the main qualification</span>
                </div>
                <div className="contents">
<div className="contents">
                    <div><p className="font-black text-sky-700">View 1: Study other subjects</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>Develops <strong>broader knowledge and transferable skills</strong></li><li>Allows students to <strong>discover new interests</strong></li></ul></div>
                    <div><p className="font-black text-violet-700">View 2: Focus on the qualification</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>Builds <strong>specialist knowledge and expertise</strong></li><li>Prevents extra subjects from <strong>reducing academic performance</strong></li></ul></div>
                  </div>
                </div>
              </div>
            </div>
          </details>

          <details className="group mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-sky-300 open:ring-2 open:ring-sky-100">
            <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">2.</span>
              <span className="flex-1 font-bold leading-7 text-slate-900">Some people say that in the digital age, theatres and cinemas are no longer important as people can watch all the entertainment they want online. Others argue that theatres and cinemas are still important both economically and culturally. Discuss both views and give your own opinion.</span>
              <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-sky-600 transition-transform group-open:rotate-45">+</span>
            </summary>

            <div className="border-t border-sky-100 bg-sky-50/60 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div><h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3><span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-700">Partly agree / Discuss both views</span></div>
                <div className="contents">
<div className="contents">
                    <div><p className="font-black text-sky-700">View 1: Online entertainment</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>More <strong>convenient and affordable</strong></li><li>Offers <strong>unlimited access from home</strong></li></ul></div>
                    <div><p className="font-black text-violet-700">View 2: Theatres and cinemas</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>Support <strong>jobs and local economies</strong></li><li>Preserve <strong>cultural and social experiences</strong></li></ul></div>
                  </div>
                </div>
              </div>
            </div>
          </details>

          <details className="group mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-sky-300 open:ring-2 open:ring-sky-100">
            <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">3.</span>
              <span className="flex-1 font-bold leading-7 text-slate-900">Some people think that competition at work, at school and in daily life is a good thing. Others believe that we should try to cooperate more rather than competing against each other. Discuss both views and give your own opinion.</span>
              <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-sky-600 transition-transform group-open:rotate-45">+</span>
            </summary>

            <div className="border-t border-sky-100 bg-sky-50/60 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div><h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3><span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-700">Partly agree</span></div>
                <div className="contents">
<div className="contents">
                    <div><p className="font-black text-sky-700">View 1: Competition</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>Encourages <strong>hard work and self-improvement</strong></li><li>Can increase <strong>motivation and performance</strong></li></ul></div>
                    <div><p className="font-black text-violet-700">View 2: Cooperation</p><ul className="mt-1 list-disc space-y-1 pl-5"><li>Develops <strong>teamwork and communication</strong></li><li>Helps people achieve <strong>shared goals</strong></li></ul></div>
                  </div>
                </div>
              </div>
            </div>
          </details>
          <details className="group mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-sky-300 open:ring-2 open:ring-sky-100">
            <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">4.</span>
              <span className="flex-1 font-bold leading-7 text-slate-900">In some countries, a few people earn extremely high salaries. Some people think that this is good for a country, while others believe that the government should control salaries and limit the amount people can earn. Discuss both views and give your own opinion.</span>
              <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-sky-600 transition-transform group-open:rotate-45">+</span>
            </summary>

            <div className="border-t border-sky-100 bg-sky-50/60 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                  <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-700">Partly agree</span>
                </div>
                <div>
                  <p className="font-black text-sky-700">View 1: High salaries are beneficial</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                    <li>Attract <strong>highly skilled professionals</strong></li>
                    <li>Encourage <strong>hard work, innovation, and ambition</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="font-black text-violet-700">View 2: Salary limits may be needed</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                    <li>Extremely high incomes can increase <strong>economic inequality</strong></li>
                    <li>Governments should ensure <strong>fair taxation and income distribution</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </details>
          <details className="group mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-sky-300 open:ring-2 open:ring-sky-100">
            <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">5.</span>
              <span className="flex-1 font-bold leading-7 text-slate-900">Some people believe that violence on television and in computer games has a damaging effect on society. Others deny that these factors have any significant influence on people&apos;s behaviour. Discuss both views and give your own opinion.</span>
              <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-sky-600 transition-transform group-open:rotate-45">+</span>
            </summary>

            <div className="border-t border-sky-100 bg-sky-50/60 p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                  <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-700">Partly agree</span>
                </div>
                <div>
                  <p className="font-black text-sky-700">View 1: Harmful effect</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                    <li>Repeated exposure may <strong>normalise aggressive behaviour</strong></li>
                    <li>Children may <strong>imitate violent actions</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="font-black text-violet-700">View 2: Limited influence</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                    <li>Behaviour also depends on <strong>family, education, and personality</strong></li>
                    <li>Most people can <strong>separate fiction from real life</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </details>
          </Task2QuestionList>
        </section>
      </section>
    </main>
  );
}
