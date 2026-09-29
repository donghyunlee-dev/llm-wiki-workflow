export type BadgeTone = 'amber' | 'emerald' | 'slate' | 'yellow' | 'sky' | 'red'

const TONE_CLASS: Record<BadgeTone, string> = {
  amber:   'border-amber-400/30 bg-amber-400/10 text-amber-300 animate-pulse',
  emerald: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
  slate:   'border-slate-700 bg-slate-800/70 text-slate-400',
  yellow:  'border-yellow-400/30 bg-yellow-400/10 text-yellow-300',
  sky:     'border-sky-400/25 bg-sky-400/10 text-sky-300',
  red:     'border-red-400/25 bg-red-400/10 text-red-300',
}

export default function StatusBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold ${TONE_CLASS[tone]}`}>
      {label}
    </span>
  )
}
