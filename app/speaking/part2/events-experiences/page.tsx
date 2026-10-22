import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SegmentControls from "../places/SegmentControls";
import { eventCues } from "./eventsData";
import { eventCardStory } from "../cardStories";

export const eventStories = [
  { id: "academic-challenge", title: "Academic challenge", story: "An important presentation and exam period", ids: [3, 8, 9, 11, 12, 13, 15, 17, 18, 23, 25, 27, 30], paragraphs: [
    ["Opening", "I'd like to describe a demanding period at university when I had to prepare for an important group presentation while also studying for final examinations."],
    ["Pressure", "The workload was heavy, our deadline was close and I initially felt nervous and stressed. A disappointing practice session showed that our preparation and coordination were not good enough."],
    ["Action", "I divided the work into smaller priorities, created a timetable and discussed each person's role with the group. A close friend gave me practical advice, and I rehearsed my section until I could deliver it calmly."],
    ["Result", "The final presentation went well and our result was better than expected. Waiting for the result was difficult, but the success gave me confidence and a deep sense of satisfaction."],
    ["Ending", "The experience taught me that pressure becomes manageable when I prepare early, communicate clearly and solve one problem at a time."],
  ]},
  { id: "support-advice", title: "Help & advice", story: "A difficult decision supported by people close to me", ids: [4, 5, 6, 7, 14, 19, 20], paragraphs: [
    ["Opening", "I'd like to talk about a time when I had to make an important decision about my studies and future career. I was uncertain because each option had different risks and benefits."],
    ["Support", "A close friend listened patiently, while an older cousin helped me compare the long-term consequences. Their advice gave me a clearer perspective instead of making the decision for me."],
    ["Action", "I wrote down my priorities, set personal boundaries and chose the option that suited my abilities and goals. Later, I used the same method to advise my younger sister when she faced academic pressure."],
    ["Feeling", "Taking responsibility for the choice made me nervous, but it also gave me quiet pride. Helping someone else afterward made the lesson more meaningful."],
    ["Ending", "I learned that useful advice should be practical and respectful. It can guide a person, but the final decision and responsibility must remain their own."],
  ]},
  { id: "celebration-news", title: "Celebration & good news", story: "A result that became a memorable family occasion", ids: [1, 2, 16, 24, 29], paragraphs: [
    ["Opening", "I'd like to describe the day I received an important academic result. I was at home when a friend called and told me that I had passed with a good score."],
    ["Moment", "I had waited anxiously, so the news brought an immediate sense of relief. My parents and siblings were delighted because they had supported me throughout the preparation."],
    ["Celebration", "We arranged a small family dinner rather than a large party. We shared food, talked about the difficult months before the result and took a few photographs together."],
    ["Gift", "My younger brother gave me a wristwatch. Its financial value was not important; it became special because it represented his genuine happiness and support."],
    ["Ending", "The event stayed with me because it combined achievement, family togetherness and a thoughtful gift in one simple but deeply personal evening."],
  ]},
  { id: "setback-change", title: "Setback & change", story: "A missed opportunity that changed my planning habits", ids: [10, 22, 26, 28], paragraphs: [
    ["Opening", "I'd like to describe a time when I missed an internship opportunity because I noticed the application deadline too late. I had expected it to be a valuable step in my career."],
    ["Reaction", "At first, I felt disappointed and frustrated with myself. I had also planned a weekend trip, but a sudden work issue meant that I had to cancel it and reorganise my schedule."],
    ["Change", "Instead of remaining upset, I created a deadline calendar, adjusted my priorities and began planning important tasks earlier. I also started morning jogging to build a more disciplined routine."],
    ["Result", "The new routine felt difficult at first, but it gradually gave me more control over my time. I became better prepared for later applications and responsibilities."],
    ["Ending", "Missing the opportunity was unpleasant, yet it became a useful wake-up call. It taught me to accept changes, act early and make the best of an unexpected situation."],
  ]},
  { id: "calm-reflection", title: "Calm & reflection", story: "A quiet evening that helped me recover", ids: [21], paragraphs: [
    ["Opening", "I'd like to describe a quiet weekend evening when I felt unusually relaxed after a demanding week."],
    ["Setting", "I went to the rooftop of my home just before sunset. The air was cooler, the neighbourhood was becoming quiet and there were no urgent tasks waiting for me."],
    ["Activity", "I made a cup of tea, listened to soft music and sat alone for about an hour. I deliberately put my phone aside and allowed my thoughts to slow down."],
    ["Feeling", "The simple routine gave me mental stillness and helped me switch off from work. By the time I went downstairs, I felt calmer and more balanced."],
    ["Ending", "It reminded me that relaxation does not require an expensive trip. Sometimes a quiet familiar place and a short pause are enough to restore my energy."],
  ]},
] as const;

const highlights: Record<string, string[]> = {
  "academic-challenge": ["demanding period", "nervous and stressed", "smaller priorities", "deep sense of satisfaction", "one problem at a time"],
  "support-advice": ["important decision", "clearer perspective", "personal boundaries", "quiet pride", "practical and respectful"],
  "celebration-news": ["important academic result", "sense of relief", "small family dinner", "represented his genuine happiness", "deeply personal evening"],
  "setback-change": ["missed an internship opportunity", "disappointed and frustrated", "adjusted my priorities", "more control over my time", "useful wake-up call"],
  "calm-reflection": ["unusually relaxed", "becoming quiet", "thoughts to slow down", "more balanced", "restore my energy"],
};

function mark(text: string, phrase: string) {
  const index = text.indexOf(phrase);
  return index < 0 ? text : <>{text.slice(0, index)}<strong className="font-black text-amber-200">{phrase}</strong>{text.slice(index + phrase.length)}</>;
}

export default function EventsExperiencesPage() {
  return <main className="min-h-screen bg-slate-100 text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-2 sm:px-6 lg:px-8"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <section className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6 lg:px-8"><div><p className="text-xs font-black uppercase tracking-[.24em] text-emerald-700">Speaking / Part 2 / Events & Experiences</p><h1 className="mt-2 text-4xl font-black text-emerald-950">30 Event Cue Cards · 5 Stories</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Learn five flexible event stories instead of thirty separate answers. Open a cue card for its prompts, quick notes and reusable phrases.</p></div><Link href="/speaking/part2/events-experiences/preview" className="shrink-0 rounded-xl bg-amber-300 px-4 py-2 text-sm font-black text-emerald-950 hover:bg-amber-200">A4 preview</Link></div></section>
    <nav aria-label="Event story segments" className="sticky top-[75px] z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">{eventStories.map((story, index) => <a key={story.id} href={`#${story.id}`} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"><span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-[10px]">{index + 1}</span>{story.title}</a>)}</div></nav>
    <div className="mx-auto max-w-[1500px] space-y-14 px-4 py-7 sm:px-6 lg:px-8">{eventStories.map((story, storyIndex) => {
      const cards = story.ids.map((id) => eventCues.find((item) => item.id === id)!);
      return <section id={story.id} key={story.id} className="scroll-mt-32">
        <div className="grid overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-xl lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-6 sm:p-8"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-emerald-100">Story {storyIndex + 1}</span><span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-amber-950">Covers {cards.length} cards</span></div><p className="mt-5 text-sm font-black uppercase tracking-[.18em] text-emerald-200">{story.title}</p><h2 className="mt-2 text-3xl font-black">{story.story}</h2><div className="mt-6 space-y-4 text-[15px] leading-7 text-emerald-50">{story.paragraphs.map(([label, text], index) => <p key={label}><b className="text-amber-200">{label}:</b> {mark(text, highlights[story.id][index])}</p>)}</div></div>
          <aside className="self-start bg-black/15 p-5 lg:m-5 lg:rounded-2xl"><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-200">Cards covered</p><div className="mt-3 flex flex-wrap gap-2">{cards.map((card) => <a key={card.id} href={`#event-${card.id}`} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold hover:bg-white/20">#{card.id} {card.event}</a>)}</div><div className="mt-5"><SegmentControls segmentId={story.id} /></div></aside>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map((card) => <details id={`event-${card.id}`} data-segment={story.id} key={card.id} className="group scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm open:border-emerald-300">
          <summary className="cursor-pointer list-none p-5"><div className="flex gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-xs font-black text-emerald-800">{card.id}</span><div><h3 className="font-black leading-6">{card.question}</h3><p className="mt-1 text-xs font-bold text-emerald-700">Use: {card.event}</p></div><span className="ml-auto text-xl text-emerald-600 transition group-open:rotate-45">+</span></div></summary>
          <div className="border-t border-slate-100 p-5"><p className="text-xs font-black uppercase tracking-wider text-slate-400">You should say</p><ul className="mt-2 space-y-1 text-sm text-slate-600">{card.prompts.map((prompt) => <li key={prompt}>• {prompt}</li>)}</ul><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">Quick notes</p>{card.notes.map((note) => <p key={note} className="mt-1 text-xs text-slate-600">• {note}</p>)}</div><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">Useful phrases</p>{card.vocabulary.map((phrase) => <p key={phrase} className="mt-1 text-xs font-semibold text-emerald-800">• {phrase}</p>)}</div></div><div className="mt-4 rounded-xl bg-emerald-950 px-4 py-3 text-sm leading-6 text-emerald-50"><span className="mr-2 font-black uppercase tracking-wider text-amber-300">Speak it:</span>{card.memory}</div><div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs font-black uppercase tracking-[.16em] text-emerald-800">Card-specific story</p><div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">{eventCardStory(card).map(([label,text])=><p key={label}><strong className="text-emerald-900">{label}:</strong> {text}</p>)}</div></div></div>
        </details>)}</div>
      </section>;
    })}</div>
  </main>;
}
