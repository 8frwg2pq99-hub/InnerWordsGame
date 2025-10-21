interface GameHeaderProps {
  score: number;
}

export default function GameHeader({ score }: GameHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 mb-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          InnerWords
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">A game of sequences and vocabulary</p>
      </div>
      <div 
        className="bg-card border-2 border-card-border px-5 py-3 rounded-lg text-lg font-bold"
        data-testid="text-score"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Score</span>
        <span className="text-2xl font-bold text-foreground" data-testid="text-score-value">{score}</span>
      </div>
    </header>
  );
}
