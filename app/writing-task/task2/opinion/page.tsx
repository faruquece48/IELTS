"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const structures = [
  {
    title: "Completely agree",
    style: "border-emerald-200 bg-emerald-50 text-emerald-700",
    intro: <>It is often argued that <Slot>paraphrase</Slot>. I completely agree with this view, primarily because <Slot>R1</Slot> and <Slot>R2</Slot>.</>,
    body1: <>The first and most important reason why I support this view is that <Slot>R1</Slot>. This is because <Slot>explanation</Slot>. For example, <Slot>example</Slot>. As a result, <Slot>result</Slot>. Therefore, it is clear that <Slot>connection to opinion</Slot>.</>,
    body2: <>Another compelling reason for agreeing with this view is that <Slot>R2</Slot>. In other words, <Slot>explanation</Slot>. For instance, <Slot>example</Slot>. Consequently, <Slot>result</Slot>. For this reason, <Slot>connection to opinion</Slot>.</>,
    conclusion: <>In conclusion, I firmly believe that <Slot>restate your position</Slot>, mainly because <Slot>R1</Slot> and <Slot>R2</Slot>.</>,
    question: "The working week should be shorter, and workers should have a longer weekend. Do you agree or disagree?",
    example: <>
      <p>It is often argued that the working week should be reduced so that employees can enjoy a longer weekend. I completely agree with this view, primarily because a shorter working week can improve employees’ productivity and promote a healthier work-life balance.</p>
      <p>The first and most important reason why I support this view is that reducing the number of working days can increase productivity. This is because employees who receive enough time to rest are more likely to return to work feeling refreshed and focused. For example, workers with three days off can recover from work-related stress and prepare themselves mentally for the following week. As a result, they may complete their tasks more efficiently and make fewer mistakes. Therefore, it is clear that a shorter working week can benefit both employees and employers.</p>
      <p>Another compelling reason for agreeing with this view is that a longer weekend can help workers maintain a better work-life balance. In other words, they would have more time to spend with their families, pursue personal interests, and take care of their physical and mental well-being. For instance, parents could spend additional time with their children instead of being occupied with work for most of the week. Consequently, employees may experience less stress and greater satisfaction. For this reason, longer weekends can improve their quality of life.</p>
      <p>In conclusion, I firmly believe that the working week should be shorter and employees should have a longer weekend, mainly because this arrangement can increase workplace productivity and help workers achieve a healthier balance between their professional and personal lives.</p>
    </>,
  },
  {
    title: "Completely disagree",
    style: "border-rose-200 bg-rose-50 text-rose-700",
    intro: <>It is often argued that <Slot>paraphrase the statement</Slot>. I completely disagree with this view, primarily because <Slot>Reason 1</Slot> and <Slot>Reason 2</Slot>.</>,
    body1: <>The first and most important reason why I oppose this view is that <Slot>R1</Slot>. This is because <Slot>explanation</Slot>. For example, <Slot>example</Slot>. As a result, <Slot>result</Slot>. Therefore, <Slot>connection to your opinion</Slot>.</>,
    body2: <>Another compelling reason for disagreeing with this view is that <Slot>R2</Slot>. In other words, <Slot>explanation</Slot>. For instance, <Slot>example</Slot>. Consequently, <Slot>result</Slot>. For this reason, <Slot>connection to opinion</Slot>.</>,
    conclusion: <>In conclusion, I firmly disagree with the view that <Slot>restate claim</Slot>, mainly because <Slot>R1</Slot> and <Slot>R2</Slot>.</>,
    question: "It is a natural process for animal species to become extinct. There is no reason why people should try to prevent this from happening. Do you agree or disagree?",
    example: <>
      <p>It is often argued that the extinction of animal species is a natural process and that humans should not attempt to prevent it. I completely disagree with this view, primarily because many modern extinctions are caused by human activities and the loss of species can seriously damage natural ecosystems.</p>
      <p>The first and most important reason why I oppose this view is that human actions are responsible for the decline of many animal populations. Activities such as deforestation, hunting, pollution and urban expansion destroy natural habitats and reduce the ability of wildlife to survive. For example, when forests are cleared for agriculture or construction, countless species lose their sources of food and shelter. As a result, animals may become endangered or disappear entirely. Therefore, people have a responsibility to protect species that are threatened by human behaviour.</p>
      <p>Another compelling reason for disagreeing with this view is that every species plays a role in maintaining ecological balance. In other words, the disappearance of one animal can affect food chains and create problems for other plants and animals. For instance, if an important predator becomes extinct, the population of its prey may grow uncontrollably and place greater pressure on vegetation. Consequently, the entire ecosystem may become unstable. For this reason, protecting endangered species is essential for preserving biodiversity and environmental stability.</p>
      <p>In conclusion, I firmly disagree with the view that humans should simply allow animal species to become extinct, mainly because human activities are contributing to extinction and the disappearance of species can seriously disrupt ecosystems.</p>
    </>,
  },
  {
    title: "Partly agree",
    style: "border-violet-200 bg-violet-50 text-violet-700",
    intro: <>It is often argued that <Slot>paraphrase the statement</Slot>. While I acknowledge that <Slot>the side you partly agree with</Slot>, I believe that <Slot>your stronger position</Slot>, primarily because <Slot>Reason 1</Slot> and <Slot>Reason 2</Slot>.</>,
    body1: <>On the one hand, it is understandable why some people believe that <Slot>accepted view</Slot>. One important reason is that <Slot>Reason 1</Slot>. This is because <Slot>explanation</Slot>. For example, <Slot>example</Slot>. Therefore, <Slot>result</Slot>, which explains why this view has some merit.</>,
    body2: <>On the other hand, I believe that <Slot>your main position</Slot> is ultimately more convincing. The primary reason is that <Slot>Reason 2</Slot>. In other words, <Slot>explanation</Slot>. For instance, <Slot>example</Slot>. As a result, <Slot>result</Slot>. For this reason, I believe that <Slot>briefly restate your stronger position</Slot>.</>,
    conclusion: <>In conclusion, while I accept that <Slot>accepted side</Slot>, I remain convinced that <Slot>your stronger position</Slot>, mainly because <Slot>Reason 1</Slot> and <Slot>Reason 2</Slot>.</>,
    question: "Some people think that the best way to solve global environmental problems is to increase the cost of fuel. To what extent do you agree or disagree?",
    example: <>
      <p>It is often argued that increasing the cost of fuel is the most effective way to address global environmental problems. While I acknowledge that higher fuel prices can reduce unnecessary fuel consumption, I believe that broader environmental policies are ultimately more effective, primarily because pollution has multiple causes and cleaner alternatives must be made widely available.</p>
      <p>On the one hand, it is understandable why some people believe that raising fuel prices can help protect the environment. One important reason is that expensive fuel may discourage people from using private vehicles unnecessarily. This is because individuals are more likely to use public transport, walk or cycle when driving becomes significantly more costly. For example, commuters may choose buses or trains instead of travelling alone by car every day. Therefore, fuel consumption and vehicle emissions can be reduced, which explains why this policy has some merit.</p>
      <p>On the other hand, I believe that relying mainly on higher fuel prices is ultimately less effective. The primary reason is that environmental problems are caused not only by transport but also by industries, deforestation and excessive use of fossil fuels in electricity generation. In other words, increasing fuel costs would address only part of the problem. For instance, governments could invest in renewable energy, improve public transport and introduce stricter regulations for polluting industries. As a result, pollution could be reduced across several sectors. For this reason, comprehensive environmental policies are more effective than simply making fuel more expensive.</p>
      <p>In conclusion, while I accept that higher fuel prices can reduce unnecessary consumption, I remain convinced that wider environmental measures are more effective because pollution has multiple sources and requires broader solutions.</p>
    </>,
  },] as const;

function Slot({ children }: { children: React.ReactNode }) {
  return <span className="rounded bg-amber-100 px-1 font-semibold text-amber-900">[{children}]</span>;
}

function Formula({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{title}</p><p className="mt-2 leading-8 text-slate-700">{children}</p></div>;
}

export default function OpinionPage() {
  const [pageSize, setPageSize] = useState(20);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

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
                  <div className="mt-7 space-y-5">
                    <Formula title="Introduction">{item.intro}</Formula>
                    {"body1" in item && <Formula title="Body 1">{item.body1}</Formula>}
                    {"body2" in item && <Formula title="Body 2">{item.body2}</Formula>}
                    <Formula title="Conclusion">{item.conclusion}</Formula>
                  </div>
                </div>
                <div className={`border-t p-6 md:p-8 lg:border-l lg:border-t-0 ${item.style}`}>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-500">Worked example</span>
                  <p className="mt-5 text-sm font-semibold leading-6">{item.question}</p>
                  <div className="mt-4 space-y-4 text-base font-medium leading-7 text-slate-800">{item.example}</div>
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

        <section className="mt-12" aria-labelledby="practice-questions-title">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">Practice</p>
            <h2 id="practice-questions-title" className="mt-2 text-3xl font-black tracking-tight text-slate-950">Questions and answers</h2>
            <p className="mt-2 text-slate-600">Select a question to reveal its planning notes.</p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <label htmlFor="opinion-page-size" className="text-sm font-medium text-slate-700">Questions per page</label>
              <select id="opinion-page-size" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100">
                {[10, 20, 30, 50].map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={showAllAnswers} onChange={(event) => setShowAllAnswers(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              Show all answers on this page
            </label>
          </div>

          <div className="mt-6 space-y-4">
            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">1.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  There is a lot of pressure on young people today to succeed academically. As a result, some people believe that non-academic subjects, such as physical education and cookery, should be removed from the school syllabus so that children can concentrate on academic work. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">Disagree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <ol className="space-y-2 text-slate-700">
                      <li className="flex gap-3"><span className="font-black text-violet-600">1.</span><span>Develop practical life skills</span></li>
                      <li className="flex gap-3"><span className="font-black text-violet-600">2.</span><span>Improve physical and mental health</span></li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>remove</dt><dd className="font-bold text-violet-700">→ eliminate / exclude</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>academic work</dt><dd className="font-bold text-violet-700">→ core studies</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>non-academic subjects</dt><dd className="font-bold text-violet-700">→ practical subjects</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["balanced curriculum", "academic pressure", "essential life skills", "physical well-being"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">2.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Rich countries often give money to poorer countries, but it does not solve poverty. Therefore, developed countries should give other types of help to the poor countries rather than financial aid. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Financial aid may create <strong>dependency</strong></li>
                          <li>Money may be lost through <strong>corruption / poor management</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li><strong>Education and skill training</strong> create long-term employment</li>
                          <li><strong>Technology and infrastructure support</strong> promote sustainable development</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>rich countries</dt><dd className="font-bold text-violet-700">→ developed nations / wealthy countries</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>poorer countries</dt><dd className="font-bold text-violet-700">→ developing nations / low-income countries</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>financial aid</dt><dd className="font-bold text-violet-700">→ monetary assistance / economic support</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>solve poverty</dt><dd className="font-bold text-violet-700">→ reduce poverty / tackle poverty</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["long-term development", "sustainable economic growth", "job creation", "technical assistance", "reduce dependency"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">3.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  The most important aim of science should be to improve people’s lives. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Improve <strong>healthcare and life expectancy</strong></li>
                          <li>Develop <strong>life-saving medicines and technology</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Solve <strong>daily-life problems</strong></li>
                          <li>Improve <strong>living standards and productivity</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>most important aim</dt><dd className="font-bold text-violet-700">→ primary goal / main objective</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>science</dt><dd className="font-bold text-violet-700">→ scientific research / scientific development</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>improve people’s lives</dt><dd className="font-bold text-violet-700">→ enhance quality of life / improve living standards</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["medical advancement", "better quality of life", "technological innovation", "public well-being", "practical benefits to society"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">4.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Living in a country where you have to speak a foreign language can cause serious social problems, as well as practical problems. To what extent do you agree or disagree with this statement?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Difficulty in <strong>making friends and socialising</strong></li>
                          <li>Possible <strong>isolation and misunderstanding</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Problems with <strong>jobs, healthcare and public services</strong></li>
                          <li>Difficulty understanding <strong>instructions and official documents</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>foreign language</dt><dd className="font-bold text-violet-700">→ non-native language / second language</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>social problems</dt><dd className="font-bold text-violet-700">→ communication difficulties / social isolation</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>practical problems</dt><dd className="font-bold text-violet-700">→ everyday difficulties / daily-life challenges</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["language barrier", "social integration", "communication breakdown", "access essential services", "adapt to a new society"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">5.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people say that music is a good way of bringing people of different cultures and ages together. To what extent do you agree or disagree with this opinion?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Music can <strong>cross cultural barriers</strong></li>
                          <li>People can share <strong>common emotions and experiences</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Music appeals to <strong>different age groups</strong></li>
                          <li>Concerts and festivals encourage <strong>social interaction</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>bringing people together</dt><dd className="font-bold text-violet-700">→ uniting people / connecting people</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>different cultures</dt><dd className="font-bold text-violet-700">→ diverse cultural backgrounds</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>different ages</dt><dd className="font-bold text-violet-700">→ different generations / age groups</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>music</dt><dd className="font-bold text-violet-700">→ musical expression / songs</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["cultural connection", "shared enjoyment", "common emotional experience", "bridge cultural differences", "strengthen social bonds"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">6.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  All cars that burn fossil fuels should be banned and electric cars should replace them. Do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Electric cars can <strong>reduce air pollution</strong></li>
                          <li>Lower <strong>carbon emissions and fossil-fuel dependence</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>A complete ban may be <strong>too expensive and impractical</strong></li>
                          <li>Insufficient <strong>charging infrastructure</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>fossil-fuel cars</dt><dd className="font-bold text-violet-700">→ petrol/diesel vehicles / conventional cars</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>banned</dt><dd className="font-bold text-violet-700">→ prohibited / phased out</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>electric cars</dt><dd className="font-bold text-violet-700">→ electric vehicles / EVs</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>replace</dt><dd className="font-bold text-violet-700">→ substitute / take the place of</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["reduce greenhouse-gas emissions", "cleaner transportation", "charging infrastructure", "gradual transition", "environmentally friendly vehicles"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">7.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Access to clean water is a basic human right. Therefore, every home should have a water supply that is provided free of charge. Do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Clean water is <strong>essential for survival and health</strong></li>
                          <li>A free basic supply ensures <strong>equal access</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Completely free water may cause <strong>wasteful consumption</strong></li>
                          <li>Governments need funds for <strong>treatment and maintenance</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>clean water</dt><dd className="font-bold text-violet-700">→ safe drinking water / potable water</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>basic human right</dt><dd className="font-bold text-violet-700">→ fundamental right</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>free of charge</dt><dd className="font-bold text-violet-700">→ at no cost / without payment</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>water supply</dt><dd className="font-bold text-violet-700">→ water provision</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["universal access to clean water", "public health protection", "basic water allowance", "prevent water wastage", "maintenance costs"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">8.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  It is important for all towns and cities to have large public spaces such as squares and parks. To what extent do you agree or disagree with this statement?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Provide space for <strong>exercise and relaxation</strong></li>
                          <li>Improve <strong>physical and mental well-being</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Encourage <strong>social interaction</strong></li>
                          <li>Improve the <strong>urban environment and air quality</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>public spaces</dt><dd className="font-bold text-violet-700">→ communal areas / shared spaces</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>towns and cities</dt><dd className="font-bold text-violet-700">→ urban areas</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>parks</dt><dd className="font-bold text-violet-700">→ green spaces</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>important</dt><dd className="font-bold text-violet-700">→ essential / beneficial</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["urban green spaces", "community interaction", "public recreation", "better quality of life", "healthier urban environment"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">9.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  The working week should be shorter and workers should have a longer weekend. Do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience.
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Better <strong>work-life balance</strong></li>
                          <li>More time for <strong>family and rest</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Reduced <strong>stress and burnout</strong></li>
                          <li>Higher <strong>productivity and job satisfaction</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>working week</dt><dd className="font-bold text-violet-700">→ workweek / working schedule</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>shorter</dt><dd className="font-bold text-violet-700">→ reduced / fewer working days</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>longer weekend</dt><dd className="font-bold text-violet-700">→ extended weekend</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>workers</dt><dd className="font-bold text-violet-700">→ employees / staff</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["work-life balance", "employee well-being", "reduce burnout", "improve productivity", "job satisfaction"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">10.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  It is important for children to learn the difference between right and wrong at an early age. Punishment is necessary to help them learn this distinction. To what extent do you agree or disagree with this view? What sort of punishment should parents and teachers be allowed to use to teach good behaviour to children?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Mild punishment can teach <strong>discipline and consequences</strong></li>
                          <li>Helps children understand <strong>acceptable behaviour</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Harsh punishment may cause <strong>fear and emotional harm</strong></li>
                          <li>Guidance and explanation are often <strong>more effective</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Suitable punishment</h3>
                    <ul className="list-disc space-y-1 pl-5 text-slate-700">
                      <li><strong>Time-out</strong></li>
                      <li><strong>Loss of privileges</strong></li>
                      <li><strong>Extra responsibilities</strong></li>
                      <li><strong>Verbal warning</strong></li>
                      <li><strong>No physical punishment</strong></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>right and wrong</dt><dd className="font-bold text-violet-700">→ good and bad behaviour / moral distinction</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>punishment</dt><dd className="font-bold text-violet-700">→ disciplinary action / penalty</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>early age</dt><dd className="font-bold text-violet-700">→ young age / childhood</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>good behaviour</dt><dd className="font-bold text-violet-700">→ proper conduct / positive behaviour</dd></div>
                    </dl>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["learn from consequences", "positive discipline", "set clear boundaries", "encourage responsible behaviour", "avoid physical punishment"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">11.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  It is a natural process for animal species to become extinct (e.g. dinosaurs and dodos). There is no reason why people should try to prevent this from happening. Do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">Disagree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Many extinctions are caused by <strong>human activities</strong></li>
                          <li>Habitat destruction and hunting <strong>accelerate species loss</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Animals are vital for <strong>ecosystem balance</strong></li>
                          <li>Extinction can disrupt <strong>food chains and biodiversity</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>become extinct</dt><dd className="font-bold text-violet-700">→ die out / disappear permanently</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>prevent</dt><dd className="font-bold text-violet-700">→ protect / conserve</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>animal species</dt><dd className="font-bold text-violet-700">→ wildlife species</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>natural process</dt><dd className="font-bold text-violet-700">→ natural phenomenon</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["protect endangered species", "preserve biodiversity", "maintain ecological balance", "human-induced extinction", "wildlife conservation"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">12.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people think the money spent on developing technology for space exploration is not justified. There are more beneficial ways to spend this money. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Money could support <strong>healthcare and education</strong></li>
                          <li>It can reduce <strong>poverty and unemployment</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Space research drives <strong>technological innovation</strong></li>
                          <li>It helps in <strong>weather forecasting and communication</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>space exploration</dt><dd className="font-bold text-violet-700">→ space research / space missions</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>not justified</dt><dd className="font-bold text-violet-700">→ not worthwhile / difficult to justify</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>beneficial ways</dt><dd className="font-bold text-violet-700">→ more useful purposes</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>spend money</dt><dd className="font-bold text-violet-700">→ allocate funds / invest resources</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["public spending priorities", "scientific advancement", "essential public services", "technological progress", "long-term benefits"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">13.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people think that instead of preventing climate change, we need to find a way to live with it. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Some climate impacts are already <strong>unavoidable</strong></li>
                          <li>Societies need <strong>adaptation and disaster preparedness</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Ignoring prevention may cause <strong>more severe damage</strong></li>
                          <li>Cutting emissions can <strong>slow global warming</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>prevent climate change</dt><dd className="font-bold text-violet-700">→ combat / mitigate climate change</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>live with it</dt><dd className="font-bold text-violet-700">→ adapt to it / cope with its effects</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>climate change</dt><dd className="font-bold text-violet-700">→ global warming / climatic change</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["reduce carbon emissions", "climate adaptation", "disaster preparedness", "renewable energy", "limit environmental damage"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">14.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  The best way to teach children to cooperate is through team sports at school. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Team sports teach <strong>teamwork and communication</strong></li>
                          <li>Children learn to <strong>share responsibility</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Group projects and activities also build <strong>cooperation</strong></li>
                          <li>Not all children are <strong>interested in sports</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>cooperate</dt><dd className="font-bold text-violet-700">→ work together / collaborate</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>team sports</dt><dd className="font-bold text-violet-700">→ group sports / competitive team games</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>teach children</dt><dd className="font-bold text-violet-700">→ educate youngsters / develop children’s skills</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["team-building skills", "shared goals", "mutual support", "effective communication", "group participation"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">15.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  The average standard of people’s health is likely to be lower in the future than it is now. To what extent do you agree or disagree with this statement?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">Disagree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Medical technology will <strong>improve treatment and diagnosis</strong></li>
                          <li>Better awareness will encourage <strong>healthier lifestyles</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Wider access to <strong>vaccination and healthcare</strong></li>
                          <li>Advances in <strong>nutrition and disease prevention</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>health standard</dt><dd className="font-bold text-violet-700">→ health condition / level of health</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>in the future</dt><dd className="font-bold text-violet-700">→ in coming years / in the long term</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>lower</dt><dd className="font-bold text-violet-700">→ decline / deteriorate</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>people’s health</dt><dd className="font-bold text-violet-700">→ public health / human health</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["medical advancement", "preventive healthcare", "healthy lifestyle", "early diagnosis", "improved life expectancy"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">16.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people think that governments should invest more in public transportation instead of building more roads and highways. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Public transport can <strong>reduce traffic congestion</strong></li>
                          <li>Fewer private cars can <strong>lower air pollution</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>More <strong>affordable and accessible</strong> for the public</li>
                          <li>Improves <strong>urban mobility and efficiency</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>invest more</dt><dd className="font-bold text-violet-700">→ allocate more funds / spend more</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>public transportation</dt><dd className="font-bold text-violet-700">→ public transit / mass transport</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>roads and highways</dt><dd className="font-bold text-violet-700">→ road infrastructure / motorways</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>traffic congestion</dt><dd className="font-bold text-violet-700">→ traffic jams / overcrowded roads</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["reduce car dependency", "ease traffic congestion", "lower carbon emissions", "affordable transport", "sustainable urban development"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">17.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  In the future, nobody will buy printed newspapers or books because they will be able to read everything they want online without paying. To what extent do you agree or disagree with the statement?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Online content is <strong>cheap, fast and convenient</strong></li>
                          <li>Digital access reduces the need for <strong>printed materials</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Many people still prefer <strong>physical books and newspapers</strong></li>
                          <li>Not all online content is <strong>free or reliable</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>printed newspapers</dt><dd className="font-bold text-violet-700">→ physical newspapers / print media</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>books</dt><dd className="font-bold text-violet-700">→ printed publications</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>online</dt><dd className="font-bold text-violet-700">→ digitally / on the internet</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>without paying</dt><dd className="font-bold text-violet-700">→ free of charge / at no cost</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["digital reading", "easy online access", "declining print demand", "reading preference", "paid online content"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">18.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people believe that unpaid community service should be a compulsory part of high school programmes (for example, working for a charity, improving the neighbourhood or teaching sports to younger children). Do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Develops <strong>social responsibility and empathy</strong></li>
                          <li>Teaches students to <strong>help their community</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Builds <strong>practical and interpersonal skills</strong></li>
                          <li>Improves <strong>teamwork, communication and leadership</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>unpaid community service</dt><dd className="font-bold text-violet-700">→ voluntary work / community work</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>compulsory</dt><dd className="font-bold text-violet-700">→ mandatory / obligatory</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>high school programmes</dt><dd className="font-bold text-violet-700">→ secondary school curriculum</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>charity</dt><dd className="font-bold text-violet-700">→ non-profit organisation</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["sense of responsibility", "community engagement", "practical experience", "social awareness", "valuable life skills"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">19.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people believe that technology has made our lives more complicated, while others think it has made life easier. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Easier</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Technology saves <strong>time and effort</strong></li>
                          <li>Improves <strong>communication and access to information</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Complicated</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Creates <strong>digital dependence and privacy risks</strong></li>
                          <li>Frequent updates can cause <strong>stress and confusion</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>technology</dt><dd className="font-bold text-violet-700">→ digital technology / modern technology</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>complicated</dt><dd className="font-bold text-violet-700">→ complex / difficult</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>easier</dt><dd className="font-bold text-violet-700">→ more convenient / simpler</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>lives</dt><dd className="font-bold text-violet-700">→ daily life / everyday life</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["save valuable time", "instant communication", "easy access to information", "digital dependency", "privacy concerns"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">20.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Many manufactured food and drink products contain high levels of sugar, which causes many health problems. Sugary products should be made more expensive to encourage people to consume less sugar. Do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Higher prices can <strong>reduce consumption</strong></li>
                          <li>Discourages people from buying <strong>unhealthy products</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Lower sugar intake can reduce <strong>obesity and diabetes</strong></li>
                          <li>Encourages manufacturers to produce <strong>healthier alternatives</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>sugary products</dt><dd className="font-bold text-violet-700">→ high-sugar foods / sweetened products</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>made more expensive</dt><dd className="font-bold text-violet-700">→ increase the price / impose higher taxes</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>consume less sugar</dt><dd className="font-bold text-violet-700">→ reduce sugar intake</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>health problems</dt><dd className="font-bold text-violet-700">→ health issues / illnesses</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["sugar tax", "reduce excessive consumption", "public health", "healthier food choices", "prevent diet-related diseases"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">21.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  The growing number of overweight people is putting strain on the healthcare system in an effort to deal with the health issues involved. Some people think that the best way to deal with this problem is to introduce more physical education lessons into the school curriculum. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>More PE can <strong>increase physical activity</strong></li>
                          <li>Helps prevent <strong>obesity from an early age</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Diet and lifestyle also strongly affect <strong>body weight</strong></li>
                          <li>Schools should also teach <strong>healthy eating habits</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>overweight people</dt><dd className="font-bold text-violet-700">→ obese individuals / people with excess weight</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>strain on healthcare</dt><dd className="font-bold text-violet-700">→ pressure on the healthcare system</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>physical education</dt><dd className="font-bold text-violet-700">→ PE / exercise classes</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>deal with</dt><dd className="font-bold text-violet-700">→ tackle / address</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["regular physical activity", "childhood obesity", "healthy lifestyle", "balanced diet", "reduce healthcare burden"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">22.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Many people think that individuals cannot do anything to improve the environment, and only governments and large companies can make a real difference. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">Disagree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Individuals can <strong>reduce waste and energy use</strong></li>
                          <li>Daily choices can lower <strong>carbon emissions</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Collective public action can create <strong>large-scale change</strong></li>
                          <li>Consumers can pressure companies to adopt <strong>greener practices</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>individuals</dt><dd className="font-bold text-violet-700">→ ordinary people / citizens</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>improve the environment</dt><dd className="font-bold text-violet-700">→ protect the environment / reduce environmental damage</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>make a real difference</dt><dd className="font-bold text-violet-700">→ have a significant impact</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>large companies</dt><dd className="font-bold text-violet-700">→ major corporations / businesses</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["individual responsibility", "collective action", "eco-friendly habits", "reduce carbon footprint", "sustainable lifestyle"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">23.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  With the increased global demand for oil and gas, undiscovered areas of the world should be opened up to access more resources. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">Disagree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Exploration can cause <strong>serious environmental damage</strong></li>
                          <li>Threatens <strong>wildlife and fragile ecosystems</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Countries should invest in <strong>renewable energy</strong></li>
                          <li>Reduces long-term <strong>dependence on fossil fuels</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>global demand</dt><dd className="font-bold text-violet-700">→ worldwide demand / rising demand</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>undiscovered areas</dt><dd className="font-bold text-violet-700">→ untapped regions / unexplored areas</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>access more resources</dt><dd className="font-bold text-violet-700">→ extract more resources</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>oil and gas</dt><dd className="font-bold text-violet-700">→ fossil fuels</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["environmental destruction", "protect natural habitats", "renewable energy sources", "energy security", "reduce fossil-fuel dependence"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">24.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Nowadays, celebrities are more famous for their glamour and wealth than for their achievements, and this has set a bad example for young children. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Promotes <strong>materialism and superficial values</strong></li>
                          <li>Children may value <strong>wealth over hard work</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Celebrity lifestyles create <strong>unrealistic expectations</strong></li>
                          <li>May influence children to seek <strong>fame instead of achievement</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>celebrities</dt><dd className="font-bold text-violet-700">→ famous people / public figures</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>glamour</dt><dd className="font-bold text-violet-700">→ luxurious lifestyle / attractiveness</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>achievements</dt><dd className="font-bold text-violet-700">→ accomplishments / success</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>bad example</dt><dd className="font-bold text-violet-700">→ negative influence / poor role model</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["materialistic attitudes", "unrealistic lifestyle", "positive role models", "value genuine achievement", "influence young minds"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">25.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  More and more people are becoming seriously overweight. Some people think a solution can be to increase the price of fattening foods. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Higher prices may <strong>reduce junk-food consumption</strong></li>
                          <li>Encourages <strong>healthier food choices</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Obesity also results from <strong>lack of exercise and poor lifestyle</strong></li>
                          <li>Healthy food should be made <strong>more affordable and accessible</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>seriously overweight</dt><dd className="font-bold text-violet-700">→ obese / excessively overweight</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>fattening foods</dt><dd className="font-bold text-violet-700">→ unhealthy foods / high-calorie foods</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>increase the price</dt><dd className="font-bold text-violet-700">→ raise the cost / impose higher taxes</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>solution</dt><dd className="font-bold text-violet-700">→ remedy / effective measure</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["reduce calorie intake", "unhealthy eating habits", "balanced diet", "regular physical activity", "tackle obesity"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">26.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  A big salary is much more important than job satisfaction. Do you agree or disagree? Provide relevant examples if necessary.
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">Disagree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Job satisfaction improves <strong>motivation and mental well-being</strong></li>
                          <li>Satisfied workers are often <strong>more productive</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>A high salary cannot compensate for <strong>stress and an unhealthy work environment</strong></li>
                          <li>Long-term career happiness depends on <strong>interest and work-life balance</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>big salary</dt><dd className="font-bold text-violet-700">→ high income / attractive salary</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>job satisfaction</dt><dd className="font-bold text-violet-700">→ career fulfilment / workplace satisfaction</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>important</dt><dd className="font-bold text-violet-700">→ essential / significant</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["career fulfilment", "work-life balance", "employee motivation", "mental well-being", "long-term job satisfaction"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">27.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  The threat of nuclear weapons maintains world peace. Nuclear power provides cheap and clean energy. The benefits of nuclear technology far outweigh the disadvantages. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Nuclear deterrence may <strong>discourage large-scale wars</strong></li>
                          <li>Nuclear power provides <strong>low-carbon electricity</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Nuclear weapons pose <strong>catastrophic security risks</strong></li>
                          <li>Nuclear plants create <strong>radioactive waste and accident risks</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>world peace</dt><dd className="font-bold text-violet-700">→ global stability / international peace</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>nuclear power</dt><dd className="font-bold text-violet-700">→ atomic energy / nuclear energy</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>benefits</dt><dd className="font-bold text-violet-700">→ advantages / positive impacts</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>disadvantages</dt><dd className="font-bold text-violet-700">→ drawbacks / risks</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["nuclear deterrence", "low-carbon energy", "radioactive waste", "nuclear accident", "global security risk"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">28.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  As well as making money, businesses also have social responsibilities. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Businesses should protect <strong>employees and consumers</strong></li>
                          <li>Fair wages and safe products build <strong>public trust</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Companies should reduce <strong>environmental damage</strong></li>
                          <li>Supporting communities improves <strong>social development</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>making money</dt><dd className="font-bold text-violet-700">→ earning profits / generating revenue</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>businesses</dt><dd className="font-bold text-violet-700">→ companies / corporations</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>social responsibilities</dt><dd className="font-bold text-violet-700">→ social obligations / corporate duties</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["corporate social responsibility", "ethical business practices", "employee welfare", "environmental protection", "community development"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">29.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Whether or not someone achieves their aims is mostly a question of luck. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-black text-rose-700">Disagree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Success mainly depends on <strong>hard work and persistence</strong></li>
                          <li>Skills and preparation increase the chance of <strong>achieving goals</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Luck may create opportunities, but <strong>effort determines outcomes</strong></li>
                          <li>Disciplined people can overcome <strong>unfavourable circumstances</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>achieve aims</dt><dd className="font-bold text-violet-700">→ reach goals / accomplish objectives</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>luck</dt><dd className="font-bold text-violet-700">→ chance / good fortune</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>mostly</dt><dd className="font-bold text-violet-700">→ mainly / largely</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["hard work and determination", "personal effort", "careful preparation", "long-term success", "create opportunities"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">30.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people think that the best way to solve global environmental problems is to increase the cost of fuel. To what extent do you agree or disagree?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Higher fuel prices may <strong>reduce private car use</strong></li>
                          <li>Can lower <strong>carbon emissions</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Environmental problems have <strong>many different causes</strong></li>
                          <li>Governments should also invest in <strong>renewable energy and public transport</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>increase the cost of fuel</dt><dd className="font-bold text-violet-700">→ raise fuel prices / impose higher fuel taxes</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>global environmental problems</dt><dd className="font-bold text-violet-700">→ worldwide environmental issues</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>solve</dt><dd className="font-bold text-violet-700">→ tackle / address</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["reduce fuel consumption", "cut carbon emissions", "renewable energy", "public transportation", "environmental protection"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">31.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people claim that not enough of the waste from homes is recycled. They say that the only way to increase recycling is for governments to make it a legal requirement. To what extent do you think laws are needed to make people recycle more of their waste?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-700">Partly agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-emerald-700">1. Agree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Laws can <strong>force households to recycle</strong></li>
                          <li>Penalties can improve <strong>public compliance</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-rose-700">2. Disagree</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Awareness and convenient facilities can be <strong>equally effective</strong></li>
                          <li>Governments should provide <strong>recycling bins and education</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>waste from homes</dt><dd className="font-bold text-violet-700">→ household waste / domestic waste</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>legal requirement</dt><dd className="font-bold text-violet-700">→ mandatory law / legal obligation</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>recycle</dt><dd className="font-bold text-violet-700">→ reuse / process waste</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>increase recycling</dt><dd className="font-bold text-violet-700">→ boost recycling rates</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["mandatory recycling", "public awareness", "recycling facilities", "household responsibility", "reduce landfill waste"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>

            <details open={showAllAnswers || undefined} name="opinion-questions" className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-violet-300 open:ring-2 open:ring-violet-100">
              <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">32.</span>
                <span className="flex-1 font-bold leading-7 text-slate-900">
                  Some people think that in order to prevent illness and disease, governments should make efforts to reduce environmental pollution and housing problems. To what extent do you agree or disagree with this statement?
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-violet-600 transition-transform group-open:rotate-45">+</span>
              </summary>

              <div className="border-t border-violet-100 bg-violet-50/60 p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Position</h3>
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700">Agree</span>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reasons</h3>
                    <div className="space-y-4 text-slate-700">
                      <div>
                        <p className="font-black text-violet-700">1.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Reducing pollution can prevent <strong>respiratory and other diseases</strong></li>
                          <li>Cleaner air and water improve <strong>public health</strong></li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-black text-violet-700">2.</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5">
                          <li>Better housing reduces <strong>overcrowding and poor sanitation</strong></li>
                          <li>Safe living conditions lower the risk of <strong>infectious diseases</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Synonyms</h3>
                    <dl className="space-y-2 text-slate-700">
                      <div className="flex flex-wrap gap-x-2"><dt>prevent illness</dt><dd className="font-bold text-violet-700">→ reduce disease / protect health</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>environmental pollution</dt><dd className="font-bold text-violet-700">→ air and water pollution</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>housing problems</dt><dd className="font-bold text-violet-700">→ poor living conditions / inadequate housing</dd></div>
                      <div className="flex flex-wrap gap-x-2"><dt>governments should make efforts</dt><dd className="font-bold text-violet-700">→ authorities should take action</dd></div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Useful phrases</h3>
                    <ul className="flex flex-wrap gap-2">
                      {["public health", "clean environment", "safe housing", "disease prevention", "healthy living conditions"].map((phrase) => (
                        <li key={phrase} className="rounded-lg border border-violet-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700">{phrase}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <nav aria-label="Question pages" className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <button type="button" disabled className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-slate-300">« Previous</button>
            <button type="button" aria-current="page" className="h-10 min-w-10 rounded-md bg-violet-600 px-3 text-sm font-medium text-white shadow-sm">1</button>
            <button type="button" disabled className="cursor-not-allowed rounded-md px-3 py-2 text-sm font-medium text-slate-300">Next »</button>
          </nav>
        </section>
      </section>
    </main>
  );
}