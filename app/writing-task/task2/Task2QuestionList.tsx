"use client";

import { Children, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;

export default function Task2QuestionList({ children }: { children?: ReactNode }) {
  const questions = Children.toArray(children);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const questionListRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.max(1, Math.ceil(questions.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  useEffect(() => {
    const start = (currentPageSafe - 1) * pageSize;
    const end = start + pageSize;

    questionListRef.current?.querySelectorAll<HTMLDetailsElement>(":scope > details").forEach((question, index) => {
      const isVisible = index >= start && index < end;
      question.toggleAttribute("hidden", !isVisible);

      if (showAllAnswers) {
        question.removeAttribute("name");
        question.open = isVisible;
      } else {
        question.setAttribute("name", "task2-questions");
        question.open = false;
      }
    });
  }, [currentPageSafe, pageSize, showAllAnswers]);

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;
    setCurrentPage(nextPage);
  }

  function renderPagination(label: string) {
    return (
      <nav aria-label={label} className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <button type="button" onClick={() => changePage(currentPageSafe - 1)} disabled={currentPageSafe === 1} className={`rounded-md px-3 py-2 text-sm font-medium transition ${currentPageSafe === 1 ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-100"}`}>« Previous</button>
        {pageNumbers.map((page) => <button key={page} type="button" aria-current={currentPageSafe === page ? "page" : undefined} onClick={() => changePage(page)} className={`h-10 min-w-10 rounded-md px-3 text-sm font-medium transition ${currentPageSafe === page ? "bg-violet-600 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}>{page}</button>)}
        <button type="button" onClick={() => changePage(currentPageSafe + 1)} disabled={currentPageSafe === totalPages} className={`rounded-md px-3 py-2 text-sm font-medium transition ${currentPageSafe === totalPages ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-100"}`}>Next »</button>
      </nav>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="task2-page-size" className="text-sm font-medium text-slate-700">Questions per page</label>
          <select id="task2-page-size" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100">
            {PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={showAllAnswers} onChange={(event) => setShowAllAnswers(event.target.checked)} disabled={questions.length === 0} className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 disabled:opacity-40" />
          Show all answers on this page
        </label>
      </div>

      {renderPagination("Question pages above the list")}
      <div ref={questionListRef} className="mt-6 space-y-4">
        {questions.length > 0 ? questions : <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">Questions will be added here.</p>}
      </div>
      {renderPagination("Question pages below the list")}
    </>
  );
}
