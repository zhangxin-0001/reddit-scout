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
        <div className="text-5xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-white mb-3">
          免费查看 1 条话术
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          每月仅需 <span className="text-primary font-semibold">$9 美元</span>，
          即可解锁无限条 AI 生成的高情商营销话术，并可导出为 CSV 表格。
        </p>

        <ul className="text-left text-gray-300 text-sm space-y-2 mb-8">
          {[
            '无限生成 Reddit 回复话术',
            '导出为 CSV / 表格',
            '保存搜索历史',
            '7 天免费试用',
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
          立即订阅 — $9/月
        </button>

        <p className="text-xs text-gray-500 mt-4">
          7 天免费试用 · 随时取消 · 安全支付由 Stripe 处理
        </p>
      </div>
    </div>
  )
}
