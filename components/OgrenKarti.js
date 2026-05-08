'use client';

import { useEffect, useState } from 'react';
import { dersler } from '../lib/dersler';
import { ilerlemeOku, dogrulukHesapla } from '../lib/ilerleme';

export default function OgrenKarti() {
  const [ilerleme, setIlerleme] = useState(null);

  useEffect(() => {
    setIlerleme(ilerlemeOku());
  }, []);

  const tamamlananlar = ilerleme?.tamamlananDersler || {};
  const devamEden = ilerleme?.devamEdenDers;
  const toplamXP = ilerleme?.toplamXP || 0;
  const dogruluk = dogrulukHesapla(ilerleme?.dogruSayisi || 0, ilerleme?.yanlisSayisi || 0);
  const tamamlananSayi = Object.keys(tamamlananlar).length;
  const seri = ilerleme?.gunlukSeri || 0;
  const hicYok = toplamXP === 0;
  const toplamXPHavuzu = dersler.reduce((s, d) => s + d.xp, 0);

  const ilkBitmeyenDers = dersler.find(d => !tamamlananlar[d.id]);
  const hedefDers = devamEden ? dersler.find(d => d.id === devamEden.dersId) : ilkBitmeyenDers;

  return (
    <section className="max-w-5xl mx-auto px-6 py-6">
      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-cream-card)',
      }}>
        {/* ÜST — Tanıtım */}
        <div style={{
          padding: '20px 24px',
          background: 'var(--color-cream)',
          borderBottom: '0.5px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', background: 'var(--color-accent-soft)', color: 'var(--color-accent-text)', padding: '2px 8px', borderRadius: '999px', fontWeight: 500 }}>YENİ</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>Duolingo tarzı öğrenme</span>
              </div>
              <div className="font-serif" style={{ fontSize: '19px', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.25, marginBottom: '10px' }}>
                Python ile Veri Bilimi<br />Öğrenme Modülü
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {['🐍 Python', '🔢 NumPy', '🐼 Pandas', '📊 Görsel', '🤖 ML'].map(l => (
                  <span key={l} style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '6px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', color: 'var(--color-text-soft)' }}>{l}</span>
                ))}
              </div>
              <a href={hedefDers ? `/ogren/${hedefDers.id}` : '/ogren'} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'var(--color-accent)', color: '#fff',
                padding: '9px 18px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
              }}>
                {hicYok ? 'Derse başla' : devamEden ? 'Devam et' : 'Sonraki ders'} →
              </a>
              <a href="/ogren" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              marginLeft: '10px',
              padding: '9px 16px', borderRadius: '8px',
              border: '0.5px solid var(--color-border)',
              background: 'var(--color-cream-card)',
              color: 'var(--color-text-soft)',
              fontSize: '13px', fontWeight: 500, textDecoration: 'none',
            }}>
              Tüm dersler
            </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
              {[
                { val: dersler.length, label: 'ders', renk: 'var(--color-accent)' },
                { val: toplamXPHavuzu, label: 'XP', renk: '#e8a04a' },
                { val: '🆓', label: 'ücretsiz', renk: 'var(--color-text-soft)' },
              ].map(({ val, label, renk }) => (
                <div key={label} style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '10px 14px', textAlign: 'center', minWidth: '72px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 500, color: renk }}>{val}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ALT — İlerleme */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Bu cihazdaki ilerleme
          </div>

          {hicYok ? (
            <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', padding: '8px 0' }}>
              Henüz başlanmadı — ilk ders seni bekliyor! 🚀
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {[
                  { val: toplamXP, label: 'XP', renk: 'var(--color-accent)' },
                  { val: `%${dogruluk}`, label: 'doğruluk', renk: '#7F77DD' },
                  { val: `${tamamlananSayi}/${dersler.length}`, label: 'ders', renk: '#e8a04a' },
                  { val: seri > 0 ? `🔥 ${seri}` : '—', label: 'seri', renk: '#E24B4A' },
                ].map(({ val, label, renk }) => (
                  <div key={label} style={{ flex: 1, background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: renk }}>{val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '1px' }}>{label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {dersler.slice(0, 5).map((ders, idx) => {
                  const tamam = !!tamamlananlar[ders.id];
                  const devamMi = devamEden?.dersId === ders.id;
                  const dersXP = tamamlananlar[ders.id]?.xp;
                  const progYuzde = tamam ? 100 : devamMi ? Math.round((devamEden.adimIdx / ders.adimlar.length) * 100) : 0;

                  return (
                    <div key={ders.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: idx < 4 ? '0.5px solid var(--color-border)' : 'none', opacity: !tamam && !devamMi && idx > 0 && !tamamlananlar[dersler[idx-1]?.id] ? 0.4 : 1 }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{ders.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ders.baslik}</div>
                        <div style={{ height: '4px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden', marginTop: '4px' }}>
                          <div style={{ height: '100%', width: `${progYuzde}%`, background: tamam ? ders.renk : '#e8a04a', borderRadius: '999px', transition: 'width 0.4s' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 500, color: tamam ? ders.renk : 'var(--color-text-mute)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {tamam ? `+${dersXP} XP ✓` : devamMi ? 'devam ediyor' : `+${ders.xp} XP`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <a href="/ogren" style={{ display: 'block', textAlign: 'center', fontSize: '12px', color: 'var(--color-accent-text)', marginTop: '10px', textDecoration: 'none' }}>
                Tüm dersleri gör ({dersler.length} ders) →
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
