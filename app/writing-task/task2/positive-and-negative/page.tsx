import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the trend and state whether it is mainly positive or negative." },
    { title: "Body one", text: "Explain the strongest positive effect with an example." },
    { title: "Body two", text: "Explain the strongest negative effect and show which side is greater." },
    { title: "Conclusion", text: "Restate your overall judgement and its main reasons." },
] as const;

export default function Page() {
  return <EssayGuide number="06" title="Positive and Negative" label="Development or trend" description="Judge the overall effect of a development and defend that judgement." steps={steps} />;
}