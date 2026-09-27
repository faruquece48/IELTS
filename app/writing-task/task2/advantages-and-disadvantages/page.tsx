import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the topic and introduce the benefits and drawbacks." },
    { title: "Body one", text: "Develop the main advantages with explanation and an example." },
    { title: "Body two", text: "Develop the main disadvantages with explanation and an example." },
    { title: "Conclusion", text: "Summarise both sides and give a judgement if the question asks." },
] as const;

export default function Page() {
  return <EssayGuide number="05" title="Advantages and Disadvantages" label="Benefits and drawbacks" description="Develop both sides with specific reasoning and balanced support." steps={steps} />;
}