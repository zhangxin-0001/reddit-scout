import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Reply {
  id: string
  user_id: string
  search_query: string
  post_title: string
  subreddit: string
  reply_text: string
  created_at: string
}

export interface SearchRecord {
  id: string
  user_id: string
  query: string
  created_at: string
}

// Replies
export async function saveReply(data: {
  userId: string
  searchQuery: string
  postTitle: string
  subreddit: string
  replyText: string
}): Promise<Reply> {
  const { data: reply, error } = await supabase
    .from('replies')
    .insert({
      user_id: data.userId,
      search_query: data.searchQuery,
      post_title: data.postTitle,
      subreddit: data.subreddit,
      reply_text: data.replyText,
    })
    .select()
    .single()

  if (error) throw new Error('Failed to save reply: ' + error.message)
  return reply
}

export async function getRepliesByUser(userId: string): Promise<Reply[]> {
  const { data, error } = await supabase
    .from('replies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch replies: ' + error.message)
  return data || []
}

// Searches
export async function saveSearch(data: {
  userId: string
  query: string
}): Promise<SearchRecord> {
  const { data: record, error } = await supabase
    .from('searches')
    .insert({
      user_id: data.userId,
      query: data.query,
    })
    .select()
    .single()

  if (error) throw new Error('Failed to save search: ' + error.message)
  return record
}

export async function getSearchesByUser(userId: string): Promise<SearchRecord[]> {
  const { data, error } = await supabase
    .from('searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch searches: ' + error.message)
  return data || []
}

// Free reply count
export async function getFreeReplyCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('replies')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) throw new Error('Failed to count replies: ' + error.message)
  return count || 0
}

// CSV export
export function generateCsv(replies: Reply[]): string {
  const header = 'id,user_id,search_query,post_title,subreddit,reply_text,created_at'
  const rows = replies.map((r) =>
    [
      r.id,
      r.user_id,
      `"${(r.search_query || '').replace(/"/g, '""')}"`,
      `"${(r.post_title || '').replace(/"/g, '""')}"`,
      `"${r.subreddit}"`,
      `"${(r.reply_text || '').replace(/"/g, '""')}"`,
      r.created_at,
    ].join(',')
  )
  return [header, ...rows].join('\n')
}
