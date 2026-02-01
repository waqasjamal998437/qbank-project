"use client";

import { Layout } from "../../components/Layout";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="p-8 lg:p-10 bg-[var(--background)] min-h-full">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight mb-2">Settings</h1>
          <p className="text-[var(--foreground-secondary)] text-sm mb-8">Settings configuration will be available here.</p>
          <div className="bg-[var(--card-bg)] rounded-lg p-12 text-center border border-[var(--border)]">
            <p className="text-[var(--foreground-secondary)]">Settings configuration will be available here.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
