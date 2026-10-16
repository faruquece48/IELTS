import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const tools = [
  {
    title: "Quran Reader",
    description: "Read the scanned Mushaf, preview the complete PDF, or jump directly to any Surah.",
    href: "/personal/quran",
    icon: "☪",
  },
  {
    title: "Speaking Timer",
    description: "Practise IELTS speaking with a focused two-minute countdown and quick time presets.",
    href: "/personal/timer",
    icon: "⏱️",
  },
  {
    title: "Professor Tracker",
    description: "Shortlist structural engineering supervisors, assess funding fit, plan outreach, and monitor replies.",
    href: "/personal/professor",
    icon: "🎓",
  },
  {
    title: "Gold Intelligence",
    description: "Monitor live gold prices, review hourly movement, and explore a transparent 24-hour forecast.",
    href: "/personal/gold",
    icon: "Au",
  },
  {
    title: "Campus AQI",
    description: "Compare live air quality and hourly outlooks across major university campuses in Bangladesh.",
    href: "/personal/aqi",
    icon: "AQI",
  },
  {
    title: "4K JPG Finisher",
    description: "Fit or crop an image to 4K dimensions, choose JPEG quality, preview it, and download the result.",
    href: "/personal/4k-finisher",
    icon: "🖼️",
  },
  {
    title: "HD Image Upscaler",
    description: "Load an Ecency image URL, enlarge it up to 4×, preview it, and save a high-quality JPG.",
    href: "/personal/high",
    icon: "✨",
  },
];

export default function PersonalPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Link href="/" aria-label="Home" suppressHydrationWarning>
            <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          </Link>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-2xl sm:px-12">
          {/* Decorative Background Elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sky-300 ring-1 ring-inset ring-sky-500/30">
              Workspace
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
              Personal Utilities <span className="text-sky-400">Hub</span>
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              A curated collection of high-performance tools designed for productivity, study, and digital asset management.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/10">
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-sky-50/0 to-transparent transition-all duration-300 group-hover:from-sky-50/50"></div>
              
              <div className="relative z-10">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white shadow-inner">
                  <span aria-hidden="true">{tool.icon}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-sky-700">{tool.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3">{tool.description}</p>
              </div>
              
              <div className="relative z-10 mt-6 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 transition-all duration-300 group-hover:translate-x-1">
                  Open App
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all duration-300 group-hover:bg-sky-600 group-hover:text-white">
                  <span className="text-lg">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
