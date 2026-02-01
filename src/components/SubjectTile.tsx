interface SubjectTileProps {
  name: string;
  progress: number;
  totalQuestions: number;
  completedQuestions: number;
  onClick?: () => void;
}

export function SubjectTile({ name, progress, totalQuestions, completedQuestions, onClick }: SubjectTileProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
          {name}
        </span>
        <span className="text-sm text-slate-500">
          {completedQuestions}/{totalQuestions}
        </span>
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
        {name} Questions
      </h3>
      <div className="space-y-2">
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">{progress}% Complete</p>
      </div>
    </div>
  );
}
