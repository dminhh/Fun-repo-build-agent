'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import FloatingEmoji from '@/components/FloatingEmoji'

const floatingEmojis = [
  { emoji: '💕', initialX: 10, duration: 8, delay: 0, size: 'text-2xl' },
  { emoji: '✨', initialX: 25, duration: 10, delay: 1.5, size: 'text-xl' },
  { emoji: '🌸', initialX: 45, duration: 9, delay: 0.5, size: 'text-3xl' },
  { emoji: '💫', initialX: 65, duration: 11, delay: 2, size: 'text-2xl' },
  { emoji: '🦋', initialX: 80, duration: 8.5, delay: 1, size: 'text-xl' },
  { emoji: '🌷', initialX: 90, duration: 10, delay: 3, size: 'text-2xl' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FDE8F0 0%, #EDE0F5 100%)' }}>

      {floatingEmojis.map((e, i) => (
        <FloatingEmoji key={i} {...e} />
      ))}

      <motion.div
        className="relative z-10 text-center px-6 max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔮
        </motion.div>

        <h1 className="text-4xl font-extrabold text-purple-700 mb-3">
          AI Dating Analyzer
        </h1>

        <p className="text-lg text-purple-500 font-semibold mb-2">
          Khám phá tính cách, gu tình cảm
        </p>
        <p className="text-lg text-purple-500 font-semibold mb-8">
          và phong cách giao tiếp của bạn bằng AI.
        </p>

        <div className="flex justify-center gap-4 text-sm text-pink-400 font-semibold mb-10">
          <span>✨ 15 câu hỏi</span>
          <span>•</span>
          <span>🧠 Phân tích AI</span>
          <span>•</span>
          <span>💝 Miễn phí</span>
        </div>

        <motion.button
          onClick={() => router.push('/quiz')}
          className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-lg"
          style={{ background: 'linear-gradient(135deg, #F9A8D4, #C084FC)' }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          Bắt đầu ngay →
        </motion.button>
      </motion.div>
    </main>
  )
}
