import type { UserType, UsersType } from '../user/types';
import axios from './axios';
import type { GuildMember, GuildMembers } from '../user/types';
import type {
  GamesTypes,
  GameType,
  TeamsType,
  TeamType,
  TournamentType,
} from '../tournament/types';

export async function fetchCurrentUser(): Promise<UserType> {
  const response = await axios.get<UserType>(`/current_user`);
  return response.data;
}

export async function fetchUsers(): Promise<UsersType> {
  const response = await axios.get<UsersType>(`/users`);
  return response.data;
}

export async function fetchUser(pk: number): Promise<UserType> {
  const response = await axios.get<UserType>(`/users/${pk}`);
  return response.data as UserType;
}
export async function deleteUser(userId: number): Promise<void> {
  await axios.delete(`/users/${userId}/`);
}

export async function createUser(data: Partial<UserType>): Promise<UserType> {
  const response = await axios.post(`/register`, data);
  return response.data as UserType;
}

'use client';


export async function updateUser(
  userId: number,
  data: Partial<UserType>,
): Promise<UserType> {
  const response = await axios.patch<UserType>(`/users/${userId}/`, data);
  return response.data;
}
export async function get_dtx_members(): Promise<GuildMembers> {
  const response = await axios.get<GuildMembers>(`/dtx_members`);
  if ('members' in response.data) {
    console.log(response.data.members);
    return response.data.members as GuildMembers;
  } else {
    throw new Error("Key 'members' not found in response data");
  }
}

export async function getTournaments(): Promise<UsersType> {
  const response = await axios.get<TournamentType>(`/tournaments`);
  return response.data as UsersType;
}

export async function getTeams(): Promise<TeamsType> {
  const response = await axios.get<TeamsType>(`/teams`);
  return response.data as TeamsType;
}

export async function getGames(): Promise<GamesTypes> {
  const response = await axios.get<GamesTypes>(`/games`);
  return response.data;
}

export async function updateTournament(
  pk: number,
  data: Partial<TournamentType>,
): Promise<TournamentType> {
  const response = await axios.patch<TournamentType>(
    `/tournaments/${pk}/`,
    data,
  );
  return response.data;
}

export async function updateGame(
  pk: number,
  data: Partial<GameType>,
): Promise<GameType> {
  const response = await axios.patch<GameType>(`/games/${pk}`, data);
  return response.data;
}

export async function updateTeam(
  pk: number,
  data: Partial<TeamType>,
): Promise<TeamType> {
  const response = await axios.patch<TeamType>(`/teams/${pk}/`, data);
  return response.data;
}
