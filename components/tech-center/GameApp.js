'use client';

import { useTechCenterState } from '@/lib/tech-center-state';
import { WIN_TARGET, LOGOS, CITIES, STORE_LEVELS } from '@/lib/tech-center-data';
import SetupScreen from './SetupScreen';
import TopBar from './TopBar';
import Desktop from './Desktop';

function fmtMoney(n) {
  if (n >= 1_000_000_000) return `₺${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `₺${Math.round(n / 1000)}K`;
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

// Konfeti bileşeni
function Konfeti() {
  const pieces = Array.from({ length: 40 }, (_, i) => i);
  const colors = ['#1D9E75','#E24B4A','#7F77DD','#e8a04a','#0EA5E9','#F59E0B','#8B5CF6','#10B981'];

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1000 }}>
      {pieces.map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i * 2.5) % 100}%`,
            top: '-20px',
            width: `${6 + (i % 4) * 3}px`,
            height: `${6 + (i % 3) * 3}px`,
            borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '2px' : '0',
            background: colors[i % colors.length],
            animation: `konfetiFall ${2 + (i % 3)}s ${(i * 0.1) % 2}s linear infinite`,
            opacity: 0.8,
          }}
        />
      ))}
      <style>{`
        @keyframes konfetiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

// Gün başı ekranı
function DayNewScreen({ state, onStart }) {
  const { currentDay, deliveredToday = [], activeEvents = [], newEventsToday = [], newUnlocksToday = [] } = state;

  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      background: 'var(--color-cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '520px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-serif)', margin: 0 }}>
            Gün {currentDay} Başlıyor
          </h2>
        </div>

        {/* Yeni unlock'lar */}
        {newUnlocksToday.length > 0 && (
          <div style={{
            padding: '1rem',
            borderRadius: '10px',
            background: 'var(--color-correct-bg)',
            border: '1px solid var(--color-correct-text)',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-correct-text)', marginBottom: '6px' }}>
              🎉 Yeni Kategoriler Açıldı!
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {newUnlocksToday.map(cat => (
                <span key={cat} style={{
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'var(--color-correct-text)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Teslimatlar */}
        {deliveredToday.length > 0 && (
          <div style={{
            padding: '1rem',
            borderRadius: '10px',
            background: 'var(--color-cream)',
            border: '1px solid var(--color-border)',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📦 Gelen Teslimatlar ({deliveredToday.length})
            </div>
            {deliveredToday.map(o => (
              <div key={o.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                padding: '4px 0',
                borderBottom: '0.5px solid var(--color-border)',
                color: 'var(--color-text)',
              }}>
                <span>+{o.quantity}× {o.productId}</span>
                <span style={{ color: '#1D9E75', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>+{o.quantity}</span>
              </div>
            ))}
          </div>
        )}

        {/* Aktif olaylar */}
        {activeEvents.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              📣 Aktif Olaylar
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeEvents.map(ev => (
                <div key={ev.id} style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  background: ev.type === 'good' ? 'var(--color-correct-bg)' : ev.type === 'bad' ? 'var(--color-amber-bg)' : 'var(--color-cream)',
                  border: '0.5px solid var(--color-border)',
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {ev.title}
                    <span style={{ fontSize: '0.72rem', marginLeft: '8px', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
                      {ev.endsOnDay - currentDay} gün kaldı
                    </span>
                    {newEventsToday.some(e => e.id === ev.id) && (
                      <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: '#E24B4A', color: '#fff', padding: '1px 6px', borderRadius: '999px' }}>YENİ</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', marginTop: '2px' }}>
                    {ev.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Güne Başla →
        </button>
      </div>
    </div>
  );
}

// Gün özeti modal
function DaySummaryModal({ state, onNext }) {
  const { daySummary } = state;
  if (!daySummary) return null;

  const progress = Math.min(1, daySummary.newFirmaValue / WIN_TARGET);
  const progressPct = (progress * 100).toFixed(2);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 500,
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌙</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-serif)', margin: 0 }}>
            Gün {daySummary.day} Özeti
          </h2>
        </div>

        {/* Finansal özet */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Gelir', value: fmtMoney(daySummary.revenue), color: '#1D9E75' },
            { label: 'COGS', value: fmtMoney(daySummary.cogs), color: '#E24B4A' },
            { label: 'Net Kâr', value: fmtMoney(daySummary.profit), color: daySummary.profit >= 0 ? '#1D9E75' : '#E24B4A' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '0.75rem',
              background: 'var(--color-cream)',
              borderRadius: '8px',
              textAlign: 'center',
              border: '0.5px solid var(--color-border)',
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Gider */}
        <div style={{
          padding: '0.5rem 0.75rem',
          background: 'var(--color-cream)',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--color-text-mute)',
        }}>
          <span>Sabit Giderler</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#E24B4A' }}>-{fmtMoney(daySummary.expenses)}</span>
        </div>

        {/* Müşteri istatistikleri */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
              {daySummary.customerCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>Müşteri</div>
          </div>
          <div style={{ width: '1px', background: 'var(--color-border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1D9E75', fontFamily: 'var(--font-mono)' }}>
              {daySummary.salesCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>Satış</div>
          </div>
          <div style={{ width: '1px', background: 'var(--color-border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7F77DD', fontFamily: 'var(--font-mono)' }}>
              {daySummary.customerCount > 0 ? Math.round(daySummary.salesCount / daySummary.customerCount * 100) : 0}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>Dönüşüm</div>
          </div>
        </div>

        {/* Firma değeri */}
        <div style={{
          padding: '0.875rem',
          background: 'var(--color-cream)',
          borderRadius: '10px',
          border: '0.5px solid var(--color-border)',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--color-text-mute)' }}>Firma Değeri</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>{fmtMoney(daySummary.prevFirmaValue)}</span>
              <span style={{ color: 'var(--color-text-mute)' }}>→</span>
              <span style={{ color: '#1D9E75', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmtMoney(daySummary.newFirmaValue)}</span>
            </div>
          </div>
          <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'var(--color-accent)',
              borderRadius: '999px',
              transition: 'width 0.5s',
            }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginTop: '4px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            %{progressPct} / ₺1B hedef
          </div>
        </div>

        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: '0.875rem',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Sonraki Güne Geç →
        </button>
      </div>
    </div>
  );
}

// Kazanma ekranı
function WinScreen({ state, onReset }) {
  const logo = LOGOS.find(l => l.id === state.logoId) || LOGOS[0];
  const city = CITIES[state.city];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-cream)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      textAlign: 'center',
    }}>
      <Konfeti />
      <div style={{
        background: 'var(--color-cream-card)',
        border: '2px solid var(--color-accent)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 20px 80px rgba(0,0,0,0.15)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', fontFamily: 'var(--font-serif)', margin: '0 0 0.5rem' }}>
          Tebrikler!
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-mute)', marginBottom: '2rem' }}>
          ₺1.000.000.000 hedefine ulaştın!
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.25rem',
          background: 'var(--color-cream)',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '0.5px solid var(--color-border)',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: logo.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            flexShrink: 0,
          }}>
            {logo.emoji}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
              {state.companyName}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-mute)' }}>
              {city?.emoji} {city?.label} • {STORE_LEVELS[state.storeLevel - 1]?.label}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', background: 'var(--color-cream)', borderRadius: '10px', border: '0.5px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>Tamamlandığı Gün</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
              {state.wonOnDay}
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--color-cream)', borderRadius: '10px', border: '0.5px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>Toplam Satış</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1D9E75', fontFamily: 'var(--font-mono)' }}>
              {(state.allTimeSales || []).length}
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🔄 Yeniden Oyna
        </button>
      </div>
    </div>
  );
}

export default function GameApp() {

  const {
    state,
    loaded,
    firmaValue,
    dailyFixedCost,
    startGame,
    resetGame,
    startDay,
    closeDay,
    nextDay,
    orderProduct,
    setPriceAction,
    upgradeStoreAction,
    hireStaffAction,
    fireStaffAction,
    sellAction,
    skipAction,
    clearError,
    handleServiceAction,
    setServicePriceAction,
    sellSecondHandAction,
    delayCustomerAction,
    buildPCAction,
    sellBuiltPCAction,
    cancelOrderAction,
    takeLoanAction,
    clearCancelNotif,
    addToShoppingListAction,
    removeFromShoppingListAction,
  } = useTechCenterState();

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-cream)' }}>
        <div style={{ color: 'var(--color-text-mute)', fontSize: '1rem' }}>Yükleniyor...</div>
      </div>
    );
  }

  // Setup ekranı
  if (!state) {
    return <SetupScreen onStart={startGame} />;
  }

  // Kazanma ekranı
  if (state.gamePhase === 'won') {
    return <WinScreen state={state} onReset={resetGame} />;
  }

  // Gün başlangıcı ekranı (tab bar YOK)
  if (state.gamePhase === 'day_new') {
    return (
      <div>
        <TopBar
          state={state}
          firmaValue={firmaValue}
          onStartDay={startDay}
          onCloseDay={closeDay}
        />
        <DayNewScreen state={state} onStart={startDay} />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--color-cream)' }}>
      <TopBar state={state} firmaValue={firmaValue} onStartDay={startDay} onCloseDay={closeDay} takeLoanAction={takeLoanAction} clearCancelNotif={clearCancelNotif} />
      <Desktop
        state={state}
        firmaValue={firmaValue}
        sellAction={sellAction}
        skipAction={skipAction}
        handleServiceAction={handleServiceAction}
        delayCustomerAction={delayCustomerAction}
        orderProduct={orderProduct}
        setPriceAction={setPriceAction}
        clearError={clearError}
        sellSecondHandAction={sellSecondHandAction}
        buildPCAction={buildPCAction}
        sellBuiltPCAction={sellBuiltPCAction}
        cancelOrderAction={cancelOrderAction}
        takeLoanAction={takeLoanAction}
        addToShoppingListAction={addToShoppingListAction}
        removeFromShoppingListAction={removeFromShoppingListAction}
        upgradeStoreAction={upgradeStoreAction}
        hireStaffAction={hireStaffAction}
        fireStaffAction={fireStaffAction}
        setServicePriceAction={setServicePriceAction}
        resetGame={resetGame}
      />
      {state.gamePhase === 'day_summary' && <DaySummaryModal state={state} onNext={nextDay} />}
    </div>
  );
}
