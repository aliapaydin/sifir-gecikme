'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useRef, useEffect, useState } from 'react';
import { derece } from '../../../lib/sinav';

function SertifikaIcerik() {
  const params = useSearchParams();
  const puan = parseInt(params.get('puan') || '0');
  const isim = decodeURIComponent(params.get('isim') || 'Kursiyerimiz');
  const xp = parseInt(params.get('xp') || '0');
  const canvasRef = useRef(null);
  const [indiriliyor, setIndiriliyor] = useState(false);
  const [sertifikaNo, setSertifikaNo] = useState('');
  const [tarih, setTarih] = useState('');
  const unvan = decodeURIComponent(params.get('unvan') || '');
  const sirket = decodeURIComponent(params.get('sirket') || '');

  const d = derece(puan);
  const gecti = puan >= 50;

  // Hydration fix: random ve tarih client'ta üret
  useEffect(() => {
    setSertifikaNo(`SG-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`);
    setTarih(new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  // Canvas sertifika çiz
  useEffect(() => {
    if (!sertifikaNo || !tarih) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 900, H = 636;
    canvas.width = W;
    canvas.height = H;

    // Arka plan
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Üst gradient şerit
    const grad1 = ctx.createLinearGradient(0, 0, W, 0);
    grad1.addColorStop(0, d.renk);
    grad1.addColorStop(0.5, '#1D9E75');
    grad1.addColorStop(1, d.renk);
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W, 6);

    // Alt gradient şerit
    ctx.fillStyle = grad1;
    ctx.fillRect(0, H - 6, W, 6);

    // Sol dikey şerit
    const grad2 = ctx.createLinearGradient(0, 0, 0, H);
    grad2.addColorStop(0, d.renk);
    grad2.addColorStop(0.5, '#1D9E75');
    grad2.addColorStop(1, d.renk);
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, 5, H);
    ctx.fillRect(W - 5, 0, 5, H);

    // Dekoratif köşe daireler
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = d.renk;
    ctx.beginPath();
    ctx.arc(60, 60, 120, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(W - 60, H - 60, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Site adı
    ctx.fillStyle = '#a89c87';
    ctx.font = '500 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('SIFIR GECİKME  ·  sifirgecikme.com', W / 2, 55);

    // Derece rozeti
    ctx.fillStyle = d.bg;
    roundRect(ctx, W / 2 - 90, 70, 180, 34, 17);
    ctx.fill();
    ctx.fillStyle = d.renk;
    ctx.font = '600 14px system-ui, sans-serif';
    ctx.letterSpacing = '0px';
    ctx.fillText(`${d.emoji}  ${d.ad} Sertifika`, W / 2, 92);

    // Başlık
    ctx.fillStyle = '#1a1815';
    ctx.font = '700 42px Georgia, serif';
    ctx.fillText('Tamamlama Sertifikası', W / 2, 165);

    // Alt başlık
    ctx.fillStyle = '#8a7e6d';
    ctx.font = '400 16px system-ui, sans-serif';
    ctx.fillText('Python ile Veri Bilimi Programı', W / 2, 195);

    // "Bu belge" metni
    ctx.fillStyle = '#a89c87';
    ctx.font = '400 14px system-ui, sans-serif';
    ctx.fillText('Bu belge', W / 2, 240);

    // İsim
    ctx.fillStyle = '#1a1815';
    ctx.font = '700 38px Georgia, serif';
    ctx.fillText(isim, W / 2, 290);

    // İsim altı çizgi
    const nameWidth = ctx.measureText(isim).width;
    ctx.strokeStyle = '#1D9E75';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nameWidth / 2 - 10, 302);
    ctx.lineTo(W / 2 + nameWidth / 2 + 10, 302);
    ctx.stroke();

    // Açıklama
    ctx.fillStyle = '#8a7e6d';
    ctx.font = '400 14px system-ui, sans-serif';
    ctx.fillText('adlı kişinin tüm dersleri ve sertifika sınavını başarıyla tamamladığını onaylar.', W / 2, 328);

    // İstatistik kartları
    const stats = [
      { val: `%${puan}`, label: 'Sınav başarısı', renk: d.renk },
      { val: '10/10', label: 'Tamamlanan ders', renk: '#1D9E75' },
      { val: `${xp} XP`, label: 'Toplam puan', renk: '#7F77DD' },
    ];
    const cardW = 160, cardH = 70, cardGap = 20;
    const totalW = stats.length * cardW + (stats.length - 1) * cardGap;
    const startX = (W - totalW) / 2;

    stats.forEach((s, i) => {
      const x = startX + i * (cardW + cardGap);
      const y = 355;
      ctx.fillStyle = '#faf8f3';
      roundRect(ctx, x, y, cardW, cardH, 10);
      ctx.fill();
      ctx.strokeStyle = '#e8e0d6';
      ctx.lineWidth = 1;
      roundRect(ctx, x, y, cardW, cardH, 10);
      ctx.stroke();

      ctx.fillStyle = s.renk;
      ctx.font = '700 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(s.val, x + cardW / 2, y + 32);

      ctx.fillStyle = '#a89c87';
      ctx.font = '400 12px system-ui, sans-serif';
      ctx.fillText(s.label, x + cardW / 2, y + 52);
    });

    // Ayraç çizgisi
    ctx.strokeStyle = '#e8e0d6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 450);
    ctx.lineTo(W - 60, 450);
    ctx.stroke();

    // Footer
    ctx.fillStyle = '#a89c87';
    ctx.font = '400 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    const footerBilgi = [isim, unvan, sirket].filter(Boolean).join('  ·  ');
    ctx.fillText(footerBilgi, W / 2, 480);
    ctx.fillText(`Sertifika No: ${sertifikaNo}  ·  ${tarih}`, W / 2, 500);

    // Mühür dairesi
    ctx.save();
    ctx.strokeStyle = d.renk;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(W - 100, 490, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = d.bg;
    ctx.beginPath();
    ctx.arc(W - 100, 490, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = d.renk;
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(d.emoji, W - 100, 498);
    ctx.restore();

  }, [sertifikaNo, tarih, isim, puan, xp, d]);

  const indir = () => {
    setIndiriliyor(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `sifir-gecikme-sertifika-${isim.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setTimeout(() => setIndiriliyor(false), 500);
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
            {gecti ? `${d.emoji} ${d.ad} sertifika kazandın!` : 'Dersleri tekrar edip tekrar deneyebilirsin.'}
          </p>
        </div>

        {/* Canvas sertifika */}
        <div style={{ marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '0.5px solid var(--color-border)', background: '#fff' }}>
          <canvas ref={canvasRef} style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Butonlar */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <button onClick={indir} disabled={indiriliyor || !sertifikaNo} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '10px', border: 'none',
            background: '#1D9E75', color: '#fff', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', opacity: !sertifikaNo ? 0.6 : 1,
          }}>
            {indiriliyor ? '⏳ İndiriliyor...' : '⬇ Sertifikayı indir (PNG)'}
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

        {/* Sonuç kutusu */}
        <div className="card" style={{ padding: '20px 24px', textAlign: 'center' }}>
          <div className="font-serif" style={{ fontSize: '17px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>
            {puan >= 90 ? '🌟 Mükemmel! Altın sertifika hak ettiniz!' :
             puan >= 70 ? '💪 Harika! Gümüş sertifika kazandınız!' :
             puan >= 50 ? '✅ Başardınız! Bronz sertifika kazandınız.' :
             '📚 Henüz geçemediniz. Dersleri tekrar edin!'}
          </div>
          {puan < 90 && gecti && (
            <div style={{ fontSize: '13px', color: 'var(--color-text-mute)' }}>
              Altın sertifika için %90 ve üzeri puan gerekiyor.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Yardımcı: köşe yuvarlak dikdörtgen
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function SinavSonuc() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center' }}>Yükleniyor...</div>}>
      <SertifikaIcerik />
    </Suspense>
  );
}
