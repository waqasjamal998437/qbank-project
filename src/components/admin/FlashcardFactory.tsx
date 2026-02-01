"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, X, Save } from "lucide-react";
import { createFlashcard, deleteFlashcard } from "../../app/actions/flashcards";
import { toast } from "./Toast";
import { subjectCategories } from "../../data/mockQuestions";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  createdAt: string;
}

export function FlashcardFactory() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    front: "",
    back: "",
    category: "Cardiology",
  });

  const categories = Object.keys(subjectCategories);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch("/api/admin/flashcards");
      if (response.ok) {
        const data = await response.json();
        setFlashcards(data);
      }
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
    }
  };

  const filteredFlashcards = flashcards.filter((f) => {
    const matchesSearch =
      f.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.back.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.front.trim() || !formData.back.trim()) {
      toast.error("Please fill in both front and back text");
      return;
    }

    setIsSubmitting(true);
    const formDataObj = new FormData();
    formDataObj.append("front", formData.front);
    formDataObj.append("back", formData.back);
    formDataObj.append("category", formData.category);

    const result = await createFlashcard(formDataObj);

    if (result.success) {
      toast.success("Flashcard created successfully!");
      setIsFormOpen(false);
      setFormData({ front: "", back: "", category: "Cardiology" });
      fetchFlashcards();
    } else {
      toast.error(result.error || "Failed to create flashcard");
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flashcard?")) return;

    const result = await deleteFlashcard(id);

    if (result.success) {
      toast.success("Flashcard deleted successfully!");
      fetchFlashcards();
    } else {
      toast.error(result.error || "Failed to delete flashcard");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Flashcards</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Flashcard</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Create Flashcard</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Front (Question/Term) *
                  </label>
                  <textarea
                    value={formData.front}
                    onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Back (Answer/Definition) *
                  </label>
                  <textarea
                    value={formData.back}
                    onChange={(e) => setFormData({ ...formData, back: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-white rounded-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? "Creating..." : "Create"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Front
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Back
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {filteredFlashcards.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    No flashcards found
                  </td>
                </tr>
              ) : (
                filteredFlashcards.map((flashcard) => (
                  <tr key={flashcard.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-300 max-w-xs truncate">
                      {flashcard.front}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400 max-w-xs truncate">
                      {flashcard.back}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">{flashcard.category}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(flashcard.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
