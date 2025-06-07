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
import { UserCreateModal } from '~/components/user/userCard/createModal';
import { SearchUserDropdown } from '~/components/user/searchUser';

export function UsersPage() {
  const user: UserType = useUserStore((state) => state.currentUser); // Zustand setter
  const getUsers = useUserStore((state) => state.getUsers); // Zustand setter
  const users = useUserStore((state) => state.users); // Zustand setter

  const [createModal, setCreateModal] = useState<boolean>(false);

  const [query, setQuery] = useState('');
  const [selectedDiscordUser, setSelectedDiscordUser] = useState(
    new User({} as UserClassType),
  );
  const [searchedPerson, setSearchedPerson] = useState(
    new User({} as UserClassType),
  );

  const filteredUsers =
    query === ''
      ? users
      : users.filter((person) => {
          const q = query.toLowerCase();
          return (
            person.username?.toLowerCase().includes(q) ||
            person.nickname?.toLowerCase().includes(q)
          );
        });

  const handleSearchUserSelect = (user: User) => {
    setSearchedPerson(new User(user));
  };

  useEffect(() => {
    if (!users || users.length === 0) {
      getUsers();
    }
  }, []);

  useEffect(() => {
    console.log(`UsersPage: users updated`);
  }, [users]);
  if (!user || !user.is_staff)
    return (
      <div className="flex justify-center h-full content-center mb-0 mt-0 p-0">
        <div className="justify-self-center content-center align-middle">
          <span> You are not authorized to view this page</span>
        </div>
      </div>
    );

  return (
    <>
      <div className="flex flex-col items-start p-4 h-full  ">
        <div
          className="grid grid-flow-row-dense grid-auto-rows
        align-middle content-center justify-center
       grid-cols-4
         w-full "
        >
          <div className="flex">
            <SearchUserDropdown
              users={users}
              query={query}
              setQuery={setQuery}
            />
          </div>
          <div className="flex col-start-4 align-end content-end justify-end">
            <UserCreateModal />
          </div>
        </div>
        <div
          className="grid grid-flow-row-dense grid-auto-rows
        align-middle content-center justify-center
         grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
         mb-0 mt-0 p-0 bg-base-900  w-full"
        >
          {filteredUsers?.map((u: UserType) => (
            <div className="grid" key={`div-${u.pk}`}>
              <UserCard
                user={u as UserClassType}
                saveFunc={'save'}
                key={`UserCard-${u.pk}`}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
