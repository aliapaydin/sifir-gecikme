'use client';

import { useState, useMemo, Fragment } from 'react';
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
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: size === 'sm' ? 3 : 5, background: accent, opacity: 0.8 }} />
      <div style={{
        position: 'absolute', top: size === 'sm' ? 6 : 10, right: size === 'sm' ? 5 : 8,
        width: size === 'sm' ? 5 : 8, height: size === 'sm' ? 5 : 8,
        borderRadius: '50%', background: accent, opacity: 0.9,
        boxShadow: `0 0 ${size === 'sm' ? 4 : 6}px ${accent}`,
      }} />
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
      <div style={{ position: 'absolute', bottom: size === 'sm' ? 4 : 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: size === 'sm' ? 3 : 5, height: size === 'sm' ? 3 : 5, borderRadius: '50%', background: `${accent}44` }} />
        ))}
      </div>
    </div>
  );
}

const BUILD_SLOTS = [
  { key: 'case',        label: 'Kasa',            emoji: '🖥️', category: 'case',        required: true },
  { key: 'cpu',         label: 'İşlemci',          emoji: '🔲', category: 'cpu',         required: true },
  { key: 'motherboard', label: 'Anakart',           emoji: '🟩', category: 'motherboard', required: true },
  { key: 'ram1',        label: 'RAM (1. Kanal)',    emoji: '🧩', category: 'ram',         required: true },
  { key: 'ram2',        label: 'RAM (2. Kanal)',    emoji: '🧩', category: 'ram',         required: false, matchKey: 'ram1' },
  { key: 'storage1',    label: 'Depolama 1',        emoji: '💿', category: 'ssd',         required: true },
  { key: 'storage2',    label: 'Depolama 2',        emoji: '💿', category: 'ssd',         required: false },
  { key: 'psu',         label: 'Güç Kaynağı',      emoji: '🔌', category: 'psu',         required: true },
  { key: 'gpu',         label: 'Ekran Kartı',       emoji: '🎮', category: 'gpu',         required: false },
];

const PERIPHERAL_SLOTS = [
  { key: 'monitor',  label: 'Monitör',    emoji: '🖥️', category: 'monitor'  },
  { key: 'mouse',    label: 'Mouse',       emoji: '🖱️', category: 'mouse'    },
  { key: 'keyboard', label: 'Klavye',      emoji: '⌨️', category: 'keyboard' },
  { key: 'headset',  label: 'Kulaklık',    emoji: '🎧', category: 'headset'  },
  { key: 'webcam',   label: 'Webcam',      emoji: '📷', category: 'webcam'   },
  { key: 'speaker',  label: 'Hoparlör',    emoji: '🔊', category: 'speaker'  },
  { key: 'printer',  label: 'Yazıcı',      emoji: '🖨️', category: 'printer'  },
];

const MAIN_SLOTS_INIT = { case: null, cpu: null, motherboard: null, ram1: null, ram2: null, storage1: null, storage2: null, psu: null, gpu: null };
const PERIPHERAL_INIT = { monitor: null, mouse: null, keyboard: null, headset: null, webcam: null, speaker: null, printer: null };

const SLOT_KEY_LABELS = BUILD_SLOTS.reduce((acc, s) => { acc[s.key] = s.label; return acc; }, {});
const SLOT_KEY_EMOJIS = BUILD_SLOTS.reduce((acc, s) => { acc[s.key] = s.emoji; return acc; }, {});

function checkCompatibility(build) {
  const issues = [];
  const cpu = build.cpu ? PRODUCTS[build.cpu] : null;
  const mb  = build.motherboard ? PRODUCTS[build.motherboard] : null;
  const ram = build.ram1 ? PRODUCTS[build.ram1] : null;
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
  if (build.ram2 && build.ram1 !== build.ram2) {
    issues.push('RAM kanalları aynı model olmalı (Çift Kanal)');
  }
  return issues;
}

function estimateValue(build) {
  const total = Object.values(build)
    .filter(Boolean)
    .reduce((s, id) => s + (PRODUCTS[id]?.buyPrice || 0), 0);
  return Math.round(total * 1.28 + 2500);
}

function calcPCScore(build) {
  let total = 0; let max = 0;
  const cpu = build.cpu ? PRODUCTS[build.cpu] : null;
  const gpu = build.gpu ? PRODUCTS[build.gpu] : null;
  const ram = build.ram1 ? PRODUCTS[build.ram1] : null;
  const stor = build.storage1 ? PRODUCTS[build.storage1] : null;
  const psu = build.psu ? PRODUCTS[build.psu] : null;

  if (cpu) { max += 25; total += cpu.buyPrice >= 12000 ? 25 : cpu.buyPrice >= 6000 ? 18 : cpu.buyPrice >= 3500 ? 12 : 7; }
  if (gpu) { max += 35; total += gpu.buyPrice >= 40000 ? 35 : gpu.buyPrice >= 20000 ? 28 : gpu.buyPrice >= 10000 ? 20 : gpu.buyPrice >= 7000 ? 14 : 8; }
  if (ram) { max += 15; const baseR = ram.ramType === 'DDR5' ? 10 : 7; total += build.ram2 ? Math.min(15, baseR + 5) : baseR; }
  if (stor) { max += 10; total += stor.specs?.includes('NVMe') ? 10 : 6; if (build.storage2) total = Math.min(total + 3, 10); }
  if (psu) { max += 5; total += psu.wattage >= 750 ? 5 : psu.wattage >= 650 ? 3 : 2; }
  if (max === 0) return null;
  const pct = Math.round((total / max) * 100);
  const label = pct >= 86 ? { text: 'S — Efsane', color: '#F59E0B' }
    : pct >= 71 ? { text: 'A — Harika', color: '#1D9E75' }
    : pct >= 51 ? { text: 'B — İyi', color: '#7F77DD' }
    : pct >= 31 ? { text: 'C — Orta', color: '#e8a04a' }
    : { text: 'D — Temel', color: '#6B7280' };
  return { pct, ...label };
}

function PCInteriorVisual({ build }) {
  const caseP = build.case ? PRODUCTS[build.case] : null;
  const accent = caseP?.caseAccent || '#4a9eff';
  const caseBg = caseP?.caseColor || '#1a1a2e';

  const slot = (label, emoji, productId, color = '#2a4a6a') => {
    const p = productId ? PRODUCTS[productId] : null;
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px',
        borderRadius: 6, background: p ? color + '33' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${p ? color + '66' : 'rgba(255,255,255,0.08)'}`,
        minHeight: 32, transition: 'all 0.3s',
      }}>
        <span style={{ fontSize: '1rem', opacity: p ? 1 : 0.3 }}>{emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {p ? (
            <>
              <div style={{ fontSize: '0.65rem', color: color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {p.brand} {p.name}
              </div>
            </>
          ) : (
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>{label} — boş</div>
          )}
        </div>
      </div>
    );
  };

  const peripheralKeys = PERIPHERAL_SLOTS.map(s => s.key).filter(k => build[k]);

  return (
    <div style={{
      width: '100%', maxWidth: 320,
      background: `linear-gradient(160deg, ${caseBg} 0%, ${caseBg}cc 100%)`,
      border: `1.5px solid ${accent}55`,
      borderRadius: 10, overflow: 'hidden',
      boxShadow: `0 4px 24px ${accent}22, inset 0 1px 0 ${accent}33`,
    }}>
      <div style={{ height: 5, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${accent}22`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: caseP ? accent : 'rgba(255,255,255,0.2)', boxShadow: caseP ? `0 0 6px ${accent}` : 'none' }} />
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
          {caseP ? `${caseP.brand} ${caseP.name}` : 'Kasa Seçilmedi'}
        </span>
      </div>
      <div style={{ margin: 10, padding: 10, background: 'rgba(20,80,20,0.35)', border: '1px solid rgba(30,120,30,0.4)', borderRadius: 8 }}>
        <div style={{ fontSize: '0.6rem', color: 'rgba(100,200,100,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Anakart Bölgesi</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>{slot('CPU', '🔲', build.cpu, '#4a9eff')}</div>
          <div style={{ flex: 1 }}>{slot('ANAKART', '🟩', build.motherboard, '#1D9E75')}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1 }}>{slot('RAM 1', '🧩', build.ram1, '#7F77DD')}</div>
          <div style={{ flex: 1 }}>{slot('RAM 2', '🧩', build.ram2, '#7F77DD')}</div>
        </div>
      </div>
      <div style={{ margin: '0 10px 8px', padding: '0 4px' }}>
        {slot('Ekran Kartı', '🎮', build.gpu, '#F59E0B')}
      </div>
      <div style={{ margin: '0 10px 8px', display: 'flex', gap: 6 }}>
        <div style={{ flex: 1 }}>{slot('Depo 1', '💿', build.storage1, '#0EA5E9')}</div>
        <div style={{ flex: 1 }}>{slot('Depo 2', '💿', build.storage2, '#0EA5E9')}</div>
      </div>
      <div style={{ margin: '0 10px 10px', padding: '0 4px' }}>
        {slot('Güç Kaynağı', '🔌', build.psu, '#8B5CF6')}
      </div>
      <div style={{ padding: '6px 14px', display: 'flex', gap: 3, borderTop: `1px solid ${accent}22` }}>
        {[build.case, build.cpu, build.motherboard, build.ram1, build.storage1, build.psu].map((v, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: v ? accent : 'rgba(255,255,255,0.1)', boxShadow: v ? `0 0 4px ${accent}` : 'none' }} />
        ))}
      </div>
      {peripheralKeys.length > 0 && (
        <div style={{ padding: '6px 10px 10px', borderTop: `1px solid ${accent}22` }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Çevre Birimleri</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {peripheralKeys.map(k => {
              const ps = PERIPHERAL_SLOTS.find(s => s.key === k);
              const p = PRODUCTS[build[k]];
              return (
                <div key={k} style={{ padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span>{ps?.emoji}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 60 }}>{p?.brand} {p?.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PCToplaApp({ state, buildPCAction, sellBuiltPCAction, fulfillPCOrderAction, isMobile }) {
  const [build, setBuild] = useState({ ...MAIN_SLOTS_INIT, ...PERIPHERAL_INIT });
  const [activeSlot, setActiveSlot] = useState(null);
  const [listPrices, setListPrices] = useState({});
  const [tab, setTab] = useState('build');
  const [expandedSaleId, setExpandedSaleId] = useState(null);
  const [peripheralsOpen, setPeripheralsOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const inventory = state.inventory || {};
  const builtPCs = (state.builtPCs || []).filter(p => !p.sold);
  const pendingPCOrders = (state.pendingPCOrders || []).filter(o => !o.fulfilled);

  // History: combine allTimeSales + todaySales, filter pc_build, sort by day desc
  const todayPCSales = (state.todaySales || []).filter(s => s.category === 'pc_build');
  const allTimePCSales = (state.allTimeSales || []).filter(s => s.category === 'pc_build');
  const seenIds = new Set(allTimePCSales.map(s => s.id));
  const pcSalesHistory = [...allTimePCSales, ...todayPCSales.filter(s => !seenIds.has(s.id))].sort((a, b) => b.day - a.day);

  const availableFor = (category) =>
    Object.values(PRODUCTS).filter(p =>
      p.category === category && (inventory[p.id] || 0) > 0
    );

  const issues = useMemo(() => checkCompatibility(build), [build]);
  const estimatedVal = useMemo(() => estimateValue(build), [build]);
  const requiredFilled = ['case','cpu','motherboard','ram1','storage1','psu'].every(k => build[k]);
  const canBuild = requiredFilled && issues.length === 0;
  const score = useMemo(() => calcPCScore(build), [build]);

  const handleBuild = () => {
    if (!canBuild) return;
    buildPCAction(build, estimatedVal);
    setBuild({ ...MAIN_SLOTS_INIT, ...PERIPHERAL_INIT });
    setTab('built');
  };

  const catColor = (cat) => CATEGORY_COLORS[cat] || '#6B7280';

  // Render a slot row in the left panel
  const renderSlotRow = (slot) => {
    const selected = build[slot.key] ? PRODUCTS[build[slot.key]] : null;
    const isActive = activeSlot === slot.key;

    // RAM 2 special behavior
    if (slot.key === 'ram2') {
      const ram1 = build.ram1;
      return (
        <div key={slot.key} style={{
          padding: '8px 10px', marginBottom: '4px', borderRadius: '8px',
          border: isActive ? `1.5px solid var(--color-accent)` : `1px solid ${selected ? catColor(slot.category) + '44' : 'var(--color-border)'}`,
          background: isActive ? 'var(--color-accent-soft, #EEF2FF)' : selected ? catColor(slot.category) + '11' : 'var(--color-cream-card)',
          transition: 'all 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{slot.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {slot.label}
                <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', background: 'var(--color-cream)', border: '1px solid var(--color-border)' }}>opsiyonel</span>
              </div>
              {!ram1 ? (
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', fontStyle: 'italic' }}>Önce RAM 1 seçin</div>
              ) : selected ? (
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {PRODUCTS[selected.id]?.brand} {selected.name} (Çift Kanal)
                </div>
              ) : (
                <button
                  onClick={e => { e.stopPropagation(); setBuild(b => ({ ...b, ram2: b.ram1 })); }}
                  style={{ fontSize: '0.72rem', color: '#7F77DD', background: '#7F77DD22', border: '1px solid #7F77DD44', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer', marginTop: '2px' }}
                >
                  + Çift Kanal Ekle
                </button>
              )}
            </div>
            {selected && (
              <button
                onClick={e => { e.stopPropagation(); setBuild(b => ({ ...b, ram2: null })); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E24B4A', fontSize: '0.85rem', padding: '0 2px', flexShrink: 0 }}
              >✕</button>
            )}
          </div>
        </div>
      );
    }

    const hasStock = availableFor(slot.category).length > 0;
    const inlineProducts = isMobile ? availableFor(slot.category) : [];
    return (
      <Fragment key={slot.key}>
        <div
          onClick={() => setActiveSlot(isActive ? null : slot.key)}
          style={{
            padding: '8px 10px', marginBottom: isActive && isMobile ? '0' : '4px',
            borderRadius: isActive && isMobile ? '8px 8px 0 0' : '8px', cursor: 'pointer',
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
                onClick={e => {
                  e.stopPropagation();
                  setBuild(b => {
                    const next = { ...b, [slot.key]: null };
                    if (slot.key === 'ram1') next.ram2 = null;
                    return next;
                  });
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E24B4A', fontSize: '0.85rem', padding: '0 2px', flexShrink: 0 }}
              >✕</button>
            )}
          </div>
        </div>
        {isMobile && isActive && (
          <div style={{ marginBottom: '4px', padding: '8px', background: 'var(--color-cream)', border: '1.5px solid var(--color-accent)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
            {inlineProducts.length === 0 ? (
              <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '0.82rem' }}>Stokta ürün yok. Pazar'dan sipariş ver.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {inlineProducts.map(p => {
                  const isSel = build[activeSlot] === p.id;
                  const cat = p.category;
                  return (
                    <div key={p.id}
                      onClick={() => { setBuild(b => { const n = { ...b, [activeSlot]: p.id }; if (activeSlot === 'ram1') n.ram2 = null; return n; }); setActiveSlot(null); }}
                      style={{ padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', border: isSel ? `2px solid ${catColor(cat)}` : '1px solid var(--color-border)', background: isSel ? catColor(cat) + '15' : 'var(--color-cream-card)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {cat === 'case' ? <CaseVisual product={p} size="sm" /> : (
                        <div style={{ width: 28, height: 28, borderRadius: '6px', background: catColor(cat) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{p.icon || '📦'}</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{p.brand} {p.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{p.specs}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: catColor(cat) }}>{fmtMoney(p.buyPrice)}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)' }}>{inventory[p.id]}x</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-cream)', position: 'relative', overflow: 'hidden' }}>
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
        <div style={{ flex: 1, overflow: isMobile ? 'auto' : 'hidden', display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: 0 }}>
          {/* Mobile: PC visual + özet toggle */}
          {isMobile && (
            <>
              <div style={{ flexShrink: 0, padding: '10px 12px', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'var(--color-cream)' }}>
                <PCInteriorVisual build={build} />
                {!build.case && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', textAlign: 'center' }}>Aşağıdan parça seçerek montajı başlat</div>
                )}
              </div>
              <div style={{ flexShrink: 0, padding: '7px 12px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-cream-card)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSummaryOpen(v => !v)}
                  style={{ padding: '5px 12px', borderRadius: '7px', border: '1px solid var(--color-border)', background: summaryOpen ? 'var(--color-accent-soft, #EEF2FF)' : 'transparent', color: summaryOpen ? 'var(--color-accent)' : 'var(--color-text-mute)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit' }}
                >
                  📊 Özet {summaryOpen ? '›' : '‹'}
                </button>
                {score && <span style={{ fontSize: '0.72rem', fontWeight: 700, color: score.color, padding: '3px 8px', borderRadius: '6px', background: score.color + '22' }}>{score.text}</span>}
                {issues.length > 0 && <span style={{ fontSize: '0.72rem', color: '#991B1B', padding: '3px 8px', borderRadius: '6px', background: '#FEE2E2' }}>⚠️ {issues.length} uyumsuzluk</span>}
              </div>
            </>
          )}
          {/* Left — slot selector */}
          <div style={{ width: isMobile ? '100%' : '260px', flexShrink: 0, borderRight: isMobile ? 'none' : '1px solid var(--color-border)', borderBottom: isMobile ? '1px solid var(--color-border)' : 'none', display: 'flex', flexDirection: 'column', overflow: isMobile ? 'visible' : 'hidden' }}>
            <div style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--color-border)' }}>
              Konfigürasyon
            </div>
            <div style={{ flex: isMobile ? 'none' : 1, overflowY: isMobile ? 'visible' : 'auto', padding: '8px' }}>
              {BUILD_SLOTS.map(slot => renderSlotRow(slot))}

              {/* Peripherals section */}
              <div
                onClick={() => setPeripheralsOpen(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 4px', cursor: 'pointer', marginTop: '4px', marginBottom: '4px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>
                  Çevre Birimleri (Opsiyonel)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)' }}>{peripheralsOpen ? '▲' : '▼'}</span>
              </div>
              {peripheralsOpen && PERIPHERAL_SLOTS.map(slot => {
                const selected = build[slot.key] ? PRODUCTS[build[slot.key]] : null;
                const isActive = activeSlot === slot.key;
                const hasStock = availableFor(slot.category).length > 0;
                const periphProds = isMobile ? availableFor(slot.category) : [];
                return (
                  <Fragment key={slot.key}>
                    <div
                      onClick={() => setActiveSlot(isActive ? null : slot.key)}
                      style={{
                        padding: '8px 10px', marginBottom: isActive && isMobile ? '0' : '4px',
                        borderRadius: isActive && isMobile ? '8px 8px 0 0' : '8px', cursor: 'pointer',
                        border: isActive ? `1.5px solid var(--color-accent)` : `1px solid ${selected ? catColor(slot.category) + '44' : 'var(--color-border)'}`,
                        background: isActive ? 'var(--color-accent-soft, #EEF2FF)' : selected ? catColor(slot.category) + '11' : 'var(--color-cream-card)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{slot.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)' }}>{slot.label}</div>
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
                    {isMobile && isActive && (
                      <div style={{ marginBottom: '4px', padding: '8px', background: 'var(--color-cream)', border: '1.5px solid var(--color-accent)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                        {periphProds.length === 0 ? (
                          <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '0.82rem' }}>Stokta ürün yok.</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {periphProds.map(p => {
                              const isSel = build[activeSlot] === p.id;
                              const cat = p.category;
                              return (
                                <div key={p.id} onClick={() => { setBuild(b => ({ ...b, [activeSlot]: p.id })); setActiveSlot(null); }}
                                  style={{ padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', border: isSel ? `2px solid ${catColor(cat)}` : '1px solid var(--color-border)', background: isSel ? catColor(cat) + '15' : 'var(--color-cream-card)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: 28, height: 28, borderRadius: '6px', background: catColor(cat) + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{p.icon || '📦'}</div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{p.brand} {p.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>{p.specs}</div>
                                  </div>
                                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: catColor(cat) }}>{fmtMoney(p.buyPrice)}</div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--color-text-mute)' }}>{inventory[p.id]}x</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>

          {/* Middle — product picker OR PC interior visual (desktop only) */}
          {!isMobile && (
          <div style={{ flex: 1, overflow: 'auto', padding: '12px', minWidth: 0 }}>
            {activeSlot ? (
              <>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {[...BUILD_SLOTS, ...PERIPHERAL_SLOTS].find(s => s.key === activeSlot)?.label} Seç
                </div>
                {availableFor([...BUILD_SLOTS, ...PERIPHERAL_SLOTS].find(s => s.key === activeSlot)?.category || '').length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-mute)', fontSize: '0.85rem' }}>
                    Stokta ürün yok. Pazar'dan sipariş ver.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {availableFor([...BUILD_SLOTS, ...PERIPHERAL_SLOTS].find(s => s.key === activeSlot)?.category || '').map(p => {
                      const isSelected = build[activeSlot] === p.id;
                      const cat = p.category;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setBuild(b => {
                              const next = { ...b, [activeSlot]: p.id };
                              // If changing ram1, reset ram2
                              if (activeSlot === 'ram1') next.ram2 = null;
                              return next;
                            });
                            setActiveSlot(null);
                          }}
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', gap: '16px' }}>
                <PCInteriorVisual build={build} />
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)', textAlign: 'center' }}>
                  {!build.case && '← Başlamak için Kasa seç'}
                  {build.case && !requiredFilled && '← Tüm gerekli slotları doldur'}
                </div>
              </div>
            )}
          </div>
          )}

          {/* Right: toggle tab + collapsible summary drawer (desktop only) */}
          {!isMobile && (
            <div style={{ display: 'flex', flexShrink: 0 }}>
              <button
                onClick={() => setSummaryOpen(v => !v)}
                title={summaryOpen ? 'Özeti Kapat' : 'Özeti Aç'}
                style={{
                  width: '22px', flexShrink: 0, padding: 0, cursor: 'pointer',
                  borderLeft: '1px solid var(--color-border)', background: summaryOpen ? 'var(--color-accent-soft, #EEF2FF)' : 'var(--color-cream-card)',
                  border: 'none', outline: 'none', borderLeft: '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: summaryOpen ? 'var(--color-accent)' : 'var(--color-text-mute)',
                  fontSize: '13px', transition: 'background 0.15s',
                }}
              >
                {summaryOpen ? '›' : '‹'}
              </button>
              <div style={{
                width: summaryOpen ? '220px' : '0px', flexShrink: 0,
                overflow: 'hidden', transition: 'width 0.25s ease',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--color-border)' }}>
                  <div style={{ padding: '10px 14px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--color-border)' }}>
                    Özet
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
              {/* Cost breakdown */}
              {[...BUILD_SLOTS, ...PERIPHERAL_SLOTS].map(slot => {
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

              {/* Performance score */}
              {score && (
                <div style={{ marginTop: '10px', padding: '8px 10px', borderRadius: '8px', background: score.color + '22', border: `1px solid ${score.color}44`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: score.color, fontWeight: 700 }}>🏆 Performans</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: score.color, fontWeight: 800 }}>{score.text}</div>
                    <div style={{ fontSize: '0.68rem', color: score.color, opacity: 0.8 }}>{score.pct}%</div>
                  </div>
                </div>
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
            </div>
          )}
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
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '6px', fontWeight: 600 }}>Bu siparişe uygun PC'ler:</div>
                        {matchingPCs.map(pc => {
                          const caseProd = pc.components.case ? PRODUCTS[pc.components.case] : null;
                          return (
                            <div key={pc.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: 'var(--color-cream)', borderRadius: '8px', marginBottom: '4px', border: '1px solid var(--color-border)' }}>
                              <CaseVisual product={caseProd} size="sm" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>Toplama PC #{pc.id.slice(-4)}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)' }}>Maliyet: {fmtMoney(pc.totalCost)} · Liste: {fmtMoney(pc.listPrice)}</div>
                              </div>
                              <button
                                onClick={() => fulfillPCOrderAction && fulfillPCOrderAction(order.id, pc.id)}
                                style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#F59E0B', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
                              >Bu PC'yi Ata</button>
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
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 90px 90px', gap: '8px', padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)' }}>
                <span>Gün</span>
                <span>PC</span>
                <span style={{ textAlign: 'right' }}>Gelir</span>
                <span style={{ textAlign: 'right' }}>Maliyet</span>
                <span style={{ textAlign: 'right' }}>Kâr</span>
              </div>
              {pcSalesHistory.map((sale, i) => {
                const isExpanded = expandedSaleId === (sale.id || i);
                const hasComponents = sale.components && Object.keys(sale.components).length > 0;
                return (
                  <div key={sale.id || i}>
                    <div
                      onClick={() => hasComponents && setExpandedSaleId(isExpanded ? null : (sale.id || i))}
                      style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 90px 90px', gap: '8px', padding: '8px 10px', background: isExpanded ? 'var(--color-accent-soft, #EEF2FF)' : 'var(--color-cream-card)', borderRadius: isExpanded ? '8px 8px 0 0' : '8px', border: `0.5px solid ${isExpanded ? 'var(--color-accent)' : 'var(--color-border)'}`, fontSize: '0.8rem', alignItems: 'center', cursor: hasComponents ? 'pointer' : 'default', transition: 'all 0.15s' }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-mute)' }}>G{sale.day}</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sale.productName}
                        {hasComponents && <span style={{ marginLeft: 4, fontSize: '0.65rem', color: 'var(--color-text-mute)' }}>{isExpanded ? '▲' : '▼'}</span>}
                      </span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#1D9E75', fontWeight: 600 }}>{fmtMoney(sale.revenue)}</span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#E24B4A' }}>{fmtMoney(sale.cogs)}</span>
                      <span style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: sale.profit >= 0 ? '#1D9E75' : '#E24B4A' }}>{fmtMoney(sale.profit)}</span>
                    </div>
                    {isExpanded && hasComponents && (
                      <div style={{ padding: '10px 14px', background: 'var(--color-cream)', border: '0.5px solid var(--color-accent)', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Parça Listesi</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {Object.entries(sale.components).map(([key, productId]) => {
                            if (!productId) return null;
                            const p = PRODUCTS[productId];
                            if (!p) return null;
                            const slotInfo = [...BUILD_SLOTS, ...PERIPHERAL_SLOTS].find(s => s.key === key);
                            return (
                              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px', borderRadius: '6px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)' }}>
                                <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{slotInfo?.emoji || '📦'}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-mute)', fontWeight: 600 }}>{slotInfo?.label || key}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.brand} {p.name}</div>
                                </div>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#E24B4A', fontWeight: 600, flexShrink: 0 }}>{fmtMoney(p.buyPrice)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ padding: '8px 10px', borderTop: '1px solid var(--color-border)', display: 'grid', gridTemplateColumns: '60px 1fr 90px 90px 90px', gap: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
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

      {/* Mobile summary overlay — sağdan kayan panel */}
      {isMobile && (
        <>
          {summaryOpen && (
            <div onClick={() => setSummaryOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99 }} />
          )}
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: summaryOpen ? '260px' : '0', overflow: 'hidden', transition: 'width 0.25s ease', zIndex: 100 }}>
            <div style={{ width: '260px', height: '100%', background: 'var(--color-cream-card)', borderLeft: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Özet</span>
                <button onClick={() => setSummaryOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-mute)', fontSize: '1.2rem', padding: '0 4px', lineHeight: 1 }}>×</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
                {[...BUILD_SLOTS, ...PERIPHERAL_SLOTS].map(slot => {
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
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmtMoney(Object.values(build).filter(Boolean).reduce((s, id) => s + (PRODUCTS[id]?.buyPrice || 0), 0))}</span>
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
                {score && (
                  <div style={{ marginTop: '10px', padding: '8px 10px', borderRadius: '8px', background: score.color + '22', border: `1px solid ${score.color}44`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: score.color, fontWeight: 700 }}>🏆 Performans</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', color: score.color, fontWeight: 800 }}>{score.text}</div>
                      <div style={{ fontSize: '0.68rem', color: score.color, opacity: 0.8 }}>{score.pct}%</div>
                    </div>
                  </div>
                )}
                {issues.length > 0 && (
                  <div style={{ marginTop: '10px', padding: '8px', borderRadius: '6px', background: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>⚠️ Uyumsuzluk</div>
                    {issues.map((iss, i) => <div key={i} style={{ fontSize: '0.7rem', color: '#991B1B', lineHeight: 1.4 }}>{iss}</div>)}
                  </div>
                )}
                {requiredFilled && issues.length === 0 && (
                  <div style={{ marginTop: '10px', padding: '8px', borderRadius: '6px', background: '#D1FAE5', border: '1px solid #6EE7B7' }}>
                    <div style={{ fontSize: '0.75rem', color: '#065F46', fontWeight: 600 }}>✓ Tüm parçalar uyumlu</div>
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)', flexShrink: 0 }}>
                <button onClick={handleBuild} disabled={!canBuild} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: canBuild ? '#1D9E75' : 'var(--color-border)', color: canBuild ? '#fff' : 'var(--color-text-mute)', fontSize: '0.88rem', fontWeight: 700, cursor: canBuild ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>
                  {canBuild ? '🔧 PC Topla →' : requiredFilled ? '⚠️ Uyumsuz' : 'Parçaları Seç'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
