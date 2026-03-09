import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import TasksTab from "../components/TasksTab";

export default function DashboardPage() {
  const { tasks, todayIdx, setTasks, toggleTask, th } = useAppContext();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    label: "",
    time: "08:00",
    category: "morning",
    difficulty: "medium",
  });

  const addTask = () => {
    if (!newTask.label.trim()) return;
    const base = { easy: 15, medium: 35, hard: 50 }[newTask.difficulty];
    setTasks((ts) => [
      ...ts,
      { ...newTask, id: Date.now(), xp: base, done: false },
    ]);
    setNewTask({
      label: "",
      time: "08:00",
      category: "morning",
      difficulty: "medium",
    });
    setShowAdd(false);
  };

  return (
    <div className="animate-in fade-in duration-300">
      <TasksTab
        tasks={tasks}
        todayIdx={todayIdx}
        setTasks={setTasks}
        toggle={toggleTask}
        th={th}
        showAdd={showAdd}
        setShowAdd={setShowAdd}
        newTask={newTask}
        setNewTask={setNewTask}
        addTask={addTask}
      />
    </div>
  );
}
