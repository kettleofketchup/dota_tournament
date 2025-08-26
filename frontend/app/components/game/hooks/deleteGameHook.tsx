import type { JSX } from 'react';
import { toast } from 'sonner';
import { deleteGame } from '~/components/api/api';
import type { GameType } from '~/index';
import { getLogger } from '~/lib/logger';
const log = getLogger('Delete Game Hook');
type hookParams = {
  game: GameType;
};
const createErrorMessage = (
  val: Partial<Record<keyof GameType, string>>,
): JSX.Element => {
  const headerText = () => <h5>Error deleting Game:</h5>;
  if (!val || Object.keys(val).length === 0) return headerText();

  return (
    <div className="text-error">
      {headerText()}
      <ul>
        {Object.entries(val).map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  );
};
export const deleteGameHook = async ({ game }: hookParams) => {
  log.debug('Delete Game', { game });

  if (!game || !game.pk || game.pk === undefined) {
    log.error("game doesn't exist, cant delete", game);
    return;
  }

  toast.promise(deleteGame(game.pk), {
    loading: `Delete Game ...`,
    success: (data) => {
      return `Game has been created!`;
    },
    error: (err) => {
      const val = err.response.data;
      log.error('Game has has failed to be deleted!', err);
      return 'Game has has failed to be deleted!';
    },
  });
};
