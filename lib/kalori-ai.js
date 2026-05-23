// API key sunucu tarafında yaşıyor — client'a hiç gönderilmiyor.
// Tüm Gemini çağrıları /api/kalori-ai route'u üzerinden geçiyor.

export const getGeminiModel = () => {
  const generateContent = async (prompt) => {
    const res = await fetch('/api/kalori-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'AI isteği başarısız.');
    }

    // Bileşenler result.response.text() şeklinde çağırıyor — aynı arayüzü koru
    return {
      response: {
        text: () => data.text,
      },
    };
  };

  return { generateContent };
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
