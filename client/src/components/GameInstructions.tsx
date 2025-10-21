export default function GameInstructions() {
  return (
    <div className="text-center text-sm text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed" data-testid="text-instructions">
      Pick a <strong>continuous sequence</strong> of at least two letters from the word above
      Build it into a new word by adding letters only to the <strong><em>start</em></strong> and/or <strong><em>end</em></strong>
      <br /><br />
      If your sequence touches the first or last letter of the original word, score 1 point per letter ⭐
      If it's hidden entirely within — a true <strong>InnerWord</strong> — earn 2 points per letter 💎
      <br /><br />
      Gain 1 bonus point for every extra letter your new word adds compared to the last 📈
      <br /><br />
      You've got 60 seconds. <strong>How high can you score?</strong> ⏱️
    </div>
  );
}
