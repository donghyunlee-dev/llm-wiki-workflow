import fs from 'fs'
import path from 'path'
import type { RunReport } from '@/types'

const RUNS_DIR = path.resolve(process.cwd(), '..', 'runs')

const ROUTINE_PREFIX_MAP: Record<string, string> = {
  weekly: 'trig_01E5Ktiv4jfrzVDqv4RKM8qp',
  'wiki-weekly': 'trig_01E5Ktiv4jfrzVDqv4RKM8qp',
  playbook: 'trig_018dn6jkaABXrxrkHpKhcriL',
}

export function getAllRunReports(): RunReport[] {
  if (!fs.existsSync(RUNS_DIR)) return []

  return fs.readdirSync(RUNS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse()
    .map(filename => {
      const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
      const date = match?.[1] ?? ''
      const prefix = match?.[2] ?? ''
      const content = fs.readFileSync(path.join(RUNS_DIR, filename), 'utf-8')
      return {
        date,
        filename,
        content,
        routineId: ROUTINE_PREFIX_MAP[prefix] ?? 'unknown',
      }
    })
}

export function getRunsByPrefix(prefix: string): RunReport[] {
  // `-{prefix}.md` (로컬) 또는 `-{prefix}-*.md` (리모트 파생 파일) 모두 매칭
  return getAllRunReports().filter(r =>
    r.filename.includes(`-${prefix}.md`) || r.filename.includes(`-${prefix}-`)
  )
}

export function getRunByFilename(filename: string): RunReport | undefined {
  return getAllRunReports().find(r => r.filename === filename)
}
