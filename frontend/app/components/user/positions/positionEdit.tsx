import React, { useEffect, useState } from 'react';
import type { UserClassType, UserType } from '~/components/user/types';

import { User } from '~/components/user';

import { useUserStore } from '~/store/userStore';

import { UserRoundPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DialogClose } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { getLogger } from '~/lib/logger';
const log = getLogger('Position Edit');



export const positionChoices = () => {
  return (
    <SelectContent>
      <SelectItem value="0">0: Don't show this role </SelectItem>
      <SelectItem value="1">1: Favorite</SelectItem>
      <SelectItem value="2">2: Can play</SelectItem>
      <SelectItem value="3">3: If the team needs</SelectItem>
      <SelectItem value="4">4: I would rather not but I guess</SelectItem>
      <SelectItem value="5">5: Least Favorite </SelectItem>
    </SelectContent>
  );
};
