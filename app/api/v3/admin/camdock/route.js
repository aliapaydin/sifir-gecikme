import { NextResponse } from 'next/server';
import { getSession } from '@/lib/v3/auth';
import { sql } from '@/lib/v3/db';
import { ensureCamdockTables } from '@/lib/camdock';

// GET /api/v3/admin/camdock — Cam Dock kullanım özeti (yalnızca admin)
export async function GET(request) {
  const session = await getSession(request);
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 });
  }
  await ensureCamdockTables();

  const [totals] = await sql`
    SELECT
      COUNT(*)                                                                         AS total,
      COUNT(*) FILTER (WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '1 day')   AS active_1d,
      COUNT(*) FILTER (WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '7 days')  AS active_7d,
      COUNT(*) FILTER (WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '30 days') AS active_30d,
      COUNT(*) FILTER (WHERE consent AND uninstalled_at IS NULL AND last_seen <= NOW() - INTERVAL '30 days') AS dormant,
      COUNT(*) FILTER (WHERE NOT consent)                                              AS revoked,
      COUNT(*) FILTER (WHERE uninstalled_at IS NOT NULL)                               AS uninstalled,
      COUNT(*) FILTER (WHERE first_seen > NOW() - INTERVAL '7 days')                   AS new_7d
    FROM camdock_installs
  `;
  const [{ deleted }] = await sql`SELECT COUNT(*) AS deleted FROM camdock_events WHERE kind = 'delete'`;

  const daily = await sql`
    SELECT to_char(day, 'YYYY-MM-DD') AS day, COUNT(*) AS count
    FROM camdock_daily
    WHERE day > CURRENT_DATE - 30
    GROUP BY day ORDER BY day
  `;
  const installsDaily = await sql`
    SELECT to_char(DATE(at), 'YYYY-MM-DD') AS day, kind, COUNT(*) AS count
    FROM camdock_events
    WHERE at > NOW() - INTERVAL '30 days'
    GROUP BY DATE(at), kind ORDER BY DATE(at)
  `;
  const versions = await sql`
    SELECT COALESCE(version, '?') AS key, COUNT(*) AS count FROM camdock_installs
    WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '30 days'
    GROUP BY 1 ORDER BY count DESC LIMIT 12
  `;
  const countries = await sql`
    SELECT COALESCE(country, '?') AS key, COUNT(*) AS count FROM camdock_installs
    WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '30 days'
    GROUP BY 1 ORDER BY count DESC LIMIT 15
  `;
  const oses = await sql`
    SELECT COALESCE(os, '?') AS key, COUNT(*) AS count FROM camdock_installs
    WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '30 days'
    GROUP BY 1 ORDER BY count DESC LIMIT 10
  `;
  const widgets = await sql`
    SELECT w AS key, COUNT(*) AS count
    FROM camdock_installs, unnest(widgets) AS w
    WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '30 days'
    GROUP BY w ORDER BY count DESC
  `;
  const monitors = await sql`
    SELECT COALESCE(monitors, 0) AS key, COUNT(*) AS count FROM camdock_installs
    WHERE consent AND uninstalled_at IS NULL AND last_seen > NOW() - INTERVAL '30 days'
    GROUP BY 1 ORDER BY 1
  `;
  const recent = await sql`
    SELECT left(install_id::text, 8) AS id, version, os, country, monitors, first_seen, last_seen,
           consent, revoked_at, uninstalled_at,
           (last_seen <= NOW() - INTERVAL '30 days') AS dormant
    FROM camdock_installs
    ORDER BY last_seen DESC
    LIMIT 50
  `;

  const n = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Number(v)]));
  const list = (rows) => rows.map((r) => ({ key: String(r.key), count: Number(r.count) }));
  return NextResponse.json({
    totals: { ...n(totals), deleted: Number(deleted) },
    daily: daily.map((d) => ({ day: d.day, count: Number(d.count) })),
    events: installsDaily.map((d) => ({ day: d.day, kind: d.kind, count: Number(d.count) })),
    versions: list(versions),
    countries: list(countries),
    oses: list(oses),
    widgets: list(widgets),
    monitors: list(monitors),
    recent,
  });
}
