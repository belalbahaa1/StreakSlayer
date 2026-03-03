export default function Header({
  th,
  lvl,
  stats,
  pct,
  completed,
  total,
  dayPct,
}) {
  return (
    <div
      className={`glass-dark border-b ${th.border} px-4 py-4 sticky top-0 z-40 transition-all duration-300`}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">{lvl.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-display font-bold leading-tight tracking-tight text-glow">
                  StreakSlayer
                </h1>
                <p className={`${th.sub} text-xs`}>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className={`font-bold ${lvl.color}`}>
                  {lvl.title} Lv.{lvl.level}
                </div>
                <div className="text-yellow-400 font-semibold text-sm">
                  {stats.totalXP} XP
                </div>
              </div>
            </div>
            <div className="mt-1">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-linear-to-r from-yellow-400 to-orange-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Stats row */}
        <div className="flex gap-2">
          {[
            { v: `${completed}/${total}`, l: "Today", c: "text-orange-400" },
            { v: `🔥${stats.streak}`, l: "Streak", c: "text-red-400" },
            {
              v: `⭐${stats.perfectDays}`,
              l: "Perfect",
              c: "text-yellow-400",
            },
          ].map((s) => (
            <div
              key={s.l}
              className={`flex-1 glass rounded-xl p-2 text-center transition-transform hover:scale-105`}
            >
              <div className={`font-display font-bold text-sm ${s.c}`}>
                {s.v}
              </div>
              <div
                className={`${th.sub} text-[10px] uppercase tracking-wider font-semibold`}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
        {/* Day bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-linear-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${dayPct}%` }}
            />
          </div>
          <div className={`flex justify-between ${th.sub} text-xs mt-0.5`}>
            <span>Progress</span>
            <span>
              {dayPct}%{dayPct === 100 && " 🎉"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
