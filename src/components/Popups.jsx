import { BADGES } from "../Data";

export default function Popups({ popup, setPopup, th }) {
  if (!popup) return null;

  return (
    <>
      {popup.type === "xp" && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
          <div className="bg-yellow-400 text-gray-900 font-bold px-5 py-2 rounded-full shadow-lg text-base animate-bounce">
            +{popup.xp} XP
          </div>
        </div>
      )}
      {popup.type === "loss" && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">
          <div className="bg-red-600 text-white font-bold px-5 py-2 rounded-full shadow-lg text-base animate-bounce flex items-center gap-2">
            <span>Penalty</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-lg">
              -{popup.xp} XP
            </span>
          </div>
        </div>
      )}
      {popup.type === "badge" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setPopup(null)}
        >
          <div
            className={`${th.card} rounded-2xl p-8 text-center shadow-2xl border border-yellow-400/40 max-w-xs mx-4`}
          >
            <div className="text-5xl mb-3">
              {BADGES.find((b) => b.id === popup.badges[0])?.icon}
            </div>
            <div className="text-yellow-400 font-bold text-xl mb-1">
              Badge Unlocked!
            </div>
            <div className="font-semibold">
              {BADGES.find((b) => b.id === popup.badges[0])?.label}
            </div>
            <div className={`${th.sub} text-sm mt-1`}>
              {BADGES.find((b) => b.id === popup.badges[0])?.desc}
            </div>
            <button className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold">
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}
      {popup.type === "level" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPopup(null)}
        >
          <div
            className={`${th.card} rounded-3xl p-10 text-center shadow-2xl border-2 ${popup.isUp ? "border-indigo-500" : "border-red-500"} max-w-xs mx-4 animate-in zoom-in duration-300`}
          >
            <div className="text-7xl mb-6 transform hover:scale-110 transition-transform">
              {popup.avatar}
            </div>
            <div
              className={`${popup.isUp ? "text-indigo-400" : "text-red-400"} font-black text-2xl mb-1 uppercase tracking-wider`}
            >
              {popup.isUp ? "Level Up!" : "Level Down"}
            </div>
            <div className="text-white text-3xl font-bold mb-2">
              Level {popup.newLvl}
            </div>
            <div className="bg-white/10 rounded-full px-4 py-1 inline-block mb-6">
              <span className="text-yellow-400 font-bold">{popup.title}</span>
            </div>
            <button
              className={`w-full ${popup.isUp ? "bg-indigo-600" : "bg-red-600"} text-white py-3 rounded-2xl font-bold shadow-lg transform active:scale-95 transition-all`}
            >
              {popup.isUp ? "Let's Go! 🚀" : "Back to Work 👊"}
            </button>
          </div>
        </div>
      )}
      {popup.type === "challenge" && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg text-center max-w-xs animate-bounce">
          🏆 Challenge Complete!
          <br />
          <span className="text-sm font-normal">
            {popup.ch.label} +{popup.ch.xp} XP
          </span>
        </div>
      )}
    </>
  );
}
