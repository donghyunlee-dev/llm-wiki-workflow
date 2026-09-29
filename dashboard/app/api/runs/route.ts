import { NextResponse } from 'next/server'
import { getAllRunReports } from '@/lib/runs'

export async function GET() {
  const runs = getAllRunReports().map(r => ({
    date: r.date,
    filename: r.filename,
    routineId: r.routineId,
    preview: r.content.slice(0, 200),
  }))
  return NextResponse.json(runs)
}
