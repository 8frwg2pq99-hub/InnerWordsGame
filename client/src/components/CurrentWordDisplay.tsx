interface CurrentWordDisplayProps {
  word: string;
}

export default function CurrentWordDisplay({ word }: CurrentWordDisplayProps) {
  return (
    <div 
      className="text-6xl font-extrabold tracking-[0.15em] text-center py-8 px-4 rounded-lg bg-white border-2 border-border mb-6 shadow-sm text-black"
      data-testid="text-current-word"
    >
      {word}
    </div>
  );
}
