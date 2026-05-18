'use client';

import { useState } from 'react';

const COHORT_DATA = [
  { cohort: 'Oca 2024', size: 412, retention: [100, 42, 31, 26, 22, 20, 18] },
  { cohort: 'Şub 2024', size: 389, retention: [100, 38, 28, 23, 19, 17, null] },
  { cohort: 'Mar 2024', size: 451, retention: [100, 45, 34, 28, 24, null, null] },
  { cohort: 'Nis 2024', size: 367, retention: [100, 40, 29, 24, null, null, null] },
  { cohort: 'May 2024', size: 502, retention: [100, 48, 35, null, null, null, null] },
  { cohort: 'Haz 2024', size: 478, retention: [100, 44, null, null, null, null, null] },
  { cohort: 'Tem 2024', size: 523, retention: [100, null, null, null, null, null, null] },
];

const PERIODS = ['Ay 0', 'Ay 1', 'Ay 2', 'Ay 3', 'Ay 4', 'Ay 5', 'Ay 6'];

function renkHesapla(oran) {
  if (oran === null) return { bg: 'transparent', text: 'var(--color-text-faint)' };
  if (oran === 100) return { bg: '#1D9E75',               text: '#fff' };
  if (oran >= 40)   return { bg: '#5DCAA5',               text: '#fff' };
  if (oran >= 30)   return { bg: 'rgba(93,202,165,0.35)', text: 'var(--color-text-soft)' };
  if (oran >= 20)   return { bg: 'rgba(93,202,165,0.18)', text: 'var(--color-text-soft)' };
  return              { bg: 'rgba(93,202,165,0.08)',       text: 'var(--color-text-mute)' };
}

export default function CohortMatrix() {
  const [hover, setHover] = useState(null);

  return (
    <div style={{ overflowX: 'auto', margin: '2rem 0' }}>
      <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '10px' }}>
        Cohort retention matrisi — örnek veri
      </p>
      <table style={{ borderCollapse: 'collapse', fontSize: '13px', width: '100%', minWidth: '540px' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-text-mute)', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
              Cohort
            </th>
            <th style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--color-text-mute)', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
              Boyut
            </th>
            {PERIODS.map(p => (
              <th key={p} style={{ padding: '8px 10px', textAlign: 'center', color: 'var(--color-text-mute)', fontWeight: 600, fontSize: '11px', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COHORT_DATA.map((row, ri) => (
            <tr key={row.cohort}>
              <td style={{ padding: '6px 12px', fontWeight: 600, color: 'var(--color-text)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                {row.cohort}
              </td>
              <td style={{ padding: '6px 10px', textAlign: 'center', color: 'var(--color-text-soft)', fontSize: '12px' }}>
                {row.size.toLocaleString('tr-TR')}
              </td>
              {row.retention.map((val, ci) => {
                const { bg, text } = renkHesapla(val);
                const isHover = hover?.ri === ri && hover?.ci === ci;
                return (
                  <td
                    key={ci}
                    onMouseEnter={() => setHover({ ri, ci })}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      padding: '6px 10px', textAlign: 'center',
                      background: bg,
                      color: val === null ? 'var(--color-border)' : text,
                      fontWeight: val !== null ? 700 : 400,
                      fontSize: '12px',
                      borderRadius: '4px',
                      outline: isHover && val !== null ? '2px solid var(--color-accent)' : 'none',
                      transition: 'outline 0.1s',
                      minWidth: '52px',
                    }}
                  >
                    {val !== null ? `%${val}` : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Retention oranı:</span>
        {[
          { label: '100%', bg: '#1D9E75', text: '#fff' },
          { label: '%40+', bg: '#5DCAA5', text: '#fff' },
          { label: '%30–40', bg: '#86EFAC', text: '#166534' },
          { label: '%20–30', bg: '#BBF7D0', text: '#166534' },
          { label: '%10–20', bg: '#DCFCE7', text: '#166534' },
        ].map(b => (
          <span key={b.label} style={{ padding: '2px 8px', borderRadius: '4px', background: b.bg, color: b.text, fontSize: '11px', fontWeight: 600 }}>
            {b.label}
          </span>
        ))}
        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginLeft: '4px' }}>— = henüz veri yok</span>
      </div>
    </div>
  );
}
