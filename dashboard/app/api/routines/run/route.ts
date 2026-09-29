import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

const REPO_ROOT = path.resolve(process.cwd(), '..')
const TMP_DIR = path.join(REPO_ROOT, 'tmp')

function lockFile(prefix: string) {
  return path.join(TMP_DIR, `running-${prefix}.lock`)
}

function isProcessAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true } catch { return false }
}

function readLock(file: string): { pid?: number; startedAt?: string; prefix?: string } | null {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')) } catch { return null }
}

function isLockAlive(file: string): boolean {
  if (!fs.existsSync(file)) return false
  const data = readLock(file)
  if (!data?.pid) return true  // 구버전 lock (PID 없음) — 존재하면 running으로 간주
  if (!isProcessAlive(data.pid)) {
    fs.unlinkSync(file)  // 프로세스 죽었으면 stale lock 자동 제거
    return false
  }
  return true
}

export async function GET(req: NextRequest) {
  const prefix = req.nextUrl.searchParams.get('prefix') ?? ''
  const file = lockFile(prefix)
  if (!isLockAlive(file)) return NextResponse.json({ running: false })
  const data = readLock(file)
  return NextResponse.json({ running: true, ...(data ?? {}) })
}

export async function POST(req: NextRequest) {
  const { prefix = 'weekly' } = await req.json().catch(() => ({}))
  const file = lockFile(prefix)

  if (isLockAlive(file)) {
    return NextResponse.json({ success: false, message: '이미 실행 중입니다' }, { status: 409 })
  }

  fs.mkdirSync(TMP_DIR, { recursive: true })

  const child = spawn('./wiki-update.sh', [prefix], {
    cwd: REPO_ROOT,
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
    env: { ...process.env },
  })

  fs.writeFileSync(file, JSON.stringify({ startedAt: new Date().toISOString(), prefix, pid: child.pid }))

  child.on('close', () => { try { fs.unlinkSync(file) } catch { /* already gone */ } })
  child.on('error', () => { try { fs.unlinkSync(file) } catch { /* already gone */ } })
  child.unref()

  return NextResponse.json({ success: true, message: '루틴 실행을 시작했습니다', pid: child.pid })
}
