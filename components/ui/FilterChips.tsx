// Row of "All / <category> / ..." filter buttons. An empty `selected` means All.
export function FilterChips({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (value: string) => void }) {

  const chip = (value: string, label: string) => (
    <button
      key={label}
      onClick={() => onSelect(value)}
      aria-pressed={selected === value}
      className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors ${selected === value
        ? 'bg-blue-600 text-white'
        : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
      {chip('', 'All')}
      {options.map(option => chip(option, option))}
    </div>
  )
}
