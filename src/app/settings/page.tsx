import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Hexy } from "@/components/brand/mascot";
import { SettingsForm } from "@/components/settings/settings-form";

export const metadata: Metadata = { title: "Settings", description: "Theme, font size, editor, learning preferences, AI tutor, account and data settings." };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        icon={<Settings />}
        color="primary"
        eyebrow="Make it yours"
        title="Settings"
        description="Make R Academy work the way you like. Changes are saved automatically."
        art={<Hexy mood="cool" size={120} />}
      />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
        <SettingsForm />
      </div>
    </>
  );
}
