import { GoogleGenerativeAI } from '@google/generative-ai';

const PREFERRED_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-pro',
];

const CACHE_KEY = 'kalori_gemini_model';
const CACHE_TTL = 6 * 3600 * 1000;

function getCached() {
  try {
    const c = localStorage.getItem(CACHE_KEY);
    if (!c) return null;
    const { name, ts } = JSON.parse(c);
    return Date.now() - ts < CACHE_TTL ? name : null;
  } catch { return null; }
}

function setCache(name) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ name, ts: Date.now() }));
  } catch {}
}

export const getGeminiModel = (apiKey) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const quotaFailed = new Set(); // models that hit quota limit this session

  const tryModel = async (name, prompt, networkAttempt = 0) => {
    const model = genAI.getGenerativeModel({ model: name });
    try {
      const result = await model.generateContent(prompt);
      setCache(name);
      return result;
    } catch (err) {
      const msg = (err.message || '').toLowerCase();

      if (msg.includes('api key') || msg.includes('api_key_invalid') ||
          msg.includes('401') || msg.includes('403')) {
        throw new Error('API anahtarı geçersiz. Profil ekranından kontrol edin.');
      }

      if (msg.includes('429') || msg.includes('quota')) {
        quotaFailed.add(name);
        try { localStorage.removeItem(CACHE_KEY); } catch {}
        return null; // signal: skip to next model
      }

      if (msg.includes('404') || msg.includes('not found') ||
          msg.includes('model_not_found') || msg.includes('invalid_argument')) {
        return null;
      }

      if ((msg.includes('fetch') || msg.includes('network') || msg.includes('failed')) && networkAttempt < 2) {
        await new Promise(r => setTimeout(r, 1200 * (networkAttempt + 1)));
        return tryModel(name, prompt, networkAttempt + 1);
      }

      return null;
    }
  };

  const doGenerate = async (prompt) => {
    const cached = getCached();
    const order = cached
      ? [cached, ...PREFERRED_MODELS.filter(m => m !== cached)]
      : [...PREFERRED_MODELS];

    let lastErr;

    for (const name of order) {
      if (quotaFailed.has(name)) continue;
      try {
        const result = await tryModel(name, prompt);
        if (result) return result;
      } catch (err) {
        throw err; // auth errors propagate immediately
      }
    }

    // Last resort: discover via API, skip quota-failed models
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'API anahtarı geçersiz.');

      const candidates = (data.models || [])
        .filter(m =>
          m.name.includes('gemini') &&
          m.supportedGenerationMethods?.includes('generateContent') &&
          !quotaFailed.has(m.name.replace('models/', ''))
        );

      for (const m of candidates) {
        const name = m.name.replace('models/', '');
        if (quotaFailed.has(name)) continue;
        try {
          const result = await tryModel(name, prompt);
          if (result) return result;
        } catch (err) {
          throw err;
        }
      }
    } catch (e) {
      if (e.message?.includes('anahtarı')) throw e;
    }

    throw new Error('Tüm yapay zeka modelleri şu an kullanılamıyor. Lütfen daha sonra tekrar dene.');
  };

  return { generateContent: doGenerate };
};

export const extractJSON = (raw) => {
  let text = raw.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
  try { return JSON.parse(text); } catch {}
  const obj = text.match(/\{[\s\S]*?\}/);
  if (obj) { try { return JSON.parse(obj[0]); } catch {} }
  const greedyObj = text.match(/\{[\s\S]*\}/);
  if (greedyObj) { try { return JSON.parse(greedyObj[0]); } catch {} }
  const arr = text.match(/\[[\s\S]*\]/);
  if (arr) { try { return JSON.parse(arr[0]); } catch {} }
  const fixed = text.replace(/,\s*([}\]])/g, '$1').replace(/'/g, '"');
  try { return JSON.parse(fixed); } catch {}
  throw new Error(`JSON parse başarısız. Yanıt: "${text.slice(0, 120)}"`);
};
