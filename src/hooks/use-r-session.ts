"use client";
import { useSyncExternalStore } from "react";
import { rSession, type SessionState } from "@/lib/r/session";

const serverState: SessionState = { status: "idle", message: "R is not started yet", crossOriginIsolated: false, installed: [] };

export function useRSession(): SessionState {
  return useSyncExternalStore(rSession.subscribe, rSession.getState, () => serverState);
}
