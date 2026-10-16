import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { placeCues } from "./placesData";
import SegmentControls from "./SegmentControls";

const segments = [
  { id:"home-village", title:"Home & village", story:"My village home and rooftop routine", ids:[9,15,16,24], paragraphs:[
    ["Opening","I’d like to talk about my village home in northern Bangladesh, an emotional anchor that has shaped my identity since my formative years."],
    ["Scene","Its rural simplicity creates a clear contrast with Dhaka. The slower pace of life, environmental calm and familiar people give me a deep sense of belonging and a fresh perspective."],
    ["Action","At home, I often study on the rooftop, where minimal distractions give me clear headspace, deep focus and sustained attention. I also visit the nearby mosque courtyard for prayer and quiet reflection."],
    ["Feeling","These places provide emotional grounding, mental discipline and a moment of stillness. They restore my inner balance and act as a quiet reset."],
    ["Ending","Together, my village home, rooftop and local courtyard carry deep personal meaning and remain important parts of my daily life and personal identity."],
  ]},
  { id:"calm-city", title:"Calm city life", story:"My peaceful route through Dhaka", ids:[1,2,4,14,19,21], paragraphs:[
    ["Opening","I’d like to talk about my peaceful city route, which connects my university campus, Dhanmondi Lake, green parks and a familiar tea stall in Dhaka."],
    ["Scene","The lake and parks provide natural openness, calm surroundings and visual breathing room. Even in a busy city, they feel like a personal escape and a natural escape."],
    ["Action","I walk at an unhurried pace, sit beside the water, observe people and occasionally meet friends at the tea stall for free-flowing conversations."],
    ["Feeling","This routine gives me a mental pause, helps me switch off mentally and brings mental ease, quiet enjoyment and emotional balance."],
    ["Ending","Because the route is familiar and easy to visit, it has become my everyday anchor, social hub and dependable source of relief from pressure."],
  ]},
  { id:"busy-city", title:"Busy city, work & learning", story:"A productive day across central Dhaka", ids:[6,8,10,23,25,26,27], paragraphs:[
    ["Opening","I’d like to describe a productive but intense day that took me from a professional office and training centre to several lively places in central Dhaka."],
    ["Scene","The office and British Council were structured, quiet and visibly well-maintained, whereas New Market and Kawran Bazar were packed with people, constant movement and noise."],
    ["Action","I completed focused work, received hands-on training in data analysis, met friends at a rooftop café and later photographed Ahsan Manzil in balanced natural light."],
    ["Feeling","The learning spaces built my confidence, responsibility and work discipline. The markets caused sensory overload, but the café and photography brought meaningful conversations and an emotional lift."],
    ["Ending","The day showed me the striking contrast of city life: skill-building spaces, respectful shared areas, collective energy, rich textures and real-world experience."],
  ]},
  { id:"coast-islands", title:"Coast & islands", story:"My unforgettable journey along the coast", ids:[3,5,17,18,28,30], paragraphs:[
    ["Opening","I’d like to talk about a coastal journey that included Cox’s Bazar, Saint Martin’s Island, Kuakata and the remote beauty of Nijhum Dwip."],
    ["Scene","Each destination had natural charm and visual appeal, from the iconic beach to the island’s natural simplicity and Nijhum Dwip’s remote atmosphere."],
    ["Action","I walked beside the sea, watched sunrise and sunset, tasted local food, chatted with close friends and explored quiet stretches of coastline."],
    ["Feeling","The laid-back atmosphere gave me a sense of freedom, instant calm and carefree moments. At Nijhum Dwip, the deep isolation and rare calmness felt emotionally striking."],
    ["Ending","The whole coastal experience made a strong first impression and a lasting mental image. These places are worth experiencing, and I would gladly return for longer."],
  ]},
  { id:"hills-nature", title:"Hills & natural places", story:"My family’s nature trail through Bangladesh", ids:[7,11,12,20], paragraphs:[
    ["Opening","I’d like to describe a family nature trail that introduced me to Sajek Valley, a quiet tea garden and the unique ecosystem of the Sundarbans."],
    ["Scene","Sajek’s hills, clouds and greenery formed a striking landscape, the tea garden offered natural stillness, and the Sundarbans felt like a visually striking natural wonder."],
    ["Action","We went sightseeing, walked slowly, took photographs and spent quiet moments observing trees, rivers, wildlife and the open landscape."],
    ["Feeling","The trip gave us quality family time, a break from routine and a sense of awe. The undisturbed surroundings cleared my head and created emotional grounding."],
    ["Ending","It was an emotionally meaningful shared experience. The visual harmony, sense of togetherness and unforgettable scenery left a deep and lasting impression."],
  ]},
  { id:"future-heritage", title:"Future & heritage", story:"Three places connecting my past and future", ids:[13,22,29], paragraphs:[
    ["Opening","I’d like to connect three meaningful places: historic Panam Nagar, the planned Purbachal area and Northern Norway, which I hope to visit in the future."],
    ["Scene","Panam Nagar has a historic atmosphere, Purbachal promises a less congested living environment, and Norway offers the extraordinary natural phenomenon of the midnight sun."],
    ["Action","I visited Panam Nagar for a family wedding photoshoot, I have explored Purbachal as a possible home, and I learned about Norway through travel videos and articles."],
    ["Feeling","The heritage visit was personally meaningful, the planned city suggests daily balance and long-term stability, and Norway fills me with a sense of wonder."],
    ["Ending","Together they represent a special milestone, a healthier future lifestyle and a once-in-a-lifetime experience that could help me disconnect from routine."],
  ]},
] as const;

export default function PlacesPage() {
  return <main className="min-h-screen scroll-smooth bg-[#f5f7f2] text-slate-800">
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-2 lg:px-8"><Link href="/" aria-label="Home"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized /></Link><Navbar /></div></header>
    <nav aria-label="Place segments" className="sticky top-[75px] z-30 border-b border-slate-200 bg-[#f5f7f2]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8"><div className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {segments.map((segment,index) => <a key={segment.id} href={`#${segment.id}`} className="group flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800"><span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-[10px] group-hover:bg-emerald-100">{index+1}</span>{segment.title}</a>)}
      <Link href="/speaking/part2/places/preview" className="ml-auto shrink-0 rounded-xl bg-amber-300 px-4 py-2 text-sm font-black text-emerald-950 hover:bg-amber-200">A4 vocabulary sheet</Link>
    </div></nav>

    <div className="mx-auto max-w-[1500px] space-y-14 px-4 py-7 sm:px-6 lg:px-8">{segments.map((segment,segmentIndex) => {
      const topics = segment.ids.map((id) => placeCues.find((cue) => cue.id === id)!);
      return <section key={segment.id} id={segment.id} className="scroll-mt-40">
        <div className="overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-[#12372a] via-[#185442] to-[#28745c] text-white shadow-xl shadow-emerald-950/10"><div className="grid gap-8 p-6 md:p-9 lg:grid-cols-[1fr_360px]">
          <div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em] text-emerald-100">Segment {segmentIndex+1} · one story</span><span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-amber-950">Covers {topics.length} cards</span></div>
            <p className="mt-5 text-sm font-black uppercase tracking-[.18em] text-emerald-200">{segment.title}</p><h1 className="mt-2 max-w-4xl text-3xl font-black leading-tight sm:text-4xl">{segment.story}</h1>
            <div className="mt-6 space-y-4 text-[15px] leading-7 text-emerald-50 sm:text-base">{segment.paragraphs.map(([label,text]) => <p key={label}><b className="text-amber-200">{label}.</b> {text}</p>)}</div>
          </div>
          <aside className="self-start rounded-3xl border border-white/15 bg-black/15 p-5 backdrop-blur-sm lg:sticky lg:top-40"><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-200">Cards covered by this story</p>
            <div className="mt-4 space-y-2">{topics.map((topic) => <a key={topic.id} href={`#topic-${topic.id}`} className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 transition hover:bg-white/20"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-300 text-xs font-black text-emerald-950">{topic.id}</span><span><b className="block text-sm text-amber-200">{topic.place}</b><span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-emerald-50">{topic.question}</span></span></a>)}</div>
            <div className="mt-4"><SegmentControls segmentId={segment.id} /></div>
          </aside>
        </div></div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">{topics.map((cue) => <details key={cue.id} id={`topic-${cue.id}`} data-segment={segment.id} className="group scroll-mt-40 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm open:border-emerald-300 open:shadow-md">
          <summary className="flex cursor-pointer list-none items-start gap-4 p-5 marker:content-none sm:p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 font-black text-emerald-800">{cue.id}</span><span className="min-w-0 flex-1"><span className="block text-xs font-black uppercase tracking-wider text-amber-600">{cue.place}</span><span className="mt-1 block font-black leading-6 text-slate-950">{cue.question}</span></span><span className="text-2xl text-emerald-600 transition group-open:rotate-45">+</span></summary>
          <div className="border-t border-emerald-100 bg-emerald-50/40 p-5 sm:p-6"><div className="grid gap-5 sm:grid-cols-2"><div><h3 className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Cue-card order</h3><ol className="mt-3 space-y-2">{cue.prompts.map((prompt,index) => <li key={prompt} className="flex gap-2 text-sm leading-6"><span className="font-black text-emerald-600">{index+1}.</span>{prompt}</li>)}</ol><div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">{cue.notes.map((note) => <p key={note} className="text-sm leading-6 text-slate-600">{note}</p>)}</div></div>
            <div><h3 className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Vocabulary sequence</h3><ol className="mt-3 space-y-2">{cue.vocabulary.map((word,index) => <li key={word} className="flex items-center gap-2 text-sm font-bold text-slate-700"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-[11px] text-amber-800">{index+1}</span>{word}</li>)}</ol></div></div>
            <div className="mt-5 rounded-2xl bg-[#153f32] p-4 text-sm leading-7 text-emerald-50"><span className="mr-2 font-black uppercase tracking-wider text-amber-300">Speak it:</span>{cue.memory}</div></div>
        </details>)}</div>
      </section>;
    })}</div>
  </main>;
}
