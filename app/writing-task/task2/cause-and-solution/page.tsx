import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the problem and preview the main causes and solutions." },
    { title: "Body one", text: "Explain the strongest causes and show why the problem occurs." },
    { title: "Body two", text: "Propose realistic solutions and explain their likely effects." },
    { title: "Conclusion", text: "Summarise the causes and the most effective responses." },
] as const;

export default function Page() {
  return <EssayGuide number="04" title="Cause and Solution" label="Problems and solutions" description="Identify the main causes and connect each one to a workable solution." steps={steps} />;
}