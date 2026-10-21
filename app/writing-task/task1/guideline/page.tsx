import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Guide = {
  slug: string;
  title: string;
  purpose: string;
  image: string;
  alt: string;
  analysis: string[];
  approach: string[];
  overview: string[];
  body: string[];
  vocabulary: string[];
  tense: string[];
  answer: string[];
  features: string[];
};

const guides: Guide[] = [
  {
    slug: "line-graph", title: "Describing a Line Graph", purpose: "Line graphs show trends or changes over time.", image: "/ielts/task1-guideline/line-graph.png", alt: "Annual earnings of three Calgary bakeries from 2000 to 2010",
    analysis: ["What does the chart represent?", "What is the unit of measurement?", "What time frame is shown?", "How many lines are displayed?", "Which tense does the time frame require?"],
    approach: ["Study both axes, their labels, and units.", "Find trends, fluctuations, turning points, peaks, and intersections."],
    overview: ["Identify the main trend or pattern.", "Highlight the most significant changes or fluctuations.", "Give a broad description without listing every figure."],
    body: ["Group lines with similar or contrasting trends.", "Support statements with selected data points.", "Compare and contrast where relevant.", "Use linking expressions to connect changes."],
    vocabulary: ["rise, increase, grow, climb; fall, decrease, drop, decline; fluctuate, peak, level off", "dramatic, significant, moderate, gradual, slight", "while, whereas, although, despite, due to"],
    tense: ["Present simple for what the visual shows: “The graph indicates …”", "Past simple for finished periods: “The figure rose sharply in 2008.”"],
    answer: ["The graph compares the annual income of three bakeries in Calgary between 2000 and 2010.", "Overall, Amandine Bakery and Bolo Cakery experienced substantial growth, whereas Mari Bakeshop’s earnings fell markedly. Mari led at the beginning, but Amandine earned the most by 2010.", "Bolo began at about $20,000 and, after some fluctuation, climbed to approximately $65,000. Amandine remained near $55,000 until 2005 before rising rapidly to around $105,000. By contrast, Mari fluctuated around $80,000–$90,000 early on and then declined to roughly $40,000."],
    features: ["Highest and lowest points", "Overall trends", "Significant changes and intersections"],
  },
  {
    slug: "bar-chart", title: "Describing a Bar Graph", purpose: "Bar charts compare values between items, groups, or periods.", image: "/ielts/task1-guideline/bar-chart.png", alt: "Hours tourists spent on leisure activities in Greece",
    analysis: ["What is the main subject?", "Which units are used?", "Are the bars ordered?", "How many categories or groups are compared?", "What overall pattern is visible?"],
    approach: ["Identify categories on one axis and values on the other.", "Look for contrasts, similarities, clusters, and outliers."],
    overview: ["State the main similarities or differences.", "Identify the highest and lowest values.", "Mention the most striking contrast."],
    body: ["Group related categories logically.", "Use selected figures to make comparisons.", "Highlight important gaps instead of reporting every bar."],
    vocabulary: ["large, small, significant, marginal, highest, lowest", "in contrast, whereas, on the other hand, similarly, respectively"],
    tense: ["Use present simple when no finished period is given.", "Use past simple for completed dates or periods."],
    answer: ["The bar chart compares the daily hours tourists from four countries spent on three leisure activities in Greece in August 2019.", "Overall, reading was most popular among Chinese tourists, while the other nationalities spent most time at the beach. Sightseeing generally received the least time.", "Chinese visitors read for eight hours, compared with three at the beach and one sightseeing. Americans and Turks each spent twelve hours in total, though Americans read for one hour longer. Brazilians spent six hours at the beach, four reading, and two visiting places."],
    features: ["Highest and lowest bars", "Most and least popular categories", "Significant differences"],
  },
  {
    slug: "pie-chart", title: "Describing a Pie Chart", purpose: "Pie charts show how a whole is divided into percentages or proportions.", image: "/ielts/task1-guideline/pie-chart.png", alt: "Energy capacity in 2015 and projected capacity in 2040",
    analysis: ["What does each chart represent?", "Which proportions are shown?", "What are the largest and smallest slices?", "Which differences are significant?", "What conclusion can be drawn?"],
    approach: ["Identify each category and its proportion.", "Prioritise dominant, minor, increasing, and decreasing shares."],
    overview: ["Name the dominant and smallest segments.", "Summarise the major shift between charts.", "Avoid detailed percentages here."],
    body: ["Group comparable slices.", "Report selected percentages or fractions.", "Explain meaningful differences and changes."],
    vocabulary: ["percentage, fraction, share, proportion, account for, comprise", "marked, slight, considerable, significant", "corresponding to, contributing to"],
    tense: ["Use present simple for current proportions.", "Use past for historical data and future forms for projections."],
    answer: ["The charts compare energy capacity in 2015 with projections for 2040, measured in gigawatts.", "Overall, total capacity is expected to rise considerably. Fossil fuels will remain the largest source despite a falling share, while solar and wind will become more important.", "Fossil fuels represented 64% in 2015, ahead of other renewables at 23%; wind, nuclear, and solar contributed 5%, 6%, and 2%. By 2040, fossil fuels are forecast to fall to 44%, while solar and wind rise to 18% and 12%. Other renewables will account for 21% and nuclear for 5%."],
    features: ["Largest and smallest segments", "Most and least represented groups", "Important proportional changes"],
  },
  {
    slug: "table", title: "Describing a Table", purpose: "Tables present measurements in rows and columns for structured comparison.", image: "/ielts/task1-guideline/table.png", alt: "Estimated literacy rates by region and gender",
    analysis: ["What is the table’s subject?", "Which variables are compared?", "How are values organised?", "Which patterns or gaps stand out?", "What are the highest and lowest figures?"],
    approach: ["Read every row and column heading and unit.", "Look for rankings, patterns, exceptions, and useful comparisons."],
    overview: ["State the highest and lowest values.", "Summarise the dominant pattern or gap."],
    body: ["Group rows or columns logically.", "Support comparisons with selected figures.", "Highlight exceptions rather than listing every cell."],
    vocabulary: ["highest, lowest, majority, minority, almost, approximately", "in contrast, compared with, while, similarly"],
    tense: ["Choose the tense from the table’s date.", "Use present simple to describe the visual: “The table presents …”"],
    answer: ["The table compares estimated male and female literacy in five regions in 2000–2004 and gives world averages.", "Overall, Europe recorded the highest rates and almost no gender gap, whereas Africa had the lowest figures. Male literacy exceeded female literacy everywhere.", "Europe’s total was 98.8%, followed by the Americas and Oceania at 93.6% and 93.4%. Asia stood at 79.3%, with 85.9% for men and 72.5% for women. Africa showed the largest disparity: 71.6% for men versus 53.9% for women."],
    features: ["Highest and lowest values", "Rankings and patterns", "Significant gaps or exceptions"],
  },
  {
    slug: "map", title: "Describing a Map", purpose: "Maps show the layout of a place or changes to a location over time.", image: "/ielts/task1-guideline/map.png", alt: "Nelson in 2000 compared with Nelson today",
    analysis: ["What location is shown?", "Is a scale or compass provided?", "Which landmarks matter?", "What overall development is visible?", "What was added, removed, relocated, or unchanged?"],
    approach: ["Identify roads, buildings, landmarks, boundaries, and open spaces.", "Compare maps systematically by area or direction.", "Track changes in land use."],
    overview: ["Summarise the scale and nature of development.", "Mention the most important unchanged feature."],
    body: ["Describe changes in a logical spatial order.", "Use directions and relative locations.", "Group additions, removals, and conversions."],
    vocabulary: ["north of, adjacent to, opposite, alongside, surrounded by", "constructed, converted, demolished, expanded, replaced, remained unchanged"],
    tense: ["Use past forms for the earlier map and present forms for the current map.", "Use passive voice when the change is more important than the agent."],
    answer: ["The maps illustrate how Nelson changed between 2000 and the present day.", "Overall, the town has become more modern and accessible, with new accommodation, transport, shopping, and leisure facilities. The university and port remain, but their surroundings have been extensively redeveloped.", "A hall of residence replaced the trees north-west of the university, while a shopping centre was built to the north-east. A new station and tramline now serve the university. The centre gained bicycle rental, the road by the port became pedestrian-only, and a restaurant, covered market, bars, and clubs were added."],
    features: ["Locations of facilities", "Distance and direction", "Additions, removals, and unchanged areas"],
  },
  {
    slug: "process", title: "Describing a Process or Diagram", purpose: "Process diagrams show stages, inputs, transformations, and outputs in order.", image: "/ielts/task1-guideline/process-diagram.png", alt: "The recycling process for aluminium cans",
    analysis: ["What process is shown?", "Where does it begin and end?", "What are the main stages?", "Which inputs, outputs, or transformations appear?", "Is it linear or cyclical?"],
    approach: ["Number the stages in the correct order.", "Identify inputs, outputs, transformations, loops, and alternative routes."],
    overview: ["State the number and type of stages.", "Identify the start and final outcome.", "Say whether the process is cyclical or linear."],
    body: ["Describe every stage in sequence.", "Group early and later stages logically.", "Report only what the diagram shows; do not speculate."],
    vocabulary: ["collect, sort, compress, heat, melt, roll, manufacture, reuse", "initially, next, after this, subsequently, finally"],
    tense: ["Use present simple for a general process.", "Use passive voice when the material is the focus: “The cans are collected.”"],
    answer: ["The diagram illustrates how aluminium cans are recycled in a cyclical process.", "Overall, used cans pass through collection, preparation, heating, and manufacturing before becoming new cans that can re-enter the cycle.", "First, cans are collected and transported to a recycling centre, where they are cleaned, sorted, shredded, and compressed. The aluminium is heated until it melts and then rolled into sheets 2.5–6 mm thick. New cans are manufactured from these sheets and returned to use; approximately 74% are recycled in the UK."],
    features: ["Starting and ending points", "Main stages in order", "Transformations and repeated cycles"],
  },
  {
    slug: "combination", title: "Describing a Combination", purpose: "Combination tasks contain two or more visuals whose information must be connected.", image: "/ielts/task1-guideline/combination.png", alt: "Pie chart and table about transport and car use in Edmonton",
    analysis: ["Which visual types are included?", "What shared topic do they cover?", "How are the visuals related?", "What overall pattern is shown?", "What conclusion is supported by both?"],
    approach: ["Read each visual separately before looking for links.", "Select patterns, contrasts, and relationships that answer the shared task."],
    overview: ["Summarise the main feature of each visual.", "State the most important relationship between them."],
    body: ["Describe key data from each visual.", "Compare related information across visuals.", "Select figures instead of reporting everything."],
    vocabulary: ["Use language appropriate to each visual.", "Connect them with whereas, in comparison, in addition, and moreover.", "Refer clearly to the chart, table, former, and latter."],
    tense: ["Choose tense from each visual’s time frame.", "Keep tense consistent when comparing related information."],
    answer: ["The table shows why people in Edmonton use cars, while the pie chart gives the proportions using four types of transport.", "Overall, cars are the most common mode, although light rail also accounts for a substantial share. Commuting is the main reason for car use.", "Cars represent 45% of transport, compared with 35% for light rail; buses and taxis each account for 10%. Regarding car use, 55% commute to work, 45% travel for business, and 40% take children to school. Shopping and leisure are joint lowest at 15%."],
    features: ["Main feature of each visual", "Connections between datasets", "Comparisons supported by figures"],
  },
];

function List({ items }: { items: string[] }) {
  return <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" /><span>{item}</span></li>)}</ul>;
}

export default function Task1GuidelinePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8"><Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized /><Navbar /></div></header>
      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/writing-task/task1" className="text-sm font-bold text-sky-700 hover:text-sky-900">← All Task 1 resources</Link>
        <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 px-7 py-10 text-white shadow-xl md:px-12 md:py-14">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">Academic writing · Task 1</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">The complete visual-question guideline</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Learn how to analyse, organise, and write about every common Academic Task 1 visual. Every section includes an example, planning questions, language advice, and a model response.</p>
          <nav aria-label="Guide sections" className="mt-8 flex flex-wrap gap-2">{guides.map((guide, index) => <a key={guide.slug} href={`#${guide.slug}`} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20">{index + 1}. {guide.title.replace("Describing a ", "")}</a>)}</nav>
        </div>
        <aside className="mt-8 grid gap-4 rounded-3xl border border-sky-200 bg-sky-50 p-6 md:grid-cols-3 md:p-8">{[["Minimum", "150 words"], ["Recommended plan", "4 paragraphs"], ["Core skill", "Select & compare"]].map(([label, value]) => <div key={label}><p className="text-xs font-black uppercase tracking-widest text-sky-700">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></div>)}</aside>

        <div className="mt-12 space-y-12">{guides.map((guide, index) => (
          <article id={guide.slug} key={guide.slug} className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 p-6 md:p-9"><div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-700">0{index + 1}</span><div><h2 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">{guide.title}</h2><p className="mt-2 leading-7 text-slate-600">{guide.purpose}</p></div></div></header>
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 md:p-9"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><Image src={guide.image} alt={guide.alt} width={720} height={850} className="h-auto w-full" /></div><div className="mt-7 grid gap-6 sm:grid-cols-2"><section><h3 className="font-black text-slate-950">1. Analysis</h3><List items={guide.analysis} /></section><section><h3 className="font-black text-slate-950">2. Approach</h3><List items={guide.approach} /></section></div></div>
              <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-9 lg:border-l lg:border-t-0"><section><h3 className="font-black text-slate-950">3. Structure</h3><div className="mt-3 space-y-3">{[["Introduction", ["Paraphrase the question accurately."]], ["Overview", guide.overview], ["Body paragraphs", guide.body]].map(([label, points]) => <div key={label as string} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm font-black text-sky-700">{label as string}</p><List items={points as string[]} /></div>)}</div></section><section className="mt-7"><h3 className="font-black text-slate-950">4. Vocabulary</h3><List items={guide.vocabulary} /></section><section className="mt-7"><h3 className="font-black text-slate-950">5. Tense</h3><List items={guide.tense} /></section></div>
            </div>
            <div className="grid border-t border-slate-200 lg:grid-cols-[1fr_280px]"><section className="p-6 md:p-9"><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">6. Model answer</p><div className="mt-4 space-y-4 leading-7 text-slate-700">{guide.answer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section><aside className="border-t border-amber-200 bg-amber-50 p-6 md:p-8 lg:border-l lg:border-t-0"><h3 className="font-black text-amber-950">Key features to identify</h3><List items={guide.features} /></aside></div>
          </article>
        ))}</div>
        <section className="mt-12 rounded-3xl bg-sky-700 p-7 text-white md:p-10"><h2 className="text-3xl font-black">Final Task 1 checklist</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{["Paraphrase the task accurately.", "Write a clear overview of the biggest features.", "Group related information logically.", "Support comparisons with selected data.", "Use the correct tense and units.", "Do not add opinions or explanations not shown by the visual."].map((item) => <div key={item} className="flex gap-3 rounded-xl bg-white/10 p-4"><span className="font-black text-sky-200">✓</span><span>{item}</span></div>)}</div></section>
      </section>
    </main>
  );
}
