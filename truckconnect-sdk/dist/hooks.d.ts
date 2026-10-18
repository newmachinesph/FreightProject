/**
 * Persist state in localStorage with SSR safety.
 *
 * @example
 *   const [lang, setLang] = useLocalStorage("tc_lang", "en");
 */
declare function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void];
/**
 * Debounce a rapidly-changing value (e.g. search input).
 *
 * @example
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 */
declare function useDebounce<T>(value: T, delay?: number): T;
/**
 * Subscribe to a CSS media query.
 *
 * @example
 *   const isMobile = useMediaQuery("(max-width: 768px)");
 */
declare function useMediaQuery(query: string): boolean;
/**
 * Fires `handler` when the user clicks outside the referenced element.
 *
 * @example
 *   const ref = useRef<HTMLDivElement>(null);
 *   useClickOutside(ref, () => setOpen(false));
 */
declare function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void): void;
/**
 * Copy text to the clipboard. `copied` auto-resets after 2 seconds.
 *
 * @example
 *   const [copied, copy] = useCopyToClipboard();
 *   <button onClick={() => copy(apiKey)}>{copied ? "Copied!" : "Copy"}</button>
 */
declare function useCopyToClipboard(): [boolean, (text: string) => Promise<void>];
/**
 * Live countdown to a target date (e.g. bid deadlines).
 *
 * @example
 *   const { days, hours, minutes, seconds, isExpired } = useCountdown("2026-04-01T00:00:00Z");
 */
declare function useCountdown(targetDate: string | Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
};
/**
 * Simple boolean toggle.
 *
 * @example
 *   const [open, toggle] = useToggle();
 */
declare function useToggle(initial?: boolean): [boolean, () => void];
/**
 * Client-side pagination over an array.
 *
 * @example
 *   const { page, totalPages, pageItems, nextPage, prevPage } = usePagination(loads, 10);
 */
declare function usePagination<T>(items: T[], pageSize?: number): {
    page: number;
    totalPages: number;
    pageItems: T[];
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (n: number) => void;
};
/**
 * Sort an array by a given key. Clicking the same key toggles direction.
 *
 * @example
 *   const { sortedItems, sortKey, sortDir, setSort } = useSort(loads, "createdAt", "desc");
 */
declare function useSort<T>(items: T[], initialKey?: keyof T, initialDir?: "asc" | "desc"): {
    sortedItems: T[];
    sortKey: keyof T | null;
    sortDir: "asc" | "desc";
    setSort: (key: keyof T) => void;
};
/**
 * Filter an array with a debounced search query.
 *
 * @example
 *   const { filteredItems, query, setQuery } = useFilter(
 *     loads,
 *     (load, q) => load.origin.toLowerCase().includes(q.toLowerCase()),
 *   );
 */
declare function useFilter<T>(items: T[], filterFn: (item: T, query: string) => boolean): {
    filteredItems: T[];
    query: string;
    setQuery: (q: string) => void;
};

export { useClickOutside, useCopyToClipboard, useCountdown, useDebounce, useFilter, useLocalStorage, useMediaQuery, usePagination, useSort, useToggle };
