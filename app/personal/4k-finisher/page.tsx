import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function FourKFinisherPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 lg:px-8">
          <Link href="/" aria-label="Home" suppressHydrationWarning>
            <Image src="/fa.png" alt="IELTS Logo" width={60} height={60} className="rounded-full" unoptimized />
          </Link>
          <Navbar />
        </div>
      </header>
      <iframe
        title="4K JPG Finisher"
        src="/4k-finisher.html"
        className="block h-[calc(100vh-77px)] min-h-[680px] w-full border-0"
      />
    </main>
  );
}