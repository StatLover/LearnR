"use client";

/**
 * Small lesson helpers shared by the lesson player and other pages: personal
 * notes for a lesson, and a bookmark toggle.
 */
import { useRef, useState } from "react";
import { Bookmark, BookmarkCheck, Download, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { progress, useProgress } from "@/lib/store/progress";
import { downloadText } from "@/lib/utils";

export function LessonNotes({ lessonId, title }: { lessonId: string; title: string }) {
  const state = useProgress();
  const saved = state.notes[lessonId]?.text ?? "";
  const [text, setText] = useState(saved);
  const [lastSaved, setLastSaved] = useState(saved);
  const [status, setStatus] = useState<"saved" | "typing">("saved");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // When the stored note changes (another tab, sync, first load), show it.
  if (saved !== lastSaved) {
    setLastSaved(saved);
    if (status === "saved") setText(saved);
  }
  const change = (v: string) => {
    setText(v);
    setStatus("typing");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      progress.setNote(lessonId, v);
      setStatus("saved");
    }, 600);
  };
  return (
    <section aria-labelledby="notes-title" className="rounded-3xl border-2 border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-sun-soft text-warning">
          <NotebookPen className="size-4" />
        </span>
        <h2 id="notes-title" className="font-display text-lg font-semibold">
          My notes
        </h2>
        <span className="ml-auto text-xs font-bold text-muted-foreground" aria-live="polite">
          {status === "typing" ? "Saving…" : saved ? "Saved" : ""}
        </span>
        {text && (
          <Button size="icon-sm" variant="ghost" aria-label="Download notes" onClick={() => downloadText(`${lessonId}-notes.md`, `# Notes: ${title}\n\n${text}\n`, "text/markdown")}>
            <Download />
          </Button>
        )}
      </div>
      <label htmlFor="lesson-notes" className="sr-only">
        Your notes for this lesson
      </label>
      <Textarea id="lesson-notes" rows={4} value={text} onChange={(e) => change(e.target.value)} placeholder="Write down what you learned, questions you have, or code you want to remember. Notes are saved automatically." />
    </section>
  );
}

export function BookmarkButton({ id, title, href, kind = "lesson" }: { id: string; title: string; href: string; kind?: "lesson" | "exercise" | "project" | "function" | "cheatsheet" }) {
  const state = useProgress();
  const on = state.bookmarks.some((b) => b.id === id);
  return (
    <Button variant="outline" size="sm" aria-pressed={on} onClick={() => progress.toggleBookmark({ id, kind, title, href })}>
      {on ? <BookmarkCheck className="text-primary" /> : <Bookmark />} {on ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
