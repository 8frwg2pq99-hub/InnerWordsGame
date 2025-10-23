export default function GameInstructions() {
  return (
    <div className="text-center text-sm md:text-base opacity-90 leading-relaxed">
      <p className="mb-3">
        Pick a <strong>continuous sequence</strong> of at least two letters from the word above.
        Build it into a new word by adding letters only to the <strong>start</strong> and/or <strong>end</strong>.
      </p>

      <p className="mb-2">
        If your sequence touches the first or last letter of the original word, score
        <strong> 1 point per letter</strong> ⭐
      </p>
      <p className="mb-2">
        If it’s hidden entirely within — a true <strong>InnerWord</strong> — earn
        <strong> 2 points per letter</strong> 💎
      </p>

      <p className="mb-3">
        Gain <strong>1 bonus point</strong> for every extra letter your new word adds compared to the last 📈
      </p>

      <p className="mb-0">
        You’ve got <strong>60 seconds</strong>. <em>How high can you score?</em> ⏱️
      </p>
    </div>
  );
}