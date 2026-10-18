import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock React hooks so we can test hook logic in a Node environment ─────────
// We intercept useState/useEffect/useCallback/useMemo/useRef so each hook's
// internal logic runs synchronously without a React renderer.

let stateStore: Map<number, unknown>;
let stateIndex: number;
let effects: Array<() => void | (() => void)>;

function mockUseState<T>(initial: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void] {
  const idx = stateIndex++;
  if (!stateStore.has(idx)) {
    stateStore.set(idx, typeof initial === "function" ? (initial as () => T)() : initial);
  }
  const value = stateStore.get(idx) as T;
  const setter = (v: T | ((prev: T) => T)) => {
    const current = stateStore.get(idx) as T;
    const next = typeof v === "function" ? (v as (prev: T) => T)(current) : v;
    stateStore.set(idx, next);
  };
  return [value, setter];
}

function mockUseMemo<T>(factory: () => T, _deps?: unknown[]): T {
  return factory();
}

function mockUseCallback<T extends (...args: unknown[]) => unknown>(fn: T, _deps?: unknown[]): T {
  return fn;
}

function mockUseEffect(fn: () => void | (() => void), _deps?: unknown[]): void {
  effects.push(fn);
}

function mockUseRef<T>(initial: T): { current: T } {
  return { current: initial };
}

vi.mock("react", () => ({
  useState: (init: unknown) => mockUseState(init),
  useMemo: (fn: () => unknown, deps?: unknown[]) => mockUseMemo(fn, deps),
  useCallback: (fn: (...args: unknown[]) => unknown, deps?: unknown[]) => mockUseCallback(fn, deps),
  useEffect: (fn: () => void | (() => void), deps?: unknown[]) => mockUseEffect(fn, deps),
  useRef: (init: unknown) => mockUseRef(init),
}));

// Import hooks AFTER mocking React
import {
  useToggle,
  usePagination,
  useSort,
  useFilter,
  useCountdown,
  useCopyToClipboard,
  useDebounce,
  useLocalStorage,
} from "../hooks";

function resetMockState() {
  stateStore = new Map();
  stateIndex = 0;
  effects = [];
}

// Helper: call the hook fresh, returning its result
function callHook<T>(fn: () => T): T {
  resetMockState();
  return fn();
}

// Helper: call hook, flush effects, then re-call to get updated state
function callHookWithEffects<T>(fn: () => T): T {
  resetMockState();
  fn(); // first call — registers effects
  // run effects (they may update state)
  for (const eff of effects) eff();
  // re-call with same state store but reset index
  stateIndex = 0;
  effects = [];
  return fn();
}

// ─── Tests ───────────────────────────────────────────────────────────────────────

describe("hooks module exports", () => {
  it("exports all expected hooks", () => {
    expect(typeof useToggle).toBe("function");
    expect(typeof usePagination).toBe("function");
    expect(typeof useSort).toBe("function");
    expect(typeof useFilter).toBe("function");
    expect(typeof useCountdown).toBe("function");
    expect(typeof useCopyToClipboard).toBe("function");
    expect(typeof useDebounce).toBe("function");
    expect(typeof useLocalStorage).toBe("function");
  });
});

describe("useToggle", () => {
  it("returns false by default", () => {
    const [value] = callHook(() => useToggle());
    expect(value).toBe(false);
  });

  it("respects custom initial value", () => {
    const [value] = callHook(() => useToggle(true));
    expect(value).toBe(true);
  });

  it("toggle function flips state", () => {
    const [value, toggle] = callHook(() => useToggle(false));
    expect(value).toBe(false);
    // call toggle — it updates state store
    toggle();
    // re-read state
    stateIndex = 0;
    const [updatedValue] = useToggle(false);
    expect(updatedValue).toBe(true);
  });

  it("double toggle returns to original", () => {
    const [, toggle] = callHook(() => useToggle(false));
    toggle();
    toggle();
    stateIndex = 0;
    const [value] = useToggle(false);
    expect(value).toBe(false);
  });
});

describe("usePagination", () => {
  const items = Array.from({ length: 25 }, (_, i) => `item-${i + 1}`);

  it("returns first page of items", () => {
    const result = callHook(() => usePagination(items, 10));
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(3);
    expect(result.pageItems).toHaveLength(10);
    expect(result.pageItems[0]).toBe("item-1");
    expect(result.pageItems[9]).toBe("item-10");
  });

  it("calculates totalPages correctly", () => {
    const result = callHook(() => usePagination(items, 5));
    expect(result.totalPages).toBe(5);
  });

  it("calculates totalPages = 1 for empty array", () => {
    const result = callHook(() => usePagination([], 10));
    expect(result.totalPages).toBe(1);
    expect(result.pageItems).toHaveLength(0);
  });

  it("goToPage navigates correctly", () => {
    const result = callHook(() => usePagination(items, 10));
    result.goToPage(2);
    stateIndex = 0;
    effects = [];
    const result2 = usePagination(items, 10);
    expect(result2.page).toBe(2);
    expect(result2.pageItems[0]).toBe("item-11");
    expect(result2.pageItems).toHaveLength(10);
  });

  it("goToPage clamps to valid range", () => {
    const result = callHook(() => usePagination(items, 10));
    result.goToPage(100);
    stateIndex = 0;
    effects = [];
    const result2 = usePagination(items, 10);
    expect(result2.page).toBe(3); // clamped to totalPages
  });

  it("goToPage clamps minimum to 1", () => {
    const result = callHook(() => usePagination(items, 10));
    result.goToPage(-5);
    stateIndex = 0;
    effects = [];
    const result2 = usePagination(items, 10);
    expect(result2.page).toBe(1);
  });

  it("last page returns remaining items", () => {
    const result = callHook(() => usePagination(items, 10));
    result.goToPage(3);
    stateIndex = 0;
    effects = [];
    const result2 = usePagination(items, 10);
    expect(result2.pageItems).toHaveLength(5);
    expect(result2.pageItems[0]).toBe("item-21");
  });

  it("nextPage advances by one", () => {
    const result = callHook(() => usePagination(items, 10));
    result.nextPage();
    stateIndex = 0;
    effects = [];
    const result2 = usePagination(items, 10);
    expect(result2.page).toBe(2);
  });

  it("prevPage goes back by one", () => {
    const result = callHook(() => usePagination(items, 10));
    result.goToPage(3);
    stateIndex = 0;
    effects = [];
    const result3 = usePagination(items, 10);
    result3.prevPage();
    stateIndex = 0;
    effects = [];
    const result4 = usePagination(items, 10);
    expect(result4.page).toBe(2);
  });

  it("prevPage does not go below 1", () => {
    const result = callHook(() => usePagination(items, 10));
    result.prevPage();
    stateIndex = 0;
    effects = [];
    const result2 = usePagination(items, 10);
    expect(result2.page).toBe(1);
  });
});

describe("useSort", () => {
  interface Item {
    name: string;
    age: number;
  }

  const items: Item[] = [
    { name: "Charlie", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 },
  ];

  it("returns items unsorted when no initial key", () => {
    const result = callHook(() => useSort(items));
    expect(result.sortKey).toBeNull();
    expect(result.sortDir).toBe("asc");
    expect(result.sortedItems).toEqual(items);
  });

  it("sorts by initial key ascending", () => {
    const result = callHook(() => useSort(items, "name", "asc"));
    expect(result.sortKey).toBe("name");
    expect(result.sortedItems[0].name).toBe("Alice");
    expect(result.sortedItems[1].name).toBe("Bob");
    expect(result.sortedItems[2].name).toBe("Charlie");
  });

  it("sorts by initial key descending", () => {
    const result = callHook(() => useSort(items, "name", "desc"));
    expect(result.sortedItems[0].name).toBe("Charlie");
    expect(result.sortedItems[2].name).toBe("Alice");
  });

  it("sorts numerically", () => {
    const result = callHook(() => useSort(items, "age", "asc"));
    expect(result.sortedItems[0].age).toBe(25);
    expect(result.sortedItems[1].age).toBe(30);
    expect(result.sortedItems[2].age).toBe(35);
  });

  it("sorts numerically descending", () => {
    const result = callHook(() => useSort(items, "age", "desc"));
    expect(result.sortedItems[0].age).toBe(35);
    expect(result.sortedItems[2].age).toBe(25);
  });

  it("does not mutate original array", () => {
    const original = [...items];
    callHook(() => useSort(items, "name", "asc"));
    expect(items).toEqual(original);
  });

  it("setSort changes sort key", () => {
    const result = callHook(() => useSort(items, "name", "asc"));
    result.setSort("age");
    stateIndex = 0;
    effects = [];
    const result2 = useSort(items, "name", "asc");
    expect(result2.sortKey).toBe("age");
    expect(result2.sortDir).toBe("asc"); // new key resets to asc
  });

  it("setSort toggles direction when same key", () => {
    const result = callHook(() => useSort(items, "name", "asc"));
    result.setSort("name"); // same key -> toggles
    stateIndex = 0;
    effects = [];
    const result2 = useSort(items, "name", "asc");
    expect(result2.sortDir).toBe("desc");
  });

  it("handles null values by sorting them last", () => {
    const itemsWithNull = [
      { name: "Charlie", age: 30 },
      { name: null as unknown as string, age: 25 },
      { name: "Alice", age: 35 },
    ];
    const result = callHook(() => useSort(itemsWithNull, "name", "asc"));
    expect(result.sortedItems[2].name).toBeNull();
  });
});

describe("useFilter", () => {
  const items = [
    { city: "Manila", code: "MNL" },
    { city: "Cebu", code: "CEB" },
    { city: "Davao", code: "DVO" },
    { city: "Makati", code: "MKT" },
  ];

  const filterFn = (item: typeof items[0], q: string) =>
    item.city.toLowerCase().includes(q.toLowerCase());

  it("returns all items when query is empty", () => {
    const result = callHook(() => useFilter(items, filterFn));
    expect(result.query).toBe("");
    expect(result.filteredItems).toEqual(items);
  });

  it("provides setQuery function", () => {
    const result = callHook(() => useFilter(items, filterFn));
    expect(typeof result.setQuery).toBe("function");
  });

  it("filters items when debounced query is set", () => {
    // Simulate: set query, then the debounced value catches up
    const result = callHook(() => useFilter(items, filterFn));
    result.setQuery("ma");
    // After setQuery, the raw query state is updated but useDebounce
    // still returns "" on next sync call. We need to also update the
    // debounce state. The debounce state is at stateIndex=2 (filter query=0, debounce=1).
    // Manually poke debounce state to simulate timer firing.
    stateStore.set(1, "ma");
    stateIndex = 0;
    effects = [];
    const result2 = useFilter(items, filterFn);
    expect(result2.filteredItems).toHaveLength(2); // Manila, Makati
    expect(result2.filteredItems.map((i) => i.city)).toContain("Manila");
    expect(result2.filteredItems.map((i) => i.city)).toContain("Makati");
  });

  it("is case insensitive (via filterFn)", () => {
    stateStore.set(0, "CEBU");
    stateStore.set(1, "CEBU");
    const result = callHook(() => {
      // Override: don't reset state for this test
      return null;
    });
    // Actually do it properly:
    resetMockState();
    stateStore.set(0, "CEBU");
    stateStore.set(1, "CEBU");
    const filtered = useFilter(items, filterFn);
    expect(filtered.filteredItems).toHaveLength(1);
    expect(filtered.filteredItems[0].city).toBe("Cebu");
  });

  it("returns empty when nothing matches", () => {
    resetMockState();
    stateStore.set(0, "xyz");
    stateStore.set(1, "xyz");
    const result = useFilter(items, filterFn);
    expect(result.filteredItems).toHaveLength(0);
  });
});

describe("useCountdown", () => {
  it("returns expired state for past date", () => {
    const result = callHook(() => useCountdown("2020-01-01T00:00:00Z"));
    expect(result.isExpired).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it("returns non-expired state for future date", () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days ahead
    const result = callHook(() => useCountdown(futureDate));
    expect(result.isExpired).toBe(false);
    expect(result.days).toBeGreaterThanOrEqual(1);
  });

  it("calculates days/hours/minutes/seconds for known offset", () => {
    // 1 day, 2 hours, 3 minutes, 4 seconds from now
    const offset = (1 * 24 * 60 * 60 + 2 * 60 * 60 + 3 * 60 + 4) * 1000;
    const target = new Date(Date.now() + offset).toISOString();
    const result = callHook(() => useCountdown(target));
    expect(result.isExpired).toBe(false);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(3);
    // seconds may be 3 or 4 depending on ms timing
    expect(result.seconds).toBeGreaterThanOrEqual(2);
    expect(result.seconds).toBeLessThanOrEqual(4);
  });

  it("accepts Date object", () => {
    const result = callHook(() => useCountdown(new Date("2020-06-15")));
    expect(result.isExpired).toBe(true);
  });
});

describe("useCopyToClipboard", () => {
  it("returns [boolean, function] tuple", () => {
    const result = callHook(() => useCopyToClipboard());
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe("boolean");
    expect(typeof result[1]).toBe("function");
  });

  it("starts with copied = false", () => {
    const [copied] = callHook(() => useCopyToClipboard());
    expect(copied).toBe(false);
  });
});

describe("useDebounce", () => {
  it("returns the initial value synchronously", () => {
    const result = callHook(() => useDebounce("hello", 300));
    expect(result).toBe("hello");
  });

  it("defaults delay to 300", () => {
    // Just verifying it doesn't throw with default delay
    const result = callHook(() => useDebounce(42));
    expect(result).toBe(42);
  });
});
