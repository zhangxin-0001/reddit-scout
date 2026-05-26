'use client'

import { useState, useEffect } from 'react'
import { useUser, RedirectToSignIn } from '@clerk/nextjs'
import ReplyCard from '@/components/ReplyCard'

interface Reply {
  id: string
  userId: string
  searchQuery: string
  postTitle: string
  subreddit: string
  replyText: string
  createdAt: string
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!isSignedIn || !user) return

    async function fetchHistory() {
      try {
        const res = await fetch(`/api/dashboard?userId=${user!.id}`)
        const data = await res.json()
        setReplies(data.replies || [])
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [isSignedIn, user])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const res = await fetch(`/api/dashboard/export?userId=${user!.id}`)
      const data = await res.json()

      const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reddit-scout-export-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  // Group replies by search query
  const groupedReplies = replies.reduce(
    (acc, reply) => {
      const key = reply.searchQuery
      if (!acc[key]) acc[key] = []
      acc[key].push(reply)
      return acc
    },
    {} as Record<string, Reply[]>
  )

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Your Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your search history and generated replies
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={exporting || replies.length === 0}
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : '📊 Export CSV'}
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Searches', value: Object.keys(groupedReplies).length },
            { label: 'Total Replies', value: replies.length },
            {
              label: 'Last Used',
              value: replies.length > 0
                ? new Date(replies[0].createdAt).toLocaleDateString('en-US')
                : '-',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-dark-card border border-dark-border rounded-xl p-5"
            >
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-dark-card border border-dark-border rounded-xl p-6 animate-pulse"
              >
                <div className="h-4 bg-dark-border rounded w-1/4 mb-3" />
                <div className="h-4 bg-dark-border rounded w-3/4 mb-2" />
                <div className="h-20 bg-dark-border rounded" />
              </div>
            ))}
          </div>
        ) : replies.length === 0 ? (
          <div className="text-center py-20 bg-dark-card border border-dark-border rounded-2xl">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400 text-lg mb-2">
              No replies yet
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Start your first Reddit marketing campaign from the search page
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              Start Searching
            </a>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedReplies).map(([query, queryReplies]) => (
              <div key={query}>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary">🔍</span>
                  Search: &quot;{query}&quot;
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({queryReplies.length} replies)
                  </span>
                </h2>
                <div className="space-y-3">
                  {queryReplies.map((reply) => (
                    <ReplyCard key={reply.id} reply={reply} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
