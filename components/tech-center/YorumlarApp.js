'use client';
import { useState, useEffect } from 'react';

function StarDisplay({ rating, size = 14 }) {
  return (
    <span style={{ color: '#F59E0B', fontSize: size }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function YorumlarApp({ state, markReviewsReadAction }) {
  const [filter, setFilter] = useState(0); // 0 = all
  const reviews = (state.reviews || []).sort((a, b) => b.reviewDay - a.reviewDay);
  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter);

  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
  const distribution = [5,4,3,2,1].map(r => ({ stars: r, count: reviews.filter(x => x.rating === r).length }));
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  // Mark all as read on mount
  useEffect(() => {
    if (reviews.some(r => !r.read)) markReviewsReadAction?.();
  }, []);

  const typeColors = { student: '#7F77DD', gamer: '#E24B4A', professional: '#185FA5', corporate: '#1D9E75', service: '#10B981', pc_order: '#F59E0B', direct: '#6B7280' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-cream)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-cream-card)', flexShrink: 0 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          Müşteri Yorumları
        </div>
        {reviews.length > 0 ? (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{avg.toFixed(1)}</div>
              <StarDisplay rating={Math.round(avg)} size={16} />
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginTop: '2px' }}>{reviews.length} yorum</div>
            </div>
            <div style={{ flex: 1 }}>
              {distribution.map(d => (
                <div key={d.stars} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)', width: 14 }}>{d.stars}★</span>
                  <div style={{ flex: 1, height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(d.count / maxCount) * 100}%`, background: d.stars >= 4 ? '#1D9E75' : d.stars === 3 ? '#e8a04a' : '#E24B4A', borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)', width: 20, textAlign: 'right' }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--color-text-mute)', fontSize: '0.85rem' }}>Henüz yorum yok. Ürün sat!</div>
        )}
      </div>

      {/* Filter */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 6, flexShrink: 0, background: 'var(--color-cream-card)' }}>
        {[0,5,4,3,2,1].map(r => (
          <button key={r} onClick={() => setFilter(r)} style={{
            padding: '4px 10px', borderRadius: 999,
            border: `1px solid ${filter === r ? 'var(--color-accent)' : 'var(--color-border)'}`,
            background: filter === r ? 'var(--color-accent-soft)' : 'transparent',
            color: filter === r ? 'var(--color-accent)' : 'var(--color-text-mute)',
            fontSize: '0.75rem', cursor: 'pointer', fontWeight: filter === r ? 600 : 400,
          }}>
            {r === 0 ? 'Tümü' : `${r}★`}
          </button>
        ))}
      </div>

      {/* Review list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {filtered.length === 0 && <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '0.85rem' }}>Bu filtre için yorum yok.</div>}
        {filtered.map(r => (
          <div key={r.id} style={{
            padding: '0.875rem 1rem', marginBottom: 6, borderRadius: 10,
            background: r.read ? 'var(--color-cream-card)' : 'var(--color-cream)',
            border: `1px solid ${r.read ? 'var(--color-border)' : 'var(--color-accent)44'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: (typeColors[r.customerType] || '#6B7280') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                {r.customerAvatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)' }}>{r.customerName}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>Gün {r.reviewDay}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                  <StarDisplay rating={r.rating} size={12} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{r.productName}</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-soft)', lineHeight: 1.5, fontStyle: 'italic', paddingLeft: 38 }}>
              "{r.comment}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
