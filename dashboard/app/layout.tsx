import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SFOOD AI 오피스',
  description: '에쓰푸드 IT AX팀 AI 직원 실시간 근무 현황판',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
