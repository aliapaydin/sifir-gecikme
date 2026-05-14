'use client';

import { useState } from 'react';
import { getGeminiModel, extractJSON } from '../../lib/kalori-ai';

const SUGGESTIONS = ['Koşu', 'Yürüyüş', 'Bisiklet', 'Yüzme', 'Pilates', 'Yoga', 'HIIT', 'Ağırlık'];

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

export default function KaloriEgzersizEkle({ state }) {
  const { addExercise, deleteExercise, exercises, geminiApiKey } = state;
  const [name, setName]                   = useState('');
  const [duration, setDuration]           = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [loadingAI, setLoadingAI]         = useState(false);
  const [aiError, setAiError]             = useState('');
  const [aiFilled, setAiFilled]           = useState(false);
  const [success, setSuccess]             = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaysExercises = exercises.filter(e => e.date === today);

  const handleAIFetch = async () => {
    if (!name.trim()) { setAiError('Lütfen önce egzersiz adını girin.'); return; }
    if (!geminiApiKey) { setAiError('Lütfen Profil sekmesinden API anahtarınızı girin.'); return; }
    setLoadingAI(true); setAiError(''); setAiFilled(false);
    try {
      const model = getGeminiModel(geminiApiKey);
      const dur = duration ? `${duration} dakika` : 'süre belirtilmedi';
      const prompt = `Kullanıcı şu egzersizi yaptı: "${name}", süre: ${dur}. Ortalama bir kişi için bu egzersizin yaklaşık yakılan kalorisini tahmin et. Sadece geçerli bir JSON döndür. Format: {"caloriesBurned": number} Açıklama veya markdown ekleme.`;
      const result = await model.generateContent(prompt);
      const data = extractJSON(result.response.text());
      if (data.caloriesBurned !== undefined) setCaloriesBurned(data.caloriesBurned.toString());
      setAiFilled(true);
    } catch (err) {
      setAiError('Yapay zeka hatası: ' + (err?.message || ''));
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !caloriesBurned) return;
    addExercise({ name, duration: Number(duration), caloriesBurned: Number(caloriesBurned) });
    setSuccess(true);
    setTimeout(() => {
      setName(''); setDuration(''); setCaloriesBurned('');
      setAiFilled(false); setSuccess(false);
    }, 800);
  };

  return (
    <div style={{ paddingTop: '0.75rem', paddingBottom: '1rem' }}>
      <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Egzersiz Ekle</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', margin: '0.15rem 0 0' }}>Bugün nasıl hareket ettin?</p>
      </div>

      {/* Quick chips */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.875rem', padding: '0 0.25rem' }}>
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => { setName(s); setAiFilled(false); setAiError(''); }}
            style={{
              background: name === s ? 'var(--color-accent-soft)' : 'var(--color-cream)',
              border: `0.5px solid ${name === s ? 'var(--color-accent)' : 'var(--color-border)'}`,
              color: name === s ? 'var(--color-accent-text)' : 'var(--color-text-mute)',
              borderRadius: '9999px', padding: '0.25rem 0.7rem', fontSize: '0.78rem',
              cursor: 'pointer', fontWeight: name === s ? 600 : 400, transition: 'all 0.15s',
            }}
          >{s}</button>
        ))}
      </div>

      {aiError && (
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.625rem 0.75rem', marginBottom: '0.75rem', color: '#ef4444', fontSize: '0.82rem' }}>
          ⚠️ {aiError}
        </div>
      )}

      {aiFilled && !aiError && (
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.3)', borderRadius: '8px', padding: '0.625rem 0.75rem', marginBottom: '0.75rem', color: 'var(--color-accent-text)', fontSize: '0.82rem' }}>
          ✓ AI kalori tahminini doldurdu. İstersen düzenleyebilirsin.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '1rem', marginBottom: '0.875rem' }}>
        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.35rem' }}>Egzersiz Adı</label>
          <input
            type="text" style={inp}
            placeholder="Örn: Koşu, Yürüyüş, HIIT"
            value={name}
            onChange={e => { setName(e.target.value); setAiFilled(false); setAiError(''); }}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.35rem' }}>Süre (dk)</label>
            <input
              type="number" style={inp}
              placeholder="Örn: 45"
              value={duration}
              onChange={e => { setDuration(e.target.value); setAiFilled(false); }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.35rem' }}>Yakılan Kalori</label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <input
                type="number" style={{ ...inp, flex: 1 }}
                placeholder="kcal"
                value={caloriesBurned}
                onChange={e => setCaloriesBurned(e.target.value)}
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
                  flexShrink: 0, fontSize: '1rem', opacity: loadingAI ? 0.6 : 1,
                }}
              >
                {loadingAI ? '⏳' : '✨'}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{
            width: '100%', marginTop: '0.875rem', padding: '0.75rem', borderRadius: '8px', border: 'none',
            background: success ? 'var(--color-accent)' : 'linear-gradient(135deg, var(--color-accent), #3b82f6)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            transition: 'background 0.2s',
          }}
        >
          {success ? '✓ Eklendi!' : '+ Egzersiz Ekle'}
        </button>
      </form>

      {/* Today's list */}
      {todaysExercises.length > 0 && (
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.4rem', padding: '0 0.25rem' }}>
            Bugünkü Egzersizler
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {todaysExercises.map(ex => (
              <div key={ex.id} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>🏃</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>{ex.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>
                    {ex.duration ? `${ex.duration} dk · ` : ''}{ex.caloriesBurned} kcal yakıldı
                  </div>
                </div>
                <button
                  onClick={() => deleteExercise(ex.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--color-text-mute)', fontSize: '0.85rem', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-mute)'}
                  title="Sil"
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
