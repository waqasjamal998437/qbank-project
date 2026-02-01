"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown
} from "lucide-react";

// Dummy questions data
const dummyQuestions = [
  { id: 1, subject: "Cardiology", system: "Cardiovascular", difficulty: "Medium", topic: "Heart Failure", options: 5, created: "2024-01-15" },
  { id: 2, subject: "Neurology", system: "Nervous", difficulty: "Hard", topic: "Stroke Management", options: 5, created: "2024-01-14" },
  { id: 3, subject: "Pharmacology", system: "General", difficulty: "Easy", topic: "Beta Blockers", options: 5, created: "2024-01-13" },
  { id: 4, subject: "Pathology", system: "General", difficulty: "Medium", topic: "Cancer Markers", options: 5, created: "2024-01-12" },
  { id: 5, subject: "Anatomy", system: "Musculoskeletal", difficulty: "Easy", topic: "Shoulder Joint", options: 5, created: "2024-01-11" },
  { id: 6, subject: "Microbiology", system: "General", difficulty: "Medium", topic: "Bacterial Infections", options: 5, created: "2024-01-10" },
  { id: 7, subject: "Biochemistry", system: "Metabolic", difficulty: "Hard", topic: "Enzyme Deficiencies", options: 5, created: "2024-01-09" },
];

const subjects = ["Cardiology", "Neurology", "Pharmacology", "Pathology", "Anatomy", "Microbiology", "Biochemistry"];
const systems = ["Cardiovascular", "Nervous", "General", "Musculoskeletal", "Metabolic"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function QuestionManagement() {
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  // Form state for adding/editing questions
  const [formData, setFormData] = useState({
    subject: "",
    system: "",
    difficulty: "",
    topic: "",
    vignette: "",
    options: ["", "", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    imageUrl: "",
  });

  const filteredQuestions = dummyQuestions.filter((q) => {
    const matchesSearch = q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || q.subject === selectedSubject;
    const matchesSystem = !selectedSystem || q.system === selectedSystem;
    const matchesDifficulty = !selectedDifficulty || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesSystem && matchesDifficulty;
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
    }
  };

  const renderListView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Question Bank</h2>
          <p className="text-sm text-gray-500">{filteredQuestions.length} questions found</p>
        </div>
        <button
          onClick={() => setView("add")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedSystem}
                onChange={(e) => setSelectedSystem(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="">All Systems</option>
                {systems.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              >
                <option value="">All Difficulties</option>
                {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Topic</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">System</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">#{question.id}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      {question.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{question.topic}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{question.system}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      question.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                      question.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{question.created}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setView("edit")}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFormView = (mode: "add" | "edit") => (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setView("list")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
        >
          ← Back to Questions
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === "add" ? "Add New Question" : "Edit Question"}
        </h2>
        <p className="text-sm text-gray-500">
          Create or modify a question in the QBank
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System</label>
                <select
                  value={formData.system}
                  onChange={(e) => setFormData({ ...formData, system: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">Select System</option>
                  {systems.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="">Select Difficulty</option>
                  {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Heart Failure"
                  className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Clinical Vignette */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Vignette</h3>
            <textarea
              value={formData.vignette}
              onChange={(e) => setFormData({ ...formData, vignette: e.target.value })}
              placeholder="A 45-year-old man presents with..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Options</h3>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, correctAnswer: index })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      formData.correctAnswer === index
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {formData.correctAnswer === index ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                    )}
                  </button>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explanation</h3>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="The correct answer is... This is because..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>
        </div>

        {/* Sidebar - Preview & Image Upload */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Upload</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
              {formData.imageUrl ? (
                <div className="relative">
                  <img
                    src={formData.imageUrl}
                    alt="Uploaded"
                    className="w-full rounded-lg mb-3"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-2">Upload medical diagram or pathology slide</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    Choose File
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Real-time Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="text-gray-500 mb-2">This is how the question will appear to students:</p>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{formData.topic || "Question Topic"}</p>
                <p className="text-gray-600 line-clamp-3">{formData.vignette || "Clinical vignette text..."}</p>
                {formData.options.map((option, index) => (
                  <p key={index} className={`${formData.correctAnswer === index ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                    {String.fromCharCode(65 + index)}. {option || "Option text..."}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <button
              onClick={() => setView("list")}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              {mode === "add" ? "Save Question" : "Update Question"}
            </button>
            <button
              onClick={() => setView("list")}
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 min-h-full">
      {view === "list" && renderListView()}
      {view === "add" && renderFormView("add")}
      {view === "edit" && renderFormView("edit")}
    </div>
  );
}
