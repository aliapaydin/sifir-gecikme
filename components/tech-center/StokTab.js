'use client';

import { useState } from 'react';
import { PRODUCTS, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/tech-center-data';
import { calcWarehouseCapacity } from '@/lib/tech-center-engine';

function fmtMoney(n) {
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

function SecondHandRow({ productId, qty, sellSecondHandAction }) {
  const product = PRODUCTS[productId];
  if (!product) return null;
  const catColor = CATEGORY_COLORS[product.category] || '#888';
  const suggestedPrice = Math.round(product.buyPrice * 0.65);
  const [sellPrice, setSellPrice] = useState(String(suggestedPrice));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-cream-card)', borderRadius: '10px', border: '0.5px solid var(--color-border)', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '1.4rem' }}>{product.icon || CATEGORY_ICONS[product.category]}</span>
      <div style={{ flex: 1, minWidth: '120px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }}>{product.brand} {product.name}</div>
        <div style={{ fontSize: '0.72rem', color: catColor }}>2. El • {qty} adet</div>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
        Öneri: {fmtMoney(suggestedPrice)}
      </div>
      <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)}
        style={{ width: '110px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-cream)', color: 'var(--color-text)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
      />
      <button onClick={() => { const p = parseFloat(sellPrice); if (!isNaN(p) && p > 0) sellSecondHandAction(productId, p); }}
        style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#10B981', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
        Sat {fmtMoney(parseFloat(sellPrice) || 0)}
      </button>
    </div>
  );
}

export default function StokTab({ state, setPriceAction, secondHandInventory, sellSecondHandAction }) {
  if (!state) return null;

  const { inventory = {}, prices = {}, pendingOrders = [] } = state;
  const capacity = calcWarehouseCapacity(state);
  const totalStock = Object.values(inventory).reduce((s, q) => s + q, 0);
  const pendingTotal = pendingOrders.reduce((s, o) => s + o.quantity, 0);
  const usagePercent = Math.min(100, ((totalStock + pendingTotal) / capacity) * 100);

  // Envanterde olan ürünleri listele
  const stockedItems = Object.entries(inventory)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ product: PRODUCTS[id], qty, id }))
    .filter(item => item.product)
    .sort((a, b) => a.product.category.localeCompare(b.product.category));

  const grouped = {};
  for (const item of stockedItems) {
    if (!grouped[item.product.category]) grouped[item.product.category] = [];
    grouped[item.product.category].push(item);
  }

  const secondHandEntries = Object.entries(secondHandInventory || {}).filter(([, qty]) => qty > 0);

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Depo kapasitesi */}
      <div style={{
        background: 'var(--color-cream-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>📦 Depo Kapasitesi</span>
          <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-mute)' }}>
            {totalStock + pendingTotal} / {capacity}
          </span>
        </div>
        <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${usagePercent}%`,
            background: usagePercent > 85 ? '#E24B4A' : usagePercent > 60 ? '#e8a04a' : '#1D9E75',
            borderRadius: '999px',
            transition: 'width 0.3s',
          }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>
          <span>Mevcut: <b style={{ color: 'var(--color-text)' }}>{totalStock}</b></span>
          <span>Yolda: <b style={{ color: '#1D9E75' }}>{pendingTotal}</b></span>
          <span>Boş: <b style={{ color: 'var(--color-text)' }}>{Math.max(0, capacity - totalStock - pendingTotal)}</b></span>
        </div>
      </div>

      {/* Yolda olan siparişler */}
      {pendingOrders.length > 0 && (
        <div style={{
          background: 'var(--color-cream-card)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🚚 Yolda Olan Siparişler
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pendingOrders.map(o => {
              const p = PRODUCTS[o.productId];
              return (
                <div key={o.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.625rem 0.875rem',
                  background: 'var(--color-cream)',
                  borderRadius: '8px',
                  border: '0.5px solid var(--color-border)',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', minWidth: '80px', fontFamily: 'var(--font-mono)' }}>
                    Gün {o.deliveryDay}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }}>
                      {p?.brand} {p?.name}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', marginLeft: '8px' }}>
                      ×{o.quantity} {o.supplier === 'local' ? '🏠 Yerel' : '🌍 Global'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#E24B4A', fontWeight: 600 }}>
                    -{fmtMoney(o.totalCost)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mevcut stok */}
      {stockedItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--color-text-mute)',
          background: 'var(--color-cream-card)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
          <div>Depo boş. Pazar sekmesinden ürün sipariş et.</div>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
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
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--color-cream-card)',
            }}>
              {items.map((item, idx) => {
                const currentPrice = prices[item.id];
                const margin = currentPrice ? ((currentPrice - item.product.buyPrice) / item.product.buyPrice * 100).toFixed(0) : null;
                const stockValue = item.product.buyPrice * item.qty;

                return (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto auto',
                    gap: '1rem',
                    padding: '0.875rem 1rem',
                    borderTop: idx === 0 ? 'none' : '0.5px solid var(--color-border)',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    {/* Icon */}
                    <span style={{ fontSize: '1.4rem' }}>{item.product.icon || CATEGORY_ICONS[item.product.category]}</span>

                    {/* Ürün bilgisi */}
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                        {item.product.brand} {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>
                        {item.product.specs} • Maliyet: {fmtMoney(item.product.buyPrice)}
                      </div>
                    </div>

                    {/* Stok */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                        {item.qty}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>adet</div>
                    </div>

                    {/* Stok değeri */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-mute)' }}>
                        {fmtMoney(stockValue)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>değer</div>
                    </div>

                    {/* Satış fiyatı */}
                    <div style={{ textAlign: 'right' }}>
                      {currentPrice ? (
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#1D9E75' }}>
                            {fmtMoney(currentPrice)}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: parseFloat(margin) > 0 ? '#1D9E75' : '#E24B4A', fontFamily: 'var(--font-mono)' }}>
                            %{margin} marj
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#e8a04a', fontWeight: 500 }}>
                          Fiyat yok
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* İkinci El Stok */}
      {secondHandEntries.length > 0 && (
        <section style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ♻️ İkinci El Stok
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {secondHandEntries.map(([productId, qty]) => (
              <SecondHandRow
                key={productId}
                productId={productId}
                qty={qty}
                sellSecondHandAction={sellSecondHandAction}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
