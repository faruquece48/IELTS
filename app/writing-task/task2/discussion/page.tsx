import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the topic, mention both views, and state your opinion." },
    { title: "Body one", text: "Explain the first view and support it with a relevant example." },
    { title: "Body two", text: "Explain the second view, then make your position clear." },
    { title: "Conclusion", text: "Summarise both sides and restate your final opinion." },
] as const;

export default function Page() {
  return <EssayGuide number="02" title="Discussion" label="Discuss both views" description="Present both sides fairly before stating your own position." steps={steps} />;
}