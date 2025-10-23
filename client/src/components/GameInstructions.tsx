type Props = {
  newWord: string;
  onNewWordChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
};

export default function GameInputs({
  newWord,
  onNewWordChange,
  onSubmit,
  disabled,
  label = "Your Word",
  placeholder = "Type your word",
}: Props) {
  return (
    <div className="mt-4 text-center">
      <label className="block mb-2 text-sm md:text-base font-medium text-foreground">
        {label}
      </label>

      <input
        className="w-full border rounded-md px-3 py-2 text-center tracking-[0.08em] bg-background text-foreground"
        value={newWord}
        onChange={(e) => onNewWordChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />

      <div className="mt-4 flex justify-center">
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:opacity-90 disabled:opacity-50 w-full max-w-[380px]"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
