import { BADGES } from "../Data";

export default function BadgesTab({ th, stats }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {BADGES.map((b) => {
        const earned = stats.earnedBadges.includes(b.id);
        return (
          <div
            key={b.id}
            className={`rounded-2xl p-5 text-center border transition-all duration-500 scale-100 hover:scale-105 active:scale-95 group ${earned ? `glass border-yellow-500/40 shadow-lg shadow-yellow-500/10` : `bg-white/5 border-white/5 opacity-40 grayscale`}`}
          >
            <div
              className={`text-5xl mb-3 transition-transform duration-500 ${earned ? "group-hover:rotate-12" : ""}`}
            >
              {earned ? b.icon : "🔒"}
            </div>
            <div
              className={`font-display font-bold text-sm tracking-tight ${earned ? "text-yellow-400 text-glow" : th.sub}`}
            >
              {b.label}
            </div>
            <div
              className={`${th.sub} text-[10px] mt-1 font-medium leading-relaxed`}
            >
              {b.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}
