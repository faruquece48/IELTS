import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function WorkBusinessPage() {
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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Speaking / Part 2 / Work & Business</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Work & Business topic</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Focus on the job, the environment, your responsibilities, and why it matters to your goals or the community.
        </p>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-slate-900">Sample topic</h2>
          <p className="text-slate-700">Describe a job you would like to do in the future.</p>
        </div>
      </section>
    </main>
  );
}
