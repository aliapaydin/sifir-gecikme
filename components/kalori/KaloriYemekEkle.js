'use client';

import { useState } from 'react';
import { getGeminiModel, extractJSON } from '../../lib/kalori-ai';

const MEAL_OPTIONS = [
  { value: 'sabah', label: 'Kahvaltı' },
  { value: 'öğle',  label: 'Öğle Yemeği' },
  { value: 'akşam', label: 'Akşam Yemeği' },
  { value: 'ara',   label: 'Ara Öğün' },
];

const inp = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: '8px',
  border: '0.5px solid var(--color-border)',
  background: 'var(--color-cream)',
  color: 'var(--color-text)',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default function KaloriYemekEkle({ state, onNavigate }) {
  const { addFood, geminiApiKey } = state;
  const [name, setName]                 = useState('');
  const [calories, setCalories]         = useState('');
  const [mealType, setMealType]         = useState('sabah');
  const [isHeartFriendly, setIsHeartFriendly] = useState(false);
  const [loadingAI, setLoadingAI]       = useState(false);
  const [aiError, setAiError]           = useState('');
  const [aiFilled, setAiFilled]         = useState(false);
  const [success, setSuccess]           = useState(false);

  const handleAIFetch = async () => {
    if (!name.trim()) { setAiError('Lütfen önce bir yemek adı girin.'); return; }
    if (!geminiApiKey) { setAiError('Lütfen Profil sekmesinden API anahtarınızı girin.'); return; }
    setLoadingAI(true); setAiError(''); setAiFilled(false);
    try {
      const model = getGeminiModel(geminiApiKey);
      const prompt = `Kullanıcı şu yemeği yedi: "${name}". Bu yemeğin tahmini kalorisini ve genel olarak kalp dostu (sağlıklı yağlar, düşük sodyum vs.) olup olmadığını belirle. Sadece geçerli bir JSON döndür. Format: {"calories": number, "isHeartFriendly": boolean} Açıklama veya markdown ekleme.`;
      const result = await model.generateContent(prompt);
      const data = extractJSON(result.response.text());
      if (data.calories !== undefined) setCalories(data.calories.toString());
      if (data.isHeartFriendly !== undefined) setIsHeartFriendly(data.isHeartFriendly);
      setAiFilled(true);
    } catch (err) {
      const msg = err?.message || '';
      setAiError(msg.includes('geçersiz') ? msg : 'Yapay zeka hatası: ' + msg);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !calories) return;
    addFood({ name, calories: Number(calories), mealType, isHeartFriendly });
    setSuccess(true);
    setTimeout(() => { onNavigate('dashboard'); }, 700);
  };

  return (
    <div style={{ paddingTop: '0.75rem', paddingBottom: '1rem' }}>
      <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Yemek Ekle</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', margin: '0.15rem 0 0' }}>Bugün ne yedin?</p>
      </div>

      {aiError && (
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.625rem 0.75rem', marginBottom: '0.75rem', color: '#ef4444', fontSize: '0.82rem' }}>
          ⚠️ {aiError}
        </div>
      )}

      {aiFilled && !aiError && (
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: '8px', padding: '0.625rem 0.75rem', marginBottom: '0.75rem', color: 'var(--color-accent-text)', fontSize: '0.82rem' }}>
          ✓ AI kalori ve sağlık bilgisini doldurdu. İstersen düzenleyebilirsin.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '1rem' }}>
        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.35rem' }}>
            Yemek Adı & Miktar
          </label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text" style={{ ...inp, flex: 1 }}
              placeholder="Örn: 1.5 porsiyon iskender"
              value={name}
              onChange={e => { setName(e.target.value); setAiFilled(false); setAiError(''); }}
              required
            />
            <button
              type="button"
              onClick={handleAIFetch}
              disabled={loadingAI}
              title="AI ile kalori tahmin et"
              style={{
                width: 44, height: 44, borderRadius: '8px',
                border: '0.5px solid var(--color-accent)',
                background: 'var(--color-accent-soft)',
                color: 'var(--color-accent-text)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: '1rem', transition: 'opacity 0.2s',
                opacity: loadingAI ? 0.6 : 1,
              }}
            >
              {loadingAI ? '⏳' : '✨'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.35rem' }}>
            Kalori (kcal)
          </label>
          <input
            type="number" style={inp}
            placeholder="Örn: 500"
            value={calories}
            onChange={e => setCalories(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.35rem' }}>
            Öğün
          </label>
          <select
            style={{ ...inp }}
            value={mealType}
            onChange={e => setMealType(e.target.value)}
          >
            {MEAL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div
          onClick={() => setIsHeartFriendly(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.75rem', background: 'var(--color-cream)', borderRadius: '8px', border: `0.5px solid ${isHeartFriendly ? 'var(--color-accent)' : 'var(--color-border)'}`, marginBottom: '1rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
        >
          <div style={{ width: 18, height: 18, borderRadius: '4px', border: `2px solid ${isHeartFriendly ? 'var(--color-accent)' : 'var(--color-border)'}`, background: isHeartFriendly ? 'var(--color-accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}>
            {isHeartFriendly && <span style={{ color: '#fff', fontSize: '0.65rem', lineHeight: 1 }}>✓</span>}
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-soft)' }}>❤️ Kalp Dostu</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>Sağlıklı yağ, düşük tuz</span>
        </div>

        <button
          type="submit"
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
            background: success ? 'var(--color-accent)' : 'linear-gradient(135deg, var(--color-accent), #8b5cf6)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            transition: 'background 0.2s',
          }}
        >
          {success ? '✓ Eklendi!' : '+ Ekle'}
        </button>
      </form>
    </div>
  );
}
