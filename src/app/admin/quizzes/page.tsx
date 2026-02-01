"use client";

import { QuizBuilder } from "../../../components/admin/QuizBuilder";

export default function AdminQuizzesPage() {
  return (
    <div className="p-6 lg:p-8 min-h-full bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Quiz Builder</h1>
          <p className="text-sm text-slate-400">Create and manage quiz questions</p>
        </div>
        <QuizBuilder />
      </div>
    </div>
  );
}
