"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit, Trash2, X, Save, ChevronRight, ChevronLeft } from "lucide-react";
import { subjectCategories } from "../../data/mockQuestions";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  subcategory?: string;
}

const MOCK_QUIZZES: Quiz[] = [
  {
    id: "1",
    question: "What is the primary function of the mitochondria?",
    options: ["Protein synthesis", "Energy production (ATP)", "DNA replication", "Waste removal"],
    correctAnswer: 1,
    explanation: "Mitochondria produce ATP through cellular respiration.",
    category: "Cardiology",
    subcategory: "Heart Failure",
  },
];

type FormStep = 1 | 2 | 3;

export function QuizzesModule() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formStep, setFormStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Omit<Quiz, "id">>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    category: "Cardiology",
    subcategory: "",
  });

  const categories = Object.keys(subjectCategories);

  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;

    if (searchQuery) {
      filtered = filtered.filter((q) => q.question.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    return filtered;
  }, [quizzes, searchQuery, selectedCategory]);

  const handleAdd = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "Cardiology",
      subcategory: "",
    });
    setEditingId(null);
    setFormStep(1);
    setIsFormOpen(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setFormData({
      question: quiz.question,
      options: [...quiz.options],
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation,
      category: quiz.category,
      subcategory: quiz.subcategory || "",
    });
    setEditingId(quiz.id);
    setFormStep(1);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz question?")) {
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleNextStep = () => {
    if (formStep === 1) {
      if (!formData.question.trim()) {
        alert("Please enter a question");
        return;
      }
      if (formData.options.some((opt) => !opt.trim())) {
        alert("Please fill in all 4 options");
        return;
      }
      setFormStep(2);
    } else if (formStep === 2) {
      if (formData.correctAnswer < 0 || formData.correctAnswer > 3) {
        alert("Please select a correct answer");
        return;
      }
      setFormStep(3);
    }
  };

  const handlePrevStep = () => {
    if (formStep > 1) {
      setFormStep((prev) => (prev - 1) as FormStep);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.explanation.trim()) {
      alert("Please provide an explanation");
      return;
    }

    if (editingId) {
      setQuizzes((prev) => prev.map((q) => (q.id === editingId ? { ...formData, id: editingId } : q)));
    } else {
      setQuizzes((prev) => [...prev, { ...formData, id: Date.now().toString() }]);
    }

    setIsFormOpen(false);
    setFormData({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      category: "Cardiology",
      subcategory: "",
    });
    setEditingId(null);
    setFormStep(1);
  };

  const getSubcategories = () => {
    return subjectCategories[formData.category] || [];
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Quizzes</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                    {editingId ? "Edit Question" : "Add New Question"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Step {formStep} of 3
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={formStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="space-y-4">
                {/* Step 1: Question & Options */}
                {formStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Question *
                      </label>
                      <textarea
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Options (A-D) *
                      </label>
                      {formData.options.map((option, index) => (
                        <div key={index} className="mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...formData.options];
                              newOptions[index] = e.target.value;
                              setFormData({ ...formData, options: newOptions });
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            required
                            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Correct Answer & Category */}
                {formStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Correct Answer *
                      </label>
                      <div className="space-y-2">
                        {formData.options.map((option, index) => (
                          <label
                            key={index}
                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              formData.correctAnswer === index
                                ? "border-gray-900 dark:border-white bg-gray-100 dark:bg-gray-800"
                                : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name="correctAnswer"
                              value={index}
                              checked={formData.correctAnswer === index}
                              onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
                              className="w-4 h-4 text-gray-900 dark:text-white"
                            />
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              {String.fromCharCode(65 + index)}:
                            </span>
                            <span className="text-gray-900 dark:text-white">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: "" })}
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subcategory
                        </label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white transition-colors"
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
                  </motion.div>
                )}

                {/* Step 3: Explanation */}
                {formStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Correct Rationale (Explanation) *
                      </label>
                      <textarea
                        value={formData.explanation}
                        onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                        required
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white resize-none transition-colors"
                        placeholder="Explain why this answer is correct..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={formStep === 1 ? () => setIsFormOpen(false) : handlePrevStep}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {formStep > 1 ? (
                      <>
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </>
                    ) : (
                      <span>Cancel</span>
                    )}
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all"
                  >
                    {formStep === 3 ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingId ? "Update" : "Add Question"}</span>
                      </>
                    ) : (
                      <>
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
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
                  Question
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Correct Answer
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredQuizzes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No questions found
                  </td>
                </tr>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-md truncate">
                      {quiz.question}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {quiz.category}
                      {quiz.subcategory && (
                        <span className="text-gray-400 dark:text-gray-600"> / {quiz.subcategory}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                        {String.fromCharCode(65 + quiz.correctAnswer)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(quiz)}
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(quiz.id)}
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
