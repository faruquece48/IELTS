import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the trend and state whether it is mainly positive or negative." },
    { title: "Body one", text: "Explain the strongest positive effect with an example." },
    { title: "Body two", text: "Explain the strongest negative effect and show which side is greater." },
    { title: "Conclusion", text: "Restate your overall judgement and its main reasons." },
] as const;

const formulas = [
  { title: "Introduction", text: "In recent years, [paraphrase the development]. Although this trend may cause [opposing effect], I believe it is a largely [positive / negative] development because [Reason 1] and [Reason 2]." },
  { title: "Body 1 — Positive effect", text: "One positive effect is that [positive idea]. This is because [explanation]. For example, [example]. Therefore, [positive result]." },
  { title: "Body 2 — Negative effect + judgement", text: "Admittedly, [negative idea]. In other words, [explanation]. Nevertheless, I believe the positive effects are greater because [comparison showing why your chosen side outweighs the other]." },
  { title: "Conclusion", text: "In conclusion, while [acknowledge the opposing effect], I consider [development] to be mainly [positive / negative] because [restate the strongest reasons]." },
] as const;

const example = [
  "In recent years, digital payments have increasingly replaced cash. Although this trend may exclude some elderly or technologically inexperienced people, I believe it is a largely positive development because electronic transactions are more convenient and can improve financial security.",
  "One positive effect is that cashless payments make everyday transactions faster and easier. Consumers can pay bills, purchase goods and transfer money instantly without carrying physical currency. For example, commuters can use a phone or contactless card to pay for transport within seconds. Therefore, digital payments save time and make financial services more accessible.",
  "Admittedly, people who lack smartphones, internet access or digital skills may find a cashless system difficult to use. Nevertheless, I believe the positive effects are greater because governments and banks can provide training and accessible alternatives, while secure electronic records can reduce theft and make suspicious transactions easier to trace.",
  "In conclusion, while the decline of cash may create difficulties for some groups, I consider the growth of digital payments mainly positive because it offers greater convenience, accessibility and security.",
] as const;

export default function Page() {
  return <EssayGuide number="06" title="Positive and Negative" label="Development or trend" description="Judge the overall effect of a development and defend that judgement." steps={steps} structureTitle="Evaluate both effects and give a judgement" formulas={formulas} exampleTheme="the growth of cashless payments" example={example} />;
}
