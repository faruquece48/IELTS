import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function AqiPaperPage() {
  return <main className="min-h-screen bg-[#f4f8f8] text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-2 lg:px-8">
        <Link href="/"><Image src="/fa.png" alt="IELTS Logo" width={58} height={58} className="rounded-full" unoptimized/></Link>
        <Navbar/>
      </div>
    </header>
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2">
          <div>
            <h1 className="text-lg font-black">AQI research manuscript</h1>
            <p className="text-xs text-slate-500">Abstract, introduction, reproducible methods, limitations, and references</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/personal/aqi" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Back to AQI</Link>
            <a href="/api/aqi/paper?download=1" className="rounded-xl bg-[#062c30] px-4 py-2.5 text-sm font-black text-white hover:bg-[#0a4147]">Download PDF</a>
          </div>
        </div>
        <iframe title="Bangladesh AQI research manuscript" src="/api/aqi/paper#page=1&zoom=page-fit&toolbar=1&navpanes=0" className="h-[85vh] min-h-[700px] w-full rounded-2xl border border-slate-200 bg-slate-100"/>
      </section>
    </div>
  </main>;
}
