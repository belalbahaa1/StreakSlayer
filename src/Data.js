export const DEFAULT_TASKS = [
  {
    id: 1,
    label: "Morning Wake-Up",
    icon: "�",
    xp: 15,
    category: "morning",
    difficulty: "easy",
  },
  {
    id: 2,
    label: "Afternoon Deep Work",
    time: "14:00",
    xp: 35,
    category: "afternoon",
    difficulty: "medium",
  },
  {
    id: 3,
    label: "Evening Screen Detox",
    time: "21:30",
    xp: 50,
    category: "evening",
    difficulty: "hard",
  },
];

export const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DIFFICULTY_XP = { easy: 15, medium: 35, hard: 50 };
export const DIFFICULTY_COLOR = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};
export const DIFFICULTY_LABEL = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const LEVELS = [
  { level: 1, title: "Rookie", minXP: 0, color: "text-gray-400", avatar: "🐣" },
  {
    level: 2,
    title: "Apprentice",
    minXP: 100,
    color: "text-green-400",
    avatar: "🐥",
  },
  {
    level: 3,
    title: "Warrior",
    minXP: 250,
    color: "text-blue-400",
    avatar: "🦊",
  },
  {
    level: 4,
    title: "Champion",
    minXP: 500,
    color: "text-purple-400",
    avatar: "🦁",
  },
  {
    level: 5,
    title: "Master",
    minXP: 1000,
    color: "text-pink-400",
    avatar: "🥋",
  },
  {
    level: 6,
    title: "Legend",
    minXP: 2000,
    color: "text-yellow-400",
    avatar: "🐉",
  },
  {
    level: 7,
    title: "Divine",
    minXP: 4000,
    color: "text-cyan-400",
    avatar: "⚡",
  },
  {
    level: 8,
    title: "Immortal",
    minXP: 7000,
    color: "text-red-400",
    avatar: "🔥",
  },
  {
    level: 9,
    title: "Eternal",
    minXP: 11000,
    color: "text-white",
    avatar: "🪐",
  },
  {
    level: 10,
    title: "dragon warrior",
    minXP: 16000,
    color: "text-indigo-400",
    avatar: "🌌",
  },
];

export const BADGES = [
  {
    id: "first_task",
    label: "First Step",
    icon: "🌱",
    desc: "Complete your first task",
    check: (s) => s.totalCompleted >= 1,
  },
  {
    id: "full_day",
    label: "Perfect Day",
    icon: "⭐",
    desc: "Complete all tasks in a day",
    check: (s) => s.perfectDays >= 1,
  },
  {
    id: "streak_3",
    label: "On Fire",
    icon: "🔥",
    desc: "3-day streak",
    check: (s) => s.streak >= 3,
  },
  {
    id: "streak_7",
    label: "Week Warrior",
    icon: "🗓️",
    desc: "7-day streak",
    check: (s) => s.streak >= 7,
  },
  {
    id: "xp_500",
    label: "XP Grinder",
    icon: "💎",
    desc: "Earn 500 XP total",
    check: (s) => s.totalXP >= 500,
  },
  {
    id: "challenge_5",
    label: "Challenger",
    icon: "🏆",
    desc: "Complete 5 daily challenges",
    check: (s) => s.challengesDone >= 5,
  },
];

export const DAILY_CHALLENGES = [
  {
    label: "The Daily Mastery: Complete all tasks",
    icon: "🎯",
    xp: 100,
    type: "all_tasks",
  },
  {
    label: "Morning Person: Complete all morning tasks",
    icon: "🌅",
    xp: 50,
    type: "morning_all",
  },
  {
    label: "Night Owl: Complete all evening tasks",
    icon: "🦉",
    xp: 50,
    type: "evening_all",
  },
  {
    label: "Grinder: Complete 8 tasks today",
    icon: "⚔️",
    xp: 75,
    type: "total_8",
  },
  {
    label: "Hard Worker: Complete 2 Hard tasks",
    icon: "🔥",
    xp: 80,
    type: "hard_2",
  },
];

export const QUOTES = [
  "Small steps every day lead to big changes. 🌱",
  "Discipline is choosing between what you want now and what you want most. 💪",
  "The secret of getting ahead is getting started. 🚀",
  "You don't have to be great to start, but you have to start to be great. ⭐",
  "Consistency is the key to achievement. 🔑",
  "Every task you complete is a vote for who you want to become. 🗳️",
  "Success is the sum of small efforts repeated day in and day out. 🏆",
  "Your future self is watching. Make them proud. 👀",
];

export const THEMES = {
  light: {
    bg: "bg-gray-50",
    card: "bg-white",
    inner: "bg-gray-100",
    border: "border-gray-200",
    text: "text-gray-900",
    sub: "text-gray-500",
    name: "Light",
  },
  dark: {
    bg: "bg-gray-950",
    card: "bg-gray-900",
    inner: "bg-gray-800",
    border: "border-gray-700",
    text: "text-white",
    sub: "text-gray-400",
    name: "Dark",
  },
  forest: {
    bg: "bg-green-950",
    card: "bg-green-900",
    inner: "bg-green-800",
    border: "border-green-700",
    text: "text-white",
    sub: "text-green-300",
    name: "Forest",
  },
  ocean: {
    bg: "bg-blue-950",
    card: "bg-blue-900",
    inner: "bg-blue-800",
    border: "border-blue-700",
    text: "text-white",
    sub: "text-blue-300",
    name: "Ocean",
  },
  space: {
    bg: "bg-indigo-950",
    card: "bg-indigo-900",
    inner: "bg-indigo-800",
    border: "border-indigo-700",
    text: "text-white",
    sub: "text-indigo-300",
    name: "Space",
  },
  purple: {
    bg: "bg-purple-950",
    card: "bg-purple-900",
    inner: "bg-purple-800",
    border: "border-purple-700",
    text: "text-white",
    sub: "text-purple-300",
    name: "Purple",
  },
};

export const CATEGORY_GRAD = {
  morning: "from-orange-500 to-yellow-400",
  afternoon: "from-blue-500 to-cyan-400",
  evening: "from-purple-600 to-indigo-500",
};
export const CATEGORY_BG = {
  morning: "bg-orange-900/20 border-orange-500/30",
  afternoon: "bg-blue-900/20 border-blue-500/30",
  evening: "bg-purple-900/20 border-purple-500/30",
};

export function getLevelInfo(xp) {
  let cur = LEVELS[0],
    nxt = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      cur = LEVELS[i];
      nxt = LEVELS[i + 1] || null;
      break;
    }
  }
  return { cur, nxt };
}
export function xpPct(xp) {
  const { cur, nxt } = getLevelInfo(xp);
  if (!nxt) return 100;
  return Math.round(((xp - cur.minXP) / (nxt.minXP - cur.minXP)) * 100);
}
export function todayKey() {
  return new Date().toDateString();
}
export function getTodayIndex() {
  return new Date().getDay();
}
export function isTaskForDay(task, dayIdx) {
  if (!task.days) return true;
  return task.days.includes(dayIdx);
}
export function weekDays() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toDateString());
  }
  return days;
}
