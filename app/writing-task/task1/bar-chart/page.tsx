"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function BarChartPage() {
  const [isOpen, setIsOpen] = useState(false);

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
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/60 shadow-sm">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <p className="text-base leading-8 text-slate-700">
              <span className="font-bold">Task 1:</span> The chart below shows the changes that took place in three different areas of crime in Newport city centre from 2003 to 2012. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.
            </p>
            <span className="shrink-0 text-2xl text-sky-700">{isOpen ? "−" : "+"}</span>
          </button>

          {isOpen && (
            <div className="border-t border-sky-100 bg-white px-5 py-6">
              <div className="relative mx-auto aspect-[16/10] w-full max-w-2xl">
                <Image
                  src="/ielts/01.png"
                  alt="Line chart showing burglary, car theft, and robbery in Newport city centre from 2003 to 2012"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-base leading-8 text-slate-700">
                  The line chart illustrates changes in three types of crime burglary, car theft and robbery in Newport city centre from 2003 to 2012.
                </p>

                <p className="text-base leading-8 text-slate-700">
                  Overall, burglary experienced a <span className="font-bold">dramatic downward trend</span>, whereas car theft <span className="font-bold">remained comparatively stable despite noticeable fluctuations</span>. By contrast, robbery <span className="font-bold">consistently accounted for the lowest number of incidents and showed only marginal variation</span> throughout the period.
                </p>

                <p className="text-base leading-8 text-slate-700">
                  In 2003, burglary stood at approximately 3,400 cases, making it the most prevalent offence at the start of the period. This figure rose to a peak of nearly 3,750 in 2004 before falling sharply to about 1,200 by 2008. Following this substantial decline, burglary levels stabilised with minor fluctuations, finishing at around 1,300 incidents in 2012, which represents <span className="font-bold">a reduction of more than half compared with the initial figure</span>.
                </p>

                <p className="text-base leading-8 text-slate-700">
                  Car theft displayed a different pattern, beginning at roughly 2,800 incidents in 2003 and fluctuating moderately over the following years. Although the number dropped to around 2,000 in 2006, it subsequently recovered, reaching a peak of approximately 2,700 in 2010 before declining slightly by the end of the period. Meanwhile, robbery remained the least common crime, varying between about 500 and 900 cases, with <span className="font-bold">no clear upward or downward trend</span>. Throughout the period, car theft consistently occurred at <span className="font-bold">a significantly higher rate than robbery</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
