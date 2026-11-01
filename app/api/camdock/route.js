import { NextResponse } from 'next/server';
import { sql } from '@/lib/v3/db';
import { ensureCamdockTables, isId, short } from '@/lib/camdock';

// POST /api/camdock  — Cam Dock uygulamasından gelir (oturum gerekmez)
// { action: "ping" | "revoke" | "delete" | "uninstall", id, version, os, monitors, widgets }
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
  }
  const { action, id } = body || {};
  if (!isId(id)) return NextResponse.json({ error: 'Geçersiz kimlik' }, { status: 400 });

  try {
    await ensureCamdockTables();
    const version = short(body.version, 20);

    if (action === 'ping') {
      const os = short(body.os, 60);
      const monitors = Number.isInteger(body.monitors) ? Math.min(Math.max(body.monitors, 0), 16) : null;
      const widgets = Array.isArray(body.widgets)
        ? body.widgets.filter((w) => typeof w === 'string').slice(0, 20).map((w) => w.slice(0, 20))
        : null;
      // Yalnızca ülke kodu; IP adresi hiçbir yere yazılmaz.
      const country = short(request.headers.get('x-vercel-ip-country') || '', 2) || null;
      const [row] = await sql`
        INSERT INTO camdock_installs (install_id, version, os, monitors, widgets, country)
        VALUES (${id}, ${version}, ${os}, ${monitors}, ${widgets}, ${country})
        ON CONFLICT (install_id) DO UPDATE SET
          last_seen = NOW(),
          version = EXCLUDED.version,
          os = EXCLUDED.os,
          monitors = EXCLUDED.monitors,
          widgets = EXCLUDED.widgets,
          country = COALESCE(EXCLUDED.country, camdock_installs.country),
          consent = TRUE,
          revoked_at = NULL,
          uninstalled_at = NULL
        RETURNING (xmax = 0) AS inserted
      `;
      await sql`
        INSERT INTO camdock_daily (day, install_id, version)
        VALUES (CURRENT_DATE, ${id}, ${version})
        ON CONFLICT (day, install_id) DO UPDATE SET version = EXCLUDED.version
      `;
      if (row?.inserted) {
        await sql`INSERT INTO camdock_events (install_id, kind, version) VALUES (${id}, 'install', ${version})`;
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'revoke') {
      const r = await sql`
        UPDATE camdock_installs SET consent = FALSE, revoked_at = NOW()
        WHERE install_id = ${id} RETURNING install_id
      `;
      if (r.length) await sql`INSERT INTO camdock_events (install_id, kind, version) VALUES (${id}, 'revoke', ${version})`;
      return NextResponse.json({ ok: true });
    }

    if (action === 'uninstall') {
      const r = await sql`
        UPDATE camdock_installs SET uninstalled_at = NOW()
        WHERE install_id = ${id} RETURNING install_id
      `;
      if (r.length) await sql`INSERT INTO camdock_events (install_id, kind, version) VALUES (${id}, 'uninstall', ${version})`;
      return NextResponse.json({ ok: true });
    }

    if (action === 'delete') {
      // Kurulumun tüm verileri silinir (günlük ve olay kayıtları da). Yalnızca
      // kimliksiz bir "silindi" sayacı kalır.
      const r = await sql`DELETE FROM camdock_installs WHERE install_id = ${id} RETURNING install_id`;
      if (r.length) await sql`INSERT INTO camdock_events (install_id, kind, version) VALUES (NULL, 'delete', ${version})`;
      return NextResponse.json({ ok: true, deleted: r.length > 0 });
    }

    return NextResponse.json({ error: 'Bilinmeyen işlem' }, { status: 400 });
  } catch (err) {
    console.error('camdock POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
