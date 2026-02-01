"use client";

import { CommandCenterLayout } from "@/components/admin/CommandCenterLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CommandCenterLayout>{children}</CommandCenterLayout>;
}
