import { ChevronRight, Trophy } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { Badge } from '~/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import type { LeagueType } from './schemas';

interface LeaguePopoverProps {
  league: LeagueType;
  children: React.ReactNode;
}

export function LeaguePopover({ league, children }: LeaguePopoverProps) {
  const [open, setOpen] = useState(false);

  const handleMouseEnter = useCallback(() => setOpen(true), []);
  const handleMouseLeave = useCallback(() => setOpen(false), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <h4 className="font-semibold">{league.name}</h4>
            </div>
            <Badge variant="secondary">#{league.steam_league_id}</Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {league.tournament_count} tournaments
          </p>

          {league.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {league.description}
            </p>
          )}

          <Link
            to={`/leagues/${league.pk}`}
            className="flex items-center justify-between text-sm text-primary hover:underline"
          >
            View League
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
