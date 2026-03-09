import { useAppContext } from "../context/AppContext";
import SettingsTab from "../components/SettingsTab";

export default function SettingsPage() {
  const {
    th,
    theme,
    setTheme,
    resetAll,
    notificationsEnabled,
    toggleNotifications,
    testNotification,
    simulateReminder,
  } = useAppContext();

  return (
    <div className="animate-in fade-in duration-300">
      <SettingsTab
        th={th}
        theme={theme}
        setTheme={setTheme}
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={toggleNotifications}
        testNotification={testNotification}
        simulateReminder={simulateReminder}
        onReset={() => {
          if (
            window.confirm(
              "Are you sure you want to reset everything? Your progress will be lost forever.",
            )
          ) {
            resetAll();
          }
        }}
      />
    </div>
  );
}
