import { BADGES } from "../Data";

export default function StatsTab({
  th,
  weekScores,
  total,
  weekGrade,
  weekAvg,
  stats,
}) {
  return (
    <div className="mt-3 space-y-3">
      {/* Weekly Heatmap */}
      <div
        className={`glass-dark rounded-2xl p-5 border ${th.border} shadow-premium`}
      >
        <h3 className="font-display font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
          <span>📅</span> Weekly Heatmap
        </h3>
        <div className="flex gap-1">
          {weekScores.map(({ d, n }) => {
            const pct2 = total ? n / total : 0;
            const col =
              pct2 === 0
                ? "bg-gray-700"
                : pct2 < 0.4
                  ? "bg-green-900"
                  : pct2 < 0.7
                    ? "bg-green-600"
                    : pct2 < 1
                      ? "bg-green-400"
                      : "bg-green-300";
            const label = new Date(d).toLocaleDateString("en-US", {
              weekday: "short",
            });
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full aspect-square rounded-lg ${col} transition-all hover:scale-110 cursor-help border border-white/5 shadow-sm`}
                  title={`${n}/${total}`}
                />
                <span className={`text-[10px] font-bold ${th.sub} mt-1`}>
                  {label.slice(0, 1)}
                </span>
              </div>
            );
          })}
        </div>
        <div className={`flex justify-between text-xs ${th.sub} mt-2`}>
          <span>0 tasks</span>
          <span>All tasks ✅</span>
        </div>
      </div>

      {/* Weekly Report */}
      <div
        className={`glass-dark rounded-2xl p-5 border ${th.border} shadow-premium`}
      >
        <h3 className="font-display font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
          <span>📊</span> Weekly Report Card
        </h3>
        <div className="flex items-center gap-5">
          <div
            className={`text-7xl font-display font-black text-glow ${weekGrade === "A" ? "text-green-400" : weekGrade === "B" ? "text-blue-400" : weekGrade === "C" ? "text-yellow-400" : "text-red-400"}`}
          >
            {weekGrade}
          </div>
          <div>
            <div className="font-semibold">
              Avg {weekAvg}/{total} tasks/day
            </div>
            <div className={`${th.sub} text-xs mt-1`}>
              {weekGrade === "A"
                ? "Outstanding! Keep it up! 🌟"
                : weekGrade === "B"
                  ? "Great work, almost there! 💪"
                  : weekGrade === "C"
                    ? "Decent effort, push harder! 🔥"
                    : "You can do better! Start strong! 🚀"}
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          {weekScores.map(({ d, n }) => (
            <div key={d} className="flex items-center gap-2">
              <span className={`text-xs w-8 ${th.sub}`}>
                {new Date(d).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{
                    width: total ? `${Math.round((n / total) * 100)}%` : "0%",
                  }}
                />
              </div>
              <span className={`text-xs w-10 text-right ${th.sub}`}>
                {n}/{total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: "💎", label: "Total XP", val: stats.totalXP },
          { icon: "✅", label: "Tasks Done", val: stats.totalCompleted },
          {
            icon: "🔥",
            label: "Best Streak",
            val: `${stats.streak} days`,
          },
          { icon: "⭐", label: "Perfect Days", val: stats.perfectDays },
          { icon: "🏆", label: "Challenges", val: stats.challengesDone },
          {
            icon: "🏅",
            label: "Badges",
            val: `${stats.earnedBadges.length}/${BADGES.length}`,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`glass rounded-2xl p-4 border ${th.border} flex items-center gap-3 transition-all hover:bg-white/10 hover:translate-y--1`}
          >
            <div className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
              {s.icon}
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-tight">
                {s.val}
              </div>
              <div
                className={`${th.sub} text-[10px] uppercase font-bold tracking-widest`}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
