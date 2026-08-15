import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const topics = [
  {
    title: "People",
    icon: "👨‍👩‍👧",
    description: "family members, friends, teachers, famous people, helpful people",
    href: "/speaking/part2/people",
  },
  {
    title: "Places",
    icon: "📍",
    description: "hometown, cities, buildings, parks, tourist places, countryside",
    href: "/speaking/part2/places",
  },
  {
    title: "Objects / Things",
    icon: "🎁",
    description: "gifts, clothes, technology, books, photographs, possessions",
    href: "/speaking/part2/objects-things",
  },
  {
    title: "Events & Experiences",
    icon: "🎉",
    description: "celebrations, journeys, competitions, memorable experiences",
    href: "/speaking/part2/events-experiences",
  },
  {
    title: "Activities & Hobbies",
    icon: "🏃",
    description: "sports, reading, music, cooking, outdoor activities",
    href: "/speaking/part2/activities-hobbies",
  },
  {
    title: "Education & Learning",
    icon: "📚",
    description: "schools, teachers, subjects, skills, children’s education",
    href: "/speaking/part2/education-learning",
  },
  {
    title: "Work & Business",
    icon: "💼",
    description: "jobs, workplaces, careers, companies, leadership",
    href: "/speaking/part2/work-business",
  },
  {
    title: "Technology & Media",
    icon: "📱",
    description: "internet, smartphones, social media, advertisements, news",
    href: "/speaking/part2/technology-media",
  },
  {
    title: "Society & Lifestyle",
    icon: "🏙️",
    description: "family, traditions, communication, shopping, transport, health, behaviour",
    href: "/speaking/part2/society-lifestyle",
  },
  {
    title: "Environment & the Future",
    icon: "🌍",
    description: "nature, pollution, cities, climate, development and future changes",
    href: "/speaking/part2/environment-future",
  },
];

export default function Part2Page() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">IELTS</p>
              <p className="text-lg font-bold text-slate-900">Personal Study</p>
            </div>
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-sky-300 hover:bg-sky-50"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                  {topic.icon}
                </div>
                <div className="text-2xl font-bold text-slate-900">{topic.title}</div>
              </div>
              <p className="text-sm leading-6 text-slate-600">{topic.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
