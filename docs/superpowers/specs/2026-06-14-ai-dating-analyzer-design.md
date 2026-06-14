# AI Dating Analyzer — Design Spec

**Date:** 2026-06-14
**Stack:** Next.js 14 (App Router) + Tailwind CSS + Framer Motion + OpenAI API
**Deploy:** Vercel (single service, single repo)

---

## Overview

A fun, cute Q&A web app where a user answers 15-20 personality questions and receives an AI-generated personality analysis with dating tips, love style, and a secret easter egg at the end. Target user: a girl the developer is interested in. The easter egg reveals "compatibility" with the anonymous developer who built the site.

---

## Architecture

### Folder Structure

```
repo/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── quiz/
│   │   └── page.tsx              # Quiz page (all 15-20 questions)
│   ├── result/
│   │   └── page.tsx              # Result page (AI analysis)
│   └── api/
│       └── analyze/
│           └── route.ts          # API route → OpenAI
├── components/
│   ├── LandingHero.tsx           # Hero section with floating emojis
│   ├── QuizCard.tsx              # Single question card
│   ├── ProgressBar.tsx           # Pink progress bar
│   ├── ResultCard.tsx            # Individual result section card
│   └── EasterEgg.tsx             # Hidden easter egg component
├── data/
│   └── questions.ts              # Hardcoded questions array
├── lib/
│   └── openai.ts                 # OpenAI client setup
└── .env.local                    # OPENAI_API_KEY (not committed)
```

### Data Flow

```
Landing page
  → Quiz page (15-20 questions + basic info)
    → POST /api/analyze (JSON payload)
      → OpenAI GPT-4o
        → Result page (rendered from AI JSON response)
          → Easter egg (hidden at bottom)
```

State is passed via `sessionStorage` between pages (no database needed).

---

## Pages

### 1. Landing Page (`/`)

**Layout:**
- Full-screen centered hero
- Gradient background: pink (#FDE8F0) → purple (#EDE0F5)
- Floating emoji animation: 💕 ✨ 🌸 drifting upward slowly (Framer Motion)
- Font: Nunito or Quicksand (Google Fonts)

**Content:**
```
🔮 AI Dating Analyzer

Khám phá tính cách, gu tình cảm
và phong cách giao tiếp của bạn bằng AI.

✨ 15 câu hỏi  •  🧠 Phân tích AI  •  💝 Miễn phí

[ Bắt đầu ngay → ]
```

**CTA button:** Rounded pill, gradient pink→purple, hover lift animation.

---

### 2. Quiz Page (`/quiz`)

**Layout:**
- Pink progress bar at top (0% → 100% as user advances)
- One question card visible at a time
- Card: white background, large border-radius, soft shadow
- Slide transition between questions (Framer Motion `AnimatePresence`)

**Step 1 — Basic Info (inputs):**
- Tên (text input)
- Tuổi (number input)
- Nghề nghiệp (text input)
- MBTI (text input, optional, placeholder: "VD: INFJ")

**Step 2 — Questions (multiple choice):**

Questions are grouped with a small group label shown above:

**💫 Tính cách (câu 1-5)**
1. Cuối tuần lý tưởng: Ở nhà xem phim / Đi cafe / Đi du lịch / Gặp bạn bè
2. Bạn thích: Lên kế hoạch / Tùy hứng
3. Khi gặp người lạ: Chủ động bắt chuyện / Chờ người khác bắt chuyện
4. Bạn thường: Sống trong khoảnh khắc / Lo nghĩ nhiều
5. Năng lượng từ đâu: Ở một mình nạp pin / Ở bên người khác nạp pin

**💝 Tình yêu (câu 6-11)**
6. Điều quan trọng nhất trong mối quan hệ: Sự chân thành / Sự ổn định / Sự thú vị / Sự thấu hiểu
7. Bạn thích được quan tâm bằng: Tin nhắn ngọt ngào / Hành động cụ thể / Quà tặng / Thời gian bên nhau
8. Khi yêu bạn thường: Chủ động / Thụ động / Tùy tình huống
9. Chuyện tình yêu lý tưởng của bạn: Tình bạn rồi thành tình yêu / Sét đánh từ đầu / Từ từ tìm hiểu
10. Khi giận, bạn: Im lặng / Nói thẳng ra / Cần thời gian một mình
11. Điều bạn sợ nhất trong tình yêu: Bị phụ bạc / Mất tự do / Nhàm chán / Không được hiểu

**🚩 Red Flags (câu 12-15)**
12. Điều khiến bạn mất hứng nhất: Trễ hẹn / Nói dối / Khoe khoang / Kiểm soát
13. Deal breaker tuyệt đối: Thiếu tôn trọng / Không có mục tiêu / Không trung thực / Ích kỷ
14. Khi bị người yêu làm buồn, bạn: Nói ra ngay / Giữ trong lòng / Đợi nguội rồi nói
15. Điều bạn muốn nhất từ người yêu: Luôn ở đây / Không gian riêng / Cùng phát triển / Yêu vô điều kiện

**UX details:**
- Chọn đáp án → highlight (màu hồng/tím) → tự động sang câu tiếp sau 0.5s
- Nút "← Quay lại" để sửa đáp án trước
- Câu cuối: nút "Phân tích ngay ✨" thay vì tự động chuyển

---

### 3. API Route (`/api/analyze`)

**Method:** POST
**Input:**
```json
{
  "name": "string",
  "age": "string",
  "job": "string",
  "mbti": "string",
  "answers": [
    { "question": "string", "answer": "string" }
  ]
}
```

**OpenAI prompt:**
```
Bạn là chuyên gia tâm lý vui vẻ, hài hước nhưng tinh tế, chuyên phân tích tính cách qua các câu hỏi trắc nghiệm.

Thông tin người dùng:
- Tên: {name}
- Tuổi: {age}
- Nghề nghiệp: {job}
- MBTI: {mbti}

Câu trả lời khảo sát:
{answers}

Hãy phân tích và trả về JSON (không có text ngoài JSON):
{
  "personality_summary": "2-3 câu mô tả tính cách chính, viết như đang nói chuyện với người đó",
  "strengths": ["điểm mạnh 1", "điểm mạnh 2", "điểm mạnh 3"],
  "weaknesses": ["điểm yếu nhẹ nhàng 1", "điểm yếu nhẹ nhàng 2"],
  "love_style": "1-2 câu mô tả phong cách yêu",
  "ideal_partner": ["tiêu chí 1", "tiêu chí 2", "tiêu chí 3"],
  "how_to_approach": ["tip tiếp cận 1", "tip tiếp cận 2", "tip tiếp cận 3"],
  "things_to_avoid": ["điều nên tránh 1", "điều nên tránh 2"],
  "difficulty_score": <số từ 1-10>,
  "difficulty_reason": "lý do hài hước tại sao điểm đó",
  "user_manual": {
    "preserve": ["cách bảo quản 1", "cách bảo quản 2"],
    "avoid": ["điều tránh 1", "điều tránh 2"],
    "priority": ["ưu tiên 1", "ưu tiên 2"]
  },
  "compatibility_score": 92
}

Yêu cầu:
- Viết bằng tiếng Việt
- Hài hước, dễ thương, không quá nghiêm túc
- Xưng hô "bạn" với người dùng
- Điểm difficulty và compatibility_score luôn cố định ở 7 và 92 (easter egg)
```

**Model:** `gpt-4o-mini` (đủ tốt, rẻ hơn gpt-4o)
**Response:** JSON trực tiếp, parse và lưu vào `sessionStorage`, redirect sang `/result`

---

### 4. Result Page (`/result`)

**Header:**
```
✨ {tên} ơi, AI đã phân tích xong rồi!
```

**Sections** (mỗi section là 1 card, fade-in từ dưới lên lần lượt với Framer Motion stagger):

| Card | Màu | Nội dung |
|------|-----|----------|
| 🧠 Tính cách | Trắng | `personality_summary` |
| ⭐ Điểm mạnh | Xanh mint nhạt | `strengths` dạng list với emoji |
| 💭 Điểm yếu | Hồng nhạt | `weaknesses` |
| 💝 Phong cách yêu | Tím nhạt | `love_style` + `ideal_partner` |
| 🎯 Cách tiếp cận | Vàng nhạt | `how_to_approach` |
| ⚠️ Nên tránh | Cam nhạt | `things_to_avoid` |
| 😅 Độ khó tán | Trắng | Progress bar hồng + `difficulty_score`/10 + `difficulty_reason` |
| 📖 Hướng dẫn sử dụng | Vàng nhạt, font vui | `user_manual` chia 3 mục: Bảo quản / Tránh / Ưu tiên |

**Easter Egg (cuối trang):**
- Text cực nhỏ, màu nhạt gần như vô hình: `💭 Tò mò không?`
- Click → hiện nút `[ Có ai phù hợp với tôi không? ]`
- Click nút → loading 3 giây với text luân phiên:
  - `🔍 Đang quét toàn vũ trụ...`
  - `💫 Đang tính toán...`
  - `🧬 Đang so sánh DNA tâm lý...`
- Kết quả hiện ra:
  ```
  🎯 Phát hiện 1 kết quả

  Một lập trình viên đang sở hữu
  website này 👀

  Độ tương thích: ████████░░ 92%

  "Người này build cả web chỉ để
   hiểu em hơn 🥺"
  ```

---

## Data Models

### Questions (hardcoded in `data/questions.ts`)
```typescript
interface Question {
  id: number
  group: string        // "💫 Tính cách" | "💝 Tình yêu" | "🚩 Red Flags"
  text: string
  options: string[]
}
```

### Quiz State (sessionStorage)
```typescript
interface QuizState {
  name: string
  age: string
  job: string
  mbti: string
  answers: { question: string; answer: string }[]
}
```

### AI Result (sessionStorage)
```typescript
interface AnalysisResult {
  personality_summary: string
  strengths: string[]
  weaknesses: string[]
  love_style: string
  ideal_partner: string[]
  how_to_approach: string[]
  things_to_avoid: string[]
  difficulty_score: number
  difficulty_reason: string
  user_manual: {
    preserve: string[]
    avoid: string[]
    priority: string[]
  }
  compatibility_score: number
}
```

---

## Styling

- **Font:** Nunito (Google Fonts) — rounded, friendly
- **Primary gradient:** `#F9A8D4` → `#C084FC` (pink → purple)
- **Background:** `#FDF2F8` (very light pink)
- **Cards:** `white`, `rounded-2xl`, `shadow-sm`
- **Accent colors per card:** mint, pink, purple, yellow, orange (all pastel)
- **Animations:** Framer Motion — page transitions, card stagger, floating emojis, loading dots

---

## Environment Variables

```
OPENAI_API_KEY=sk-...
```

---

## Out of Scope

- User accounts / authentication
- Saving results to database
- Sharing results via link
- Admin panel for editing questions
- Multiple languages
