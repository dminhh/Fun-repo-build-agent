'use client'
import { motion } from 'framer-motion'

interface ResultCardProps {
  emoji: string
  title: string
  bgColor: string
  children: React.ReactNode
  index: number
}

export default function ResultCard({ emoji, title, bgColor, children, index }: ResultCardProps) {
  return (
    <motion.div
      className={`rounded-3xl shadow-sm p-6 w-full ${bgColor}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
    >
      <h3 className="text-base font-bold text-purple-700 mb-3">
        {emoji} {title}
      </h3>
      {children}
    </motion.div>
  )
}
