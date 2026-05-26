import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reddit Scout — 像 Reddit 老用户一样推广你的产品',
  description:
    'Reddit Scout 帮你找到相关讨论，并生成不会被删帖的高情商回复。不再硬广，用真实的价值赢得客户。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="zh-CN">
        <body className="bg-dark text-white antialiased">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
