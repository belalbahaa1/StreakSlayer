import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AppContext } from "./AppContext";
import {
  DEFAULT_TASKS,
  BADGES,
  DAILY_CHALLENGES,
  QUOTES,
  THEMES,
  getLevelInfo,
  todayKey,
  isTaskForDay,
} from "../Data";

const initStats = () => ({
  totalXP: 0,
  streak: 0,
  perfectDays: 0,
  totalCompleted: 0,
  earnedBadges: [],
  challengesDone: 0,
  weekHistory: {},
  lastTaskDate: null,
  missedTasks: 0,
  xpLost: 0,
});

const initDaily = () => {
  const indices = [];
  while (indices.length < 3) {
    const r = Math.floor(Math.random() * DAILY_CHALLENGES.length);
    if (!indices.includes(r)) indices.push(r);
  }
  return {
    challengeIndices: indices,
    challengesDone: [false, false, false],
    date: todayKey(),
  };
};

export const AppProvider = ({ children }) => {
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(() =>
    load("dr_notifications", false),
  );
  const [popup, setPopup] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [today, setToday] = useState(todayKey());

  const th = THEMES[theme] || THEMES.dark;
  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
  );

  // Keeps 'today' fresh
  useEffect(() => {
    const i = setInterval(() => {
      const fresh = todayKey();
      if (fresh !== today) setToday(fresh);
    }, 60000);
    return () => clearInterval(i);
  }, [today]);

  const todayIdx = useMemo(() => new Date(today).getDay(), [today]);
  const todaysTasks = tasks.filter((t) => isTaskForDay(t, todayIdx));

  // Persist State
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
    localStorage.setItem("dr_theme", JSON.stringify(theme));
  }, [theme]);
  useEffect(() => {
    localStorage.setItem(
      "dr_notifications",
      JSON.stringify(notificationsEnabled),
    );
  }, [notificationsEnabled]);

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

  // Notifications
  useEffect(() => {
    if (!notificationsEnabled || Notification.permission !== "granted") return;

    const checkReminder = () => {
      const now = new Date();
      // 23 means 11 PM (1 hour before midnight)
      if (now.getHours() === 23) {
        const lastSent = localStorage.getItem("dr_last_reminder");
        if (lastSent !== today) {
          const uncompletedTasks = todaysTasks.filter((t) => !t.done);
          const uncompletedChallenges = daily.challengesDone.filter((d) => !d);

          if (uncompletedTasks.length > 0 || uncompletedChallenges.length > 0) {
            new Notification("StreakSlayer Reminder", {
              body: `Only 1 hour left! You have ${uncompletedTasks.length} task(s) and ${uncompletedChallenges.length} challenge(s) left to save your streak! ⏳`,
            });
            localStorage.setItem("dr_last_reminder", today);
          }
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [today, notificationsEnabled, todaysTasks, daily.challengesDone]);

  // Nightly Reset Logic
  useEffect(() => {
    if (daily.date !== today) {
      setTimeout(() => {
        const oldDateStr = daily.date;
        const oldDate = new Date(oldDateStr);
        const currentDate = new Date(today);
        oldDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((currentDate - oldDate) / 86400000);

        const oldTodayIdx = oldDate.getDay();
        const oldTasks = tasks.filter((t) => isTaskForDay(t, oldTodayIdx));
        const missedTasks = oldTasks.filter((t) => !t.done);
        const xpLoss = missedTasks.reduce((acc, t) => acc + (t.xp || 0), 0);

        const allDone = oldTasks.length > 0 && oldTasks.every((t) => t.done);
        const expectedNewStreak =
          diffDays === 1 ? (allDone ? stats.streak + 1 : 0) : 0;

        setStats((s) => {
          const actualStreak =
            diffDays === 1 ? (allDone ? s.streak + 1 : 0) : 0;
          const hist = { ...(s.weekHistory || {}) };
          hist[oldDateStr] = oldTasks.filter((t) => t.done).length;
          return {
            ...s,
            totalXP: Math.max(0, s.totalXP - xpLoss),
            streak: actualStreak,
            perfectDays: s.perfectDays + (allDone ? 1 : 0),
            weekHistory: hist,
            missedTasks: (s.missedTasks || 0) + missedTasks.length,
            xpLost: (s.xpLost || 0) + xpLoss,
          };
        });

        if (allDone && diffDays === 1) {
          setConfetti(true);
          setPopup({ type: "perfect_day", streak: expectedNewStreak });
          setTimeout(() => {
            setConfetti(false);
            setPopup(null);
          }, 4000);
        } else if (xpLoss > 0) {
          setPopup({ type: "loss", xp: xpLoss });
          setTimeout(() => setPopup(null), 4000);
        }

        setTasks((ts) => ts.map((t) => ({ ...t, done: false })));
        const newDaily = initDaily();
        newDaily.date = today;
        setDaily(newDaily);
      }, 0);
    }
  }, [daily.date, tasks, today, stats.streak]);

  const checkChallenge = useCallback(
    (updatedTasks) => {
      let dailyUpdated = false;
      let newStatsUpdates = { xpGain: 0, chGain: 0 };
      const newDones = [...daily.challengesDone];
      const newlyCompleted = [];

      daily.challengeIndices.forEach((cIdx, i) => {
        if (newDones[i]) return;
        const ch = DAILY_CHALLENGES[cIdx];
        if (!ch) return;

        const todayTasks = updatedTasks.filter((t) =>
          isTaskForDay(t, todayIdx),
        );
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
          newDones[i] = true;
          dailyUpdated = true;
          newStatsUpdates.xpGain += ch.xp;
          newStatsUpdates.chGain += 1;
          newlyCompleted.push(ch);
        }
      });

      if (dailyUpdated) {
        setDaily((d) => ({ ...d, challengesDone: newDones }));
        setStats((s) => ({
          ...s,
          totalXP: s.totalXP + newStatsUpdates.xpGain,
          challengesDone: s.challengesDone + newStatsUpdates.chGain,
        }));

        setPopup({ type: "challenge", ch: newlyCompleted[0] });
        setConfetti(true);
        setTimeout(() => {
          setPopup(null);
          setConfetti(false);
        }, 3000);
      }
    },
    [daily.challengesDone, daily.challengeIndices, todayIdx],
  );

  const toggleTask = useCallback(
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

        setPopup({ type: "xp", xp: xpGain, label: task.label });
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

  const resetAll = useCallback(() => {
    setStats(initStats());
    setDaily(initDaily());
    setTasks(DEFAULT_TASKS.map((t) => ({ ...t, done: false })));
  }, []);

  const toggleNotifications = useCallback(() => {
    if (!notificationsEnabled) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
        return;
      }
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
        } else {
          alert("Notification permission denied!");
        }
      });
    } else {
      setNotificationsEnabled(false);
    }
  }, [notificationsEnabled]);

  const value = {
    tasks,
    setTasks,
    stats,
    setStats,
    daily,
    setDaily,
    theme,
    setTheme,
    popup,
    setPopup,
    confetti,
    setConfetti,
    today,
    todayIdx,
    todaysTasks,
    th,
    quote,
    toggleTask,
    resetAll,
    notificationsEnabled,
    toggleNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
