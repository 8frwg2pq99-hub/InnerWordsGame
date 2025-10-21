import { Badge } from '@/components/ui/badge';

export interface TurnData {
  from: string;
  to: string;
  sequence: string;
  type: 'INNER' | 'EDGE';
  points: number;
  sequencePoints: number;
  lengthBonus: number;
  totalScore: number;
}

interface TurnLogItemProps {
  turn: TurnData;
}

export default function TurnLogItem({ turn }: TurnLogItemProps) {
  const isInner = turn.type === 'INNER';
  
  return (
    <div 
      className="border border-card-border rounded-lg mb-2 bg-card"
      data-testid={`turn-log-item-${turn.to}`}
    >
      <div className="grid grid-cols-[70px_1fr_110px] gap-3 p-2 text-sm">
        <div className="text-muted-foreground">{turn.from} →</div>
        <div className="truncate">
          <span className="font-medium">{turn.sequence}</span> → {turn.to}
        </div>
        <div className="flex items-center gap-2 justify-end">
          <Badge 
            variant="outline"
            className={isInner 
              ? 'border-game-inner-sequence text-game-inner-sequence-foreground bg-game-inner-sequence/10' 
              : 'border-game-edge-sequence text-game-edge-sequence-foreground bg-game-edge-sequence/10'
            }
            data-testid={`badge-${turn.type.toLowerCase()}`}
          >
            {turn.type}
          </Badge>
          <span className="font-medium">+{turn.points}</span>
        </div>
      </div>
      <div className="px-2 pb-2 text-xs text-muted-foreground">
        {isInner ? 'Inner' : 'Edge'}: {turn.sequence.length} letters × {isInner ? '2' : '1'} = {turn.sequencePoints} pts
        {turn.lengthBonus > 0 && ` + ${turn.lengthBonus} length bonus`}
        {' • '}
        <span className="font-semibold">Total: {turn.totalScore}</span>
      </div>
    </div>
  );
}
