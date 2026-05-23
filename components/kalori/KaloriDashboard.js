'use client';

import { useState, useEffect, useMemo } from 'react';
import { getGeminiModel, extractJSON } from '../../lib/kalori-ai';

const MEAL_META = {
  sabah: { label: 'Kahvaltı',  emoji: '🌅', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  öğle:  { label: 'Öğle',      emoji: '☀️', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  akşam: { label: 'Akşam',     emoji: '🌙', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ara:   { label: 'Ara Öğün',  emoji: '🍪', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi öğlenler';
  return 'İyi akşamlar';
};

const getTurkishDate = () => {
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const days = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
};

const card = {
  background: 'var(--color-cream-card)',
  border: '0.5px solid var(--color-border)',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '0.625rem',
};

export default function KaloriDashboard({ state, onNavigate }) {
  const { profile, foods, exercises, aiInsight, setAiInsight, todayWater, updateTodayWater, mealInsights, setMealInsights, deleteFood } = state;
  const [loadingInsight, setLoadingInsight] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todaysFoods     = foods.filter(f => f.date === today);
  const todaysExercises = exercises.filter(e => e.date === today);

  const totalConsumed = todaysFoods.reduce((a, f) => a + Number(f.calories), 0);
  const totalBurned   = todaysExercises.reduce((a, e) => a + Number(e.caloriesBurned), 0);
  const bmr           = profile.bmr || 1700;
  const remaining     = Math.max(bmr - totalConsumed + totalBurned, 0);
  const overBudget    = totalConsumed - totalBurned > bmr;

  const radius        = 62;
  const circumference = 2 * Math.PI * radius;
  const progress      = Math.min(totalConsumed / bmr, 1);
  const strokeDashoffset = circumference - progress * circumference;

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    if (!foods.some(f => f.date === d.toISOString().split('T')[0])) d.setDate(d.getDate() - 1);
    while (count < 365) {
      const ds = d.toISOString().split('T')[0];
      if (foods.some(f => f.date === ds)) { count++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return count;
  }, [foods]);

  useEffect(() => {
    const fetchInsight = async () => {
      if (todaysFoods.length === 0) return;
      if (aiInsight.date === today && aiInsight.foodCount === todaysFoods.length) return;
      setLoadingInsight(true);
      try {
        const model = getGeminiModel();
        const foodList = todaysFoods.map(f => `${f.name} (${f.calories} kcal, ${f.mealType})`).join(', ');
        const prompt = `Kullanıcının günlük kalori hedefi: ${bmr} kcal. Bugün alınan kalori: ${totalConsumed} kcal. Yakılan: ${totalBurned} kcal. Yedikleri: ${foodList}\n\nSen samimi, motive edici bir beslenme uzmanısın. Bu verilere bakarak 2-3 cümlelik değerlendirme yaz. Son olarak yarın için 1 cümlelik spesifik öneri ver. "Sen" diliyle hitap et. Sadece düz metin, markdown kullanma.`;
        const result = await model.generateContent(prompt);
        setAiInsight({ text: result.response.text().trim(), foodCount: todaysFoods.length, date: today });
      } catch (err) {
        console.error('Insight error:', err);
      } finally {
        setLoadingInsight(false);
      }
    };
    fetchInsight();
  }, [todaysFoods.length, today]);

  const insightText = () => {
    if (todaysFoods.length === 0) return 'Bugün henüz bir şey girmedin. Güne sağlıklı bir öğünle başla!';
    if (loadingInsight) return 'Yapay zeka gününü analiz ediyor...';
    if (aiInsight.date === today && aiInsight.text) return aiInsight.text;
    return 'Analiz hazırlanıyor...';
  };

  const TARGET_WATER = 8;
  const waterPct = Math.min(todayWater / TARGET_WATER, 1) * 100;

  return (
    <div style={{ paddingTop: '0.75rem', paddingBottom: '1rem' }}>

      {/* Header */}
      <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.1rem' }}>
          {getTurkishDate()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            {getGreeting()} 👋
          </h2>
          {streak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '9999px', padding: '0.25rem 0.6rem' }}>
              <span style={{ fontSize: '0.75rem' }}>🔥</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444' }}>{streak} gün</span>
            </div>
          )}
        </div>
      </div>

      {/* Calorie ring */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="140" height="140">
              <defs>
                <linearGradient id="kRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r={radius} fill="transparent" stroke="var(--color-border)" strokeWidth="11" />
              <circle
                cx="70" cy="70" r={radius}
                fill="transparent"
                stroke={overBudget ? '#ef4444' : 'url(#kRingGrad)'}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px', transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: overBudget ? '#ef4444' : 'var(--color-text)', lineHeight: 1 }}>
                {totalConsumed}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--color-text-mute)', marginTop: '2px' }}>/ {bmr} kcal</div>
              <div style={{ fontSize: '0.58rem', fontWeight: 700, color: overBudget ? '#ef4444' : 'var(--color-accent)', marginTop: '2px' }}>
                {Math.round(progress * 100)}%
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <StatRow emoji="🍎" label="Alınan"  value={`${totalConsumed} kcal`} color="#f59e0b" />
            <StatRow emoji="🔥" label="Yakılan" value={`${totalBurned} kcal`}   color="#ef4444" />
            <StatRow emoji="⚡" label="Kalan"   value={`${remaining} kcal`}     color="var(--color-accent)" />
          </div>
        </div>

        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ height: '5px', borderRadius: '9999px', background: 'var(--color-border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress * 100}%`,
              background: overBudget ? '#ef4444' : 'linear-gradient(90deg, var(--color-accent), #8b5cf6)',
              borderRadius: '9999px', transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--color-text-mute)' }}>0</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 600, color: overBudget ? '#ef4444' : 'var(--color-text-mute)' }}>
              {overBudget ? `${totalConsumed - totalBurned - bmr} kcal fazla` : `${remaining} kcal kaldı`}
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--color-text-mute)' }}>{bmr}</span>
          </div>
        </div>
      </div>

      {/* Water tracker */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1rem' }}>💧</span>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}>Su Takibi</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: todayWater >= TARGET_WATER ? 'var(--color-accent)' : 'var(--color-text-mute)', fontWeight: 600 }}>
            {todayWater} / {TARGET_WATER} {todayWater >= TARGET_WATER ? '✓' : ''}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '0.625rem' }}>
          {Array.from({ length: TARGET_WATER }, (_, i) => (
            <button
              key={i}
              onClick={() => updateTodayWater(todayWater === i + 1 ? i : i + 1)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                fontSize: '1.25rem', opacity: i < todayWater ? 1 : 0.25,
                transform: i < todayWater ? 'scale(1)' : 'scale(0.85)',
                transition: 'all 0.15s',
              }}
              title={`${i + 1} bardak`}
            >💧</button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => updateTodayWater(todayWater - 1)}
            disabled={todayWater === 0}
            style={{ width: 30, height: 30, borderRadius: '50%', border: '0.5px solid var(--color-border)', background: 'var(--color-cream)', color: 'var(--color-text-soft)', cursor: todayWater === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, flexShrink: 0, opacity: todayWater === 0 ? 0.4 : 1 }}
          >−</button>
          <div style={{ flex: 1, height: '5px', borderRadius: '9999px', background: 'var(--color-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${waterPct}%`, background: todayWater >= TARGET_WATER ? 'var(--color-accent)' : '#3b82f6', borderRadius: '9999px', transition: 'width 0.3s ease' }} />
          </div>
          <button
            onClick={() => updateTodayWater(todayWater + 1)}
            disabled={todayWater >= 12}
            style={{ width: 30, height: 30, borderRadius: '50%', border: '0.5px solid #3b82f6', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', cursor: todayWater >= 12 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, flexShrink: 0, opacity: todayWater >= 12 ? 0.4 : 1 }}
          >+</button>
        </div>
      </div>

      {/* AI Insight */}
      <div style={{ ...card, borderLeft: '3px solid var(--color-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem' }}>✨</span>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-accent-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Yorumu</span>
          {loadingInsight && <span style={{ fontSize: '0.65rem', color: 'var(--color-text-mute)', marginLeft: 'auto' }}>Hazırlanıyor...</span>}
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--color-text-soft)', lineHeight: 1.65, margin: 0 }}>{insightText()}</p>
      </div>

      {/* Meals */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.5rem 0.5rem 0.4rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>Öğünler</h3>
        <button
          onClick={() => onNavigate('yemek')}
          style={{ background: 'none', border: 'none', color: 'var(--color-accent-text)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0' }}
        >
          + Yemek Ekle
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {['sabah', 'öğle', 'akşam', 'ara'].map(meal => (
          <MealCard
            key={meal}
            meal={meal}
            foods={todaysFoods.filter(f => f.mealType === meal)}
            bmr={bmr}
            today={today}
            mealInsights={mealInsights}
            setMealInsights={setMealInsights}
            deleteFood={deleteFood}
          />
        ))}
      </div>
    </div>
  );
}

function StatRow({ emoji, label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ width: 26, height: 26, borderRadius: '8px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem' }}>
        {emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.62rem', color: 'var(--color-text-mute)', marginBottom: '1px' }}>{label}</div>
        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)' }}>{value}</div>
      </div>
    </div>
  );
}

function MealCard({ meal, foods, bmr, today, mealInsights, setMealInsights, deleteFood }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const meta = MEAL_META[meal];
  const totalCalories = foods.reduce((a, f) => a + Number(f.calories), 0);
  const cacheKey = `${today}_${meal}`;
  const insight = mealInsights[cacheKey];
  const mealRatio = bmr > 0 ? Math.min(totalCalories / bmr, 1) : 0;

  const toggleExpand = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && foods.length > 0 && (!insight || insight.foodCount !== foods.length)) {
      fetchMealInsight();
    }
  };

  const fetchMealInsight = async () => {
    setLoading(true);
    setErrMsg('');
    try {
      const model = getGeminiModel();
      const foodList = foods.map(f => `${f.name} (${f.calories} kcal)`).join(', ');
      const prompt = `Kullanıcı ${meta.label} öğününde şunları yedi: ${foodList}\nBu öğünü kalp dostluğu, besin değeri dengesi ve genel sağlık açısından 100 üzerinden puanla. 1 cümlelik samimi ve motive edici yorum yap. ("sen" diliyle)\nSadece geçerli JSON döndür: {"score": number, "comment": "string"}\nBaşka hiçbir şey yazma.`;
      const result = await model.generateContent(prompt);
      const data = extractJSON(result.response.text());
      setMealInsights(prev => ({ ...prev, [cacheKey]: { score: data.score, comment: data.comment, foodCount: foods.length } }));
    } catch (err) {
      setErrMsg(err.message || 'Puan alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 80 ? 'var(--color-accent)' : s >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div
      style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '0.75rem', cursor: 'pointer' }}
      onClick={toggleExpand}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ width: 34, height: 34, borderRadius: '9px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
          {meta.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text)' }}>{meta.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {foods.length > 0 && <span style={{ fontSize: '0.76rem', fontWeight: 700, color: meta.color }}>{totalCalories} kcal</span>}
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', transform: expanded ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▾</span>
            </div>
          </div>
          {foods.length > 0 ? (
            <div style={{ height: '3px', borderRadius: '9999px', background: 'var(--color-border)', marginTop: '0.3rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${mealRatio * 100}%`, background: meta.color, borderRadius: '9999px' }} />
            </div>
          ) : (
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)' }}>Boş</span>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '0.625rem', paddingTop: '0.625rem', borderTop: '0.5px solid var(--color-border)' }} onClick={e => e.stopPropagation()}>
          {foods.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', margin: 0 }}>Bu öğünde henüz yemek yok.</p>
          ) : (
            <>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {foods.map(f => (
                  <li key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flex: 1, minWidth: 0 }}>
                      {f.isHeartFriendly && <span style={{ fontSize: '0.65rem', color: '#ef4444' }}>❤️</span>}
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0, marginLeft: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{f.calories} kcal</span>
                      <button
                        onClick={() => deleteFood(f.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--color-text-mute)', borderRadius: '4px', fontSize: '0.75rem', lineHeight: 1, transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-mute)'}
                        title="Sil"
                      >✕</button>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem 0.625rem' }}>
                {loading ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-text)' }}>✨ Yapay zeka puanlıyor...</span>
                ) : insight ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <span style={{ background: scoreColor(insight.score), color: '#fff', padding: '2px 7px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700 }}>
                        {insight.score}/100
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)', fontWeight: 600 }}>AI Değerlendirmesi</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', margin: 0, lineHeight: 1.5 }}>{insight.comment}</p>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', margin: 0 }}>
                    {errMsg || 'Analiz için karta tıkla.'}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
