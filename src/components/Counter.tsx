"use client";

import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { Plus, Minus, Zap, Loader2 } from "lucide-react";

export function Counter() {
  const { count, setCount } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  // 1. When the page loads, fetch the count from the database
  async function loadCount() {
    try {
      const res = await fetch("/api/counter");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      // Check if the response is actually JSON
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        setCount(data.count);
      } else {
        // If it's HTML, this will print the HTML to your console
        const text = await res.text();
        console.error("Server sent HTML instead of JSON. The HTML starts with:", text.substring(0, 100));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Load count on component mount
  useEffect(() => {
    loadCount();
  }, []);

  // 2. Function to save the new number to the database
  const updateCount = async (newValue: number) => {
    setCount(newValue); // Update UI immediately (optimistic)
    try {
      const res = await fetch("/api/counter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newValue }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCount(data.count); // Update with server response
    } catch (error) {
      console.error("Failed to save to database", error);
      // Revert on error
      loadCount();
    }
  };

  if (isLoading) return <Loader2 className="animate-spin text-indigo-500" />;

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-2 text-indigo-400 mb-2">
        <Zap size={20} fill="currentColor" />
        <span className="font-bold uppercase tracking-widest text-xs">Database Sync Active</span>
      </div>
      
      <span className="text-7xl font-black text-white tabular-nums">{count}</span>
      
      <div className="flex gap-4">
        <button 
          onClick={() => updateCount(count - 1)}
          className="p-3 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 rounded-full transition-all border border-slate-700"
        >
          <Minus size={24} />
        </button>
        <button 
          onClick={() => updateCount(count + 1)}
          className="p-3 bg-slate-800 hover:bg-green-500/20 hover:text-green-400 rounded-full transition-all border border-slate-700"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}