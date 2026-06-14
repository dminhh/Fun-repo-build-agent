import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'AI Dating Analyzer 🔮',
  description: 'Khám phá tính cách và gu tình cảm của bạn bằng AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} font-nunito antialiased`}>{children}</body>
    </html>
  )
}
