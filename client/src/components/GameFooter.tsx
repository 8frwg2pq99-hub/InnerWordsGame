import { Button } from '@/components/ui/button';

interface GameFooterProps {
  onReset: () => void;
  onEndRun: () => void;
  isGameActive: boolean;
}

export default function GameFooter({ onReset, onEndRun, isGameActive }: GameFooterProps) {
  return (
    <div className="flex flex-row justify-center items-center gap-3 mt-6">
      <Button 
        variant="outline" 
        onClick={onReset}
        data-testid="button-reset"
        size="sm"
      >
        Reset
      </Button>
      {isGameActive && (
        <Button 
          variant="destructive" 
          onClick={onEndRun}
          data-testid="button-end-run"
          size="sm"
        >
          End Game
        </Button>
      )}
    </div>
  );
}
