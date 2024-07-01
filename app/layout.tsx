import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Thiporia's notes",
  description: '기록',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div className="container">
          <header>
            <nav>
              <Link href="/">홈</Link>
              <Link href="/posts">포스트</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer>
            <p>2024, thiporia.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}