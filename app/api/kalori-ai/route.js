import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

// IP başına saatlik istek sayacı: { ip → { count, windowStart } }
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const WINDOW_MS  = 60 * 60 * 1000; // 1 saat

function checkRateLimit(ip) {
  const now   = Date.now();
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
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Saatlik AI istek limitine ulaştın (20/saat). Biraz bekle.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI servisi şu an yapılandırılmamış.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const { prompt } = body;
  if (!prompt) {
    return NextResponse.json({ error: 'prompt gerekli.' }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const errors = [];

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return NextResponse.json({ text });
    } catch (err) {
      const msg = (err.message || '').toLowerCase();
      errors.push(`${modelName}: ${err.message}`);
      if (msg.includes('api key') || msg.includes('401') || msg.includes('403')) {
        return NextResponse.json({ error: 'API anahtarı geçersiz veya yetkisiz.' }, { status: 401 });
      }
      if (msg.includes('429') || msg.includes('quota')) continue;
      if (msg.includes('503') || msg.includes('service unavailable') || msg.includes('overloaded') || msg.includes('high demand')) continue;
      if (msg.includes('404') || msg.includes('not found') || msg.includes('invalid_argument')) continue;
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json(
    { error: 'Yapay zeka servisi şu an meşgul. Lütfen biraz bekle.' },
    { status: 503 }
  );
}
