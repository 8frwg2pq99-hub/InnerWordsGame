import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Award, LogIn, Upload, Medal } from 'lucide-react';
import { type TurnData } from './TurnLogItem';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface LeaderboardEntry {
  id: number;
  userId: string;
  score: number;
  turnsCount: number;
  rank: string;
  createdAt: string;
  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}

interface GameOverSummaryProps {
  score: number;
  turns: TurnData[];
  startingWord: string;
  onPlayAgain: () => void;
}

function getRank(score: number): { grade: string; title: string; color: string } {
  if (score >= 100) return { grade: 'S', title: 'Legendary Wordsmith', color: 'text-yellow-400' };
  if (score >= 90) return { grade: 'A', title: 'Master Linguist', color: 'text-green-400' };
  if (score >= 80) return { grade: 'B', title: 'Skilled Player', color: 'text-blue-400' };
  if (score >= 60) return { grade: 'C', title: 'Word Enthusiast', color: 'text-purple-400' };
  if (score >= 40) return { grade: 'D', title: 'Learning the Ropes', color: 'text-orange-400' };
  return { grade: 'E', title: 'Keep Practicing!', color: 'text-gray-400' };
}

export default function GameOverSummary({ score, turns: turnsList, startingWord, onPlayAgain }: GameOverSummaryProps) {
  const rank = getRank(score);
  const reversedTurns = [...turnsList].reverse();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  // Fetch top 5 leaderboard entries for the current starting word
  const { data: topScores } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard/top', { limit: 5, word: startingWord }],
    queryFn: async () => {
      const response = await fetch(`/api/leaderboard/top?limit=5&word=${startingWord}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
  });

  const submitScoreMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/leaderboard', {
        score,
        turnsCount: turnsList.length,
        startingWord,
        turns: turnsList,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: 'Score Submitted!',
        description: 'Your score has been added to the global leaderboard.',
      });
      queryClient.invalidateQueries({ 
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey[0] === '/api/leaderboard/top'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit score',
        variant: 'destructive',
      });
    },
  });

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleSubmitScore = () => {
    submitScoreMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="bg-card border-2 border-primary rounded-xl p-8 max-w-2xl w-full my-8 shadow-2xl">
        <div className="text-center mb-6">
          <Trophy className="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-2">Time's Up!</h2>
          <p className="text-muted-foreground">Here's how you did</p>
        </div>
        
        {/* Score and Rank */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Final Score</div>
            <div className="text-5xl font-bold text-primary" data-testid="final-score">{score}</div>
          </div>
          
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Rank</div>
            <div className={`text-5xl font-bold ${rank.color}`} data-testid="rank-grade">{rank.grade}</div>
            <div className="text-xs text-muted-foreground mt-1">{rank.title}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-background rounded-lg p-3 border border-border text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Turns</div>
            <div className="text-2xl font-bold" data-testid="total-turns">{turnsList.length}</div>
          </div>
          <div className="bg-background rounded-lg p-3 border border-border text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Avg/Turn</div>
            <div className="text-2xl font-bold" data-testid="avg-score">
              {turnsList.length > 0 ? (score / turnsList.length).toFixed(1) : '0'}
            </div>
          </div>
          <div className="bg-background rounded-lg p-3 border border-border text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Best Move</div>
            <div className="text-2xl font-bold" data-testid="best-move">
              {turnsList.length > 0 ? Math.max(...turnsList.map(t => t.points)) : '0'}
            </div>
          </div>
        </div>

        {/* Top 5 Leaderboard Preview */}
        {topScores && topScores.length > 0 && (
          <div className="bg-background rounded-lg p-4 border border-border mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Medal className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Top 5 Players</h3>
            </div>
            <div className="space-y-2">
              {topScores.map((entry, index) => {
                const playerName = entry.user?.firstName 
                  ? `${entry.user.firstName} ${entry.user.lastName || ''}`.trim()
                  : entry.user?.email?.split('@')[0] || 'Anonymous';
                
                return (
                  <div 
                    key={entry.id}
                    className="flex items-center justify-between p-2 rounded bg-card border border-border hover-elevate"
                    data-testid={`top5-entry-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-300/20 text-gray-300' :
                        index === 2 ? 'bg-orange-400/20 text-orange-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{playerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.turnsCount} turn{entry.turnsCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-bold text-primary">{entry.score}</div>
                        <div className={`text-xs font-semibold ${getRank(entry.score).color}`}>
                          {entry.rank}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Log in to view the full leaderboard and submit your score
            </p>
          </div>
        )}

        {/* Login/Submit Score Section */}
        {!authLoading && (
          <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-6">
            {!isAuthenticated ? (
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">Share Your Score!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Log in to submit your score to the global leaderboard and compete with players worldwide.
                </p>
                <Button 
                  onClick={handleLogin}
                  variant="default"
                  size="lg"
                  className="w-full"
                  data-testid="button-login-prompt"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In to Submit Score
                </Button>
              </div>
            ) : (
              <div className="text-center">
                {!submitted ? (
                  <>
                    <h3 className="font-bold text-lg mb-2">Submit to Leaderboard</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Save this score and see how you rank against other players!
                    </p>
                    <Button 
                      onClick={handleSubmitScore}
                      disabled={submitScoreMutation.isPending}
                      variant="default"
                      size="lg"
                      className="w-full"
                      data-testid="button-submit-score"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {submitScoreMutation.isPending ? 'Submitting...' : 'Submit Score'}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">Score submitted successfully!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Complete Turn Breakdown */}
        <div className="bg-background rounded-lg p-4 border border-border mb-6 max-h-[300px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold">Complete Word Chain</h3>
          </div>
          
          {reversedTurns.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No moves made</p>
          ) : (
            <div className="space-y-2">
              {reversedTurns.map((turn, idx) => (
                <div 
                  key={idx} 
                  className="border border-border rounded-lg p-3 bg-card"
                  data-testid={`summary-turn-${idx}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">
                      <span className="text-muted-foreground">#{idx + 1}</span>
                      {' '}
                      <span className="text-muted-foreground">{turn.from}</span>
                      {' → '}
                      <span className="text-foreground font-bold">{turn.to}</span>
                    </div>
                    <div className="font-bold text-primary">+{turn.points}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sequence: <span className="font-medium text-foreground">"{turn.sequence}"</span>
                    {' • '}
                    {turn.type === 'INNER' ? 'Inner' : 'Edge'}: {turn.sequence.length} × {turn.type === 'INNER' ? '2' : '1'} = {turn.sequencePoints}
                    {turn.lengthBonus > 0 && ` + ${turn.lengthBonus} length bonus`}
                    {' • '}
                    Running total: {turn.totalScore}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rank Explanation */}
        <div className="bg-muted/30 rounded-lg p-3 mb-6 text-xs">
          <div className="font-semibold mb-2 text-muted-foreground">Ranking System:</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
            <div><span className="text-yellow-400 font-bold">S</span> = 100+ points</div>
            <div><span className="text-green-400 font-bold">A</span> = 90-99 points</div>
            <div><span className="text-blue-400 font-bold">B</span> = 80-89 points</div>
            <div><span className="text-purple-400 font-bold">C</span> = 60-79 points</div>
            <div><span className="text-orange-400 font-bold">D</span> = 40-59 points</div>
            <div><span className="text-gray-400 font-bold">E</span> = 0-39 points</div>
          </div>
        </div>

        <Button 
          onClick={onPlayAgain} 
          className="w-full"
          size="lg"
          data-testid="button-play-again"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
      </div>
    </div>
  );
}
