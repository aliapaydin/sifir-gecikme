'use client';

import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/tech-center-data';

function fmtMoney(n) {
  if (Math.abs(n) >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `₺${Math.round(n / 1000)}K`;
  return '₺' + Math.round(n).toLocaleString('tr-TR');
}

function fmtShort(n) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `${Math.round(n / 1000)}K`;
  return `${Math.round(n)}`;
}

function niceStep(raw) {
  if (!raw || raw <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  if (norm <= 1) return mag;
  if (norm <= 2) return 2 * mag;
  if (norm <= 5) return 5 * mag;
  return 10 * mag;
}

const VW = 500;
const PAD_L = 52;
const PAD_R = 12;
const PAD_TOP = 10;
const PAD_BOT = 26;

function yTicks(min, max) {
  const step = niceStep((max - min) / 4);
  const ticks = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 0.01; v += step) {
    ticks.push(Math.round(v));
  }
  return ticks;
}

function xLabels(data, chartH) {
  const step = Math.ceil(data.length / 7);
  return data
    .map((d, i) => ({ i, d, show: i % step === 0 }))
    .filter(x => x.show)
    .map(({ i, d }) => {
      const x = PAD_L + (i / Math.max(data.length - 1, 1)) * (VW - PAD_L - PAD_R);
      return { x, label: `G${d.day}` };
    });
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data, height = 160, color = 'var(--color-accent)' }) {
  if (!data || data.length === 0) return (
    <EmptyChart height={height} />
  );
  const chartH = height - PAD_TOP - PAD_BOT;
  const chartW = VW - PAD_L - PAD_R;
  const max = Math.max(...data.map(d => d.value), 1);
  const ticks = yTicks(0, max);
  const barGap = chartW / data.length;
  const barW = Math.max(4, barGap * 0.6);
  const step = Math.ceil(data.length / 7);

  return (
    <svg viewBox={`0 0 ${VW} ${height}`} style={{ width: '100%', display: 'block' }}>
      {ticks.map(v => {
        const y = PAD_TOP + chartH - (v / max) * chartH;
        return (
          <g key={v}>
            <line x1={PAD_L} y1={y} x2={VW - PAD_R} y2={y}
              stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize="10"
              fill="var(--color-text-mute)">{fmtShort(v)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const bH = Math.max(2, (d.value / max) * chartH);
        const x = PAD_L + i * barGap + (barGap - barW) / 2;
        const y = PAD_TOP + chartH - bH;
        const isLast = i === data.length - 1;
        const showLabel = i % step === 0;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bH} rx="2"
              fill={isLast ? color : color + 'aa'} />
            {showLabel && (
              <text x={x + barW / 2} y={PAD_TOP + chartH + PAD_BOT - 4}
                textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">
                G{d.day}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Dual Bar Chart (gelir vs gider) ─────────────────────────────────────────
function DualBarChart({ data, height = 160 }) {
  if (!data || data.length === 0) return <EmptyChart height={height} />;
  const chartH = height - PAD_TOP - PAD_BOT;
  const chartW = VW - PAD_L - PAD_R;
  const max = Math.max(...data.flatMap(d => [d.gelir, d.gider]), 1);
  const ticks = yTicks(0, max);
  const groupW = chartW / data.length;
  const barW = Math.max(4, groupW * 0.32);
  const step = Math.ceil(data.length / 7);

  return (
    <svg viewBox={`0 0 ${VW} ${height}`} style={{ width: '100%', display: 'block' }}>
      {ticks.map(v => {
        const y = PAD_TOP + chartH - (v / max) * chartH;
        return (
          <g key={v}>
            <line x1={PAD_L} y1={y} x2={VW - PAD_R} y2={y}
              stroke="var(--color-border)" strokeWidth="0.5" />
            <text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize="10"
              fill="var(--color-text-mute)">{fmtShort(v)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const gH = Math.max(2, (d.gelir / max) * chartH);
        const eH = Math.max(2, (d.gider / max) * chartH);
        const gx = PAD_L + i * groupW + groupW * 0.1;
        const ex = gx + barW + 2;
        const showLabel = i % step === 0;
        return (
          <g key={i}>
            <rect x={gx} y={PAD_TOP + chartH - gH} width={barW} height={gH} rx="2"
              fill="#1D9E75bb" />
            <rect x={ex} y={PAD_TOP + chartH - eH} width={barW} height={eH} rx="2"
              fill="#E24B4Abb" />
            {showLabel && (
              <text x={gx + barW} y={PAD_TOP + chartH + PAD_BOT - 4}
                textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">
                G{d.day}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
function LineChart({ data, height = 160 }) {
  if (!data || data.length < 2) return <EmptyChart height={height} />;
  const chartH = height - PAD_TOP - PAD_BOT;
  const chartW = VW - PAD_L - PAD_R;
  const values = data.map(d => d.value);
  const rawMax = Math.max(...values, 1);
  const rawMin = Math.min(...values, 0);
  const ticks = yTicks(rawMin, rawMax);
  const tMin = ticks[0];
  const tMax = ticks[ticks.length - 1];
  const range = tMax - tMin || 1;

  const pts = data.map((d, i) => {
    const x = PAD_L + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = PAD_TOP + chartH - ((d.value - tMin) / range) * chartH;
    return [x, y];
  });

  const step = Math.ceil(data.length / 7);

  return (
    <svg viewBox={`0 0 ${VW} ${height}`} style={{ width: '100%', display: 'block' }}>
      {ticks.map(v => {
        const y = PAD_TOP + chartH - ((v - tMin) / range) * chartH;
        return (
          <g key={v}>
            <line x1={PAD_L} y1={y} x2={VW - PAD_R} y2={y}
              stroke={v === 0 ? '#E24B4A44' : 'var(--color-border)'}
              strokeWidth={v === 0 ? '1' : '0.5'}
              strokeDasharray={v === 0 ? '4,3' : undefined}
            />
            <text x={PAD_L - 4} y={y + 3.5} textAnchor="end" fontSize="10"
              fill={v < 0 ? '#E24B4A' : 'var(--color-text-mute)'}>{fmtShort(v)}</text>
          </g>
        );
      })}
      <polyline
        points={pts.map(p => p.join(',')).join(' ')}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const [x, y] = pts[i];
        const showLabel = i % step === 0;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="2.5" fill={d.value < 0 ? '#E24B4A' : 'var(--color-accent)'} />
            {showLabel && (
              <text x={x} y={PAD_TOP + chartH + PAD_BOT - 4}
                textAnchor="middle" fontSize="10" fill="var(--color-text-mute)">
                G{d.day}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Doughnut ─────────────────────────────────────────────────────────────────
function DoughnutChart({ segments, size = 120 }) {
  if (!segments || segments.length === 0) return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-mute)', fontSize: '0.75rem' }}>
      Veri yok
    </div>
  );
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;
  const cx = size / 2, cy = size / 2, r = size * 0.38, innerR = size * 0.22;
  let angleStart = -Math.PI / 2;
  const paths = segments.map(seg => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angleStart), y1 = cy + r * Math.sin(angleStart);
    const x2 = cx + r * Math.cos(angleStart + angle), y2 = cy + r * Math.sin(angleStart + angle);
    const xi1 = cx + innerR * Math.cos(angleStart), yi1 = cy + innerR * Math.sin(angleStart);
    const xi2 = cx + innerR * Math.cos(angleStart + angle), yi2 = cy + innerR * Math.sin(angleStart + angle);
    const large = angle > Math.PI ? 1 : 0;
    const d = [`M ${x1} ${y1}`, `A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, `L ${xi2} ${yi2}`, `A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1}`, 'Z'].join(' ');
    const result = { ...seg, d };
    angleStart += angle;
    return result;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} stroke="var(--color-cream-card)" strokeWidth="1" />
      ))}
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="7" fill="var(--color-text-mute)">Toplam</text>
      <text x={cx} y={cy + 7} textAnchor="middle" fontSize="6" fill="var(--color-text)" fontWeight="bold">{total}</text>
    </svg>
  );
}

function EmptyChart({ height }) {
  return (
    <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-mute)', fontSize: '0.8rem' }}>
      Veri yok
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={{
      background: 'var(--color-cream-card)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
    }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-mute)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

export default function AnalizTab({ state }) {
  if (!state) return null;

  const { salesHistory = [], allTimeSales = [] } = state;

  const last14Revenue = salesHistory.slice(-14).map(h => ({ day: h.day, value: h.revenue || 0 }));
  const last14Profit  = salesHistory.slice(-14).map(h => ({ day: h.day, value: h.profit || 0 }));
  const last14Dual    = salesHistory.slice(-14).map(h => ({
    day: h.day,
    gelir: h.revenue || 0,
    gider: Math.max(0, (h.revenue || 0) - (h.profit || 0)),
  }));

  // Kategori bazlı
  const catSales = {};
  for (const s of allTimeSales) {
    catSales[s.category] = (catSales[s.category] || 0) + s.quantity;
  }
  const catSegments = Object.entries(catSales)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, qty]) => ({ cat, value: qty, color: CATEGORY_COLORS[cat] || '#888', label: CATEGORY_LABELS[cat] || cat }));

  // Top ürünler
  const productSales = {}, productRevenue = {}, productCOGS = {};
  for (const s of allTimeSales) {
    productSales[s.productId]   = (productSales[s.productId] || 0) + s.quantity;
    productRevenue[s.productId] = (productRevenue[s.productId] || 0) + s.revenue;
    productCOGS[s.productId]    = (productCOGS[s.productId] || 0) + s.cogs;
  }

  const top5Sales = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id, qty]) => {
      const s = allTimeSales.find(x => x.productId === id);
      return { id, name: s?.productName || id, qty, brand: s?.brand || '' };
    });

  const top5Profit = Object.entries(productRevenue)
    .map(([id, rev]) => {
      const cogs = productCOGS[id] || 0;
      const margin = cogs > 0 ? ((rev - cogs) / cogs * 100).toFixed(0) : '0';
      const s = allTimeSales.find(x => x.productId === id);
      return { id, name: s?.productName || id, brand: s?.brand || '', rev, cogs, margin: parseFloat(margin) };
    })
    .sort((a, b) => b.margin - a.margin).slice(0, 5);

  // Özet
  const totalRevenue = allTimeSales.reduce((s, t) => s + t.revenue, 0);
  const totalCOGS    = allTimeSales.reduce((s, t) => s + t.cogs, 0);
  const totalProfit  = allTimeSales.reduce((s, t) => s + t.profit, 0);
  const totalSales   = allTimeSales.reduce((s, t) => s + t.quantity, 0);
  const totalSpent   = salesHistory.reduce((s, h) => s + Math.max(0, (h.revenue || 0) - (h.profit || 0)), 0);
  const avgDailyProfit = salesHistory.length > 0
    ? salesHistory.reduce((s, h) => s + h.profit, 0) / salesHistory.length : 0;

  const statCards = [
    { label: 'Toplam Kazanç',    value: fmtMoney(totalRevenue),             color: '#1D9E75' },
    { label: 'Toplam Harcama',   value: fmtMoney(totalSpent),               color: '#E24B4A' },
    { label: 'Toplam Kâr',       value: fmtMoney(totalProfit),              color: totalProfit >= 0 ? '#1D9E75' : '#E24B4A' },
    { label: 'Toplam Satış',     value: `${totalSales.toLocaleString('tr-TR')} adet`, color: 'var(--color-text)' },
    { label: 'Ort. Günlük Kâr',  value: fmtMoney(avgDailyProfit),           color: avgDailyProfit >= 0 ? '#1D9E75' : '#E24B4A' },
  ];

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Özet kartlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {statCards.map(c => (
          <div key={c.label} style={{
            background: 'var(--color-cream-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '0.875rem 1rem',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', marginBottom: '4px' }}>{c.label}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: c.color, fontFamily: 'var(--font-mono)' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Günlük Gelir */}
      <ChartCard title="📊 Günlük Gelir (son 14 gün)">
        <BarChart data={last14Revenue} height={150} />
      </ChartCard>

      {/* Kazanç vs Harcama */}
      <ChartCard title="💹 Kazanç vs Harcama (son 14 gün)">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#1D9E75', display: 'inline-block' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>Kazanç</span>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#E24B4A', display: 'inline-block', marginLeft: '8px' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-mute)' }}>Harcama</span>
        </div>
        <DualBarChart data={last14Dual} height={150} />
      </ChartCard>

      {/* Günlük Kâr */}
      <ChartCard title="📈 Günlük Kâr (son 14 gün)">
        <LineChart data={last14Profit} height={150} />
      </ChartCard>

      {/* Kategori + En çok satan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <ChartCard title="🥧 Kategori Dağılımı">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <DoughnutChart segments={catSegments} size={110} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              {catSegments.slice(0, 6).map(seg => (
                <div key={seg.cat} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: seg.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: 'var(--color-text-mute)' }}>{seg.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 600 }}>{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="🏆 En Çok Satan Ürünler">
          {top5Sales.length === 0 ? (
            <div style={{ color: 'var(--color-text-mute)', fontSize: '0.8rem' }}>Henüz satış yok.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {top5Sales.map((item, i) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', width: '16px', textAlign: 'center', fontWeight: 600 }}>{i + 1}.</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: 500, lineHeight: 1.2 }}>{item.brand} {item.name}</div>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 700 }}>{item.qty} adet</span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* En kârlı ürünler */}
      <ChartCard title="💰 En Kârlı Ürünler (Marj %)">
        {top5Profit.length === 0 ? (
          <div style={{ color: 'var(--color-text-mute)', fontSize: '0.8rem' }}>Henüz satış yok.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {top5Profit.map((item, i) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                background: 'var(--color-cream)', borderRadius: '8px', border: '0.5px solid var(--color-border)',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-mute)', width: '16px', textAlign: 'center', fontWeight: 600 }}>{i + 1}.</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }}>{item.brand} {item.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-mute)', fontFamily: 'var(--font-mono)' }}>
                    Gelir: {fmtMoney(item.rev)} / COGS: {fmtMoney(item.cogs)}
                  </div>
                </div>
                <div style={{
                  padding: '3px 10px', borderRadius: '999px',
                  background: item.margin > 0 ? 'var(--color-correct-bg)' : 'var(--color-amber-bg)',
                  color: item.margin > 0 ? 'var(--color-correct-text)' : 'var(--color-amber-text)',
                  fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                }}>
                  %{item.margin}
                </div>
              </div>
            ))}
          </div>
        )}
      </ChartCard>
    </div>
  );
}
