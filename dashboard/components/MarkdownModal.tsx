'use client'
import { useEffect, useState } from 'react'
import { marked } from 'marked'
import type { RunReport } from '@/types'

interface Props {
  filename: string | null
  onClose: () => void
}

export default function MarkdownModal({ filename, onClose }: Props) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!filename) { setHtml(''); return }
    setLoading(true)
    setError(null)
    fetch(`/api/runs/${encodeURIComponent(filename)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then((data: RunReport) => {
        setHtml(marked.parse(data.content) as string)
        setLoading(false)
      })
      .catch(() => { setError('리포트를 불러올 수 없습니다.'); setLoading(false) })
  }, [filename])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!filename) return null

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-700 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 shrink-0">
          <span className="text-sm font-mono text-gray-300 truncate max-w-lg">{filename}</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl leading-none transition-colors ml-4 shrink-0"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="overflow-y-auto p-8 flex-1">
          {loading && <p className="text-gray-500 text-sm">로딩 중...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {html && (
            <article
              className="prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-code:text-green-400 prose-code:bg-gray-800/60 prose-code:rounded prose-code:px-1
                prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-xl
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-em:text-gray-300
                prose-li:text-gray-300 prose-ul:marker:text-gray-500
                prose-hr:border-gray-700 prose-blockquote:border-gray-600
                prose-table:text-gray-300 prose-th:text-white"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
