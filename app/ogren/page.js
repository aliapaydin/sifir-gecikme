'use client';

import { useState, useEffect } from 'react';
import { dersler } from '../../lib/dersler';
import { ilerlemeOku, ilerlemeifirla, dogrulukHesapla } from '../../lib/ilerleme';

function IlerlemeKarti({ ilerleme, onSifirla }) {
  const tamamlanan = Object.keys(ilerleme.tamamlananDersler || {}).length;
  const toplamSoru = (ilerleme.dogruSayisi || 0) + (ilerleme.yanlisSayisi || 0);
  const dogruluk = dogrulukHesapla(ilerleme.dogruSayisi || 0, ilerleme.yanlisSayisi || 0);
  const toplamXP = ilerleme.toplamXP || 0;
  const seri = ilerleme.gunlukSeri || 0;

  return (
    <div className="card mb-6" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div className="font-serif font-medium" style={{ fontSize: '17px', color: 'var(--color-text)', marginBottom: '2px' }}>
            📊 İlerleme Panosu
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>
            Bu cihaza özel · çıkıp girsende hatırlanır
          </div>
        </div>
        {toplamXP > 0 && (
          <button onClick={onSifirla} style={{
            fontSize: '12px', padding: '5px 12px', borderRadius: '8px',
            border: '0.5px solid #E24B4A', background: 'transparent',
            color: '#E24B4A', cursor: 'pointer',
          }}>🗑 Sıfırla</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: toplamXP > 0 ? '16px' : '0' }}>
        {[
          { val: toplamXP, label: 'Toplam XP', renk: '#1D9E75' },
          { val: toplamSoru > 0 ? `%${dogruluk}` : '—', label: 'Doğruluk', renk: '#7F77DD' },
          { val: tamamlanan, label: 'Tamamlanan', renk: '#e8a04a' },
          { val: seri > 0 ? `🔥 ${seri}` : '—', label: 'Günlük Seri', renk: '#E24B4A' },
        ].map(({ val, label, renk }) => (
          <div key={label} style={{ background: 'var(--color-cream)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '0.5px solid var(--color-border)' }}>
            <div style={{ fontSize: '22px', fontWeight: 500, color: renk, marginBottom: '3px' }}>{val}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{label}</div>
          </div>
        ))}
      </div>

      {toplamXP === 0 && (
        <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '13px', color: 'var(--color-text-mute)' }}>
          Henüz ders tamamlanmadı. İlk dersten başla! 👇
        </div>
      )}
    </div>
  );
}

export default function OgrenSayfasi() {
  const [ilerleme, setIlerleme] = useState(null);
  const [sifirOnay, setSifirOnay] = useState(false);

  useEffect(() => {
    setIlerleme(ilerlemeOku());
  }, []);

  const sifirla = () => {
    if (!sifirOnay) { setSifirOnay(true); return; }
    setIlerleme(ilerlemeifirla());
    setSifirOnay(false);
  };

  const tamamlananlar = ilerleme?.tamamlananDersler || {};
  const devamEden = ilerleme?.devamEdenDers;

  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <h1 className="font-serif text-4xl font-medium mb-2" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Python ile Veri Bilimi
        </h1>
        <p className="text-lg mb-8" style={{ color: 'var(--color-text-soft)' }}>
          Her ders önce öğretir, sonra sınar. Adım adım, Türkçe.
        </p>

        {ilerleme && (
          <IlerlemeKarti
            ilerleme={ilerleme}
            onSifirla={sifirla}
          />
        )}

        {sifirOnay && (
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: '#FCEBEB', border: '1.5px solid #E24B4A', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#A32D2D' }}>Tüm ilerleme silinecek. Emin misin?</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setSifirOnay(false)} style={{ fontSize: '13px', padding: '5px 12px', borderRadius: '6px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', cursor: 'pointer', color: 'var(--color-text)' }}>İptal</button>
              <button onClick={sifirla} style={{ fontSize: '13px', padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#E24B4A', color: '#fff', cursor: 'pointer' }}>Evet, sıfırla</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dersler.map((ders, idx) => {
            const tamamlandi = !!tamamlananlar[ders.id];
            const devamMi = devamEden?.dersId === ders.id;
            const dersVerisi = tamamlananlar[ders.id];
            const kilitli = !tamamlandi && idx > 0 && !tamamlananlar[dersler[idx - 1]?.id] && !devamMi;

            return (
              <a key={ders.id} href={kilitli ? '#' : `/ogren/${ders.id}`}
                onClick={e => kilitli && e.preventDefault()}
                style={{ textDecoration: 'none', color: 'inherit', opacity: kilitli ? 0.45 : 1, cursor: kilitli ? 'not-allowed' : 'pointer' }}>
                <div className="card" style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  borderLeft: `4px solid ${tamamlandi ? ders.renk : kilitli ? 'var(--color-border)' : ders.renk}`,
                  padding: '16px 20px',
                  background: devamMi ? ders.bg : 'var(--color-cream-card)',
                }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: kilitli ? 'var(--color-cream)' : ders.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
                    {kilitli ? '🔒' : ders.emoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Ders {idx + 1}</span>
                      {tamamlandi && (
                        <span style={{ fontSize: '11px', background: '#E1F5EE', color: '#0F6E56', padding: '1px 8px', borderRadius: '999px', fontWeight: 500 }}>
                          ✓ Tamamlandı · %{dersVerisi.dogruluk} doğruluk
                        </span>
                      )}
                      {devamMi && !tamamlandi && (
                        <span style={{ fontSize: '11px', background: ders.bg, color: ders.renk, padding: '1px 8px', borderRadius: '999px', fontWeight: 500 }}>
                          ▶ Devam ediyor
                        </span>
                      )}
                    </div>
                    <div className="font-serif font-medium" style={{ fontSize: '17px', color: 'var(--color-text)', marginBottom: '6px' }}>
                      {ders.baslik}
                    </div>
                    <div style={{ height: '5px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: tamamlandi ? '100%' : devamMi ? `${Math.round((devamEden.adimIdx / ders.adimlar.length) * 100)}%` : '0%', background: ders.renk, borderRadius: '999px', transition: 'width 0.4s' }} />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: 500, color: tamamlandi ? ders.renk : 'var(--color-text-mute)' }}>
                      {tamamlandi ? `+${dersVerisi.xp}` : `+${ders.xp}`} XP
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginTop: '2px' }}>
                      {ders.adimlar.filter(a => a.tip !== 'ogret').length} soru
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <a href="/sinav" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          padding: '16px', borderRadius: '12px', border: 'none',
          background: 'linear-gradient(135deg, #1D9E75, #0d3d2e)',
          color: '#fff', textDecoration: 'none', fontSize: '16px', fontWeight: 500,
          marginTop: '16px',
        }}>
          🎓 Sertifika sınavına gir →
        </a>

        <div className="card mt-8 text-center" style={{ padding: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
          <div className="font-serif font-medium mb-2" style={{ fontSize: '18px', color: 'var(--color-text)' }}>
            Toplam {dersler.reduce((s, d) => s + d.xp, 0)} XP kazanabilirsin
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-mute)' }}>
            %100 doğrulukla tamamlarsan bonus XP! 🌟
          </div>
        </div>
      </section>
    </main>
  );
}
