'use client'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number   // 0-based current step index
  total: number     // total number of steps
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round(((current) / total) * 100)

  return (
    <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg, #F9A8D4, #C084FC)' }}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  )
}
