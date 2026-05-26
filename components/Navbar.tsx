'use client'

import Link from 'next/link'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  const { isSignedIn, user } = useUser()

  return (
    <nav className="border-b border-dark-border bg-dark/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔭</span>
            <span className="font-bold text-xl text-white tracking-tight">
              Reddit<span className="text-primary">Scout</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isSignedIn && (
              <Link
                href="/dashboard"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            )}

            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
