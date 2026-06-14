import { NextResponse } from 'next/server';

// Döviz & altın verileri — ücretsiz, key gerektirmeyen API'lar
// open.er-api.com  : USD bazlı döviz kurları (saatlik güncelleme)
// api.metals.live  : Spot metal fiyatları (dakikalık güncelleme)

export const revalidate = 1800; // 30 dakika cache

export async function GET() {
  try {
    const [erRes, metalsRes] = await Promise.allSettled([
      fetch('https://open.er-api.com/v6/latest/USD', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 1800 },
      }),
      fetch('https://api.metals.live/v1/spot', {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 900 },
      }),
    ]);

    // Döviz kurları
    let USDTRY = null, EURTRY = null, GBPTRY = null;
    if (erRes.status === 'fulfilled' && erRes.value.ok) {
      const er = await erRes.value.json();
      USDTRY = er.rates?.TRY ?? null;
      // EURTRY = (1 USD = X TRY) / (1 USD = Y EUR) × 1 EUR = X/Y TRY
      if (USDTRY && er.rates?.EUR) EURTRY = USDTRY / er.rates.EUR;
      if (USDTRY && er.rates?.GBP) GBPTRY = USDTRY / er.rates.GBP;
    }

    // Altın (troy ons → gram dönüşümü: 1 oz = 31.1035 g)
    let goldUSDoz = null, goldTRYgram = null;
    if (metalsRes.status === 'fulfilled' && metalsRes.value.ok) {
      const metals = await metalsRes.value.json();
      // metals.live farklı format dönebilir
      if (Array.isArray(metals)) {
        const g = metals.find(m => m.symbol === 'gold' || m.name?.toLowerCase() === 'gold');
        goldUSDoz = g?.price ?? g?.bid ?? null;
      } else if (typeof metals === 'object') {
        goldUSDoz = metals.gold ?? metals.XAU ?? null;
      }
    }

    if (goldUSDoz && USDTRY) {
      goldTRYgram = (goldUSDoz / 31.1035) * USDTRY;
    }

    // Fallback: son bilinen yaklaşık değerler (API çalışmazsa)
    const fallback = {
      USDTRY: USDTRY ?? 40.5,
      EURTRY: EURTRY ?? 44.8,
      GBPTRY: GBPTRY ?? 52.1,
      goldUSDoz: goldUSDoz ?? 3200,
      goldTRYgram: goldTRYgram ?? (3200 / 31.1035) * (USDTRY ?? 40.5),
      isFallback: !USDTRY || !goldUSDoz,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(fallback);
  } catch (err) {
    console.error('doviz API error:', err);
    return NextResponse.json({
      USDTRY: 40.5,
      EURTRY: 44.8,
      GBPTRY: 52.1,
      goldUSDoz: 3200,
      goldTRYgram: (3200 / 31.1035) * 40.5,
      isFallback: true,
      fetchedAt: new Date().toISOString(),
      error: err.message,
    });
  }
}
