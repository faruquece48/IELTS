import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { placeCues } from "./placesData";
import SegmentControls from "./SegmentControls";

const segments = [
  { id:"home-village", title:"Home & village", story:"A familiar place with personal meaning", ids:[9,15,16,24], paragraphs:[
    ["Opening","I’d like to talk about my village home in northern Bangladesh, an emotional anchor that has shaped my identity since my formative years."],
    ["Scene","Its rural simplicity creates a clear contrast with Dhaka. The slower pace of life, environmental calm and familiar people give me a deep sense of belonging and a fresh perspective."],
    ["Action","At home, I often study on the rooftop, where minimal distractions give me clear headspace, deep focus and sustained attention. I also visit the nearby mosque courtyard for prayer and quiet reflection."],
    ["Feeling","These places provide emotional grounding, mental discipline and a moment of stillness. They restore my inner balance and act as a quiet reset."],
    ["Ending","Together, my village home, rooftop and local courtyard carry deep personal meaning and remain important parts of my daily life and personal identity."],
  ]},
  { id:"calm-city", title:"Calm city life", story:"A pleasant place I regularly visit", ids:[1,2,4,14,19,21], paragraphs:[
    ["Opening","I’d like to talk about my peaceful city route, which connects my university campus, Dhanmondi Lake, green parks and a familiar tea stall in Dhaka."],
    ["Scene","The lake and parks provide natural openness, calm surroundings and visual breathing room. Even in a busy city, they feel like a personal escape and a natural escape."],
    ["Action","I walk at an unhurried pace, sit beside the water, observe people and occasionally meet friends at the tea stall for free-flowing conversations."],
    ["Feeling","This routine gives me a mental pause, helps me switch off mentally and brings mental ease, quiet enjoyment and emotional balance."],
    ["Ending","Because the route is familiar and easy to visit, it has become my everyday anchor, social hub and dependable source of relief from pressure."],
  ]},
  { id:"busy-city", title:"Busy city, work & learning", story:"A reusable answer for one memorable place", ids:[6,8,10,23,25,26,27], paragraphs:[
    ["Opening","I’d like to describe a productive but intense day that took me from a professional office and training centre to several lively places in central Dhaka."],
    ["Scene","The office and British Council were structured, quiet and visibly well-maintained, whereas New Market and Kawran Bazar were packed with people, constant movement and noise."],
    ["Action","I completed focused work, received hands-on training in data analysis, met friends at a rooftop café and later photographed Ahsan Manzil in balanced natural light."],
    ["Feeling","The learning spaces built my confidence, responsibility and work discipline. The markets caused sensory overload, but the café and photography brought meaningful conversations and an emotional lift."],
    ["Ending","The day showed me the striking contrast of city life: skill-building spaces, respectful shared areas, collective energy, rich textures and real-world experience."],
  ]},
  { id:"coast-islands", title:"Coast & islands", story:"A memorable place beside the sea", ids:[3,5,17,18,28,30], paragraphs:[
    ["Opening","I’d like to describe a coastal place in Bangladesh that gave me a memorable experience. I visited it during a holiday and was excited because it was different from my usual surroundings."],
    ["Scene","The open sea, wide sky and fresh breeze created a peaceful atmosphere. The natural scenery and the sound of the waves made the place visually impressive and relaxing."],
    ["Action","I walked near the water, explored the surrounding area and took several photographs. I also tried some local food and spent time quietly enjoying the view."],
    ["Feeling","At first, I was amazed by the beauty and openness of the place. As I spent more time there, I felt calmer, happier and free from the pressure of city life."],
    ["Ending","The visit stayed in my memory because of both the scenery and the way it made me feel. It is a place I would be happy to experience again."],
  ]},
  { id:"hills-nature", title:"Hills & natural places", story:"A peaceful place surrounded by nature", ids:[7,11,12,20], paragraphs:[
    ["Opening","I’d like to describe a family nature trail that introduced me to Sajek Valley, a quiet tea garden and the unique ecosystem of the Sundarbans."],
    ["Scene","Sajek’s hills, clouds and greenery formed a striking landscape, the tea garden offered natural stillness, and the Sundarbans felt like a visually striking natural wonder."],
    ["Action","We went sightseeing, walked slowly, took photographs and spent quiet moments observing trees, rivers, wildlife and the open landscape."],
    ["Feeling","The trip gave us quality family time, a break from routine and a sense of awe. The undisturbed surroundings cleared my head and created emotional grounding."],
    ["Ending","It was an emotionally meaningful shared experience. The visual harmony, sense of togetherness and unforgettable scenery left a deep and lasting impression."],
  ]},
  { id:"future-plans", title:"Future places", story:"A place I hope to experience in the future", ids:[13,29], paragraphs:[
    ["Opening","I’d like to connect three meaningful places: historic Panam Nagar, the planned Purbachal area and Northern Norway, which I hope to visit in the future."],
    ["Scene","Panam Nagar has a historic atmosphere, Purbachal promises a less congested living environment, and Norway offers the extraordinary natural phenomenon of the midnight sun."],
    ["Action","I visited Panam Nagar for a family wedding photoshoot, I have explored Purbachal as a possible home, and I learned about Norway through travel videos and articles."],
    ["Feeling","The heritage visit was personally meaningful, the planned city suggests daily balance and long-term stability, and Norway fills me with a sense of wonder."],
    ["Ending","Together they represent a special milestone, a healthier future lifestyle and a once-in-a-lifetime experience that could help me disconnect from routine."],
  ]},
  { id:"heritage-occasion", title:"Heritage & occasion", story:"A memorable place for a special occasion", ids:[22], paragraphs:[
    ["Opening","A historic place connected with an important family occasion."],
    ["Scene","A distinctive setting with traditional architecture."],
    ["Action","Exploring the area and taking family photographs."],
    ["Feeling","A happy and personally meaningful shared experience."],
    ["Ending","A special occasion that remains clear in my memory."],
  ]},
] as const;

const smoothPhrases: Record<number, string> = {
  1: "peaceful escape", 2: "calm atmosphere", 3: "lasting impression", 4: "familiar retreat", 5: "natural charm",
  6: "professional setting", 7: "quality family time", 8: "relaxed setting", 9: "sense of belonging", 10: "lively atmosphere",
  11: "natural stillness", 12: "natural wonder", 13: "balanced lifestyle", 14: "peaceful surroundings", 15: "slower pace of life",
  16: "clear headspace", 17: "iconic destination", 18: "natural simplicity", 19: "unhurried pace", 20: "striking landscape",
  21: "friendly meeting place", 22: "historic atmosphere", 23: "hands-on learning", 24: "quiet reflection", 25: "well-maintained space",
  26: "constant noise", 27: "rich visual detail", 28: "carefree moments", 29: "sense of wonder", 30: "remote atmosphere",
};

const naturalStories: Record<string, Array<[string, string]>> = {
  "home-village": [
    ["Opening", "I'd like to describe a familiar place that has become an important part of my life. I have known it for a considerable time, so it carries many personal memories. I go there whenever I need to focus, reflect or take a short break from my normal routine."],
    ["Scene", "It is quieter and simpler than most places I visit. The surroundings are familiar, there is enough open space, and the atmosphere is usually peaceful. Nothing about it is luxurious, but that simplicity makes me feel comfortable and allows me to pay attention to my own thoughts."],
    ["Action", "I normally find a comfortable spot and spend some quiet time there. Depending on what I need to do, I may read, organise my thoughts or simply observe my surroundings. Because there are fewer distractions, I can concentrate properly and use my time in a meaningful way."],
    ["Feeling", "This place helps me slow down and feel emotionally settled. Its peaceful environment clears my mind, while its familiarity gives me a strong sense of comfort and belonging. Even when I arrive feeling tired or worried, I usually become calmer after spending a little time there."],
    ["Ending", "For me, its value comes from the role it plays in my everyday life rather than its appearance. It supports both my practical needs and my peace of mind. That is why it remains personally meaningful and why I never take it for granted."],
  ],
  "calm-city": [
    ["Opening", "I'd like to describe a place in Dhaka that I visit regularly whenever I have some free time. I first discovered it through my normal daily routine, and it gradually became one of my favourite local places. Since it is easy to reach, I can go there without making a detailed plan."],
    ["Scene", "Although it is located inside a busy city, it has a surprisingly pleasant atmosphere. There is enough space to move around, sit comfortably and watch everyday life. It can become lively at certain times, but it still feels more relaxed than the crowded roads and commercial areas nearby."],
    ["Action", "When I arrive, I normally walk around or find a comfortable place to sit. I enjoy observing the surroundings and letting my thoughts settle. Sometimes I meet people I know, and we have a casual conversation about our studies, work or recent experiences."],
    ["Feeling", "This simple routine gives me a mental break and helps me release stress. I do not need any expensive activity to enjoy my time there. After even a short visit, I usually feel calmer, more refreshed and better prepared to continue the rest of my day."],
    ["Ending", "Because the place is familiar, convenient and enjoyable, it has become an important part of my city life. It offers both quiet personal time and opportunities for social contact. That balance is the main reason I continue returning to it."],
  ],
  "busy-city": [
    ["Opening", "I'd like to describe a place in Dhaka that I remember clearly because I had a meaningful experience there. I visited it some time ago for a particular reason, and I stayed long enough to notice the place properly. Although it is part of a busy city, it had its own character and left a clear impression on me."],
    ["Scene", "The first thing I noticed was its distinctive atmosphere and surroundings. I paid attention to the layout, the people, the sounds and the level of activity around me. Some parts felt comfortable and organised, while other aspects were more intense than I had expected. These small details made it different from the places I usually visit."],
    ["Action", "While I was there, I focused on the main activity I had planned. I also observed what was happening around me and tried to understand how people used the place. I spent enough time there to experience it properly instead of leaving in a hurry. This gave me several clear details that I could remember afterwards."],
    ["Feeling", "At first, I felt curious and slightly unsure because the environment was unfamiliar. After a while, I became more comfortable and involved in the experience. Some parts were enjoyable and useful, although other parts could be tiring or overwhelming. Overall, the visit taught me something and helped me see a different side of city life."],
    ["Ending", "That is why this place still stands out in my mind. It was not simply the location itself, but also what I did, noticed and felt there that made it memorable. Whenever I think about it, I can clearly remember the atmosphere and the experience."],
  ],
  "coast-islands": [
    ["Opening", "I'd like to describe a coastal place in Bangladesh that gave me a memorable experience. I visited it during a holiday some time ago, after hearing many positive things about it. The journey took several hours, but I felt excited because the destination was completely different from my usual surroundings."],
    ["Scene", "When I arrived, the first things I noticed were the open sea, the wide sky and the fresh breeze. The natural scenery was beautiful, and the sound of the waves created a peaceful atmosphere. Although there were other visitors nearby, I could still find quieter areas where I could appreciate the view without feeling disturbed."],
    ["Action", "I walked slowly near the water and explored the surrounding area. I took several photographs because the changing light made the scenery look especially attractive. I also tried some local food and spent time watching the waves. Instead of following a strict schedule, I allowed myself to enjoy the place at a relaxed pace."],
    ["Feeling", "At first, I was amazed by the beauty and openness of the area. After spending some time there, I felt calmer, happier and free from the pressure of city life. The peaceful environment helped me clear my mind, while the experience itself gave me a strong sense of freedom and enjoyment."],
    ["Ending", "This place has remained in my memory because of both its natural beauty and the way it made me feel. It showed me how refreshing a simple change of environment can be. For that reason, it is a place I would gladly experience again and remember for a long time."],
  ],
  "hills-nature": [
    ["Opening", "I'd like to describe a natural place in Bangladesh that I visited during a holiday. I had heard several positive things about it before the trip, but seeing it in person was much more impressive. The journey also gave me a welcome opportunity to leave the city for a while."],
    ["Scene", "The area was filled with greenery, fresh air and wide natural views. Its landscape had several unusual features that made it different from places I normally see. Most importantly, it felt peaceful because it was far from heavy traffic, crowded streets and constant city noise."],
    ["Action", "I explored the area slowly, observed its natural features and took several photographs. I also found time to sit quietly and appreciate the surroundings. During the visit, I learned a little about the environment and how local people help preserve its natural character."],
    ["Feeling", "The experience made me feel calm, curious and more connected to nature. I particularly enjoyed having enough time to notice small details instead of rushing from one activity to another. The peaceful environment helped me forget my usual responsibilities and clear my mind."],
    ["Ending", "This place left a lasting impression because its atmosphere and natural beauty were difficult to forget. The visit was both relaxing and educational, which made it especially worthwhile. I would be happy to return and spend more time there in the future."],
  ],
  "future-plans": [
    ["Opening", "I'd like to describe a place where I hope to spend a significant amount of time in the future. I first became interested in it after seeing photographs and learning about its environment. Since then, I have occasionally searched for more information and imagined what being there might be like."],
    ["Scene", "From what I have seen, it appears less crowded and more peaceful than the area where I currently live. It offers attractive surroundings, useful facilities and enough open space to enjoy daily life. This combination makes it seem both interesting and comfortable."],
    ["Action", "If I get the opportunity to go there, I would explore the area carefully and experience its everyday atmosphere. I would spend time outdoors, visit its most interesting locations and learn about the local way of life. I would also take photographs so that I could remember the experience clearly."],
    ["Feeling", "The idea of going there makes me feel hopeful and excited. I believe that living in or exploring a different environment would broaden my experience and help me become more independent. It could also give me a healthier balance between my responsibilities and personal life."],
    ["Ending", "Although this plan may require time, preparation and money, it remains an important personal goal. I hope that one day I can turn it from an idea into a real experience. Achieving that goal would be both satisfying and memorable for me."],
  ],
  "heritage-occasion": [
    ["Opening", "I'd like to describe a historic place that I visited for an important family occasion. I went there with several relatives, and we were all looking forward to spending the day together. The event was already meaningful, but choosing such an unusual location made it even more memorable."],
    ["Scene", "The place had old buildings, distinctive architecture and a calm historical atmosphere. Its faded walls and traditional designs looked completely different from the modern areas I normally visit. Every part of it seemed to carry a story from the past, which made the surroundings visually interesting."],
    ["Action", "We explored the area together, took many photographs and spent time enjoying the occasion. I tried to notice the architectural details while also helping my family with the day's arrangements. The historic background made our photographs and shared moments feel particularly special."],
    ["Feeling", "I felt happy to be with my family and fascinated by the surroundings. The combination of history, celebration and time with people close to me gave the visit a unique emotional value. Even though the day was busy, I enjoyed almost every moment of it."],
    ["Ending", "I still remember that occasion clearly because the place and the event complemented each other perfectly. It was more than an ordinary visit or family gathering. It became a meaningful shared memory that I expect to value for many years."],
  ],
};

const storyHighlights: Record<string, string[]> = {
  "home-village": ["an important part of my life", "feel comfortable", "fewer distractions", "comfort and belonging", "personally meaningful"],
  "calm-city": ["one of my favourite local places", "a surprisingly pleasant atmosphere", "a casual conversation", "a mental break", "an important part of my city life"],
  "busy-city": ["a meaningful experience", "distinctive atmosphere", "the main activity I had planned", "a different side of city life", "stands out in my mind"],
  "coast-islands": ["a memorable experience", "a peaceful atmosphere", "at a relaxed pace", "clear my mind", "remember for a long time"],
  "hills-nature": ["seeing it in person", "wide natural views", "appreciate the surroundings", "clear my mind", "a lasting impression"],
  "future-plans": ["a significant amount of time", "both interesting and comfortable", "the local way of life", "broaden my experience", "an important personal goal"],
  "heritage-occasion": ["an important family occasion", "a calm historical atmosphere", "particularly special", "a unique emotional value", "a meaningful shared memory"],
};

function highlightedSentence(text: string, phrase: string) {
  const position = text.indexOf(phrase);
  if (position < 0) return text;
  return <>{text.slice(0, position)}<strong className="font-black text-amber-200">{phrase}</strong>{text.slice(position + phrase.length)}</>;
}

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
            <div className="mt-6 space-y-4 text-[15px] leading-7 text-emerald-50 sm:text-base">{naturalStories[segment.id].map(([label,text], index) => <p key={label}><b className="text-amber-200">{label}:</b> {" "}{highlightedSentence(text, storyHighlights[segment.id][index])}</p>)}</div>
          </div>
          <aside className="self-start rounded-3xl border border-white/15 bg-black/15 p-5 backdrop-blur-sm lg:sticky lg:top-40"><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-200">Cards covered by this story</p>
            <div className="mt-4 space-y-2">{topics.map((topic) => <a key={topic.id} href={`#topic-${topic.id}`} className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 transition hover:bg-white/20"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-300 text-xs font-black text-emerald-950">{topic.id}</span><span><b className="block text-sm text-amber-200">{topic.place}</b><span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-emerald-50">{topic.question}</span></span></a>)}</div>
            <div className="mt-4"><SegmentControls segmentId={segment.id} /></div>
          </aside>
        </div></div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">{topics.map((cue) => <details key={cue.id} id={`topic-${cue.id}`} data-segment={segment.id} className="group scroll-mt-40 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm open:border-emerald-300 open:shadow-md">
          <summary className="flex cursor-pointer list-none items-start gap-4 p-5 marker:content-none sm:p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 font-black text-emerald-800">{cue.id}</span><span className="min-w-0 flex-1"><span className="block text-xs font-black uppercase tracking-wider text-amber-600">{cue.place}</span><span className="mt-1 block font-black leading-6 text-slate-950">{cue.question}</span></span><span className="text-2xl text-emerald-600 transition group-open:rotate-45">+</span></summary>
          <div className="border-t border-emerald-100 bg-emerald-50/40 p-5 sm:p-6"><div className="grid gap-5 sm:grid-cols-2"><div><h3 className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Cue-card order</h3><ol className="mt-3 space-y-2">{cue.prompts.map((prompt,index) => <li key={prompt} className="flex gap-2 text-sm leading-6"><span className="font-black text-emerald-600">{index+1}.</span>{prompt}</li>)}</ol><div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">{cue.notes.map((note) => <p key={note} className="text-sm leading-6 text-slate-600">{note}</p>)}</div></div>
            <div><h3 className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Smooth phrase</h3><div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-700"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-[11px] text-amber-800">1</span>{smoothPhrases[cue.id]}</div></div></div>
            <div className="mt-5 rounded-2xl bg-[#153f32] p-4 text-sm leading-7 text-emerald-50"><span className="mr-2 font-black uppercase tracking-wider text-amber-300">Speak it:</span>{cue.memory}</div></div>
        </details>)}</div>
      </section>;
    })}</div>
  </main>;
}
