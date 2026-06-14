'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import ProgressBar from '@/components/ProgressBar'
import QuizCard from '@/components/QuizCard'
import { questions } from '@/data/questions'
import { Answer, QuizState } from '@/lib/types'

// Step 0 = basic info form, steps 1-15 = questions
const TOTAL_STEPS = questions.length + 1

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [basicInfo, setBasicInfo] = useState({ name: '', age: '', job: '', mbti: '' })
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goNext = () => {
    setDirection(1)
    setStep((s) => s + 1)
  }
  const goBack = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setDirection(-1)
    setStep((s) => s - 1)
    if (step > 1) setAnswers((a) => a.slice(0, -1))
  }

  const handleSelect = async (option: string) => {
    const q = questions[step - 1]
    const newAnswers = [...answers, { question: q.text, answer: option }]
    setAnswers(newAnswers)

    if (step < questions.length) {
      timeoutRef.current = setTimeout(goNext, 350)
    } else {
      // last question — submit
      setLoading(true)
      const payload: QuizState = { ...basicInfo, answers: newAnswers }
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('API error')
        const result = await res.json()
        try {
          sessionStorage.setItem('quizState', JSON.stringify(payload))
          sessionStorage.setItem('analysisResult', JSON.stringify(result))
        } catch {
          // sessionStorage unavailable (e.g. Safari private mode) — proceed anyway
        }
        router.push('/result')
      } catch {
        setLoading(false)
        setError(true)
      }
    }
  }

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!basicInfo.name.trim() || !basicInfo.age.trim() || !basicInfo.job.trim()) return
    goNext()
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FDE8F0 0%, #EDE0F5 100%)' }}>
        <div className="text-5xl mb-4">😔</div>
        <p className="text-purple-700 font-bold text-xl mb-2">Có lỗi xảy ra rồi!</p>
        <p className="text-purple-500 font-semibold mb-6">AI đang bận, thử lại nhé?</p>
        <motion.button
          onClick={() => { setError(false); setLoading(false) }}
          className="px-6 py-3 rounded-full text-white font-bold shadow-md"
          style={{ background: 'linear-gradient(135deg, #F9A8D4, #C084FC)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Thử lại →
        </motion.button>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FDE8F0 0%, #EDE0F5 100%)' }}>
        <motion.div
          className="text-6xl mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          🔮
        </motion.div>
        <p className="text-purple-700 font-bold text-xl">AI đang phân tích...</p>
        <p className="text-pink-400 font-semibold mt-2">Đợi xíu nhé! ✨</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #FDE8F0 0%, #EDE0F5 100%)' }}>

      <div className="w-full max-w-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-pink-400">
            {step === 0 ? 'Thông tin cơ bản' : `Câu ${step}/${questions.length}`}
          </span>
          {step > 0 && (
            <button onClick={goBack} className="text-sm text-purple-400 font-semibold hover:text-purple-600">
              ← Quay lại
            </button>
          )}
        </div>
        <ProgressBar current={step} total={TOTAL_STEPS} />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.form
            key="basic-info"
            onSubmit={handleBasicInfoSubmit}
            className="bg-white rounded-3xl shadow-md p-8 w-full max-w-lg"
            initial={{ x: direction * 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">👋 Giới thiệu</p>
            <h2 className="text-xl font-bold text-purple-800 mb-6">Trước tiên, hãy cho AI biết về bạn nhé!</h2>

            <div className="flex flex-col gap-4">
              {[
                { label: 'Tên của bạn *', key: 'name', type: 'text', placeholder: 'VD: Lan' },
                { label: 'Tuổi *', key: 'age', type: 'number', placeholder: 'VD: 23' },
                { label: 'Nghề nghiệp *', key: 'job', type: 'text', placeholder: 'VD: Designer' },
                { label: 'MBTI (nếu biết)', key: 'mbti', type: 'text', placeholder: 'VD: INFJ' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-purple-600 mb-1">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={basicInfo[key as keyof typeof basicInfo]}
                    onChange={(e) => setBasicInfo({ ...basicInfo, [key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 font-semibold text-purple-700 focus:outline-none focus:border-pink-300 transition-colors"
                  />
                </div>
              ))}
            </div>

            <motion.button
              type="submit"
              className="mt-6 w-full py-3 rounded-full text-white font-bold text-lg shadow-md"
              style={{ background: 'linear-gradient(135deg, #F9A8D4, #C084FC)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Tiếp theo →
            </motion.button>
          </motion.form>
        )}

        {step > 0 && (
          <QuizCard
            key={step}
            group={questions[step - 1].group}
            text={questions[step - 1].text}
            options={questions[step - 1].options}
            onSelect={handleSelect}
            direction={direction}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
