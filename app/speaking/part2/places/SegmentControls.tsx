"use client";

export default function SegmentControls({ segmentId }: { segmentId: string }) {
  const setCards = (open: boolean) => {
    document.querySelectorAll<HTMLDetailsElement>(`details[data-segment="${segmentId}"]`).forEach((card) => {
      card.open = open;
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" onClick={() => setCards(true)} className="rounded-xl bg-amber-300 px-3 py-2.5 text-xs font-black text-emerald-950 transition hover:bg-amber-200">Open all cards</button>
      <button type="button" onClick={() => setCards(false)} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-xs font-black text-white transition hover:bg-white/20">Close all</button>
    </div>
  );
}
