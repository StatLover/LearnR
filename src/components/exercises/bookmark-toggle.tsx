"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { progress, useProgress, type Bookmark as BookmarkItem } from "@/lib/store/progress";

/** Save / unsave a page in the learner's bookmarks. */
export function BookmarkToggle({ id, title, href, kind }: { id: string; title: string; href: string; kind: BookmarkItem["kind"] }) {
  const state = useProgress();
  const on = state.bookmarks.some((b) => b.id === id);
  return (
    <Button variant="outline" size="sm" aria-pressed={on} onClick={() => progress.toggleBookmark({ id, kind, title, href })}>
      {on ? <BookmarkCheck className="text-primary" /> : <Bookmark />} {on ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
