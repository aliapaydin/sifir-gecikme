'use client';

import { useState } from 'react';
import { STORE_LEVELS, STORE_LEVEL_BONUS, STAFF_ROLES, CITIES, SERVICES } from '@/lib/tech-center-data';
import { calcDailyFixedCost } from '@/lib/tech-center-engine';

function fmtMoney(n) {
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

function ServicePriceRow({ svc, currentPrice, setServicePriceAction }) {
  const [inputVal, setInputVal] = useState(currentPrice ? String(currentPrice) : '');

  return (
    <div style={{ padding: '0.875rem', borderRadius: '10px', background: 'var(--color-cream)', border: '0.5px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        <span style={{ fontSize: '1.2rem' }}>{svc.emoji}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{svc.label}</span>
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '8px' }}>Piyasa ort: {fmtMoney(svc.avgPrice)}</div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <input type="number" placeholder={String(svc.avgPrice)} value={inputVal} onChange={e => setInputVal(e.target.value)}
          style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-cream-card)', color: 'var(--color-text)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', outline: 'none', minWidth: 0 }}
        />
        <button onClick={() => { const p = parseFloat(inputVal); if (!isNaN(p) && p > 0) setServicePriceAction(svc.id, p); }}
          style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
          Kaydet
        </button>
      </div>
      {currentPrice && (
        <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
          ✓ Aktif: {fmtMoney(currentPrice)}
        </div>
      )}
    </div>
  );
}

export default function YonetimTab({ state, upgradeStoreAction, hireStaffAction, fireStaffAction, clearError, servicePrices, setServicePriceAction, takeLoanAction, resetGame }) {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!state) return null;

  const { storeLevel, staff = [], cash, upgradeError, staffError, city, currentDay } = state;
  const currentLevelInfo = STORE_LEVELS[storeLevel - 1];
  const nextLevelInfo = STORE_LEVELS[storeLevel];
  const cityInfo = CITIES[city];

  const dailyFixed = calcDailyFixedCost(state);

  // Kira tarihi (her 30 günde bir)
  const nextRentDay = Math.ceil(currentDay / 30) * 30;

  const handleHire = (role) => {
    hireStaffAction(role);
  };

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      {upgradeError && (
        <div style={{
          padding: '10px 16px',
          borderRadius: '8px',
          background: 'var(--color-amber-bg)',
          color: 'var(--color-amber-text)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
        }}>
          <span>⚠️ {upgradeError}</span>
          <button onClick={() => clearError('upgradeError')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-amber-text)' }}>×</button>
        </div>
      )}
      {staffError && (
        <div style={{
          padding: '10px 16px',
          borderRadius: '8px',
          background: 'var(--color-amber-bg)',
          color: 'var(--color-amber-text)',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
        }}>
          <span>⚠️ {staffError}</span>
          <button onClick={() => clearError('staffError')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--color-amber-text)' }}>×</button>
        </div>
      )}

      {/* 1. Mağaza Yükselt */}
      <section style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem' }}>
          🏪 Mağaza Seviyesi
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {/* Mevcut */}
          <div style={{
            padding: '1rem',
            borderRadius: '10px',
            background: 'var(--color-accent-soft)',
            border: '1.5px solid var(--color-accent)',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mevcut</div>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{currentLevelInfo.emoji}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{currentLevelInfo.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', marginTop: '4px' }}>
              Müşteri: {currentLevelInfo.customerRange[0]}-{currentLevelInfo.customerRange[1]}/gün
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>
              Depo: {currentLevelInfo.storage} adet
            </div>
            <div style={{ fontSize: '0.78rem', color: '#1D9E75', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              +{fmtMoney(STORE_LEVEL_BONUS[storeLevel - 1])} firma bonus
            </div>
          </div>

          {/* Sonraki */}
          {nextLevelInfo ? (
            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'var(--color-cream)',
              border: '1px solid var(--color-border)',
              opacity: cash < nextLevelInfo.upgradeCost ? 0.7 : 1,
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sonraki</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{nextLevelInfo.emoji}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{nextLevelInfo.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', marginTop: '4px' }}>
                Müşteri: {nextLevelInfo.customerRange[0]}-{nextLevelInfo.customerRange[1]}/gün
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>
                Depo: {nextLevelInfo.storage} adet
              </div>
              <div style={{ fontSize: '0.78rem', color: '#F59E0B', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                Maliyet: {fmtMoney(nextLevelInfo.upgradeCost)}
              </div>
            </div>
          ) : (
            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'var(--color-cream)',
              border: '1px dashed var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-mute)',
              fontSize: '0.9rem',
            }}>
              ✓ Maksimum Seviye
            </div>
          )}
        </div>

        {nextLevelInfo && (
          <button
            onClick={upgradeStoreAction}
            disabled={cash < nextLevelInfo.upgradeCost}
            style={{
              width: '100%',
              padding: '0.875rem',
              borderRadius: '10px',
              border: 'none',
              background: cash >= nextLevelInfo.upgradeCost ? 'var(--color-accent)' : 'var(--color-border)',
              color: cash >= nextLevelInfo.upgradeCost ? '#fff' : 'var(--color-text-mute)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: cash >= nextLevelInfo.upgradeCost ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            🏗️ {nextLevelInfo.label}&apos;a Yükselt – {fmtMoney(nextLevelInfo.upgradeCost)}
          </button>
        )}
      </section>

      {/* 2. Personel */}
      <section style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem' }}>
          👥 Personel
        </h2>

        {/* Mevcut personeller */}
        {staff.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              Çalışanlar ({staff.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {staff.map(member => {
                const roleInfo = STAFF_ROLES[member.role];
                return (
                  <div key={member.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.625rem 0.875rem',
                    background: 'var(--color-cream)',
                    borderRadius: '8px',
                    border: '0.5px solid var(--color-border)',
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>{roleInfo?.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>{roleInfo?.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>{roleInfo?.desc} • İşe alındı: Gün {member.hiredDay}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#E24B4A' }}>
                        -{fmtMoney(roleInfo?.salary || 0)}/ay
                      </div>
                    </div>
                    <button
                      onClick={() => fireStaffAction(member.id)}
                      title="Çıkar"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: '#E24B4A',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      Çıkar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* İşe Al */}
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          İşe Al
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.625rem' }}>
          {Object.values(STAFF_ROLES).map(role => {
            const currentCount = staff.filter(s => s.role === role.id).length;
            const canHire = currentCount < role.maxCount;
            const canAfford = cash >= role.salary;

            return (
              <div key={role.id} style={{
                padding: '0.875rem',
                borderRadius: '10px',
                background: 'var(--color-cream)',
                border: '1px solid var(--color-border)',
                opacity: !canHire ? 0.55 : 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{role.emoji}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{role.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginLeft: 'auto' }}>
                    {currentCount}/{role.maxCount}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {role.desc}
                </div>
                <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#E24B4A', marginBottom: '8px', fontWeight: 600 }}>
                  {fmtMoney(role.salary)}/ay
                </div>
                <button
                  onClick={() => canHire && canAfford && handleHire(role.id)}
                  disabled={!canHire || !canAfford}
                  style={{
                    width: '100%',
                    padding: '6px',
                    borderRadius: '7px',
                    border: 'none',
                    background: !canHire ? 'var(--color-border)' : !canAfford ? 'var(--color-amber-bg)' : 'var(--color-accent)',
                    color: !canHire ? 'var(--color-text-mute)' : !canAfford ? 'var(--color-amber-text)' : '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: (!canHire || !canAfford) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {!canHire ? 'Dolu' : !canAfford ? 'Yetersiz' : 'İşe Al'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Hizmet Fiyatları */}
      <section style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>🔧 Hizmet Fiyatları</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', marginBottom: '1rem' }}>Piyasa ortalamaları gösterilmektedir. Kendi fiyatını belirle.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '0.625rem' }}>
          {Object.values(SERVICES).map(svc => (
            <ServicePriceRow
              key={svc.id}
              svc={svc}
              currentPrice={(servicePrices || {})[svc.id]}
              setServicePriceAction={setServicePriceAction}
            />
          ))}
        </div>
      </section>

      {/* 4. Nakit & Özet */}
      <section style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1rem' }}>
          💳 Nakit & Giderler
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'Mevcut Nakit', value: fmtMoney(cash), color: '#1D9E75' },
            { label: 'Tahmini Günlük Gider', value: fmtMoney(dailyFixed), color: '#E24B4A' },
            { label: 'Aylık Kira', value: fmtMoney(cityInfo.rent), color: '#e8a04a' },
            { label: 'Sonraki Kira (Gün)', value: `Gün ${nextRentDay}`, color: 'var(--color-text-mute)' },
            { label: 'Şehir', value: `${cityInfo.emoji} ${cityInfo.label}`, color: 'var(--color-text)' },
            { label: 'Mağaza', value: `${currentLevelInfo.emoji} ${currentLevelInfo.label}`, color: 'var(--color-text)' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '0.875rem',
              background: 'var(--color-cream)',
              borderRadius: '10px',
              border: '0.5px solid var(--color-border)',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-mono)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Krediler */}
      <section style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
          🏦 Krediler
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', marginBottom: '1rem' }}>
          %10 faiz · 5 günde eşit günlük taksit · Ödeme günü sonunda otomatik kesilir.
        </p>

        {/* Aktif krediler */}
        {(state.loans || []).length === 0 ? (
          <div style={{ padding: '1rem', borderRadius: '10px', background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-mute)', textAlign: 'center' }}>
            Aktif kredi yok
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {(state.loans || []).map((loan, idx) => {
              const paidCount = 5 - loan.remainingPayments;
              return (
                <div key={loan.id} style={{
                  padding: '0.875rem',
                  borderRadius: '10px',
                  background: 'var(--color-cream)',
                  border: '1px solid #E24B4A33',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        Kredi #{idx + 1} — {fmtMoney(loan.amount)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginTop: '2px' }}>
                        Gün {loan.takenOnDay}'da çekildi · Geri ödeme: {fmtMoney(loan.totalRepayment)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E24B4A', fontFamily: 'var(--font-mono)' }}>
                        {fmtMoney(loan.dailyPayment)}/gün
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginTop: '2px' }}>
                        Sonraki: Gün {loan.nextPaymentDay}
                      </div>
                    </div>
                  </div>
                  {/* Taksit ilerlemesi */}
                  <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: '8px', borderRadius: '4px',
                          background: i < paidCount ? '#1D9E75' : i === paidCount ? '#F59E0B' : 'var(--color-border)',
                          transition: 'background 0.2s',
                        }}
                        title={i < paidCount ? `Taksit ${i + 1}: Ödendi` : i === paidCount ? `Taksit ${i + 1}: Sıradaki (Gün ${loan.nextPaymentDay})` : `Taksit ${i + 1}: Bekliyor`}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{paidCount}/5 taksit ödendi</span>
                    <span>Kalan borç: <b style={{ color: '#E24B4A', fontFamily: 'var(--font-mono)' }}>{fmtMoney(loan.dailyPayment * loan.remainingPayments)}</b></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Toplam kredi özeti */}
        {(state.loans || []).length > 0 && (
          <div style={{
            padding: '10px 14px', borderRadius: '10px',
            background: '#FEE2E222', border: '1px solid #E24B4A33',
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.82rem', marginBottom: '1rem',
          }}>
            <span style={{ color: 'var(--color-text-mute)' }}>Toplam kalan borç</span>
            <span style={{ fontWeight: 700, color: '#E24B4A', fontFamily: 'var(--font-mono)' }}>
              {fmtMoney((state.loans || []).reduce((s, l) => s + l.dailyPayment * l.remainingPayments, 0))}
            </span>
          </div>
        )}

        {/* Kredi çek butonu */}
        {takeLoanAction && (
          <button
            onClick={() => {
              // LoanModal yerine basit prompt — TopBar'daki modal yeterliyse bu section'da sadece yönlendirme
            }}
            style={{
              padding: '8px 20px', borderRadius: '9px', border: '1px solid var(--color-accent)',
              background: 'var(--color-accent-soft)', color: 'var(--color-accent)',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            }}
            title="Yeni kredi çekmek için TopBar'daki 💰 bakiye butonuna tıkla"
          >
            💰 Kredi Çekmek İçin Bakiye Butonuna Tıkla ↑
          </button>
        )}
      </section>

      {/* 6. Tehlikeli Bölge */}
      <section style={{ background: 'var(--color-cream-card)', border: '1px solid #E24B4A44', borderRadius: '14px', padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#E24B4A', marginBottom: '0.75rem' }}>
          ⚠️ Tehlikeli Bölge
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-mute)', marginBottom: '1rem' }}>
          Oyunu sıfırlayınca tüm ilerleme, nakit ve envanter silinir. Bu işlem geri alınamaz.
        </p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #E24B4A', background: 'transparent', color: '#E24B4A', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
            🔄 Oyunu Sıfırla
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-mute)' }}>Emin misin?</span>
            <button onClick={() => { resetGame(); setConfirmReset(false); }} style={{ padding: '7px 16px', borderRadius: '8px', border: 'none', background: '#E24B4A', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Evet, Sıfırla
            </button>
            <button onClick={() => setConfirmReset(false)} style={{ padding: '7px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-mute)', cursor: 'pointer' }}>
              İptal
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
