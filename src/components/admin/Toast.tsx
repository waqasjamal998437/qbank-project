"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

function addToast(message: string, type: ToastType = "info") {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const toast = { id, message, type };
  toasts = [...toasts, toast];
  notifyListeners();

  setTimeout(() => {
    removeToast(id);
  }, 3000);
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
}

export const toast = {
  success: (message: string) => addToast(message, "success"),
  error: (message: string) => addToast(message, "error"),
  info: (message: string) => addToast(message, "info"),
};

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts);
    };
    toastListeners.push(listener);
    setCurrentToasts([...toasts]);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      <AnimatePresence>
        {currentToasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md
              ${
                toast.type === "success"
                  ? "bg-emerald-500 text-white"
                  : toast.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-slate-800 text-slate-100 border border-slate-700"
              }
            `}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : toast.type === "error" ? (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            ) : null}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
