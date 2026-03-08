import { DAILY_CHALLENGES } from "../Data";

export default function ChallengesTab({ daily }) {
  // If user has old state without the array, fallback gracefully
  const indices = daily.challengeIndices || [daily.challengeIdx || 0];
  const dones = daily.challengesDone || [daily.challengeDone || false];

  return (
    <div className="mt-3 space-y-3">
      <div className="glass-dark rounded-2xl p-5 border border-white/5 shadow-premium">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📅</span>
          <span className="font-display font-bold text-base uppercase tracking-wider">
            Daily Challenges
          </span>
          <span
            className={`ml-auto text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${dones.every((d) => d) ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"}`}
          >
            {dones.filter((d) => d).length}/{indices.length} Completed
          </span>
        </div>

        <div className="space-y-3">
          {indices.map((cIdx, i) => {
            const challenge = DAILY_CHALLENGES[cIdx];
            if (!challenge) return null;
            const isDone = dones[i];

            return (
              <div
                key={i}
                className={`glass rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/10 group ${isDone ? "border-emerald-500/30 bg-emerald-900/10" : "border-glow"}`}
              >
                <div
                  className={`text-4xl transition-transform group-hover:scale-110 duration-300 ${isDone ? "opacity-80" : ""}`}
                >
                  {challenge.icon}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-display font-bold text-base ${isDone ? "text-emerald-400" : "text-glow"}`}
                  >
                    {challenge.label}
                  </div>
                  <div className="text-yellow-400 text-xs font-bold mt-0.5 flex items-center gap-1">
                    {!isDone && (
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    )}
                    {challenge.xp} XP REWARD
                  </div>
                </div>
                {isDone && <span className="text-2xl animate-bounce">✅</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
