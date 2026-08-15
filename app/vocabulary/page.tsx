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

export default function VocabularyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">
              I
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">IELTS</p>
              <p className="text-lg font-bold text-slate-900">Personal Study</p>
            </div>
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <ul className="space-y-6 ml-6">
          {linkingWords.map((section) => (
            <li key={section.category} className="text-slate-700 text-lg leading-relaxed">
              <span className="font-bold">{section.category}</span> - {section.items.join(", ")}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
