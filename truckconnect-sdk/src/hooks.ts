"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── useLocalStorage ────────────────────────────────────────────────────────────
/**
 * Persist state in localStorage with SSR safety.
 *
 * @example
 *   const [lang, setLang] = useLocalStorage("tc_lang", "en");
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
          // quota exceeded — silently ignore
        }
      }
    },
    [key],
  );

  return [storedValue, setValue];
}

// ─── useDebounce ────────────────────────────────────────────────────────────────
/**
 * Debounce a rapidly-changing value (e.g. search input).
 *
 * @example
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── useMediaQuery ──────────────────────────────────────────────────────────────
/**
 * Subscribe to a CSS media query.
 *
 * @example
 *   const isMobile = useMediaQuery("(max-width: 768px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

// ─── useClickOutside ────────────────────────────────────────────────────────────
/**
 * Fires `handler` when the user clicks outside the referenced element.
 *
 * @example
 *   const ref = useRef<HTMLDivElement>(null);
 *   useClickOutside(ref, () => setOpen(false));
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void,
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ─── useCopyToClipboard ─────────────────────────────────────────────────────────
/**
 * Copy text to the clipboard. `copied` auto-resets after 2 seconds.
 *
 * @example
 *   const [copied, copy] = useCopyToClipboard();
 *   <button onClick={() => copy(apiKey)}>{copied ? "Copied!" : "Copy"}</button>
 */
export function useCopyToClipboard(): [boolean, (text: string) => Promise<void>] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  return [copied, copy];
}

// ─── useCountdown ───────────────────────────────────────────────────────────────
/**
 * Live countdown to a target date (e.g. bid deadlines).
 *
 * @example
 *   const { days, hours, minutes, seconds, isExpired } = useCountdown("2026-04-01T00:00:00Z");
 */
export function useCountdown(targetDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

  const calcRemaining = useCallback(() => {
    const diff = Math.max(0, target - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: diff <= 0,
    };
  }, [target]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  return remaining;
}

// ─── useToggle ──────────────────────────────────────────────────────────────────
/**
 * Simple boolean toggle.
 *
 * @example
 *   const [open, toggle] = useToggle();
 */
export function useToggle(initial: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

// ─── usePagination ──────────────────────────────────────────────────────────────
/**
 * Client-side pagination over an array.
 *
 * @example
 *   const { page, totalPages, pageItems, nextPage, prevPage } = usePagination(loads, 10);
 */
export function usePagination<T>(
  items: T[],
  pageSize: number = 10,
): {
  page: number;
  totalPages: number;
  pageItems: T[];
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (n: number) => void;
} {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Reset to page 1 when items or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [items.length, pageSize]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goToPage = useCallback(
    (n: number) => setPage(Math.max(1, Math.min(n, totalPages))),
    [totalPages],
  );
  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page]);

  return { page, totalPages, pageItems, nextPage, prevPage, goToPage };
}

// ─── useSort ────────────────────────────────────────────────────────────────────
/**
 * Sort an array by a given key. Clicking the same key toggles direction.
 *
 * @example
 *   const { sortedItems, sortKey, sortDir, setSort } = useSort(loads, "createdAt", "desc");
 */
export function useSort<T>(
  items: T[],
  initialKey?: keyof T,
  initialDir: "asc" | "desc" = "asc",
): {
  sortedItems: T[];
  sortKey: keyof T | null;
  sortDir: "asc" | "desc";
  setSort: (key: keyof T) => void;
} {
  const [sortKey, setSortKey] = useState<keyof T | null>(initialKey ?? null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(initialDir);

  const setSort = useCallback(
    (key: keyof T) => {
      if (key === sortKey) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey],
  );

  const sortedItems = useMemo(() => {
    if (sortKey == null) return items;
    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [items, sortKey, sortDir]);

  return { sortedItems, sortKey, sortDir, setSort };
}

// ─── useFilter ──────────────────────────────────────────────────────────────────
/**
 * Filter an array with a debounced search query.
 *
 * @example
 *   const { filteredItems, query, setQuery } = useFilter(
 *     loads,
 *     (load, q) => load.origin.toLowerCase().includes(q.toLowerCase()),
 *   );
 */
export function useFilter<T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean,
): {
  filteredItems: T[];
  query: string;
  setQuery: (q: string) => void;
} {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return items;
    return items.filter((item) => filterFn(item, debouncedQuery));
  }, [items, debouncedQuery, filterFn]);

  return { filteredItems, query, setQuery };
}
