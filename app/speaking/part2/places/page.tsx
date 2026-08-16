import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function PlacesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
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

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Speaking / Part 2 / Places</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Places topic</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Describe the place clearly: where it is, what it looks like, what you did there, and why it is memorable.
        </p>

        <div className="mt-10 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-slate-900">Sample topic</h2>
            <p className="text-slate-700">Describe a place in your hometown that you enjoy visiting.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
