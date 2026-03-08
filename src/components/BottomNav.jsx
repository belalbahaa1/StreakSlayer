import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function BottomNav() {
  const { th } = useAppContext();

  const links = [
    { to: "/", icon: "✅", label: "Tasks" },
    { to: "/challenges", icon: "🏆", label: "Challenges" },
    { to: "/stats", icon: "📊", label: "Stats" },
    { to: "/badges", icon: "🏅", label: "Badges" },
    { to: "/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 glass-dark border-t ${th.border} pb-safe`}
    >
      <div className="max-w-lg mx-auto flex justify-around items-center px-2 py-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-all duration-300 p-2 rounded-2xl ${
                isActive
                  ? "text-indigo-400 bg-white/10 scale-110"
                  : `${th.sub} hover:${th.text} hover:bg-white/5`
              }`
            }
          >
            <span className="text-xl">{link.icon}</span>
            <span className="text-[10px] font-display font-bold uppercase tracking-wider">
              {link.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
