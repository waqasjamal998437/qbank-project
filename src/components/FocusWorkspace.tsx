"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LibraryItem } from "../app/library/page";
import { Minimize2, X, CloudCheck, Play, Book, Plus } from "lucide-react";
import { getVideoEmbedUrl } from "../lib/videoUtils";

interface Annotation {
  id: string;
  timestamp?: string;
  page?: number;
  note: string;
  createdAt: Date;
}

interface FocusWorkspaceProps {
  item: LibraryItem;
  onMinimize: () => void;
  onClose: () => void;
}

export function FocusWorkspace({ item, onMinimize, onClose }: FocusWorkspaceProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [newNote, setNewNote] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState("00:00");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState<string | null>(null);
  const isVideo = item.type === "video";

  useEffect(() => {
    if (isVideo && item.url) {
      const embedUrl = getVideoEmbedUrl(item.url);
      setVideoEmbedUrl(embedUrl);
    }
  }, [isVideo, item.url]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(Math.random() > 0.7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isVideo) {
      const interval = setInterval(() => {
        const minutes = Math.floor(Math.random() * 45);
        const seconds = Math.floor(Math.random() * 60);
        setCurrentTimestamp(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      const totalPages = item.pages ? parseInt(item.pages) : 100;
      setCurrentPage(Math.floor((item.progress / 100) * totalPages) || 1);
    }
  }, [isVideo, item]);

  const handleAddAnnotation = () => {
    if (!newNote.trim()) return;

    const annotation: Annotation = {
      id: Date.now().toString(),
      timestamp: isVideo ? currentTimestamp : undefined,
      page: !isVideo ? currentPage : undefined,
      note: newNote,
      createdAt: new Date(),
    };

    setAnnotations((prev) => [annotation, ...prev]);
    setNewNote("");
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-50"
    >
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={onMinimize}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Minimize"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-slate-800 truncate">
                {item.title}
              </h1>
              <p className="text-sm text-slate-500 truncate">
                {item.author}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <CloudCheck
                className={`w-4 h-4 ${
                  isSyncing
                    ? "text-blue-500 animate-pulse"
                    : "text-slate-500"
                }`}
              />
              <span className="text-xs text-slate-600">
                {isSyncing ? "Syncing..." : "Synced"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-64px)]">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-auto">
            {isVideo ? (
              <div className="w-full max-w-6xl">
                {videoEmbedUrl ? (
                  <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
                    <iframe
                      src={videoEmbedUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title={item.title}
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                      {currentTimestamp}
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-4xl aspect-video bg-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                    <div className="text-center space-y-4 relative z-10">
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto"
                      >
                        <Play className="w-10 h-10 text-white ml-1" />
                      </motion.div>
                      <p className="text-white/80 text-sm">Unable to load video player</p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Open in New Tab
                      </a>
                    </div>
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {item.author} • {item.category}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 min-h-[600px] border border-slate-100">
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center">
                    <Book className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Page {currentPage} of {item.pages || "N/A"}
                    </p>
                    <div className="mt-4 w-64 h-96 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                      <p className="text-xs text-slate-400 text-center px-4">
                        PDF Viewer Placeholder
                        <br />
                        <span className="text-[10px]">Content would render here</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <motion.aside
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full md:w-96 border-l border-slate-200 bg-white flex flex-col shadow-xl"
        >
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">
              Smart Annotations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isVideo
                ? `Current time: ${currentTimestamp}`
                : `Current page: ${currentPage}`}
            </p>
          </div>

          <div className="p-4 border-b border-slate-100">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Add a note at ${isVideo ? currentTimestamp : `page ${currentPage}`}...`}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              rows={3}
            />
            <button
              onClick={handleAddAnnotation}
              disabled={!newNote.trim()}
              className="mt-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {annotations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-500">
                    No annotations yet. Add your first note above.
                  </p>
                </div>
              ) : (
                annotations.map((annotation) => (
                  <motion.div
                    key={annotation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-50 rounded-xl p-3 border border-slate-100"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {isVideo
                            ? `⏱ ${annotation.timestamp}`
                            : `📄 Page ${annotation.page}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnotation(annotation.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Delete annotation"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {annotation.note}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {annotation.createdAt.toLocaleTimeString()}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            Annotations
          </h3>
          <div className="space-y-2">
            {annotations.slice(0, 3).map((annotation) => (
              <div
                key={annotation.id}
                className="bg-slate-50 rounded-lg p-2 text-xs text-slate-700"
              >
                <span className="text-blue-600 font-medium">
                  {isVideo ? annotation.timestamp : `Page ${annotation.page}`}
                </span>
                : {annotation.note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
