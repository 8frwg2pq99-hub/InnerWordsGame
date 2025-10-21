import { useQuery } from '@tanstack/react-query';
import { Trophy, Medal, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { LeaderboardEntryWithUser } from '@shared/schema';

interface LeaderboardProps {
  startingWord: string;
}

export default function Leaderboard({ startingWord }: LeaderboardProps) {
  const { data: topScores, isLoading } = useQuery<LeaderboardEntryWithUser[]>({
    queryKey: ['/api/leaderboard/top', { word: startingWord }],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard/top?word=${startingWord}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getRankIcon = (position: number) => {
    if (position === 0) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (position === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (position === 2) return <Award className="w-5 h-5 text-orange-400" />;
    return null;
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      S: 'text-yellow-400',
      A: 'text-green-400',
      B: 'text-blue-400',
      C: 'text-purple-400',
      D: 'text-orange-400',
      E: 'text-gray-400',
    };
    return colors[rank] || 'text-gray-400';
  };

  const getInitials = (firstName: string | null, lastName: string | null, email: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) return firstName[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return '?';
  };

  const getDisplayName = (firstName: string | null, lastName: string | null, email: string | null) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (email) return email.split('@')[0];
    return 'Anonymous';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">Loading leaderboard...</div>
      </div>
    );
  }

  if (!topScores || topScores.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No scores yet. Be the first to submit!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {topScores.map((entry, index) => (
        <div
          key={entry.id}
          className="bg-card border border-border rounded-lg p-4 hover-elevate"
          data-testid={`leaderboard-entry-${index}`}
        >
          <div className="flex items-center gap-4">
            {/* Position */}
            <div className="flex-shrink-0 w-8 text-center">
              {getRankIcon(index) || (
                <span className="text-lg font-bold text-muted-foreground">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Avatar */}
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={entry.user.profileImageUrl || undefined} 
                alt={getDisplayName(entry.user.firstName, entry.user.lastName, entry.user.email)}
                className="object-cover"
              />
              <AvatarFallback>
                {getInitials(entry.user.firstName, entry.user.lastName, entry.user.email)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">
                {getDisplayName(entry.user.firstName, entry.user.lastName, entry.user.email)}
              </div>
              <div className="text-xs text-muted-foreground">
                {entry.turnsCount} turn{entry.turnsCount !== 1 ? 's' : ''}
                {' • '}
                {new Date(entry.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Rank Badge */}
            <div className="flex-shrink-0">
              <div className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                {entry.rank}
              </div>
            </div>

            {/* Score */}
            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-bold text-primary" data-testid={`score-${index}`}>
                {entry.score}
              </div>
              <div className="text-xs text-muted-foreground">points</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
