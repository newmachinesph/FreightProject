"use strict";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/hooks.ts
var hooks_exports = {};
__export(hooks_exports, {
  useClickOutside: () => useClickOutside,
  useCopyToClipboard: () => useCopyToClipboard,
  useCountdown: () => useCountdown,
  useDebounce: () => useDebounce,
  useFilter: () => useFilter,
  useLocalStorage: () => useLocalStorage,
  useMediaQuery: () => useMediaQuery,
  usePagination: () => usePagination,
  useSort: () => useSort,
  useToggle: () => useToggle
});
module.exports = __toCommonJS(hooks_exports);
var import_react = require("react");
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = (0, import_react.useState)(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (0, import_react.useCallback)(
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
  const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
  (0, import_react.useEffect)(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
function useMediaQuery(query) {
  const [matches, setMatches] = (0, import_react.useState)(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });
  (0, import_react.useEffect)(() => {
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
  (0, import_react.useEffect)(() => {
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
  const [copied, setCopied] = (0, import_react.useState)(false);
  const copy = (0, import_react.useCallback)(async (text) => {
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
  const target = (0, import_react.useMemo)(() => new Date(targetDate).getTime(), [targetDate]);
  const calcRemaining = (0, import_react.useCallback)(() => {
    const diff = Math.max(0, target - Date.now());
    return {
      days: Math.floor(diff / (1e3 * 60 * 60 * 24)),
      hours: Math.floor(diff / (1e3 * 60 * 60) % 24),
      minutes: Math.floor(diff / (1e3 * 60) % 60),
      seconds: Math.floor(diff / 1e3 % 60),
      isExpired: diff <= 0
    };
  }, [target]);
  const [remaining, setRemaining] = (0, import_react.useState)(calcRemaining);
  (0, import_react.useEffect)(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1e3);
    return () => clearInterval(id);
  }, [calcRemaining]);
  return remaining;
}
function useToggle(initial = false) {
  const [value, setValue] = (0, import_react.useState)(initial);
  const toggle = (0, import_react.useCallback)(() => setValue((v) => !v), []);
  return [value, toggle];
}
function usePagination(items, pageSize = 10) {
  const [page, setPage] = (0, import_react.useState)(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  (0, import_react.useEffect)(() => {
    setPage(1);
  }, [items.length, pageSize]);
  const pageItems = (0, import_react.useMemo)(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);
  const goToPage = (0, import_react.useCallback)(
    (n) => setPage(Math.max(1, Math.min(n, totalPages))),
    [totalPages]
  );
  const nextPage = (0, import_react.useCallback)(() => goToPage(page + 1), [goToPage, page]);
  const prevPage = (0, import_react.useCallback)(() => goToPage(page - 1), [goToPage, page]);
  return { page, totalPages, pageItems, nextPage, prevPage, goToPage };
}
function useSort(items, initialKey, initialDir = "asc") {
  const [sortKey, setSortKey] = (0, import_react.useState)(initialKey ?? null);
  const [sortDir, setSortDir] = (0, import_react.useState)(initialDir);
  const setSort = (0, import_react.useCallback)(
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
  const sortedItems = (0, import_react.useMemo)(() => {
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
  const [query, setQuery] = (0, import_react.useState)("");
  const debouncedQuery = useDebounce(query, 300);
  const filteredItems = (0, import_react.useMemo)(() => {
    if (!debouncedQuery) return items;
    return items.filter((item) => filterFn(item, debouncedQuery));
  }, [items, debouncedQuery, filterFn]);
  return { filteredItems, query, setQuery };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
