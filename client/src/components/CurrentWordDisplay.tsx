interface CurrentWordDisplayProps {
  word: string;
}

export default function CurrentWordDisplay({ word }: CurrentWordDisplayProps) {
  return (
    <div
      className="
        bg-white text-black border-2 border-border rounded-lg shadow-sm
        flex items-center justify-center text-center
        mx-auto my-6 px-4 py-6
        max-w-[90vw] sm:max-w-[640px]
        overflow-hidden
      "
      style={{
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
      data-testid="text-current-word"
    >
      <h1
        className="
          font-extrabold tracking-[0.1em]
          text-[clamp(22px,8vw,48px)]
          leading-tight
          m-0
        "
      >
        {word}
      </h1>
    </div>
  );
}
