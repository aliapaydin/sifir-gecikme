'use client';

import { useState, useEffect } from 'react';
import { LOGOS, WIN_TARGET } from '@/lib/tech-center-data';
import { LOAN_OPTIONS } from '@/lib/tech-center-engine';

function fmtMoney(n) {
  if (n >= 1_000_000_000) return `₺${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `₺${Math.round(n / 1000)}K`;
  return `₺${Math.round(n).toLocaleString('tr-TR')}`;
}

function getSatisfactionColor(s) {
  if (s >= 80) return '#1D9E75';
  if (s >= 60) return '#F59E0B';
  if (s >= 40) return '#E87B2A';
  return '#E24B4A';
}
function getSatisfactionEmoji(s) {
  if (s >= 80) return '😊';
  if (s >= 60) return '😐';
  if (s >= 40) return '😟';
  return '😡';
}

// Küçük badge bileşeni — hover'da tooltip gösterir
function Badge({ icon, value, color, tooltip, onClick, highlight }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="tc-badge"
      title={tooltip}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: highlight ? 'rgba(226,75,74,0.12)' : 'var(--color-cream)',
        border: `1px solid ${highlight ? '#E24B4A55' : 'var(--color-border)'}`,
        borderRadius: '8px',
        padding: '4px 12px',
        fontSize: '0.85rem',
        color: color || 'var(--color-text)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transform: hover && onClick ? 'translateY(-1px)' : 'none',
        transition: 'transform 0.1s, box-shadow 0.1s',
        boxShadow: hover && onClick ? '0 3px 8px rgba(0,0,0,0.12)' : 'none',
        whiteSpace: 'nowrap',
        position: 'relative',
      }}
    >
      {icon} {value}
      {onClick && (
        <span style={{
          position: 'absolute', bottom: '-1px', right: '4px',
          fontSize: '0.5rem', color: 'var(--color-accent)',
          opacity: hover ? 1 : 0, transition: 'opacity 0.1s',
        }}>▼</span>
      )}
    </div>
  );
}

// Kredi çekme modalı
function LoanModal({ state, onTake, onClose }) {
  const activeLoanTotal = (state.loans || []).reduce((s, l) => s + l.dailyPayment * l.remainingPayments, 0);
  const [selected, setSelected] = useState(null);

  const handleTake = () => {
    if (!selected) return;
    onTake(selected.amount);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 900,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '18px',
          padding: '1.75rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
          🏦 Kredi Çek
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', marginBottom: '1.25rem' }}>
          %10 faiz · 5 günde eşit taksit ödemesi
        </div>

        {/* Aktif krediler */}
        {(state.loans || []).length > 0 && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: '#FEE2E222',
            border: '1px solid #E24B4A33',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E24B4A', marginBottom: '6px' }}>
              Aktif Krediler
            </div>
            {(state.loans || []).map(loan => (
              <div key={loan.id} style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span>Gün {loan.takenOnDay} · {fmtMoney(loan.amount)}</span>
                <span style={{ color: '#E24B4A', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  {loan.remainingPayments} taksit · {fmtMoney(loan.dailyPayment)}/gün
                </span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '6px', paddingTop: '6px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-mute)' }}>Kalan toplam borç</span>
              <span style={{ color: '#E24B4A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{fmtMoney(activeLoanTotal)}</span>
            </div>
          </div>
        )}

        {/* Seçenekler */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
          {LOAN_OPTIONS.map(opt => {
            const totalRepayment = Math.round(opt.amount * 1.10);
            const daily = Math.ceil(totalRepayment / 5);
            const isSel = selected?.amount === opt.amount;
            return (
              <div
                key={opt.amount}
                onClick={() => setSelected(opt)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${isSel ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isSel ? 'var(--color-accent-soft)' : 'var(--color-cream)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 800, color: isSel ? 'var(--color-accent)' : 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', marginTop: '4px' }}>
                  Geri: {fmtMoney(totalRepayment)}
                </div>
                <div style={{ fontSize: '0.72rem', color: isSel ? 'var(--color-accent)' : '#E24B4A', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {fmtMoney(daily)}/gün × 5
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleTake}
            disabled={!selected}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none',
              background: selected ? 'var(--color-accent)' : 'var(--color-border)',
              color: selected ? '#fff' : 'var(--color-text-mute)',
              fontSize: '0.9rem', fontWeight: 700,
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            Kredi Çek
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.25rem', borderRadius: '10px',
              border: '1px solid var(--color-border)',
              background: 'transparent', color: 'var(--color-text-mute)',
              fontSize: '0.9rem', cursor: 'pointer',
            }}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopBar({ state, firmaValue, onStartDay, onCloseDay, takeLoanAction, clearCancelNotif }) {
  const [showLoan, setShowLoan] = useState(false);
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const root = document.getElementById('v3-root');
    setIsLight(root?.classList.contains('v3-light') || false);
  }, []);
  const toggleTheme = () => {
    const root = document.getElementById('v3-root');
    if (!root) return;
    const nowLight = root.classList.contains('v3-light');
    if (nowLight) {
      root.classList.remove('v3-light');
      localStorage.setItem('v3_theme', 'dark');
      setIsLight(false);
    } else {
      root.classList.add('v3-light');
      localStorage.setItem('v3_theme', 'light');
      setIsLight(true);
    }
  };

  if (!state) return null;

  const logo = LOGOS.find(l => l.id === state.logoId) || LOGOS[0];
  const progress = Math.min(1, firmaValue / WIN_TARGET);
  const progressPct = (progress * 100).toFixed(1);

  const phase = state.gamePhase;
  const canStart = phase === 'day_new';
  const canClose = phase === 'day_active';

  const hasLoans = (state.loans || []).length > 0;
  const totalLoanDebt = (state.loans || []).reduce((s, l) => s + l.dailyPayment * l.remainingPayments, 0);
  const nextLoanPayment = hasLoans
    ? Math.min(...(state.loans || []).map(l => l.nextPaymentDay))
    : null;

  return (
    <>
      {/* Sipariş iptal bildirimi */}
      {state.cancelNotif && (
        <div style={{
          position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)',
          background: '#FEF3C7', border: '1px solid #F59E0B',
          borderRadius: '10px', padding: '10px 16px',
          zIndex: 999,
          display: 'flex', alignItems: 'center', gap: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          fontSize: '0.85rem', color: '#92400E', fontWeight: 500,
          maxWidth: '480px',
        }}>
          <span style={{ flex: 1 }}>{state.cancelNotif}</span>
          <button
            onClick={clearCancelNotif}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', fontSize: '1rem', lineHeight: 1, padding: 0 }}
          >×</button>
        </div>
      )}

      {showLoan && takeLoanAction && (
        <LoanModal
          state={state}
          onTake={takeLoanAction}
          onClose={() => setShowLoan(false)}
        />
      )}

      <style>{`
        @media (max-width: 767px) {
          .tc-topbar-brand { display: none !important; }
          .tc-topbar-root { padding: 5px 10px !important; gap: 4px 6px !important; flex-wrap: wrap !important; align-items: center !important; }

          /* Satır 1: stat rozatları — tam genişlik */
          .tc-stats { order: 1; flex: 1 1 100% !important; flex-wrap: nowrap !important; gap: 4px !important; justify-content: flex-start !important; overflow-x: auto !important; scrollbar-width: none !important; }
          .tc-stats::-webkit-scrollbar { display: none !important; }
          /* Firma değeri rozeti mobilde gizle (ikincil bilgi, satırı taşırıyor) */
          .tc-firma-val { display: none !important; }

          /* Satır 2: olaylar (solda) + aksiyonlar (sağda) */
          .tc-topbar-events { order: 2; flex: 1 1 auto !important; }
          .tc-topbar-actions { order: 2; margin-left: auto !important; flex-shrink: 0 !important; }

          .tc-badge { padding: 3px 7px !important; font-size: 0.75rem !important; border-radius: 6px !important; }
          .tc-topbar-btn { padding: 5px 11px !important; font-size: 0.8rem !important; border-radius: 8px !important; }
          .tc-topbar-theme { width: 28px !important; height: 28px !important; font-size: 0.9rem !important; }
        }
      `}</style>
      <div className="tc-topbar-root" style={{
        background: 'var(--color-cream-card)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0.625rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        flexShrink: 0,
        zIndex: 40,
      }}>
        {/* Sol: Logo + Firma */}
        <div className="tc-topbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: logo.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', flexShrink: 0,
          }}>
            {logo.emoji}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>
              {state.companyName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>Tech Center</div>
          </div>
        </div>

        {/* Orta: Stats */}
        <div className="tc-stats" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Badge
            icon="📅"
            value={state.currentDay}
            tooltip="Oyunun kaçıncı günündesin"
          />
          <Badge
            icon="💰"
            value={fmtMoney(state.cash)}
            color="#1D9E75"
            tooltip="Mevcut nakit — tıkla kredi çek"
            onClick={() => setShowLoan(true)}
            highlight={state.cash < 2000}
          />
          {(state.xp || 0) > 0 && (
            <Badge
              icon="⭐"
              value={`${state.xp} XP`}
              color="#7F77DD"
              tooltip="Deneyim puanı — servis ve satışlardan kazanılır"
            />
          )}
          <Badge
            icon={getSatisfactionEmoji(state.satisfaction || 75)}
            value={`${Math.round(state.satisfaction || 75)}%`}
            color={getSatisfactionColor(state.satisfaction || 75)}
            tooltip="Müşteri memnuniyeti — müşteri kaybedince düşer, satış yapınca artar"
          />

          {/* Kredi borcu */}
          {hasLoans && (
            <Badge
              icon="📋"
              value={`${fmtMoney(totalLoanDebt)} borç`}
              color="#E24B4A"
              tooltip={`Aktif kredi borcu · Sonraki taksit: Gün ${nextLoanPayment}`}
              highlight
            />
          )}

          {/* Firma değeri — mobilde gizlenir (tc-firma-val) */}
          <div className="tc-firma-val" style={{ display: 'contents' }}>
            <Badge
              icon="🏆"
              value={fmtMoney(firmaValue)}
              color="var(--color-text-mute)"
              tooltip="Firma değeri = Nakit + Stok değeri × 1.5 + Mağaza bonusu. Hedef: ₺1 Milyar"
            />
          </div>
        </div>

        {/* Aktif Olaylar */}
        {state.activeEvents && state.activeEvents.length > 0 && (
          <div className="tc-topbar-events" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {state.activeEvents.map(ev => (
              <span
                key={ev.id}
                title={ev.desc}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  background: ev.type === 'good' ? 'var(--color-correct-bg)' : ev.type === 'bad' ? 'var(--color-amber-bg)' : 'var(--color-cream)',
                  color: ev.type === 'good' ? 'var(--color-correct-text)' : ev.type === 'bad' ? 'var(--color-amber-text)' : 'var(--color-text-mute)',
                  border: '0.5px solid var(--color-border)',
                  cursor: 'help',
                  whiteSpace: 'nowrap',
                }}
              >
                {ev.title.split(' ')[0]} Gün {ev.endsOnDay - state.currentDay + 1}
              </span>
            ))}
          </div>
        )}

        {/* Sağ: Tema Toggle + Gün Butonu */}
        <div className="tc-topbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            className="tc-topbar-theme"
            onClick={toggleTheme}
            title={isLight ? 'Karanlık Moda Geç' : 'Aydınlık Moda Geç'}
            style={{
              width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--color-border)',
              background: 'var(--color-cream)', color: 'var(--color-text)',
              fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isLight ? '🌙' : '☀️'}
          </button>
          {canStart && (
            <button
              className="tc-topbar-btn"
              onClick={onStartDay}
              style={{
                padding: '8px 18px', borderRadius: '10px', border: 'none',
                background: 'var(--color-accent)', color: '#fff',
                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Güne Başla →
            </button>
          )}
          {canClose && (
            <button
              className="tc-topbar-btn"
              onClick={onCloseDay}
              style={{
                padding: '8px 18px', borderRadius: '10px', border: 'none',
                background: '#E24B4A', color: '#fff',
                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              Günsonu ✓
            </button>
          )}
          {!canStart && !canClose && (
            <div className="tc-topbar-btn" style={{
              padding: '8px 18px', borderRadius: '10px',
              background: 'var(--color-cream)', border: '1px solid var(--color-border)',
              fontSize: '0.85rem', color: 'var(--color-text-mute)', whiteSpace: 'nowrap',
            }}>
              {phase === 'day_summary' ? '📊 Özet' : phase === 'won' ? '🏆 Kazandın!' : '...'}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
