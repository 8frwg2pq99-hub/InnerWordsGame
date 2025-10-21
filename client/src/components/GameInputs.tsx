import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GameInputsProps {
  newWord: string;
  onNewWordChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function GameInputs({
  newWord,
  onNewWordChange,
  onSubmit,
  disabled = false,
}: GameInputsProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex-1">
        <Label htmlFor="newWord" className="block text-sm font-medium text-foreground mb-2">
          Your New Word
        </Label>
        <Input
          id="newWord"
          data-testid="input-new-word"
          placeholder="e.g. ARIA, ORDAIN, ORDINANCE"
          maxLength={40}
          value={newWord}
          onChange={(e) => onNewWordChange(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="text-xl font-semibold text-center uppercase tracking-wide py-3 border-2"
        />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={onSubmit}
          disabled={disabled}
          data-testid="button-submit"
          size="lg"
          className="px-12"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
