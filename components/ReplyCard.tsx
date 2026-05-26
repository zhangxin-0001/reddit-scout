'use client'

interface ReplyCardProps {
  reply: {
    id: string
    searchQuery: string
    postTitle: string
    subreddit: string
    replyText: string
    createdAt: string
  }
}

export default function ReplyCard({ reply }: ReplyCardProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
          {reply.subreddit}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(reply.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-2">
        <span className="text-gray-500">Search Query: </span>
        {reply.searchQuery}
      </p>

      <p className="text-sm font-medium text-white mb-3 line-clamp-1">
        {reply.postTitle}
      </p>

      <div className="bg-dark/50 border border-dark-border rounded-lg p-4">
        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
          {reply.replyText}
        </p>
      </div>
    </div>
  )
}
