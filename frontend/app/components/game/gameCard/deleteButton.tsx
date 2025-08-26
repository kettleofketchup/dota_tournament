import { Trash2 } from 'lucide-react';
import React from 'react';
import { refreshTournamentHook } from '~/components/draft/hooks/refreshTournamentHook';
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
import { deleteGameHook } from '../hooks/deleteGameHook';
const log = getLogger('deleteButtonGame');

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'; // Adjust path as needed

import { useUserStore } from '~/store/userStore';
import type { GameType } from '../types';

interface PropsRemoveButton {
  game: GameType;
  disabled?: boolean;
}

export const GameRemoveButton: React.FC<PropsRemoveButton> = ({
  game,
  disabled,
}) => {
  const tournament = useUserStore((state) => state.tournament);
  const setTournament = useUserStore((state) => state.setTournament);

  const handleChange = async () => {
    await deleteGameHook({ game });
    await refreshTournamentHook({ tournament, setTournament });
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
              <AlertDialogTitle>Delete Game?</AlertDialogTitle>
              <AlertDialogDescription className="text-base-700">
                This removes the game {game.pk}
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
          <p>Delete Game</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
