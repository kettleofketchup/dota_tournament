import { Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';
import { getLogger } from '~/lib/logger';
import { useUserStore } from '~/store/userStore';

const log = getLogger('deleteButtonTourn');

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'; // Adjust path as needed

import { deleteTournament } from '~/components/api/api';
import type { TournamentType } from '../types';

interface PropsRemoveButton {
  tournament: TournamentType;
  disabled?: boolean;
}

export const TournamentRemoveButton: React.FC<PropsRemoveButton> = ({
  tournament,
  disabled,
}) => {
  const delTournamentStore = useUserStore(
    useShallow((state) => state.delTournament),
  );

  const handleChange = () => {
    if (!tournament || !tournament.pk) {
      log.error('Tournament not found or not set');
      return;
    }

    toast.promise(deleteTournament(tournament.pk), {
      loading: `Deleting Tournament ${tournament.pk}.`,
      success: (data) => {
        log.debug('Tournament deleted successfully');
        delTournamentStore(tournament);
        return `${tournament.pk} has been deleted`;
      },
      error: (err) => {
        log.error('Failed to delete tournament', err);
        return `${tournament.pk} could not be deleted`;
      },
    });
  };
  // Find all users not already in the tournament
  const deleteConfirmation = () => {
    return (
      <div className="flex flex-row items-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              aria-label="Delete"
              className="bg-red-950 hover:bg-red-600 text-white"
            >
              <Trash2 className="h-4 w-4" color="red" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className={`bg-green-900`}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tournament?</AlertDialogTitle>
              <AlertDialogDescription className="text-base-700">
                This removes tournament {tournament.pk}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleChange}>
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{deleteConfirmation()}</TooltipTrigger>
        <TooltipContent>
          <p>Delete tournament</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
