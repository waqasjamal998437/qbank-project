"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "../../components/Layout";
import { FocusWorkspace } from "../../components/FocusWorkspace";
import {
  Play,
  Book,
  Sparkles,
  RefreshCw,
  Search,
  Library as LibraryIcon,
  Clock,
  FileText,
  ChevronRight,
  Grid3X3,
  List,
  Video,
} from "lucide-react";

// Library item data structure
export interface LibraryItem {
  id: string;
  type: "video" | "textbook";
  category: string;
  title: string;
  author: string;
  duration?: string;
  pages?: string;
  progress: number;
  isHighYield: boolean;
  url: string;
  thumbnail?: string;
  description?: string;
}

// Mock Library Data
const LIBRARY_MOCK_DATA: LibraryItem[] = [
  {
    id: "video-1",
    type: "video",
    category: "Cardiology",
    title: "ECG Interpretation Masterclass",
    author: "Dr. Sarah Chen",
    duration: "45 min",
    progress: 65,
    isHighYield: true,
    url: "#",
    description: "Comprehensive guide to reading ECGs, covering common arrhythmias and abnormalities.",
  },
  {
    id: "video-2",
    type: "video",
    category: "Neurology",
    title: "Stroke Management Protocols",
    author: "Dr. Michael Park",
    duration: "32 min",
    progress: 40,
    isHighYield: true,
    url: "#",
    description: "Evidence-based approach to acute stroke treatment and management.",
  },
  {
    id: "video-3",
    type: "video",
    category: "Pediatrics",
    title: "Pediatric Growth Charts Explained",
    author: "Dr. Emily Rodriguez",
    duration: "28 min",
    progress: 0,
    isHighYield: false,
    url: "#",
    description: "Understanding and interpreting pediatric growth and development charts.",
  },
  {
    id: "video-4",
    type: "video",
    category: "Cardiology",
    title: "Heart Failure Pathophysiology",
    author: "Dr. James Wilson",
    duration: "52 min",
    progress: 85,
    isHighYield: true,
    url: "#",
    description: "Deep dive into the mechanisms and treatment of heart failure.",
  },
  {
    id: "book-1",
    type: "textbook",
    category: "Cardiology",
    title: "Cardiovascular Medicine: A Clinical Guide",
    author: "Dr. Robert Thompson",
    pages: "450 pages",
    progress: 72,
    isHighYield: true,
    url: "#",
    description: "Comprehensive textbook covering all aspects of cardiovascular medicine.",
  },
  {
    id: "book-2",
    type: "textbook",
    category: "Neurology",
    title: "Neurological Disorders Handbook",
    author: "Dr. Lisa Anderson",
    pages: "380 pages",
    progress: 45,
    isHighYield: false,
    url: "#",
    description: "Essential reference for common neurological conditions and their management.",
  },
  {
    id: "book-3",
    type: "textbook",
    category: "Pediatrics",
    title: "Pediatric Emergency Medicine",
    author: "Dr. David Martinez",
    pages: "520 pages",
    progress: 30,
    isHighYield: true,
    url: "#",
    description: "Complete guide to pediatric emergencies and critical care.",
  },
  {
    id: "book-4",
    type: "textbook",
    category: "Ethics",
    title: "Medical Ethics in Practice",
    author: "Dr. Patricia Brown",
    pages: "280 pages",
    progress: 90,
    isHighYield: false,
    url: "#",
    description: "Ethical principles and case studies for medical professionals.",
  },
  {
    id: "book-5",
    type: "textbook",
    category: "Neurology",
    title: "Clinical Neuroanatomy Review",
    author: "Dr. Christopher Lee",
    pages: "340 pages",
    progress: 0,
    isHighYield: true,
    url: "#",
    description: "Visual guide to neuroanatomy with clinical correlations.",
  },
  {
    id: "video-5",
    type: "video",
    category: "Ethics",
    title: "Informed Consent: Best Practices",
    author: "Dr. Jennifer White",
    duration: "25 min",
    progress: 100,
    isHighYield: false,
    url: "#",
    description: "How to properly obtain and document informed consent.",
  },
];

type FilterType = "all" | "videos" | "books" | "high-yield";
type ViewMode = "library" | "focus";
type ViewStyle = "grid" | "list";

export default function LibraryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("library");
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [videos, setVideos] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewStyle, setViewStyle] = useState<ViewStyle>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchVideos = async () => {
      try {
        if (!isMounted) return;
        
        const response = await fetch("/api/library/videos", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        
        if (!isMounted) return;
        
        if (response.ok) {
          const videoData = await response.json();
          const transformedVideos: LibraryItem[] = videoData.map((video: any) => ({
            id: video.id,
            type: "video" as const,
            category: video.category,
            title: video.title,
            author: "Medical Education",
            duration: undefined,
            progress: 0,
            isHighYield: video.isHighYield,
            url: video.url,
            thumbnail: undefined,
            description: `Educational video: ${video.title}`,
          }));
          
          if (isMounted) {
            setVideos(transformedVideos);
            setIsLoading(false);
          }
        } else {
          if (isMounted) setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchVideos();
    intervalId = setInterval(fetchVideos, 30000);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const allItems = useMemo(() => {
    const mockTextbooks = LIBRARY_MOCK_DATA.filter((item) => item.type === "textbook");
    return [...videos, ...mockTextbooks];
  }, [videos]);

  const filteredItems = useMemo(() => {
    let items = allItems;

    if (filter === "videos") {
      items = items.filter((item) => item.type === "video");
    } else if (filter === "books") {
      items = items.filter((item) => item.type === "textbook");
    } else if (filter === "high-yield") {
      items = items.filter((item) => item.isHighYield);
    }

    if (selectedCategory) {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [filter, selectedCategory, allItems, searchQuery]);

  const availableCategories = useMemo(() => {
    const categories = new Set(allItems.map((item) => item.category));
    return Array.from(categories).sort();
  }, [allItems]);

  const stats = useMemo(() => {
    const totalVideos = allItems.filter((item) => item.type === "video").length;
    const totalBooks = allItems.filter((item) => item.type === "textbook").length;
    const totalHighYield = allItems.filter((item) => item.isHighYield).length;
    const completedItems = allItems.filter((item) => item.progress === 100).length;
    return { totalVideos, totalBooks, totalHighYield, completedItems };
  }, [allItems]);

  const handleItemClick = (item: LibraryItem) => {
    setSelectedItem(item);
    setViewMode("focus");
  };

  const handleMinimize = () => {
    setViewMode("library");
  };

  const handleCloseFocus = () => {
    setSelectedItem(null);
    setViewMode("library");
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/library/videos", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (response.ok) {
        const videoData = await response.json();
        const transformedVideos: LibraryItem[] = videoData.map((video: any) => ({
          id: video.id,
          type: "video" as const,
          category: video.category,
          title: video.title,
          author: "Medical Education",
          duration: undefined,
          progress: 0,
          isHighYield: video.isHighYield,
          url: video.url,
          thumbnail: undefined,
          description: `Educational video: ${video.title}`,
        }));
        setVideos(transformedVideos);
      }
    } catch (error) {
      console.error("Failed to refresh videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function SkeletonCard({ className = "" }: { className?: string }) {
    return (
      <div className={`bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-32 bg-slate-200 rounded-xl" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
          <div className="h-2 bg-slate-200 rounded w-full" />
        </div>
      </div>
    );
  }

  function EmptyState() {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <LibraryIcon className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Resources Found</h3>
          <p className="text-slate-500 mb-6">
            Try adjusting your filters or search query to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setFilter("all");
              setSelectedCategory(null);
              setSearchQuery("");
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {viewMode === "library" ? (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 lg:p-8 bg-[#F8FAFC] min-h-full"
          >
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Medical Library</h1>
                  <p className="text-slate-500 mt-1">Your comprehensive collection of textbooks and videos</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    <span className="text-sm font-medium">Refresh</span>
                  </button>
                </div>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50">
                      <Video className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{stats.totalVideos}</p>
                      <p className="text-sm text-slate-500">Videos</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-50">
                      <Book className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{stats.totalBooks}</p>
                      <p className="text-sm text-slate-500">Textbooks</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-50">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{stats.totalHighYield}</p>
                      <p className="text-sm text-slate-500">High-Yield</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-50">
                      <Book className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{stats.completedItems}</p>
                      <p className="text-sm text-slate-500">Completed</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search library..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: "all", label: "All", icon: null },
                      { key: "videos", label: "Videos", icon: Play },
                      { key: "books", label: "Books", icon: Book },
                      { key: "high-yield", label: "High-Yield", icon: Sparkles },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        onClick={() => setFilter(btn.key as FilterType)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          filter === btn.key
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {btn.icon && <btn.icon className="w-4 h-4" />}
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => setViewStyle("grid")}
                      className={`p-2 rounded-lg transition-all ${
                        viewStyle === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewStyle("list")}
                      className={`p-2 rounded-lg transition-all ${
                        viewStyle === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === null
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All Categories
                  </button>
                  {availableCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Content */}
              {isLoading && videos.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={viewStyle === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                      >
                        {viewStyle === "grid" ? (
                          <div
                            onClick={() => handleItemClick(item)}
                            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
                          >
                            <div className="relative aspect-video bg-slate-100 overflow-hidden">
                              {item.type === "video" ? (
                                <>
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center">
                                  <Book className="w-16 h-16 text-amber-500" />
                                </div>
                              )}
                              {item.isHighYield && (
                                <div className="absolute top-3 left-3 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  High-Yield
                                </div>
                              )}
                              {item.progress > 0 && (
                                <div className="absolute top-3 right-3 px-2 py-1 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-lg">
                                  {item.progress}%
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <p className="text-xs text-blue-600 font-medium mb-1">{item.category}</p>
                              <h3 className="font-semibold text-slate-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-sm text-slate-500 mb-3">{item.author}</p>
                              <div className="flex items-center justify-between text-sm text-slate-500">
                                <div className="flex items-center gap-1">
                                  {item.type === "video" ? (
                                    <>
                                      <Clock className="w-4 h-4" />
                                      <span>{item.duration}</span>
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="w-4 h-4" />
                                      <span>{item.pages}</span>
                                    </>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                              </div>
                              <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${item.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.progress}%` }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleItemClick(item)}
                            className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group flex items-center gap-4"
                          >
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${item.type === "video" ? "bg-blue-50" : "bg-amber-50"}`}>
                              {item.type === "video" ? (
                                <Play className="w-8 h-8 text-blue-600" />
                              ) : (
                                <Book className="w-8 h-8 text-amber-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.category}</span>
                                {item.isHighYield && (
                                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    High-Yield
                                  </span>
                                )}
                              </div>
                              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                              <p className="text-sm text-slate-500">{item.author} • {item.type === "video" ? item.duration : item.pages}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-bold text-slate-800">{item.progress}%</p>
                              <p className="text-xs text-slate-400">{item.progress === 100 ? "Completed" : "In Progress"}</p>
                            </div>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${item.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyState />
              )}
            </div>
          </motion.div>
        ) : (
          <FocusWorkspace item={selectedItem!} onMinimize={handleMinimize} onClose={handleCloseFocus} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
