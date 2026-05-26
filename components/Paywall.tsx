'use client'

interface PaywallProps {
  onSubscribe: () => void
  onClose: () => void
}

export default function Paywall({ onSubscribe, onClose }: PaywallProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-xl cursor-pointer"
        >
          ✕
        </button>
        <div className="text-5xl mb-4">🚀</div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Upgrade to Pro
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          You&apos;ve used all <span className="text-primary font-semibold">10 free replies</span>.
          Upgrade to Pro for unlimited AI-generated replies and CSV export.
        </p>

        <ul className="text-left text-gray-300 text-sm space-y-2 mb-8">
          {[
            'Unlimited Reddit reply generation',
            'Export to CSV',
            'Search history saved',
            '7-day free trial',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="text-green-400">✓</span> {item}
            </li>
          ))}
        </ul>

        <button
          onClick={onSubscribe}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
        >
          Subscribe — $9/month
        </button>

        <p className="text-xs text-gray-500 mt-4">
          7-day free trial · Cancel anytime · Secure payment by Stripe
        </p>
      </div>
    </div>
  )
}
