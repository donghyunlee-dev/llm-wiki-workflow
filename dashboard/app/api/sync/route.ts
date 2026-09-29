import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import path from 'path'

const REPO_ROOT = path.resolve(process.cwd(), '..')

export async function POST() {
  try {
    execSync('git fetch origin', { cwd: REPO_ROOT, timeout: 30000, stdio: 'pipe' })
    // runs/ 와 wiki-targets.md 만 origin/main 에서 체크아웃 (로컬 변경사항 보존)
    execSync('git checkout origin/main -- runs/', { cwd: REPO_ROOT, timeout: 30000, stdio: 'pipe' })
    try {
      execSync('git checkout origin/main -- skills/confluence-guide-maintainer/wiki-targets.md', { cwd: REPO_ROOT, timeout: 15000, stdio: 'pipe' })
    } catch { /* wiki-targets 없으면 무시 */ }
    return NextResponse.json({ success: true, message: 'Git 동기화 완료' })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { success: false, message: `동기화 실패: ${msg.slice(0, 120)}` },
      { status: 500 }
    )
  }
}
