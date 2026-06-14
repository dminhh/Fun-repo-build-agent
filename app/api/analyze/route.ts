import { NextRequest, NextResponse } from 'next/server'
import { getOpenAI } from '@/lib/openai'
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

  const openai = getOpenAI()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(completion.choices[0].message.content ?? '{}')
  return NextResponse.json(result)
}
