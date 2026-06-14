'use client'
import { motion } from 'framer-motion'

interface FloatingEmojiProps {
  emoji: string
  initialX: number
  duration: number
  delay: number
  size: string
}

export default function FloatingEmoji({ emoji, initialX, duration, delay, size }: FloatingEmojiProps) {
  return (
    <motion.div
      className={`absolute select-none pointer-events-none ${size}`}
      style={{ left: `${initialX}%`, bottom: '-10%' }}
      animate={{ y: [0, -900], opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    >
      {emoji}
    </motion.div>
  )
}
