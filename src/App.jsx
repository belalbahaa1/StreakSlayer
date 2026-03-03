import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Confetti from "./components/Confetti";
import Header from "./components/Header";
import Popups from "./components/Popups";
import TasksTab from "./components/TasksTab";
import ChallengesTab from "./components/ChallengesTab";
import StatsTab from "./components/StatsTab";
import BadgesTab from "./components/BadgesTab";
import SettingsTab from "./components/SettingsTab";

import {
  DEFAULT_TASKS,
  BADGES,
  DAILY_CHALLENGES,
  QUOTES,
  THEMES,
  getLevelInfo,
  xpPct,
  todayKey,
  weekDays,
  isTaskForDay,
  DAYS_SHORT,
  DAYS_FULL,
} from "./Data";

const initStats = () => ({
  totalXP: 0,
  streak: 0,
  perfectDays: 0,
  totalCompleted: 0,
  earnedBadges: [],
  challengesDone: 0,
  weekHistory: {},
  lastTaskDate: null,
});
const initDaily = () => ({
  challengeIdx: Math.floor(Math.random() * DAILY_CHALLENGES.length),
  challengeDone: false,
  date: todayKey(),
});

export default function App() {
  const load = (k, fb) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "null") || fb;
    } catch {
      return fb;
    }
  };

  const [tasks, setTasks] = useState(() =>
    load(
      "dr_tasks2",
      DEFAULT_TASKS.map((t) => ({ ...t, done: false })),
    ),
  );
  const [stats, setStats] = useState(() => load("dr_stats2", initStats()));
  const [daily, setDaily] = useState(() => {
    const d = load("dr_daily2", initDaily());
    return d.date === todayKey() ? d : initDaily();
  });
  const [theme, setTheme] = useState(() => load("dr_theme", "dark"));
  const [tab, setTab] = useState("tasks");
  const [popup, setPopup] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    label: "",
    icon: "✅",
    category: "morning",
    difficulty: "medium",
  });
  const [today, setToday] = useState(todayKey());

  const th = THEMES[theme] || THEMES.dark;
  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
  );

  // Keep 'today' fresh if the app is left open
  useEffect(() => {
    const i = setInterval(() => {
      const fresh = todayKey();
      if (fresh !== today) setToday(fresh);
    }, 60000);
    return () => clearInterval(i);
  }, [today]);

  const todayIdx = useMemo(() => new Date(today).getDay(), [today]);
  const todaysTasks = tasks.filter((t) => isTaskForDay(t, todayIdx));

  // persist
  useEffect(() => {
    localStorage.setItem("dr_tasks2", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("dr_stats2", JSON.stringify(stats));
  }, [stats]);
  useEffect(() => {
    localStorage.setItem("dr_daily2", JSON.stringify(daily));
  }, [daily]);
  useEffect(() => {
    localStorage.setItem("dr_theme", theme);
  }, [theme]);

  // Level Up/Down Detection
  const prevLevelRef = useRef(null);
  const { cur: currentLvl } = getLevelInfo(stats.totalXP);

  useEffect(() => {
    if (prevLevelRef.current === null) {
      prevLevelRef.current = currentLvl.level;
      return;
    }

    if (currentLvl.level !== prevLevelRef.current) {
      const isUp = currentLvl.level > prevLevelRef.current;
      setPopup({
        type: "level",
        oldLvl: prevLevelRef.current,
        newLvl: currentLvl.level,
        title: currentLvl.title,
        avatar: currentLvl.avatar,
        isUp,
      });

      if (isUp) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 4000);
      }

      prevLevelRef.current = currentLvl.level;
    }
  }, [stats.totalXP, currentLvl]);

  // new day reset
  useEffect(() => {
    if (daily.date !== today) {
      setTimeout(() => {
        const oldTodayIdx = new Date(daily.date).getDay();
        const missedTasks = tasks.filter(
          (t) => isTaskForDay(t, oldTodayIdx) && !t.done,
        );
        const xpLoss = missedTasks.reduce((acc, t) => acc + (t.xp || 0), 0);

        const allDone = tasks.every((t) => t.done);
        setStats((s) => {
          const prevDate = new Date(s.lastTaskDate || 0).toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const newStreak =
            prevDate === yesterday
              ? s.streak + (allDone ? 1 : 0)
              : allDone
                ? 1
                : 0;
          const hist = { ...(s.weekHistory || {}) };
          hist[daily.date] = tasks.filter((t) => t.done).length;
          return {
            ...s,
            totalXP: Math.max(0, s.totalXP - xpLoss),
            streak: newStreak,
            perfectDays: s.perfectDays + (allDone ? 1 : 0),
            weekHistory: hist,
          };
        });

        if (xpLoss > 0) {
          setPopup({ type: "loss", xp: xpLoss });
          setTimeout(() => setPopup(null), 4000);
        }

        setTasks((ts) => ts.map((t) => ({ ...t, done: false })));
        setDaily(initDaily());
      }, 0);
    }
  }, [daily.date, tasks, today]);

  const checkChallenge = useCallback(
    (updatedTasks) => {
      if (daily.challengeDone) return;
      const ch = DAILY_CHALLENGES[daily.challengeIdx];
      if (!ch) return;

      const todayTasks = updatedTasks.filter((t) => isTaskForDay(t, todayIdx));
      const done = todayTasks.filter((t) => t.done);
      let met = false;

      if (ch.type === "morning_all") {
        const morning = todayTasks.filter((t) => t.category === "morning");
        met = morning.length > 0 && morning.every((t) => t.done);
      } else if (ch.type === "evening_all") {
        const evening = todayTasks.filter((t) => t.category === "evening");
        met = evening.length > 0 && evening.every((t) => t.done);
      } else if (ch.type === "total_8") {
        met = done.length >= 8;
      } else if (ch.type === "hard_2") {
        met = done.filter((t) => t.difficulty === "hard").length >= 2;
      } else if (ch.type === "all_tasks") {
        met = todayTasks.length > 0 && todayTasks.every((t) => t.done);
      }

      if (met) {
        setDaily((d) => ({ ...d, challengeDone: true }));
        setStats((s) => ({
          ...s,
          totalXP: s.totalXP + ch.xp,
          challengesDone: s.challengesDone + 1,
        }));
        setPopup({ type: "challenge", ch });
        setConfetti(true);
        setTimeout(() => {
          setPopup(null);
          setConfetti(false);
        }, 3000);
      }
    },
    [daily.challengeDone, daily.challengeIdx, todayIdx],
  );

  const toggle = useCallback(
    (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const wasDone = task.done;
      const updatedTasks = tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t,
      );
      setTasks(updatedTasks);

      if (!wasDone) {
        const xpGain = task.xp || 0;
        let newStats;
        setStats((s) => {
          newStats = {
            ...s,
            totalXP: s.totalXP + xpGain,
            totalCompleted: s.totalCompleted + 1,
            lastTaskDate: today,
          };
          const newBadges = BADGES.filter(
            (b) => !s.earnedBadges.includes(b.id) && b.check(newStats),
          ).map((b) => b.id);
          if (newBadges.length) {
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3000);
            setTimeout(
              () => setPopup({ type: "badge", badges: newBadges }),
              400,
            );
          }
          return {
            ...newStats,
            earnedBadges: [...s.earnedBadges, ...newBadges],
          };
        });
        setPopup({
          type: "xp",
          xp: xpGain,
          label: task.label,
        });
        setTimeout(() => setPopup(null), 1600);
        setTimeout(() => checkChallenge(updatedTasks), 50);
      } else {
        setStats((s) => ({
          ...s,
          totalXP: Math.max(0, s.totalXP - task.xp),
          totalCompleted: Math.max(0, s.totalCompleted - 1),
        }));
      }
    },
    [tasks, checkChallenge, today],
  );

  const addTask = () => {
    if (!newTask.label.trim()) return;
    const base = { easy: 15, medium: 35, hard: 50 }[newTask.difficulty];
    setTasks((ts) => [
      ...ts,
      { ...newTask, id: Date.now(), xp: base, done: false },
    ]);
    setNewTask({
      label: "",
      icon: "✅",
      category: "morning",
      difficulty: "medium",
    });
    setShowAdd(false);
  };

  const { cur: lvl } = getLevelInfo(stats.totalXP);
  const pct = xpPct(stats.totalXP);
  const completed = todaysTasks.filter((t) => t.done).length;
  const total = todaysTasks.length;
  const dayPct = total ? Math.round((completed / total) * 100) : 0;
  const challenge = DAILY_CHALLENGES[daily.challengeIdx];

  // weekly report
  const wDays = weekDays();
  const weekScores = wDays.map((d) => ({
    d,
    n: d === today ? completed : (stats.weekHistory || {})[d] || 0,
  }));
  const weekAvg = Math.round(weekScores.reduce((a, b) => a + b.n, 0) / 7);
  const weekGrade =
    weekAvg >= total * 0.9
      ? "A"
      : weekAvg >= total * 0.7
        ? "B"
        : weekAvg >= total * 0.5
          ? "C"
          : weekAvg >= total * 0.3
            ? "D"
            : "F";

  const tabs = ["tasks", "challenges", "stats", "badges", "settings"];

  return (
    <div
      className={`min-h-screen ${th.bg} ${th.text} font-sans transition-colors duration-300`}
    >
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
        todayName={DAYS_FULL[todayIdx]}
      />

      {/* Motivational Quote */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div
          className={`glass rounded-2xl px-5 py-3 text-xs italic ${th.sub} text-center border-glow animate-float`}
        >
          "{quote}"
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-lg mx-auto px-4 pt-5 flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 rounded-xl font-display font-bold text-[10px] uppercase tracking-widest transition-all duration-300 btn-premium ${tab === t ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400/50" : "glass text-gray-400 hover:text-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">
        <div className="flex justify-between items-baseline px-1">
          <span className="text-xl font-display font-black tracking-tight text-white">
            {DAYS_FULL[todayIdx]}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {today}
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-10">
        {tab === "tasks" && (
          <TasksTab
            tasks={tasks}
            todayIdx={todayIdx}
            setTasks={setTasks}
            toggle={toggle}
            th={th}
            showAdd={showAdd}
            setShowAdd={setShowAdd}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
          />
        )}
        {tab === "challenges" && (
          <ChallengesTab daily={daily} challenge={challenge} th={th} />
        )}
        {tab === "stats" && (
          <StatsTab
            th={th}
            weekScores={weekScores}
            total={total}
            weekGrade={weekGrade}
            weekAvg={weekAvg}
            stats={stats}
          />
        )}
        {tab === "badges" && <BadgesTab th={th} stats={stats} />}
        {tab === "settings" && (
          <SettingsTab
            th={th}
            theme={theme}
            setTheme={setTheme}
            onReset={() => {
              setStats(initStats());
              setDaily(initDaily());
              setTasks(DEFAULT_TASKS.map((t) => ({ ...t, done: false })));
            }}
          />
        )}
      </div>
    </div>
  );
}
