"use client";

// src/hooks.ts
import { useState, useEffect, useCallback, useMemo } from "react";
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = useCallback(
    (value) => {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
        }
      }
    },
    [key]
  );
  return [storedValue, setValue];
}
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
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
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch {
      setCopied(false);
    }
  }, []);
  return [copied, copy];
}
function useCountdown(targetDate) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const calcRemaining = useCallback(() => {
    const diff = Math.max(0, target - Date.now());
    return {
      days: Math.floor(diff / (1e3 * 60 * 60 * 24)),
      hours: Math.floor(diff / (1e3 * 60 * 60) % 24),
      minutes: Math.floor(diff / (1e3 * 60) % 60),
      seconds: Math.floor(diff / 1e3 % 60),
      isExpired: diff <= 0
    };
  }, [target]);
  const [remaining, setRemaining] = useState(calcRemaining);
  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1e3);
    return () => clearInterval(id);
  }, [calcRemaining]);
  return remaining;
}
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}
function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    setPage(1);
  }, [items.length, pageSize]);
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);
  const goToPage = useCallback(
    (n) => setPage(Math.max(1, Math.min(n, totalPages))),
    [totalPages]
  );
  const nextPage = useCallback(() => goToPage(page + 1), [goToPage, page]);
  const prevPage = useCallback(() => goToPage(page - 1), [goToPage, page]);
  return { page, totalPages, pageItems, nextPage, prevPage, goToPage };
}
function useSort(items, initialKey, initialDir = "asc") {
  const [sortKey, setSortKey] = useState(initialKey ?? null);
  const [sortDir, setSortDir] = useState(initialDir);
  const setSort = useCallback(
    (key) => {
      if (key === sortKey) {
        setSortDir((d) => d === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortDir("asc");
      }
    },
    [sortKey]
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
function useFilter(items, filterFn) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return items;
    return items.filter((item) => filterFn(item, debouncedQuery));
  }, [items, debouncedQuery, filterFn]);
  return { filteredItems, query, setQuery };
}
export {
  useClickOutside,
  useCopyToClipboard,
  useCountdown,
  useDebounce,
  useFilter,
  useLocalStorage,
  useMediaQuery,
  usePagination,
  useSort,
  useToggle
};
