'use client';

import { useState, useMemo } from 'react';

function normInvSF(p) {
  const a = [2.515517, 0.802853, 0.010328];
  const b = [1.432788, 0.189269, 0.001308];
  const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
  const num = ((a[2] * t + a[1]) * t + a[0]);
  const den = (((b[2] * t + b[1]) * t + b[0]) * t + 1);
  return (p < 0.5 ? -1 : 1) * (t - num / den);
}

function calcN(base, mde, power, alpha) {
  const p1 = base / 100;
  const p2 = p1 * (1 + mde / 100);
  const za = normInvSF(alpha / 2);
  const zb = normInvSF(1 - power);
  const p = (p1 + p2) / 2;
  const n = Math.pow(za * Math.sqrt(2 * p * (1 - p)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2) / Math.pow(p2 - p1, 2);
  return { n: Math.ceil(n), p2 };
}

function fmt(n) {
  return n >= 10000 ? Math.round(n / 100) * 100 : n >= 1000 ? Math.round(n / 10) * 10 : n;
}

function SampleSizeCalculator() {
  const [base, setBase] = useState(5);
  const [mde, setMde] = useState(20);
  const [power, setPower] = useState(0.80);
  const [alpha, setAlpha] = useState(0.05);
  const [dailyUsers, setDailyUsers] = useState(500);

  const { n, p2 } = useMemo(() => calcN(base, mde, power, alpha), [base, mde, power, alpha]);
  const fmtN = fmt(n);
  const fmtT = fmt(n * 2);
  const days = Math.ceil((fmtT) / dailyUsers);

  const warn = n > 100000
    ? 'Çok büyük örneklem gerekiyor. MDE değerini artır veya daha fazla trafik bekle.'
    : n < 100
    ? 'Çok küçük örneklem. MDE değeri gerçekçi mi? Küçük örneklemde sonuçlar güvenilmez.'
    : null;

  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs mb-2" style={{ color: 'var(--color-text-mute)' }}>Mevcut dönüşüm oranı</div>
          <div className="flex items-center gap-3">
            <input type="range" min="1" max="50" value={base} className="flex-1"
              onChange={e => setBase(parseInt(e.target.value))} />
            <span className="text-lg font-medium w-12 text-right">{base}%</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs mb-2" style={{ color: 'var(--color-text-mute)' }}>Minimum tespit edilebilir etki (MDE)</div>
          <div className="flex items-center gap-3">
            <input type="range" min="1" max="50" value={mde} className="flex-1"
              onChange={e => setMde(parseInt(e.target.value))} />
            <span className="text-lg font-medium w-12 text-right">{mde}%</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs mb-2" style={{ color: 'var(--color-text-mute)' }}>İstatistiksel güç (Power)</div>
          <select value={power} onChange={e => setPower(parseFloat(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="0.80">%80 (standart)</option>
            <option value="0.85">%85</option>
            <option value="0.90">%90 (güçlü)</option>
            <option value="0.95">%95 (çok güçlü)</option>
          </select>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs mb-2" style={{ color: 'var(--color-text-mute)' }}>Anlamlılık düzeyi (Alpha)</div>
          <select value={alpha} onChange={e => setAlpha(parseFloat(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="0.10">%10 (α = 0.10)</option>
            <option value="0.05">%5 (α = 0.05, standart)</option>
            <option value="0.01">%1 (α = 0.01, katı)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Her grup için</div>
          <div className="text-3xl font-medium" style={{ color: '#1D9E75' }}>{fmtN.toLocaleString('tr-TR')}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>kullanıcı</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Toplam</div>
          <div className="text-3xl font-medium" style={{ color: '#7F77DD' }}>{fmtT.toLocaleString('tr-TR')}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>kullanıcı</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Hedef oran</div>
          <div className="text-3xl font-medium" style={{ color: '#e8a04a' }}>{(p2 * 100).toFixed(1)}%</div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-mute)' }}>dönüşüm</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="text-xs mb-2" style={{ color: 'var(--color-text-mute)' }}>Günlük kullanıcı sayısı (test süresini tahmin et)</div>
        <div className="flex items-center gap-3">
          <input type="range" min="50" max="10000" step="50" value={dailyUsers} className="flex-1"
            onChange={e => setDailyUsers(parseInt(e.target.value))} />
          <span className="text-sm font-medium w-20 text-right">{dailyUsers.toLocaleString('tr-TR')}/gün</span>
        </div>
        <div className="mt-3 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          Tahmini test süresi: <span style={{ color: '#1D9E75' }}>{days} gün</span>
          {days > 30 && <span style={{ color: '#e8a04a' }}> — uzun, MDE&apos;yi artırmayı düşün</span>}
          {days <= 7 && <span style={{ color: '#1D9E75' }}> — kısa ve yönetilebilir</span>}
        </div>
      </div>

      {warn && (
        <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: '#FAEEDA', color: '#854F0B' }}>
          ⚠ {warn}
        </div>
      )}

      <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed" style={{ color: 'var(--color-text-soft)' }}>
        Mevcut <strong>{base}%</strong> dönüşüm oranında, en az <strong>{mde}%</strong> göreli iyileşmeyi
        ({base}% → {(p2 * 100).toFixed(1)}%) tespit etmek için her grupta <strong>{fmtN.toLocaleString('tr-TR')}</strong> kullanıcı gerekiyor.
        Toplam <strong>{fmtT.toLocaleString('tr-TR')}</strong> kullanıcı, günde {dailyUsers.toLocaleString('tr-TR')} kullanıcıyla yaklaşık <strong>{days} gün</strong> sürer.
      </p>
    </div>
  );
}

export default function SampleSizePage() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">araç</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Sample size hesaplayıcı
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          A/B testi başlatmadan önce kaç kullanıcıya ihtiyacın olduğunu hesapla
        </p>

        <SampleSizeCalculator />

        <h2>Bu sayılar nereden geliyor?</h2>
        <p>
          Örneklem büyüklüğü hesabı üç soruyu dengeler:
        </p>
        <ul>
          <li>
            <strong>Ne kadar küçük bir etkiyi tespit etmek istiyorsun?</strong> (MDE)
            MDE ne kadar küçükse, o etkiyi görmek için o kadar fazla kullanıcı gerekir.
            %1&apos;lik iyileşmeyi görmek %20&apos;lik iyileşmeyi görmekten çok daha zordur.
          </li>
          <li>
            <strong>Gerçek bir etki varsa onu ne sıklıkla yakalarsın?</strong> (Power / Güç)
            %80 güç: gerçek bir etki varsa %80 ihtimalle onu tespit edersin.
            Geri kalan %20&apos;de gözden kaçırırsın — Tip-2 hata.
          </li>
          <li>
            <strong>Gerçek etki yokken yanlış pozitif ne sıklıkla görürsün?</strong> (Alpha)
            α = 0.05: etki yokken %5 ihtimalle anlamlı sonuç görürsün — Tip-1 hata.
          </li>
        </ul>

        <pre>{`from scipy import stats
import numpy as np

def sample_size(baseline, mde, power=0.80, alpha=0.05):
    p1 = baseline
    p2 = p1 * (1 + mde)        # hedef dönüşüm oranı
    
    za = stats.norm.isf(alpha / 2)   # z-skoru (anlamlılık)
    zb = stats.norm.isf(1 - power)   # z-skoru (güç)
    
    p_pool = (p1 + p2) / 2
    
    n = (za * np.sqrt(2 * p_pool * (1 - p_pool)) +
         zb * np.sqrt(p1*(1-p1) + p2*(1-p2)))**2 / (p2 - p1)**2
    
    return int(np.ceil(n))

# Örnek: %5 baseline, %20 MDE
n = sample_size(baseline=0.05, mde=0.20)
print(f"Her grup için: {n} kullanıcı")
print(f"Toplam: {n*2} kullanıcı")`}</pre>

        <h2>MDE nasıl belirlenir?</h2>
        <p>
          MDE (Minimum Detectable Effect) en kritik parametre. Çok küçük seçersen
          test aylar sürer. Çok büyük seçersen önemli bir iyileşmeyi gözden kaçırırsın.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Pratik yaklaşım: o değişikliğin iş etkisini düşün. %5&apos;lik dönüşüm
            iyileşmesi sana ne kazandırır? Eğer cevap &quot;çok az&quot; ise, tespit etmeye
            değmez demektir. MDE&apos;yi iş açısından anlamlı en küçük etki olarak belirle.
          </p>
        </blockquote>

        <h2>Yaygın hatalar</h2>
        <ul>
          <li>
            <strong>Testi erken durdurmak:</strong> İlk anlamlı sonucu görünce durdurmak
            yanlış. Örneklem büyüklüğüne ulaşmadan durmak Tip-1 hata oranını şişirir.
          </li>
          <li>
            <strong>Sonra örneklem hesaplamak:</strong> Testi çalıştırdıktan sonra
            &quot;yeterince büyük müydü?&quot; diye sormak güvenilmez. Önce hesapla, sonra başlat.
          </li>
          <li>
            <strong>Çok fazla metrik:</strong> Her metrik ayrı bir test. 10 metrik
            izlersen biri şans eseri anlamlı çıkar. Birincil metriği önceden belirle.
          </li>
          <li>
            <strong>Mevsimselliği yok saymak:</strong> Pazartesi-Cuma testi hafta sonu
            davranışını temsil etmez. En az bir tam hafta, tercihen iki hafta çalıştır.
          </li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Test sonuçların elindeyse{' '}
          <a href="/yazilar/ab-test">A/B test anlamlılık hesaplayıcımızı</a>{' '}
          kullanarak p-değeri ve güven aralığını hesaplayabilirsin.
        </p>
      </article>
    </main>
  );
}
