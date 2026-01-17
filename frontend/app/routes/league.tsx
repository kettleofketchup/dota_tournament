import { Trophy } from 'lucide-react';
import { useParams } from 'react-router';
import { Badge } from '~/components/ui/badge';
import { useLeague } from '~/components/league';

export default function LeagueDetailPage() {
  const { leagueId } = useParams();
  const pk = leagueId ? parseInt(leagueId, 10) : undefined;
  const { league, isLoading, error } = useLeague(pk);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">Loading league...</div>
    );
  }

  if (error || !league) {
    return (
      <div className="container mx-auto p-4 text-center">League not found</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Trophy className="w-12 h-12" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{league.name}</h1>
            <Badge variant="secondary">#{league.steam_league_id}</Badge>
          </div>
          <p className="text-muted-foreground">
            {league.organization_name} &middot; {league.tournament_count}{' '}
            tournaments
          </p>
        </div>
      </div>

      {league.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{league.description}</p>
        </div>
      )}

      {league.rules && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Rules</h2>
          <div className="prose prose-sm dark:prose-invert">
            {league.rules}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">Tournaments</h2>
        <p className="text-muted-foreground">
          Tournament list will be filtered here (TODO: integrate with
          TournamentFilterBar)
        </p>
      </div>
    </div>
  );
}
