"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const questions = [
  {
    prompt: "Task 1: The chart below shows the changes that took place in three different areas of crime in Newport city centre from 2003 to 2012. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    image: "/ielts/01.png",
    alt: "Line chart showing burglary, car theft, and robbery in Newport city centre from 2003 to 2012",
    paragraphs: [
      <>The line chart illustrates changes in three types of crime burglary, car theft and robbery in Newport city centre from 2003 to 2012.</>,
      <>Overall, burglary experienced a <span className="font-bold">dramatic downward trend</span>, whereas car theft <span className="font-bold">remained comparatively stable despite noticeable fluctuations</span>. By contrast, robbery <span className="font-bold">consistently accounted for the lowest number of incidents and showed only marginal variation</span> throughout the period.</>,
      <>In 2003, burglary stood at approximately 3,400 cases, making it the most prevalent offence at the start of the period. This figure rose to a peak of nearly 3,750 in 2004 before falling sharply to about 1,200 by 2008. Following this substantial decline, burglary levels stabilised with minor fluctuations, finishing at around 1,300 incidents in 2012, which represents <span className="font-bold">a reduction of more than half compared with the initial figure</span>.</>,
      <>Car theft displayed a different pattern, beginning at roughly 2,800 incidents in 2003 and fluctuating moderately over the following years. Although the number dropped to around 2,000 in 2006, it subsequently recovered, reaching a peak of approximately 2,700 in 2010 before declining slightly by the end of the period. Meanwhile, robbery remained the least common crime, varying between about 500 and 900 cases, with <span className="font-bold">no clear upward or downward trend</span>. Throughout the period, car theft consistently occurred at <span className="font-bold">a significantly higher rate than robbery</span>.</>,
    ],
  },
  {
    prompt: "Task 2: The graph below shows the sales of children's books, adult fiction and educational books between 2002 and 2006 in one country. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    image: "/ielts/02.png",
    alt: "Line chart showing sales of children's books, adult fiction, and educational books between 2002 and 2006",
    paragraphs: [
      <>This line chart illustrates the changes in sales of three different kinds of books: children&apos;s books, adult fiction, and educational books in one country over the period from 2002 to 2006, with values measured in millions of dollars.</>,
      <>Overall, children&apos;s books experienced <span className="font-bold">substantial growth</span> and became <span className="font-bold">the best-selling category by the end of the period</span>. In contrast, adult fiction showed <span className="font-bold">an overall downward trend</span> despite a brief recovery, whereas educational books <span className="font-bold">remained relatively stable</span> at a considerably lower level throughout.</>,
      <>In 2002, adult fiction dominated the market, with sales of approximately 45 million dollars, compared with around 34 million for children&apos;s books and 25 million for educational books. However, children&apos;s books rose sharply to about 43 million dollars in 2003 and continued their upward trajectory, peaking at nearly 57 million dollars by 2006.</>,
      <>By contrast, adult fiction sales fell sharply to roughly 38 million dollars in 2003 before recovering modestly to 41 million the following year. Thereafter, the figure declined steadily, reaching just 30 million dollars in 2006. Educational books, meanwhile, fluctuated only slightly between 25 and 31 million dollars over the entire period, showing no clear overall trend.</>,
    ],
  },
  {
    prompt: "Task 3: The line graph below shows the population size, birth rate and death rate of England and Wales from 1700 to 2000. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    image: "/ielts/03.png",
    alt: "Line graph showing population size, birth rate, and death rate in England and Wales from 1700 to 2000",
    paragraphs: [
      <>The line graph illustrates the changes in population size, birth rate, and death rate in England and Wales from 1700 to 2000. Population figures are measured in millions, while birth and death rates are expressed per 1,000 people.</>,
      <>Overall, the population increased significantly throughout the period and became <span className="font-bold">the dominant trend by the end of the timeline</span>. In contrast, both birth and death rates generally declined over time, although birth rate showed <span className="font-bold">a slight recovery in the final year</span>.</>,
      <>In 1700, the birth rate was approximately 30 per 1,000 people, which was higher than the death rate at around 25. At the same time, the population size was only about 3 million. By 1750, the birth and death rates had risen considerably to roughly 40 and 37 respectively, while the population also increased to around 10 million. Between 1750 and 1800, however, the population <span className="font-bold">fell back to nearly 3 million</span>, whereas the other two figures <span className="font-bold">remained almost unchanged</span>.</>,
      <>After 1800, the population grew steadily and then sharply, reaching around 10 million in 1850, 22 million in 1900, and approximately 45 million in 1950. By 2000, it had peaked at about 50 million. Meanwhile, the birth rate gradually decreased from 40 to nearly 22 per 1,000 people in 1950 <span className="font-bold">before recovering to around 33 in 2000</span>. Similarly, the death rate <span className="font-bold">declined consistently to 20 per 1,000</span> and <span className="font-bold">remained stable at that level</span> until the end of the period.</>,
    ],
  },
  {
    prompt: "Task 4: The line graph below shows the number of overseas visitors who came to the UK for different purposes between 1989 and 2009. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
    image: "/ielts/04.png",
    alt: "Line graph showing overseas visitors to the UK for business, holiday, and visiting friends and relatives between 1989 and 2009",
    paragraphs: [
      <>The line graph illustrates the number of visitors, measured in millions, who travelled for three different purposes: business, holidays, and visiting friends and relatives in the UK between 1989 and 2009.</>,
      <>Overall, holiday travel was <span className="font-bold">the most popular purpose throughout most of the period, despite some fluctuations</span>. Meanwhile, both business travel and visits to friends and relatives generally increased over time, although business travel <span className="font-bold">experienced a slight decline at the end</span>.</>,
      <>In 1989, around 6.5 million people travelled for holidays, compared to 5 million business visitors and approximately 3.5 million people visiting friends and relatives. Holiday travel then rose sharply, <span className="font-bold">reaching a peak of about 9 million in the late 1990s before falling to just over 6 million by 2004</span>. In contrast, business travel <span className="font-bold">dropped initially to around 4 million</span> before increasing steadily to nearly 8 million in 2009.</>,
      <>Visits to friends and relatives showed <span className="font-bold">the most consistent upward trend</span> during the period. Starting at approximately 3.5 million in 1989, the figure increased gradually throughout the years, reaching nearly 7 million by the end of the timeframe, despite a slight decline in the final stage.</>,
    ],
  },
  {
    prompt: "Task 5: The graph below shows the spending on research into renewable sources of energy in four countries between 1975 and 2000. Summarize the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/05.png",
    alt: "Line graph showing spending on research into renewable energy in Switzerland, Denmark, Spain, and the UK between 1975 and 2000",
    paragraphs: [
      <>The line graph illustrates the amount of money spent per person on research into renewable energy in four European countries — Switzerland, Denmark, Spain and the UK — between 1975 and 2000.</>,
      <>Overall, UK invested the most in renewable energy research and experienced <span className="font-bold">a dramatic increase</span> throughout the period. Denmark also showed <span className="font-bold">a considerable upward trend, particularly after 1990</span>. In contrast, spending in Spain and the Switzerland remained <span className="font-bold">relatively low and fluctuated slightly</span>, with both countries ending the period at levels well below those of UK and Denmark.</>,
      <>In 1975, expenditure was negligible in all four countries. By 1980, spending had risen to approximately $2 per person in UK, while Denmark, Spain and the Switzerland each allocated around $1. Thereafter, UK investment increased steadily, reaching about $3 in 1985 and $3.5 in 1990. Growth then accelerated, with spending climbing to nearly $4.5 in 1995 before peaking at $5 per person in 2000.</>,
      <>Denmark&apos;s expenditure remained fairly stable at around $1.2 between 1980 and 1990. However, it rose sharply during the following decade, reaching approximately $2.9 in 1995 and $3.5 by 2000. By contrast, the Switzerland showed <span className="font-bold">a gradual decline</span> after 1980, falling from about $1.1 to only $0.2 at the end of the period. Spain followed a fluctuating pattern, dropping to around $0.4 in 1990 before recovering to nearly $1 in 1995 and then finishing slightly lower at about $0.7 in 2000.</>,
    ],
  },
  {
    prompt: "Task 6: The chart below shows three different types of crime in England and Wales from 1970 to 2005. Summarize the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/06.png",
    alt: "Line graph comparing car theft, house burglary, and street robbery in England and Wales from 1970 to 2005",
    paragraphs: [
      <>The line graph compares the number of incidents of car theft, house burglary and street robbery between 1970 and 2005, measured in millions.</>,
      <>Overall, car theft was <span className="font-bold">consistently the most common crime and experienced the most significant fluctuations</span>. House burglary remained the second most prevalent offence, while street robbery had the fewest cases throughout the period.</>,
      <>In 1970, car theft stood at 0.4 million cases, twice the figure for house burglary (0.2 million). Both crimes increased over the following two decades, with car theft reaching 1.0 million and burglary rising to 0.7 million by 1990. Car theft then <span className="font-bold">climbed sharply</span> to a peak of 1.6 million in 1995 before declining to 1.0 million in 2005.</>,
      <>By contrast, house burglary showed only moderate changes. After peaking at around 0.7 million in the early 1990s, it gradually fell to 0.5 million by the end of the period. Street robbery remained negligible until 1990 but rose steadily thereafter, reaching 0.2 million in 2000 and remaining stable in 2005.</>,
    ],
  },
  {
    prompt: "Task 7: The graph below shows the total births and the deaths in a European country from 1950 to 2050. Summarize the information by selecting and reporting the main features and give comparisons where relevant.",
    image: "/ielts/07.png",
    alt: "Line graph comparing births and deaths in a European country from 1950 to 2050",
    paragraphs: [
      <>The line graph compares the total numbers of births and deaths in a European country from 1950 to 2050.</>,
      <>Overall, births experienced <span className="font-bold">considerable fluctuations</span>, whereas deaths remained <span className="font-bold">relatively stable for most of the period before rising sharply at the end</span>. While births remained <span className="font-bold">above deaths throughout most of the period</span>, deaths overtook births by 2050.</>,
      <>In 1950, there were about 750,000 births and 700,000 deaths. Births then rose dramatically to a peak of 1 million in 1970 before falling to approximately 600,000 in 1990. By contrast, deaths increased slightly to around 730,000 in 1970 and then declined to about 700,000 by 1990.</>,
      <>After 1990, births recovered to roughly 700,000 in 2010 and remained stable until 2050. After dropping modestly to around 680,000 in 2030, deaths climbed considerably, reaching about 800,000 by 2050. As a result, deaths are projected to exceed births by about 100,000 at the end of the period.</>,
    ],
  },
  {
    prompt: "Task 8: The graph below provides information on the number of students from the US, UK and Australia who studied in other countries between 2002 and 2007. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/08.png",
    alt: "Line graph comparing the number of students from the US, UK, and Australia studying abroad between 2002 and 2007",
    paragraphs: [
      <>The line graph compares the number of people migrating to three different countries: the US, the UK and Australia between 2002 and 2007.</>,
      <>Overall, the US remained <span className="font-bold">the most popular destination throughout the period</span>, despite experiencing a slight decline in the middle years. By contrast, the UK recorded <span className="font-bold">a continuous fall after 2003</span>, while Australia&apos;s figure stayed unchanged at a much lower level.</>,
      <>In 2002, immigration to the US stood at just under 50,000 people, compared with 30,000 in the UK and 10,000 in Australia. The American figure then decreased gradually to approximately 46,000 in 2004 <span className="font-bold">before recovering steadily</span>. By 2007, it had risen to around 50,000, the highest value shown on the chart.</>,
      <>The trend in the UK was <span className="font-bold">markedly different</span>. After remaining stable at 30,000 between 2002 and 2003, the number of migrants declined consistently over the following four years, reaching 22,000 by 2007. Meanwhile, Australia experienced <span className="font-bold">no noticeable change</span>, with immigration remaining constant at <span className="font-bold">about 10,000 throughout the entire period</span>. As a result, the gap between the US and the other two countries <span className="font-bold">widened considerably by the end of the timeframe</span>.</>,
    ],
  },
  {
    prompt: "Task 9: The line graph below shows cinema attendance in Great Britain from 2000 to 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    image: "/ielts/09.png",
    alt: "Line graph showing cinema attendance by age group in Great Britain from 2000 to 2011",
    paragraphs: [
      <>The line graph compares the percentages of people in four age groups who attended the cinema in Great Britain between 2000 and 2011.</>,
      <>Overall, cinema attendance <span className="font-bold">increased across all age categories</span> over the period. The 15–24 age group <span className="font-bold">consistently recorded the highest proportions</span>, while people aged 35 and over remained <span className="font-bold">the least frequent cinema-goers</span>. Despite some fluctuations, all groups ended the period at higher levels than they began.</>,
      <>Among younger people, attendance rose markedly. The figure for those aged 15–24 climbed from about 18% in 2000 to around 55% in 2011, <span className="font-bold">peaking at 50% in 2007</span> before experiencing a brief decline. The 7–14 group also showed <span className="font-bold">substantial growth</span>, increasing from roughly 10% to 30%, with <span className="font-bold">a high of approximately 38% in 2010</span>.</>,
      <>Attendance among adults was lower <span className="font-bold">but still generally upward</span>. For the 25–35 age group, the proportion fluctuated between 5% and 32%, reaching its highest level in 2009 before falling to 25% in the final year. Meanwhile, the percentage of people aged 35 and over rose gradually from about 2% to 12%, making it the <span className="font-bold">most stable trend on the chart</span>.</>,
    ],
  },
  {
    prompt: "Task 10: The line graph shows the percentages of Australian export with four countries. The graph below shows the percentage of Australian exports to 4 countries from 1990 to 2012. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/10.png",
    alt: "Line graph showing percentage of Australian exports to Japan, the US, China, and India from 1990 to 2012",
    paragraphs: [
      <>The line graph compares the percentage of Australian exports destined for Japan, the US, China and India between 1990 and 2012.</>,
      <>Overall, Japan remained <span className="font-bold">a major export market despite a steady decline</span>, whereas China experienced <span className="font-bold">dramatic growth and became the leading destination by the end of the period</span>. In contrast, the proportions for the US and India were <span className="font-bold">considerably lower and showed only modest fluctuations</span>.</>,
      <>In 1990, Japan accounted for approximately 26% of Australian exports, far ahead of the US at around 11%. However, Japan&apos;s share fell consistently to 20% in 1995 and then to about 17% by 2012. The figure for the US fluctuated over the period, declining from 11% to 8% in 1995 before recovering to 11% in 2000. Thereafter, it <span className="font-bold">dropped steadily to 5% in 2010</span> and ended slightly higher at 7%.</>,
      <>China and India both started from very low levels, at roughly 2% and 1% respectively in 1990. China&apos;s proportion increased gradually to 11% by 2005 before <span className="font-bold">surging to 25% in 2010</span> and reaching nearly 28% in 2012. Meanwhile, India&apos;s share remained unchanged until 2000, then rose to 7% in 2010 before falling slightly to 5% at the end of the period.</>,
    ],
  },
  {
    prompt: "Task 11: The graph below gives information about the percentage of the population in 4 Asian countries living in cities from 1970 to 2020, with predictions for 2030 and 2040. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/11.png",
    alt: "Line graph showing percentage of the population living in cities in the Philippines, Malaysia, Thailand, and Indonesia from 1970 to 2040",
    paragraphs: [
      <>The line graph compares the proportions of people living in urban areas in the Philippines, Malaysia, Thailand and Indonesia between 1970 and 2040, with projections for 2030 and 2040.</>,
      <>Overall, urbanization is expected to increase in all four countries. Malaysia records the highest percentages throughout most of the period and is <span className="font-bold">projected to remain the most urbanized nation by 2040</span>. In contrast, Thailand has the lowest figures for <span className="font-bold">much of the timeline</span>, while Indonesia experiences the <span className="font-bold">most substantial growth after 2000</span>.</>,
      <>In 1970, around one-third of the population in both the Philippines and Malaysia lived in cities, compared with approximately 18% in Thailand and 14% in Indonesia. The proportion for the Philippines rose to a peak of about 49% in 1990 before declining slightly to 43% in 2010. Thereafter, it is predicted to <span className="font-bold">recover steadily</span>, reaching roughly 56% by 2040. Meanwhile, Malaysia witnessed <span className="font-bold">uninterrupted growth</span>, climbing from 30% to approximately 84% over the period.</>,
      <>Thailand&apos;s urban population <span className="font-bold">increased gradually</span> from 18% in 1970 to around 33% in 2020 before accelerating to 50% by 2040. Indonesia followed a stronger upward trajectory, rising from 14% to 30% by 2000 and then <span className="font-bold">surging to about 64% in 2040</span>, overtaking both Thailand and the Philippines.</>,
    ],
  },
  {
    prompt: "Task 12: The graph below shows the consumption of 3 spreads from 1981 to 2007. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/12.png",
    alt: "Line graph showing consumption of margarine, butter, and low-fat and reduced-fat spreads from 1981 to 2007",
    paragraphs: [
      <>The line graph compares the consumption of three types of spreads—margarine, butter, and low-fat and reduced-fat spreads—between 1981 and 2007, measured in grams.</>,
      <>Overall, butter was <span className="font-bold">the most widely consumed spread at the beginning of the period</span> but experienced a <span className="font-bold">substantial decline thereafter</span>. By contrast, low-fat and reduced-fat spreads, introduced later, gained popularity rapidly and became <span className="font-bold">the most consumed product by the end of the timeframe</span>. Meanwhile, margarine showed a <span className="font-bold">generally downward trend</span> despite some fluctuations.</>,
      <>In 1981, butter consumption stood at approximately 141 grams, significantly higher than margarine at around 90 grams. Butter then peaked at nearly 160 grams in 1986 before falling sharply to 100 grams in 1991 and continuing to decline steadily to just 50 grams by 2007. Margarine, on the other hand, decreased slightly from 90 to 80 grams between 1981 and 1986 before rising to 100 grams in both 1991 and 1996.</>,
      <>Low-fat and reduced-fat spreads first appeared in 1996 at only 10 grams. Their consumption then surged dramatically to about 85 grams in 2001 before easing slightly to 70 grams in 2007, the highest figure among the three spreads at that time.</>,
    ],
  },
  {
    prompt: "Task 13: The line graph below shows the oil production and consumption in China between 1982 and 2006. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/13.png",
    alt: "Line graph showing oil production and consumption in China between 1982 and 2006",
    paragraphs: [
      <>The line graph compares oil production and consumption in China over the period from 1965 to 2015, measured in millions of barrels per day.</>,
      <>Overall, oil consumption <span className="font-bold">increased dramatically</span> throughout the period and <span className="font-bold">eventually exceeded production in the mid-1990s</span>. By contrast, oil production rose <span className="font-bold">only modestly</span> and <span className="font-bold">remained relatively stable</span> after an initial increase.</>,
      <>In 1965, both figures stood at approximately 2 million barrels per day. Production then climbed to around 3 million barrels by 1975 and <span className="font-bold">remained unchanged for the following decade</span>. Thereafter, it experienced <span className="font-bold">only slight growth</span>, reaching just over 3 million barrels in 1995 and about 3.5 million barrels by the end of the period.</>,
      <>Consumption followed <span className="font-bold">a markedly different pattern</span>. After remaining close to 2 million barrels per day between 1965 and 1985, it rose sharply to roughly 3.3 million in 1995, <span className="font-bold">overtaking production for the first time</span>. The upward trend continued over the next two decades, with consumption increasing to 4 million barrels in 2005 and 5 million in 2010 before peaking at approximately 6.3 million barrels per day in 2015.</>,
    ],
  },
  {
    prompt: "Task 14: A graph is shown below. It represents the average CO2 emissions per person among four European countries; Italy, Sweden, Portugal, and the United Kingdom over four decades, from 1967 to 2007. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/14.png",
    alt: "Line graph showing average CO2 emissions per person in the UK, Sweden, Italy, and Portugal from 1967 to 2007",
    paragraphs: [
      <>The line graph compares per-capita CO2 emissions in the United Kingdom, Sweden, Italy and Portugal between 1967 and 2007, measured in metric tonnes.</>,
      <>Overall, the UK remained <span className="font-bold">the largest emitter</span> throughout the period despite a gradual decline. By contrast, Italy and Portugal recorded <span className="font-bold">continued increases in emissions</span>, whereas Sweden experienced <span className="font-bold">a sharp rise followed by a considerable fall</span>. By the end of the period, Italy ranked second, while Sweden and Portugal <span className="font-bold">converged at similar levels</span>.</>,
      <>In 1967, the UK produced just under 11 metric tonnes of CO2 per person, compared with approximately 8.5 tonnes in Sweden. The figures for Italy and Portugal were substantially lower, at around 4 and 1 tonne respectively. Sweden&apos;s emissions <span className="font-bold">climbed to a peak of slightly above 10 tonnes in 1977 before dropping markedly</span> to about 5.5 tonnes by 2007. Over the same period, the UK&apos;s figure <span className="font-bold">decreased steadily</span> to roughly 8.8 tonnes.</>,
      <>Meanwhile, Italy showed <span className="font-bold">consistent growth</span>, rising from about 4.2 tonnes in 1967 to nearly 7.8 tonnes in 1997, after which it remained stable. Portugal also experienced <span className="font-bold">a continuous upward trend</span>, increasing more than fivefold to approximately 5.5 tonnes by 2007, <span className="font-bold">almost matching Sweden&apos;s final level</span>.</>,
    ],
  },
  {
    prompt: "Task 15: The graph below shows the number of inquiries received by the Tourist Information Office in one city over a six-month period in 2011. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/15.png",
    alt: "Line graph showing enquiries received by a Tourist Information Office by phone, letter/email, and in person between January and June 2011",
    paragraphs: [
      <>The line graph illustrates the number of enquiries received by a city&apos;s Tourist Information Office through three communication channels between January and June 2011.</>,
      <>Overall, enquiries made in person and by telephone <span className="font-bold">increased markedly</span> over the six-month period, whereas those sent by letter or email <span className="font-bold">declined steadily</span>. By June, face-to-face enquiries had become the most common method of contact.</>,
      <>In January, telephone enquiries were the highest at about 900, <span className="font-bold">followed by letters/emails at roughly 750</span>, while in-person enquiries accounted for only 450. Over the next two months, personal visits rose steadily to 800, while overtaking letter/emails, which remained stable at around 700 in March. Meanwhile, telephone enquiries <span className="font-bold">fluctuated slightly</span>, dipping to 800 in February <span className="font-bold">before recovering to 1,000 in March</span>.</>,
      <>From April onwards, the number of people visiting the office <span className="font-bold">increased sharply</span>, reaching approximately 1,300 and then <span className="font-bold">climbing further to 1,500 by June</span>. Telephone enquiries also grew <span className="font-bold">significantly</span>, rising from 1,000 in April to 1,600 at the end of the period. In contrast, letters and emails experienced a <span className="font-bold">continuous decline</span>, falling from about 550 in April to just 350 in <span className="font-bold">both May and June, the lowest figure recorded</span>.</>,
    ],
  },
  {
    prompt: "Task 16: The graph below gives information on the number of participants for different activities at one social centre in Melbourne, Australia for the period 2000 to 2020. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/16.png",
    alt: "Line graph showing the number of participants by activity at a social centre in Melbourne from 2000 to 2020",
    paragraphs: [
      <>The line graph compares participation in five different activities between 2000 and 2020.</>,
      <>Overall, the film club remained <span className="font-bold">the most popular activity throughout the period</span>, while table tennis experienced <span className="font-bold">the most significant growth</span>. In contrast, amateur dramatics showed <span className="font-bold">a steady decline</span>, whereas martial arts fluctuated slightly. Musical performances, <span className="font-bold">which had no participants at the beginning, gradually gained popularity</span>.</>,
      <>In 2000, around 64 people attended the film club, compared with 35 participants in martial arts and 25 in amateur dramatics. Film club attendance fell marginally to 60 in 2010 before recovering to approximately 66 by 2020. Martial arts participation varied between 32 and 38 over the two decades, ending at around 36. Meanwhile, amateur dramatics rose slightly to 28 in 2005 but then declined continuously, reaching only 6 participants by the end of the period.</>,
      <>Table tennis recorded the most dramatic increase. Starting at 15 participants in 2000, the figure remained at around 20 until 2010 before rising sharply to 35 in 2015 and 54 in 2020. Musical performances showed a similar upward trend, increasing from zero participants in 2000 and 2005 to 12 in 2010, before reaching 18 by 2020.</>,
    ],
  },
  {
    prompt: "Task 17: The graph below shows average carbon dioxide (CO2) emissions per person in the United Kingdom, Sweden, Italy and Portugal between 1967 and 2007. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/17.png",
    alt: "Line graph showing average CO2 emissions per person in the United Kingdom, Sweden, Italy, and Portugal between 1967 and 2007",
    paragraphs: [
      <>The line graph compares average per-capita carbon dioxide (CO2) emissions in the United Kingdom, Sweden, Italy and Portugal between 1967 and 2007.</>,
      <>Overall, the United Kingdom recorded <span className="font-bold">the highest emissions throughout the period despite a gradual decline</span>. In contrast, Italy and Portugal experienced <span className="font-bold">steady increases</span>, while Sweden showed <span className="font-bold">a marked rise followed by a significant fall</span>. By 2007, the figures for Sweden and Portugal had converged at around 5.5 metric tonnes.</>,
      <>In 1967, the UK emitted approximately 11 tonnes of CO2 per person, considerably more than Sweden at about 8.5 tonnes. Sweden&apos;s emissions climbed to just over 10 tonnes in 1977 before dropping sharply to around 7 tonnes in 1987 and continuing downward thereafter. Meanwhile, the UK figure decreased steadily from roughly 11 to 8.7 tonnes over the 40-year period.</>,
      <>Italy and Portugal started with much lower emissions, at about 4 and 1 tonne respectively. Italy witnessed consistent growth, reaching around 7.7 tonnes by 1997 and remaining stable thereafter. Portugal also increased steadily, rising to just above 5 tonnes by 1997 before levelling off. As a result, Portugal overtook Sweden by the late 1980s to become the second-highest emitter.</>,
    ],
  },
  {
    prompt: "Task 18: Take a look at the chart below and perform the task as outlined: This graph shows the proportion of four different materials that were recycled from 1982 to 2010 in a particular country. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/18.png",
    alt: "Line graph showing recycling rates for paper and cardboard, glass containers, aluminium cans, and plastics from 1982 to 2010",
    paragraphs: [
      <>The line graph compares the percentages of four materials—paper and cardboard, glass containers, aluminium cans, and plastics—that were recycled in a particular country between 1982 and 2010.</>,
      <>Overall, paper and cardboard recorded <span className="font-bold">the highest recycling rates throughout the period despite a gradual decline after the mid-1990s</span>. By contrast, plastics remained <span className="font-bold">the least recycled material</span>. While glass and aluminium both showed upward trends overall, the increase for aluminium was <span className="font-bold">particularly pronounced</span>.</>,
      <>Paper and cardboard recycling stood at 65% in 1982 and rose to a peak of 80% in 1994. Thereafter, the figure declined steadily, ending at 70% in 2010. Glass containers followed a different pattern: the rate fell from 50% in 1982 to 40% in 1990 and then increased gradually, recovering to 50% in 1994 and then increasing gradually to 60% by the end of the century.</>,
      <>Aluminium cans experienced the most dramatic growth, climbing continuously from just 5% in 1986 to 45% in 2010. In contrast, plastics showed only marginal improvement, rising from approximately 3% in 1990 to around 8% in 2010, <span className="font-bold">remaining far below the other materials</span> throughout the timeframe.</>,
    ],
  },
  {
    prompt: "Task 19: The line graph below shows the consumption of 3 different types of fast food in Britain from 1970 to 1990. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/19.png",
    alt: "Line graph showing consumption of hamburgers, fish and chips, and pizza in Britain from 1970 to 1990",
    paragraphs: [
      <>The line graph illustrates the amount of three types of fast food—hamburgers, fish and chips, and pizza—consumed between 1970 and 1990, measured in grams.</>,
      <>Overall, fish and chips experienced <span className="font-bold">a dramatic rise</span> and became the most popular fast food by the end of the period. In contrast, pizza consumption showed <span className="font-bold">a downward trend before stabilising</span>, while hamburger consumption increased steadily, <span className="font-bold">particularly in the final five years</span>.</>,
      <>In 1970, pizza was by far the most widely consumed item at 300 grams, compared with only 80 grams for fish and chips and 30 grams for hamburgers. Over the next decade, pizza intake gradually declined to 220 grams, whereas fish and chips rose moderately to 150 grams. Hamburger consumption also increased consistently, reaching 90 grams in 1980.</>,
      <>From 1980 onwards, the consumption of fish and chips accelerated sharply, climbing from 150 grams to 300 grams in 1985 and peaking at 500 grams in 1990. Hamburger intake remained relatively modest until 1985 and peaked at 290 grams at the end of the period. Meanwhile, pizza consumption fell to 200 grams in 1985 and then edged up slightly to approximately 210 grams in 1990.</>,
    ],
  },
  {
    prompt: "Task 20: The line graph shows the average number of weekly patients visiting four clinics of a hospital from 2010 to 2016. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/20.png",
    alt: "Line graph showing the average weekly number of patients attending four clinics at a hospital from 2010 to 2016",
    paragraphs: [
      <>The line graph compares the average weekly number of patients attending four clinics in a hospital between 2010 and 2016.</>,
      <>Overall, the Eye clinic experienced <span className="font-bold">the most significant growth</span> and became the busiest department by the end of the period. In contrast, the Birth control clinic fluctuated considerably <span className="font-bold">before finishing at roughly its initial level</span>. Meanwhile, the Diabetic and Dental clinics showed overall upward trends despite some variations.</>,
      <>In 2010, the Birth control clinic recorded the highest figure, at approximately 240 patients per week, followed by the Eye clinic with about 120. The Dental and Diabetic clinics were less popular, attracting around 90 and 70 patients respectively. By 2012, Eye patients had risen to a peak of nearly 280, while Eye patients increased modestly to 150. Over the same period, Dental attendance fell sharply to about 60, whereas Diabetic cases climbed to 90.</>,
      <>From 2012 onwards, Eye clinic numbers grew dramatically, reaching 220 in 2014 and 350 by 2016, the highest value on the chart. Birth control attendance dropped to around 180 before recovering to 240. Dental visits <span className="font-bold">rebounded steadily</span> to approximately 130, while Diabetic patients rose markedly to 180 in the final year.</>,
    ],
  },
  {
    prompt: "Task 21: The chart below shows the average cost of monthly contract for four different mobile (cell) phones in a European country from January to September 2007, measured in euro. Summarise the information by selecting and reporting the main features and make comparisons where relevant.",
    image: "/ielts/21.png",
    alt: "Line graph comparing the monthly contract cost of four mobile phone brands—Domo, Lex, Sim TX, and Alpha—from January to September 2007",
    paragraphs: [
      <>The line graph compares the monthly performance of four mobile phone brands—Domo, Lex, Sim TX and Alpha—between January and September.</>,
      <>Overall, Domo remained <span className="font-bold">the leading brand throughout most of the period, despite a slight decline at the end</span>. By contrast, Alpha experienced <span className="font-bold">the most dramatic growth</span>, finishing as the top performer in September, while Lex recorded moderate but steady decline.</>,
      <>Domo rose from 15 units in January to 17 in March before slipping slightly to 16 in April. Its figure then increased significantly, reaching 20 in May and June and peaking at 25 in July. Although sales eased marginally to 24 in August and 23 in September, Domo remained one of the strongest brands. Lex started at 12 units, fell to 10 in February, and then climbed gradually to 18 by September.</>,
      <>Alpha began as the weakest performer at just 5 units and remained relatively low until June. However, its sales surged from 10 in July to 25 in September, overtaking all competitors. Sim TX fluctuated between 8 and 14 units, peaking in June before declining steadily to 8 at the end of the period.</>,
    ],
  },
];

export default function LineGraphPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={60}
              height={60}
              className="rounded-full"
              unoptimized
            />
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="space-y-6">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index} className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/60 shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <p className="text-base leading-8 text-slate-700">{item.prompt}</p>
                  <span className="shrink-0 text-2xl text-sky-700">{isOpen ? "−" : "+"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-sky-100 bg-white px-5 py-6">
                    <div className="relative mx-auto aspect-[16/10] w-full max-w-2xl">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    <div className="mt-8 space-y-4">
                      {item.paragraphs.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-base leading-8 text-slate-700">{paragraph}</p>
                      ))}
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
