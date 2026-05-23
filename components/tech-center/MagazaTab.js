'use client';

import { useState } from 'react';
import { PRODUCTS, CUSTOMER_TYPES, CATEGORY_LABELS, CATEGORY_COLORS, SERVICES } from '@/lib/tech-center-data';
import { attemptSale } from '@/lib/tech-center-engine';

function fmtMoney(n) {
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

function CustomerCard({ customer, inventory, prices, onSell, onSkip, disabled }) {
  const [customPrice, setCustomPrice] = useState('');
  const [result, setResult] = useState(null); // {type, msg}

  const product = PRODUCTS[customer.wantedProductId];
  const ctype = CUSTOMER_TYPES[customer.type];
  const inStock = (inventory[customer.wantedProductId] || 0);
  const hasStock = inStock >= customer.quantity;
  const listedPrice = prices[customer.wantedProductId];
  const isDealt = customer.dealt || customer.skipped;

  const handleSell = (price) => {
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return;
    const salesResult = attemptSale(customer, p);

    if (salesResult.success) {
      setResult({ type: 'success', msg: `Satıldı! ${fmtMoney(p * customer.quantity)}` });
      onSell(customer.id, p);
    } else if (salesResult.counterOffer !== undefined) {
      setResult({ type: 'counter', msg: `Karşı teklif: ${fmtMoney(salesResult.counterOffer * customer.quantity)}`, counterPrice: salesResult.counterOffer });
    } else if (salesResult.tooExpensive) {
      setResult({ type: 'fail', msg: 'Çok pahalı buldu, gitti.' });
      onSkip(customer.id);
    }
  };

  const handleAcceptCounter = () => {
    if (result?.counterPrice) {
      onSell(customer.id, result.counterPrice);
      setResult({ type: 'success', msg: `Satıldı! ${fmtMoney(result.counterPrice * customer.quantity)}` });
    }
  };

  if (!product) return null;

  const catColor = CATEGORY_COLORS[product.category] || '#888';
  const dealt = customer.dealt || isDealt;

  return (
    <div style={{
      border: `1px solid var(--color-border)`,
      borderRadius: '12px',
      background: dealt
        ? 'var(--color-cream)'
        : 'var(--color-cream-card)',
      padding: '1rem',
      opacity: dealt ? 0.6 : 1,
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: ctype?.color + '22',
          border: `1.5px solid ${ctype?.color}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0,
        }}>
          {customer.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>{customer.name}</span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 7px',
              borderRadius: '999px',
              background: ctype?.color + '22',
              color: ctype?.color,
              fontWeight: 500,
            }}>
              {ctype?.label}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', marginTop: '2px' }}>
            Bütçe: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 600 }}>{fmtMoney(customer.budget)}</span>
            {customer.quantity > 1 && <span style={{ marginLeft: '6px', color: 'var(--color-text-mute)' }}>× {customer.quantity} adet</span>}
          </div>
        </div>
        {dealt && customer.result && (
          <span style={{
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: '6px',
            background: customer.result === 'sold' ? 'var(--color-correct-bg)' : 'var(--color-amber-bg)',
            color: customer.result === 'sold' ? 'var(--color-correct-text)' : 'var(--color-amber-text)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            {customer.result === 'sold' ? '✓ Satıldı' : customer.result === 'skipped' ? '→ Geçildi' : customer.result === 'too_expensive' ? '✗ Pahalı' : '↩ Karşı'}
          </span>
        )}
      </div>

      {/* Ürün */}
      <div style={{
        padding: '0.625rem 0.75rem',
        background: 'var(--color-cream)',
        borderRadius: '8px',
        marginBottom: '0.75rem',
        border: '0.5px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.5rem' }}>{product.icon}</span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 7px',
            borderRadius: '5px',
            background: catColor + '22',
            color: catColor,
            fontWeight: 500,
            flexShrink: 0,
          }}>
            {CATEGORY_LABELS[product.category]}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {product.brand} {product.name}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', marginTop: '4px' }}>
          {product.specs}
          {!hasStock && (
            <span style={{ color: '#E24B4A', marginLeft: '8px', fontWeight: 600 }}>• Stokta yok</span>
          )}
          {hasStock && (
            <span style={{ color: '#1D9E75', marginLeft: '8px' }}>• Stok: {inStock}</span>
          )}
        </div>
      </div>

      {/* Aksiyon */}
      {!dealt && !disabled && (
        <div>
          {!hasStock ? (
            <button
              onClick={() => onSkip(customer.id)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-mute)',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Stok Yok – Geç →
            </button>
          ) : (
            <div>
              {result?.type === 'counter' && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--color-amber-bg)',
                  color: 'var(--color-amber-text)',
                  fontSize: '0.82rem',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}>
                  <span>💬 {result.msg}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={handleAcceptCounter}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#1D9E75',
                        color: '#fff',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >Kabul Et</button>
                    <button
                      onClick={() => { setResult(null); onSkip(customer.id); }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        color: 'var(--color-text-mute)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >Reddet</button>
                  </div>
                </div>
              )}

              {result?.type === 'fail' && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--color-amber-bg)',
                  color: 'var(--color-amber-text)',
                  fontSize: '0.82rem',
                  marginBottom: '8px',
                }}>
                  ✗ {result.msg}
                </div>
              )}

              {result?.type === 'success' && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--color-correct-bg)',
                  color: 'var(--color-correct-text)',
                  fontSize: '0.82rem',
                  marginBottom: '8px',
                  fontWeight: 600,
                }}>
                  ✓ {result.msg}
                </div>
              )}

              {!result && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                  {listedPrice && (
                    <button
                      onClick={() => handleSell(listedPrice)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'var(--color-accent)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmtMoney(listedPrice * customer.quantity)}&apos;e Sat
                    </button>
                  )}
                  <div style={{ display: 'flex', gap: '4px', flex: listedPrice ? '1' : '2' }}>
                    <input
                      type="number"
                      placeholder="Fiyat gir"
                      value={customPrice}
                      onChange={e => setCustomPrice(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-cream)',
                        color: 'var(--color-text)',
                        fontSize: '0.85rem',
                        minWidth: 0,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                      }}
                      onKeyDown={e => { if (e.key === 'Enter') handleSell(customPrice); }}
                    />
                    <button
                      onClick={() => handleSell(customPrice)}
                      disabled={!customPrice}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: customPrice ? '#7F77DD' : 'var(--color-border)',
                        color: customPrice ? '#fff' : 'var(--color-text-mute)',
                        fontSize: '0.85rem',
                        cursor: customPrice ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Sat
                    </button>
                  </div>
                  <button
                    onClick={() => onSkip(customer.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      background: 'transparent',
                      color: 'var(--color-text-mute)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Geç
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ServiceCustomerCard({ customer, servicePrices, onService, onSkip, onSuccess, disabled }) {
  const [counterInput, setCounterInput] = useState('');
  // phase: 'idle' | 'pending_confirm' | 'rejected'
  const [phase, setPhase] = useState('idle');
  const [pendingPrice, setPendingPrice] = useState(null);

  const service = SERVICES[customer.requestedServiceId];
  const myPrice = servicePrices[customer.requestedServiceId] || service?.avgPrice || 0;
  const offeredPrice = customer.offeredPrice;
  const isDealt = customer.dealt || customer.skipped;

  const handleAccept = () => {
    onService(customer.id, true, undefined);
    onSuccess({ serviceName: service?.label || 'Hizmet', price: offeredPrice, xpGained: service?.xpReward || Math.round(offeredPrice / 100) });
  };

  const handleSendCounter = () => {
    const p = parseFloat(counterInput);
    if (isNaN(p) || p <= 0) return;
    const maxAccept = offeredPrice * (1 + (customer.negotiationBuffer || 0.15));
    if (p <= maxAccept) {
      setPendingPrice(p);
      setPhase('pending_confirm');
    } else {
      setPhase('rejected');
      onSkip(customer.id);
    }
  };

  const handleConfirmCounter = () => {
    if (!pendingPrice) return;
    onService(customer.id, true, pendingPrice);
    onSuccess({ serviceName: service?.label || 'Hizmet', price: pendingPrice, xpGained: service?.xpReward || Math.round(pendingPrice / 100) });
  };

  const handleCancelCounter = () => {
    setPhase('idle');
    setPendingPrice(null);
    setCounterInput('');
  };

  if (!service) return null;

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      background: isDealt ? 'var(--color-cream)' : 'var(--color-cream-card)',
      padding: '1rem',
      opacity: isDealt ? 0.6 : 1,
      borderLeft: '3px solid #10B981',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#10B98122', border: '1.5px solid #10B98144', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
          {customer.avatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>{customer.name}</span>
            <span style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: '999px', background: '#10B98122', color: '#10B981', fontWeight: 500 }}>
              🔧 Servis
            </span>
          </div>
        </div>
        {isDealt && customer.result && (
          <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: customer.result === 'sold' ? 'var(--color-correct-bg)' : 'var(--color-amber-bg)', color: customer.result === 'sold' ? 'var(--color-correct-text)' : 'var(--color-amber-text)', fontWeight: 600 }}>
            {customer.result === 'sold' ? '✓ Yapıldı' : '→ Geçildi'}
          </span>
        )}
      </div>

      {/* Hizmet Detayı */}
      <div style={{ padding: '0.625rem 0.75rem', background: 'var(--color-cream)', borderRadius: '8px', marginBottom: '0.75rem', border: '0.5px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{service.emoji}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{service.label}</span>
          <span style={{ fontSize: '0.7rem', color: '#7F77DD', marginLeft: 'auto', fontWeight: 600 }}>+{service.xpReward} XP</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', marginTop: '3px' }}>{service.desc}</div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: '#10B981', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            Teklif: {fmtMoney(offeredPrice)}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
            Listem: {fmtMoney(myPrice)}
          </span>
        </div>
        {customer.requestedServiceId === 'upgrade' && customer.oldPartId && (
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', marginTop: '4px' }}>
            📦 İkinci el gelecek: {PRODUCTS[customer.oldPartId]?.name || customer.oldPartId}
          </div>
        )}
      </div>

      {/* Aksiyon */}
      {!isDealt && !disabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {phase === 'idle' && (
            <>
              {/* Kabul Et */}
              <button onClick={handleAccept} style={{ width: '100%', padding: '9px', borderRadius: '8px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                ✓ Kabul Et — {fmtMoney(offeredPrice)}
              </button>
              {/* Pazarlık */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  placeholder="Karşı fiyat teklifin"
                  value={counterInput}
                  onChange={e => setCounterInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendCounter(); }}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-cream)', color: 'var(--color-text)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', outline: 'none', minWidth: 0 }}
                />
                <button onClick={handleSendCounter} disabled={!counterInput} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: counterInput ? '#7F77DD' : 'var(--color-border)', color: counterInput ? '#fff' : 'var(--color-text-mute)', fontWeight: 600, cursor: counterInput ? 'pointer' : 'not-allowed', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                  Teklif Gönder
                </button>
              </div>
              {/* Geç */}
              <button onClick={() => onSkip(customer.id)} style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-mute)', cursor: 'pointer', fontSize: '0.82rem' }}>
                Geç →
              </button>
            </>
          )}

          {phase === 'pending_confirm' && (
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--color-correct-bg)', border: '1px solid #10B98144' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-correct-text)', marginBottom: '8px' }}>
                ✓ Müşteri {fmtMoney(pendingPrice)}&apos;e razı oldu!
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleConfirmCounter} style={{ flex: 1, padding: '8px', borderRadius: '7px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                  Onayla ✓
                </button>
                <button onClick={handleCancelCounter} style={{ padding: '8px 12px', borderRadius: '7px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-mute)', cursor: 'pointer', fontSize: '0.82rem' }}>
                  Vazgeç
                </button>
              </div>
            </div>
          )}

          {phase === 'rejected' && (
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--color-amber-bg)', color: 'var(--color-amber-text)', fontSize: '0.82rem' }}>
              ✗ Fiyatı çok yüksek buldu, gitti.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MagazaTab({ state, sellAction, skipAction, servicePrices, handleServiceAction }) {
  const [successModal, setSuccessModal] = useState(null); // { serviceName, price, xpGained }

  if (!state) return null;
  const { customersToday = [], inventory = {}, prices = {}, gamePhase, skippedCount = 0 } = state;
  const isActive = gamePhase === 'day_active';

  const pending = customersToday.filter(c => !c.dealt && !c.skipped);
  const done = customersToday.filter(c => c.dealt || c.skipped);

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Başarı Popup */}
      {successModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSuccessModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--color-cream-card)', borderRadius: '20px', padding: '2rem 1.75rem', maxWidth: '340px', width: '100%', textAlign: 'center', border: '1px solid var(--color-border)', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.25rem' }}>İşlem Tamamlandı!</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-mute)', marginBottom: '1.25rem' }}>{successModal.serviceName}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              {fmtMoney(successModal.price)}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '999px', background: '#7F77DD22', color: '#7F77DD', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              ⭐ +{successModal.xpGained} XP
            </div>
            <button onClick={() => setSuccessModal(null)} style={{ display: 'block', width: '100%', padding: '0.875rem', borderRadius: '12px', border: 'none', background: 'var(--color-accent)', color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
              Tamam
            </button>
          </div>
        </div>
      )}
      {!isActive && (
        <div style={{
          padding: '1.5rem',
          borderRadius: '12px',
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
          color: 'var(--color-text-mute)',
          marginBottom: '1rem',
        }}>
          {gamePhase === 'day_new' ? '🌅 Henüz gün başlamadı. "Güne Başla" butonuna bas.' : '🌙 Gün bitti.'}
        </div>
      )}

      {/* İstatistik bar */}
      {customersToday.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0.75rem 1rem',
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-mute)' }}>
            👥 Toplam: <b style={{ color: 'var(--color-text)' }}>{customersToday.length}</b>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-mute)' }}>
            ✓ Satış: <b style={{ color: '#1D9E75' }}>{customersToday.filter(c => c.result === 'sold').length}</b>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-mute)' }}>
            → Geçilen: <b style={{ color: 'var(--color-amber-text)' }}>{skippedCount}</b>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-mute)' }}>
            ⏳ Bekleyen: <b style={{ color: 'var(--color-text)' }}>{pending.length}</b>
          </div>
        </div>
      )}

      {/* Bekleyen müşteriler */}
      {isActive && pending.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ⏳ Bekleyen Müşteriler ({pending.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {pending.map(customer => (
              customer.type === 'service' ? (
                <ServiceCustomerCard
                  key={customer.id}
                  customer={customer}
                  servicePrices={servicePrices || {}}
                  onService={handleServiceAction}
                  onSkip={skipAction}
                  onSuccess={info => setSuccessModal(info)}
                  disabled={!isActive}
                />
              ) : (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  inventory={inventory}
                  prices={prices}
                  onSell={sellAction}
                  onSkip={skipAction}
                  disabled={!isActive}
                />
              )
            ))}
          </div>
        </div>
      )}

      {/* Tamamlanan */}
      {done.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ✓ Tamamlanan ({done.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {done.map(customer => (
              customer.type === 'service' ? (
                <ServiceCustomerCard
                  key={customer.id}
                  customer={customer}
                  servicePrices={servicePrices || {}}
                  onService={handleServiceAction}
                  onSkip={skipAction}
                  disabled={true}
                />
              ) : (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  inventory={inventory}
                  prices={prices}
                  onSell={sellAction}
                  onSkip={skipAction}
                  disabled={true}
                />
              )
            ))}
          </div>
        </div>
      )}

      {isActive && customersToday.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--color-text-mute)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪</div>
          <div style={{ fontSize: '1rem' }}>Bugün henüz müşteri gelmedi.</div>
        </div>
      )}
    </div>
  );
}
