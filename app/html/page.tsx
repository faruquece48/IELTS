import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const tools = [
  {
    title: "4K JPG Finisher",
    description: "Fit or crop an image to 4K dimensions, choose JPEG quality, preview it, and download the result.",
    href: "/html/4k-finisher",
    icon: "🖼️",
  },
  {
    title: "HD Image Upscaler",
    description: "Load an Ecency image URL, enlarge it up to 4×, preview it, and save a high-quality JPG.",
    href: "/html/high",
    icon: "✨",
  },
];

export default function HtmlToolsPage() {
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

      <section className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">HTML tools</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">Image utilities</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Open either tool below. Each runs directly in your browser and keeps its original controls and download workflow.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md">
              <span className="text-4xl" aria-hidden="true">{tool.icon}</span>
              <h2 className="mt-5 text-2xl font-bold text-slate-900 group-hover:text-sky-700">{tool.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{tool.description}</p>
              <span className="mt-6 inline-flex font-semibold text-sky-700">Open tool →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}