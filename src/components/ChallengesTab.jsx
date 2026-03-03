import { DAILY_CHALLENGES } from "../Data";

export default function ChallengesTab({ daily, challenge, th }) {
  return (
    <div className="mt-3 space-y-3">
      {/* Daily Challenge */}
      <div
        className={`glass-dark rounded-2xl p-5 border ${th.border} shadow-premium`}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📅</span>
          <span className="font-display font-bold text-base uppercase tracking-wider">
            Daily Challenge
          </span>
          <span
            className={`ml-auto text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${daily.challengeDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"}`}
          >
            {daily.challengeDone ? "Completed ✓" : "In Progress"}
          </span>
        </div>
        <div
          className={`glass rounded-xl p-4 flex items-center gap-4 border-glow transition-all hover:bg-white/10 group`}
        >
          <div className="text-4xl transition-transform group-hover:scale-110 duration-300">
            {challenge.icon}
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-base text-glow">
              {challenge.label}
            </div>
            <div className="text-yellow-400 text-xs font-bold mt-0.5 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              {challenge.xp} XP REWARD
            </div>
          </div>
          {daily.challengeDone && (
            <span className="text-2xl animate-bounce">✅</span>
          )}
        </div>
      </div>
    </div>
  );
}
