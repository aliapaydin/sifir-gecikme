'use client';

import { useState, useEffect, useRef } from 'react';
import { PRODUCTS, SERVICES, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/tech-center-data';

function fmtMoney(n) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₺${Math.round(n / 1000)}K`;
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

function getStatusDot(customer) {
  if (!customer.dealt) return '#1D9E75';
  if (customer.result === 'sold') return '#6B7280';
  if (customer.result === 'delayed') return '#F59E0B';
  if (customer.result === 'skipped' || customer.result === 'delay_rejected' || customer.result === 'too_expensive') return '#E24B4A';
  return '#6B7280';
}

function getSubjectLine(customer) {
  if (customer.isReturning) {
    return `⏰ ${customer.name} (geri döndü)`;
  }
  if (customer.type === 'service') {
    const service = SERVICES[customer.requestedServiceId];
    return service ? `${service.emoji || '🔧'} ${service.label} hizmet talebi` : 'Servis talebi';
  }
  const product = PRODUCTS[customer.wantedProductId];
  if (product) return `${product.brand} ${product.name} almak istiyorum`;
  return 'Ürün talebi';
}

function getCustomerTypeLabel(type) {
  const labels = {
    student: 'Öğrenci',
    gamer: 'Gamer',
    professional: 'Profesyonel',
    corporate: 'Kurumsal',
    service: 'Servis',
  };
  return labels[type] || type;
}

function getCustomerTypeColor(type) {
  const colors = {
    student: '#7F77DD',
    gamer: '#E24B4A',
    professional: '#185FA5',
    corporate: '#1D9E75',
    service: '#10B981',
  };
  return colors[type] || '#6B7280';
}

// Success modal
function SuccessModal({ data, onClose }) {
  if (!data) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 900,
    }}>
      <div style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '340px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          Tamamlandı!
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-mute)', marginBottom: '1rem' }}>
          {data.name}
        </div>
        <div style={{
          fontSize: '1.5rem', fontWeight: 800,
          color: '#1D9E75', fontFamily: 'var(--font-mono)',
          marginBottom: data.xp ? '0.75rem' : '1.25rem',
        }}>
          {fmtMoney(data.price)}
        </div>
        {data.xp && (
          <div style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: '999px',
            background: '#EDE9FE',
            color: '#7F77DD',
            fontSize: '0.82rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
          }}>
            +{data.xp} XP
          </div>
        )}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '10px',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Tamam
        </button>
      </div>
    </div>
  );
}

// Customer detail pane
function CustomerDetailPane({ customer, state, sellAction, skipAction, handleServiceAction, delayCustomerAction, servicePrices, onSuccess, addToShoppingListAction }) {
  const [servicePhase, setServicePhase] = useState('idle'); // idle | pending_confirm | rejected
  const [counterInput, setCounterInput] = useState('');
  const [pendingPrice, setPendingPrice] = useState(null);
  const [addToList, setAddToList] = useState(false);

  useEffect(() => {
    setServicePhase('idle');
    setCounterInput('');
    setPendingPrice(null);
    setAddToList(false);
  }, [customer?.id]);

  if (!customer) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-mute)',
        fontSize: '0.95rem',
        background: 'var(--color-cream)',
      }}>
        ← Bir müşteri seçin
      </div>
    );
  }

  const product = customer.wantedProductId ? PRODUCTS[customer.wantedProductId] : null;
  const service = customer.requestedServiceId ? SERVICES[customer.requestedServiceId] : null;
  const inStock = product ? (state.inventory[customer.wantedProductId] || 0) : 0;
  const ourPrice = product ? (state.prices[customer.wantedProductId] || Math.round(product.buyPrice * 1.20)) : 0;
  const totalPrice = ourPrice * (customer.quantity || 1);
  const margin = product ? Math.round(((ourPrice - product.buyPrice) / product.buyPrice) * 100) : 0;

  const typeColor = getCustomerTypeColor(customer.type);
  const catColor = product ? (CATEGORY_COLORS[product.category] || '#6B7280') : '#10B981';
  const catIcon = product ? (CATEGORY_ICONS[product.category] || '📦') : (service?.emoji || '🔧');

  // Dealt customers
  if (customer.dealt) {
    const resultMap = {
      sold: { label: 'Satıldı ✅', color: '#1D9E75', bg: '#D1FAE5' },
      skipped: { label: 'Geçildi ❌', color: '#E24B4A', bg: '#FEE2E2' },
      delayed: { label: 'Beklemeye Alındı ⏰', color: '#F59E0B', bg: '#FEF3C7' },
      delay_rejected: { label: 'Teklif Reddedildi ✗', color: '#E24B4A', bg: '#FEE2E2' },
      too_expensive: { label: 'Çok Pahalı ❌', color: '#E24B4A', bg: '#FEE2E2' },
      counter: { label: 'Karşı Teklif Yapıldı', color: '#F59E0B', bg: '#FEF3C7' },
    };
    const res = resultMap[customer.result] || { label: customer.result, color: '#6B7280', bg: '#F3F4F6' };
    const isDelayed = customer.result === 'delayed';
    const alreadyReturned = isDelayed && customer.waitUntilDay && state.currentDay >= customer.waitUntilDay;

    return (
      <div style={{ flex: 1, background: 'var(--color-cream)', padding: '1.5rem', overflowY: 'auto' }}>
        {/* Müşteri başlığı */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: typeColor + '22', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0,
          }}>
            {customer.avatar}
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>{customer.name}</div>
            <div style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
              background: typeColor + '22', color: typeColor,
              fontSize: '0.75rem', fontWeight: 600, marginTop: '4px',
            }}>
              {getCustomerTypeLabel(customer.type)}
            </div>
          </div>
        </div>

        {/* Sonuç etiketi */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          background: res.bg,
          border: `1px solid ${res.color}33`,
          fontSize: '0.95rem',
          fontWeight: 700,
          color: res.color,
          textAlign: 'center',
          marginBottom: (isDelayed || customer.result === 'delay_rejected') && product ? '1rem' : 0,
        }}>
          {res.label}
        </div>

        {/* Bekleme detayları — delayed ve delay_rejected için */}
        {(isDelayed || customer.result === 'delay_rejected') && product && (
          <div style={{
            background: 'var(--color-cream-card)',
            border: '0.5px solid var(--color-border)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            {/* Ürün bilgisi */}
            <div style={{ padding: '0.875rem 1rem', borderBottom: '0.5px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '8px', flexShrink: 0,
                background: catColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              }}>{catIcon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', marginTop: '2px' }}>
                  {(customer.quantity || 1) > 1 ? `${customer.quantity} adet` : '1 adet'} · {totalPrice.toLocaleString('tr-TR')} ₺
                </div>
              </div>
            </div>

            {/* Bekletme bilgileri */}
            <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>Bekletildiği gün</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>Gün {customer.delayedOnDay ?? '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>Bekleme süresi</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  {customer.delayedDays === 1 ? '1 gün (~%70)' : customer.delayedDays === 2 ? '2 gün (~%50)' : `${customer.delayedDays} gün`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '0.5px solid var(--color-border)', marginTop: '0.1rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>Teslim günü</span>
                <span style={{
                  fontSize: '0.88rem', fontWeight: 800,
                  color: alreadyReturned ? '#1D9E75' : '#F59E0B',
                }}>
                  {alreadyReturned ? `Gün ${customer.waitUntilDay} — Geri döndü ✓` : `Gün ${customer.waitUntilDay ?? '—'}`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Service customer
  if (customer.type === 'service' && service) {
    const svcOffered = customer.offeredPrice || 0;
    const svcPriceLimit = Math.round(svcOffered * 1.3);

    const handleCounterSubmit = () => {
      const val = parseInt(counterInput, 10);
      if (isNaN(val) || val < 0) return;
      if (val <= svcPriceLimit && val >= 0) {
        if (Math.random() < 0.80) {
          setPendingPrice(val);
          setServicePhase('pending_confirm');
        } else {
          setServicePhase('rejected');
        }
      } else {
        setServicePhase('rejected');
      }
    };

    const handleAcceptDirect = () => {
      handleServiceAction(customer.id, true, undefined);
      onSuccess({
        name: service.label,
        price: svcOffered,
        xp: service.xpReward,
      });
    };

    const handleConfirmCounter = () => {
      handleServiceAction(customer.id, true, pendingPrice);
      onSuccess({
        name: service.label,
        price: pendingPrice,
        xp: service.xpReward,
      });
    };

    return (
      <div style={{ flex: 1, background: 'var(--color-cream)', padding: '1.5rem', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: typeColor + '22', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0,
          }}>
            {customer.avatar}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>{customer.name}</div>
              {customer.isReturning && (
                <span style={{
                  padding: '2px 8px', borderRadius: '999px',
                  background: '#FEF3C7', color: '#F59E0B',
                  fontSize: '0.72rem', fontWeight: 600,
                }}>⏰ Geri Döndü</span>
              )}
            </div>
            <div style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
              background: typeColor + '22', color: typeColor,
              fontSize: '0.75rem', fontWeight: 600, marginTop: '4px',
            }}>
              {getCustomerTypeLabel(customer.type)}
            </div>
          </div>
        </div>

        {/* Service card */}
        <div style={{
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{service.emoji || '🔧'}</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '1rem' }}>{service.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>Servis talebi</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-text-mute)' }}>Müşteri Teklifi</span>
            <span style={{ fontWeight: 700, color: '#1D9E75', fontFamily: 'var(--font-mono)' }}>{fmtMoney(svcOffered)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '4px' }}>
            <span style={{ color: 'var(--color-text-mute)' }}>Max kabul</span>
            <span style={{ fontWeight: 600, color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>{fmtMoney(svcPriceLimit)}</span>
          </div>
        </div>

        {/* Actions by phase */}
        {servicePhase === 'idle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <button
              onClick={handleAcceptDirect}
              style={{
                padding: '10px 16px', borderRadius: '10px', border: 'none',
                background: '#1D9E75', color: '#fff',
                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Kabul Et {fmtMoney(svcOffered)}
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder={`Teklif et (max ${fmtMoney(svcPriceLimit)})`}
                value={counterInput}
                onChange={e => setCounterInput(e.target.value)}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-cream-card)',
                  color: 'var(--color-text)', fontSize: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleCounterSubmit}
                style={{
                  padding: '8px 14px', borderRadius: '8px', border: 'none',
                  background: 'var(--color-accent)', color: '#fff',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Teklif Gönder
              </button>
            </div>
            <button
              onClick={() => { skipAction(customer.id); }}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-cream-card)',
                color: 'var(--color-text-mute)', fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              Geç
            </button>
          </div>
        )}

        {servicePhase === 'pending_confirm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '10px',
              background: '#D1FAE5', border: '1px solid #6EE7B7',
              fontSize: '0.9rem', color: '#065F46', fontWeight: 600,
            }}>
              Müşteri {fmtMoney(pendingPrice)} kabul etti!
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleConfirmCounter}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                  background: '#1D9E75', color: '#fff',
                  fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Onayla
              </button>
              <button
                onClick={() => { setServicePhase('idle'); setCounterInput(''); setPendingPrice(null); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-cream-card)',
                  color: 'var(--color-text-mute)', fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}

        {servicePhase === 'rejected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '10px',
              background: '#FEE2E2', border: '1px solid #FCA5A5',
              fontSize: '0.9rem', color: '#991B1B', fontWeight: 600,
            }}>
              Müşteri teklifi reddetti
            </div>
            <button
              onClick={() => { skipAction(customer.id); }}
              style={{
                padding: '10px', borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-cream-card)',
                color: 'var(--color-text-mute)', fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              Geç
            </button>
          </div>
        )}
      </div>
    );
  }

  // Product customer (not dealt)
  const qty = customer.quantity || 1;
  const hasStock = inStock >= qty;
  const partialStock = !hasStock && inStock > 0; // has some but not enough
  const counterOffer = customer.counterOffer;

  const handleSell = () => {
    sellAction(customer.id, ourPrice);
    // Check if successful immediately — we'll trigger success via state change
    // We trigger optimistically here
    if (hasStock) {
      onSuccess({
        name: product ? `${product.brand} ${product.name}` : 'Ürün',
        price: totalPrice,
      });
    }
  };

  const handleSellCounter = () => {
    if (!counterOffer) return;
    sellAction(customer.id, counterOffer);
    onSuccess({
      name: product ? `${product.brand} ${product.name}` : 'Ürün',
      price: counterOffer * (customer.quantity || 1),
    });
  };

  return (
    <div style={{ flex: 1, background: 'var(--color-cream)', padding: '1.5rem', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: typeColor + '22', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0,
        }}>
          {customer.avatar}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>{customer.name}</div>
            {customer.isReturning && (
              <span style={{
                padding: '2px 8px', borderRadius: '999px',
                background: '#FEF3C7', color: '#F59E0B',
                fontSize: '0.72rem', fontWeight: 600,
              }}>⏰ Geri Döndü</span>
            )}
          </div>
          <div style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: '999px',
            background: typeColor + '22', color: typeColor,
            fontSize: '0.75rem', fontWeight: 600, marginTop: '4px',
          }}>
            {getCustomerTypeLabel(customer.type)}
          </div>
        </div>
      </div>

      {/* Mail body */}
      {product && (
        <div style={{
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-mute)',
          lineHeight: 1.6,
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '6px', display: 'flex', gap: '12px' }}>
            <span>Konu: <b style={{ color: 'var(--color-text)' }}>{product.brand} {product.name} talebi</b></span>
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
            {customer.type === 'corporate'
              ? `Merhaba, şirketimiz için ${customer.quantity > 1 ? `${customer.quantity} adet ` : ''}${product.brand} ${product.name} satın almak istiyoruz. Toplu alım fiyatlandırması hakkında bilgi alabilir miyiz? Bütçemiz ${fmtMoney(customer.budget * (customer.quantity || 1))} civarında.`
              : customer.type === 'gamer'
              ? `Selamlar! ${product.brand} ${product.name} almak istiyorum. Bütçem ${fmtMoney(customer.budget)}, bu fiyata verebilir misiniz? Stok durumunuzu da merak ediyorum.`
              : customer.type === 'student'
              ? `Merhaba, öğrenci olarak ${product.brand} ${product.name} almayı düşünüyorum. En uygun fiyatı verebilir misiniz? Maksimum ${fmtMoney(customer.budget)} harcayabilirim.`
              : `Merhaba, ${product.brand} ${product.name} ürününüzü almak istiyorum. ${fmtMoney(customer.budget)} bütçem var, müsait misiniz?`
            }
          </div>
        </div>
      )}

      {/* Product card */}
      {product && (
        <div style={{
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.875rem' }}>
            <span style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: catColor + '22', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
            }}>
              {catIcon}
            </span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                {product.brand} {product.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>{product.specs}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--color-text-mute)' }}>Bütçe</span>
              <div style={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                {fmtMoney(customer.budget)}
                {(customer.quantity || 1) > 1 && <span style={{ color: 'var(--color-text-mute)', fontWeight: 400 }}> ×{customer.quantity}</span>}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-mute)' }}>Stok</span>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: inStock === 0 ? '#E24B4A' : partialStock ? '#F59E0B' : '#1D9E75' }}>
                {inStock === 0 ? '✗ Stokta yok' : partialStock ? `⚠️ Yetersiz (${inStock}/${qty})` : `✓ ${inStock} adet`}
              </div>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-mute)' }}>Fiyatımız</span>
              <div style={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {fmtMoney(totalPrice)}
                <span style={{
                  padding: '1px 6px', borderRadius: '4px',
                  background: margin >= 20 ? '#D1FAE5' : margin >= 10 ? '#FEF3C7' : '#FEE2E2',
                  color: margin >= 20 ? '#065F46' : margin >= 10 ? '#92400E' : '#991B1B',
                  fontSize: '0.7rem', fontWeight: 600,
                }}>
                  +{margin}%
                </span>
              </div>
            </div>
            {(customer.quantity || 1) > 1 && (
              <div>
                <span style={{ color: 'var(--color-text-mute)' }}>Adet</span>
                <div style={{ fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                  {customer.quantity}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Counter offer notice */}
      {counterOffer && (
        <div style={{
          padding: '10px 14px', borderRadius: '10px',
          background: '#FEF3C7', border: '1px solid #FCD34D',
          fontSize: '0.85rem', color: '#92400E', marginBottom: '0.875rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>Müşteri karşı teklif yaptı:</span>
          <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {fmtMoney(counterOffer * (customer.quantity || 1))}
          </span>
        </div>
      )}

      {/* Partial stock info note */}
      {partialStock && !counterOffer && (
        <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#FEF3C7', color: '#92400E', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          ⚠️ Stokta {inStock} adet var, {qty} adet gerekli. Sipariş vererek geciktirebilirsin.
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {counterOffer ? (
          <>
            <button
              onClick={handleSellCounter}
              style={{
                padding: '10px 16px', borderRadius: '10px', border: 'none',
                background: '#1D9E75', color: '#fff',
                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Kabul Et {fmtMoney(counterOffer * (customer.quantity || 1))}
            </button>
            <button
              onClick={() => { skipAction(customer.id); }}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-cream-card)',
                color: 'var(--color-text-mute)', fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              Reddet / Geç
            </button>
          </>
        ) : (
          <>
            {/* Alışveriş listesi checkbox */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', borderRadius: '8px',
              background: addToList ? '#FEF3C7' : 'var(--color-cream-card)',
              border: `1px solid ${addToList ? '#F59E0B' : 'var(--color-border)'}`,
              cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-text-mute)',
              transition: 'all 0.15s',
            }}>
              <input
                type="checkbox"
                checked={addToList}
                onChange={e => setAddToList(e.target.checked)}
                style={{ accentColor: '#F59E0B', width: '15px', height: '15px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: addToList ? 600 : 400, color: addToList ? '#92400E' : 'var(--color-text-mute)' }}>
                🛒 Alışveriş listesine ekle (bekletince pazara yönlendir)
              </span>
            </label>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {hasStock && (
                <button
                  onClick={handleSell}
                  style={{
                    flex: '1 1 auto',
                    padding: '10px 12px', borderRadius: '10px', border: 'none',
                    background: '#1D9E75', color: '#fff',
                    fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sat {fmtMoney(totalPrice)}
                </button>
              )}
              <button
                onClick={() => {
                  if (addToList && addToShoppingListAction) {
                    addToShoppingListAction(customer.wantedProductId, customer.quantity || 1, customer.id, customer.name);
                  }
                  delayCustomerAction(customer.id, 1);
                }}
                style={{
                  flex: '1 1 auto',
                  padding: '10px 10px', borderRadius: '10px',
                  border: '1px solid #F59E0B',
                  background: '#FEF3C7', color: '#92400E',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                1 Gün Beklet ~70%
              </button>
              <button
                onClick={() => {
                  if (addToList && addToShoppingListAction) {
                    addToShoppingListAction(customer.wantedProductId, customer.quantity || 1, customer.id, customer.name);
                  }
                  delayCustomerAction(customer.id, 2);
                }}
                style={{
                  flex: '1 1 auto',
                  padding: '10px 10px', borderRadius: '10px',
                  border: '1px solid #F59E0B',
                  background: '#FEF3C7', color: '#92400E',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                2 Gün Beklet ~50%
              </button>
            </div>
            <button
              onClick={() => { skipAction(customer.id); }}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-cream-card)',
                color: 'var(--color-text-mute)', fontSize: '0.85rem', cursor: 'pointer',
              }}
            >
              Geç
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MailApp({ state, sellAction, skipAction, handleServiceAction, delayCustomerAction, servicePrices, addToShoppingListAction }) {
  const [selectedId, setSelectedId] = useState(null);
  const [successData, setSuccessData] = useState(null);
  // Tracks the previous selectedId to distinguish "user just acted" from "user navigated to dealt customer"
  const prevSelectedIdRef = useRef(null);

  const customers = state.customersToday || [];
  const unreadCount = customers.filter(c => !c.dealt).length;

  const selectedCustomer = customers.find(c => c.id === selectedId) || null;

  // Auto-select first undealt customer if none selected
  useEffect(() => {
    if (!selectedId && customers.length > 0) {
      const first = customers.find(c => !c.dealt) || customers[0];
      if (first) setSelectedId(first.id);
    }
  }, [customers.length]);

  // Auto-advance to next undealt ONLY when the currently selected customer just became dealt
  // (i.e. user performed an action), not when user manually navigates to an already-dealt customer
  useEffect(() => {
    const sameCustomer = prevSelectedIdRef.current === selectedId;
    prevSelectedIdRef.current = selectedId;
    if (sameCustomer && selectedCustomer?.dealt) {
      const next = customers.find(c => !c.dealt && c.id !== selectedId);
      if (next) setSelectedId(next.id);
    }
  }, [selectedCustomer?.dealt, selectedId]);

  return (
    <>
      <SuccessModal data={successData} onClose={() => setSuccessData(null)} />
      <div style={{
        display: 'flex',
        height: '100%',
        background: 'var(--color-cream)',
        overflow: 'hidden',
      }}>
        {/* Left panel — inbox list */}
        <div style={{
          width: '280px',
          minWidth: '220px',
          maxWidth: '300px',
          flexShrink: 0,
          background: 'var(--color-cream-card)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Inbox header */}
          <div style={{
            padding: '0.875rem 1rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '1rem' }}>📧</span>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>Gelen Kutu</span>
            {unreadCount > 0 && (
              <span style={{
                marginLeft: 'auto',
                padding: '2px 8px', borderRadius: '999px',
                background: 'var(--color-accent)',
                color: '#fff', fontSize: '0.72rem', fontWeight: 700,
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          {/* Customer list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {customers.length === 0 && (
              <div style={{
                padding: '2rem 1rem', textAlign: 'center',
                color: 'var(--color-text-mute)', fontSize: '0.85rem',
              }}>
                Bugün müşteri yok
              </div>
            )}
            {customers.map(customer => {
              const isSelected = customer.id === selectedId;
              const dotColor = getStatusDot(customer);
              const subject = getSubjectLine(customer);
              const typeColor = getCustomerTypeColor(customer.type);

              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedId(customer.id)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    cursor: 'pointer',
                    borderBottom: '0.5px solid var(--color-border)',
                    background: isSelected ? 'var(--color-accent-soft, #EEF2FF)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--color-accent)' : '3px solid transparent',
                    transition: 'background 0.1s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: typeColor + '22', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0,
                  }}>
                    {customer.avatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: customer.dealt ? 400 : 700,
                      fontSize: '0.82rem', color: 'var(--color-text)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {customer.name}
                    </div>
                    <div style={{
                      fontSize: '0.72rem', color: 'var(--color-text-mute)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {subject}
                    </div>
                  </div>

                  {/* Status dot */}
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: dotColor, flexShrink: 0,
                  }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel — detail */}
        <CustomerDetailPane
          key={selectedId}
          customer={selectedCustomer}
          state={state}
          sellAction={sellAction}
          skipAction={skipAction}
          handleServiceAction={handleServiceAction}
          delayCustomerAction={delayCustomerAction}
          servicePrices={servicePrices}
          onSuccess={(data) => setSuccessData(data)}
          addToShoppingListAction={addToShoppingListAction}
        />
      </div>
    </>
  );
}
