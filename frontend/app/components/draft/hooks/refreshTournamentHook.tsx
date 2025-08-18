import { toast } from 'sonner';
import { fetchTournament } from '~/components/api/api';
import type { TournamentType } from '~/index';
import { getLogger } from '~/lib/logger';
const log = getLogger('RefreshTournament');

type hookParams = {
  tournament: TournamentType;
  setTournament: (tournament: TournamentType) => void;
};

export const refreshTournamentHook = async ({
  tournament,
  setTournament,
}: hookParams) => {
  log.debug('Initialization draft', { tournament });

  if (!tournament) {
    log.error('Creating tournamentNo tournament found');
    return;
  }

  if (!tournament.pk) {
    log.error('No tournament primary key found');
    return;
  }

  const data = {
    tournament_pk: tournament.pk,
  };

  toast.promise(fetchTournament(tournament.pk), {
    loading: `Refreshing Tournament ...`,
    success: (data) => {
      setTournament(data);
      return `Tournament has been refreshed!`;
    },
    error: (err) => {
      const val = err.response.data;
      log.error('Tournament  has failed to refresh!', err);
      return `Failed to refresh tournament : ${val}`;
    },
  });
};
