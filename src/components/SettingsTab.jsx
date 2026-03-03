import { THEMES } from "../Data";

export default function SettingsTab({ th, theme, setTheme, onReset }) {
  return (
    <div className="mt-3 space-y-3">
      <div
        className={`glass-dark rounded-2xl p-5 border ${th.border} shadow-premium`}
      >
        <h3 className="font-display font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
          <span>🎨</span> Appearance
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(THEMES).map(([k, t]) => (
            <button
              key={k}
              onClick={() => setTheme(k)}
              className={`py-2.5 rounded-xl text-sm font-display font-bold border-2 transition-all btn-premium ${theme === k ? "border-indigo-500 bg-indigo-600/20 text-indigo-400" : "border-white/5 bg-white/5 text-gray-400 hover:bg-white/10"}`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`glass-dark rounded-2xl p-5 border ${th.border} shadow-premium bg-red-950/20`}
      >
        <h3 className="font-display font-bold text-sm mb-2 uppercase tracking-wider flex items-center gap-2 text-red-400">
          <span>⚠️</span> Danger Zone
        </h3>
        <p className={`${th.sub} text-[10px] mb-4 font-medium leading-relaxed`}>
          This action will permanently delete all your progress, XP, badges, and
          statistics. This cannot be undone.
        </p>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to reset everything? Your progress will be lost forever.",
              )
            ) {
              onReset();
            }
          }}
          className="w-full btn-premium bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 py-3 rounded-xl text-sm font-display font-bold shadow-lg shadow-red-500/20"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
}
