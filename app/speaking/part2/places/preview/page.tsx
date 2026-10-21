import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { placeCues } from "../placesData";
import PrintButton from "./PrintButton";
import { simpleFutureStory } from "../futureStory";
import "./print.css";

const columns = [
  { title: "Home & village", ids: [9,15,16,24], tone: "bg-amber-50 border-amber-200" },
  { title: "Calm city life", ids: [1,2,4,14,19,21], tone: "bg-sky-50 border-sky-200" },
  { title: "Busy city, work & learning", ids: [6,8,10,23,25,26,27], tone: "bg-violet-50 border-violet-200" },
  { title: "Coast & islands", ids: [3,5,17,18,28,30], tone: "bg-cyan-50 border-cyan-200" },
  { title: "Hills & natural places", ids: [7,11,12,20], tone: "bg-emerald-50 border-emerald-200" },
  { title: "Future & heritage", ids: [13,22,29], tone: "bg-rose-50 border-rose-200" },
];

const stories = [
  { title: "Home & village", subtitle: "A familiar place with personal meaning", paragraphs: [
    ["Opening", "I'd like to describe a familiar place that has become an important part of my life. I have known it for a considerable time, so it carries many personal memories. I go there whenever I need to focus, reflect or take a short break from my normal routine."],
    ["Scene", "It is quieter and simpler than most places I visit. The surroundings are familiar, there is enough open space, and the atmosphere is usually peaceful. Nothing about it is luxurious, but that simplicity makes me feel comfortable and allows me to pay attention to my own thoughts."],
    ["Action", "I normally find a comfortable spot and spend some quiet time there. Depending on what I need to do, I may read, organise my thoughts or simply observe my surroundings. Because there are fewer distractions, I can concentrate properly and use my time in a meaningful way."],
    ["Feeling", "These simple activities help me slow down and clear my mind. I feel comfortable there because I can forget my usual worries for a while. The familiar surroundings also remind me where I come from."],
    ["Ending", "Overall, this place is special to me because I always feel calm and comfortable there. It reminds me of many happy memories and gives me a break from my busy life. That is why I always enjoy going back."],
  ] },
  { title: "Calm city life", subtitle: "A pleasant place I regularly visit", paragraphs: [
    ["Opening", "I'd like to describe Vodra Lake in Rajshahi. I work as an assistant professor at RUET, and the lake is about one kilometre from the university campus. I usually visit it in the late evening, when the weather is more comfortable, because Rajshahi has a hot climate for most of the year."],
    ["Scene", "The lake has a peaceful atmosphere, with open water, trees and enough space for walking. There is also a small tea stall nearby. Local sellers often offer nuts, fresh fruit and fruit juice beside the lake."],
    ["Action", "I mainly go there for regular exercise and walk around the lake for some time. I also sit beside the water and enjoy the natural beauty. Sometimes I meet my friends, junior colleagues or younger friends, and we eat nuts or drink fruit juice together."],
    ["Feeling", "Spending time there helps me clear my mind after teaching and other university duties. When my friends are there, we sit at the tea stall and chat about our families, work and everyday activities. These simple moments make me feel relaxed and happy."],
    ["Ending", "The lake has become part of my routine because it gives me exercise, fresh air and good company in one place. It is close to my campus, easy to visit and a pleasant place to spend my free time."],
  ] },
  { title: "Busy city, work & learning", subtitle: "A reusable answer for one memorable place", paragraphs: [
    ["Opening", "I'd like to describe a place in Dhaka that I remember clearly because I had a meaningful experience there. I visited it some time ago for a particular reason, and I stayed long enough to notice the place properly. Although it is part of a busy city, it had its own character and left a clear impression on me."],
    ["Scene", "The first thing I noticed was its distinctive atmosphere and surroundings. I paid attention to the layout, the people, the sounds and the level of activity around me. Some parts felt comfortable and organised, while other aspects were more intense than I had expected. These small details made it different from the places I usually visit."],
    ["Action", "While I was there, I focused on the main activity I had planned. I also observed what was happening around me and tried to understand how people used the place. I spent enough time there to experience it properly instead of leaving in a hurry. This gave me several clear details that I could remember afterwards."],
    ["Feeling", "At first, I felt curious and slightly unsure because the environment was unfamiliar. After a while, I became more comfortable and involved in the experience. Some parts were enjoyable and useful, although other parts could be tiring or overwhelming. Overall, the visit taught me something and helped me see a different side of city life."],
    ["Ending", "That is why this place still stands out in my mind. It was not simply the location itself, but also what I did, noticed and felt there that made it memorable. Whenever I think about it, I can clearly remember the atmosphere and the experience."],
  ] },
  { title: "Coast & islands", subtitle: "A memorable place beside the sea", paragraphs: [
    ["Opening", "I'd like to describe a coastal place in Bangladesh that gave me a memorable experience. I visited it during a holiday some time ago, after hearing many positive things about it. The journey took several hours, but I felt excited because the destination was completely different from my usual surroundings."],
    ["Scene", "When I arrived, the first things I noticed were the open sea, the wide sky and the fresh breeze. The natural scenery was beautiful, and the sound of the waves created a peaceful atmosphere. Although there were other visitors nearby, I could still find quieter areas where I could appreciate the view without feeling disturbed."],
    ["Action", "I walked slowly near the water and explored the surrounding area. I took several photographs because the changing light made the scenery look especially attractive. I also tried some local food and spent time watching the waves. Instead of following a strict schedule, I allowed myself to enjoy the place at a relaxed pace."],
    ["Feeling", "At first, I was amazed by the beauty and openness of the area. After spending some time there, I felt calmer, happier and free from the pressure of city life. The peaceful environment helped me clear my mind, while the experience itself gave me a strong sense of freedom and enjoyment."],
    ["Ending", "This place has remained in my memory because of both its natural beauty and the way it made me feel. It showed me how refreshing a simple change of environment can be. For that reason, it is a place I would gladly experience again and remember for a long time."],
  ] },
  { title: "Hills & natural places", subtitle: "A peaceful place surrounded by nature", paragraphs: [
    ["Opening", "I'd like to describe a natural place in Bangladesh that I visited during a holiday. I had heard several positive things about it before the trip, but seeing it in person was much more impressive. The journey also gave me a welcome opportunity to leave the city for a while."],
    ["Scene", "The area was filled with greenery, fresh air and wide natural views. Its landscape had several unusual features that made it different from places I normally see. Most importantly, it felt peaceful because it was far from heavy traffic, crowded streets and constant city noise."],
    ["Action", "I explored the area slowly, observed its natural features and took several photographs. I also found time to sit quietly and appreciate the surroundings. During the visit, I learned a little about the environment and how local people help preserve its natural character."],
    ["Feeling", "The experience made me feel calm, curious and more connected to nature. I particularly enjoyed having enough time to notice small details instead of rushing from one activity to another. The peaceful environment helped me forget my usual responsibilities and clear my mind."],
    ["Ending", "This place left a lasting impression because its atmosphere and natural beauty were difficult to forget. The visit was both relaxing and educational, which made it especially worthwhile. I would be happy to return and spend more time there in the future."],
  ] },
  { title: "Future & heritage", subtitle: "Places connected to memories and future plans", paragraphs: [
    ["Opening", "I'd like to connect three meaningful places: historic Panam Nagar, the planned Purbachal area and Northern Norway, which I hope to visit in the future. Although they are very different, each one represents an important stage of my life."],
    ["Scene", "Panam Nagar has a historic atmosphere, with old buildings and traditional architecture that reflect the past. Purbachal promises a less congested living environment with open space and modern facilities, while Norway offers the extraordinary natural phenomenon of the midnight sun."],
    ["Action", "I visited Panam Nagar with my relatives for a family wedding photoshoot and spent time exploring its narrow streets. I have also explored Purbachal as a possible home. In contrast, I learned about Norway through travel videos and articles, and I would love to hike, photograph the landscape and experience its long summer daylight."],
    ["Feeling", "The heritage visit was personally meaningful because it combined family memories with history. The planned city suggests daily balance and long-term stability, while Norway fills me with a sense of wonder and excitement about discovering a completely unfamiliar environment."],
    ["Ending", "Together, these places represent a special milestone, a healthier future lifestyle and a once-in-a-lifetime experience that could help me disconnect from routine. For those reasons, they connect my past, present and future in a way that feels both practical and deeply personal."],
  ] },
] as const;

const storyHighlights: Record<string, readonly string[]> = {
  "Home & village": ["important part of my life", "feel comfortable", "fewer distractions", "clear my mind", "special to me"],
  "Calm city life": ["one kilometre", "peaceful atmosphere", "regular exercise", "clear my mind", "part of my routine"],
  "Busy city, work & learning": ["meaningful experience", "distinctive atmosphere", "main activity I had planned", "different side of city life", "stands out in my mind"],
  "Coast & islands": ["memorable experience", "peaceful atmosphere", "at a relaxed pace", "clear my mind", "remember for a long time"],
  "Hills & natural places": ["seeing it in person", "wide natural views", "appreciate the surroundings", "clear my mind", "lasting impression"],
  "Future & heritage": ["three meaningful places", "historic atmosphere", "family wedding photoshoot", "long-term stability", "once-in-a-lifetime experience"],
};

function markReusablePhrase(text: string, phrase: string) {
  const start = text.toLowerCase().indexOf(phrase.toLowerCase());
  if (start < 0) return text;
  return <>{text.slice(0, start)}<mark className="place-story-highlight">{text.slice(start, start + phrase.length)}</mark>{text.slice(start + phrase.length)}</>;
}

export default function PlacesPreviewPage() {
  return <main className="min-h-screen bg-slate-100 text-slate-900">
    <header className="place-print-toolbar sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-2"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <div className="place-print-toolbar mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-5 py-5"><div><Link href="/speaking/part2/places" className="text-sm font-bold text-emerald-700">← Back to the 30 topics</Link><p className="mt-1 text-sm text-slate-500">Designed as one PDF with three A4 landscape pages: vocabulary, stories 1–4, then stories 5–6. Select “Save as PDF” when the print window opens.</p></div><PrintButton /></div>
    <div className="place-print-wrap mx-auto max-w-[1500px] px-5 pb-8">
      <section className="place-print-sheet mx-auto overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl">
        <div className="place-print-title text-center"><h1 className="text-2xl font-black tracking-tight text-emerald-950">Places Vocabulary & Phrase Memory Route</h1><p className="mt-1 text-xs font-semibold text-slate-500">Follow the topic numbers from home → city → work → coast → nature → future. Say every phrase from top to bottom.</p></div>
        <div className="place-print-columns mt-4 grid gap-2.5">
          {columns.map((column) => <section key={column.title} className={`place-print-column rounded-xl border p-3 ${column.tone}`}>
            <h2 className="border-b border-current/15 pb-2 text-xs font-black uppercase tracking-wider text-slate-800">{column.title}</h2>
            {column.ids.map((id) => {
              const cue = placeCues.find((item) => item.id === id)!;
              return <article key={id} className="place-print-topic mt-2 border-t border-slate-900/10 pt-2 first:border-0 first:pt-0">
                <h3 className="text-[11px] font-black leading-tight text-emerald-950"><Link href={`/speaking/part2/places#topic-${id}`}>#{id} · {cue.place}</Link></h3>
                <ol className="mt-1">{cue.vocabulary.map((phrase,index) => <li key={phrase} className="mt-0.5 text-[9px] font-semibold leading-tight text-slate-700"><span className="mr-1 text-emerald-700">{index+1}.</span>{phrase}</li>)}</ol>
              </article>;
            })}
          </section>)}
        </div>
      </section>
      {[stories.slice(0, 4), stories.slice(4)].map((pageStories, pageIndex) => <section key={pageIndex} className={`place-story-sheet ${pageIndex === 0 ? "place-story-sheet-four" : "place-story-sheet-two"} mx-auto mt-8 overflow-hidden rounded-2xl border border-slate-300 bg-[#fffef9] p-5 shadow-xl`}>
        <div className="place-story-grid grid grid-cols-2 gap-4">
          {pageStories.map((story, index) => <article key={story.title} className="place-story-card rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
            <div className="flex items-start gap-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-800 text-xs font-black text-white">{pageIndex * 4 + index + 1}</span>
              <div><h2 className="text-sm font-black text-emerald-950">{story.title}</h2><p className="text-[11px] font-bold text-emerald-700">{story.subtitle}</p></div>
            </div>
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-700">
              {(story.title === "Future & heritage" ? simpleFutureStory : story.paragraphs).map(([label, text], paragraphIndex) => <p key={label}><strong className="text-emerald-900">{label}:</strong> {markReusablePhrase(text, storyHighlights[story.title][paragraphIndex])}</p>)}
            </div>
          </article>)}
        </div>
      </section>)}
    </div>
  </main>;
}
