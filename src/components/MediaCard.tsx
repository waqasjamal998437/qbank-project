"use client";

import { motion } from "framer-motion";
import { Play, Book, Sparkles, Clock, FileText } from "lucide-react";
import { LibraryItem } from "../app/library/page";
import { getVideoThumbnail } from "../lib/videoUtils";
import { useState, useEffect } from "react";

interface MediaCardProps {
  item: LibraryItem;
  onClick: () => void;
}

export function MediaCard({ item, onClick }: MediaCardProps) {
  const isVideo = item.type === "video";
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(item.thumbnail || null);
  const [thumbnailError, setThumbnailError] = useState(false);

  useEffect(() => {
    if (isVideo && item.url && !thumbnailUrl) {
      const thumbnail = getVideoThumbnail(item.url);
      if (thumbnail) {
        setThumbnailUrl(thumbnail);
      }
    }
  }, [isVideo, item.url, thumbnailUrl]);

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
    >
      {/* Thumbnail/Cover Area */}
      <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden">
        {isVideo ? (
          <>
            {thumbnailUrl && !thumbnailError ? (
              <img
                src={thumbnailUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={handleThumbnailError}
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20" />
            )}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center">
                <Play className="w-8 h-8 text-blue-600 ml-1" />
              </div>
            </motion.div>
            {item.progress > 0 && item.duration && (
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                {Math.round((parseInt(item.duration) * (100 - item.progress)) / 100)} min left
              </div>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20" />
            <div className="relative z-10 flex flex-col items-center justify-center p-6">
              <Book className="w-16 h-16 text-amber-500" />
              <div className="w-24 h-1 bg-amber-300 rounded-full mt-2" />
            </div>
            {item.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100">
                <motion.div
                  className="h-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </>
        )}

        {/* High-Yield Badge */}
        {item.isHighYield && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            High-Yield
          </div>
        )}

        {/* Progress Badge */}
        {item.progress > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
            {item.progress}%
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
          {isVideo ? (
            <Play className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Book className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          )}
        </div>

        <p className="text-xs text-slate-500">{item.author}</p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            {isVideo ? (
              <>
                <Clock className="w-3 h-3" />
                <span>{item.duration}</span>
              </>
            ) : (
              <>
                <FileText className="w-3 h-3" />
                <span>{item.pages}</span>
              </>
            )}
          </div>
          <span className="text-blue-600 font-medium">{item.progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${item.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
            initial={{ width: 0 }}
            animate={{ width: `${item.progress}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
