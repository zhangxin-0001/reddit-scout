'use client'

interface SearchResultProps {
  post: {
    id: string
    title: string
    subreddit: string
    url: string
    score: number
    numComments: number
    snippet: string
    relevance: number
  }
  replyText?: string
  isGenerating?: boolean
  onGenerate: (postId: string) => void
}

export default function SearchResult({
  post,
  replyText,
  isGenerating,
  onGenerate,
}: SearchResultProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {post.subreddit}
            </span>
            <span className="text-xs text-gray-500">
              Relevance {(post.relevance * 100).toFixed(0)}%
            </span>
          </div>

          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold hover:text-primary transition-colors line-clamp-2"
          >
            {post.title}
          </a>

          <p className="text-sm text-gray-400 mt-2 line-clamp-3">
            {post.snippet}
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
            <span>⬆ {post.score.toLocaleString()} score</span>
            <span>💬 {post.numComments} comments</span>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
            >
              View on Reddit →
            </a>
          </div>
        </div>
      </div>

      {/* Reply section */}
      {replyText ? (
        <div className="mt-4 bg-dark/50 border border-dark-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-green-400">
              🤖 AI Generated Reply
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(replyText)}
              className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              Copy
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {replyText}
          </p>
        </div>
      ) : (
        <button
          onClick={() => onGenerate(post.id)}
          disabled={isGenerating}
          className="mt-4 w-full py-2.5 bg-primary/20 border border-primary/40 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? '⏳ Generating...' : '✨ Generate Reply'}
        </button>
      )}
    </div>
  )
}
