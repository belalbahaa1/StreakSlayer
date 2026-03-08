import { useAppContext } from "../context/AppContext";
import StatsTab from "../components/StatsTab";
import { weekDays } from "../Data";

export default function StatsPage() {
  const { th, stats, today, todaysTasks } = useAppContext();

  const completed = todaysTasks.filter((t) => t.done).length;
  const total = todaysTasks.length;

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

  return (
    <div className="animate-in fade-in duration-300">
      <StatsTab
        th={th}
        weekScores={weekScores}
        total={total}
        weekGrade={weekGrade}
        weekAvg={weekAvg}
        stats={stats}
      />
    </div>
  );
}
