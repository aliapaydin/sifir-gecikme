'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useRef, useEffect, useState } from 'react';
import { derece } from '../../../lib/sinav';

function SertifikaIcerik() {
  const params = useSearchParams();
  const puan = parseInt(params.get('puan') || '0');
  const isim = decodeURIComponent(params.get('isim') || 'Kursiyerimiz');
  const xp = parseInt(params.get('xp') || '0');
  const sertifikaRef = useRef(null);
  const [indiriliyor, setIndiriliyor] = useState(false);

  const d = derece(puan);
  const tarih = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const sertifikaNo = `SG-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
  const gecti = puan >= 50;

  const indir = async () => {
    setIndiriliyor(true);
    try {
      const html2canvas = (await import('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js')).default;
      const canvas = await html2canvas(sertifikaRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `sifir-gecikme-sertifika-${isim.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      window.print();
    }
    setIndiriliyor(false);
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '56px', marginBottom: '8px' }}>
            {gecti ? d.emoji : '📋'}
          </div>
          <h1 className="font-serif" style={{ fontSize: '28px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>
            {gecti ? 'Tebrikler!' : 'Sınav tamamlandı'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-text-soft)' }}>
            {gecti
              ? `${d.emoji} ${d.ad} sertifika kazandın!`
              : 'Dersleri tekrar edip tekrar deneyebilirsin.'}
          </p>
        </div>

        {/* Sertifika */}
        <div ref={sertifikaRef} style={{
          background: '#ffffff',
          border: '1px solid #e8e0d6',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '1.5rem',
          position: 'relative',
          textAlign: 'center',
          fontFamily: 'Georgia, serif',
        }}>
          {/* Üst dekor çizgisi */}
          <div style={{ height: '4px', background: `linear-gradient(90deg, ${d.renk}, #1D9E75, ${d.renk})`, borderRadius: '2px', marginBottom: '32px' }} />

          {/* Site adı */}
          <div style={{ fontSize: '11px', letterSpacing: '.1em', color: '#8a7e6d', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>
            Sıfır Gecikme · sifirgecikme.com
          </div>

          {/* Derece rozeti */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: d.bg, color: d.renk,
            fontSize: '13px', fontWeight: 600, padding: '5px 14px',
            borderRadius: '999px', marginBottom: '24px',
            fontFamily: 'system-ui, sans-serif',
          }}>
            {d.emoji} {d.ad} Sertifika
          </div>

          {/* Başlık */}
          <div style={{ fontSize: '30px', fontWeight: 700, color: '#1a1815', marginBottom: '6px', letterSpacing: '-0.01em' }}>
            Tamamlama Sertifikası
          </div>
          <div style={{ fontSize: '14px', color: '#8a7e6d', marginBottom: '28px', fontFamily: 'system-ui, sans-serif' }}>
            Python ile Veri Bilimi Programı
          </div>

          {/* Kişi adı */}
          <div style={{ fontSize: '13px', color: '#8a7e6d', marginBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>Bu belge</div>
          <div style={{
            fontSize: '28px', fontWeight: 700, color: '#1a1815',
            borderBottom: '2px solid #1D9E75', display: 'inline-block',
            paddingBottom: '8px', marginBottom: '8px',
          }}>
            {isim}
          </div>
          <div style={{ fontSize: '13px', color: '#8a7e6d', marginBottom: '28px', fontFamily: 'system-ui, sans-serif' }}>
            adlı kişinin tüm dersleri ve sertifika sınavını başarıyla tamamladığını onaylar.
          </div>

          {/* İstatistikler */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
            {[
              { val: `%${puan}`, label: 'Sınav başarısı', renk: d.renk },
              { val: '10/10', label: 'Tamamlanan ders', renk: '#1D9E75' },
              { val: `${xp} XP`, label: 'Toplam puan', renk: '#7F77DD' },
            ].map(({ val, label, renk }) => (
              <div key={label} style={{ background: '#faf8f3', borderRadius: '10px', padding: '14px 10px', border: '0.5px solid #e8e0d6' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: renk, marginBottom: '4px', fontFamily: 'system-ui, sans-serif' }}>{val}</div>
                <div style={{ fontSize: '11px', color: '#8a7e6d', fontFamily: 'system-ui, sans-serif' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Alt çizgi */}
          <div style={{ height: '0.5px', background: '#e8e0d6', marginBottom: '20px' }} />

          {/* Footer */}
          <div style={{ fontSize: '11px', color: '#8a7e6d', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ marginBottom: '4px' }}>Ali Apaydın · Veri Bilimi Mühendisi · Concentrix</div>
            <div>Sertifika No: {sertifikaNo} · {tarih}</div>
          </div>

          {/* Alt dekor */}
          <div style={{ height: '4px', background: `linear-gradient(90deg, ${d.renk}, #1D9E75, ${d.renk})`, borderRadius: '2px', marginTop: '24px' }} />
        </div>

        {/* Butonlar */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button onClick={indir} disabled={indiriliyor} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px', border: 'none',
            background: '#1D9E75', color: '#fff', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer',
          }}>
            {indiriliyor ? '⏳ Hazırlanıyor...' : '⬇ Sertifikayı indir (PNG)'}
          </button>
          <a href="/ogren" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px',
            border: '0.5px solid var(--color-border)',
            background: 'var(--color-cream-card)', color: 'var(--color-text)',
            fontSize: '14px', fontWeight: 500, textDecoration: 'none',
          }}>
            ← Öğrenme modülüne dön
          </a>
          {!gecti && (
            <a href="/sinav" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '10px', border: 'none',
              background: '#7F77DD', color: '#fff', fontSize: '14px', fontWeight: 500,
              textDecoration: 'none',
            }}>
              🔄 Tekrar dene
            </a>
          )}
        </div>

        {/* Puan özeti */}
        <div className="card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div className="font-serif" style={{ fontSize: '17px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>
            {puan >= 90 ? '🌟 Mükemmel! Altın sertifika hak ettiniz!' :
             puan >= 70 ? '💪 Harika! Gümüş sertifika kazandınız!' :
             puan >= 50 ? '✅ Başardınız! Bronz sertifika kazandınız.' :
             '📚 Henüz geçemediniz. Dersleri tekrar edin!'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
            {puan < 90 && gecti && 'Altın sertifika için %90 ve üzeri puan gerekiyor.'}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SinavSonuc() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Yükleniyor...</div>}>
      <SertifikaIcerik />
    </Suspense>
  );
}
