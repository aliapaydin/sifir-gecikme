'use client';

import { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/tech-center-data';

function fmtMoney(n) {
  if (n >= 1_000_000) return `₺${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₺${Math.round(n/1000)}K`;
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

// Visual PC case representation
function CaseVisual({ product, size = 'md' }) {
  const w = size === 'sm' ? 40 : 64;
  const h = size === 'sm' ? 60 : 96;
  const bg = product?.caseColor || '#2a2a2a';
  const accent = product?.caseAccent || '#4a9eff';

  return (
    <div style={{
      width: w, height: h, flexShrink: 0,
      borderRadius: size === 'sm' ? '4px 4px 3px 3px' : '6px 6px 4px 4px',
      background: `linear-gradient(160deg, ${bg} 0%, ${bg}dd 100%)`,
      border: `1px solid ${accent}44`,
      position: 'relative', overflow: 'hidden',
      boxShadow: `inset 1px 0 0 ${accent}33, 0 2px 8px rgba(0,0,0,0.3)`,
    }}>
      {/* Front panel accent strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: size === 'sm' ? 3 : 5, background: accent, opacity: 0.8 }} />
      {/* Power button */}
      <div style={{
        position: 'absolute', top: size === 'sm' ? 6 : 10, right: size === 'sm' ? 5 : 8,
        width: size === 'sm' ? 5 : 8, height: size === 'sm' ? 5 : 8,
        borderRadius: '50%', background: accent, opacity: 0.9,
        boxShadow: `0 0 ${size === 'sm' ? 4 : 6}px ${accent}`,
      }} />
      {/* Drive bay lines */}
      {[0,1,2].map(i => (
        <div key={i} style={{
          position: 'absolute',
          top: size === 'sm' ? (18 + i*10) : (28 + i*16),
          left: size === 'sm' ? 4 : 6, right: size === 'sm' ? 4 : 6,
          height: size === 'sm' ? 3 : 5,
          background: `${accent}22`, borderRadius: 1,
          borderBottom: `1px solid ${accent}33`,
        }} />
      ))}
      {/* Ventilation holes */}
      <div style={{ position: 'absolute', bottom: size === 'sm' ? 4 : 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: size === 'sm' ? 3 : 5, height: size === 'sm' ? 3 : 5, borderRadius: '50%', background: `${accent}44` }} />
        ))}
      </div>
    </div>
  );
}

const BUILD_SLOTS = [
  { key: 'case',        label: 'Kasa',        emoji: '🖥️', category: 'case',        required: true },
  { key: 'cpu',         label: 'İşlemci',     emoji: '🔲', category: 'cpu',         required: true },
  { key: 'motherboard', label: 'Anakart',     emoji: '🟩', category: 'motherboard', required: true },
  { key: 'ram',         label: 'RAM',         emoji: '🧩', category: 'ram',         required: true },
  { key: 'storage',     label: 'Depolama',    emoji: '💿', category: 'ssd',         required: true },
  { key: 'psu',         label: 'Güç Kaynağı', emoji: '🔌', category: 'psu',         required: true },
  { key: 'gpu',         label: 'Ekran Kartı', emoji: '🎮', category: 'gpu',         required: false },
];

function checkCompatibility(build) {
  const issues = [];
  const cpu = build.cpu ? PRODUCTS[build.cpu] : null;
  const mb  = build.motherboard ? PRODUCTS[build.motherboard] : null;
  const ram = build.ram ? PRODUCTS[build.ram] : null;
  const psu = build.psu ? PRODUCTS[build.psu] : null;
  const gpu = build.gpu ? PRODUCTS[build.gpu] : null;
  const cas = build.case ? PRODUCTS[build.case] : null;

  if (cpu && mb && cpu.socket !== mb.socket) {
    issues.push(`CPU soketi (${cpu.socket}) anakart soketi ile (${mb.socket}) uyuşmuyor`);
  }
  if (ram && mb && ram.ramType !== mb.ramType) {
    issues.push(`RAM tipi (${ram.ramType}) anakart desteklemiyor (${mb.ramType})`);
  }
  if (psu && cpu) {
    const needed = (cpu.tdp || 65) + (gpu?.tdp || 0) + 100;
    if (psu.wattage < needed) {
      issues.push(`PSU (${psu.wattage}W) yetersiz — en az ${needed}W gerekli`);
    }
  }
  if (cas && mb && !cas.supportedMB?.includes(mb.formFactor)) {
    issues.push(`Kasa ${mb.formFactor} anakart desteklemiyor`);
  }
  return issues;
}

function estimateValue(build) {
  const total = Object.values(build)
    .filter(Boolean)
    .reduce((s, id) => s + (PRODUCTS[id]?.buyPrice || 0), 0);
  return Math.round(total * 1.28 + 2500);
}

export default function PCToplaApp({ state, buildPCAction, sellBuiltPCAction, fulfillPCOrderAction }) {
  const [build, setBuild] = useState({
    case: null, cpu: null, motherboard: null, ram: null,
    storage: null, psu: null, gpu: null,
  });
  const [activeSlot, setActiveSlot] = useState(null);
  const [listPrices, setListPrices] = useState({});
  const [tab, setTab] = useState('build'); // 'build' | 'built' | 'orders' | 'history'

  const inventory = state.inventory || {};
  const builtPCs = (state.builtPCs || []).filter(p => !p.sold);
  const pendingPCOrders = (state.pendingPCOrders || []).filter(o => !o.fulfilled);
  const pcSalesHistory = (state.allTimeSales || []).filter(s => s.category === 'pc_build').sort((a, b) => b.day - a.day);

  // Products available in inventory for a given category
  const availableFor = (category) =>
    Object.values(PRODUCTS).filter(p =>
      p.category === category && (inventory[p.id] || 0) > 0
    );

  const issues = useMemo(() => checkCompatibility(build), [build]);
  const estimatedVal = useMemo(() => estimateValue(build), [build]);
  const requiredFilled = BUILD_SLOTS.filter(s => s.required).every(s => build[s.key]);
  const canBuild = requiredFilled && issues.length === 0;

  const handleBuild = () => {
    if (!canBuild) return;
    buildPCAction(build, estimatedVal);
    setBuild({ case: null, cpu: null, motherboard: null, ram: null, storage: null, psu: null, gpu: null });
    setTab('built');
  };

  const catColor = (cat) => CATEGORY_COLORS[cat] || '#6B7280';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-cream)' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '2px', padding: '10px 16px 0', background: 'var(--color-cream-card)', borderBottom: '1px solid var(--color-border)', flexShrink: 0, flexWrap: 'wrap' }}>
        {[
          { id: 'build', label: '🔧 PC Topla' },
          { id: 'built', label: `📦 Hazır PC'ler${builtPCs.length > 0 ? ` (${builtPCs.length})` : ''}` },
          { id: 'orders', label: `📋 Siparişler${pendingPCOrders.length > 0 ? ` (${pendingPCOrders.length})` : ''}` },
          { id: 'history', label: '📜 PC Satışları' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer',
            borderBottom: tab === t.id ? '2.5px solid var(--color-accent)' : '2.5px solid transparent',
            color: tab === t.id ? 'var(--color-accent)' : 'var(--color-text-mute)',
            fontSize: '0.85rem', fontWeight: tab === t.id ? 600 : 400,
            fontFamily: 'inherit',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'build' && (
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', gap: '0', minHeight: 0 }}>
          {/* Left — slot selector */}
          <div style={{ width: '260px', flexShrink: 0, borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--color-border)' }}>
              Konfigürasyon
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {BUILD_SLOTS.map(slot => {
                const selected = build[slot.key] ? PRODUCTS[build[slot.key]] : null;
                const hasStock = availableFor(slot.category).length > 0;
                const isActive = activeSlot === slot.key;
                return (
                  <div
                    key={slot.key}
                    onClick={() => setActiveSlot(isActive ? null : slot.key)}
                    style={{
                      padding: '8px 10px', marginBottom: '4px', borderRadius: '8px', cursor: 'pointer',
                      border: isActive ? `1.5px solid var(--color-accent)` : `1px solid ${selected ? catColor(slot.category) + '44' : 'var(--color-border)'}`,
                      background: isActive ? 'var(--color-accent-soft, #EEF2FF)' : selected ? catColor(slot.category) + '11' : 'var(--color-cream-card)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{slot.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {slot.label}
                          {!slot.required && <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', background: 'var(--color-cream)', border: '1px solid var(--color-border)' }}>opsiyonel</span>}
                        </div>
                        {selected ? (
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selected.brand} {selected.name}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: hasStock ? 'var(--color-text-mute)' : '#E24B4A', fontStyle: 'italic' }}>
                            {hasStock ? 'Seç...' : 'Stok yok'}
                          </div>
                        )}
                      </div>
                      {selected && (
                        <button
                          onClick={e => { e.stopPropagation(); setBuild(b => ({ ...b, [slot.key]: null })); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E24B4A', fontSize: '0.85rem', padding: '0 2px', flexShrink: 0 }}
                        >✕</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Middle — product picker OR case visual */}
          <div style={{ flex: 1, overflow: 'auto', padding: '12px', minWidth: 0 }}>
            {activeSlot ? (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {BUILD_SLOTS.find(s => s.key === activeSlot)?.label} Seç
                </div>
                {availableFor(BUILD_SLOTS.find(s => s.key === activeSlot)?.category || '').length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '0.85rem' }}>
                    Stokta ürün yok. Pazar'dan sipariş ver.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {availableFor(BUILD_SLOTS.find(s => s.key === activeSlot)?.category || '').map(p => {
                      const isSelected = build[activeSlot] === p.id;
                      const cat = p.category;
                      return (
                        <div
                          key={p.id}
                          onClick={() => { setBuild(b => ({ ...b, [activeSlot]: p.id })); setActiveSlot(null); }}
                          style={{
                            padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                            border: isSelected ? `2px solid ${catColor(cat)}` : '1px solid var(--color-border)',
                            background: isSelected ? catColor(cat) + '15' : 'var(--color-cream-card)',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            transition: 'all 0.1s',
                          }}
                        >
                          {cat === 'case' ? (
                            <CaseVisual product={p} size="sm" />
                          ) : (
                            <div style={{ width: 32, height: 32, borderRadius: '8px', background: catColor(cat) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                              {p.icon || '📦'}
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{p.brand} {p.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>{p.specs}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: catColor(cat) }}>{fmtMoney(p.buyPrice)}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{inventory[p.id]}x stok</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '16px' }}>
                {build.case && <CaseVisual product={PRODUCTS[build.case]} size="md" />}
                {!build.case && (
                  <div style={{ width: 64, height: 96, borderRadius: '6px 6px 4px 4px', background: 'var(--color-cream-card)', border: '2px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-mute)', fontSize: '1.5rem' }}>🖥️</div>
                )}
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-mute)', textAlign: 'center' }}>
                  {build.case ? `${PRODUCTS[build.case]?.brand} ${PRODUCTS[build.case]?.name}` : 'Kasa seçilmedi'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>← Bir slot seçerek parça ekle</div>
              </div>
            )}
          </div>

          {/* Right — summary + build */}
          <div style={{ width: '220px', flexShrink: 0, borderLeft: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--color-border)' }}>
              Özet
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
              {/* Cost breakdown */}
              {BUILD_SLOTS.map(slot => {
                const p = build[slot.key] ? PRODUCTS[build[slot.key]] : null;
                if (!p) return null;
                return (
                  <div key={slot.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-mute)' }}>{slot.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 600 }}>{fmtMoney(p.buyPrice)}</span>
                  </div>
                );
              })}

              {requiredFilled && (
                <>
                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-mute)' }}>Parça toplam</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {fmtMoney(Object.values(build).filter(Boolean).reduce((s, id) => s + (PRODUCTS[id]?.buyPrice || 0), 0))}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-mute)' }}>Montaj ücreti</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#1D9E75', fontWeight: 600 }}>+₺2.500</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginTop: '4px' }}>
                    <span style={{ color: 'var(--color-text)', fontWeight: 700 }}>Satış fiyatı</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#1D9E75', fontWeight: 800 }}>{fmtMoney(estimatedVal)}</span>
                  </div>
                </>
              )}

              {/* Compatibility */}
              {issues.length > 0 && (
                <div style={{ marginTop: '10px', padding: '8px', borderRadius: '6px', background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>⚠️ Uyumsuzluk</div>
                  {issues.map((iss, i) => (
                    <div key={i} style={{ fontSize: '0.7rem', color: '#991B1B', lineHeight: 1.4 }}>{iss}</div>
                  ))}
                </div>
              )}
              {requiredFilled && issues.length === 0 && (
                <div style={{ marginTop: '10px', padding: '8px', borderRadius: '6px', background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                  <div style={{ fontSize: '0.75rem', color: '#065F46', fontWeight: 600 }}>✓ Tüm parçalar uyumlu</div>
                </div>
              )}
            </div>

            {/* Build button */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
              <button
                onClick={handleBuild}
                disabled={!canBuild}
                style={{
                  width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
                  background: canBuild ? '#1D9E75' : 'var(--color-border)',
                  color: canBuild ? '#fff' : 'var(--color-text-mute)',
                  fontSize: '0.88rem', fontWeight: 700,
                  cursor: canBuild ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                {canBuild ? '🔧 PC Topla →' : requiredFilled ? '⚠️ Uyumsuz' : 'Parçaları Seç'}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'built' && (
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {builtPCs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-mute)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖥️</div>
              <div>Henüz toplanmış PC yok</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>PC Topla sekmesinden bilgisayar toplayabilirsin</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {builtPCs.map(pc => {
                const caseProd = pc.components.case ? PRODUCTS[pc.components.case] : null;
                const localPrice = listPrices[pc.id];
                const displayPrice = localPrice !== undefined ? localPrice : pc.listPrice;

                return (
                  <div key={pc.id} style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '12px' }}>
                    <CaseVisual product={caseProd} size="md" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: '4px' }}>
                        Toplama PC #{pc.id.slice(-4)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '8px' }}>
                        {caseProd?.brand} {caseProd?.name} · Gün {pc.builtDay}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '2px' }}>
                        Maliyet: <span style={{ fontFamily: 'var(--font-mono)', color: '#E24B4A', fontWeight: 600 }}>{fmtMoney(pc.totalCost)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        <input
                          type="number"
                          value={displayPrice}
                          onChange={e => setListPrices(prev => ({ ...prev, [pc.id]: parseInt(e.target.value) || 0 }))}
                          style={{ flex: 1, padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-cream)', color: 'var(--color-text)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', outline: 'none', minWidth: 0 }}
                        />
                        <button
                          onClick={() => sellBuiltPCAction(pc.id, displayPrice)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#1D9E75', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          Sat
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {pendingPCOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-mute)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <div>Bekleyen PC siparişi yok</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Müşterilerden gelen PC siparişleri burada görünür</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingPCOrders.map(order => {
                const matchingPCs = builtPCs.filter(pc => pc.listPrice <= order.budget * 1.1);
                return (
                  <div key={order.id} style={{ background: 'var(--color-cream-card)', border: '1px solid #F59E0B44', borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>
                          🖥️ {order.spec?.label || 'Özel PC'} — {order.customerName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', marginTop: '2px', fontStyle: 'italic' }}>
                          {order.spec?.specs}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>Bütçe</div>
                        <div style={{ fontWeight: 700, color: '#1D9E75', fontFamily: 'var(--font-mono)' }}>{fmtMoney(order.budget)}</div>
                      </div>
                    </div>

                    {matchingPCs.length > 0 ? (
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '6px', fontWeight: 600 }}>
                          Bu siparişe uygun PC'ler:
                        </div>
                        {matchingPCs.map(pc => {
                          const caseProd = pc.components.case ? PRODUCTS[pc.components.case] : null;
                          return (
                            <div key={pc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'var(--color-cream)', borderRadius: '8px', marginBottom: '4px', border: '1px solid var(--color-border)' }}>
                              <CaseVisual product={caseProd} size="sm" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>
                                  Toplama PC #{pc.id.slice(-4)}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>
                                  Maliyet: {fmtMoney(pc.totalCost)} · Liste: {fmtMoney(pc.listPrice)}
                                </div>
                              </div>
                              <button
                                onClick={() => fulfillPCOrderAction && fulfillPCOrderAction(order.id, pc.id)}
                                style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#F59E0B', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                              >
                                Bu PC'yi Ata
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ padding: '8px 10px', background: '#FEF3C7', borderRadius: '8px', fontSize: '0.78rem', color: '#92400E' }}>
                        ⚠️ Bütçeye uygun hazır PC yok. PC Topla sekmesinden yeni bir tane montajla.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {pcSalesHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-mute)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📜</div>
              <div>Henüz PC satışı yok</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px', gap: '8px', padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)' }}>
                <span>Gün</span>
                <span>PC</span>
                <span style={{ textAlign: 'right' }}>Gelir</span>
                <span style={{ textAlign: 'right' }}>Maliyet</span>
                <span style={{ textAlign: 'right' }}>Kâr</span>
              </div>
              {pcSalesHistory.map((sale, i) => (
                <div key={sale.id || i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px', gap: '8px', padding: '8px 10px', background: 'var(--color-cream-card)', borderRadius: '8px', border: '0.5px solid var(--color-border)', fontSize: '0.8rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-mute)' }}>G{sale.day}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sale.productName}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#1D9E75', fontWeight: 600 }}>{fmtMoney(sale.revenue)}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#E24B4A' }}>{fmtMoney(sale.cogs)}</span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: sale.profit >= 0 ? '#1D9E75' : '#E24B4A' }}>{fmtMoney(sale.profit)}</span>
                </div>
              ))}
              <div style={{ padding: '8px 10px', borderTop: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                <span></span>
                <span style={{ color: 'var(--color-text-mute)' }}>Toplam ({pcSalesHistory.length} PC)</span>
                <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#1D9E75' }}>{fmtMoney(pcSalesHistory.reduce((s, r) => s + r.revenue, 0))}</span>
                <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#E24B4A' }}>{fmtMoney(pcSalesHistory.reduce((s, r) => s + r.cogs, 0))}</span>
                <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#1D9E75' }}>{fmtMoney(pcSalesHistory.reduce((s, r) => s + r.profit, 0))}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
