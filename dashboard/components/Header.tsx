'use client'
import { useEffect, useState } from 'react'

interface Props {
  syncing: boolean
  syncMsg: string | null
  lastSyncedAt: string | null
  onSync: () => void
}

function useKstClock(): string {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Header({ syncing, syncMsg, lastSyncedAt, onSync }: Props) {
  const clock = useKstClock()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#080b10]/92 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex w-full max-w-[1680px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-sm font-bold text-emerald-200">
            SF
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight text-white">SFOOD AI 오피스</p>
            <p className="hidden text-xs text-slate-500 sm:block">AI 직원들이 실시간으로 위키를 운영합니다</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 font-mono text-xs tabular-nums text-slate-400 sm:inline" suppressHydrationWarning>
            KST {clock}
          </span>
          {lastSyncedAt && (
            <span className="hidden rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-500 lg:inline">
              조회:{' '}
              {new Date(lastSyncedAt).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          <button
            onClick={onSync}
            disabled={syncing}
            className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {syncing ? '동기화 중...' : '동기화'}
          </button>
        </div>
      </div>

      {syncMsg && (
        <p
          className={`text-center text-xs mt-1 ${
            syncMsg.includes('완료') ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {syncMsg}
        </p>
      )}
    </header>
  )
}
