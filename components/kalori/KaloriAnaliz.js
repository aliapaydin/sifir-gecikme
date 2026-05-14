'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const DAY_NAMES = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

const last7Days = () =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

const MEAL_COLORS = { sabah: '#f59e0b', öğle: '#3b82f6', akşam: '#8b5cf6', ara: '#10b981' };
const MEAL_LABELS = { sabah: 'Kahvaltı', öğle: 'Öğle', akşam: 'Akşam', ara: 'Ara Öğün' };

const ttStyle = {
  background: 'var(--color-cream-card)',
  border: '0.5px solid var(--color-border)',
  borderRadius: '8px',
  padding: '0.5rem 0.75rem',
  fontSize: '0.78rem',
  color: 'var(--color-text-soft)',
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={ttStyle}>
      <p style={{ margin: '0 0 0.15rem', color: 'var(--color-text-mute)', fontSize: '0.68rem' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, fontWeight: 700, color: p.color || 'var(--color-accent)' }}>
          {p.name}: {p.value} kcal
        </p>
      ))}
    </div>
  );
}

const card = {
  background: 'var(--color-cream-card)',
  border: '0.5px solid var(--color-border)',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '0.625rem',
};

export default function KaloriAnaliz({ state }) {
  const { profile, foods, exercises, weightHistory, addWeightRecord, deleteWeightRecord } = state;
  const [weightInput, setWeightInput] = useState('');

  const bmr        = profile.bmr || 1700;
  const goalWeight = profile.goalWeight;
  const today      = new Date().toISOString().split('T')[0];
  const days       = useMemo(last7Days, []);

  const weeklyData = useMemo(() => days.map(date => {
    const dayFoods     = foods.filter(f => f.date === date);
    const dayExercises = exercises.filter(e => e.date === date);
    const consumed     = dayFoods.reduce((a, f) => a + Number(f.calories), 0);
    const burned       = dayExercises.reduce((a, e) => a + Number(e.caloriesBurned), 0);
    return {
      date, label: DAY_NAMES[new Date(date + 'T12:00:00').getDay()],
      consumed, burned, net: consumed - burned,
      hasData: dayFoods.length > 0,
    };
  }), [days, foods, exercises]);

  const stats = useMemo(() => {
    let streak = 0;
    const d = new Date();
    if (!foods.some(f => f.date === d.toISOString().split('T')[0])) d.setDate(d.getDate() - 1);
    while (streak < 365) {
      const ds = d.toISOString().split('T')[0];
      if (foods.some(f => f.date === ds)) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    const daysWithData  = weeklyData.filter(d => d.hasData);
    const avgCalories   = daysWithData.length ? Math.round(daysWithData.reduce((a, d) => a + d.consumed, 0) / daysWithData.length) : 0;
    const daysOnGoal    = weeklyData.filter(d => d.hasData && d.net <= bmr).length;
    const weekFoods     = foods.filter(f => days.includes(f.date));
    const heartFriendly = weekFoods.length ? Math.round((weekFoods.filter(f => f.isHeartFriendly).length / weekFoods.length) * 100) : 0;
    const totalConsumed = weeklyData.reduce((a, d) => a + d.consumed, 0);
    const totalBurned   = weeklyData.reduce((a, d) => a + d.burned, 0);
    return { streak, avgCalories, daysOnGoal, heartFriendly, totalConsumed, totalBurned };
  }, [foods, exercises, weeklyData, days, bmr]);

  const mealDist = useMemo(() => {
    const totals = { sabah: 0, öğle: 0, akşam: 0, ara: 0 };
    foods.filter(f => days.includes(f.date)).forEach(f => {
      totals[f.mealType] = (totals[f.mealType] || 0) + Number(f.calories);
    });
    const total = Object.values(totals).reduce((a, b) => a + b, 0);
    return Object.entries(totals).map(([type, cal]) => ({
      type, cal, label: MEAL_LABELS[type],
      pct: total > 0 ? Math.round((cal / total) * 100) : 0,
    }));
  }, [foods, days]);

  const currentWeight = weightHistory.length ? weightHistory[weightHistory.length - 1].weight : null;
  const weightTrend = useMemo(() => {
    if (weightHistory.length < 2) return null;
    const recent = weightHistory.slice(-7);
    const diff = recent[recent.length - 1].weight - recent[0].weight;
    return { diff: Math.abs(diff).toFixed(1), isDown: diff < 0, isFlat: Math.abs(diff) < 0.1 };
  }, [weightHistory]);

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!weightInput) return;
    addWeightRecord(weightInput);
    setWeightInput('');
  };

  const netWeek  = stats.totalConsumed - stats.totalBurned;
  const goalWeek = bmr * 7;

  const inp = {
    flex: 1, padding: '0.625rem 0.75rem', borderRadius: '8px',
    border: '0.5px solid var(--color-border)', background: 'var(--color-cream)',
    color: 'var(--color-text)', fontSize: '0.875rem', outline: 'none',
  };

  return (
    <div style={{ paddingTop: '0.75rem', paddingBottom: '1rem' }}>
      <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Analiz</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', margin: '0.15rem 0 0' }}>Son 7 günün özeti</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.625rem' }}>
        <StatCard emoji="🔥" label="Günlük Seri"     value={`${stats.streak} gün`}       color="#ef4444" bg="rgba(239,68,68,0.1)" />
        <StatCard emoji="📊" label="Ort. Kalori"     value={`${stats.avgCalories} kcal`}  color="#3b82f6" bg="rgba(59,130,246,0.1)" />
        <StatCard emoji="🎯" label="Hedefe Ulaşılan" value={`${stats.daysOnGoal}/7 gün`}  color="var(--color-accent)" bg="var(--color-accent-soft)" />
        <StatCard emoji="❤️" label="Kalp Dostu"      value={`${stats.heartFriendly}%`}    color="#8b5cf6" bg="rgba(139,92,246,0.1)" />
      </div>

      {/* Weekly summary */}
      <div style={card}>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          📅 Haftalık Özet
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <SummaryCell label="Alınan"  value={stats.totalConsumed.toLocaleString()} color="#f59e0b" />
          <SummaryCell label="Yakılan" value={stats.totalBurned.toLocaleString()}   color="#ef4444" />
          <SummaryCell
            label={netWeek > goalWeek ? 'Fazla' : 'Açık'}
            value={Math.abs(netWeek - goalWeek).toLocaleString()}
            color={netWeek > goalWeek ? '#ef4444' : 'var(--color-accent)'}
          />
        </div>
      </div>

      {/* Calorie chart */}
      <div style={card}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 0.75rem' }}>Kalori Alımı (7 Gün)</h3>
        <div style={{ height: 185, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={weeklyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={bmr} stroke="rgba(239,68,68,0.4)" strokeDasharray="5 3" strokeWidth={1.5} />
              <Bar dataKey="consumed" name="Alınan" fill="#3b82f6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem' }}>
          <div style={{ width: 12, height: 2, background: 'rgba(239,68,68,0.5)', borderRadius: 2 }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-mute)' }}>Günlük hedef ({bmr} kcal)</span>
        </div>
      </div>

      {/* Exercise chart */}
      <div style={card}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 0.75rem' }}>Egzersiz Kalori (7 Gün)</h3>
        <div style={{ height: 165, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="burned" name="Yakılan" fill="var(--color-accent)" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Net trend */}
      <div style={card}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 0.75rem' }}>Net Kalori Trendi</h3>
        <div style={{ height: 155, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={bmr} stroke="rgba(239,68,68,0.35)" strokeDasharray="5 3" strokeWidth={1.5} />
              <defs>
                <linearGradient id="kNetGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-accent)" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="net" name="Net" stroke="url(#kNetGrad)" strokeWidth={2.5}
                dot={{ fill: '#8b5cf6', r: 3.5, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Meal distribution */}
      <div style={card}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 0.75rem' }}>Öğün Dağılımı (7 Gün)</h3>
        {mealDist.every(m => m.cal === 0) ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-mute)', margin: 0, textAlign: 'center', padding: '0.5rem 0' }}>Bu hafta veri bulunamadı.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {mealDist.map(m => (
              <div key={m.type}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-soft)' }}>{m.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>{m.cal.toLocaleString()} kcal · {m.pct}%</span>
                </div>
                <div style={{ height: '5px', borderRadius: '9999px', background: 'var(--color-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${m.pct}%`, background: MEAL_COLORS[m.type], borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weight tracking */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem', padding: '0 0.25rem' }}>Kilo Takibi</h3>

        {(currentWeight || goalWeight) && (
          <div style={{ ...card, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <WeightDisplay label="Güncel" value={currentWeight || '—'} color="var(--color-text)" />
            {goalWeight && currentWeight !== goalWeight && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '1.2rem', color: 'var(--color-text-mute)' }}>→</span>
                  {currentWeight && (
                    <p style={{ fontSize: '0.68rem', color: currentWeight > goalWeight ? '#f59e0b' : 'var(--color-accent)', textAlign: 'center', margin: '0.1rem 0 0', fontWeight: 600 }}>
                      {Math.abs(currentWeight - goalWeight).toFixed(1)} kg {currentWeight > goalWeight ? 'fazla' : 'eksik'}
                    </p>
                  )}
                </div>
                <WeightDisplay label="Hedef" value={goalWeight} color="var(--color-accent-text)" />
              </>
            )}
          </div>
        )}

        <form onSubmit={handleAddWeight} style={{ ...card, display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-soft)', marginBottom: '0.3rem' }}>Bugünkü Kilonu Gir</label>
            <input type="number" step="0.1" style={inp} placeholder="kg" value={weightInput} onChange={e => setWeightInput(e.target.value)} />
          </div>
          <button
            type="submit"
            style={{ width: 42, height: 42, borderRadius: '8px', border: 'none', background: 'var(--color-accent)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}
          >💾</button>
        </form>

        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>Kilo Grafiği</h3>
            {weightTrend && (
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: weightTrend.isFlat ? 'var(--color-text-mute)' : weightTrend.isDown ? 'var(--color-accent)' : '#ef4444' }}>
                {weightTrend.isFlat ? '— Sabit' : weightTrend.isDown ? `↓ −${weightTrend.diff} kg` : `↑ +${weightTrend.diff} kg`}
              </span>
            )}
          </div>
          <div style={{ height: 185, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              {weightHistory.length > 0 ? (
                <LineChart
                  data={weightHistory.map(w => ({ ...w, date: w.date.split('-').slice(1).join('/') }))}
                  margin={{ top: 4, right: 4, left: -22, bottom: 0 }}
                >
                  <XAxis dataKey="date" tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--color-text-mute)', fontSize: 11 }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-accent-text)', fontWeight: 700, fontSize: '0.82rem' }}
                    labelStyle={{ color: 'var(--color-text-mute)', fontSize: '0.7rem' }}
                  />
                  {goalWeight && (
                    <ReferenceLine y={goalWeight} stroke="var(--color-accent)" strokeDasharray="5 3" strokeWidth={1.5}
                      label={{ value: `${goalWeight} kg`, fill: 'var(--color-accent-text)', fontSize: 10, position: 'insideTopRight' }} />
                  )}
                  <defs>
                    <linearGradient id="kWGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="var(--color-accent)" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <Line type="monotone" dataKey="weight" stroke="url(#kWGrad)" strokeWidth={2.5}
                    dot={{ fill: 'var(--color-accent)', r: 3.5, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-mute)', margin: 0 }}>Henüz kilo verisi yok</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', margin: 0 }}>Yukarıdan ekle</p>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {weightHistory.length > 0 && (
          <div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', fontWeight: 600, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '0 0.25rem' }}>Kayıtlar</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[...weightHistory].reverse().slice(0, 10).map(w => (
                <div key={w.date} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '8px', padding: '0.5rem 0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{w.weight} kg</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{w.date}</span>
                  </div>
                  <button
                    onClick={() => deleteWeightRecord(w.date)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: 'var(--color-text-mute)', fontSize: '0.8rem', transition: 'color 0.15s' }}
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
    </div>
  );
}

function StatCard({ emoji, label, value, color, bg }) {
  return (
    <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ width: 36, height: 36, borderRadius: '9px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>{emoji}</div>
      <div>
        <p style={{ fontSize: '0.62rem', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.1rem' }}>{label}</p>
        <p style={{ fontSize: '0.95rem', fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</p>
      </div>
    </div>
  );
}

function SummaryCell({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 0.25rem' }}>
      <p style={{ fontSize: '0.62rem', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.15rem' }}>{label}</p>
      <p style={{ fontSize: '1.05rem', fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.6rem', color: 'var(--color-text-mute)', margin: '0.1rem 0 0' }}>kcal</p>
    </div>
  );
}

function WeightDisplay({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '0.62rem', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.15rem' }}>{label}</p>
      <p style={{ fontSize: '1.7rem', fontWeight: 800, color, margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', margin: '0.1rem 0 0' }}>kg</p>
    </div>
  );
}
