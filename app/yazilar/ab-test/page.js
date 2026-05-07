'use client';

import { useState, useEffect } from 'react';

function normalCDF(z) {
  const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);
  const t = 1 / (1 + p * z);
  const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-z*z);
  return 0.5 * (1 + sign * y);
}

function ABCalculator() {
  const [aVisitors, setAVisitors] = useState(1000);
  const [aConversions, setAConversions] = useState(50);
  const [bVisitors, setBVisitors] = useState(1000);
  const [bConversions, setBConversions] = useState(65);
  const [confidence, setConfidence] = useState(0.95);

  const pA = aVisitors > 0 ? aConversions / aVisitors : 0;
  const pB = bVisitors > 0 ? bConversions / bVisitors : 0;
  const lift = pA > 0 ? ((pB - pA) / pA * 100) : 0;
  const pPool = (aConversions + bConversions) / (aVisitors + bVisitors);
  const se = Math.sqrt(pPool * (1 - pPool) * (1/aVisitors + 1/bVisitors));
  const z = se > 0 ? (pB - pA) / se : 0;
  const pVal = 2 * (1 - normalCDF(Math.abs(z)));
  const alpha = 1 - confidence;
  const significant = pVal < alpha;
  const zConf = confidence === 0.99 ? 2.576 : confidence === 0.95 ? 1.96 : 1.645;
  const seCI = Math.sqrt(pA*(1-pA)/aVisitors + pB*(1-pB)/bVisitors);
  const ciLow = ((pB - pA) - zConf * seCI) * 100;
  const ciHigh = ((pB - pA) + zConf * seCI) * 100;

  const valid = aVisitors > 0 && bVisitors > 0 && aConversions <= aVisitors && bConversions <= bVisitors;

  const verdict = !valid ? null : significant
    ? (lift > 0
      ? `B varyantı istatistiksel olarak anlamlı şekilde daha iyi. %${lift.toFixed(1)} artış.`
      : `A kontrolü daha iyi. B varyantını kullanma.`)
    : 'Anlamlı fark yok. Daha fazla veri topla veya testi uzat.';

  const resultBg = !valid || !significant ? 'bg-gray-50' : lift > 0 ? 'bg-green-50' : 'bg-red-50';
  const resultText = !valid || !significant ? '' : lift > 0 ? 'text-green-800' : 'text-red-800';
  const resultLabel = !valid ? 'Geçerli değerler girin.' : significant ? (lift > 0 ? '✓ Anlamlı fark var' : '✗ Kontrol daha iyi') : '~ Anlamlı fark yok';

  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="card">
          <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-mute)' }}>Kontrol (A)</div>
          <div className="mb-3">
            <label className="text-xs block mb-1" style={{ color: 'var(--color-text-soft)' }}>Ziyaretçi sayısı</label>
            <input type="number" value={aVisitors} min="1"
              onChange={e => setAVisitors(parseInt(e.target.value)||0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="mb-3">
            <label className="text-xs block mb-1" style={{ color: 'var(--color-text-soft)' }}>Dönüşüm sayısı</label>
            <input type="number" value={aConversions} min="0"
              onChange={e => setAConversions(parseInt(e.target.value)||0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="text-sm" style={{ color: 'var(--color-text-soft)' }}>
            Oran: <span className="font-medium" style={{ color: 'var(--color-text)' }}>{(pA*100).toFixed(2)}%</span>
          </div>
        </div>

        <div className="card">
          <div className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-mute)' }}>Varyant (B)</div>
          <div className="mb-3">
            <label className="text-xs block mb-1" style={{ color: 'var(--color-text-soft)' }}>Ziyaretçi sayısı</label>
            <input type="number" value={bVisitors} min="1"
              onChange={e => setBVisitors(parseInt(e.target.value)||0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="mb-3">
            <label className="text-xs block mb-1" style={{ color: 'var(--color-text-soft)' }}>Dönüşüm sayısı</label>
            <input type="number" value={bConversions} min="0"
              onChange={e => setBConversions(parseInt(e.target.value)||0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="text-sm" style={{ color: 'var(--color-text-soft)' }}>
            Oran: <span className="font-medium" style={{ color: 'var(--color-text)' }}>{(pB*100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm whitespace-nowrap" style={{ color: 'var(--color-text-soft)' }}>Güven düzeyi</label>
        <select value={confidence} onChange={e => setConfidence(parseFloat(e.target.value))}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="0.90">%90</option>
          <option value="0.95">%95 (standart)</option>
          <option value="0.99">%99</option>
        </select>
      </div>

      {valid && (
        <>
          <div className={`${resultBg} rounded-lg p-4 mb-4`}>
            <div className={`font-medium mb-1 ${resultText}`}>{resultLabel}</div>
            <div className={`text-sm ${resultText}`}>{verdict}</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>p-değeri</div>
              <div className="text-2xl font-medium">{pVal < 0.001 ? '<0.001' : pVal.toFixed(3)}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>eşik: {alpha.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Göreli etki</div>
              <div className="text-2xl font-medium">{lift > 0 ? '+' : ''}{lift.toFixed(1)}%</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>B vs A</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>%{(confidence*100).toFixed(0)} güven aralığı</div>
              <div className="text-sm font-medium">[{ciLow.toFixed(1)}%, {ciHigh.toFixed(1)}%]</div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>fark aralığı</div>
            </div>
          </div>
        </>
      )}

      <p className="mt-4 p-3 bg-gray-50 rounded-lg text-sm leading-relaxed" style={{ color: 'var(--color-text-soft)' }}>
        <strong style={{ color: 'var(--color-text)' }}>Nasıl kullanılır:</strong> A grubu mevcut tasarımın (kontrol), B grubu test ettiğin değişikliğin (varyant) sonuçları. p-değeri alpha eşiğinden küçükse sonuç istatistiksel olarak anlamlıdır.
      </p>
    </div>
  );
}

export default function ABTestPage() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <span className="badge badge-guide inline-block mb-3">araç</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          A/B test anlamlılık hesaplayıcı
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>İki grup arasındaki farkın gerçek mi yoksa şans eseri mi olduğunu hesapla</p>

        <ABCalculator />

        <h2>p-değeri ne anlama gelir?</h2>
        <p>
          p-değeri, gruplar arasında <em>gerçekte hiç fark olmasa bile</em> bu kadar büyük
          bir fark gözlemleme olasılığını gösterir. p = 0.03 demek: &quot;eğer A ve B aynı
          olsaydı, bu sonucu görme ihtimalimiz %3&apos;tü&quot; demek.
        </p>

        <p>
          p &lt; 0.05 eşiği endüstri standardı. Ama bu keyfi bir sınır — Fisher&apos;ın
          1920&apos;lerdeki önerisi. %95 güven &quot;kesinlik&quot; değil, %5 yanılma payı kabul etmek.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            p &lt; 0.05 &quot;test başarılı&quot; demek değil. Örneklem küçükse güçlü etkiler bile
            anlamsız çıkabilir. Örneklem büyükse anlamsız farklar bile anlamlı görünebilir.
          </p>
        </blockquote>

        <h2>Kaç kişiyle test yapmalıyım?</h2>
        <p>
          Bu sorunun cevabı üç şeye bağlı: mevcut dönüşüm oranın, görmek istediğin minimum
          etki büyüklüğü (MDE) ve kabul ettiğin hata payları. Kaba kural:
        </p>

        <pre>{`# Basit sample size tahmini
from scipy import stats
import numpy as np

baseline = 0.05      # mevcut dönüşüm oranı %5
mde = 0.01           # minimum %1 artış görmek istiyoruz
alpha = 0.05         # %5 tip-1 hata
power = 0.80         # %80 güç

effect = mde / baseline
n = stats.norm.isf(alpha/2) + stats.norm.isf(1-power)
sample_size = int(2 * (n / effect)**2 * baseline * (1-baseline) / mde**2)
print(f"Her grup için gereken: ~{sample_size} kişi")`}</pre>

        <h2>Yaygın hatalar</h2>
        <ul>
          <li><strong>Peeking:</strong> Testi günlük kontrol edip erken durdurma. p-değeri anlık dalgalanır, sabırla bekle.</li>
          <li><strong>Çoklu test:</strong> 10 metrik test edersen biri şans eseri anlamlı çıkar. Birincil metriği önceden belirle.</li>
          <li><strong>Küçük örneklem:</strong> 50&apos;er kişiyle sonuç çıkmaz. Hesaplayıcıyı önceden çalıştır.</li>
          <li><strong>Mevsimsellik:</strong> Pazartesi-Cuma testi, hafta sonu davranışını temsil etmez. Tam hafta çalıştır.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki araç: <strong>sample size hesaplayıcı</strong> — testi başlatmadan önce
          kaç kişiye ihtiyacın olduğunu hesapla.
        </p>
      </article>
    </main>
  );
}
