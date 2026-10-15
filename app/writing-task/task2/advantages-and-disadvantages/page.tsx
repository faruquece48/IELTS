import EssayGuide from "../EssayGuide";

const steps = [
    { title: "Introduction", text: "Paraphrase the topic and introduce the benefits and drawbacks." },
    { title: "Body one", text: "Develop the main advantages with explanation and an example." },
    { title: "Body two", text: "Develop the main disadvantages with explanation and an example." },
    { title: "Conclusion", text: "Summarise both sides and give a judgement if the question asks." },
] as const;

const formulas = [
  { title: "Introduction", text: "It is becoming increasingly common for [paraphrase the development]. This trend offers clear benefits, particularly [Advantage 1], although it also creates drawbacks such as [Disadvantage 1]." },
  { title: "Body 1 — Advantages", text: "The main advantage is that [Advantage 1]. This is because [explanation]. For example, [example]. As a result, [positive result]. A further benefit is [Advantage 2]." },
  { title: "Body 2 — Disadvantages", text: "However, the principal disadvantage is [Disadvantage 1]. In other words, [explanation]. For instance, [example]. Consequently, [negative result]. Another concern is [Disadvantage 2]." },
  { title: "Conclusion", text: "In conclusion, [topic] provides benefits such as [summary of advantages], but it can also lead to [summary of disadvantages]." },
] as const;

const example = [
  "Working from home has become increasingly common. This arrangement offers clear benefits, particularly greater flexibility and the removal of daily commuting, although it can also create drawbacks such as isolation and weaker boundaries between work and personal life.",
  "The main advantage is that remote employees can organise their schedules more efficiently. Without a daily commute, they save both time and money and can devote more attention to work or family responsibilities. For example, a parent may begin work earlier and use the saved travel time to care for children. A further benefit is that companies can recruit talented people regardless of location.",
  "However, the principal disadvantage is reduced face-to-face interaction. Employees may feel isolated and find collaboration more difficult when communication occurs mainly online. For instance, new staff can struggle to build relationships or ask for immediate support. Another concern is that working at home can blur the boundary between professional duties and personal time.",
  "In conclusion, remote work provides flexibility, lower commuting costs and wider employment opportunities, but it can also cause social isolation and an unhealthy work-life balance.",
] as const;

export default function Page() {
  return <EssayGuide number="05" title="Advantages and Disadvantages" label="Benefits and drawbacks" description="Develop both sides with specific reasoning and balanced support." steps={steps} structureTitle="Advantages followed by disadvantages" formulas={formulas} exampleTheme="working from home" example={example} />;
}
