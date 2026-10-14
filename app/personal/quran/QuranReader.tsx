"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type WheelEvent } from "react";
import { QURAN_FIRST_PAGE, QURAN_LAST_PAGE } from "@/lib/quran";

const LEGACY_BOOKMARKS_STORAGE_KEY = "quran-page-bookmarks-v1";
const BOOKMARKS_STORAGE_KEY = "quran-page-bookmarks-v2";
const BOOKMARKS_CHANGE_EVENT = "quran-page-bookmarks-change";
const EMPTY_BOOKMARKS_SNAPSHOT = '{"version":2,"bookmarks":[]}';
const MAX_BOOKMARK_TITLE_LENGTH = 80;
const WHEEL_NAVIGATION_THRESHOLD = 24;
const WHEEL_NAVIGATION_COOLDOWN_MS = 140;
const MIN_ZOOM = 100;
const MAX_ZOOM = 250;
const ZOOM_STEP = 25;
let fallbackBookmarksSnapshot = EMPTY_BOOKMARKS_SNAPSHOT;

type QuranBookmark = {
  page: number;
  title: string;
};

function clampPage(page: number) {
  return Math.min(QURAN_LAST_PAGE, Math.max(QURAN_FIRST_PAGE, Math.trunc(page)));
}

function pageImageSource(page: number) {
  return `/api/quran/page/${page}`;
}

function defaultBookmarkTitle(page: number) {
  return `Page ${page}`;
}

function normalizeBookmarkTitle(title: unknown, page: number) {
  if (typeof title !== "string") return defaultBookmarkTitle(page);
  return title.trim().slice(0, MAX_BOOKMARK_TITLE_LENGTH) || defaultBookmarkTitle(page);
}

function normalizeBookmarks(value: unknown): QuranBookmark[] {
  const entries =
    typeof value === "object" && value !== null && "bookmarks" in value
      ? (value as { bookmarks?: unknown }).bookmarks
      : value;

  if (!Array.isArray(entries)) return [];

  const bookmarks = new Map<number, QuranBookmark>();

  for (const entry of entries) {
    const page =
      typeof entry === "number"
        ? entry
        : typeof entry === "object" && entry !== null && "page" in entry
          ? (entry as { page?: unknown }).page
          : null;

    if (
      typeof page !== "number" ||
      !Number.isInteger(page) ||
      page < QURAN_FIRST_PAGE ||
      page > QURAN_LAST_PAGE
    ) {
      continue;
    }

    const title = normalizeBookmarkTitle(
      typeof entry === "object" && entry !== null && "title" in entry
        ? (entry as { title?: unknown }).title
        : undefined,
      page,
    );
    const existing = bookmarks.get(page);

    if (!existing || (existing.title === defaultBookmarkTitle(page) && title !== defaultBookmarkTitle(page))) {
      bookmarks.set(page, { page, title });
    }
  }

  return Array.from(bookmarks.values()).sort((left, right) => left.page - right.page);
}

function BookmarkList({
  bookmarks,
  currentPage,
  disabled,
  headingId,
  onSelect,
  onRename,
  onRemove,
  onClear,
}: {
  bookmarks: QuranBookmark[];
  currentPage: number;
  disabled: boolean;
  headingId: string;
  onSelect: (page: number) => void;
  onRename: (page: number, title: string) => void;
  onRemove: (bookmark: QuranBookmark) => void;
  onClear: () => void;
}) {
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [titleDraft, setTitleDraft] = useState("");

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 id={headingId} className="font-bold text-slate-950">Saved pages</h2>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
          {bookmarks.length}
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">Bookmark a page to build your reading list.</p>
      ) : (
        <>
          <ol className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1 md:max-h-[calc(100vh-17rem)]">
            {bookmarks.map((bookmark, index) => {
              const isCurrentPage = bookmark.page === currentPage;
              const bookmarkDetails = [
                bookmark.title === defaultBookmarkTitle(bookmark.page) ? null : `Page ${bookmark.page}`,
                isCurrentPage ? "Current" : null,
              ]
                .filter(Boolean)
                .join(" · ");

              if (editingPage === bookmark.page) {
                return (
                  <li key={bookmark.page} className="rounded-xl border border-emerald-300 bg-emerald-50 p-2">
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        const nextTitle = titleDraft.trim();
                        if (!nextTitle) return;
                        onRename(bookmark.page, nextTitle);
                        setEditingPage(null);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true" className="w-7 shrink-0 text-center text-xs font-bold tabular-nums text-slate-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <input
                          autoFocus
                          aria-label={`Title for bookmark on page ${bookmark.page}`}
                          value={titleDraft}
                          maxLength={MAX_BOOKMARK_TITLE_LENGTH}
                          onChange={(event) => setTitleDraft(event.currentTarget.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              event.preventDefault();
                              setEditingPage(null);
                            }
                          }}
                          className="min-w-0 flex-1 rounded-lg border border-emerald-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingPage(null)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-emerald-700 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-800"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </li>
                );
              }

              return (
                <li
                  key={bookmark.page}
                  className={
                    isCurrentPage
                      ? "flex items-center overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50"
                      : "flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                  }
                >
                  <span aria-hidden="true" className="ml-2 w-7 shrink-0 text-center text-xs font-bold tabular-nums text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    aria-current={isCurrentPage ? "page" : undefined}
                    disabled={disabled}
                    onClick={() => onSelect(bookmark.page)}
                    className="min-w-0 flex-1 px-2 py-2 text-left font-semibold text-emerald-800 hover:text-emerald-950 disabled:cursor-wait disabled:opacity-50"
                  >
                    <span className="block truncate">{bookmark.title}</span>
                    {bookmarkDetails && <span className="block truncate text-xs font-medium text-emerald-600">{bookmarkDetails}</span>}
                  </button>
                  <button
                    type="button"
                    title="Rename bookmark"
                    aria-label={`Rename bookmark ${bookmark.title}`}
                    onClick={() => {
                      setEditingPage(bookmark.page);
                      setTitleDraft(bookmark.title);
                    }}
                    className="self-stretch border-l border-slate-200 px-2 text-slate-400 hover:bg-amber-50 hover:text-amber-700"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
                      <path d="m13.5 6.5 4 4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete bookmark ${bookmark.title} for page ${bookmark.page}`}
                    onClick={() => onRemove(bookmark)}
                    className="self-stretch border-l border-slate-200 px-2 font-bold text-slate-400 hover:bg-rose-50 hover:text-rose-700"
                  >
                    &times;
                  </button>
                </li>
              );
            })}
          </ol>
          <button type="button" onClick={onClear} className="mt-3 text-sm font-semibold text-rose-700 hover:text-rose-900">
            Clear all
          </button>
        </>
      )}
    </>
  );
}

function readBookmarksSnapshot() {
  try {
    const currentSnapshot = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (currentSnapshot !== null) return currentSnapshot;

    return window.localStorage.getItem(LEGACY_BOOKMARKS_STORAGE_KEY) ?? EMPTY_BOOKMARKS_SNAPSHOT;
  } catch {
    return fallbackBookmarksSnapshot;
  }
}

function readServerBookmarksSnapshot() {
  return EMPTY_BOOKMARKS_SNAPSHOT;
}

function subscribeToBookmarks(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === BOOKMARKS_STORAGE_KEY || event.key === LEGACY_BOOKMARKS_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(BOOKMARKS_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(BOOKMARKS_CHANGE_EVENT, onStoreChange);
  };
}

function writeBookmarksSnapshot(bookmarks: QuranBookmark[]) {
  const snapshot = JSON.stringify({ version: 2, bookmarks });
  fallbackBookmarksSnapshot = snapshot;

  try {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, snapshot);
  } catch {
    // Bookmarks still work for this session when storage is unavailable.
  }

  window.dispatchEvent(new Event(BOOKMARKS_CHANGE_EVENT));
}

function preloadPageImage(page: number) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();

    image.onload = () => {
      image.decode().catch(() => undefined).finally(resolve);
    };
    image.onerror = () => resolve();
    image.src = pageImageSource(page);
  });
}

export default function QuranReader({ initialPage = QURAN_FIRST_PAGE }: { initialPage?: number }) {
  const [page, setPage] = useState(clampPage(initialPage));
  const [pageInput, setPageInput] = useState(String(clampPage(initialPage)));
  const [loadingPage, setLoadingPage] = useState<number | null>(null);
  const [reservedCardHeight, setReservedCardHeight] = useState<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const cardRef = useRef<HTMLDivElement>(null);
  const zoomViewportRef = useRef<HTMLDivElement>(null);
  const pendingZoomCenterRef = useRef<{ x: number; y: number } | null>(null);
  const mobileBookmarksRef = useRef<HTMLDetailsElement>(null);
  const navigationIdRef = useRef(0);
  const navigationInFlightRef = useRef(false);
  const pendingCardTopRef = useRef<number | null>(null);
  const wheelGestureRef = useRef({ delta: 0, lastEventAt: 0, lastNavigationAt: 0 });
  const bookmarksSnapshot = useSyncExternalStore(
    subscribeToBookmarks,
    readBookmarksSnapshot,
    readServerBookmarksSnapshot,
  );
  const bookmarks = useMemo(() => {
    try {
      return normalizeBookmarks(JSON.parse(bookmarksSnapshot));
    } catch {
      return [];
    }
  }, [bookmarksSnapshot]);

  useLayoutEffect(() => {
    if (reservedCardHeight !== null || pendingCardTopRef.current === null || !cardRef.current) return;

    const scrollDelta = cardRef.current.getBoundingClientRect().top - pendingCardTopRef.current;
    pendingCardTopRef.current = null;

    if (Math.abs(scrollDelta) < 0.5) return;

    const rootStyle = document.documentElement.style;
    const previousScrollBehavior = rootStyle.scrollBehavior;
    rootStyle.scrollBehavior = "auto";
    window.scrollBy(0, scrollDelta);
    rootStyle.scrollBehavior = previousScrollBehavior;
  }, [reservedCardHeight]);

  useLayoutEffect(() => {
    const viewport = zoomViewportRef.current;
    const center = pendingZoomCenterRef.current;
    if (!viewport || !center) return;

    pendingZoomCenterRef.current = null;
    viewport.scrollLeft = center.x * viewport.scrollWidth - viewport.clientWidth / 2;
    viewport.scrollTop = center.y * viewport.scrollHeight - viewport.clientHeight / 2;
  }, [zoom]);

  function updateBookmarks(update: (current: QuranBookmark[]) => QuranBookmark[]) {
    let current = bookmarks;

    try {
      current = normalizeBookmarks(JSON.parse(readBookmarksSnapshot()));
    } catch {
      // Use the bookmarks from the current render if storage contains invalid JSON.
    }

    writeBookmarksSnapshot(normalizeBookmarks(update(current)));
  }

  function toggleCurrentPageBookmark() {
    const existingBookmark = bookmarks.find((bookmark) => bookmark.page === page);

    if (existingBookmark) {
      if (!window.confirm(`Are you sure you want to delete bookmark “${existingBookmark.title}” for page ${page}?`)) return;
      updateBookmarks((current) => current.filter((bookmark) => bookmark.page !== page));
      return;
    }

    updateBookmarks((current) => [...current, { page, title: defaultBookmarkTitle(page) }]);
  }

  function renameBookmark(bookmarkPage: number, title: string) {
    updateBookmarks((current) =>
      current.map((bookmark) =>
        bookmark.page === bookmarkPage
          ? { ...bookmark, title: normalizeBookmarkTitle(title, bookmarkPage) }
          : bookmark,
      ),
    );
  }

  function removeBookmark(bookmarkToRemove: QuranBookmark) {
    if (
      !window.confirm(
        `Are you sure you want to delete bookmark “${bookmarkToRemove.title}” for page ${bookmarkToRemove.page}?`,
      )
    ) {
      return;
    }
    updateBookmarks((current) => current.filter((bookmark) => bookmark.page !== bookmarkToRemove.page));
  }

  function clearAllBookmarks() {
    if (bookmarks.length === 0) return;
    const bookmarkLabel = bookmarks.length === 1 ? "bookmark" : "bookmarks";
    if (!window.confirm(`Are you sure you want to delete all ${bookmarks.length} saved ${bookmarkLabel}? This cannot be undone.`)) return;
    updateBookmarks(() => []);
  }

  const goToPage = useCallback(async (nextPage: number) => {
    if (!Number.isFinite(nextPage) || navigationInFlightRef.current) return;

    const safePage = clampPage(nextPage);
    if (safePage === page) return;

    const navigationId = ++navigationIdRef.current;
    navigationInFlightRef.current = true;
    setLoadingPage(safePage);
    await preloadPageImage(safePage);

    if (navigationId !== navigationIdRef.current) {
      navigationInFlightRef.current = false;
      setLoadingPage(null);
      return;
    }

    const cardBounds = cardRef.current?.getBoundingClientRect();
    if (cardBounds) {
      pendingCardTopRef.current = cardBounds.top;
      setReservedCardHeight(cardBounds.height);
    }

    setPage(safePage);
    setPageInput(String(safePage));
    window.history.replaceState(null, "", `/personal/quran?page=${safePage}`);
  }, [page]);

  function commitPageInput() {
    if (pageInput.trim() === "") {
      setPageInput(String(page));
      return;
    }

    const requestedPage = Number(pageInput);

    if (!Number.isInteger(requestedPage)) {
      setPageInput(String(page));
      return;
    }

    const safePage = clampPage(requestedPage);
    setPageInput(String(safePage));
    void goToPage(safePage);
  }

  function finishPageChange() {
    navigationInFlightRef.current = false;
    setReservedCardHeight(null);
    setLoadingPage(null);
  }

  function handleWheel(event: WheelEvent<HTMLElement>) {
    if (event.ctrlKey || event.deltaY === 0 || zoom > MIN_ZOOM) return;

    event.preventDefault();

    const now = Date.now();
    const gesture = wheelGestureRef.current;

    if (now - gesture.lastEventAt > 200 || Math.sign(gesture.delta) !== Math.sign(event.deltaY)) {
      gesture.delta = 0;
    }

    gesture.lastEventAt = now;
    gesture.delta += event.deltaY;

    if (
      Math.abs(gesture.delta) < WHEEL_NAVIGATION_THRESHOLD ||
      now - gesture.lastNavigationAt < WHEEL_NAVIGATION_COOLDOWN_MS ||
      navigationIsLoading
    ) {
      return;
    }

    const direction = gesture.delta > 0 ? 1 : -1;
    gesture.delta = 0;
    gesture.lastNavigationAt = now;
    void goToPage(page + direction);
  }

  function setCenteredZoom(nextZoom: number) {
    const viewport = zoomViewportRef.current;
    const safeZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
    if (safeZoom === zoom) return;

    if (viewport) {
      pendingZoomCenterRef.current = {
        x: (viewport.scrollLeft + viewport.clientWidth / 2) / viewport.scrollWidth,
        y: (viewport.scrollTop + viewport.clientHeight / 2) / viewport.scrollHeight,
      };
    }

    setZoom(safeZoom);
  }

  const currentPageIsBookmarked = bookmarks.some((bookmark) => bookmark.page === page);
  const navigationIsLoading = loadingPage !== null;

  useEffect(() => {
    if (page > QURAN_FIRST_PAGE) void preloadPageImage(page - 1);
    if (page < QURAN_LAST_PAGE) void preloadPageImage(page + 1);
  }, [page]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        navigationIsLoading ||
        navigationInFlightRef.current
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      if (
        target?.closest(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="spinbutton"], [role="slider"], [role="combobox"]',
        )
      ) {
        return;
      }

      const nextPage = event.key === "ArrowLeft" ? page - 1 : event.key === "ArrowRight" ? page + 1 : null;
      if (nextPage === null || nextPage < QURAN_FIRST_PAGE || nextPage > QURAN_LAST_PAGE) return;

      event.preventDefault();
      void goToPage(nextPage);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPage, navigationIsLoading, page]);

  return (
    <section onWheel={handleWheel} className="flex flex-col md:h-full md:min-h-0">
      <div className="order-2 mt-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        <button
          type="button"
          title="Previous page (Left Arrow)"
          aria-keyshortcuts="ArrowLeft"
          onClick={() => void goToPage(page - 1)}
          disabled={page === QURAN_FIRST_PAGE || navigationIsLoading}
          className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>
        <label className="flex items-center gap-2 font-medium text-slate-700">
          Page
          <input
            aria-label="Quran page"
            type="number"
            min={QURAN_FIRST_PAGE}
            max={QURAN_LAST_PAGE}
            value={pageInput}
            disabled={navigationIsLoading}
            title="Type a page number, then press Enter"
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => setPageInput(event.currentTarget.value)}
            onBlur={commitPageInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitPageInput();
              } else if (event.key === "Escape") {
                event.preventDefault();
                setPageInput(String(page));
              }
            }}
            className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-center outline-none focus:border-emerald-500 disabled:cursor-wait disabled:opacity-60"
          />
          <span className="text-slate-400">/ {QURAN_LAST_PAGE}</span>
        </label>
        <button
          type="button"
          title="Next page (Right Arrow)"
          aria-keyshortcuts="ArrowRight"
          onClick={() => void goToPage(page + 1)}
          disabled={page === QURAN_LAST_PAGE || navigationIsLoading}
          className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
        <button
          type="button"
          aria-pressed={currentPageIsBookmarked}
          onClick={toggleCurrentPageBookmark}
          disabled={navigationIsLoading}
          className={
            currentPageIsBookmarked
              ? "rounded-xl bg-amber-100 px-4 py-2 font-semibold text-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
              : "rounded-xl border border-emerald-700 bg-white px-4 py-2 font-semibold text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          {currentPageIsBookmarked ? "Remove bookmark" : "Bookmark page"}
        </button>
        <Link
          href="/personal/quran/surahs"
          className="rounded-xl border border-emerald-700 bg-white px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          Browse Surahs
        </Link>
        <Link
          href="/personal/quran/pdf"
          className="rounded-xl border border-emerald-700 bg-white px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          PDF preview
        </Link>

        <p className="sr-only" aria-live="polite">
          {loadingPage ? `Loading Quran page ${loadingPage}` : `Quran page ${page} loaded`}
        </p>
      </div>

      <div className="order-1 grid items-start gap-5 md:min-h-0 md:flex-1 md:grid-cols-[11rem_minmax(0,48rem)] md:justify-center lg:grid-cols-[14rem_minmax(0,48rem)]">
        <aside
          aria-labelledby="desktop-saved-pages-heading"
          className="hidden rounded-2xl border border-emerald-200 bg-white p-3 shadow-sm md:block md:max-h-full md:overflow-y-auto"
        >
          <BookmarkList
            bookmarks={bookmarks}
            currentPage={page}
            disabled={navigationIsLoading}
            headingId="desktop-saved-pages-heading"
            onSelect={(bookmark) => void goToPage(bookmark)}
            onRename={renameBookmark}
            onRemove={removeBookmark}
            onClear={clearAllBookmarks}
          />
        </aside>

        <details ref={mobileBookmarksRef} className="rounded-2xl border border-emerald-200 bg-white shadow-sm md:hidden">
          <summary className="cursor-pointer list-none select-none px-4 py-3 font-bold text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 [&::-webkit-details-marker]:hidden">
            Bookmarks ({bookmarks.length})
          </summary>
          <div className="border-t border-slate-100 p-4">
            <BookmarkList
              bookmarks={bookmarks}
              currentPage={page}
              disabled={navigationIsLoading}
              headingId="mobile-saved-pages-heading"
              onSelect={(bookmark) => {
                mobileBookmarksRef.current?.removeAttribute("open");
                void goToPage(bookmark);
              }}
              onRename={renameBookmark}
              onRemove={removeBookmark}
              onClear={clearAllBookmarks}
            />
          </div>
        </details>

        <div
          ref={cardRef}
          aria-busy={navigationIsLoading}
          style={reservedCardHeight === null ? undefined : { minHeight: `${reservedCardHeight}px` }}
          className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl md:col-start-2 md:row-start-1 md:h-full sm:p-4"
        >
          <div className="absolute right-3 top-3 z-10 flex flex-col items-center overflow-hidden rounded-xl border border-emerald-200 bg-white/95 shadow-md backdrop-blur">
            <button
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              disabled={zoom === MAX_ZOOM}
              onClick={() => setCenteredZoom(zoom + ZOOM_STEP)}
              className="grid h-10 w-11 place-items-center text-xl font-bold text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setCenteredZoom(MIN_ZOOM)}
              className="w-11 border-y border-emerald-100 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
              title="Reset to fit"
            >
              {zoom === MIN_ZOOM ? "Fit" : `${zoom}%`}
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              title="Zoom out"
              disabled={zoom === MIN_ZOOM}
              onClick={() => setCenteredZoom(zoom - ZOOM_STEP)}
              className="grid h-10 w-11 place-items-center text-xl font-bold text-emerald-800 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-35"
            >
              −
            </button>
          </div>
          <div ref={zoomViewportRef} className="h-full w-full overflow-auto">
            <div
              className="flex min-w-full items-start justify-center md:min-h-0"
              style={{ width: `${zoom}%`, height: `${zoom}%` }}
            >
              {/* The route serves the original scan without recompression. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={page}
                src={pageImageSource(page)}
                alt={`Scanned Quran page ${page}`}
                onLoad={finishPageChange}
                onError={finishPageChange}
                className="h-auto w-full md:h-full md:w-full md:max-w-none md:object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
