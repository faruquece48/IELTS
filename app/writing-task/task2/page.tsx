import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Task2Page() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/fa.png"
              alt="IELTS Logo"
              width={60}
              height={60}
              className="rounded-full"
              unoptimized
            />
          </div>
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Writing task 2</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900 md:text-5xl">Essay writing</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Topics and sample essays for Task 2 will be added here.
        </p>
      </section>
    </main>
  );
}
