"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Cloud, Download, LogOut, Monitor, Moon, RefreshCw, RotateCcw, Sun, Upload, UserRound, Cpu, Sparkles, Keyboard, Palette, GraduationCap, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { ShortcutTable } from "@/components/code/code-runner";
import { MODES } from "@/components/tutor/tutor-chat";
import { updateSettings, useSettings, defaultSettings, type Settings } from "@/lib/store/settings";
import { progress, progressStore, useProgress } from "@/lib/store/progress";
import { account, syncConfigured, useSyncState } from "@/lib/sync/sync-manager";
import { rSession } from "@/lib/r/session";
import { useRSession } from "@/hooks/use-r-session";
import { aiStatus } from "@/lib/ai/tutor-store";
import { cn, downloadText } from "@/lib/utils";

function Section({ icon, title, description, children }: { icon: ReactNode; title: string; description?: string; children: ReactNode }) {
  return (
    <Card className="p-5">
      <h2 className="flex items-center gap-2 text-lg font-semibold [&_svg]:size-5 [&_svg]:text-primary">
        {icon}
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  );
}

function Row({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <Label htmlFor={htmlFor}>{label}</Label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string; icon?: ReactNode }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-surface-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium cursor-pointer [&_svg]:size-4", value === o.value ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function AccountSection() {
  const sync = useSyncState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  if (!syncConfigured)
    return (
      <Section icon={<Cloud />} title="Account & sync" description="Optional: sync your progress across devices.">
        <p className="text-sm">
          You are learning as a <strong>guest</strong>. All progress, notes and saved code are stored in this browser. Use <em>Export progress</em> below to move it to another device.
        </p>
        <p className="rounded-lg bg-surface p-3 text-xs text-muted-foreground">
          Account sync is not configured on this server. To enable it, the site owner creates a Supabase project, runs <code className="font-mono">supabase/schema.sql</code> and sets <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
      </Section>
    );
  const submit = async (mode: "in" | "up") => {
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "up") {
        const r = await account.signUp(email, password);
        setMsg(r === "check-email" ? "Account created. Check your email to confirm it, then sign in." : "Account created and signed in. Your progress is syncing.");
      } else {
        await account.signIn(email, password);
        setMsg("Signed in. Your progress is syncing.");
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Section icon={<Cloud />} title="Account & sync" description="Create a free account to keep your progress in sync across devices. Guest progress in this browser is merged into your account.">
      {sync.email ? (
        <>
          <p className="text-sm">
            Signed in as <strong>{sync.email}</strong>.{" "}
            <span className="text-muted-foreground">
              {sync.status === "syncing" ? "Syncing…" : sync.status === "synced" ? `Synced ${sync.lastSync ? new Date(sync.lastSync).toLocaleTimeString() : ""}` : sync.status === "error" ? `Sync problem: ${sync.message}` : ""}
            </span>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void account.syncNow()}><RefreshCw /> Sync now</Button>
            <Button variant="outline" onClick={() => void account.signOut()}><LogOut /> Sign out</Button>
          </div>
        </>
      ) : (
        <form className="grid gap-3 sm:max-w-sm" onSubmit={(e) => { e.preventDefault(); void submit("in"); }}>
          <div className="space-y-1"><Label htmlFor="acc-email">Email</Label><Input id="acc-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-1"><Label htmlFor="acc-pw">Password</Label><Input id="acc-pw" type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>Sign in</Button>
            <Button type="button" variant="outline" disabled={busy || password.length < 8} onClick={() => void submit("up")}>Create account</Button>
          </div>
          {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
        </form>
      )}
    </Section>
  );
}

export function SettingsForm() {
  const s = useSettings();
  const p = useProgress();
  const r = useRSession();
  const [ai, setAi] = useState<{ configured: boolean; model: string | null } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    aiStatus().then(setAi);
  }, []);
  const set = (patch: Partial<Settings>) => updateSettings(patch);

  const exportData = () => {
    downloadText(`r-academy-progress-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ app: "r-academy", exportedAt: new Date().toISOString(), progress: progressStore.get(), settings: s }, null, 2), "application/json");
  };
  const importData = async (f?: File) => {
    if (!f) return;
    try {
      if (f.size > 5_000_000) throw new Error("File too large");
      const j = JSON.parse(await f.text());
      if (j?.app !== "r-academy" || typeof j.progress !== "object") throw new Error("This is not an R Academy progress file.");
      progress.importState(j.progress);
      if (j.settings) updateSettings(j.settings);
      toast("Progress imported");
    } catch (e) {
      toast("Import failed", { description: e instanceof Error ? e.message : String(e), tone: "warning" });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Section icon={<Palette />} title="Appearance">
        <Row label="Theme" hint="System follows your device setting.">
          <Segmented label="Theme" value={s.theme} onChange={(v) => set({ theme: v })} options={[{ value: "light", label: "Light", icon: <Sun /> }, { value: "dark", label: "Dark", icon: <Moon /> }, { value: "system", label: "System", icon: <Monitor /> }]} />
        </Row>
        <Row label="Text size">
          <Segmented label="Text size" value={s.fontSize} onChange={(v) => set({ fontSize: v })} options={[{ value: "sm", label: "S" }, { value: "md", label: "M" }, { value: "lg", label: "L" }, { value: "xl", label: "XL" }]} />
        </Row>
        <Row label="Plot colours" hint="Dark plots in dark mode, or always the classic light style.">
          <Segmented label="Plot colours" value={s.plotTheme} onChange={(v) => set({ plotTheme: v })} options={[{ value: "auto", label: "Match theme" }, { value: "light", label: "Always light" }]} />
        </Row>
        <Row label="Reduce motion" hint="Turn off animations." htmlFor="reduce-motion">
          <Switch id="reduce-motion" checked={s.reduceMotion === "on"} onCheckedChange={(v) => set({ reduceMotion: v ? "on" : "system" })} />
        </Row>
      </Section>

      <Section icon={<Keyboard />} title="Code editor">
        <Row label="Editor font size" htmlFor="ed-size">
          <Select id="ed-size" value={s.editorFontSize} onChange={(e) => set({ editorFontSize: Number(e.target.value) })}>
            {[12, 13, 14, 15, 16, 18, 20].map((n) => <option key={n} value={n}>{n}px</option>)}
          </Select>
        </Row>
        <Row label="Line numbers" htmlFor="ln"><Switch id="ln" checked={s.lineNumbers} onCheckedChange={(v) => set({ lineNumbers: v })} /></Row>
        <Row label="Close brackets and quotes automatically" htmlFor="ac"><Switch id="ac" checked={s.autoCloseBrackets} onCheckedChange={(v) => set({ autoCloseBrackets: v })} /></Row>
        <Row label="Time limit for running code" hint="Code that runs longer is stopped (protects against endless loops)." htmlFor="timeout">
          <Select id="timeout" value={s.runTimeout} onChange={(e) => set({ runTimeout: Number(e.target.value) })}>
            {[10, 20, 30, 60, 120].map((n) => <option key={n} value={n}>{n} seconds</option>)}
          </Select>
        </Row>
        <details className="text-sm"><summary className="cursor-pointer font-medium">Keyboard shortcuts</summary><div className="mt-2"><ShortcutTable /></div></details>
      </Section>

      <Section icon={<GraduationCap />} title="Learning preferences">
        <Row label="Learning mode" hint="Guided: lessons unlock in order. Free: everything is open.">
          <Segmented label="Learning mode" value={s.learningMode} onChange={(v) => set({ learningMode: v })} options={[{ value: "guided", label: "Guided" }, { value: "free", label: "Free" }]} />
        </Row>
        <Row label="Daily goal" htmlFor="goal">
          <Select id="goal" value={s.dailyGoalXp} onChange={(e) => set({ dailyGoalXp: Number(e.target.value) })}>
            {[20, 50, 100, 150].map((n) => <option key={n} value={n}>{n} XP</option>)}
          </Select>
        </Row>
        <Row label="Your name" htmlFor="pname"><Input id="pname" className="w-52" value={p.profile.name ?? ""} onChange={(e) => progress.setProfile({ name: e.target.value })} placeholder="optional" /></Row>
        <Row label="Programming experience" htmlFor="pexp">
          <Select id="pexp" value={p.profile.programming ?? ""} onChange={(e) => progress.setProfile({ programming: (e.target.value || undefined) as never })}>
            <option value="">Not set</option><option value="none">Never programmed</option><option value="some">A little</option><option value="experienced">Experienced</option>
          </Select>
        </Row>
        <Row label="Statistics experience" htmlFor="sexp">
          <Select id="sexp" value={p.profile.statistics ?? ""} onChange={(e) => progress.setProfile({ statistics: (e.target.value || undefined) as never })}>
            <option value="">Not set</option><option value="none">New to statistics</option><option value="some">Know the basics</option><option value="confident">Confident</option>
          </Select>
        </Row>
      </Section>

      <Section icon={<Sparkles />} title="AI tutor">
        <Row label="Default tutor mode" htmlFor="tmode">
          <Select id="tmode" value={s.tutorMode} onChange={(e) => set({ tutorMode: e.target.value as Settings["tutorMode"] })}>
            {MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>
        </Row>
        <p className="text-sm text-muted-foreground">
          Status: {ai === null ? "checking…" : ai.configured ? <span className="text-success">available{ai.model ? ` (model ${ai.model})` : ""}</span> : <span className="text-warning">not configured on this server (ANTHROPIC_API_KEY is not set)</span>}
        </p>
        <p className="text-xs text-muted-foreground">Your questions and code are sent to the AI service through this site&apos;s server when you use the tutor or “Explain My Error”. Conversations are stored only in this browser.</p>
      </Section>

      <Section icon={<Cpu />} title="R in your browser">
        <p className="text-sm">
          Status: <strong>{r.message}</strong>
          {r.status !== "idle" && <span className="text-muted-foreground"> · {r.crossOriginIsolated ? "fast mode (can be interrupted)" : "compatibility mode"}</span>}
        </p>
        {r.installed.length > 0 && <p className="text-sm text-muted-foreground">Packages installed this session: {r.installed.join(", ")}</p>}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void rSession.ensure().catch(() => {})} disabled={r.status === "ready" || r.status === "busy" || r.status === "loading"}>Start R now</Button>
          <Button variant="outline" onClick={() => void rSession.restart().then(() => toast("R restarted", { description: "All variables were cleared." }))}><RotateCcw /> Restart R</Button>
        </div>
      </Section>

      <AccountSection />

      <Section icon={<Database />} title="Your data" description="Progress, notes, bookmarks and saved code are stored in this browser.">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportData}><Download /> Export progress</Button>
          <Button variant="outline" onClick={() => file.current?.click()}><Upload /> Import progress</Button>
          <input ref={file} type="file" accept="application/json,.json" className="sr-only" aria-label="Import progress file" onChange={(e) => void importData(e.target.files?.[0]).finally(() => { if (file.current) file.current.value = ""; })} />
          <Button variant="outline" onClick={() => { updateSettings(defaultSettings); toast("Settings restored to defaults"); }}>Reset settings</Button>
          <Button variant="danger" onClick={() => setConfirmReset(true)}><UserRound /> Reset all progress</Button>
        </div>
      </Section>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent title="Reset all progress?" description="This deletes completed lessons, scores, notes, bookmarks and saved code from this browser. It cannot be undone – export your progress first if you might want it back.">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { progress.reset(); setConfirmReset(false); toast("Progress reset"); }}>Reset everything</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
