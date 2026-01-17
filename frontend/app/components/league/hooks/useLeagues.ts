import { useCallback, useEffect } from 'react';
import { useUserStore } from '~/store/userStore';

export function useLeagues(organizationId?: number) {
  const leagues = useUserStore((state) => state.leagues);
  const getLeagues = useUserStore((state) => state.getLeagues);

  const refetch = useCallback(() => {
    getLeagues(organizationId);
  }, [getLeagues, organizationId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Filter to ensure we only show leagues for the current org
  const filteredLeagues = organizationId
    ? leagues.filter((l) => l.organization === organizationId)
    : leagues;

  return {
    leagues: filteredLeagues,
    isLoading: leagues.length === 0,
    refetch,
  };
}
