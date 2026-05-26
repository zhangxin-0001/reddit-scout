import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// Stripe webhook secret — set in .env.local
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const userId = session.metadata?.userId
      console.log(`User ${userId} completed checkout: ${session.id}`)
      // Here you would update the user's subscription status in your database
      break
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      console.log(`Subscription ${subscription.id} cancelled`)
      // Here you would revoke the user's access
      break
    }
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
