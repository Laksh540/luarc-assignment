import { Search, X } from "lucide-react";
import { useRef } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  isSearching = false,
  placeholder = "Search assets…",
  id = "asset-search",
  className = "",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search assets
      </label>
      <div className="relative" aria-busy={isSearching}>
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
          <Search className="h-5 w-5 shrink-0" aria-hidden="true" />
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="searchbox"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          aria-busy={isSearching}
          className={`min-h-[44px] w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 text-base text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 ${value.length > 0 ? "pr-11" : "pr-4"}`}
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex h-full min-w-[44px] items-center justify-center text-slate-400 transition-colors hover:text-slate-200"
          >
            <X className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={2} />
          </button>
        ) : null}
      </div>
      {isSearching ? (
        <p className="sr-only" aria-live="polite">
          Searching&hellip;
        </p>
      ) : null}
    </div>
  );
}
