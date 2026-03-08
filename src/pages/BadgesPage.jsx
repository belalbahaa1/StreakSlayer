import { useAppContext } from "../context/AppContext";
import BadgesTab from "../components/BadgesTab";

export default function BadgesPage() {
  const { th, stats } = useAppContext();

  return (
    <div className="animate-in fade-in duration-300">
      <BadgesTab th={th} stats={stats} />
    </div>
  );
}
