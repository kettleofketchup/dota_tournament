import React, { use, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { UserClassType, UserType } from './types';
import axios from '../api/axios';
import { deleteUser } from '../api/api';
import { useNavigate } from 'react-router';
import { useUserStore } from '~/store/userStore';
import { User } from '~/components/user/user';
import { DeleteButton } from '~/components/reusable/deleteButton';
import UserEditModal from './userCard/editModal';
interface Props {
  user: UserClassType;
  edit?: boolean;
  saveFunc?: string;
  compact?: boolean;
  removeCallBack?: (e: FormEvent, user: UserType) => void;
  removeToolTip?: string;
}
import { Badge } from '~/components/ui/badge';
export const UserCard: React.FC<Props> = ({
  user,
  edit,
  saveFunc,
  compact,
  removeCallBack,
  removeToolTip = 'Delete the user',
}) => {
  const [editMode, setEditMode] = useState(edit || false);

  const [form, setForm] = useState<UserType>(user ?? ({} as UserType));
  const currentUser: UserType = useUserStore((state) => state.currentUser); // Zustand setter
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    Partial<Record<keyof UserType, string>>
  >({});

  const delUser = useUserStore((state) => state.delUser); // Zustand setter

  useEffect(() => {
    if (user) {
      console.log(`UserCard: user updated ${user.username}`);
    }
  }, [user.mmr]);
  useEffect(() => {
    console.log(`UserCard: user updated ${user.username}`);
  }, [user]);
  const handleDelete = async (e: FormEvent) => {
    if (removeCallBack !== undefined) {
      removeCallBack(e, user);
      return;
    }
    e.stopPropagation();
    setErrorMessage({}); // clear old errors
    setIsSaving(true);
    try {
      await deleteUser(user?.pk);
      console.log('User deleted successfully');
      setError(false);
      setForm({ username: 'Success!' } as UserType);
      delUser(form);
      // Close the modal
      const modalCheckbox = document.getElementById(
        'create_user_modal',
      ) as HTMLInputElement;
      if (modalCheckbox) modalCheckbox.checked = false;
    } catch (err) {
      console.error('Failed to delete user', err);
      setErrorMessage(err.response.data);

      setError(true);
    } finally {
      setIsSaving(false);
    }
  };
  const [saveCallback, setSaveCallBack] = useState(saveFunc || 'save');

  useEffect(() => {
    console.log(`user updated ${user}`);
  }, [user.username, user.nickname, user.mmr, user.position, user.avatar]);

  const avatar = () => {
    return (
      <>
        {user.avatar && (
          <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="w-16 h-16 rounded-full border border-primary"
          />
        )}
      </>
    );
  };

  const userHeader = () => {
    return (
      <>
        {!editMode && (
          <div className="flex-1">
            <h2 className="card-title text-lg">
              {user.nickname || user.username}
            </h2>
            {!compact && (
              <div className="flex gap-2 mt-1">
                {user.is_staff && (
                  <Badge className="bg-blue-700 text-white">Staff</Badge>
                )}
                {user.is_superuser && (
                  <Badge className="bg-red-700 text-white">Admin</Badge>
                )}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  const viewMode = () => {
    if (compact) {
      return (
        <>
          {user.mmr && (
            <div>
              <span className="font-semibold">MMR:</span> {user.mmr}
            </div>
          )}

          {user.position && (
            <div>
              <span className="font-semibold">Position:</span> {user.position}
            </div>
          )}
        </>
      );
    }
    return (
      <>
        {user.nickname && (
          <div>
            <span className="font-semibold">Nickname:</span> {user.nickname}
          </div>
        )}

        {user.mmr && (
          <div>
            <span className="font-semibold">MMR:</span> {user.mmr}
          </div>
        )}

        {user.position && (
          <div>
            <span className="font-semibold">Position:</span> {user.position}
          </div>
        )}
        {user.steamid && (
          <div>
            <span className="font-semibold">Steam ID:</span> {user.steamid}
          </div>
        )}
      </>
    );
  };

  const userDotabuff = () => {
    const goToDotabuff = () => {
      return `https://www.dotabuff.com/players/${user.steamid}`;
    };
    if (!user.steamid) return <></>;
    return (
      <>
        <a className="self-center btn btn-sm btn-outline" href={goToDotabuff()}>
          <span className="flex items-center">
            <img
              src="https://cdn.brandfetch.io/idKrze_WBi/w/96/h/96/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B"
              alt="Dotabuff Logo"
              className="w-4 h-4 mr-2"
            />
            Dotabuff Profile
          </span>
        </a>
      </>
    );
  };
  const getKeyName = () => {
    let result = '';
    if (user.pk) {
      result += user.pk.toString();
    }
    if (user.username) {
      result += user.username;
    }
    return result;
  };
  return (
    <div
      key={`usercard:${getKeyName()} base`}
      className="px-6 py-4 content-center"
    >
      <div
        className="justify-between p-2 h-full card bg-base-200 shadow-md w-full
            max-w-sm hover:bg-violet-900 . focus:outline-2
            hover:shadow-xl/30
            focus:outline-offset-2 focus:outline-violet-500
            focus:outline-offset-2 active:bg-violet-900
            delay-700 duration-900 ease-in-out"
      >
        <div className="flex items-center gap-2 justify-start">
          {avatar()}
          {userHeader()}
          {(currentUser.is_staff || currentUser.is_superuser) && (
            <UserEditModal user={new User(user)} />
          )}
        </div>
        <div className="mt-2 space-y-2 text-sm">
          {viewMode()}
          <div className="flex flex-col ">
            <div className="flex items-center justify-start gap-6">
              {userDotabuff()}
            </div>
            <div className="flex items-center justify-end gap-6">
              {currentUser.is_staff && saveCallback === 'save' && (
                <DeleteButton
                  onClick={handleDelete}
                  tooltipText={removeToolTip}
                  className="self-center btn-sm mt-3"
                  disabled={isSaving}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
