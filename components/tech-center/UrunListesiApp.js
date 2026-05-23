'use client';

import { useState } from 'react';
import { PRODUCTS, CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_ICONS, UNLOCK_CATEGORIES } from '@/lib/tech-center-data';

function fmtMoney(n) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₺${Math.round(n / 1000)}K`;
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

// Build a map of category → earliest unlock day
const CAT_UNLOCK_DAY = {};
for (const [day, cats] of Object.entries(UNLOCK_CATEGORIES)) {
  for (const cat of cats) {
    if (!CAT_UNLOCK_DAY[cat]) CAT_UNLOCK_DAY[cat] = parseInt(day, 10);
  }
}

// Group products by category
const PRODUCTS_BY_CAT = {};
for (const product of Object.values(PRODUCTS)) {
  if (!PRODUCTS_BY_CAT[product.category]) PRODUCTS_BY_CAT[product.category] = [];
  PRODUCTS_BY_CAT[product.category].push(product);
}

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS);

export default function UrunListesiApp({ state }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | unlocked | locked

  const unlockedCategories = state.unlockedCategories || [];
  const query = searchQuery.toLowerCase().trim();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-cream)',
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        padding: '0.875rem 1rem',
        background: 'var(--color-cream-card)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        <div style={{ flex: '1 1 200px', position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.85rem', color: 'var(--color-text-mute)', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Ürün veya marka ara..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '7px 12px 7px 30px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-cream)',
              color: 'var(--color-text)', fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'unlocked', label: '✓ Açık' },
            { value: 'locked', label: '🔒 Kilitli' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              style={{
                padding: '6px 14px', borderRadius: '8px',
                border: filter === opt.value ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: filter === opt.value ? 'var(--color-accent-soft, #EEF2FF)' : 'var(--color-cream-card)',
                color: filter === opt.value ? 'var(--color-accent)' : 'var(--color-text-mute)',
                fontSize: '0.8rem', fontWeight: filter === opt.value ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {ALL_CATEGORIES.map(cat => {
          const isLocked = !unlockedCategories.includes(cat);
          const unlockDay = CAT_UNLOCK_DAY[cat];
          const products = PRODUCTS_BY_CAT[cat] || [];
          const catColor = CATEGORY_COLORS[cat] || '#6B7280';
          const catIcon = CATEGORY_ICONS[cat] || '📦';
          const catLabel = CATEGORY_LABELS[cat] || cat;

          // Filter by locked/unlocked toggle
          if (filter === 'unlocked' && isLocked) return null;
          if (filter === 'locked' && !isLocked) return null;

          // Filter by search — if search active, check products
          const filteredProducts = query
            ? products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query) ||
                p.specs.toLowerCase().includes(query)
              )
            : products;

          if (query && filteredProducts.length === 0) return null;

          return (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              {/* Category header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '0.625rem',
                padding: '6px 10px',
                borderRadius: '8px',
                background: isLocked ? 'var(--color-cream-card)' : catColor + '15',
                border: `1px solid ${isLocked ? 'var(--color-border)' : catColor + '40'}`,
              }}>
                <span style={{ fontSize: '1.1rem' }}>{catIcon}</span>
                <span style={{
                  fontWeight: 700, fontSize: '0.9rem',
                  color: isLocked ? 'var(--color-text-mute)' : catColor,
                }}>
                  {catLabel}
                </span>
                {isLocked && (
                  <span style={{
                    marginLeft: '4px',
                    padding: '1px 8px', borderRadius: '999px',
                    background: '#FEF3C7', color: '#92400E',
                    fontSize: '0.72rem', fontWeight: 600,
                  }}>
                    🔒 Kilitli — Gün {unlockDay}'de açılır
                  </span>
                )}
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.72rem', color: 'var(--color-text-mute)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {filteredProducts.length} ürün
                </span>
              </div>

              {/* Product grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '0.625rem',
              }}>
                {filteredProducts.map(product => {
                  const stock = (state.inventory || {})[product.id] || 0;
                  const ourPrice = (state.prices || {})[product.id] || Math.round(product.buyPrice * 1.20);

                  return (
                    <div
                      key={product.id}
                      style={{
                        background: 'var(--color-cream-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '10px',
                        padding: '0.875rem',
                        opacity: isLocked ? 0.5 : 1,
                        position: 'relative',
                        transition: 'box-shadow 0.15s',
                      }}
                    >
                      {/* Locked overlay badge */}
                      {isLocked && (
                        <div style={{
                          position: 'absolute', top: '8px', right: '8px',
                          fontSize: '1rem',
                        }}>
                          🔒
                        </div>
                      )}

                      {/* Product header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                        <span style={{
                          width: '30px', height: '30px', borderRadius: '6px',
                          background: catColor + '22', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
                        }}>
                          {product.icon || catIcon}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontWeight: 700, fontSize: '0.82rem',
                            color: 'var(--color-text)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {product.brand}
                          </div>
                          <div style={{
                            fontSize: '0.75rem', color: 'var(--color-text-mute)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {product.name}
                          </div>
                        </div>
                      </div>

                      {/* Specs */}
                      <div style={{
                        fontSize: '0.72rem', color: 'var(--color-text-mute)',
                        marginBottom: '0.625rem',
                        background: 'var(--color-cream)',
                        padding: '3px 8px', borderRadius: '4px',
                      }}>
                        {product.specs}
                      </div>

                      {/* Prices */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>Alış</div>
                          <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#E24B4A', fontWeight: 600 }}>
                            {fmtMoney(product.buyPrice)}
                          </div>
                        </div>
                        {!isLocked && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>Satış</div>
                            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#1D9E75', fontWeight: 600 }}>
                              {fmtMoney(ourPrice)}
                            </div>
                          </div>
                        )}
                        {isLocked && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>Gün</div>
                            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#F59E0B', fontWeight: 600 }}>
                              {unlockDay}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stock badge (only unlocked) */}
                      {!isLocked && (
                        <div style={{
                          marginTop: '0.5rem',
                          display: 'flex', justifyContent: 'flex-end',
                        }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '999px',
                            background: stock > 0 ? '#D1FAE5' : '#FEE2E2',
                            color: stock > 0 ? '#065F46' : '#991B1B',
                            fontSize: '0.7rem', fontWeight: 600,
                            fontFamily: 'var(--font-mono)',
                          }}>
                            {stock > 0 ? `✓ ${stock} stok` : '✗ Yok'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
