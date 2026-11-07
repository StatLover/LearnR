import type { Metadata } from "next";
import { DailyChallenge } from "@/components/challenge/daily-challenge";

export const metadata: Metadata = {
  title: "Daily challenge",
  description: "A new R exercise every day, picked from the worlds you have reached. Solve it before midnight for a +50 XP bonus and keep your streak going.",
};

export default function ChallengePage() {
  return <DailyChallenge />;
}
