import React, { useState, useEffect, useCallback } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { get_dtx_members } from '../api/api';
import type { GuildMembers, GuildMember, UsersType } from '../user/types';
import { useUserStore } from '../../store/userStore';

interface Props {
  onSelect: (user: GuildMember) => void;
  discrimUsers?: UsersType;
}

const DiscordUserDropdown: React.FC<Props> = ({ onSelect, discrimUsers }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const setDiscordUsers = useUserStore((state) => state.setDiscordUsers); // Zustand setter
  const discordUsers = useUserStore((state) => state.discordUsers); // Zustand setter
  const discordUser = useUserStore((state) => state.selectedDiscordUser); // Zustand setter

  const getDiscordUsers = useCallback(async () => {
    try {
      console.log('User fetching');
      get_dtx_members()
        .then((response) => {
          setDiscordUsers(response);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);

          setDiscordUsers([] as GuildMembers);
        });
    } catch (err) {
      setDiscordUsers([] as GuildMembers);
    } finally {
    }
  }, []);
  useEffect(() => {
    console.log('test');
    getDiscordUsers();
    console.log(discordUsers);
  }, []);

  const filteredUsers =
    query === ''
      ? discordUsers
      : discordUsers.filter((person: GuildMember) => {
          return person.user.username
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  // Remove users that have a discordId in discrimUsers
  const filteredWithoutDiscrim: GuildMember[] = discrimUsers
    ? filteredUsers.filter(
        (user: GuildMember) =>
          !discrimUsers.some((du) => du?.discordId === user.user.id),
      )
    : filteredUsers;

  return (
    <div className="w-full max-w-md">
      <Combobox value={discordUser} onChange={onSelect}>
        <ComboboxInput
          className="input input-bordered w-full"
          placeholder="Search DTX members..."
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
        <ComboboxOptions className="border bg-base-100 shadow-lg rounded-lg max-h-60 overflow-y-auto mt-2">
          {filteredWithoutDiscrim &&
          filteredWithoutDiscrim.length > 0 &&
          filteredWithoutDiscrim.length < 100 ? (
            filteredWithoutDiscrim.map((user) => (
              <ComboboxOption
                key={user.user.id}
                value={user}
                className={({ active }) =>
                  `cursor-pointer select-none p-2 ${
                    active ? 'bg-purple-900 text-primary-content' : ''
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <img
                    src={
                      user.user.avatar
                        ? `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}`
                        : `https://ui-avatars.com/api/?rounded=True?name=${user.user.username}`
                    }
                    alt={user.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.user.username}</span>
                </div>
              </ComboboxOption>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">
              No users or too many users found
            </div>
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

export default DiscordUserDropdown;
