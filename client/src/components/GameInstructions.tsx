import React from "react";

export function InstructionsBody() {
  return (
    <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
      <p>
        Pick a <strong>continuous sequence</strong> of at least two letters from the
        word above. Build it into a new word by adding letters only to the{" "}
        <em>start</em> and/or <em>end</em> — never the middle.
      </p>

      <p>
        If your sequence touches the first or last letter of the original word, you’ll score{" "}
        <strong>1 point per letter</strong> ⭐. If it’s hidden entirely within — a true{" "}
        <strong>InnerWord</strong> — you’ll earn <strong>2 points per letter</strong> instead 💎.
      </p>

      <p>
        You’ll also gain <strong>1 bonus point</strong> for every extra letter your new word adds
        compared to the last one 📈.
      </p>

      <p className="font-semibold">
        You’ve got 60 seconds. How high can you score? ⏱️
      </p>
    </div>
  );
}

export default function GameInstructions() {
  return null;
}
