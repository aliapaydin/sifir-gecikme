'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Cam Dock kullanım istatistiği (anonim). Kişisel veri gösterilmez: kurulum
// kimliğinin yalnızca ilk 8 karakteri, sürüm, Windows sürümü ve ülke.

const fmtDay = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
const fmtAgo = (iso) => {
  if (!iso) return '—';
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  if (m < 60) return `${Math.max(m, 0)} dk önce`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} sa önce`;
  return `${Math.round(h / 24)} gün önce`;
};
const flag = (cc) =>
  cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '🌐';

const WIDGET_NAMES = {
  calendar: 'Takvim', screentime: 'Ekran süresi', ticker: 'Piyasa ve haberler', media: 'Müzik',
  clipboard: 'Pano geçmişi', system: 'Sistem düğmeleri', clock: 'Saat ve hava', lock: 'Kilit', claude: 'Claude kullanımı', mail: 'Mail',
};

function Columns({ data, color = '#6366f1', height = 130 }) {
  if (!data?.length) return <div className="cd-empty">Henüz veri yok</div>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="cd-cols" style={{ height }}>
      {data.map((d) => (
        <div key={d.day} className="cd-col" title={`${fmtDay(d.day)}: ${d.count}`}>
          <i style={{ height: `${Math.max((d.count / max) * 100, 3)}%`, background: color }} />
        </div>
      ))}
    </div>
  );
}

function Bars({ data, color, label = (k) => k, total }) {
  if (!data?.length) return <div className="cd-empty">Henüz veri yok</div>;
  const sum = total ?? data.reduce((s, x) => s + x.count, 0);
  const max = Math.max(...data.map((d) => d.count), 1);
  return data.map((r) => (
    <div key={r.key} className="cd-bar-row">
      <span className="cd-bar-label">{label(r.key)}</span>
      <div className="cd-bar-wrap"><div className="cd-bar" style={{ width: `${(r.count / max) * 100}%`, background: color }} /></div>
      <span className="cd-bar-val">{r.count}<small>{sum ? ` · %${Math.round((r.count / sum) * 100)}` : ''}</small></span>
    </div>
  ));
}

function Stat({ label, value, sub, color }) {
  return (
    <div className="cd-stat">
      <div className="cd-stat-label">{label}</div>
      <div className="cd-stat-val" style={{ color }}>{value}</div>
      {sub && <div className="cd-stat-sub">{sub}</div>}
    </div>
  );
}

export default function CamDockAdmin() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = () =>
    fetch('/api/v3/admin/camdock')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch((e) => setError(`Veriler alınamadı (${e})`));
  useEffect(() => { load(); }, []);

  const t = data?.totals;
  const installs = data ? Object.values(data.events.filter((e) => e.kind === 'install').reduce((m, e) => ({ ...m, [e.day]: e }), {})) : [];
  const activeTotal = t?.active_30d || 0;

  return (
    <>
      <style>{`
        .cd-page { max-width: 1150px; margin: 0 auto; padding: 48px 24px; }
        .cd-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .cd-back { font-size: 14px; color: var(--v3-text-muted); }
        .cd-title { font-size: 24px; font-weight: 800; letter-spacing: -0.4px; color: var(--v3-text); margin: 0; flex: 1; }
        .cd-refresh { font-size: 13px; font-weight: 600; padding: 8px 14px; border-radius: 10px; border: 1px solid var(--v3-border); background: var(--v3-surface); color: var(--v3-text); cursor: pointer; }
        .cd-note { font-size: 13px; color: var(--v3-text-muted); margin: -12px 0 28px; line-height: 1.5; }
        .cd-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; margin-bottom: 20px; }
        .cd-stat { background: var(--v3-surface); border: 1px solid var(--v3-border); border-radius: 14px; padding: 16px 18px; }
        .cd-stat-label { font-size: 11px; font-weight: 700; color: var(--v3-text-muted); text-transform: uppercase; letter-spacing: .5px; }
        .cd-stat-val { font-size: 32px; font-weight: 800; color: var(--v3-text); line-height: 1.1; margin-top: 6px; }
        .cd-stat-sub { font-size: 12px; color: var(--v3-text-faint); margin-top: 4px; }
        .cd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .cd-card { background: var(--v3-surface); border: 1px solid var(--v3-border); border-radius: 16px; padding: 22px; }
        .cd-card.wide { grid-column: 1 / -1; }
        .cd-card-title { font-size: 12px; font-weight: 700; color: var(--v3-text-muted); text-transform: uppercase; letter-spacing: .5px; margin: 0 0 18px; }
        .cd-cols { display: flex; align-items: flex-end; gap: 4px; }
        .cd-col { flex: 1; height: 100%; display: flex; align-items: flex-end; }
        .cd-col i { display: block; width: 100%; border-radius: 3px 3px 0 0; opacity: .85; }
        .cd-col:hover i { opacity: 1; }
        .cd-axis { display: flex; justify-content: space-between; font-size: 11px; color: var(--v3-text-faint); margin-top: 8px; }
        .cd-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cd-bar-label { font-size: 13px; color: var(--v3-text); width: 130px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cd-bar-wrap { flex: 1; background: rgba(127,127,127,0.12); border-radius: 4px; height: 8px; overflow: hidden; }
        .cd-bar { height: 100%; border-radius: 4px; }
        .cd-bar-val { font-size: 13px; font-weight: 700; color: var(--v3-text); width: 72px; text-align: right; flex-shrink: 0; }
        .cd-bar-val small { font-weight: 500; color: var(--v3-text-faint); }
        .cd-empty { font-size: 14px; color: var(--v3-text-muted); }
        .cd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .cd-table th { text-align: left; font-size: 11px; font-weight: 700; color: var(--v3-text-muted); text-transform: uppercase; letter-spacing: .4px; padding: 0 10px 10px 0; }
        .cd-table td { padding: 9px 10px 9px 0; border-top: 1px solid rgba(127,127,127,0.12); color: var(--v3-text); white-space: nowrap; }
        .cd-mono { font-family: ui-monospace, monospace; color: var(--v3-text-muted); }
        .cd-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
        .cd-scroll { overflow-x: auto; }
        @media (max-width: 600px) { .cd-page { padding: 32px 16px; } .cd-card.wide { grid-column: auto; } }
      `}</style>

      <div className="cd-page">
        <div className="cd-header">
          <Link href="/admin" className="cd-back">← Admin</Link>
          <h1 className="cd-title">Cam Dock kullanımı</h1>
          <button className="cd-refresh" onClick={load}>Yenile</button>
        </div>
        <p className="cd-note">
          Anonim istatistik: rastgele kurulum kimliği, sürüm, Windows sürümü, ekran sayısı, açık widget&apos;lar ve ülke.
          IP adresi, bilgisayar ya da kullanıcı adı tutulmaz. &quot;Aktif&quot; = izni açık, kaldırılmamış ve son 30 günde görülmüş.
        </p>

        {error && <div style={{ color: '#f87171' }}>{error}</div>}
        {!data && !error && <div style={{ color: 'var(--v3-text-muted)' }}>Yükleniyor...</div>}

        {data && (
          <>
            <div className="cd-stats">
              <Stat label="Bugün aktif" value={t.active_1d} color="#34d399" />
              <Stat label="7 günde aktif" value={t.active_7d} color="#818cf8" />
              <Stat label="30 günde aktif" value={t.active_30d} sub={`${t.new_7d} yeni kurulum (7 gün)`} />
              <Stat label="Toplam kurulum" value={t.total} sub="izin verilen tüm kayıtlar" />
              <Stat label="Pasif" value={t.dormant} sub="30+ gündür görülmedi" color="#94a3b8" />
              <Stat label="Kaldırılan" value={t.uninstalled} color="#fb923c" />
              <Stat label="İzni kapatan" value={t.revoked} color="#f87171" sub={`${t.deleted} kişi verisini sildirdi`} />
            </div>

            <div className="cd-grid">
              <div className="cd-card wide">
                <div className="cd-card-title">Günlük aktif kurulum · son 30 gün</div>
                <Columns data={data.daily} color="#6366f1" />
                <div className="cd-axis"><span>{data.daily[0] && fmtDay(data.daily[0].day)}</span><span>Bugün</span></div>
              </div>

              <div className="cd-card">
                <div className="cd-card-title">Yeni kurulumlar · son 30 gün</div>
                <Columns data={installs.map((e) => ({ day: e.day, count: e.count }))} color="#34d399" height={100} />
              </div>

              <div className="cd-card">
                <div className="cd-card-title">Sürümler (aktif)</div>
                <Bars data={data.versions} color="#818cf8" label={(k) => `v${k}`} total={activeTotal} />
              </div>

              <div className="cd-card">
                <div className="cd-card-title">Ülkeler (aktif)</div>
                <Bars data={data.countries} color="#f59e0b" label={(k) => `${flag(k)} ${k}`} total={activeTotal} />
              </div>

              <div className="cd-card">
                <div className="cd-card-title">Windows sürümü (aktif)</div>
                <Bars data={data.oses} color="#14b8a6" total={activeTotal} />
              </div>

              <div className="cd-card">
                <div className="cd-card-title">Widget kullanımı (aktif)</div>
                <Bars data={data.widgets} color="#ec4899" label={(k) => WIDGET_NAMES[k] || k} total={activeTotal} />
              </div>

              <div className="cd-card">
                <div className="cd-card-title">Ekran sayısı (aktif)</div>
                <Bars data={data.monitors} color="#0ea5e9" label={(k) => `${k} ekran`} total={activeTotal} />
              </div>

              <div className="cd-card wide">
                <div className="cd-card-title">Son görülen kurulumlar</div>
                <div className="cd-scroll">
                  <table className="cd-table">
                    <thead>
                      <tr><th>Kimlik</th><th>Durum</th><th>Sürüm</th><th>Windows</th><th>Ülke</th><th>Ekran</th><th>İlk</th><th>Son</th></tr>
                    </thead>
                    <tbody>
                      {data.recent.map((r) => {
                        const status = r.uninstalled_at
                          ? ['Kaldırıldı', '#fb923c']
                          : !r.consent
                            ? ['İzin kapalı', '#f87171']
                            : r.dormant
                              ? ['Pasif', '#94a3b8']
                              : ['Aktif', '#34d399'];
                        return (
                          <tr key={r.id}>
                            <td className="cd-mono">{r.id}</td>
                            <td><span className="cd-badge" style={{ background: `${status[1]}22`, color: status[1] }}>{status[0]}</span></td>
                            <td>v{r.version || '?'}</td>
                            <td>{r.os || '—'}</td>
                            <td>{flag(r.country)} {r.country || ''}</td>
                            <td>{r.monitors ?? '—'}</td>
                            <td>{fmtDay(r.first_seen)}</td>
                            <td>{fmtAgo(r.last_seen)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
