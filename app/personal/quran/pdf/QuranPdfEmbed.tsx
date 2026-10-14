"use client";

import { useCallback, useEffect, useRef } from "react";

type QuranPdfEmbedProps = {
  pdfUrl: string;
};

export default function QuranPdfEmbed({ pdfUrl }: QuranPdfEmbedProps) {
  const pdfRef = useRef<HTMLObjectElement>(null);

  const focusPdf = useCallback(() => {
    pdfRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(focusPdf);
    const timeoutId = window.setTimeout(focusPdf, 250);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [focusPdf]);

  return (
    <object
      ref={pdfRef}
      tabIndex={0}
      onLoad={focusPdf}
      data={`${pdfUrl}#page=1&view=Fit`}
      type="application/pdf"
      aria-label="Quran PDF viewer"
      className="mt-6 h-[calc(100vh-13rem)] min-h-[640px] w-full rounded-2xl border border-slate-300 bg-white shadow-lg"
    >
      <p className="p-6">
        Your browser cannot display the PDF preview.{" "}
        <a href={pdfUrl} className="font-semibold text-emerald-700">
          Open the PDF
        </a>
        .
      </p>
    </object>
  );
}
