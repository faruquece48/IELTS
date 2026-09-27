import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the topic and give a brief answer to both questions." },
    { title: "Body one", text: "Answer the first question with explanation and an example." },
    { title: "Body two", text: "Answer the second question with explanation and an example." },
    { title: "Conclusion", text: "Summarise both answers without adding a new idea." },
] as const;

export default function Page() {
  return <EssayGuide number="03" title="Multi Part" label="Two-part question" description="Answer every part of the prompt clearly and with equal attention." steps={steps} />;
}