import { Suspense, useEffect, useState } from 'react';
import { TeamTable } from '~/components/team/teamTable/teamTable';
import type { DraftRoundType } from '~/index';
import { getLogger } from '~/lib/logger';
import { Spinner } from '../helpers/spinner';
import { useUserStore } from '~/store/userStore';
const log = getLogger('CurrentTeamView');
interface CurrentTeamViewProps {
}
export const CurrentTeamView: React.FC<CurrentTeamViewProps> = ({
}) => {
  const curRound: DraftRoundType = useUserStore((state) => state.curDraftRound);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // When curRound.choice changes, set updating to true
    if (curRound?.choice === null) {
      setUpdating(false);
      return;
    }

    setUpdating(true);

    // After a short delay, set it back to false to show the new table
    const timer = setTimeout(() => {
      setUpdating(false);
    }, 500); // 500ms delay

    // Cleanup the timer if the component unmounts or the effect re-runs
    return () => clearTimeout(timer);
  }, [curRound?.choice, curRound?.pk]);


  return (
    <Suspense fallback={<Spinner />}>
      <TeamTable team={curRound?.team} />
    </Suspense>
  );
};
