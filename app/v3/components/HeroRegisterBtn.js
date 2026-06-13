'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroRegisterBtn() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch('/api/v3/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => setUser(d?.user || null))
      .catch(() => setUser(null));
  }, []);

  if (user !== null) return null;
  return (
    <Link href="/kayit" className="v3-btn-secondary">Ücretsiz Kaydol</Link>
  );
}
