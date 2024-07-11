import type { Metadata } from 'next'
import Link from 'next/link'
import localFont from 'next/font/local'

import 'modern-normalize/modern-normalize.css'
import 'highlight.js/styles/github.css';
import 'tailwindcss/tailwind.css';

import './globals.css'

const font = localFont({
  src: [
    {
      path: './assets/fonts/PretendardVariable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
})

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
    <html lang="ko" className={font.className}>
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