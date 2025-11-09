import { memo } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onReset?: () => void
  placeholder?: string
  autoFocus?: boolean
}

function SearchBarComponent({ value, onChange, onReset, placeholder, autoFocus = false }: SearchBarProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 shadow-lg shadow-slate-950/50 backdrop-blur">
      <svg
        className="size-5 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 21l-4.35-4.35" />
        <circle cx="11" cy="11" r="7" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        inputMode="search"
        placeholder={placeholder ?? 'Search products...'}
        className="flex-1 bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
        aria-label="Search products"
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-slate-800 px-3 py-1 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export const SearchBar = memo(SearchBarComponent)

