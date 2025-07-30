import React, { useState } from 'react';
import { Button } from '~/components/ui/button';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { useUserStore } from '~/store/userStore';
import { Badge } from '../ui/badge';
import DraftView from './draftView';

export const DraftModal: React.FC<> = () => {
  const curDraftRound = useUserStore((state) => state.curDraftRound);
  const [open, setOpen] = useState(false);
  const prevRound = () => {
    //TODO
  };
  const nextRound = () => {
    //TODO
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn btn-primary">Create Teams</Button>
      </DialogTrigger>
      <DialogContent className=" xl:min-w-6xl l:min-w-5xl md:min-w-4xl sm:min-w-2xl min-w-l ">
        <DialogHeader>
          <DialogTitle>Tournament Draft</DialogTitle>
          <DialogDescription>Drafting Teams</DialogDescription>
        </DialogHeader>

        <div className="flex flex-row items-center gap-4 mb-4">
          {curDraft}

          <Badge>Round {curDraftRound?.roundNumber ?? 0}</Badge>
          <Badge>Next Round</Badge>
        </div>
        <div className="overflow-y-auto max-h-[70vh] pr-2">
          <DraftView />
        </div>
        <DialogFooter>
          <div className="flex flex-row items-center gap-4 mb-4">
            <Button className="btn btn-info" onClick={prevRound}>
              Prev Round
            </Button>
            <Button className="btn btn-info" onClick={nextRound}>
              Next Round
            </Button>
          </div>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
