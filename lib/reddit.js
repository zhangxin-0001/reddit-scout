/**
 * Reddit search via Reddit's public JSON API.
 * Falls back to mock data if the API fails or hits rate limits.
 */

const REDDIT_SEARCH_URL = 'https://www.reddit.com/search.json'
const USER_AGENT = 'RedditScout/1.0 (by u/redditscout_app)'

const MOCK_POSTS = [
  {
    id: '1',
    title: 'What AI writing tools do you actually use daily?',
    subreddit: 'r/freelanceWriters',
    url: 'https://reddit.com/r/freelanceWriters/comments/example1',
    score: 342,
    numComments: 87,
    snippet:
      "I've tried Jasper and Copy.ai but I'm looking for something that feels more natural. What tools are you all using for client work these days?",
    relevance: 0.95,
  },
  {
    id: '2',
    title: 'How to speed up my content writing workflow?',
    subreddit: 'r/content_marketing',
    url: 'https://reddit.com/r/content_marketing/comments/example2',
    score: 215,
    numComments: 54,
    snippet:
      'I spend 3-4 hours writing each blog post. There has to be a faster way. Any tips on streamlining the process without sacrificing quality?',
    relevance: 0.88,
  },
  {
    id: '3',
    title: 'Best AI tools for small business marketing in 2026?',
    subreddit: 'r/smallbusiness',
    url: 'https://reddit.com/r/smallbusiness/comments/example3',
    score: 521,
    numComments: 132,
    snippet:
      "Running a small business means wearing all the hats. I need an AI tool that can help with email copy, social posts, and landing pages without costing a fortune.",
    relevance: 0.82,
  },
  {
    id: '4',
    title: 'Is anyone else worried AI writing tools will kill creativity?',
    subreddit: 'r/writing',
    url: 'https://reddit.com/r/writing/comments/example4',
    score: 678,
    numComments: 204,
    snippet:
      'I see more and more AI-generated content everywhere. As a writer, should I embrace these tools or resist them? Curious how others are navigating this.',
    relevance: 0.76,
  },
  {
    id: '5',
    title: 'Non-native English speaker — need a writing assistant that actually works',
    subreddit: 'r/EnglishLearning',
    url: 'https://reddit.com/r/EnglishLearning/comments/example5',
    score: 189,
    numComments: 63,
    snippet:
      "My English is okay but I struggle with natural-sounding business writing. Looking for an AI tool that helps non-native speakers write more fluently.",
    relevance: 0.91,
  },
  {
    id: '6',
    title: 'Comparing AI writing assistants: Claude vs ChatGPT vs Jasper',
    subreddit: 'r/artificial',
    url: 'https://reddit.com/r/artificial/comments/example6',
    score: 445,
    numComments: 156,
    snippet:
      "I've been testing different AI writing tools for my agency. Here's what I found after 3 months of daily use. Would love to hear others' experiences too.",
    relevance: 0.85,
  },
  {
    id: '7',
    title: "How do you handle writer's block when deadlines are tight?",
    subreddit: 'r/copywriting',
    url: 'https://reddit.com/r/copywriting/comments/example7',
    score: 267,
    numComments: 89,
    snippet:
      "Three deadlines this week and my brain is fried. What are your go-to strategies for pushing through writer's block? AI tools? Templates? Meditation?",
    relevance: 0.72,
  },
  {
    id: '8',
    title: 'SEO content writing at scale — tools and strategies?',
    subreddit: 'r/SEO',
    url: 'https://reddit.com/r/SEO/comments/example8',
    score: 334,
    numComments: 98,
    snippet:
      'I need to produce 50+ SEO-optimized articles per month. Looking for tools that help with research, outlining, and first drafts. Budget is flexible.',
    relevance: 0.79,
  },
  {
    id: '9',
    title: 'Just launched my SaaS — how do I write compelling cold emails?',
    subreddit: 'r/SaaS',
    url: 'https://reddit.com/r/SaaS/comments/example9',
    score: 412,
    numComments: 145,
    snippet:
      'We launched last week and our cold email response rate is terrible. How do you craft outreach emails that people actually read and respond to?',
    relevance: 0.68,
  },
  {
    id: '10',
    title: "What's your tech stack for AI-powered content creation?",
    subreddit: 'r/startups',
    url: 'https://reddit.com/r/startups/comments/example10',
    score: 567,
    numComments: 178,
    snippet:
      'Building a content-heavy product and want to integrate AI. What APIs or tools are you using for text generation, grammar checking, and tone adjustment?',
    relevance: 0.73,
  },
]

/**
 * Strip HTML tags and truncate text to a clean snippet.
 */
function cleanSnippet(text, maxLen = 250) {
  if (!text) return ''
  const cleaned = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  if (cleaned.length <= maxLen) return cleaned
  return cleaned.slice(0, maxLen).replace(/\s+\S*$/, '') + '...'
}

/**
 * Search Reddit using the official public JSON API.
 */
export async function searchReddit(query) {
  if (!query || !query.trim()) return []

  // In development, skip the real API (likely blocked from many networks)
  if (process.env.NODE_ENV === 'development') {
    return fallbackMock(query)
  }

  const url =
    `${REDDIT_SEARCH_URL}?q=${encodeURIComponent(query.trim())}&limit=25&sort=relevance&t=all`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Reddit API responded with ${response.status}`)
    }

    const json = await response.json()
    clearTimeout(timeout)
    const children = json?.data?.children || []

    if (children.length === 0) {
      return fallbackMock(query)
    }

    return children
      .filter((child) => child.kind === 't3')
      .map((child, index) => {
        const post = child.data
        return {
          id: post.id || `reddit_${index}`,
          title: post.title || '',
          subreddit: 'r/' + (post.subreddit || 'unknown'),
          url: 'https://reddit.com' + (post.permalink || ''),
          score: post.score || 0,
          numComments: post.num_comments || 0,
          snippet: cleanSnippet(post.selftext || post.title || ''),
          relevance: Math.round((1 - index / children.length) * 100) / 100,
        }
      })
      .filter((post) => post.title)
      .slice(0, 10)
  } catch (error) {
    clearTimeout(timeout)
    console.error('Reddit API error, falling back to mock:', error.message)
    return fallbackMock(query)
  }
}

/**
 * Return mock posts sorted by relevance to the query.
 */
function fallbackMock(query) {
  const queryWords = query.toLowerCase().split(/\s+/)

  return MOCK_POSTS.map((post) => {
    const text = (post.title + ' ' + post.snippet).toLowerCase()
    const matchCount = queryWords.filter((w) => text.includes(w)).length
    const relevance = Math.min(0.5 + matchCount / queryWords.length * 0.5, 0.99)
    return { ...post, relevance: Math.round(relevance * 100) / 100 }
  }).sort((a, b) => b.relevance - a.relevance)
}

export function getPostById(id) {
  return MOCK_POSTS.find((post) => post.id === id) || null
}
