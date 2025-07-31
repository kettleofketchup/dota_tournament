import React, { useEffect, useMemo, useState } from 'react';

import type { UserClassType, UserType } from '~/components/user/types';

import { PositionEnum, User } from '~/components/user';

import { useUserStore } from '~/store/userStore';

import { UserRoundPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { DialogClose } from '~/components/ui/dialog';
import { getLogger } from '~/lib/logger';
import { handleSave } from './handleSaveHook';

const log = getLogger('editForm');

interface Props {
  user: UserClassType; // Accepts both UserClassType and UserType
  form: UserType;
  setForm: React.Dispatch<React.SetStateAction<UserType>>;
  setDiscordUser?: React.Dispatch<React.SetStateAction<User>>;
}
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
export const UserEditForm: React.FC<Props> = ({
  user,
  form,
  setForm,
  setDiscordUser,
}) => {
  const currentUser: UserType = useUserStore((state) => state.currentUser); // Zustand setter
  const [errorMessage, setErrorMessage] = useState<
    Partial<Record<keyof UserType, string>>
  >({});

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>('null');
  const setUser = useUserStore((state) => state.setUser); // Zustand setter

  const handleChange = (field: keyof UserClassType, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }) as UserClassType);
  };
  useEffect(() => {
    setForm(user as UserClassType); // Initialize form with user data

    if (
      user.username !== form.username ||
      user.discordId !== form.discordId ||
      user.nickname !== form.nickname
    ) {
      log.debug('User data changed, resetting form');
      setForm(user as UserClassType); // Ensure form is set to the user data
    }
  }, [user, form.discordId, form.username]);

  useEffect(() => {}, [user]);
  if (!currentUser || (!currentUser.is_staff && !currentUser.is_superuser)) {
    return (
      <div className="text-error">
        You do not have permission to edit users.
      </div>
    );
  }

  const inputView = (key: string, label: string, type: string = 'text') => {
    return (
      <div>
        <label className="font-semibold">{label}</label>
        <input
          type={type}
          placeholder={user[key] ?? ''}
          value={form[key] ?? ''}
          onFocus={() => handleChange(key as keyof UserClassType, user[key])}
          onChange={(e) =>
            handleChange(key as keyof UserClassType, e.target.value)
          }
          className={`input input-bordered w-full mt-1 ${errorMessage[key] ? 'input-error' : ''}`}
        />
        {errorMessage[key] && (
          <p className="text-error text-sm mt-1">{errorMessage[key]}</p>
        )}
      </div>
    );
  };

  const title = useMemo(() => {
    var msg = 'Status: ';

    if (statusMsg && statusMsg !== null && statusMsg !== 'null')
      msg = statusMsg;
    else {
      msg += 'Editing ...';
    }
    log.debug('title', msg);

    return msg;
  }, [statusMsg, user.username]);

  return (
    <>
      <div className="font-bold text-center bg-gray-900 rounded-lg p-2 mb-4">
        <label>{title}</label>
      </div>

      {inputView('nickname', 'Nickname: ')}
      {inputView('mmr', 'MMR: ', 'number')}
      {/* Position selection using checkboxes for PositionEnum */}
      <div className="form-control mb-4">
        <label className="label font-semibold">Positions</label>
        <div className="flex flex-row flex-wrap gap-4">
          {[
            { value: PositionEnum.Carry, label: 'Carry' },
            { value: PositionEnum.Mid, label: 'Mid' },
            { value: PositionEnum.Offlane, label: 'Offlane' },
            { value: PositionEnum.SoftSupport, label: 'Soft Support' },
            { value: PositionEnum.HardSupport, label: 'Hard Support' },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={!!form.positions?.[opt.value]}
                onChange={() => {
                  setForm((prev) => {
                    const prevPositions = prev.positions ?? {};
                    const newPositions = {
                      ...prevPositions,
                      [opt.value]: !prevPositions[opt.value],
                    };
                    return { ...prev, positions: newPositions };
                  });
                }}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      {inputView('steamid', 'Steam ID: ', 'number')}
      {/* {inputView('discordId', 'Discord ID: ', 'number')} */}
      {inputView('guildNickname', 'Discord Guild Nickname: ')}
      <div className="flex flex-row items-start gap-4">
        <DialogClose asChild>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSave(e, {
                user,
                form,
                setForm,
                setErrorMessage,
                setIsSaving,
                setStatusMsg,
                setUser,
                setDiscordUser,
              });
            }}
            className="btn btn-primary btn-sm mt-3"
            type="submit"
            disabled={isSaving}
          >
            {user && user.pk && (isSaving ? 'Saving...' : 'Save Changes')}
            {user && !user.pk && (isSaving ? 'Saving...' : 'Create User')}
          </button>
        </DialogClose>
      </div>
    </>
  );
};
