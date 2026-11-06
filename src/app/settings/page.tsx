import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/settings/settings-form";

export const metadata: Metadata = { title: "Settings", description: "Theme, font size, editor, learning preferences, AI tutor, account and data settings." };

export default function SettingsPage() {
  return (
    <>
      <PageHeader icon={<Settings />} title="Settings" description="Make R Academy work the way you like. Changes are saved automatically." />
      <div className="mx-auto max-w-7xl px-4 py-8"><SettingsForm /></div>
    </>
  );
}
