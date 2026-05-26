'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
            <span className="text-xs font-medium text-primary">
              #1 Reddit Marketing Tool for SaaS Founders
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Promote Your Product
            <br />
            <span className="text-primary">Like a Reddit Native</span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Reddit Scout finds relevant discussions and generates natural replies
            that won&apos;t get your post removed. No more spammy self-promotion.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search for your product or service (e.g. "AI writing assistant")'
                className="flex-1 px-5 py-4 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors cursor-pointer whitespace-nowrap"
              >
                🔍 Search Posts
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-600 mt-4">
            Free to try, no credit card required
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Reddit Marketing in 3 Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🔍',
                title: 'Search Discussions',
                desc: 'Enter your product keyword and Reddit Scout instantly finds relevant discussions across all of Reddit.',
              },
              {
                emoji: '🤖',
                title: 'AI Generates Replies',
                desc: 'Each post gets a natural, value-first reply that subtly mentions your product — no spam, no risk of removal.',
              },
              {
                emoji: '📊',
                title: 'Manage & Export',
                desc: 'Save your search history and export all replies to CSV for systematic Reddit marketing.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-dark-card border border-dark-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-dark-card/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 mb-10">
            Start free, unlock more when you need it
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-4xl font-bold text-white mb-4">
                $0<span className="text-lg text-gray-400">/month</span>
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>· Search Reddit posts</li>
                <li>· Generate 1 reply</li>
                <li>· Basic feature experience</li>
              </ul>
              <a
                href="#search"
                className="block py-3 border border-dark-border text-gray-300 rounded-xl font-medium hover:border-primary transition-colors"
              >
                Get Started Free
              </a>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                Recommended
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-4xl font-bold text-white mb-4">
                $9<span className="text-lg text-gray-400">/month</span>
              </p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                <li>· Unlimited reply generation</li>
                <li>· Export to CSV</li>
                <li>· Search history saved</li>
                <li>· 7-day free trial</li>
              </ul>
              <a
                href="#search"
                className="block py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Reddit Scout. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
