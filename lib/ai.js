/**
 * AI reply generation using Deepseek v4 API.
 * Set DEEPSEEK_API_KEY in .env.local to use the real API.
 * Falls back to mock replies if no API key is configured.
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

const SYSTEM_PROMPT =
  'You are an expert Reddit marketer who writes genuinely helpful, natural-sounding replies.\n' +
  'Your goal is NOT to aggressively pitch, but to share useful knowledge and naturally mention the product when relevant.\n\n' +
  'Rules:\n' +
  '1. Start by genuinely engaging with the post — show you read it.\n' +
  '2. Provide real value first (tip, insight, personal experience).\n' +
  '3. Mention the product naturally, as a satisfied user would, not a salesperson.\n' +
  '4. Keep it under 150 words. Use casual, conversational English.\n' +
  '5. Never use marketing buzzwords like "revolutionary", "game-changer", or "best-in-class".\n' +
  '6. End with an open-ended question to encourage discussion.\n' +
  '7. Do NOT include links or CTAs like "sign up now" or "check it out".'

export async function generateReply(postTitle, postSnippet, subreddit, productDescription) {
  const apiKey = process.env.DEEPSEEK_API_KEY

  const userPrompt =
    'Reddit Post in ' + subreddit + ':\n' +
    'Title: "' + postTitle + '"\n' +
    'Snippet: "' + postSnippet + '"\n\n' +
    'Product/Service to naturally mention: "' + productDescription + '"\n\n' +
    'Write a helpful, natural Reddit reply that engages with the post and subtly references the product.'

  // Use real API if key is configured
  if (apiKey) {
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 400,
          temperature: 0.8,
        }),
      })

      if (!response.ok) {
        throw new Error('Deepseek API error: ' + response.status)
      }

      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('Deepseek API call failed, falling back to mock:', error.message)
    }
  }

  // Fallback: generate a mock reply
  return generateMockReply(postTitle, postSnippet, subreddit, productDescription)
}

function generateMockReply(postTitle, postSnippet, subreddit, productDescription) {
  const templates = [
    'I totally get where you are coming from. I was in the exact same boat a few months ago, spending way too much time on content and feeling like it never sounded quite right.\n\nWhat worked for me was switching to a tool that focuses more on helping me write better rather than writing for me. I have been using ' + productDescription + ' and it has been surprisingly helpful — it gives suggestions but keeps my voice intact.\n\nThe biggest difference I noticed was the time savings. Went from 3-4 hours per piece to about 90 minutes, and the quality actually improved because I could focus on the ideas instead of staring at a blank page.',

    'Been through this exact struggle. After testing probably 8-10 different tools, here is what I learned: most AI writers produce content that sounds like... well, AI.\n\nWhat made a difference for me was ' + productDescription + '. The thing I appreciate is that it does not try to do everything — it is really good at understanding context and giving suggestions that actually fit the tone you are going for.\n\nNot saying it is perfect for everyone, but if you are in the same niche, it is worth a look. What kind of content are you primarily working on?',

    'This resonated hard. I manage content for three clients and the pressure to produce quality work quickly is real.\n\nOne thing that helped me was ' + productDescription + '. I was skeptical at first (been burned by too many "AI writing tools") but this one actually surprised me. It is less about generating content from scratch and more about enhancing what you are already writing — which I think is the right approach.\n\nHappy to share more specific examples of how I use it in my workflow if you are interested!',

    'Great discussion. I have been doing content marketing for about 5 years now and honestly, the tools have gotten a lot better recently.\n\nI have settled on ' + productDescription + ' as my daily driver. What I like about it compared to others I have tried: it actually learns your writing style over time, and the suggestions feel like they come from a smart editor rather than a robot.\n\nThat said, I still think the human touch is essential. I use AI for getting unstuck and polishing, but the core ideas and strategy still come from me. How do you all balance automation vs. authenticity?',
  ]

  const randomIndex = Math.floor(Math.random() * templates.length)
  return templates[randomIndex]
}
