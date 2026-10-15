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

export default function Page() {
  return <EssayGuide number="04" title="Cause and Solution" label="Problems and solutions" description="Identify the main causes and connect each one to a workable solution." steps={steps} structureTitle="Causes followed by solutions" formulas={formulas} exampleTheme="urban traffic congestion" example={example} />;
}
