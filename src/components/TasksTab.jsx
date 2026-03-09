import {
  CATEGORY_GRAD,
  CATEGORY_BG,
  DIFFICULTY_COLOR,
  DIFFICULTY_LABEL,
  isTaskForDay,
  DAYS_SHORT,
} from "../Data";

export default function TasksTab({
  tasks,
  todayIdx,
  setTasks,
  toggle,
  th,
  showAdd,
  setShowAdd,
  newTask,
  setNewTask,
  addTask,
}) {
  const getCategoryFromTime = (time) => {
    if (!time) return "morning";
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    return "evening";
  };

  return (
    <>
      {["morning", "afternoon", "evening"].map((cat) => {
        const catTasks = tasks.filter(
          (t) => t.category === cat && isTaskForDay(t, todayIdx) && !t.done,
        );
        if (!catTasks.length) return null;
        return (
          <div key={cat} className="mt-3">
            <div
              className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-display font-bold mb-1.5 bg-linear-to-r ${CATEGORY_GRAD[cat]} text-white capitalize tracking-wider shadow-lg shadow-indigo-500/10`}
            >
              {cat}
            </div>
            <div
              className={`rounded-2xl border p-2 space-y-1.5 ${CATEGORY_BG[cat]}`}
            >
              {catTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggle(task.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl transition-all cursor-pointer select-none glass hover:bg-white/10 active:scale-[0.98] border-glow`}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-gray-500 flex items-center justify-center shrink-0" />
                  <div className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded-lg shrink-0 tabular-nums shadow-sm border border-indigo-500/20">
                    {task.time || "00:00"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{task.label}</div>
                    {task.days && task.days.length < 7 && (
                      <div className="flex gap-1 mt-0.5">
                        {task.days.map((d) => (
                          <span
                            key={d}
                            className="text-[8px] bg-indigo-500/20 text-indigo-300 px-1 rounded"
                          >
                            {DAYS_SHORT[d]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold shrink-0 ${DIFFICULTY_COLOR[task.difficulty]}`}
                  >
                    {DIFFICULTY_LABEL[task.difficulty]}
                  </span>
                  <span className="text-yellow-400 text-xs font-bold">
                    +{task.xp}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTasks((ts) => ts.filter((t) => t.id !== task.id));
                    }}
                    className="text-gray-600 hover:text-red-400 text-xs ml-0.5"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Completed Section */}
      {(() => {
        const completedTasks = tasks.filter(
          (t) => isTaskForDay(t, todayIdx) && t.done,
        );
        if (completedTasks.length === 0) return null;
        return (
          <div className="mt-6 opacity-80">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="h-px flex-1 bg-gray-800" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Completed ({completedTasks.length})
              </span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggle(task.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl transition-all cursor-pointer select-none ${th.inner} opacity-60 hover:opacity-100 scale-[0.98]`}
                >
                  <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-green-500 flex items-center justify-center shrink-0">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 bg-gray-500/10 px-1.5 py-0.5 rounded-lg shrink-0 tabular-nums line-through opacity-60">
                    {task.time || "00:00"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium line-through decoration-2 opacity-60">
                      {task.label}
                    </div>
                  </div>
                  <span className="text-gray-600 text-[10px] font-bold line-through">
                    +{task.xp} XP
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTasks((ts) => ts.filter((t) => t.id !== task.id));
                    }}
                    className="text-gray-700 hover:text-red-400 text-xs ml-0.5"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {showAdd ? (
        <div className={`mt-3 ${th.card} rounded-2xl p-4 border ${th.border}`}>
          <h3 className="font-semibold mb-3 text-sm">New Task</h3>
          <input
            className={`w-full ${th.inner} rounded-xl px-3 py-2 text-sm mb-3 outline-none`}
            placeholder="Task name..."
            value={newTask.label}
            onChange={(e) =>
              setNewTask((n) => ({ ...n, label: e.target.value }))
            }
          />
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1 block">
                Reminder Time
              </label>
              <input
                type="time"
                className={`w-full ${th.inner} rounded-xl px-3 py-2 text-sm outline-none font-medium tabular-nums`}
                value={newTask.time}
                onChange={(e) => {
                  const newTime = e.target.value;
                  const newCat = getCategoryFromTime(newTime);
                  setNewTask((n) => ({
                    ...n,
                    time: newTime,
                    category: newCat,
                  }));
                }}
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">
                Category (Auto)
              </label>
              <div
                className={`w-full ${th.inner} rounded-xl px-2 py-2 text-sm outline-none h-9 flex items-center justify-center font-bold capitalize text-indigo-400 border border-indigo-500/20 shadow-sm`}
              >
                {newTask.category}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1 block">
                Difficulty
              </label>
              <select
                className={`w-full ${th.inner} rounded-xl px-2 py-2 text-sm outline-none h-9`}
                value={newTask.difficulty}
                onChange={(e) =>
                  setNewTask((n) => ({ ...n, difficulty: e.target.value }))
                }
              >
                {["easy", "medium", "hard"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {[0, 1, 2, 3, 4, 5, 6].map((d) => {
              const active = (newTask.days || [0, 1, 2, 3, 4, 5, 6]).includes(
                d,
              );
              return (
                <button
                  key={d}
                  onClick={() => {
                    const currentDays = newTask.days || [0, 1, 2, 3, 4, 5, 6];
                    const nextDays = active
                      ? currentDays.filter((i) => i !== d)
                      : [...currentDays, d];
                    setNewTask((n) => ({ ...n, days: nextDays }));
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${active ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-500 border border-gray-700/50"}`}
                >
                  {DAYS_SHORT[d]}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={addTask}
              className="flex-1 btn-premium bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20"
            >
              Add Task
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="flex-1 bg-gray-700 py-2.5 rounded-xl text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className={`mt-4 w-full ${th.inner} hover:opacity-80 border border-dashed ${th.border} rounded-2xl py-2.5 text-sm ${th.sub} font-medium`}
        >
          + Add Custom Task
        </button>
      )}
    </>
  );
}
