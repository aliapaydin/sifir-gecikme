'use client';

import { useState, useEffect, useRef } from 'react';
import { dersler } from '../../../lib/dersler';
import { useParams } from 'next/navigation';

const YESIL = '#1D9E75';
const KIRMIZI = '#E24B4A';

function KodBlok({ kod }) {
  return (
    <pre style={{
      background: '#1a1815', color: '#f0ebe3',
      padding: '1rem 1.25rem', borderRadius: '10px',
      fontFamily: 'var(--font-mono)', fontSize: '13px',
      lineHeight: '1.7', overflowX: 'auto', margin: '1rem 0',
      border: '0.5px solid #3a3530',
    }}>{kod}</pre>
  );
}

// ─── ÖĞRET ───────────────────────────────────────────────────
function OgretAdimi({ adim, onDevam }) {
  return (
    <div>
      <h2 className="font-serif font-medium mb-3" style={{ fontSize: '22px', color: 'var(--color-text)' }}>
        {adim.baslik}
      </h2>
      <p style={{ fontSize: '16px', lineHeight: '1.75', color: 'var(--color-text-soft)', marginBottom: '1rem' }}>
        {adim.aciklama}
      </p>
      <KodBlok kod={adim.kod} />
      <button onClick={onDevam} style={btnStyle(YESIL)}>Anladım, devam et →</button>
    </div>
  );
}

// ─── ÇOKTAN SEÇMELİ ──────────────────────────────────────────
function CokSecAdimi({ adim, onDevam }) {
  const [secilen, setSecilen] = useState(null);
  const [kontrol, setKontrol] = useState(false);

  return (
    <div>
      <div style={etiketStyle}>❓ Çoktan Seçmeli</div>
      <pre style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.6', marginBottom: '1.25rem', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
        {adim.soru}
      </pre>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
        {adim.secenekler.map((s, idx) => {
          let border = 'var(--color-border)', bg = 'var(--color-cream-card)', color = 'var(--color-text)';
          if (kontrol) {
            if (idx === adim.dogru) { border = YESIL; bg = '#E1F5EE'; color = '#0F6E56'; }
            else if (idx === secilen) { border = KIRMIZI; bg = '#FCEBEB'; color = '#A32D2D'; }
          } else if (idx === secilen) { border = YESIL; bg = '#E1F5EE'; color = '#0F6E56'; }
          return (
            <button key={idx} onClick={() => { if (!kontrol) setSecilen(idx); }} style={{
              padding: '12px 14px', borderRadius: '10px', border: `2px solid ${border}`,
              background: bg, color, cursor: kontrol ? 'default' : 'pointer',
              fontSize: '14px', textAlign: 'left', transition: 'all 0.15s', lineHeight: '1.4',
            }}>{s}</button>
          );
        })}
      </div>
      {kontrol && <Feedback dogru={secilen === adim.dogru} aciklama={adim.aciklama} />}
      {!kontrol
        ? <button onClick={() => { if (secilen !== null) setKontrol(true); }} disabled={secilen === null} style={btnStyle(secilen === null ? 'var(--color-border)' : YESIL)}>Kontrol et</button>
        : <button onClick={onDevam} style={btnStyle(YESIL)}>Devam et →</button>}
    </div>
  );
}

// ─── BOŞLUK DOLDUR ───────────────────────────────────────────
function BoslukAdimi({ adim, onDevam }) {
  const [secilen, setSecilen] = useState(null);
  const [kontrol, setKontrol] = useState(false);
  const dogru = secilen === adim.dogru;

  return (
    <div>
      <div style={etiketStyle}>✏️ Boşluk Doldur</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '2.2', padding: '14px', background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '8px', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--color-text)' }}>{adim.once}</span>
        <span style={{
          display: 'inline-block', borderBottom: `2px solid ${kontrol ? (dogru ? YESIL : KIRMIZI) : YESIL}`,
          minWidth: '120px', padding: '2px 10px', margin: '0 4px',
          background: kontrol ? (dogru ? '#E1F5EE' : '#FCEBEB') : '#E1F5EE',
          color: kontrol ? (dogru ? '#0F6E56' : '#A32D2D') : '#0F6E56',
          borderRadius: '4px 4px 0 0', fontWeight: 500,
        }}>
          {secilen !== null ? adim.secenekler[secilen] : '___'}
        </span>
        <span style={{ color: 'var(--color-text)' }}>{adim.sonra}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {adim.secenekler.map((s, idx) => (
          <button key={idx} onClick={() => { if (!kontrol) setSecilen(idx); }} style={{
            padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontFamily: 'var(--font-mono)',
            border: `1.5px solid ${secilen === idx ? YESIL : 'var(--color-border)'}`,
            background: secilen === idx ? '#E1F5EE' : 'var(--color-cream-card)',
            color: secilen === idx ? '#0F6E56' : 'var(--color-text)',
            cursor: kontrol ? 'default' : 'pointer',
            opacity: kontrol && secilen !== idx ? 0.4 : 1,
          }}>{s}</button>
        ))}
      </div>
      {kontrol && <Feedback dogru={dogru} aciklama={adim.aciklama} dogru_cevap={!dogru ? adim.secenekler[adim.dogru] : null} />}
      {!kontrol
        ? <button onClick={() => { if (secilen !== null) setKontrol(true); }} disabled={secilen === null} style={btnStyle(secilen === null ? 'var(--color-border)' : YESIL)}>Kontrol et</button>
        : <button onClick={onDevam} style={btnStyle(YESIL)}>Devam et →</button>}
    </div>
  );
}

// ─── KOD SIRALA ──────────────────────────────────────────────
function SiralaAdimi({ adim, onDevam }) {
  const [sira, setSira] = useState([]);
  const [kontrol, setKontrol] = useState(false);
  const dogru = JSON.stringify(sira) === JSON.stringify(adim.dogru_sira);

  const ekle = (idx) => { if (!kontrol && !sira.includes(idx)) setSira([...sira, idx]); };
  const cikar = (idx) => { if (!kontrol) setSira(sira.filter(i => i !== idx)); };

  return (
    <div>
      <div style={etiketStyle}>🔀 Kod Sırala</div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '1rem' }}>{adim.soru}</p>
      <div style={{ minHeight: '52px', padding: '8px', marginBottom: '1rem', border: `1.5px dashed ${kontrol ? (dogru ? YESIL : KIRMIZI) : 'var(--color-border)'}`, borderRadius: '8px', background: 'var(--color-cream-card)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {sira.length === 0 && <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', padding: '8px', textAlign: 'center' }}>Aşağıdan satırları sırayla tıkla</div>}
        {sira.map((idx, pos) => (
          <button key={pos} onClick={() => cikar(idx)} style={{ padding: '8px 12px', borderRadius: '6px', border: '0.5px solid ' + YESIL, background: '#E1F5EE', color: '#0F6E56', fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
            <span>{adim.satirlar[idx]}</span>
            <span style={{ fontSize: '10px', opacity: 0.5 }}>× çıkar</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
        {adim.satirlar.map((s, idx) => (
          <button key={idx} onClick={() => ekle(idx)} disabled={sira.includes(idx) || kontrol} style={{ padding: '8px 12px', borderRadius: '6px', border: `1.5px solid ${sira.includes(idx) ? 'transparent' : 'var(--color-border)'}`, background: sira.includes(idx) ? 'transparent' : 'var(--color-cream-card)', color: sira.includes(idx) ? 'transparent' : 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '12px', textAlign: 'left', cursor: 'pointer', opacity: sira.includes(idx) ? 0.15 : 1, transition: 'all 0.15s' }}>{s}</button>
        ))}
      </div>
      {kontrol && <Feedback dogru={dogru} aciklama={adim.aciklama} />}
      {!kontrol
        ? <button onClick={() => { if (sira.length === adim.satirlar.length) setKontrol(true); }} disabled={sira.length !== adim.satirlar.length} style={btnStyle(sira.length !== adim.satirlar.length ? 'var(--color-border)' : YESIL)}>Kontrol et</button>
        : <button onClick={onDevam} style={btnStyle(YESIL)}>Devam et →</button>}
    </div>
  );
}

// ─── EŞLEŞTİR (YENİ) ─────────────────────────────────────────
function EslestirAdimi({ adim, onDevam }) {
  const [eslesmeler, setEslesmeler] = useState({});
  const [secilenSol, setSecilenSol] = useState(null);
  const [kontrol, setKontrol] = useState(false);

  const solTikla = (idx) => {
    if (kontrol) return;
    setSecilenSol(idx === secilenSol ? null : idx);
  };

  const sagTikla = (idx) => {
    if (kontrol || secilenSol === null) return;
    setEslesmeler(prev => {
      const next = { ...prev };
      // Önceki eşleşmeyi temizle
      Object.keys(next).forEach(k => { if (next[k] === idx) delete next[k]; });
      next[secilenSol] = idx;
      return next;
    });
    setSecilenSol(null);
  };

  const tumEslesti = Object.keys(eslesmeler).length === adim.cifitler.length;

  const dogruMu = (solIdx) => {
    return eslesmeler[solIdx] === solIdx;
  };

  return (
    <div>
      <div style={etiketStyle}>🔗 Eşleştir</div>
      <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '1.25rem' }}>{adim.soru}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
        {/* Sol kolon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {adim.cifitler.map((cifti, idx) => {
            const eslestiMi = eslesmeler[idx] !== undefined;
            const seciliMi = secilenSol === idx;
            let bg = 'var(--color-cream-card)', border = 'var(--color-border)', color = 'var(--color-text)';
            if (kontrol) {
              bg = dogruMu(idx) ? '#E1F5EE' : '#FCEBEB';
              border = dogruMu(idx) ? YESIL : KIRMIZI;
              color = dogruMu(idx) ? '#0F6E56' : '#A32D2D';
            } else if (seciliMi) { bg = '#E1F5EE'; border = YESIL; color = '#0F6E56'; }
            else if (eslestiMi) { bg = '#EEEDFE'; border = '#7F77DD'; color = '#534AB7'; }
            return (
              <button key={idx} onClick={() => solTikla(idx)} style={{ padding: '10px 14px', borderRadius: '8px', border: `2px solid ${border}`, background: bg, color, fontSize: '13px', fontFamily: 'var(--font-mono)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', minHeight: '44px' }}>
                {cifti.sol}
              </button>
            );
          })}
        </div>

        {/* Sağ kolon — karıştırılmış */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {adim.cifitler.map((cifti, idx) => {
            const eslesenSol = Object.keys(eslesmeler).find(k => eslesmeler[k] === idx);
            const eslestiMi = eslesenSol !== undefined;
            let bg = 'var(--color-cream-card)', border = 'var(--color-border)', color = 'var(--color-text)';
            if (kontrol && eslestiMi) {
              const solIdx = parseInt(eslesenSol);
              bg = dogruMu(solIdx) ? '#E1F5EE' : '#FCEBEB';
              border = dogruMu(solIdx) ? YESIL : KIRMIZI;
              color = dogruMu(solIdx) ? '#0F6E56' : '#A32D2D';
            } else if (eslestiMi) { bg = '#EEEDFE'; border = '#7F77DD'; color = '#534AB7'; }
            return (
              <button key={idx} onClick={() => sagTikla(idx)} style={{ padding: '10px 14px', borderRadius: '8px', border: `2px solid ${border}`, background: bg, color, fontSize: '13px', textAlign: 'left', cursor: secilenSol !== null && !kontrol ? 'pointer' : 'default', transition: 'all 0.15s', minHeight: '44px' }}>
                {cifti.sag}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '1rem', textAlign: 'center' }}>
        {kontrol ? '' : secilenSol !== null ? '→ Şimdi sağ taraftan eşini seç' : 'Sol taraftan bir kavram seç'}
      </p>

      {kontrol && <Feedback dogru={adim.cifitler.every((_, i) => dogruMu(i))} aciklama={adim.aciklama} />}
      {!kontrol
        ? <button onClick={() => { if (tumEslesti) setKontrol(true); }} disabled={!tumEslesti} style={btnStyle(!tumEslesti ? 'var(--color-border)' : YESIL)}>Kontrol et</button>
        : <button onClick={onDevam} style={btnStyle(YESIL)}>Devam et →</button>}
    </div>
  );
}

// ─── YARDIMCI COMPONENTLER ───────────────────────────────────
function Feedback({ dogru, aciklama, dogru_cevap }) {
  return (
    <div style={{ padding: '1rem', borderRadius: '10px', marginBottom: '1rem', background: dogru ? '#E1F5EE' : '#FCEBEB', border: `1.5px solid ${dogru ? YESIL : KIRMIZI}` }}>
      <div style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px', color: dogru ? '#0F6E56' : '#A32D2D' }}>
        {dogru ? '✅ Doğru!' : dogru_cevap ? `❌ Doğru cevap: ${dogru_cevap}` : '❌ Yanlış'}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.55' }}>{aciklama}</div>
    </div>
  );
}

const etiketStyle = { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-mute)', marginBottom: '12px', fontWeight: 500 };
const btnStyle = (bg) => ({ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: bg, color: '#fff', fontSize: '15px', fontWeight: 500, cursor: bg === 'var(--color-border)' ? 'not-allowed' : 'pointer', transition: 'background 0.15s' });

// ─── ANA SAYFA ────────────────────────────────────────────────
export default function DersSayfasi() {
  const params = useParams();
  const ders = dersler.find(d => d.id === params.slug);
  const [adimIdx, setAdimIdx] = useState(0);
  const [bitti, setBitti] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [adimIdx]);

  if (!ders) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-mute)' }}>Ders bulunamadı.</div>;

  const adim = ders.adimlar[adimIdx];
  const ilerleme = Math.round((adimIdx / ders.adimlar.length) * 100);
  const devam = () => { if (adimIdx + 1 >= ders.adimlar.length) setBitti(true); else setAdimIdx(i => i + 1); };
  const sonrakiDers = dersler[dersler.findIndex(d => d.id === ders.id) + 1];

  if (bitti) {
    return (
      <main className="min-h-screen">
        <div className="max-w-xl mx-auto px-6 py-16 text-center">
          <div style={{ fontSize: '72px', marginBottom: '1rem' }}>🎉</div>
          <h1 className="font-serif text-3xl font-medium mb-3" style={{ color: 'var(--color-text)' }}>Ders tamamlandı!</h1>
          <p className="mb-8" style={{ color: 'var(--color-text-soft)', fontSize: '16px' }}>
            <strong>{ders.baslik}</strong> dersini başarıyla bitirdin.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '2rem' }}>
            <div><div style={{ fontSize: '32px', fontWeight: 500, color: YESIL }}>+{ders.xp}</div><div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>XP kazandın</div></div>
            <div><div style={{ fontSize: '32px' }}>🔥</div><div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>Seri devam</div></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/ogren" style={{ padding: '12px 24px', borderRadius: '10px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', color: 'var(--color-text)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>← Ders yoluna dön</a>
            {sonrakiDers && (
              <a href={`/ogren/${sonrakiDers.id}`} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: YESIL, color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                {sonrakiDers.emoji} {sonrakiDers.baslik} →
              </a>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
          <a href="/ogren" style={{ fontSize: '20px', textDecoration: 'none', color: 'var(--color-text-mute)', flexShrink: 0 }}>←</a>
          <div style={{ flex: 1, height: '8px', background: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${ilerleme}%`, background: ders.renk, borderRadius: '999px', transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-mute)', whiteSpace: 'nowrap' }}>{adimIdx + 1} / {ders.adimlar.length}</div>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          {adim.tip === 'ogret'          && <OgretAdimi   adim={adim} onDevam={devam} />}
          {adim.tip === 'coktan_secmeli' && <CokSecAdimi  adim={adim} onDevam={devam} />}
          {adim.tip === 'bosluk_doldur'  && <BoslukAdimi  adim={adim} onDevam={devam} />}
          {adim.tip === 'kod_sirala'     && <SiralaAdimi  adim={adim} onDevam={devam} />}
          {adim.tip === 'eslestir'       && <EslestirAdimi adim={adim} onDevam={devam} />}
        </div>
      </div>
    </main>
  );
}
