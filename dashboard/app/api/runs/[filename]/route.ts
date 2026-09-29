import { NextResponse } from 'next/server'
import { getRunByFilename } from '@/lib/runs'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const run = getRunByFilename(decodeURIComponent(filename))
  if (!run) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(run)
}
