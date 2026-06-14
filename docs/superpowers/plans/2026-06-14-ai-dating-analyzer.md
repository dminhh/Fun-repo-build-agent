# AI Dating Analyzer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cute pastel Q&A web app that collects personality answers, sends them to OpenAI, and displays a fun AI-generated dating analysis with a hidden easter egg.

**Architecture:** Next.js 14 App Router with Tailwind CSS and Framer Motion for UI. OpenAI calls happen server-side in an API route to protect the API key. State flows through sessionStorage between pages — no database.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, OpenAI SDK (`openai` npm package), Nunito font (Google Fonts)

---

## File Map

| File | Role |
|------|------|
| `app/page.tsx` | Landing page — hero, floating emojis, CTA button |
| `app/quiz/page.tsx` | Quiz page — basic info form + 15 questions, progress bar, slide transitions |
| `app/result/page.tsx` | Result page — staggered AI result cards + easter egg |
| `app/api/analyze/route.ts` | POST handler — builds OpenAI prompt, returns JSON |
| `components/FloatingEmoji.tsx` | Animated floating emoji for landing page |
| `components/ProgressBar.tsx` | Pink progress bar component |
| `components/QuizCard.tsx` | Single question card with options |
| `components/ResultCard.tsx` | Individual result section card |
| `components/EasterEgg.tsx` | Hidden easter egg at bottom of result page |
| `data/questions.ts` | Hardcoded Question array + BasicInfo type |
| `lib/types.ts` | Shared TypeScript interfaces: Question, QuizState, AnalysisResult |
| `lib/openai.ts` | OpenAI client singleton |

---

## Task 1: Bootstrap Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `app/layout.tsx`, `app/globals.css`, `.env.local.example`

- [ ] **Step 1: Initialize Next.js app**

Run in repo root:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"
```
When prompted, answer: No to "use Turbopack".

- [ ] **Step 2: Install dependencies**

```bash
npm install framer-motion openai
```

- [ ] **Step 3: Add Nunito font in `app/layout.tsx`**

Replace the contents of `app/layout.tsx` with:
```tsx
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
})

export const metadata: Metadata = {
  title: 'AI Dating Analyzer 🔮',
  description: 'Khám phá tính cách và gu tình cảm của bạn bằng AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} font-nunito antialiased`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 4: Update `app/globals.css`**

Replace contents with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-nunito: 'Nunito', sans-serif;
}

body {
  font-family: var(--font-nunito), sans-serif;
  background-color: #FDF2F8;
}
```

- [ ] **Step 5: Update `tailwind.config.ts`**

Replace contents with:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        pink: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
        },
        purple: {
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
        },
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Create `.env.local.example`**

```bash
OPENAI_API_KEY=sk-your-key-here
```

Copy to `.env.local` and fill in your real key:
```bash
cp .env.local.example .env.local
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```
Expected: Server running at http://localhost:3000 with no errors.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: bootstrap Next.js 14 project with Tailwind and Framer Motion"
```

---

## Task 2: Define shared types and questions data

**Files:**
- Create: `lib/types.ts`
- Create: `data/questions.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```ts
export interface Question {
  id: number
  group: string
  text: string
  options: string[]
}

export interface BasicInfo {
  name: string
  age: string
  job: string
  mbti: string
}

export interface Answer {
  question: string
  answer: string
}

export interface QuizState extends BasicInfo {
  answers: Answer[]
}

export interface UserManual {
  preserve: string[]
  avoid: string[]
  priority: string[]
}

export interface AnalysisResult {
  personality_summary: string
  strengths: string[]
  weaknesses: string[]
  love_style: string
  ideal_partner: string[]
  how_to_approach: string[]
  things_to_avoid: string[]
  difficulty_score: number
  difficulty_reason: string
  user_manual: UserManual
  compatibility_score: number
}
```

- [ ] **Step 2: Create `data/questions.ts`**

```ts
import { Question } from '@/lib/types'

export const questions: Question[] = [
  // 💫 Tính cách
  {
    id: 1,
    group: '💫 Tính cách',
    text: 'Cuối tuần lý tưởng của bạn là gì?',
    options: ['Ở nhà xem phim', 'Đi cafe', 'Đi du lịch', 'Gặp bạn bè'],
  },
  {
    id: 2,
    group: '💫 Tính cách',
    text: 'Bạn thích kiểu nào hơn?',
    options: ['Lên kế hoạch trước', 'Tùy hứng'],
  },
  {
    id: 3,
    group: '💫 Tính cách',
    text: 'Khi gặp người lạ, bạn thường?',
    options: ['Chủ động bắt chuyện', 'Chờ người khác bắt chuyện'],
  },
  {
    id: 4,
    group: '💫 Tính cách',
    text: 'Bạn thường sống như thế nào?',
    options: ['Sống trong khoảnh khắc hiện tại', 'Hay lo nghĩ về tương lai'],
  },
  {
    id: 5,
    group: '💫 Tính cách',
    text: 'Bạn nạp năng lượng bằng cách nào?',
    options: ['Ở một mình', 'Ở bên người khác'],
  },
  // 💝 Tình yêu
  {
    id: 6,
    group: '💝 Tình yêu',
    text: 'Điều quan trọng nhất trong một mối quan hệ là gì?',
    options: ['Sự chân thành', 'Sự ổn định', 'Sự thú vị', 'Sự thấu hiểu'],
  },
  {
    id: 7,
    group: '💝 Tình yêu',
    text: 'Bạn thích được quan tâm bằng cách nào?',
    options: ['Tin nhắn ngọt ngào', 'Hành động cụ thể', 'Quà tặng', 'Thời gian bên nhau'],
  },
  {
    id: 8,
    group: '💝 Tình yêu',
    text: 'Khi yêu, bạn thường?',
    options: ['Chủ động', 'Thụ động', 'Tùy tình huống'],
  },
  {
    id: 9,
    group: '💝 Tình yêu',
    text: 'Chuyện tình yêu lý tưởng của bạn là?',
    options: ['Tình bạn rồi thành tình yêu', 'Sét đánh ngay từ đầu', 'Từ từ tìm hiểu'],
  },
  {
    id: 10,
    group: '💝 Tình yêu',
    text: 'Khi giận người yêu, bạn?',
    options: ['Im lặng', 'Nói thẳng ra luôn', 'Cần thời gian một mình'],
  },
  {
    id: 11,
    group: '💝 Tình yêu',
    text: 'Điều bạn sợ nhất trong tình yêu?',
    options: ['Bị phụ bạc', 'Mất tự do', 'Nhàm chán', 'Không được hiểu'],
  },
  // 🚩 Red Flags
  {
    id: 12,
    group: '🚩 Red Flags',
    text: 'Điều gì khiến bạn mất hứng nhất?',
    options: ['Trễ hẹn', 'Nói dối', 'Khoe khoang', 'Kiểm soát'],
  },
  {
    id: 13,
    group: '🚩 Red Flags',
    text: 'Deal breaker tuyệt đối của bạn là?',
    options: ['Thiếu tôn trọng', 'Không có mục tiêu', 'Không trung thực', 'Ích kỷ'],
  },
  {
    id: 14,
    group: '🚩 Red Flags',
    text: 'Khi bị người yêu làm buồn, bạn?',
    options: ['Nói ra ngay', 'Giữ trong lòng', 'Đợi nguội rồi nói'],
  },
  {
    id: 15,
    group: '🚩 Red Flags',
    text: 'Điều bạn muốn nhất từ người yêu?',
    options: ['Luôn ở đây bên tôi', 'Cho tôi không gian riêng', 'Cùng nhau phát triển', 'Yêu vô điều kiện'],
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts data/questions.ts
git commit -m "feat: add shared types and hardcoded questions data"
```

---

## Task 3: OpenAI client and API route

**Files:**
- Create: `lib/openai.ts`
- Create: `app/api/analyze/route.ts`

- [ ] **Step 1: Create `lib/openai.ts`**

```ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default openai
```

- [ ] **Step 2: Create `app/api/analyze/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai'
import { Answer } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, age, job, mbti, answers } = body as {
    name: string
    age: string
    job: string
    mbti: string
    answers: Answer[]
  }

  const answersText = answers
    .map((a, i) => `${i + 1}. ${a.question}: ${a.answer}`)
    .join('\n')

  const prompt = `Bạn là chuyên gia tâm lý vui vẻ, hài hước nhưng tinh tế, chuyên phân tích tính cách qua các câu hỏi trắc nghiệm.

Thông tin người dùng:
- Tên: ${name}
- Tuổi: ${age}
- Nghề nghiệp: ${job}
- MBTI: ${mbti || 'Không biết'}

Câu trả lời khảo sát:
${answersText}

Hãy phân tích và trả về JSON (không có text nào ngoài JSON):
{
  "personality_summary": "2-3 câu mô tả tính cách chính, viết như đang nói chuyện thân thiện với người đó",
  "strengths": ["điểm mạnh 1", "điểm mạnh 2", "điểm mạnh 3"],
  "weaknesses": ["điểm yếu nhẹ nhàng 1", "điểm yếu nhẹ nhàng 2"],
  "love_style": "1-2 câu mô tả phong cách yêu",
  "ideal_partner": ["tiêu chí người yêu lý tưởng 1", "tiêu chí 2", "tiêu chí 3"],
  "how_to_approach": ["tip tiếp cận hiệu quả 1", "tip 2", "tip 3"],
  "things_to_avoid": ["điều nên tránh khi tiếp cận 1", "điều nên tránh 2"],
  "difficulty_score": 7,
  "difficulty_reason": "lý do hài hước tại sao điểm 7",
  "user_manual": {
    "preserve": ["cách bảo quản 1", "cách bảo quản 2"],
    "avoid": ["điều cần tránh 1", "điều cần tránh 2"],
    "priority": ["ưu tiên 1", "ưu tiên 2"]
  },
  "compatibility_score": 92
}

Yêu cầu: viết bằng tiếng Việt, hài hước, dễ thương, không quá nghiêm túc, xưng hô "bạn" với người dùng. difficulty_score luôn là 7, compatibility_score luôn là 92.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(completion.choices[0].message.content ?? '{}')
  return NextResponse.json(result)
}
```

- [ ] **Step 3: Verify API route manually**

Start dev server and test with curl:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lan",
    "age": "23",
    "job": "Designer",
    "mbti": "INFJ",
    "answers": [
      {"question": "Cuối tuần lý tưởng", "answer": "Đi cafe"},
      {"question": "Bạn thích kiểu nào hơn", "answer": "Lên kế hoạch trước"}
    ]
  }'
```
Expected: JSON response with all fields (`personality_summary`, `strengths`, etc.), `difficulty_score` = 7, `compatibility_score` = 92.

- [ ] **Step 4: Commit**

```bash
git add lib/openai.ts app/api/analyze/route.ts
git commit -m "feat: add OpenAI client and /api/analyze route"
```

---

## Task 4: Landing page

**Files:**
- Create: `components/FloatingEmoji.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/FloatingEmoji.tsx`**

```tsx
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
```

- [ ] **Step 2: Replace `app/page.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify landing page**

Open http://localhost:3000 — should see gradient background, floating emojis drifting up, title, and CTA button.

- [ ] **Step 4: Commit**

```bash
git add components/FloatingEmoji.tsx app/page.tsx
git commit -m "feat: add landing page with floating emoji animation"
```

---

## Task 5: ProgressBar component

**Files:**
- Create: `components/ProgressBar.tsx`

- [ ] **Step 1: Create `components/ProgressBar.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/ProgressBar.tsx
git commit -m "feat: add animated ProgressBar component"
```

---

## Task 6: QuizCard component

**Files:**
- Create: `components/QuizCard.tsx`

- [ ] **Step 1: Create `components/QuizCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/QuizCard.tsx
git commit -m "feat: add QuizCard component with slide animation"
```

---

## Task 7: Quiz page

**Files:**
- Create: `app/quiz/page.tsx`

- [ ] **Step 1: Create `app/quiz/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
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

  const goNext = () => {
    setDirection(1)
    setStep((s) => s + 1)
  }
  const goBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
    if (step > 1) setAnswers((a) => a.slice(0, -1))
  }

  const handleSelect = async (option: string) => {
    const q = questions[step - 1]
    const newAnswers = [...answers, { question: q.text, answer: option }]
    setAnswers(newAnswers)

    if (step < questions.length) {
      setTimeout(goNext, 350)
    } else {
      // last question — submit
      setLoading(true)
      const payload: QuizState = { ...basicInfo, answers: newAnswers }
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      sessionStorage.setItem('quizState', JSON.stringify(payload))
      sessionStorage.setItem('analysisResult', JSON.stringify(result))
      router.push('/result')
    }
  }

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!basicInfo.name.trim() || !basicInfo.age.trim() || !basicInfo.job.trim()) return
    goNext()
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
```

- [ ] **Step 2: Verify quiz flow**

Open http://localhost:3000/quiz — fill basic info, click Tiếp theo, go through questions, verify progress bar advances, back button works, last question shows loading spinner then redirects to /result (will 404 until Task 8).

- [ ] **Step 3: Commit**

```bash
git add app/quiz/page.tsx
git commit -m "feat: add quiz page with basic info form and 15 questions"
```

---

## Task 8: ResultCard component

**Files:**
- Create: `components/ResultCard.tsx`

- [ ] **Step 1: Create `components/ResultCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/ResultCard.tsx
git commit -m "feat: add ResultCard component with stagger animation"
```

---

## Task 9: EasterEgg component

**Files:**
- Create: `components/EasterEgg.tsx`

- [ ] **Step 1: Create `components/EasterEgg.tsx`**

```tsx
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
              "Người này build cả web chỉ để hiểu em hơn 🥺"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/EasterEgg.tsx
git commit -m "feat: add hidden EasterEgg component with reveal animation"
```

---

## Task 10: Result page

**Files:**
- Create: `app/result/page.tsx`

- [ ] **Step 1: Create `app/result/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify end-to-end**

1. Go to http://localhost:3000
2. Click "Bắt đầu ngay"
3. Fill in basic info, click Tiếp theo
4. Answer all 15 questions
5. Wait for AI loading spinner
6. Verify result page shows all 8 cards with real AI content
7. Scroll to bottom, click the tiny "💭 Tò mò không?"
8. Click the button, wait 3 seconds, verify easter egg appears with 92%

- [ ] **Step 3: Commit**

```bash
git add app/result/page.tsx
git commit -m "feat: add result page with staggered AI result cards and easter egg"
```

---

## Task 11: Deploy to Vercel

**Files:**
- Create: `vercel.json` (optional, for env var reminder)

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: `.` (default)
5. Add environment variable: `OPENAI_API_KEY` = your real key
6. Click Deploy

- [ ] **Step 3: Verify production**

Open the Vercel URL, go through the full quiz flow end-to-end in production.

- [ ] **Step 4: Share the link**

Send the Vercel URL to her and let her discover the easter egg herself 😉

---

## Self-Review

**Spec coverage check:**
- ✅ Landing page with floating emojis and CTA — Task 4
- ✅ Basic info form (name, age, job, mbti) — Task 7
- ✅ 15 hardcoded questions in 3 groups — Task 2
- ✅ Progress bar — Task 5
- ✅ Slide transition between questions — Tasks 6, 7
- ✅ Auto-advance after selection + back button — Task 7
- ✅ POST /api/analyze with OpenAI gpt-4o-mini — Task 3
- ✅ AnalysisResult JSON with all fields — Task 3
- ✅ SessionStorage state passing — Tasks 7, 10
- ✅ Result page with 8 staggered cards — Task 10
- ✅ Difficulty score progress bar — Task 10
- ✅ User manual card — Task 10
- ✅ Hidden easter egg at bottom — Tasks 9, 10
- ✅ Loading animation (3s, rotating messages) — Task 9
- ✅ Easter egg reveal with 92% compatibility — Task 9
- ✅ Pastel pink/purple theme + Nunito font — Tasks 1, 4
- ✅ Framer Motion animations throughout — Tasks 4-10
- ✅ Deploy to Vercel — Task 11

**Type consistency:** `AnalysisResult`, `QuizState`, `Answer`, `Question` defined once in `lib/types.ts` and imported everywhere — no duplication or naming drift.
