"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const B = ({ children }: { children: React.ReactNode }) => <strong>{children}</strong>;

const questions = [
  {
    prompt: "Task 1: The chart below shows the number of girls per 100 boys enrolled in different levels of school education.",
    image: "/ielts/bar chart/01.png",
    alt: "Girls per 100 boys enrolled at different education levels",
    paragraphs: [
      <>The bar chart compares the number of girls enrolled per 100 boys in primary, secondary and tertiary education in developing and developed countries in 1990 and 1998, with 100 representing the target for gender parity.</>,
      <>Overall, female enrollment rates increased in both groups of countries during the period. However, developing countries remained below the target level at all educational stages, whereas developed countries achieved near gender parity in primary and secondary education and exceeded the target in tertiary education.</>,
      <>In developing countries, the <B>figures rose from</B> 83 to 95 in primary education and from 72 to 98 in secondary education. Tertiary education recorded the <B>lowest ratios, increasing from</B> only 66 girls per 100 boys in 1990 to 75 in 1998. <B>Despite these improvements, none of the categories met the target.</B></>,
      <>By contrast, developed countries consistently recorded higher enrollment rates. Primary and secondary education increased slightly from 87 to 96 and from 82 to 99, <B>respectively</B>. In tertiary education, the <B>ratio rose substantially</B> from 105 to 112, surpassing the target in both years.</>,
    ],
  },
  {
    prompt: "Task 2: The bar chart below shows the percentage of Australian men and women in different age groups who did regular physical activity in 2010.",
    image: "/ielts/bar chart/02.png",
    alt: "Australian men and women doing regular physical activity in 2010",
    paragraphs: [
      <>The bar chart illustrates the percentages of Australian men and women in different age groups who participated in regular physical activity in 2010.</>,
      <>Overall, women were more physically active than men in all age groups except those aged 15 to 24. Female participation <B>remained relatively stable</B> at just above 50% across most categories, whereas men&apos;s rates <B>showed greater variation</B>.</>,
      <>Among the youngest group, 53% of men exercised regularly, compared with 48% of women. However, from the age of 25 onwards, women consistently recorded higher participation rates. In the 25–34 age group, 49% of women were physically active, compared with 42% of men. The largest gap was observed among those aged 35–44, when 53% of women exercised regularly, while the figure for men fell to only 39%.</>,
      <>Male participation then <B>gradually increased with age</B>, reaching 47% among people aged 65 and over. By contrast, women&apos;s rates remained fairly stable, peaking at 54% among 45–54-year-olds before declining slightly to 47% in the oldest age group.</>,
    ],
  },
  {
    prompt: "Task 3: The world production output from Asia, Europe, and the rest of the world in different years.",
    image: "/ielts/bar chart/03.png",
    alt: "World production output from Asia, Europe and the rest of the world",
    paragraphs: [
      <>The bar chart compares the proportion of world production output contributed by Asia, Europe, and the rest of the world in five different years between 1840 and 2000.</>,
      <>Overall, Europe dominated global production during the late nineteenth and early twentieth centuries, reaching its highest level in 1920. By contrast, Asia started as the leading producer in 1840, experienced a substantial decline over the following decades, and then recovered strongly to regain first place by 2000. Meanwhile, the contribution of the rest of the world <B>generally increased over the period</B> despite some fluctuations.</>,
      <>In 1840, Asia accounted for 50% of global production, compared with 40% for Europe and only 10% for the rest of the world. By 1880, Asia&apos;s share had <B>fallen sharply</B> to 30%, while Europe rose to 45%, becoming the largest producer. Europe reached a peak of 50% in 1920, whereas Asia <B>dropped further</B> to just 20%. During the same period, the rest of the world <B>increased steadily</B> from 10% to 30%.</>,
      <>After 1920, Europe&apos;s share <B>declined continuously</B>, falling to about 28% in 2000. In contrast, Asia recovered to 45%, the highest figure at the end of the period, while the rest of the world finished at <B>approximately 32%</B>.</>,
    ],
  },
  {
    prompt: "Task 4: The chart below shows the donation given to six different types of charity by one company from 2012 to 2014.",
    image: "/ielts/bar chart/04.png",
    alt: "Donations by one company to six types of charity from 2012 to 2014",
    paragraphs: [
      <>The bar chart compares the <B>amount of money</B> donated by one company to six different types of charity between 2012 and 2014.</>,
      <>Overall, social welfare consistently received by far the largest share of funding, while wildlife and arts attracted the least <B>financial support</B> throughout the period. Although <B>donations</B> fluctuated in some categories, total <B>contributions</B> generally increased by 2014.</>,
      <>In detail, <B>funding</B> for social welfare stood at about 22 units in 2012 before dropping <B>significantly</B> to around 16 in 2013. It then rose sharply to <B>approximately</B> 24 in 2014, the highest figure on the chart. Donations to education remained relatively stable at around 8 units in both 2012 and 2014, with a slight <B>decline</B> to 6 in 2013. Similarly, environmental charities received roughly 8, 5 and 7 units over the three years.</>,
      <>Health-related donations increased steadily from around 6 in 2012 to 7 in 2013 and reached approximately 9 in 2014. Wildlife and arts received the smallest amounts, although both experienced modest growth, rising from about 3 units in 2012 to around 5 and 4 units respectively by the end of the period.</>,
    ],
  },
  {
    prompt: "Task 5: The bar chart below shows the percentage of Australian men and women in different age groups who did regular physical activity in 2010.",
    image: "/ielts/bar chart/05.png",
    alt: "Australian men and women doing regular physical activity by age group",
    paragraphs: [
      <>The bar chart compares the percentages of Australian men and women in six age groups who took part in regular physical activity in 2010.</>,
      <>Overall, women were more physically active than men in every age category except the youngest group. Female participation generally rose with age before falling slightly among those aged 65 and over, whereas the male rate declined sharply at first and then recovered gradually.</>,
      <>Among 15 to 24 year olds, 52.8% of men exercised regularly, compared with 47.7% of women. <B>However</B>, in the 25 to 34 group, the female figure increased to 48.9%, while the male rate dropped to 42.2%. The largest gender gap appeared among people aged 35 to 44, when 52.5% of women were active, compared with only 39.5% of men.</>,
      <>For the older groups, female participation remained just above 53% among people aged 45 to 54 and 55 to 64. <B>By contrast</B>, the corresponding male figures were 43.1% and 45.1%. In the oldest category, the rates were almost identical, at 46.7% for men and 47.1% for women.</>,
    ],
  },
  {
    prompt: "Task 6: The chart below shows the percentage of children in a European country who took part in four kinds of activities in 2009. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    image: "/ielts/bar chart/06.png",
    alt: "Children participating in four kinds of activities in 2009",
    paragraphs: [
      <>The bar chart compares the percentages of children in three age groups who participated in four leisure activities in 2009: watching television, reading comics, playing video games and riding bikes.</>,
      <>Overall, watching TV was <B>most popular among the youngest children</B>, whereas riding bikes attracted <B>the highest proportion</B> of 12–15 year olds. In contrast, playing video games was least common among the oldest group.</>,
      <>About 95% of children aged 5–8 watched television, compared with roughly 80% in both older groups. Reading comics was less popular and <B>varied little by age</B>, at around 62% for 5–8-year-olds and approximately 65% for the other two groups.</>,
      <>Participation in video games <B>declined with age</B>, from about 60% among the youngest group to nearly 58% for 9–11 year olds and only 40% for 12–15 year olds. Bike riding showed the opposite pattern: around 67% of the youngest and 61% of the middle group rode bikes, while <B>the figure climbed sharply</B> to just over 80% among the oldest children.</>,
    ],
  },
  {
    prompt: "Task 7: The chart below shows the percentage of adults of different age groups in the UK who used the internet every day from 2003 to 2006.",
    image: "/ielts/bar chart/07.png",
    alt: "UK adults by age group using the internet from 2003 to 2006",
    paragraphs: [
      <>The bar chart compares the <B>proportion</B> of adults in five age groups who used the Internet between 2003 and 2006 in the UK.</>,
      <>Overall, Internet use was highest among younger adults and lowest among people aged 65 and over. Most age groups showed a steady rise over the period, although the figure for 16- to 24-year-olds peaked in 2005 before falling slightly in 2006.</>,
      <>Among the youngest group, usage stood at about 80% in both 2003 and 2004, climbed to 100% in 2005, and then dropped to 90% in 2006. For those aged 25–44, the rate increased consistently from 50% to 80%. A similar pattern can be seen among 45 to 54 year olds, whose percentage rose from 60% in 2003 to 80% in 2006.</>,
      <>Internet use was much lower among older adults. In the 55–64 group, the figure grew from 30% to around 35% in 2004 and 2005, before reaching 50% in 2006. The 65+ group recorded the lowest levels, at roughly 15% for the first three years and 20% in 2006.</>,
    ],
  },
  {
    prompt: "Task 8: The chart below shows the total number of minutes (in billions) of telephone calls in the UK, divided into three categories, from 1995–2002. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    image: "/ielts/bar chart/08.png",
    alt: "Total minutes of UK telephone calls by category from 1995 to 2002",
    paragraphs: [
      <>The bar chart compares the total <B>time</B> spent on three <B>types</B> of telephone calls in the UK between 1995 and 2002, measured in billions of minutes.</>,
      <>Overall, local fixed-line calls were the most popular throughout the period, although their usage rose initially and then declined. By contrast, national and international fixed-line calls, as well as mobile calls, <B>increased steadily</B>, with mobiles showing the fastest growth.</>,
      <>Local calls climbed from about 72 billion minutes in 1995 to a peak of roughly 90 billion in 1999. After that, the figure fell gradually, reaching approximately 72 billion again by 2002. Meanwhile, national and international calls grew consistently from around 37 billion minutes in 1995 to just over 60 billion at the end of the period.</>,
      <>Mobile phone calls accounted for only about 3 billion minutes in 1995. Their use rose slowly to around 13 billion in 1999, before increasing sharply to 24 billion in 2000, 39 billion in 2001 and approximately 45 billion minutes in 2002.</>,
    ],
  },
  {
    prompt: "Task 9: The chart below shows the percentage of the total world population in 4 countries in 1950 and 2003, and predictions for 2050. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/bar chart/09.png",
    alt: "World population shares of India, China, the USA and Japan",
    paragraphs: [
      <>The bar chart compares the proportions of the world&apos;s population living in India, China, the USA and Japan in 1950 and 2002, with predictions for 2050.</>,
      <>Overall, China had the largest share in the first two years, whereas India is expected to become the leading country by 2050. By contrast, the percentages for the USA and Japan were much lower, and Japan is predicted to experience the sharpest decline.</>,
      <>In 1950, China accounted for approximately 23% of the global population, <B>considerably higher than</B> India&apos;s figure of 15%. By 2002, China&apos;s proportion had fallen to 20%, while India&apos;s had risen to about 17%. This trend is forecast to continue, with India increasing to roughly 19% in 2050 and China decreasing significantly to 15%.</>,
      <>The USA represented around 7% of the world&apos;s population in 1950, before dropping to 5% in 2002, where it is expected to remain in 2050. Japan&apos;s share also declined, from about 4% in 1950 to 3% in 2002, and it is projected to fall further to only 1%.</>,
    ],
  },
  {
    prompt: "Task 10: The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.",
    image: "/ielts/bar chart/10.png",
    alt: "Households in owned and rented accommodation from 1918 to 2011",
    paragraphs: [
      <>The bar chart compares the percentages of households living in owned and rented accommodation in the UK between 1918 and 2011.</>,
      <>Overall, home ownership <B>rose substantially over the period</B>, while renting followed the opposite trend. The two figures were equal in 1971, and ownership reached its highest level in 2001 before declining slightly.</>,
      <>In 1918, only about 22% of households owned their homes, compared with roughly 78% who rented. Ownership then increased to around 31% in both 1939 and 1953, before climbing to approximately 42% in 1961. By 1971, the proportions of owners and renters were identical, at 50% each.</>,
      <>After 1971, owner-occupied housing became more common. The figure rose to 60% in 1981 and about 68% in 1991, peaking at nearly 70% in 2001. Meanwhile, the percentage of renters fell from 40% to around 31%. In 2011, ownership dropped modestly to about 64%, whereas renting increased to approximately 36%.</>,
    ],
  },
];

export default function BarChartPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          <Navbar />
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="space-y-6">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.image} className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/60 shadow-sm">
                <button type="button" onClick={() => setOpenIndex((current) => (current === index ? null : index))} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <p className="text-base leading-8 text-slate-700">{item.prompt}</p>
                  <span className="shrink-0 text-2xl text-sky-700">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-sky-100 bg-white px-5 py-6">
                    <div className="relative mx-auto aspect-[16/10] w-full max-w-2xl">
                      <Image src={item.image} alt={item.alt} fill className="object-contain" unoptimized />
                    </div>
                    <div className="mt-8 space-y-4">
                      {item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex} className="text-base leading-8 text-slate-700">{paragraph}</p>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
