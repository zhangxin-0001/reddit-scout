import { NextRequest, NextResponse } from 'next/server'
import { generateReply } from '@/lib/ai'
import { saveReply, saveSearch, getFreeReplyCount } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { postId, postTitle, postSnippet, subreddit, productDescription, userId } = body

  if (!postTitle || !productDescription) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Check free reply limit for non-anonymous users
  const freeCount = await getFreeReplyCount(userId)

  if (freeCount >= 1) {
    return NextResponse.json(
      {
        error: 'Free reply limit reached. Please upgrade to Pro.',
        paywall: true,
      },
      { status: 402 }
    )
  }

  // Generate reply
  const replyText = await generateReply(postTitle, postSnippet, subreddit, productDescription)

  // Save to history
  const reply = await saveReply({
    userId,
    searchQuery: productDescription,
    postTitle,
    subreddit,
    replyText,
  })

  await saveSearch({
    userId,
    query: productDescription,
  })

  return NextResponse.json({ reply: replyText, id: reply.id })
}
