import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const topics = [
  { title: "Person", description: "Family, friends, teachers and inspiring people", href: "/speaking/part2/person", accent: "from-violet-500 to-indigo-600", icon: "person" },
  { title: "Places", description: "Cities, buildings, parks and memorable destinations", href: "/speaking/part2/places", accent: "from-sky-500 to-cyan-500", icon: "place" },
  { title: "Events & Experiences", description: "Celebrations, journeys and important moments", href: "/speaking/part2/events-experiences", accent: "from-rose-500 to-orange-500", icon: "event" },
  { title: "Objects & Things", description: "Gifts, books, technology and possessions", href: "/speaking/part2/objects-things", accent: "from-amber-400 to-orange-500", icon: "object" },
  { title: "Activities & Hobbies", description: "Sports, music, cooking and leisure activities", href: "/speaking/part2/activities-hobbies", accent: "from-emerald-500 to-teal-500", icon: "activity" },
  { title: "Education & Learning", description: "Schools, subjects, teachers and useful skills", href: "/speaking/part2/education-learning", accent: "from-blue-500 to-indigo-600", icon: "education" },
  { title: "Work & Business", description: "Jobs, careers, workplaces and leadership", href: "/speaking/part2/work-business", accent: "from-slate-600 to-slate-900", icon: "work" },
  { title: "Technology & Media", description: "The internet, devices, advertising and news", href: "/speaking/part2/technology-media", accent: "from-fuchsia-500 to-purple-600", icon: "technology" },
  { title: "Society & Lifestyle", description: "Traditions, transport, health and modern life", href: "/speaking/part2/society-lifestyle", accent: "from-cyan-500 to-blue-600", icon: "society" },
] as const;

function TopicIcon({ name }: { name: (typeof topics)[number]["icon"] }) {
  const paths = {
    person: <><circle cx="12" cy="8" r="3"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></>,
    place: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    event: <><path d="M5 3v3M19 3v3M4 9h16M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2Z"/><path d="m9 14 2 2 4-4"/></>,
    object: <><path d="M4 9h16v11H4zM12 9v11M3 9h18M7 9c-3 0-3-5 0-5 2.5 0 5 5 5 5M17 9c3 0 3-5 0-5-2.5 0-5 5-5 5"/></>,
    activity: <><circle cx="12" cy="5" r="2"/><path d="m9 22 1-6-3-3 2-4 4 2 3 3 4 1M14 22l-2-6 3-3"/></>,
    education: <><path d="m3 8 9-5 9 5-9 5-9-5Z"/><path d="M7 11v5c3 2 7 2 10 0v-5M21 8v7"/></>,
    work: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
    technology: <><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4M11 18h2"/></>,
    society: <><path d="M3 21v-8l5-4 4 3 4-4 5 4v9M8 21v-5h4v5M16 15h1"/></>,
  };
  return <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Part2Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f8fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 lg:px-8">
          <Link href="/" aria-label="Home" className="rounded-full transition hover:scale-105"><Image src="/fa.png" alt="IELTS Logo" width={56} height={56} className="rounded-full" unoptimized /></Link>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-14 pt-6 lg:px-8 lg:pb-20 lg:pt-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h1 className="text-3xl font-black tracking-tight">Choose your next topic</h1></div>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic, index) => (
            <Link key={topic.title} href={topic.href} className="group relative min-h-56 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_50px_rgba(15,23,42,0.13)]">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${topic.accent}`} />
              <div className="flex items-start justify-between"><div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${topic.accent}`}><TopicIcon name={topic.icon} /></div><span className="font-mono text-xs font-bold text-slate-300">{String(index + 1).padStart(2, "0")}</span></div>
              <h3 className="mt-7 text-xl font-black tracking-tight text-slate-900">{topic.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{topic.description}</p>
              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-indigo-600">Explore topic <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
