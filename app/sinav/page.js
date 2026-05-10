'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SINAV_SORULARI } from '../../lib/sinav';
import { dersler } from '../../lib/dersler';

export default function SinavSayfasi() {
  const router = useRouter();
  const [basladi, setBasladi] = useState(false);
  const [soruIdx, setSoruIdx] = useState(0);
  const [cevaplar, setCevaplar] = useState({});
  const [secilen, setSecilen] = useState(null);
  const [kontrol, setKontrol] = useState(false);
  const [isim, setIsim] = useState('');
  const [tumTamamlandi, setTumTamamlandi] = useState(false);
  const [tamamlananSayi, setTamamlananSayi] = useState(0);
  const [yuklendi, setYuklendi] = useState(false);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('sz_ilerleme_v1') || '{}');
      const tamamlananlar = data.tamamlananDersler || {};
      const sayi = Object.keys(tamamlananlar).length;
      setTamamlananSayi(sayi);
      setTumTamamlandi(dersler.every(d => tamamlananlar[d.id]));
    } catch (e) {}
    setYuklendi(true);
  }, []);

  const soru = SINAV_SORULARI[soruIdx];
  const toplam = SINAV_SORULARI.length;
  const progressYuzde = Math.round((soruIdx / toplam) * 100);

  const kontrolEt = () => {
    if (secilen === null) return;
    setKontrol(true);
  };

  const devam = () => {
    const yeniCevaplar = { ...cevaplar, [soru.id]: secilen };
    setCevaplar(yeniCevaplar);

    if (soruIdx + 1 >= toplam) {
      const dogru = Object.entries(yeniCevaplar).filter(([id, cevap]) => {
        const s = SINAV_SORULARI.find(s => s.id === parseInt(id));
        return s && cevap === s.dogru;
      }).length;
      const puan = Math.round((dogru / toplam) * 100);
      let xp = 0;
      try { xp = JSON.parse(localStorage.getItem('sz_ilerleme_v1') || '{}').toplamXP || 0; } catch(e) {}
      router.push(`/sinav/sonuc?puan=${puan}&isim=${encodeURIComponent(isim)}&xp=${xp}`);
    } else {
      setSoruIdx(soruIdx + 1);
      setSecilen(null);
      setKontrol(false);
    }
  };

  // Yüklenirken boş göster
  if (!yuklendi) {
    return (
      <main className="min-h-screen">
        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-mute)' }}>
          Yükleniyor...
        </div>
      </main>
    );
  }

  // Kilitli ekran
  if (!tumTamamlandi) {
    return (
      <main className="min-h-screen">
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🔒</div>
          <h1 className="font-serif" style={{ fontSize: '28px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
            Sınava henüz giremezsin
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-soft)', lineHeight: 1.65, marginBottom: '2rem' }}>
            Sertifika sınavına girebilmek için tüm dersleri tamamlaman gerekiyor.<br />
            <strong>{tamamlananSayi}/{dersler.length}</strong> ders tamamlandı.
          </p>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ height: '8px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.round((tamamlananSayi / dersler.length) * 100)}%`, background: '#1D9E75', borderRadius: '999px', transition: 'width .4s' }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '6px' }}>
              %{Math.round((tamamlananSayi / dersler.length) * 100)} tamamlandı
            </div>
          </div>
          <a href="/ogren" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px', border: 'none',
            background: '#1D9E75', color: '#fff', textDecoration: 'none',
            fontSize: '14px', fontWeight: 500,
          }}>← Derslere dön</a>
        </div>
      </main>
    );
  }

  // Sınav başlamadı
  if (!basladi) {
    return (
      <main className="min-h-screen">
        <div className="max-w-xl mx-auto px-6 py-16">
          <a href="/ogren" className="text-xs mb-8 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Öğrenme modülü</a>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🎓</div>
            <h1 className="font-serif" style={{ fontSize: '32px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '12px', letterSpacing: '-0.01em' }}>
              Sertifika Sınavı
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-soft)', lineHeight: 1.65, marginBottom: '2rem' }}>
              10 soruluk sınav. Başarı oranına göre Altın, Gümüş veya Bronz sertifika kazanırsın.
            </p>
          </div>

          <div className="card mb-6" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
              {[
                { val: '10', label: 'soru', renk: '#1D9E75' },
                { val: '🥇', label: 'Altın: %90+', renk: '#BA7517' },
                { val: '🥈', label: 'Gümüş: %70+', renk: '#5F5E5A' },
              ].map(({ val, label, renk }) => (
                <div key={label} style={{ background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 500, color: renk, marginBottom: '4px' }}>{val}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{label}</div>
                </div>
              ))}
            </div>

            <label style={{ fontSize: '13px', color: 'var(--color-text-soft)', display: 'block', marginBottom: '6px' }}>
              Sertifikanda görünecek isim:
            </label>
            <input
              type="text"
              value={isim}
              onChange={e => setIsim(e.target.value)}
              placeholder="Adın Soyadın"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                border: '0.5px solid var(--color-border)',
                background: 'var(--color-cream-card)', color: 'var(--color-text)',
                fontSize: '15px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <button onClick={() => { if (isim.trim()) setBasladi(true); }} disabled={!isim.trim()} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: isim.trim() ? '#1D9E75' : 'var(--color-border)',
            color: '#fff', fontSize: '16px', fontWeight: 500,
            cursor: isim.trim() ? 'pointer' : 'not-allowed',
          }}>
            Sınava başla →
          </button>
        </div>
      </main>
    );
  }

  // Sınav
  return (
    <main className="min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressYuzde}%`, background: '#1D9E75', borderRadius: '999px', transition: 'width .4s' }} />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>
            {soruIdx + 1} / {toplam}
          </div>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '12px' }}>
            {soru.ders} · Soru {soru.id}
          </div>

          <pre style={{
            background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)',
            padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)',
            fontSize: '14px', lineHeight: '1.6', marginBottom: '1.25rem',
            color: 'var(--color-text)', whiteSpace: 'pre-wrap',
          }}>{soru.soru}</pre>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
            {soru.secenekler.map((s, idx) => {
              let border = 'var(--color-border)', bg = 'var(--color-cream-card)', color = 'var(--color-text)';
              if (kontrol) {
                if (idx === soru.dogru) { border = '#1D9E75'; bg = '#E1F5EE'; color = '#0F6E56'; }
                else if (idx === secilen) { border = '#E24B4A'; bg = '#FCEBEB'; color = '#A32D2D'; }
              } else if (idx === secilen) { border = '#1D9E75'; bg = '#E1F5EE'; color = '#0F6E56'; }
              return (
                <button key={idx} onClick={() => { if (!kontrol) setSecilen(idx); }} style={{
                  padding: '12px 16px', borderRadius: '10px', border: `2px solid ${border}`,
                  background: bg, color, cursor: kontrol ? 'default' : 'pointer',
                  fontSize: '14px', textAlign: 'left', transition: 'all .15s', lineHeight: '1.4',
                }}>{s}</button>
              );
            })}
          </div>

          {kontrol && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '1rem',
              background: secilen === soru.dogru ? '#E1F5EE' : '#FCEBEB',
              border: `1.5px solid ${secilen === soru.dogru ? '#1D9E75' : '#E24B4A'}`,
            }}>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px', color: secilen === soru.dogru ? '#0F6E56' : '#A32D2D' }}>
                {secilen === soru.dogru ? '✅ Doğru!' : '❌ Yanlış'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.55 }}>{soru.aciklama}</div>
            </div>
          )}

          {!kontrol ? (
            <button onClick={kontrolEt} disabled={secilen === null} style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: secilen === null ? 'var(--color-border)' : '#1D9E75',
              color: '#fff', fontSize: '15px', fontWeight: 500,
              cursor: secilen === null ? 'not-allowed' : 'pointer',
            }}>Kontrol et</button>
          ) : (
            <button onClick={devam} style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: '#1D9E75', color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
            }}>
              {soruIdx + 1 >= toplam ? '🎓 Sertifikamı gör →' : 'Devam et →'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
