import Link from 'next/link';
import { yazilar } from '../../../lib/icerikler';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'İçerik Analizi' };

// href → başlık haritası
const titleMap = Object.fromEntries(yazilar.map(y => [y.href, y.baslik]));
const badgeMap  = Object.fromEntries(yazilar.map(y => [y.href, y.badge]));

function getTitle(href) {
  return titleMap[href] || href.split('/').filter(Boolean).pop();
}
function getBadge(href) {
  return badgeMap[href] || null;
}

const BADGE_COLOR = {
  'interaktif':     { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf' },
  'rehber':         { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa' },
  'araç':           { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8' },
  'vaka çalışması': { bg: 'rgba(249,115,22,0.12)',  color: '#fb923c' },
  'kariyer':        { bg: 'rgba(16,185,129,0.12)',  color: '#34d399' },
};

function fmtNum(n) {
  if (!n) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function RankList({ items, color, emptyMsg }) {
  if (!items?.length) {
    return <p style={{ fontSize: '13px', color: 'var(--v3-text-faint)', padding: '16px 0' }}>{emptyMsg}</p>;
  }
  const max = items[0]?.total || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, i) => {
        const badge = getBadge(item.href);
        const bc    = badge ? BADGE_COLOR[badge] : null;
        const pct   = Math.round((item.total / max) * 100);
        return (
          <Link
            key={item.href}
            href={`/v3${item.href}`}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px', borderRadius: '10px',
              border: '1px solid var(--v3-border)',
              background: 'var(--v3-surface)',
              transition: 'border-color 0.15s, transform 0.1s',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--v3-border-bright)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--v3-border)'; e.currentTarget.style.transform = 'none'; }}
            >
              {/* Progress bar arka plan */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${pct}%`, background: color,
                opacity: 0.07, borderRadius: '10px 0 0 10px',
                transition: 'width 0.4s',
              }} />
              {/* Sıra numarası */}
              <span style={{
                fontSize: '13px', fontWeight: 700, color: i < 3 ? color.replace('0.07', '1') : 'var(--v3-text-faint)',
                width: '20px', textAlign: 'center', flexShrink: 0, position: 'relative',
              }}>
                {i < 3 ? ['🥇','🥈','🥉'][i] : `${i+1}`}
              </span>
              {/* Başlık + badge */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--v3-text)', lineHeight: 1.35,
                  overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {getTitle(item.href)}
                </div>
                {badge && bc && (
                  <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '3px', display: 'inline-block',
                    padding: '1px 6px', borderRadius: '3px', background: bc.bg, color: bc.color }}>
                    {badge}
                  </span>
                )}
              </div>
              {/* Sayı */}
              <span style={{
                fontSize: '14px', fontWeight: 700, color: 'var(--v3-text)',
                flexShrink: 0, position: 'relative',
              }}>
                {fmtNum(item.total)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--v3-surface)', border: '1px solid var(--v3-border)',
      borderRadius: '14px', padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: '6px',
    }}>
      <div style={{ fontSize: '22px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: color || 'var(--v3-text)', lineHeight: 1, letterSpacing: '-0.5px' }}>
        {fmtNum(value)}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--v3-text)' }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--v3-text-muted)' }}>{sub}</div>}
    </div>
  );
}

async function getData() {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const res = await fetch(`${base}/api/v3/analytics`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function AnalizPage() {
  const data = await getData();

  const s = data?.summary || {};
  const weekly   = data?.weekly   || [];
  const allTime  = data?.allTime  || [];
  const topAnladi = data?.topAnladi || [];
  const topTekrar = data?.topTekrar || [];

  return (
    <>
      <style>{`
        .analiz-page { max-width: 1100px; margin: 0 auto; padding: 56px 24px 80px; }
        .analiz-header { margin-bottom: 40px; }
        .analiz-title { font-size: 32px; font-weight: 800; letter-spacing: -0.6px; color: var(--v3-text); margin: 0 0 8px; }
        .analiz-sub   { font-size: 15px; color: var(--v3-text-muted); margin: 0; }
        .analiz-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin-bottom: 40px; }
        .analiz-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .analiz-section { background: var(--v3-surface); border: 1px solid var(--v3-border); border-radius: 16px; padding: 24px; }
        .analiz-sec-title { font-size: 16px; font-weight: 700; color: var(--v3-text); margin: 0 0 6px; display: flex; align-items: center; gap: 8px; }
        .analiz-sec-sub   { font-size: 12px; color: var(--v3-text-muted); margin: 0 0 18px; }
        .analiz-updated   { font-size: 11px; color: var(--v3-text-faint); margin-top: 32px; text-align: right; }
        @media (max-width: 720px) {
          .analiz-page { padding: 32px 16px 60px; }
          .analiz-title { font-size: 24px; }
          .analiz-grid  { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="analiz-page">
        <div className="analiz-header">
          <Link href="/v3" style={{ fontSize: '13px', color: 'var(--v3-text-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
            ← Ana Sayfa
          </Link>
          <h1 className="analiz-title">İçerik Analizi</h1>
          <p className="analiz-sub">En çok okunan, en çok işaretlenen — gerçek zamanlı içerik istatistikleri.</p>
        </div>

        {/* Özet kartlar */}
        <div className="analiz-stats">
          <StatCard icon="👁️" label="Toplam Görüntülenme" value={s.total_views} sub="Tüm zamanlar" color="#818cf8" />
          <StatCard icon="📈" label="Bu Haftaki Görüntülenme" value={s.weekly_views} sub="Son 7 gün" color="#2dd4bf" />
          <StatCard icon="📚" label="Takip Edilen İçerik" value={s.unique_content} sub={`/ ${yazilar.length} içerik`} color="#fb923c" />
          <StatCard icon="✅" label="Anladım İşaretleme" value={s.total_anladi} sub="Toplam kullanıcı" color="#10b981" />
          <StatCard icon="↩" label="Tekrar Bak İşaretleme" value={s.total_tekrar} sub="Toplam kullanıcı" color="#fbbf24" />
          <StatCard icon="👤" label="Aktif Kullanıcı" value={s.active_users} sub="İşaretleme yapan" color="#a78bfa" />
        </div>

        {/* 4 analiz bölümü */}
        <div className="analiz-grid">
          <div className="analiz-section">
            <h2 className="analiz-sec-title">
              <span>🔥</span> Bu Hafta Trend
            </h2>
            <p className="analiz-sec-sub">Son 7 gündeki görüntülenme sayısına göre</p>
            <RankList
              items={weekly}
              color="rgba(251,146,60,0.12)"
              emptyMsg="Henüz bu hafta görüntülenme verisi yok."
            />
          </div>

          <div className="analiz-section">
            <h2 className="analiz-sec-title">
              <span>🏆</span> Tüm Zamanlar En Çok Okunan
            </h2>
            <p className="analiz-sec-sub">Toplam görüntülenme sayısına göre</p>
            <RankList
              items={allTime}
              color="rgba(99,102,241,0.12)"
              emptyMsg="Henüz görüntülenme verisi yok."
            />
          </div>

          <div className="analiz-section">
            <h2 className="analiz-sec-title">
              <span>✅</span> En Çok "Anladım" Denen
            </h2>
            <p className="analiz-sec-sub">Kullanıcıların anladım olarak işaretlediği içerikler</p>
            <RankList
              items={topAnladi}
              color="rgba(16,185,129,0.12)"
              emptyMsg="Henüz anladım işaretlemesi yok."
            />
          </div>

          <div className="analiz-section">
            <h2 className="analiz-sec-title">
              <span>↩</span> En Çok "Tekrar Bak" Denen
            </h2>
            <p className="analiz-sec-sub">Kullanıcıların tekrar bakmak istediği içerikler</p>
            <RankList
              items={topTekrar}
              color="rgba(251,191,36,0.12)"
              emptyMsg="Henüz tekrar bak işaretlemesi yok."
            />
          </div>
        </div>

        {data?.generatedAt && (
          <p className="analiz-updated">
            Son güncelleme: {new Date(data.generatedAt).toLocaleString('tr-TR')}
          </p>
        )}
      </div>
    </>
  );
}
