import type {
  UserType,
  GuildMember,
  GuildMembers,
  UserClassType,
} from './types';
import axios from '~/components/api/axios';
import {
  createUser,
  deleteUser,
  fetchUser,
  updateUser,
} from '~/components/api/api';
import { useUserStore } from '~/store/userStore';

export class User implements UserClassType {
  username!: string;
  avatarUrl!: string;
  is_staff!: boolean;
  is_superuser!: boolean;
  nickname?: string | null;
  mmr?: number;
  position?: string;
  steamid?: number;
  avatar?: string;
  pk?: number;
  discordNickname?: string | null;
  discordId?: string;
  guildNickname?: string | null;

  constructor(data: UserType) {
    Object.assign(this, data);
  }

  async dbFetch(): Promise<void> {
    if (!this.pk) {
      throw new Error('User primary key (pk) is not set.');
    }
    try {
      const data = await fetchUser(this.pk);
      Object.assign(this, data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async dbUpdate(data: Partial<UserType>): Promise<void> {
    if (!this.pk) {
      throw new Error('User primary key (pk) is not set.');
    }

    try {
      const updatedData = await updateUser(this.pk, data);
      Object.assign(this, updatedData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  async dbDelete(): Promise<void> {
    if (!this.pk) {
      throw new Error('User primary key (pk) is not set.');
    }
    try {
      await deleteUser(this.pk);
      Object.assign({});
      const delUser = useUserStore((state) => state.delUser); // Zustand setter

      delUser(this as UserType);
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
  async dbCreate(): Promise<void> {
    try {
      await createUser(this as UserType);

    } catch (error) {
      console.error('Error creating user data:', error);
      throw error;
    }
  }
  // Mutates the current instance with values from a GuildMember
  setFromGuildMember(member: GuildMember): void {
    if (!member.user) {
      throw new Error('Guild member is missing user info.');
    }

    if (!this.nickname) {
      this.nickname = member.nick ?? member.user.global_name ?? null;
    }
    this.discordId = member.user.id;
    this.username = member.user.username;
    this.avatar = member.user.avatar ?? undefined;
    this.discordNickname = member.user.global_name ?? null;
    this.guildNickname = member.nick ?? null;
    this.avatarUrl = this.getAvatarUrl();
  }
  getAvatarUrl(): string {
    if (!this.avatar) {
      throw new Error('Avatar is not set.');
    }
    return `https://cdn.discordapp.com/avatars/${this.discordId}/${this.avatar}.png`;
  }
}
