import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the problem and preview the main causes and solutions." },
    { title: "Body one", text: "Explain the strongest causes and show why the problem occurs." },
    { title: "Body two", text: "Propose realistic solutions and explain their likely effects." },
    { title: "Conclusion", text: "Summarise the causes and the most effective responses." },
] as const;

const formulas = [
  { title: "Introduction", text: "It is increasingly common for [paraphrase the problem]. This issue is mainly caused by [Cause 1] and [Cause 2], and it can be addressed through [Solution 1] and [Solution 2]." },
  { title: "Body 1 — Causes", text: "One major cause is [Cause 1]. This occurs because [explanation]. For example, [example]. Another contributing factor is [Cause 2], which means that [explanation and result]." },
  { title: "Body 2 — Solutions", text: "Several measures can tackle this problem. First, [responsible group] should [Solution 1]. This would [positive effect]. In addition, [Solution 2] could [explanation], thereby [result]." },
  { title: "Conclusion", text: "In conclusion, [problem] primarily results from [Cause 1] and [Cause 2]. However, [Solution 1] and [Solution 2] can significantly reduce it." },
] as const;

const example = [
  "Traffic congestion has become a serious problem in many large cities. This issue is mainly caused by growing car ownership and inadequate public transport, and it can be addressed by improving mass transit and discouraging unnecessary driving.",
  "One major cause is the rapid increase in private vehicles. Many commuters prefer cars because they are comfortable and flexible, so roads become overcrowded during peak hours. Another contributing factor is unreliable public transport. When buses and trains are infrequent or poorly connected, residents have little practical alternative to driving.",
  "Several measures can tackle this problem. First, governments should invest in frequent, affordable and well-connected public transport. This would encourage commuters to leave their cars at home. In addition, congestion charges and higher city-centre parking fees could discourage unnecessary journeys, thereby reducing the number of vehicles on busy roads.",
  "In conclusion, urban congestion primarily results from excessive car use and weak public transport. However, better mass-transit systems and financial measures that limit unnecessary driving can significantly reduce it.",
] as const;

const questions = <details className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-colors open:border-amber-300 open:ring-2 open:ring-amber-100">
  <summary className="flex cursor-pointer list-none items-start gap-4 p-6 marker:content-none md:p-8">
    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-black text-amber-700">1.</span>
    <span className="flex-1 font-bold leading-7 text-slate-900">More and more people are migrating to cities in search of a better life, but city life can be extremely difficult. Explain some of the difficulties of living in a city. How can governments make urban life better for everyone?</span>
    <span aria-hidden="true" className="mt-1 text-2xl font-light leading-none text-amber-600 transition-transform group-open:rotate-45">+</span>
  </summary>
  <div className="border-t border-amber-100 bg-amber-50/60 p-6 md:p-8">
    <p className="mb-6 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Question Type: <span className="text-amber-700">Problems and Solutions</span></p>
    <div className="grid gap-6 md:grid-cols-2">
      <div><p className="font-black text-rose-700">Reason 1 – Problems</p><ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700"><li>traffic congestion and air pollution</li><li>high living costs and housing shortages</li><li>overcrowding and unemployment</li></ul></div>
      <div><p className="font-black text-emerald-700">Reason 2 – Solutions</p><ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700"><li>invest in public transport and affordable housing</li><li>create more job opportunities</li><li>improve healthcare and public services</li></ul></div>
    </div>
  </div>
</details>;

export default function Page() {
  return <EssayGuide number="04" title="Cause and Solution" label="Problems and solutions" description="Identify the main causes and connect each one to a workable solution." steps={steps} structureTitle="Causes followed by solutions" formulas={formulas} exampleTheme="urban traffic congestion" example={example} questions={questions} />;
}
