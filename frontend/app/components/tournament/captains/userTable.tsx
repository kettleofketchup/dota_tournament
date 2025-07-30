import type { TeamType } from '~/components/tournament/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { PositionEnum } from '~/components/user';
import type { UserType } from '~/components/user/types';
interface TournamentUsersTable {
  chooseCaptain: boolean;
}
import { useUserStore } from '~/store/userStore';

export const TournamentUsersTable: React.FC<TournamentUsersTable> = ({ chooseCaptain=false }) => {
  const tournament = useUserStore((state) => state.tournament);

  const members = () => tournament.members?.sort((a, b) => {
    if (!a.mmr && !b.mmr) return 0;
    if (!a.mmr) return 1; // Treat undefined MMR as lower
    if (!b.mmr) return -1; // Treat undefined MMR as lower
    if (a.mmr >= b.mmr) return -1;

    if (a.mmr < b.mmr) return 1;
  });
  const isTeamCaptain = (user: UserType) => {
    if (!user) return false;
    
    if (user in tournament.captains) {
      return true;
    }
  };
  if (Tournament.)
  return (
    <Table>
      <TableCaption>Tournament Users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>MMR</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Captain</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {team.members?.map((user: UserType, idx: number) => (
          <TableRow key={`TeamTableRow-${user.pk}`}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="avatar w-8 h-8">
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="rounded-full"
                  />
                </span>
                <span>{user.nickname || user.username}</span>
              </div>
            </TableCell>
            <TableCell>{user.mmr ?? 'N/A'}</TableCell>
            <TableCell>{user.positions ? positions(user) : 'N/A'}</TableCell>

            <TableCell>{user.isCaptain ? 'Yes' : 'No'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
