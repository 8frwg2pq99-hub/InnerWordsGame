import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  isActive: boolean;
  onTimeUp: () => void;
  duration?: number; // in seconds, default 120 (2 minutes)
}

export default function GameTimer({ isActive, onTimeUp, duration = 120 }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, duration]);

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      onTimeUp();
    }
  }, [timeLeft, isActive, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 30 && timeLeft > 0;
  const isTimeUp = timeLeft === 0;

  if (!isActive && timeLeft === duration) {
    return null; // Don't show timer before game starts
  }

  return (
    <div 
      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-mono text-2xl font-bold transition-colors ${
        isTimeUp 
          ? 'bg-destructive/10 border-destructive text-destructive' 
          : isLowTime 
          ? 'bg-game-edge-sequence/10 border-game-edge-sequence text-game-edge-sequence-foreground animate-pulse'
          : 'bg-card border-card-border'
      }`}
      data-testid="game-timer"
    >
      <Clock className="w-6 h-6" />
      <span>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
