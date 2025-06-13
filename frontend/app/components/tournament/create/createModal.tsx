import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  GuildMember,
  UserType,
  UserClassType,
} from '~/components/user/types';
import { UserCard } from '~/components/user/userCard';
import axios from '~/components/api/axios';
import { useUserStore } from '~/store/userStore';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import Footer from '~/components/footer';
import DiscordUserDropdown from '~/components/user/DiscordUserDropdown';
import { User } from '~/components/user/user';
import type { TournamentClassType, TournamentType } from '../types';
import { Button } from '~/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'; // Adjust path as needed
import { TournamentEditForm } from './editForm';

interface Props {}

export const TournamentCreateModal: React.FC<Props> = (props) => {
  const currentUser: UserType = useUserStore((state) => state.currentUser); // Zustand setter
  const users: UserType[] = useUserStore((state) => state.users); // Zustand setter

  const [form, setForm] = useState<TournamentClassType>(
    {} as TournamentClassType,
  );

  if (!currentUser || (!currentUser.is_staff && !currentUser.is_superuser)) {
    return <></>;
  }
  return (
    <Dialog>
      <form>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="default"
                  className={
                    'bg-green-950 hover:bg-green-800 text-white' +
                    ' hover:shadow-sm hover:shadow-green-500/50'
                  }
                >
                  <PlusCircleIcon color="white" className="" />
                  Create Tournament
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new tournament </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Tournament</DialogTitle>
            <DialogDescription>
              Please fill in the details below to create a new tournament.
            </DialogDescription>
          </DialogHeader>

          <TournamentEditForm
            tourn={{} as TournamentClassType}
            form={form}
            setForm={setForm}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default TournamentCreateModal;
