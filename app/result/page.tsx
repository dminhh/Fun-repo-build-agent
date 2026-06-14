'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ResultCard from '@/components/ResultCard'
import EasterEgg from '@/components/EasterEgg'
import { AnalysisResult, QuizState } from '@/lib/types'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [quizState, setQuizState] = useState<QuizState | null>(null)

  useEffect(() => {
    const r = sessionStorage.getItem('analysisResult')
    const q = sessionStorage.getItem('quizState')
    if (!r || !q) { router.push('/'); return }
    setResult(JSON.parse(r))
    setQuizState(JSON.parse(q))
  }, [router])

  if (!result || !quizState) return null

  const difficultyBar = '█'.repeat(result.difficulty_score) + '░'.repeat(10 - result.difficulty_score)

  return (
    <main className="min-h-screen px-4 py-12 flex flex-col items-center"
      style={{ background: 'linear-gradient(135deg, #FDE8F0 0%, #EDE0F5 100%)' }}>

      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-5xl mb-4">✨</div>
        <h1 className="text-2xl font-extrabold text-purple-800">
          {quizState.name} ơi, AI đã phân tích xong rồi!
        </h1>
        <p className="text-pink-400 font-semibold mt-2">Đây là kết quả dành riêng cho bạn 💝</p>
      </motion.div>

      <div className="flex flex-col gap-5 w-full max-w-lg">
        <ResultCard emoji="🧠" title="Tính cách" bgColor="bg-white" index={0}>
          <p className="text-purple-600 font-semibold leading-relaxed">{result.personality_summary}</p>
        </ResultCard>

        <ResultCard emoji="⭐" title="Điểm mạnh" bgColor="bg-emerald-50" index={1}>
          <ul className="flex flex-col gap-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-emerald-700 font-semibold">✅ {s}</li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard emoji="💭" title="Điểm yếu (nhẹ thôi nha)" bgColor="bg-pink-50" index={2}>
          <ul className="flex flex-col gap-1">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="text-pink-600 font-semibold">🌙 {w}</li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard emoji="💝" title="Phong cách yêu" bgColor="bg-purple-50" index={3}>
          <p className="text-purple-600 font-semibold mb-3">{result.love_style}</p>
          <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Người yêu lý tưởng</p>
          <ul className="flex flex-col gap-1">
            {result.ideal_partner.map((p, i) => (
              <li key={i} className="text-purple-600 font-semibold">💜 {p}</li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard emoji="🎯" title="Cách tiếp cận hiệu quả" bgColor="bg-yellow-50" index={4}>
          <ul className="flex flex-col gap-1">
            {result.how_to_approach.map((tip, i) => (
              <li key={i} className="text-yellow-700 font-semibold">💡 {tip}</li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard emoji="⚠️" title="Nên tránh" bgColor="bg-orange-50" index={5}>
          <ul className="flex flex-col gap-1">
            {result.things_to_avoid.map((t, i) => (
              <li key={i} className="text-orange-600 font-semibold">🚫 {t}</li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard emoji="😅" title="Độ khó tán" bgColor="bg-white" index={6}>
          <p className="font-mono text-purple-600 font-bold text-lg mb-2">
            {difficultyBar} {result.difficulty_score}/10
          </p>
          <p className="text-purple-500 font-semibold">{result.difficulty_reason}</p>
        </ResultCard>

        <ResultCard emoji="📖" title="Hướng dẫn sử dụng 😆" bgColor="bg-yellow-50" index={7}>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">🧊 Bảo quản</p>
              {result.user_manual.preserve.map((p, i) => (
                <p key={i} className="text-yellow-700 font-semibold">• {p}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">🚫 Tránh</p>
              {result.user_manual.avoid.map((a, i) => (
                <p key={i} className="text-red-500 font-semibold">• {a}</p>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">✅ Ưu tiên</p>
              {result.user_manual.priority.map((p, i) => (
                <p key={i} className="text-green-600 font-semibold">• {p}</p>
              ))}
            </div>
          </div>
        </ResultCard>
      </div>

      <EasterEgg score={result.compatibility_score} />

      <motion.button
        onClick={() => { sessionStorage.clear(); router.push('/') }}
        className="mt-12 text-sm text-purple-300 hover:text-purple-500 font-semibold transition-colors"
        whileHover={{ scale: 1.05 }}
      >
        Làm lại từ đầu 🔄
      </motion.button>
    </main>
  )
}
