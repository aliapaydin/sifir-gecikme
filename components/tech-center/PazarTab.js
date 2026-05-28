'use client';

import { useState } from 'react';
import {
  PRODUCTS, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS,
} from '@/lib/tech-center-data';
import { getEffectiveBuyPrice } from '@/lib/tech-center-engine';

function fmtMoney(n) {
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

export default function PazarTab({ state, orderProduct, setPriceAction, clearError, cancelOrderAction, removeFromShoppingListAction, isMobile }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [quantities, setQuantities] = useState({});
  const [supplierPref, setSupplierPref] = useState({});
  const [localPrices, setLocalPrices] = useState({});
  const [shoppingOpen, setShoppingOpen] = useState(false);

  if (!state) return null;

  const { unlockedCategories = [], activeEvents = [], orderError, prices = {}, inventory = {}, pendingOrders = [], currentDay, shoppingList = [], cash = 0 } = state;

  const unlockedProducts = Object.values(PRODUCTS).filter(p =>
    unlockedCategories.includes(p.category) && (p.unlockDay || 1) <= currentDay
  );

  const availableCategories = [...new Set(unlockedProducts.map(p => p.category))];
  const categories = ['all', ...availableCategories];

  // Yakında açılacak ürünler (sonraki 4 gün içinde)
  const upcomingProducts = Object.values(PRODUCTS)
    .filter(p => (p.unlockDay || 1) > currentDay && (p.unlockDay || 1) <= currentDay + 4)
    .sort((a, b) => (a.unlockDay || 1) - (b.unlockDay || 1));

  const filtered = (selectedCat === 'all' ? unlockedProducts : unlockedProducts.filter(p => p.category === selectedCat))
    .filter(p => !searchText.trim() ||
      `${p.brand} ${p.name} ${p.specs}`.toLowerCase().includes(searchText.trim().toLowerCase())
    );

  const grouped = {};
  for (const p of filtered) {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  }

  const handleOrder = (productId) => {
    const qty = parseInt(quantities[productId] || 1);
    const sup = supplierPref[productId] || 'global';
    if (isNaN(qty) || qty < 1) return;
    orderProduct(productId, qty, sup);
  };

  const handlePriceChange = (productId, value) => {
    setLocalPrices(prev => ({ ...prev, [productId]: value }));
  };

  const handlePriceSave = (productId) => {
    const effectiveP = getEffectiveBuyPrice(productId, activeEvents);
    const recommended = Math.round(effectiveP * 1.25);
    const localP = localPrices[productId];
    const savedP = prices[productId];
    const val = (localP !== undefined && localP !== '') ? parseFloat(localP) : (savedP || recommended);
    if (!isNaN(val) && val > 0) {
      setPriceAction(productId, val);
      setLocalPrices(prev => { const n = {...prev}; delete n[productId]; return n; });
    }
  };

  const shoppingActiveItems = shoppingList.filter(i => !i.ordered);
  const shoppingOrderedItems = shoppingList.filter(i => i.ordered);
  const hasShopping = shoppingList.length > 0;

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      {/* Ana içerik */}
      <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Sticky header: nakit + arama + kategori */}
        <div style={{ flexShrink: 0, padding: '0.75rem 1rem 0.75rem', background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border)' }}>
          {orderError && (
            <div style={{
              padding: '8px 12px', borderRadius: '8px', background: 'var(--color-amber-bg)',
              color: 'var(--color-amber-text)', marginBottom: '0.625rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem',
            }}>
              <span>⚠️ {orderError}</span>
              <button onClick={() => clearError('orderError')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-amber-text)', fontSize: '1rem' }}>×</button>
            </div>
          )}

          {/* Nakit + Arama + Alışveriş Listesi butonu — yan yana */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px', borderRadius: '8px', flexShrink: 0,
              background: cash < 5000 ? '#FEE2E2' : 'var(--color-correct-bg)',
              border: `1px solid ${cash < 5000 ? '#FCA5A5' : 'var(--color-correct-text)33'}`,
              fontSize: '0.82rem', gap: '8px',
            }}>
              <span style={{ color: cash < 5000 ? '#991B1B' : 'var(--color-correct-text)', fontWeight: 600 }}>💰</span>
              <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: cash < 5000 ? '#E24B4A' : '#1D9E75' }}>
                {fmtMoney(cash)}
              </span>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Ürün ara... (marka, model, özellik)"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{
                  width: '100%', padding: '6px 30px 6px 10px', borderRadius: '8px',
                  border: '1px solid var(--color-border)', background: 'var(--color-cream)',
                  color: 'var(--color-text)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box',
                }}
              />
              {searchText && (
                <button onClick={() => setSearchText('')} style={{
                  position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text-mute)', fontSize: '1rem', lineHeight: 1, padding: 0,
                }}>×</button>
              )}
            </div>
            {/* Alışveriş listesi toggle butonu */}
            <button
              onClick={() => setShoppingOpen(v => !v)}
              style={{
                flexShrink: 0, position: 'relative',
                padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${shoppingOpen ? 'var(--color-accent)' : hasShopping ? '#F59E0B88' : 'var(--color-border)'}`,
                background: shoppingOpen ? 'var(--color-accent-soft, #EEF2FF)' : hasShopping ? '#FEF3C7' : 'var(--color-cream-card)',
                color: shoppingOpen ? 'var(--color-accent)' : hasShopping ? '#92400E' : 'var(--color-text-mute)',
                fontSize: '0.82rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '5px',
                transition: 'all 0.15s',
              }}
            >
              🛒
              {shoppingActiveItems.length > 0 && (
                <span style={{
                  padding: '1px 5px', borderRadius: '999px',
                  background: '#F59E0B', color: '#fff',
                  fontSize: '0.68rem', fontWeight: 800, lineHeight: 1.4,
                }}>{shoppingActiveItems.length}</span>
              )}
              <span style={{ fontSize: '0.75rem' }}>{shoppingOpen ? '›' : '‹'}</span>
            </button>
          </div>

        </div>

        {/* Scrollable content area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem 1rem 1.5rem' }}>

          {/* Kategori filtre — sayfayla kayar */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                style={{
                  padding: '4px 12px', borderRadius: '999px',
                  border: `1px solid ${selectedCat === cat ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: selectedCat === cat ? 'var(--color-accent-soft)' : 'transparent',
                  color: selectedCat === cat ? 'var(--color-accent)' : 'var(--color-text-mute)',
                  fontSize: '0.78rem', cursor: 'pointer', fontWeight: selectedCat === cat ? 600 : 400,
                  whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                {cat === 'all' ? 'Tümü' : <><span>{CATEGORY_ICONS[cat]}</span><span>{CATEGORY_LABELS[cat]}</span></>}
              </button>
            ))}
          </div>

      {/* Bekleyen siparişler - detaylı */}
      {pendingOrders.length > 0 && (
        <div style={{
          padding: '0.875rem 1rem',
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          marginBottom: '1rem',
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📦 Bekleyen Siparişler</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', fontWeight: 400, fontFamily: 'var(--font-mono)' }}>
              (ödendi, stoka gelecek)
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {pendingOrders.map(o => {
              const p = PRODUCTS[o.productId];
              return (
                <div key={o.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px',
                  background: 'var(--color-cream)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{p?.icon || '📦'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p?.brand} {p?.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span>{fmtMoney(o.unitPrice)} × {o.quantity}</span>
                      <span style={{ color: '#1D9E75', fontWeight: 600 }}>= {fmtMoney(o.totalCost)}</span>
                      <span>{o.supplier === 'local' ? '🏠 Yerel' : '🌍 Yurtdışı'}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginRight: '4px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>Gün</div>
                    <div style={{ fontWeight: 700, color: '#1D9E75', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {o.deliveryDay}
                    </div>
                  </div>
                  {/* İptal butonu */}
                  <button
                    onClick={() => cancelOrderAction && cancelOrderAction(o.id)}
                    title="Siparişi iptal et (para iade edilir)"
                    style={{
                      flexShrink: 0,
                      width: '26px', height: '26px',
                      borderRadius: '50%',
                      border: '1px solid #FCA5A5',
                      background: '#FEE2E222',
                      color: '#E24B4A',
                      fontSize: '0.9rem', lineHeight: 1,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FEE2E222'; }}
                  >×</button>
                </div>
              );
            })}
          </div>
          {/* Toplam */}
          <div style={{
            marginTop: '8px', paddingTop: '8px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.82rem',
          }}>
            <span style={{ color: 'var(--color-text-mute)' }}>Toplam sipariş tutarı (ödenmiş)</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
              {fmtMoney(pendingOrders.reduce((s, o) => s + o.totalCost, 0))}
            </span>
          </div>
        </div>
      )}

      {/* Ürün grupları */}
      {Object.entries(grouped).map(([cat, products]) => (
        <div key={cat} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: CATEGORY_COLORS[cat],
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: CATEGORY_COLORS[cat], display: 'inline-block' }} />
            {CATEGORY_LABELS[cat]}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
            {products.map(product => {
              const effectivePrice = getEffectiveBuyPrice(product.id, activeEvents);
              const hasDiscount = effectivePrice !== product.buyPrice;
              const stockQty = inventory[product.id] || 0;
              const price = prices[product.id] || '';
              const localPrice = localPrices[product.id] !== undefined ? localPrices[product.id] : '';
              const recommendedPrice = Math.round(effectivePrice * 1.25);
              const displayPrice = localPrice !== '' ? localPrice : (price || recommendedPrice);

              const margin = price && effectivePrice ? ((parseFloat(price) - effectivePrice) / effectivePrice * 100).toFixed(0) : null;

              return (
                <div key={product.id} style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  background: 'var(--color-cream-card)',
                  padding: '1rem',
                }}>
                  {/* Ürün header */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '1.4rem' }}>{product.icon || CATEGORY_ICONS[product.category]}</span>
                          <span style={{ fontSize: '0.7rem', color: CATEGORY_COLORS[product.category], fontWeight: 500 }}>
                            {product.brand}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>{product.specs}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
                          Stok: <b style={{ color: stockQty > 0 ? '#1D9E75' : '#E24B4A' }}>{stockQty}</b>
                        </div>
                        {margin !== null && (
                          <div style={{ fontSize: '0.72rem', color: parseFloat(margin) > 0 ? '#1D9E75' : '#E24B4A', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                            Marj: {margin}%
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <span style={{
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: hasDiscount ? (effectivePrice < product.buyPrice ? '#1D9E75' : '#E24B4A') : 'var(--color-text)',
                      }}>
                        {fmtMoney(effectivePrice)}
                      </span>
                      {hasDiscount && (
                        <span style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
                          {fmtMoney(product.buyPrice)}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#1D9E75', fontFamily: 'var(--font-mono)', marginTop: '3px', fontWeight: 500 }}>
                      Önerilen Satış: {fmtMoney(Math.round(effectivePrice * 1.25))}
                    </div>
                  </div>

                  {/* Satış fiyatı ayarla */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', display: 'block', marginBottom: '4px' }}>
                      Satış Fiyatı
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="number"
                        placeholder={price ? `₺${price}` : 'Fiyat gir...'}
                        value={displayPrice}
                        onChange={e => handlePriceChange(product.id, e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '7px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-cream)',
                          color: 'var(--color-text)',
                          fontSize: '0.85rem',
                          fontFamily: 'var(--font-mono)',
                          outline: 'none',
                          minWidth: 0,
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') handlePriceSave(product.id); }}
                      />
                      <button
                        onClick={() => handlePriceSave(product.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '7px',
                          border: 'none',
                          background: 'var(--color-accent-soft)',
                          color: 'var(--color-accent)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>

                  {/* Sipariş ver */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* Tedarikçi - tam genişlik */}
                    <select
                      value={supplierPref[product.id] || 'global'}
                      onChange={e => setSupplierPref(prev => ({ ...prev, [product.id]: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '7px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-cream)',
                        color: 'var(--color-text-mute)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="global">🌍 Yurtdışı (+0%) / 2 gün</option>
                      <option value="local">🏠 Yerel (+5%) / 1 gün</option>
                    </select>

                    {/* Miktar + buton */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={quantities[product.id] || 1}
                        onChange={e => setQuantities(prev => ({ ...prev, [product.id]: e.target.value }))}
                        style={{
                          width: '60px',
                          padding: '6px 8px',
                          borderRadius: '7px',
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-cream)',
                          color: 'var(--color-text)',
                          fontSize: '0.85rem',
                          fontFamily: 'var(--font-mono)',
                          outline: 'none',
                          textAlign: 'center',
                          flexShrink: 0,
                        }}
                      />
                      <button
                        onClick={() => handleOrder(product.id)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '7px',
                          border: 'none',
                          background: 'var(--color-accent)',
                          color: '#fff',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Sipariş Ver
                      </button>
                    </div>
                  </div>

                  {/* Maliyet preview */}
                  <div style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
                    Toplam: {fmtMoney(
                      Math.round(effectivePrice * (supplierPref[product.id] === 'local' ? 1.05 : 1)) * (parseInt(quantities[product.id]) || 1)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Yakında açılacak ürünler */}
      {upcomingProducts.length > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🔒 Yakında Açılacak Ürünler
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {upcomingProducts.map(p => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 10px', borderRadius: '8px',
                background: 'var(--color-cream)',
                border: '0.5px solid var(--color-border)',
                opacity: 0.65,
              }}>
                <span style={{ fontSize: '1.1rem', filter: 'grayscale(1)' }}>{p.icon || CATEGORY_ICONS[p.category]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.brand} {p.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{CATEGORY_LABELS[p.category]}</div>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-mute)', background: 'var(--color-border)', borderRadius: '999px', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                  Gün {p.unlockDay}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
        </div>{/* /scrollable */}
      </div>{/* /ana içerik */}

      {/* Alışveriş Listesi — sağdan kayan overlay panel */}
      {shoppingOpen && (
        <div
          onClick={() => setShoppingOpen(false)}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 19 }}
        />
      )}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: shoppingOpen ? '240px' : '0px',
        overflow: 'hidden',
        transition: 'width 0.25s ease',
        zIndex: 20,
      }}>
        <div style={{
          width: '240px', height: '100%',
          background: 'var(--color-cream-card)',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)',
            display: 'flex', alignItems: 'center', gap: '6px',
            flexShrink: 0,
          }}>
            <span>🛒</span> Alışveriş Listesi
            {shoppingActiveItems.length > 0 && (
              <span style={{
                padding: '1px 7px', borderRadius: '999px',
                background: '#FEF3C7', color: '#92400E',
                fontSize: '0.72rem', fontWeight: 700,
              }}>{shoppingActiveItems.length}</span>
            )}
            <button
              onClick={() => setShoppingOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-mute)', fontSize: '1.1rem', lineHeight: 1, padding: '0 2px' }}
            >×</button>
          </div>

          {/* Mevcut bakiye */}
          <div style={{
            padding: '6px 1rem',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '0.75rem', color: 'var(--color-text-mute)',
            display: 'flex', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span>Bakiye</span>
            <span style={{ fontWeight: 700, color: '#1D9E75', fontFamily: 'var(--font-mono)' }}>
              {fmtMoney(cash)}
            </span>
          </div>

          {/* Liste */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {shoppingActiveItems.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 4px', marginBottom: '4px' }}>
                  Bekleyen
                </div>
                {shoppingActiveItems.map(item => {
                  const p = PRODUCTS[item.productId];
                  const effectiveP = getEffectiveBuyPrice(item.productId, activeEvents);
                  return (
                    <div key={item.id} style={{
                      padding: '7px 8px',
                      borderRadius: '8px',
                      background: 'var(--color-cream)',
                      border: '1px solid #F59E0B44',
                      marginBottom: '4px',
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {p?.category && CATEGORY_ICONS[p.category] && <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{CATEGORY_ICONS[p.category]}</span>}
                          {p?.brand} {p?.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
                          ×{item.quantity} · {fmtMoney(effectiveP * item.quantity)}
                        </div>
                        {item.customerName && (
                          <div style={{ fontSize: '0.65rem', color: '#F59E0B', marginTop: '2px' }}>
                            {item.customerName}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromShoppingListAction && removeFromShoppingListAction(item.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--color-text-mute)', fontSize: '0.9rem', lineHeight: 1,
                          padding: '0', flexShrink: 0,
                        }}
                        title="Listeden çıkar"
                      >×</button>
                    </div>
                  );
                })}
              </div>
            )}

            {shoppingOrderedItems.length > 0 && (
              <div>
                <div style={{ fontSize: '0.68rem', color: '#1D9E75', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '2px 4px', marginBottom: '4px' }}>
                  Sipariş Verildi ✓
                </div>
                {shoppingOrderedItems.map(item => {
                  const p = PRODUCTS[item.productId];
                  return (
                    <div key={item.id} style={{
                      padding: '7px 8px',
                      borderRadius: '8px',
                      background: '#D1FAE544',
                      border: '1px solid #6EE7B755',
                      marginBottom: '4px',
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1D9E75', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          ✓ {p?.brand} {p?.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#1D9E75', fontFamily: 'var(--font-mono)' }}>
                          ×{item.quantity} · Sipariş verildi
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromShoppingListAction && removeFromShoppingListAction(item.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#1D9E7580', fontSize: '0.9rem', lineHeight: 1,
                          padding: '0', flexShrink: 0,
                        }}
                        title="Listeden çıkar"
                      >×</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
