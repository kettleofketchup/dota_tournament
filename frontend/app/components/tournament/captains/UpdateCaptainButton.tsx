import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { updateTournament } from '~/components/api/api';
import { Button } from '~/components/ui/button';
import type { TournamentType, UserType } from '~/index';
import { getLogger } from '~/lib/logger';
import { useUserStore } from '~/store/userStore';

const log = getLogger('updateCaptainButton');

export const UpdateCaptainButton: React.FC<{ user: UserType }> = ({ user }) => {
  const tournament = useUserStore((state) => state.tournament);
  const determineIsCaptain = () => {
    return !!tournament?.captains?.some((c) => c.pk === user.pk);
  };
  const [isCaptain, setIsCaptain] = useState<boolean>(determineIsCaptain());
  const setTournament = useUserStore((state) => state.setTournament);

  const updateCaptain = async () => {
    var setIsAdding = true;

    if (!tournament) {
      log.error('Creating tournamentNo tournament found');
      return;
    }
    if (!user || !user.pk) {
      log.error('No user found to update captain');
      return;
    }
    if (!tournament.pk) {
      log.error('No tournament primary key found');
      return;
    }
    const getCaptainIds = () => {
      return tournament.captains?.map((c) => c.pk) || [];
    };
    var newTournament: Partial<TournamentType> = {
      pk: tournament.pk,
      captain_ids: [...getCaptainIds(), user.pk],
    };

    if (isCaptain) {
      log.debug(`${user.username} is already a captain, removing instead`);
      newTournament.captain_ids = (newTournament.captain_ids ?? []).filter(
        (id) => id !== user.pk,
      );
    }
    var msg = isCaptain ? 'Removing' : 'adding';
    log.debug(`${msg} captain for user: ${user.username}`, newTournament);
    toast.promise(updateTournament(tournament.pk, newTournament), {
      loading: `${msg} ${user.username} as captain...`,
      success: (data) => {
        setTournament(data);
        setIsCaptain(!isCaptain);
        return `${tournament?.name} has been updated successfully!`;
      },
      error: (err) => {
        const val = err.response.data;
        log.error('Failed to update captains tournament', err);
        return `Failed to update captains: ${val}`;
      },
    });
  };

  const msg = () => (isCaptain ? `Remove` : `Add`);

  const getButtonVariant = () => `${isCaptain ? 'destructive' : 'default'}`;

  useEffect(() => {
    setIsCaptain(determineIsCaptain());
  }, [tournament.captains, isCaptain]);

  return (
    <Button onClick={updateCaptain} variant={getButtonVariant()}>
      {msg()} Captain
    </Button>
  );
};
