import { GoogleGenerativeAI } from '@google/generative-ai';

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

const SYSTEM_PROMPT = `Sen "Sıfır Gecikme" adlı Türkçe veri bilimi eğitim sitesinin yapay zeka tutorüsün.

Görevin:
- Veri bilimi, istatistik, makine öğrenmesi ve Python sorularına Türkçe yardımcı olmak
- Kavramları kısa, net ve anlaşılır şekilde açıklamak (2-4 paragraf yeterli)
- Gerektiğinde Python kod örnekleri vermek
- Konuyla ilgisiz sorularda nazikçe yönlendirmek

Yanıt stili:
- Samimi, teşvik edici, öğretici ol
- Karmaşık konuları günlük hayattan örneklerle açıkla
- Markdown kullan: başlıklar (##), kalın (**), kod blokları (\`\`\`)
- Gereksiz tekrar yapma, özlü ol`;

const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return new Response('Saatlik AI istek limitine ulaştın (20/saat). Biraz bekle.', { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response('AI servisi yapılandırılmamış.', { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Geçersiz istek.', { status: 400 });
  }

  const { messages = [], topic } = body;
  if (!messages.length) {
    return new Response('messages gerekli.', { status: 400 });
  }

  const systemPrompt = topic
    ? `${SYSTEM_PROMPT}\n\nKullanıcı şu anda "${topic}" konusunu inceliyor. Yanıtlarını bu konuya göre çerçevele.`
    : SYSTEM_PROMPT;

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const genAI = new GoogleGenerativeAI(apiKey);
  const errors = [];

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContentStream({ contents });

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) controller.enqueue(new TextEncoder().encode(text));
            }
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('api key') || msg.includes('401') || msg.includes('403')) {
        return new Response('API anahtarı geçersiz.', { status: 401 });
      }
      errors.push(`[${modelName}] ${err.message}`);
      console.error(`Tutor model ${modelName} failed:`, err.message);
      continue;
    }
  }

  const detail = errors.join(' | ');
  console.error('Tutor: tüm modeller başarısız:', detail);
  return new Response(`AI servisi şu an meşgul. Lütfen biraz bekle.\n\nDetay: ${detail}`, { status: 503 });
}
