'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const loadingMessages = [
  '🔍 Đang quét toàn vũ trụ...',
  '💫 Đang tính toán...',
  '🧬 Đang so sánh DNA tâm lý...',
]

export default function EasterEgg({ score }: { score: number }) {
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % loadingMessages.length)
    }, 1000)
    const timeout = setTimeout(() => {
      setLoading(false)
      setResult(true)
    }, 3000)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [loading])

  const barFilled = Math.round((score / 100) * 10)
  const bar = '█'.repeat(barFilled) + '░'.repeat(10 - barFilled)

  return (
    <div className="mt-16 flex flex-col items-center">
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs text-purple-200 hover:text-purple-300 transition-colors select-none"
        >
          💭 Tò mò không?
        </button>
      )}

      <AnimatePresence>
        {revealed && !loading && !result && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLoading(true)}
            className="px-6 py-3 rounded-full font-bold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #F9A8D4, #C084FC)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Có ai phù hợp với tôi không? 🤔
          </motion.button>
        )}

        {loading && (
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-purple-500 font-semibold text-center"
          >
            {loadingMessages[msgIndex]}
          </motion.p>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white rounded-3xl shadow-md p-8 text-center max-w-sm"
          >
            <p className="text-3xl mb-4">🎯</p>
            <p className="font-bold text-purple-700 text-lg mb-1">Phát hiện 1 kết quả</p>
            <p className="text-purple-500 mb-4">
              Một lập trình viên đang sở hữu<br />website này 👀
            </p>
            <p className="font-mono text-purple-600 font-bold mb-1">
              Độ tương thích: {bar} {score}%
            </p>
            <p className="text-sm text-pink-400 font-semibold mt-4 italic">
              &quot;Người này build cả web chỉ để hiểu em hơn 🥺&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
