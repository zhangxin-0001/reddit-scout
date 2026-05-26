import { NextRequest, NextResponse } from 'next/server'
import { searchReddit } from '@/lib/reddit'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 })
  }

  const posts = await searchReddit(query)

  return NextResponse.json({ posts, query })
}
