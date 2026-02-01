"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, X, Save } from "lucide-react";
import { createQuiz, deleteQuiz } from "../../app/actions/quizzes";
import { toast } from "./Toast";
import { subjectCategories } from "../../data/mockQuestions";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  subcategory: string | null;
  createdAt: string;
}

export function QuizBuilder() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: 0,
    explanation: "",
    category: "Cardiology",
    subcategory: "",
  });

  const categories = Object.keys(subjectCategories);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/admin/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.question.trim() ||
      !formData.optionA.trim() ||
      !formData.optionB.trim() ||
      !formData.optionC.trim() ||
      !formData.optionD.trim() ||
      !formData.explanation.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.correctAnswer < 0 || formData.correctAnswer > 3) {
      toast.error("Please select a correct answer");
      return;
    }

    setIsSubmitting(true);
    const formDataObj = new FormData();
    formDataObj.append("question", formData.question);
    formDataObj.append("optionA", formData.optionA);
    formDataObj.append("optionB", formData.optionB);
    formDataObj.append("optionC", formData.optionC);
    formDataObj.append("optionD", formData.optionD);
    formDataObj.append("correctAnswer", formData.correctAnswer.toString());
    formDataObj.append("explanation", formData.explanation);
    formDataObj.append("category", formData.category);
    formDataObj.append("subcategory", formData.subcategory);

    const result = await createQuiz(formDataObj);

    if (result.success) {
      toast.success("Quiz question created successfully!");
      setIsFormOpen(false);
      setFormData({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: 0,
        explanation: "",
        category: "Cardiology",
        subcategory: "",
      });
      fetchQuizzes();
    } else {
      toast.error(result.error || "Failed to create quiz question");
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz question?")) return;

    const result = await deleteQuiz(id);

    if (result.success) {
      toast.success("Quiz question deleted successfully!");
      fetchQuizzes();
    } else {
      toast.error(result.error || "Failed to delete quiz question");
    }
  };

  const getSubcategories = () => {
    return subjectCategories[formData.category] || [];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Quiz Questions</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Question</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions..."
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-800 my-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100">Create Quiz Question</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Question *</label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Options *</label>
                  <div className="space-y-2">
                    {["A", "B", "C", "D"].map((letter, index) => (
                      <div key={letter} className="flex items-center gap-3">
                        <span className="w-8 text-sm font-medium text-slate-400">{letter}:</span>
                        <input
                          type="text"
                          value={
                            index === 0
                              ? formData.optionA
                              : index === 1
                              ? formData.optionB
                              : index === 2
                              ? formData.optionC
                              : formData.optionD
                          }
                          onChange={(e) => {
                            const key =
                              index === 0
                                ? "optionA"
                                : index === 1
                                ? "optionB"
                                : index === 2
                                ? "optionC"
                                : "optionD";
                            setFormData({ ...formData, [key]: e.target.value });
                          }}
                          required
                          placeholder={`Option ${letter}`}
                          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={index}
                          checked={formData.correctAnswer === index}
                          onChange={(e) =>
                            setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })
                          }
                          className="w-4 h-4 text-emerald-500 border-slate-700 focus:ring-2 focus:ring-emerald-500 bg-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Select the radio button for the correct answer</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Correct Rationale (Explanation) *
                  </label>
                  <textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none transition-colors"
                    placeholder="Explain why this answer is correct..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value, subcategory: "" })
                      }
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

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subcategory</label>
                    <select
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                    >
                      <option value="">None</option>
                      {getSubcategories().map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    <span>{isSubmitting ? "Creating..." : "Create Question"}</span>
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
                  Question
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Correct Answer
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800">
              {filteredQuizzes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                    No questions found
                  </td>
                </tr>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-300 max-w-md truncate">
                      {quiz.question}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {quiz.category}
                      {quiz.subcategory && (
                        <span className="text-slate-500"> / {quiz.subcategory}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium">
                        {String.fromCharCode(65 + quiz.correctAnswer)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
