"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, X, Save, Upload } from "lucide-react";
import { subjectCategories } from "../../data/mockQuestions";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

const MOCK_FLASHCARDS: Flashcard[] = [
  { id: "1", front: "What is atrial fibrillation?", back: "An irregular heart rhythm characterized by rapid, disorganized electrical signals.", category: "Cardiology" },
  { id: "2", front: "Define status epilepticus", back: "Continuous seizure activity lasting >5 minutes or multiple seizures without recovery.", category: "Neurology" },
];

export function FlashcardsModule() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(MOCK_FLASHCARDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Flashcard, "id">>({
    front: "",
    back: "",
    category: "Cardiology",
  });

  const categories = Object.keys(subjectCategories);

  const filteredFlashcards = useMemo(() => {
    let filtered = flashcards;

    if (searchQuery) {
      filtered = filtered.filter(
        (f) =>
          f.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.back.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    return filtered;
  }, [flashcards, searchQuery, selectedCategory]);

  const handleAdd = () => {
    setFormData({ front: "", back: "", category: "Cardiology" });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (flashcard: Flashcard) => {
    setFormData({ front: flashcard.front, back: flashcard.back, category: flashcard.category });
    setEditingId(flashcard.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this flashcard?")) {
      setFlashcards((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.front.trim() || !formData.back.trim()) {
      alert("Please fill in both front and back text");
      return;
    }

    if (editingId) {
      setFlashcards((prev) => prev.map((f) => (f.id === editingId ? { ...formData, id: editingId } : f)));
    } else {
      setFlashcards((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    }

    setIsFormOpen(false);
    setFormData({ front: "", back: "", category: "Cardiology" });
    setEditingId(null);
  };

  const handleCSVImport = () => {
    // Simulate CSV import
    alert("CSV Import feature: Upload a CSV file with columns: front,back,category");
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Flashcards</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCSVImport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Creator</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-colors"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-colors"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                  {editingId ? "Edit Flashcard" : "Quick Creator"}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Front (Question/Term) *
                  </label>
                  <textarea
                    value={formData.front}
                    onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Back (Answer/Definition) *
                  </label>
                  <textarea
                    value={formData.back}
                    onChange={(e) => setFormData({ ...formData, back: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-colors"
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
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingId ? "Update" : "Create"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Front
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Back
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredFlashcards.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No flashcards found
                  </td>
                </tr>
              ) : (
                filteredFlashcards.map((flashcard) => (
                  <tr key={flashcard.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {flashcard.front}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {flashcard.back}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{flashcard.category}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(flashcard)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(flashcard.id)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
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
