"use client";

import Link from "next/link";

export default function QAPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Content Moved</h1>
        <p className="mt-2 text-slate-600">This page has been moved to Speaking Part 3.</p>
        <Link href="/speaking/part3" className="mt-4 inline-block rounded-full bg-sky-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-sky-500">
          Go to Speaking Part 3
        </Link>
      </div>
    </div>
  );
} 
