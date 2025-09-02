import { useEffect } from 'react';
import type { UserClassType } from '~/index';
import { getLogger } from '~/lib/logger';
import { useUserStore } from '~/store/userStore';
import { UserCard } from '../user';
import { DraftTable } from './draftTable';
import type { DraftRoundType } from './types';
const log = getLogger('draftTable');
interface PlayerChoiceViewProps {
  curRound: DraftRoundType;
}
export const PlayerChoiceView: React.FC<PlayerChoiceViewProps> = ({
  curRound,
}) => {
  const tournament = useUserStore((state) => state.tournament);
  const curDraft = useUserStore((state) => state.curDraft);
  useEffect(() => {}, [curRound.choice]);

  if (!curRound || !curRound?.choice) return <DraftTable curRound={curRound} />;

  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold">Current Choice</h3>
      <div className="flex flex-col items-center justify-center">
        <UserCard user={curRound?.choice as UserClassType} compact={true} />
      </div>
    </div>
  );
};
