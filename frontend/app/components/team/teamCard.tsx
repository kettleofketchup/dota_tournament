import React, { use, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { UserClassType, UserType } from './types';
import axios from '../api/axios';
import { deleteUser } from '../api/api';
import { useNavigate } from 'react-router';
import { useUserStore } from '~/store/userStore';
import { User } from '~/components/user/user';
import { DeleteButton } from '~/components/reusable/deleteButton';
import UserEditModal, { TeamEditModal } from './teamCard/editModal';
interface Props {
  team: TeamType;
  edit?: boolean;
  saveFunc?: string;
  compact?: boolean;
  removeCallBack?: (e: FormEvent, user: UserType) => void;
  removeToolTip?: string;
}
import { Badge } from '~/components/ui/badge';
import type { TeamType } from '~/components/tournament/types';
export const TeamCard: React.FC<Props> = ({
  team,
  edit,
  saveFunc,
  compact,
  removeCallBack,
  removeToolTip = 'Delete the user',
}) => {
  const [editMode, setEditMode] = useState(edit || false);

  const [form, setForm] = useState<UserType>(team ?? ({} as TeamType));
  const currentUser: UserType = useUserStore((state) => state.currentUser); // Zustand setter
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    Partial<Record<keyof UserType, string>>
  >({});

  const delUser = useUserStore((state) => state.delUser); // Zustand setter

  useEffect(() => {
    if (team) {
      console.log(`UserCard: user updated ${team.name}`);
    }
  }, [team]);

  useEffect(() => {
    console.log(`TeamCard: team updated ${team.name}`);
  }, [team]);
  const handleDelete = async (e: FormEvent) => {
    if (removeCallBack !== undefined) {
      removeCallBack(e, team);
      return;
    }
    e.stopPropagation();
    setErrorMessage({}); // clear old errors
    setIsSaving(true);
    try {
      await deleteUser(team?.pk);
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
    console.log(`team updated ${team.name}`);
  }, [team]);

  const teamHeader = () => {
    return (
      <>
        {!editMode && (
          <div className="flex-1">
            <h2 className="card-title text-lg">{team.name}</h2>
          </div>
        )}
      </>
    );
  };
  const showTeamMembers = () => {
    if (!team.members || team.members.length === 0) return <></>;
    return (
      <div className="flex items-center gap-2">
        {team.members.map((member) => (
          <>
            <Badge
              key={member.pk}
              className="badge badge-sm badge-primary"
              title={member.username}
            >
              {member.username}
            </Badge>
            {member.mmr && (
              <Badge
                key={member.pk}
                className="badge badge-sm badge-primary"
                title={member.username}
              >
                {member.mmr}
              </Badge>
            )}
          </>
        ))}
      </div>
    );
  };

  const viewMode = () => {
    if (compact) {
      return <>{team.members && showTeamMembers()}</>;
    }
    return <>{team.members && showTeamMembers()}</>;
  };

  const getKeyName = () => {
    let result = '';
    if (team.pk) {
      result += team.pk.toString();
    }
    if (team.name) {
      result += team.name;
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
          {teamHeader()}
          {(currentUser.is_staff || currentUser.is_superuser) && (
            <TeamEditModal team={team} />
          )}
        </div>
        <div className="mt-2 space-y-2 text-sm">
          {viewMode()}
          <div className="flex flex-col ">
            <div className="flex items-center justify-start gap-6"></div>
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
