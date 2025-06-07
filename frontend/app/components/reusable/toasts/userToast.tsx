'use client';

import { toast } from 'sonner';
import { UserRoundPlusIcon } from 'lucide-react';
export const UserToast = (title: string) => {
  const toastTitle = () => {
    return (
      <div>
        <UserRoundPlusIcon className="mr-2 h-4 w-4 inline-block" />
        <span className="font-semibold">{title}</span>
      </div>
    );
  };
  toast(toastTitle(), {
    description: 'Sunday, December 03, 2023 at 9:00 AM',
  });
};
