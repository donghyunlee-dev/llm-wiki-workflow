interface Props {
  deptCount: number
  agentCount: number
}

export default function Footer({ deptCount, agentCount }: Props) {
  return (
    <footer className="border-t border-slate-800/70 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between gap-4 text-xs text-slate-600">
        <span className="text-slate-500">에쓰푸드 IT AX팀</span>
        <span>
          {deptCount}개 팀 · {agentCount}명 재직
        </span>
        <span>v2.0.0</span>
      </div>
    </footer>
  )
}
