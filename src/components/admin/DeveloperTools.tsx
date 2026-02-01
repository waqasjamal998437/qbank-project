"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Video, Users, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";

export function DeveloperTools() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncComplete(false);
    
    // Simulate sync process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSyncing(false);
    setSyncComplete(true);
    
    setTimeout(() => setSyncComplete(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* System Health Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Total Questions
          </p>
          <Database className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">1,247</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Video Hours
          </p>
          <Video className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">142.5</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Active Users
          </p>
          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">892</p>
      </motion.div>

      {/* Sync Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-center justify-center transition-colors"
      >
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`
            w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
            ${
              syncComplete
                ? "bg-green-600 dark:bg-green-700 text-white"
                : isSyncing
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700"
            }
          `}
        >
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : syncComplete ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Synced</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Sync to Production</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
