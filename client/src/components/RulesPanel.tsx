import { useEffect, useState } from "react";

export default function RulesPanel() {
  // Closed on mobile by default; open on desktop (md+) by default
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      setOpen(true);
    }
  }, []);

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className="
        bg-white text-black border border-border rounded-lg shadow-sm
        mx-auto my-4 w-full max-w-[90vw] sm:max-w-[640px]
        overflow-hidden
      "
    >
      <summary
        className="
          list-none cursor-pointer select-none
          px-4 py-3 sm:py-3.5
          flex items-center justify-between gap-3
          text-[15px] sm:text-base font-semibold tracking-wide
        "
      >
        <span>Rules</span>
        <span
          className={`
            inline-block transition-transform duration-200
            ${open ? "rotate-180" : "rotate-0"}
          `}
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>

      <div className="px-4 pb-4 pt-1 text-sm leading-relaxed opacity-90">
        <p className="mb-2">
          Pick a <strong>continuous sequence</strong> of at least two letters from the current word.
          Build a new word by adding letters only to the <strong>start and/or end</strong> — never inside.
        </p>
        <ul className="list-disc pl-5 space-y-1 mb-2">
          <li>
            <strong>Inner sequence</strong> (doesn’t touch first/last letter): <strong>2 pts per letter</strong>.
          </li>
          <li>
            <strong>Edge sequence</strong> (touches first or last letter): <strong>1 pt per letter</strong>.
          </li>
          <li>
            <strong>Length bonus:</strong> +1 for every letter your new word adds compared to the last.
          </li>
        </ul>
        <p className="mb-0">
          You’ve got <strong>90 seconds</strong>. How high can you score?
        </p>
      </div>
    </details>
  );
}
