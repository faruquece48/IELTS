"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";

type ServerStatus = "starting" | "started" | "error";

export default function DownloadPage() {
  const [status, setStatus] = useState<ServerStatus>("starting");
  const hasAutoStarted = useRef(false);

  const startServer = useCallback(async () => {
    setStatus("starting");
    try {
      const res = await fetch("/api/run-downloader", { method: "POST" });
      const data = await res.json();
      setStatus(data.success ? "started" : "error");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // Guard against React StrictMode's double-invoke in development, which would launch two windows.
    if (hasAutoStarted.current) return;
    hasAutoStarted.current = true;
    startServer();
  }, [startServer]);

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

      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-sky-100 bg-sky-50/60 px-5 py-4 text-sm text-slate-700">
          {status === "starting" && <p>Starting the local downloader server (start.bat)...</p>}
          {status === "started" && (
            <p>
              Downloader server launched in a separate window. Keep it open while you download.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600">
              Couldn&apos;t start the server automatically. Double-click{" "}
              <span className="font-semibold">start.bat</span> in{" "}
              <span className="font-mono">app/Downloader</span> manually.
            </p>
          )}
          <button
            type="button"
            onClick={startServer}
            className="shrink-0 rounded-full border border-sky-600 bg-white px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
          >
            Restart server
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-sky-100 shadow-sm">
          <iframe
            src="/downloader.html"
            title="Video Downloader"
            className="h-[900px] w-full border-0"
          />
        </div>
      </section>
    </main>
  );
}
