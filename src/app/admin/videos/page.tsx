"use client";

import { VideoVault } from "../../../components/admin/VideoVault";

export default function AdminVideosPage() {
  return (
    <div className="p-6 lg:p-8 min-h-full bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Video Vault</h1>
          <p className="text-sm text-slate-400">Manage educational videos and high-yield content</p>
        </div>
        <VideoVault />
      </div>
    </div>
  );
}
