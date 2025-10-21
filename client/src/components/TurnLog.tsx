import TurnLogItem, { type TurnData } from './TurnLogItem';

interface TurnLogProps {
  turns: TurnData[];
}

export default function TurnLog({ turns }: TurnLogProps) {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Turn Log</h3>
      <div className="max-h-[280px] overflow-auto" data-testid="turn-log">
        {turns.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No turns yet. Make your first move!
          </div>
        ) : (
          turns.map((turn, idx) => (
            <TurnLogItem key={idx} turn={turn} />
          ))
        )}
      </div>
    </div>
  );
}
