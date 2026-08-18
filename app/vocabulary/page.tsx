import Image from "next/image";
import Navbar from "@/components/Navbar";

const linkingWords = [
  {
    category: "AND",
    items: [
      "In addition",
      "Moreover",
      "Furthermore",
      "Not to mention",
      "What's more",
      "Additionally",
    ]
  },
  {
    category: "SO",
    items: [
      "Therefore",
      "Consequently",
      "As a result",
      "Thus",
      "For this reason",
      "Hence",
    ]
  },
  {
    category: "BECAUSE",
    items: [
      "Due to",
      "Owing to",
      "As a result of",
      "Given that",
      "Since",
      "In light of",
    ]
  },
  {
    category: "BUT",
    items: [
      "However",
      "Nevertheless",
      "Nonetheless",
      "On the contrary",
      "That being said",
      "Even so",
    ]
  }
];

const technologyTopics = [
  "Zoom",
  "Geographic distance/barrier",
  "Virtual meeting",
  "WhatsApp",
  "Email",
  "Largely at our fingertips",
  "Foster communication",
  "Interactions",
  "Face to face",
];

const familyTopics = [
  "Central role",
  "Most decisions",
  "Strong bonds",
  "Big part of life",
  "Education and finances",
  "Family gatherings",
  "Respect",
  "Birthdays",
  "Holidays",
  "Foundation of society",
  "Guidance",
];

const familySentences = [
  "People's behavior is often seen as an extension of their family rather than through the lens of just one individual's actions.",
  "It is not just about responsibility; it's about love, connection, and that sense of belonging.",
];

const celebrationTopics = [
  "Foster joy",
  "Strengthen social bonds",
  "Come together",
  "Share their experiences",
  "Heart of the culture",
  "Festivals and customs",
  "Share similar goals",
];

const celebrationSentences = [
  "Ultimately, I believe that the significance of celebrations lies not only in the happiness they bring but also in their ability to unite and reinforce communal ties.",
];

const sportsTopics = [
  "Team sports",
  "Young adults",
  "Football, basketball, volleyball",
];

const sportsSentences = [
  "I think this trend will continue in the future because team sports help people communicate and work together.",
];

const houseworkTopics = [
  "Clean space",
  "Fostering important qualities",
  "Fostering stronger family relationships",
  "Own responsibilities",
  "Hard-working skills",
  "Encourages them to work",
  "Beneficial for their physical activity",
  "Burn a lot of energy",
  "Adolescents (কিশোর)",
  "Washing their dishes or cleaning",
  "Wiping down the tables",
  "Mopping the floor",
  "Living independently",
  "Personal development",
  "Chores",
  "Express gratitude to their parents",
  "Develop empathy",
  "Instill essential life skills",
];

const advertisementTopics = [
  "What they are presented with",
  "Recognize",
  "Distinguish",
  "Awareness",
  "Unique features",
  "Shape people's preferences",
  "Function that",
];

export default function VocabularyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={80}
              height={80}
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

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Vocabulary library
          </p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Segments</h1>
          <p className="mt-3 text-lg text-slate-600">
            Explore useful words and expressions by subject.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-sky-200 bg-sky-50/60 shadow-sm">
            <div className="border-b border-sky-200 bg-sky-100/70 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">Segment</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Technology</h2>
            </div>
            <div className="p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                Topics
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {technologyTopics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 rounded-xl border border-sky-100 bg-white px-4 py-3 text-lg text-slate-700"
                  >
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60 shadow-sm md:col-span-2">
            <div className="border-b border-rose-200 bg-rose-100/70 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700">Segment</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Family</h2>
            </div>
            <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                  Topics
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {familyTopics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-3 rounded-xl border border-rose-100 bg-white px-4 py-3 text-lg text-slate-700"
                    >
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                  Sentences
                </h3>
                <div className="space-y-4">
                  {familySentences.map((sentence) => (
                    <blockquote
                      key={sentence}
                      className="rounded-xl border border-rose-100 bg-white px-5 py-4 text-lg italic leading-relaxed text-slate-700"
                    >
                      “{sentence}”
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 shadow-sm md:col-span-2">
            <div className="border-b border-amber-200 bg-amber-100/70 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Segment</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Celebration</h2>
            </div>
            <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                  Topics
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {celebrationTopics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3 text-lg text-slate-700"
                    >
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                  Sentence
                </h3>
                {celebrationSentences.map((sentence) => (
                  <blockquote
                    key={sentence}
                    className="rounded-xl border border-amber-100 bg-white px-5 py-4 text-lg italic leading-relaxed text-slate-700"
                  >
                    “{sentence}”
                  </blockquote>
                ))}
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/60 shadow-sm md:col-span-2">
            <div className="border-b border-emerald-200 bg-emerald-100/70 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Segment</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Sports</h2>
            </div>
            <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                  Topics
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {sportsTopics.map((topic) => (
                    <li
                      key={topic}
                      className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-lg text-slate-700"
                    >
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                  Sentence
                </h3>
                {sportsSentences.map((sentence) => (
                  <blockquote
                    key={sentence}
                    className="rounded-xl border border-emerald-100 bg-white px-5 py-4 text-lg italic leading-relaxed text-slate-700"
                  >
                    “{sentence}”
                  </blockquote>
                ))}
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/60 shadow-sm md:col-span-2">
            <div className="border-b border-violet-200 bg-violet-100/70 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Segment</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Housework</h2>
            </div>
            <div className="p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                Topics
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {houseworkTopics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 rounded-xl border border-violet-100 bg-white px-4 py-3 text-lg text-slate-700"
                  >
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-cyan-200 bg-cyan-50/60 shadow-sm md:col-span-2">
            <div className="border-b border-cyan-200 bg-cyan-100/70 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Segment</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Advertisement</h2>
            </div>
            <div className="p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                Topics
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {advertisementTopics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 rounded-xl border border-cyan-100 bg-white px-4 py-3 text-lg text-slate-700"
                  >
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm md:col-span-2">
            <div className="border-b border-slate-200 bg-slate-100 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Folder</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Other</h2>
            </div>
            <div className="p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                Linking words
              </h3>
              <ul className="space-y-5">
                {linkingWords.map((section) => (
                  <li key={section.category} className="text-lg leading-relaxed text-slate-700">
                    <span className="font-bold text-slate-900">{section.category}</span>
                    <span className="mx-2 text-slate-400">—</span>
                    {section.items.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
