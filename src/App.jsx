import { useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppProvider } from "./context/AppProvider";
import { useAppContext } from "./context/AppContext";
import Header from "./components/Header";
import Popups from "./components/Popups";
import Confetti from "./components/Confetti";
import BottomNav from "./components/BottomNav";
import { Analytics } from "@vercel/analytics/react";
import { getLevelInfo, xpPct, DAYS_FULL } from "./Data";

// Pages
import DashboardPage from "./pages/DashboardPage";
import ChallengesPage from "./pages/ChallengesPage";
import StatsPage from "./pages/StatsPage";
import BadgesPage from "./pages/BadgesPage";
import SettingsPage from "./pages/SettingsPage";

function AppLayout() {
  const {
    th,
    stats,
    todaysTasks,
    today,
    todayIdx,
    quote,
    popup,
    setPopup,
    confetti,
  } = useAppContext();

  const { cur: lvl } = getLevelInfo(stats.totalXP);
  const pct = xpPct(stats.totalXP);
  const completed = todaysTasks.filter((t) => t.done).length;
  const total = todaysTasks.length;
  const dayPct = total ? Math.round((completed / total) * 100) : 0;

  // Swipe logic
  const location = useLocation();
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const ROUTES = ["/", "/challenges", "/stats", "/badges", "/settings"];

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    const minSwipeDistance = 50;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = ROUTES.indexOf(location.pathname);
      if (currentIndex === -1) return;

      if (isLeftSwipe && currentIndex < ROUTES.length - 1) {
        navigate(ROUTES[currentIndex + 1]);
      } else if (isRightSwipe && currentIndex > 0) {
        navigate(ROUTES[currentIndex - 1]);
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={`min-h-screen ${th.bg} ${th.text} font-sans transition-colors duration-300 theme-${th.name.toLowerCase()} overflow-x-hidden`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Analytics />
      <Confetti active={confetti} />
      <Popups popup={popup} setPopup={setPopup} th={th} />
      <Header
        th={th}
        lvl={lvl}
        stats={stats}
        pct={pct}
        completed={completed}
        total={total}
        dayPct={dayPct}
      />

      {/* Motivational Quote */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div
          className={`glass rounded-2xl px-5 py-3 text-xs italic ${th.sub} text-center border-glow animate-float`}
        >
          "{quote}"
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        <div className="flex justify-between items-baseline px-1">
          <span className="text-xl font-display font-black tracking-tight">
            {DAYS_FULL[todayIdx]}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {today}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto px-4 pb-28">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
