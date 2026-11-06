"use client";
/**
 * Optional account sync with Supabase. Active only when
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 * (see supabase/schema.sql). Guests keep everything in localStorage.
 */
import { useEffect, useSyncExternalStore } from "react";
import { createClient, type SupabaseClient, type Session } from "@supabase/supabase-js";
import { progressStore, type ProgressState, emptyProgress } from "../store/progress";
import { settingsStore, defaultSettings, type Settings } from "../store/settings";
import { mergeProgress } from "./merge";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const syncConfigured = Boolean(URL && KEY);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!syncConfigured) return null;
  if (!client) client = createClient(URL!, KEY!, { auth: { persistSession: true, autoRefreshToken: true } });
  return client;
}

export interface SyncState {
  email: string | null;
  status: "off" | "idle" | "syncing" | "synced" | "error";
  message?: string;
  lastSync?: number;
}
let state: SyncState = { email: null, status: syncConfigured ? "idle" : "off" };
const listeners = new Set<() => void>();
const set = (p: Partial<SyncState>) => {
  state = { ...state, ...p };
  listeners.forEach((l) => l());
};
const SERVER: SyncState = { email: null, status: "off" };
export function useSyncState() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => state,
    () => SERVER,
  );
}

let session: Session | null = null;
let pushTimer: ReturnType<typeof setTimeout> | undefined;
let applyingRemote = false;

async function pull() {
  const sb = supabase();
  if (!sb || !session) return;
  set({ status: "syncing" });
  const { data, error } = await sb.from("learner_progress").select("progress, settings, updated_at").eq("user_id", session.user.id).maybeSingle();
  if (error) return set({ status: "error", message: error.message });
  const local = progressStore.get();
  const remote = data?.progress ? ({ ...emptyProgress(), ...(data.progress as ProgressState) } as ProgressState) : null;
  applyingRemote = true;
  if (remote) progressStore.replace(mergeProgress(local, remote));
  if (data?.settings && Object.keys(data.settings).length) settingsStore.replace({ ...defaultSettings, ...(data.settings as Settings), ...settingsStore.get() });
  applyingRemote = false;
  await push();
}

async function push() {
  const sb = supabase();
  if (!sb || !session) return;
  set({ status: "syncing" });
  const { error } = await sb.from("learner_progress").upsert({
    user_id: session.user.id,
    progress: progressStore.get(),
    settings: settingsStore.get(),
    updated_at: new Date().toISOString(),
  });
  if (error) set({ status: "error", message: error.message });
  else set({ status: "synced", lastSync: Date.now(), message: undefined });
}

function schedulePush() {
  if (!session || applyingRemote) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void push(), 2500);
}

export const account = {
  async signUp(email: string, password: string) {
    const sb = supabase();
    if (!sb) throw new Error("Accounts are not configured on this server.");
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw error;
    return data.session ? "signed-in" : "check-email";
  },
  async signIn(email: string, password: string) {
    const sb = supabase();
    if (!sb) throw new Error("Accounts are not configured on this server.");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },
  async signOut() {
    await supabase()?.auth.signOut();
  },
  syncNow: () => pull(),
};

export function SyncManager() {
  useEffect(() => {
    const sb = supabase();
    if (!sb) return;
    const unsubProgress = progressStore.subscribe(schedulePush);
    const unsubSettings = settingsStore.subscribe(schedulePush);
    sb.auth.getSession().then(({ data }) => {
      session = data.session;
      set({ email: session?.user.email ?? null, status: session ? "idle" : "idle" });
      if (session) void pull();
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      const was = session?.user.id;
      session = s;
      set({ email: s?.user.email ?? null });
      if (s && s.user.id !== was) void pull();
    });
    return () => {
      unsubProgress();
      unsubSettings();
      sub.subscription.unsubscribe();
    };
  }, []);
  return null;
}
