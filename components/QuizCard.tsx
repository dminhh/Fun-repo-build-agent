'use client'
import { motion } from 'framer-motion'

interface QuizCardProps {
  group: string
  text: string
  options: string[]
  onSelect: (option: string) => void
  direction: number  // 1 = forward, -1 = backward (for slide direction)
}

export default function QuizCard({ group, text, options, onSelect, direction }: QuizCardProps) {
  return (
    <motion.div
      className="bg-white rounded-3xl shadow-md p-8 w-full max-w-lg"
      initial={{ x: direction * 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: direction * -80, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">{group}</p>
      <h2 className="text-xl font-bold text-purple-800 mb-6">{text}</h2>

      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <motion.button
            key={option}
            onClick={() => onSelect(option)}
            className="w-full text-left px-5 py-3 rounded-2xl border-2 border-pink-100 font-semibold text-purple-700 hover:border-pink-300 hover:bg-pink-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
