/**
 * A tiny persisted store built on useSyncExternalStore. State lives in
 * localStorage (guest mode) and is synced across browser tabs.
 */
import { useSyncExternalStore } from "react";

export interface PersistedStore<T> {
  get(): T;
  set(updater: (state: T) => T): void;
  replace(state: T): void;
  subscribe(listener: () => void): () => void;
  serverSnapshot: T;
  key: string;
}

function readStorage(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked – keep working in memory */
  }
}

export function createPersistedStore<T>(key: string, initial: () => T, migrate: (raw: unknown) => T): PersistedStore<T> {
  const serverSnapshot = initial();
  let state: T | undefined;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  const load = (): T => {
    if (state === undefined) {
      const raw = readStorage(key);
      state = raw === undefined ? initial() : migrate(raw);
    }
    return state;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === key) {
        state = undefined;
        emit();
      }
    });
  }

  return {
    key,
    serverSnapshot,
    get() {
      if (typeof window === "undefined") return serverSnapshot;
      return load();
    },
    set(updater) {
      state = updater(load());
      writeStorage(key, state);
      emit();
    },
    replace(next) {
      state = next;
      writeStorage(key, state);
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: PersistedStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.serverSnapshot);
}
