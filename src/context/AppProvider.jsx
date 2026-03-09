import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
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
  const [daily, setDaily] = useState(() => load("dr_daily2", initDaily()));

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

  const sendNotification = useCallback(
    (title, options = {}) => {
      if (!notificationsEnabled || Notification.permission !== "granted")
        return;

      const defaultOptions = {
        icon: "/favicon.png",
        badge: "/favicon.png",
        vibrate: [200, 100, 200],
        ...options,
      };

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready
          .then((registration) => {
            registration.showNotification(title, defaultOptions);
          })
          .catch((err) => {
            console.error("SW notification failed, falling back", err);
            new Notification(title, defaultOptions);
          });
      } else {
        new Notification(title, defaultOptions);
      }
    },
    [notificationsEnabled],
  );

  // Notifications
  useEffect(() => {
    if (!notificationsEnabled || Notification.permission !== "granted") return;

    const checkReminder = () => {
      const now = new Date();
      // 23 means 11 PM (1 hour before midnight)
      if (now.getHours() === 23) {
        const lastSent = localStorage.getItem("dr_last_reminder");
        if (lastSent !== today) {
          const uncompletedTasks = tasks.filter(
            (t) => isTaskForDay(t, todayIdx) && !t.done,
          );
          const uncompletedChallenges = daily.challengesDone.filter((d) => !d);

          if (uncompletedTasks.length > 0 || uncompletedChallenges.length > 0) {
            sendNotification("StreakSlayer Reminder", {
              body: `Only 1 hour left! You have ${uncompletedTasks.length} task(s) and ${uncompletedChallenges.length} challenge(s) left to save your streak! ⏳`,
            });
            localStorage.setItem("dr_last_reminder", today);
          }
        }
      }
    };

    checkReminder();
  }, [
    today,
    notificationsEnabled,
    tasks,
    todayIdx,
    daily.challengesDone,
    sendNotification,
  ]);

  // Background Task Reminder Worker
  useEffect(() => {
    if (!notificationsEnabled || Notification.permission !== "granted") return;

    const checkReminders = () => {
      const now = new Date();
      const currentHHmm = now.toTimeString().slice(0, 5); // "HH:mm"

      tasks.forEach((task) => {
        if (
          isTaskForDay(task, todayIdx) &&
          !task.done &&
          task.time === currentHHmm
        ) {
          // Check if we already notified for this task this minute
          const reminderKey = `reminder_${task.id}_${today}_${currentHHmm}`;
          if (!localStorage.getItem(reminderKey)) {
            sendNotification(`Task Reminder: ${task.label}`, {
              body: `It's ${task.time}! Time to get it done. 💪`,
              requireInteraction: true,
            });
            toast.success(`Task Reminder: ${task.label}`, {
              duration: 10000,
              icon: "🔔",
              style: {
                borderRadius: "16px",
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #374151",
              },
            });
            localStorage.setItem(reminderKey, "sent");
          }
        }
      });
    };

    checkReminders();
    const i = setInterval(checkReminders, 60000);
    return () => clearInterval(i);
  }, [notificationsEnabled, tasks, todayIdx, today, sendNotification]);

  // Nightly Reset Logic
  const resetLock = useRef(false);

  useEffect(() => {
    if (daily.date !== today && !resetLock.current) {
      resetLock.current = true;
      try {
        const oldDateStr = daily.date;
        const oldDate = new Date(oldDateStr);
        const currentDate = new Date(today);
        oldDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        const diffDays = Math.round((currentDate - oldDate) / 86400000);

        const oldTodayIdx = oldDate.getDay();
        const oldTasksAcrossApp = JSON.parse(
          localStorage.getItem("dr_tasks2") || "[]",
        );
        const oldTasksToday = oldTasksAcrossApp.filter((t) =>
          isTaskForDay(t, oldTodayIdx),
        );
        const missedTasksList = oldTasksToday.filter((t) => !t.done);
        const xpLoss = missedTasksList.reduce((acc, t) => acc + (t.xp || 0), 0);

        const allDone =
          oldTasksToday.length > 0 && oldTasksToday.every((t) => t.done);
        const expectedNewStreak =
          diffDays === 1 ? (allDone ? stats.streak + 1 : 0) : 0;

        setStats((s) => {
          const actualStreak =
            diffDays === 1 ? (allDone ? s.streak + 1 : 0) : 0;
          const hist = { ...(s.weekHistory || {}) };
          hist[oldDateStr] = oldTasksToday.filter((t) => t.done).length;
          return {
            ...s,
            totalXP: Math.max(0, s.totalXP - xpLoss),
            streak: actualStreak,
            perfectDays: s.perfectDays + (allDone ? 1 : 0),
            weekHistory: hist,
            missedTasks: (s.missedTasks || 0) + missedTasksList.length,
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
          toast.error(`Nightly Penalty: -${xpLoss} XP`, {
            duration: 4000,
            icon: "💀",
            style: {
              borderRadius: "16px",
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
            },
          });
        }

        setTasks((ts) => ts.map((t) => ({ ...t, done: false })));
        const newDaily = initDaily();
        newDaily.date = today;
        setDaily(newDaily);
      } finally {
        resetLock.current = false;
      }
    }
  }, [today, daily.date, stats.streak]);

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

        toast.success(`Challenge Complete: ${newlyCompleted[0].label}`, {
          duration: 4000,
          icon: "⭐",
          style: {
            borderRadius: "16px",
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        });
        setConfetti(true);
        setTimeout(() => {
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

        toast.success(`+${xpGain} XP: ${task.label}`, {
          duration: 2000,
          style: {
            borderRadius: "16px",
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        });
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

  const testNotification = useCallback(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    if (Notification.permission === "granted") {
      sendNotification("StreakSlayer Test", {
        body: "Native notifications are working!",
      });
      toast.success("Awesome! Notifications are active.", {
        style: {
          borderRadius: "16px",
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendNotification("StreakSlayer Test", {
            body: "Permission granted! Notifications are now active.",
          });
          toast.success("Permission granted!", {
            style: {
              borderRadius: "16px",
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
            },
          });
          setNotificationsEnabled(true);
        } else {
          toast.error("Notification permission denied!");
        }
      });
    }
  }, [sendNotification]);

  const simulateReminder = useCallback(() => {
    const uncompletedTasks = tasks.filter(
      (t) => isTaskForDay(t, todayIdx) && !t.done,
    );
    const uncompletedChallenges = daily.challengesDone.filter((d) => !d);

    if (uncompletedTasks.length > 0 || uncompletedChallenges.length > 0) {
      sendNotification("StreakSlayer Simulate", {
        body: `You have ${uncompletedTasks.length} task(s) and ${uncompletedChallenges.length} challenge(s) left! ⏳`,
        requireInteraction: true,
      });
      toast(`Simulated Reminder: ${uncompletedTasks.length} tasks left`, {
        icon: "⏳",
        style: {
          borderRadius: "16px",
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
    } else {
      toast.success("Everything complete! No reminder needed. 🎉", {
        style: {
          borderRadius: "16px",
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
        },
      });
    }
  }, [tasks, todayIdx, daily.challengesDone, sendNotification]);

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
    testNotification,
    simulateReminder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
