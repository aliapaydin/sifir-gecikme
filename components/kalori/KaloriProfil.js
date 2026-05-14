'use client';

import { useState, useRef, useEffect } from 'react';

const ACTIVITY_LEVELS = [
  { value: 'sedentary',   label: 'Hareketsiz',     desc: 'Masa başı iş' },
  { value: 'light',       label: 'Az Hareketli',    desc: 'Haftada 1-3 gün' },
  { value: 'moderate',    label: 'Orta Hareketli',  desc: 'Haftada 3-5 gün' },
  { value: 'active',      label: 'Çok Hareketli',   desc: 'Haftada 6-7 gün' },
  { value: 'very_active', label: 'Aşırı Hareketli', desc: 'Fiziksel iş' },
];

const MULTIPLIERS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };

const calcBMR = (data) => {
  let bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age);
  bmr = data.gender === 'male' ? bmr + 5 : bmr - 161;
  return Math.round(bmr * (MULTIPLIERS[data.activityLevel] || 1.55));
};

const calcBMI = (weight, height) => {
  if (!weight || !height) return null;
  return (weight / ((height / 100) ** 2)).toFixed(1);
};

const bmiStatus = (bmi) => {
  const v = parseFloat(bmi);
  if (v < 18.5) return { label: 'Zayıf',       color: '#3b82f6' };
  if (v < 25)   return { label: 'Normal',       color: 'var(--color-accent)' };
  if (v < 30)   return { label: 'Fazla Kilolu', color: '#f59e0b' };
  return           { label: 'Obez',         color: '#ef4444' };
};

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

const card = {
  background: 'var(--color-cream-card)',
  border: '0.5px solid var(--color-border)',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '0.625rem',
};

export default function KaloriProfil({ state }) {
  const { profile, updateProfile, geminiApiKey, updateGeminiApiKey, clearAllData } = state;
  const [formData, setFormData]         = useState(profile);
  const [apiKeyInput, setApiKeyInput]   = useState(geminiApiKey);
  const [saved, setSaved]               = useState(false);
  const [clearCountdown, setClearCountdown] = useState(null);
  const countdownRef = useRef(null);

  const previewBMR = calcBMR(formData);
  const bmi    = calcBMI(formData.weight, formData.height);
  const status = bmi ? bmiStatus(bmi) : null;

  const weightDiff   = formData.weight - (formData.goalWeight || formData.weight);
  const goalCalories = weightDiff > 0 ? Math.round(previewBMR - 500) : weightDiff < 0 ? Math.round(previewBMR + 300) : previewBMR;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ ...formData, bmr: previewBMR });
    updateGeminiApiKey(apiKeyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClear = () => {
    if (clearCountdown !== null) {
      if (clearCountdown === 'Silindi!') return;
      clearInterval(countdownRef.current);
      setClearCountdown(null);
      return;
    }
    setClearCountdown(3);
    countdownRef.current = setInterval(() => {
      setClearCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current); clearAllData(); return 'Silindi!'; }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (clearCountdown === 'Silindi!') {
      const t = setTimeout(() => setClearCountdown(null), 2000);
      return () => clearTimeout(t);
    }
  }, [clearCountdown]);

  useEffect(() => () => clearInterval(countdownRef.current), []);

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  return (
    <div style={{ paddingTop: '0.75rem', paddingBottom: '1rem' }}>
      <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Profil & Ayarlar</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', margin: '0.15rem 0 0' }}>Kişisel bilgilerini ve API ayarlarını güncelle.</p>
      </div>

      <form onSubmit={handleSubmit} style={card}>
        {/* Age & Gender */}
        <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.875rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Yaş</label>
            <input type="number" style={inp} value={formData.age} onChange={e => set('age', Number(e.target.value))} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Cinsiyet</label>
            <select style={inp} value={formData.gender} onChange={e => set('gender', e.target.value)}>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
            </select>
          </div>
        </div>

        {/* Height & Weight */}
        <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.875rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Boy (cm)</label>
            <input type="number" style={inp} value={formData.height} onChange={e => set('height', Number(e.target.value))} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Mevcut Kilo (kg)</label>
            <input type="number" step="0.1" style={inp} value={formData.weight} onChange={e => set('weight', Number(e.target.value))} />
          </div>
        </div>

        {/* Goal weight */}
        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>🎯 Hedef Kilo (kg)</label>
          <input type="number" step="0.1" style={inp} placeholder="Örn: 70"
            value={formData.goalWeight || ''}
            onChange={e => set('goalWeight', Number(e.target.value))} />
          {formData.goalWeight && formData.weight !== formData.goalWeight && (
            <p style={{ fontSize: '0.7rem', color: weightDiff > 0 ? '#f59e0b' : 'var(--color-accent)', marginTop: '0.3rem', fontWeight: 500 }}>
              {weightDiff > 0
                ? `${weightDiff.toFixed(1)} kg vermek → ~${goalCalories} kcal/gün hedefle`
                : `${Math.abs(weightDiff).toFixed(1)} kg almak → ~${goalCalories} kcal/gün hedefle`}
            </p>
          )}
        </div>

        {/* Activity */}
        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Aktivite Seviyesi</label>
          <select style={inp} value={formData.activityLevel} onChange={e => set('activityLevel', e.target.value)}>
            {ACTIVITY_LEVELS.map(l => (
              <option key={l.value} value={l.value}>{l.label} — {l.desc}</option>
            ))}
          </select>
        </div>

        <hr style={{ border: 'none', borderTop: '0.5px solid var(--color-border)', margin: '0.875rem 0' }} />

        {/* API Key */}
        <div style={{ marginBottom: '0.875rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>🔑 Gemini API Anahtarı</label>
          <input type="password" style={inp} placeholder="AI özellikleri için API key"
            value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} />
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', marginTop: '0.3rem' }}>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent-text)' }}>
              aistudio.google.com
            </a>
            {' '}adresinden ücretsiz alabilirsin.
          </p>
        </div>

        <button
          type="submit"
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
            background: saved ? 'var(--color-accent)' : 'linear-gradient(135deg, var(--color-accent), #8b5cf6)',
            color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ Kaydedildi!' : '⚙️ Güncelle & Hesapla'}
        </button>
      </form>

      {/* BMR + BMI */}
      <div style={{ display: 'grid', gridTemplateColumns: bmi ? '1fr 1fr' : '1fr', gap: '0.5rem', marginBottom: '0.875rem' }}>
        <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}>
          <p style={{ fontSize: '0.62rem', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Günlük Kalori</p>
          <div style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--color-accent), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
            {profile.bmr}
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)', margin: '0.2rem 0 0' }}>kcal / gün (TDEE)</p>

          {profile.goalWeight && profile.weight !== profile.goalWeight && (
            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '0.5px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.8rem' }}>⚡</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b' }}>{goalCalories} kcal/gün</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-mute)' }}>hedef</span>
            </div>
          )}
        </div>

        {bmi && status && (
          <div style={{ ...card, textAlign: 'center', marginBottom: 0 }}>
            <p style={{ fontSize: '0.62rem', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem' }}>Vücut Kitle İndeksi</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: status.color, lineHeight: 1 }}>{bmi}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: '0.35rem', background: `${status.color}18`, border: `1px solid ${status.color}35`, borderRadius: '9999px', padding: '0.15rem 0.6rem' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: status.color }}>{status.label}</span>
            </div>
            <BMIScale bmi={parseFloat(bmi)} />
          </div>
        )}
      </div>

      {/* Clear data */}
      <div style={{ textAlign: 'center', padding: '0 0.25rem' }}>
        <button
          onClick={handleClear}
          style={{
            width: '100%', padding: '0.75rem', borderRadius: '8px',
            border: `0.5px solid ${clearCountdown !== null ? 'transparent' : '#ef4444'}`,
            background: clearCountdown === 'Silindi!' ? 'var(--color-accent)' : clearCountdown !== null ? '#ef4444' : 'transparent',
            color: clearCountdown !== null ? '#fff' : '#ef4444',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
            transition: 'all 0.2s',
          }}
        >
          {clearCountdown === 'Silindi!' ? '✓ Silindi!'
           : clearCountdown !== null ? `✕ İptal (${clearCountdown})`
           : '🗑️ Tüm Verileri Temizle'}
        </button>
        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', marginTop: '0.4rem' }}>
          {clearCountdown !== null && clearCountdown !== 'Silindi!'
            ? 'İptal etmek için tekrar tıkla.'
            : 'Profil ve API anahtarı korunur, sadece yiyecek/egzersiz/kilo verileri silinir.'}
        </p>
      </div>
    </div>
  );
}

function BMIScale({ bmi }) {
  const min = 15, max = 40;
  const pct = Math.min(Math.max(((bmi - min) / (max - min)) * 100, 0), 100);
  return (
    <div style={{ marginTop: '0.625rem', position: 'relative' }}>
      <div style={{ height: 5, borderRadius: 5, background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 30%, #f59e0b 60%, #ef4444 100%)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%, -50%)', width: 9, height: 9, borderRadius: '50%', background: '#fff', border: '2px solid #475569', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
        <span style={{ fontSize: '0.5rem', color: 'var(--color-text-mute)' }}>15</span>
        <span style={{ fontSize: '0.5rem', color: 'var(--color-text-mute)' }}>25</span>
        <span style={{ fontSize: '0.5rem', color: 'var(--color-text-mute)' }}>40</span>
      </div>
    </div>
  );
}
