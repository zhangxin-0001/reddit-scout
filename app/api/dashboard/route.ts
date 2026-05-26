import { NextRequest, NextResponse } from 'next/server'
import { getRepliesByUser } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const replies = await getRepliesByUser(userId)

  return NextResponse.json({ replies })
}
