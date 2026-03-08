import { useAppContext } from "../context/AppContext";
import ChallengesTab from "../components/ChallengesTab";

export default function ChallengesPage() {
  const { daily } = useAppContext();

  return (
    <div className="animate-in fade-in duration-300">
      <ChallengesTab daily={daily} />
    </div>
  );
}
