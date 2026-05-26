'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import SearchResult from '@/components/SearchResult'
import Paywall from '@/components/Paywall'

interface Post {
  id: string
  title: string
  subreddit: string
  url: string
  score: number
  numComments: number
  snippet: string
  relevance: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { isSignedIn, user } = useUser()

  const [posts, setPosts] = useState<Post[]>([])
  const [replies, setReplies] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    if (!query) return

    async function fetchResults() {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setPosts(data.posts || [])
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const handleGenerate = useCallback(
    async (postId: string) => {
      const post = posts.find((p) => p.id === postId)
      if (!post) return

      setGenerating((prev) => ({ ...prev, [postId]: true }))

      try {
        const res = await fetch('/api/generate-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: post.id,
            postTitle: post.title,
            postSnippet: post.snippet,
            subreddit: post.subreddit,
            productDescription: query,
            userId: user?.id || 'anonymous',
          }),
        })

        const data = await res.json()

        if (res.status === 402) {
          setShowPaywall(true)
          return
        }

        setReplies((prev) => ({ ...prev, [postId]: data.reply }))
      } catch (err) {
        console.error('Generate reply failed:', err)
      } finally {
        setGenerating((prev) => ({ ...prev, [postId]: false }))
      }
    },
    [posts, query, user, isSignedIn]
  )

  const handleSubscribe = useCallback(async () => {
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout failed:', err)
    }
  }, [user])

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Search Results: <span className="text-primary">&quot;{query}&quot;</span>
          </h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Searching...' : `Found ${posts.length} related posts`}
          </p>
        </div>

        {/* Search box (compact) */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const input = form.querySelector('input')!
            if (input.value.trim()) {
              window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`
            }
          }}
          className="mb-8"
        >
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={query}
              placeholder="Search for other products..."
              className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors cursor-pointer text-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-dark-card border border-dark-border rounded-xl p-5 animate-pulse"
              >
                <div className="h-4 bg-dark-border rounded w-1/4 mb-3" />
                <div className="h-5 bg-dark-border rounded w-3/4 mb-2" />
                <div className="h-4 bg-dark-border rounded w-full" />
                <div className="h-10 bg-dark-border rounded mt-4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No posts found.</p>
            <p className="text-gray-600 text-sm mt-2">
              Try searching with different keywords.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <SearchResult
                key={post.id}
                post={post}
                replyText={replies[post.id]}
                isGenerating={generating[post.id]}
                onGenerate={handleGenerate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Paywall modal */}
      {showPaywall && <Paywall onSubscribe={handleSubscribe} onClose={() => setShowPaywall(false)} />}
    </main>
  )
}
