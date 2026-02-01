"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface FlipCardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlipCard({ front, back, isFlipped, onFlip }: FlipCardProps) {
  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-[400px] cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ transform: "rotateY(0deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col items-center justify-center border border-slate-100">
            <div className="text-center space-y-4">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Question
              </span>
              <p className="text-lg text-slate-800 leading-relaxed font-medium">
                {front}
              </p>
            </div>
            {!isFlipped && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onFlip();
                }}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium">Show Answer</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Back of Card */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col items-center justify-center border-2 border-blue-100">
            <div className="text-center space-y-4">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Answer
              </span>
              <p className="text-lg text-slate-800 leading-relaxed">
                {back}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
