'use client';

import { useState, useEffect, useCallback } from 'react';

const W = 600, H = 320, PAD = 40;
const toSvgX = x => PAD + (x + 1) / 2 * (W - 2 * PAD);
const toSvgY = y => H / 2 - y * (H / 2 - PAD);
const trueFn = x => Math.sin(2 * x) + 0.3 * x;
function noise(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }

const trainX = Array.from({ length: 16 }, (_, i) => -1 + i * 2 / 15);
const testX  = Array.from({ length: 10 }, (_, i) => -0.9 + i * 1.8 / 9);
const trainY = trainX.map((x, i) => trueFn(x) + (noise(i * 7.3) - 0.5) * 0.6);
const testY  = testX.map((x, i)  => trueFn(x) + (noise(i * 13.7 + 100) - 0.5) * 0.6);

function polyFit(xs, ys, deg) {
  const m = deg + 1;
  const AtA = Array.from({ length: m }, (_, i) =>
    Array.from({ length: m }, (_, j) => xs.reduce((s, x) => s + Math.pow(x, i) * Math.pow(x, j), 0))
  );
  const Aty = Array.from({ length: m }, (_, i) => xs.reduce((s, x, k) => s + Math.pow(x, i) * ys[k], 0));
  const aug = AtA.map((row, i) => [...row, Aty[i]]);
  for (let i = 0; i < m; i++) {
    let maxRow = i;
    for (let k = i + 1; k < m; k++) if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
    [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
    if (Math.abs(aug[i][i]) < 1e-12) continue;
    for (let k = i + 1; k < m; k++) {
      const f = aug[k][i] / aug[i][i];
      for (let j = i; j <= m; j++) aug[k][j] -= f * aug[i][j];
    }
  }
  const c = new Array(m).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    c[i] = aug[i][m];
    for (let j = i + 1; j < m; j++) c[i] -= aug[i][j] * c[j];
    c[i] /= aug[i][i] || 1;
  }
  return x => c.reduce((s, ci, j) => s + ci * Math.pow(x, j), 0);
}

function mse(xs, ys, fn) { return xs.reduce((s, x, i) => s + (fn(x) - ys[i]) ** 2, 0) / xs.length; }

const XS = Array.from({ length: 200 }, (_, i) => -1 + i * 2 / 199);

function BiasVarianceDemo() {
  const [degree, setDegree] = useState(1);

  const fn = polyFit(trainX, trainY, degree);
  const trainErr = mse(trainX, trainY, fn);
  const testErr  = mse(testX, testY, fn);

  const truePath = XS.map((x, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(trueFn(x)).toFixed(1)}`).join(' ');
  const fitPath  = XS.map((x, i) => {
    const y = Math.max(-3, Math.min(3, fn(x)));
    return `${i === 0 ? 'M' : 'L'}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`;
  }).join(' ');

  let statusText, statusColor, explain;
  if (degree <= 1) {
    statusText = 'Underfitting'; statusColor = '#e8a04a';
    explain = `Derece ${degree}: Model çok basit. Hem train hem test hatası yüksek — yüksek bias. Gerçek fonksiyonun karmaşıklığını yakalayamıyor.`;
  } else if (degree <= 4) {
    statusText = '✓ İyi denge'; statusColor = '#1D9E75';
    explain = `Derece ${degree}: Altın bölge. Train ve test hatası birbirine yakın ve düşük. Ne ezberliyor ne de basitleştiriyor.`;
  } else if (degree <= 7) {
    statusText = 'Overfitting başlıyor'; statusColor = '#e8a04a';
    explain = `Derece ${degree}: Model gürültüyü de öğrenmeye başlıyor. Train hatası düşerken test hatası yükseliyor — yüksek varyans.`;
  } else {
    statusText = 'Overfitting'; statusColor = '#E24B4A';
    explain = `Derece ${degree}: Model veriyi ezberledi. Train hatası sıfıra yakın ama test hatası patladı. Yeni veriye genelleme yapamıyor.`;
  }

  return (
    <div className="my-8">
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm whitespace-nowrap" style={{ color: 'var(--color-text-soft)' }}>Polinom derecesi</label>
        <input type="range" min="1" max="12" value={degree} className="flex-1"
          onChange={e => setDegree(parseInt(e.target.value))} />
        <span className="text-xl font-semibold w-6 text-right">{degree}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Train Hatası</div>
          <div className="text-2xl font-semibold" style={{ color: '#1D9E75' }}>{trainErr.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Test Hatası</div>
          <div className="text-2xl font-semibold" style={{ color: '#E24B4A' }}>{testErr.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Durum</div>
          <div className="text-sm font-semibold mt-1" style={{ color: statusColor }}>{statusText}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
          <defs>
            <pattern id="bv-grid2" width="60" height="40" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#e8e2d5" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#bv-grid2)"/>
          <path d={truePath} fill="none" stroke="#ccc" strokeWidth="1.5" strokeDasharray="6 4"/>
          <path d={fitPath}  fill="none" stroke="#7F77DD" strokeWidth="2.5"/>
          {trainX.map((x, i) => (
            <circle key={`tr${i}`} cx={toSvgX(x)} cy={toSvgY(trainY[i])} r="4" fill="#1D9E75" opacity="0.8"/>
          ))}
          {testX.map((x, i) => (
            <circle key={`te${i}`} cx={toSvgX(x)} cy={toSvgY(testY[i])} r="4" fill="none" stroke="#E24B4A" strokeWidth="2"/>
          ))}
          <text x="12" y="18" fontSize="11" fill="#aaa">── gerçek fonksiyon</text>
          <circle cx="12" cy="30" r="4" fill="#1D9E75"/>
          <text x="22" y="34" fontSize="11" fill="#1D9E75">train</text>
          <circle cx="70" cy="30" r="4" fill="none" stroke="#E24B4A" strokeWidth="2"/>
          <text x="80" y="34" fontSize="11" fill="#E24B4A">test</text>
          <path d="M120,27 L165,27" stroke="#7F77DD" strokeWidth="2.5"/>
          <text x="170" y="31" fontSize="11" fill="#7F77DD">model</text>
        </svg>
      </div>

      <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed" style={{ color: 'var(--color-text-soft)' }}>
        {explain}
      </p>
    </div>
  );
}

export default function BiasVariancePost() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Bias-variance trade-off: ezber mi, genelleme mi?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>2026 · 10 dakika okuma</p>

        <p>
          Modelini eğitim verisinde test ediyorsun, %99 doğruluk. Harika. Sonra
          gerçek veriye bakıyorsun — %60. Ne oldu?
        </p>
        <p>
          Model eğitim verisini <strong>ezberledi</strong>. Öğrenmedi, ezberledi.
          Bu overfitting. Ve tam tersi de var: model çok basit, hiçbir şeyi
          yakalayamıyor — underfitting. İkisi arasındaki denge bias-variance
          trade-off&apos;tur.
        </p>

        <h2>Önce dene</h2>
        <p>
          Polinom derecesini kaydır. Yeşil noktalar train verisi, kırmızı
          halkalar test verisi. Mor eğri modelinin öğrendikleri.
          Kesik gri çizgi ise gerçek fonksiyon — modelin bulmaya çalıştığı şey.
        </p>

        <BiasVarianceDemo />

        <h2>Bias nedir, variance nedir?</h2>
        <ul>
          <li>
            <strong>Bias (önyargı):</strong> Modelin gerçek fonksiyondan
            sistematik sapması. Çok basit model — yüksek bias, underfitting.
            &quot;Model yanlı&quot; demek değil, &quot;model yetersiz karmaşıklıkta&quot; demek.
          </li>
          <li>
            <strong>Variance (varyans):</strong> Modelin farklı veri setlerine
            ne kadar duyarlı olduğu. Çok karmaşık model — yüksek variance,
            overfitting. Gürültüyü de öğreniyor, genelleyemiyor.
          </li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Bias azaldıkça variance artar, variance azaldıkça bias artar.
            İkisini aynı anda minimize edemezsin — bu trade-off&apos;tur.
            Hedef: her ikisinin toplamını minimize etmek.
          </p>
        </blockquote>

        <h2>Pratikte nasıl tanırsın?</h2>

        <pre>{`from sklearn.model_selection import learning_curve
import numpy as np
import matplotlib.pyplot as plt

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y,
    train_sizes=np.linspace(0.1, 1.0, 10),
    cv=5, scoring='neg_mean_squared_error'
)

train_err = -train_scores.mean(axis=1)
val_err   = -val_scores.mean(axis=1)

plt.plot(train_sizes, train_err, label='Train hatası')
plt.plot(train_sizes, val_err,   label='Validation hatası')
plt.xlabel('Eğitim örnek sayısı')
plt.ylabel('MSE')
plt.legend()
plt.show()

# Underfitting: her iki hata da yüksek ve birbirine yakın
# Overfitting:  train hatası düşük, val hatası çok yüksek
# İyi model:    her ikisi de düşük ve birbirine yakın`}</pre>

        <h2>Çözümler</h2>
        <ul>
          <li>
            <strong>Underfitting için:</strong> Daha karmaşık model seç,
            yeni özellikler ekle (feature engineering), regularizasyonu azalt.
          </li>
          <li>
            <strong>Overfitting için:</strong> Daha fazla veri topla,
            regularizasyon ekle (L1/L2), dropout kullan (derin öğrenmede),
            modeli basitleştir, cross-validation uygula.
          </li>
        </ul>

        <pre>{`from sklearn.linear_model import Ridge, Lasso
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline

# Yüksek dereceli polinom + Ridge regularizasyon
# Overfitting'i kontrol altında tutar
model = Pipeline([
    ('poly', PolynomialFeatures(degree=8)),
    ('ridge', Ridge(alpha=1.0))  # alpha arttıkça regularizasyon güçlenir
])

model.fit(X_train, y_train)
print(f"Train R²: {model.score(X_train, y_train):.3f}")
print(f"Test  R²: {model.score(X_test, y_test):.3f}")`}</pre>

        <h2>Cross-validation: overfitting&apos;i yakalamak için</h2>
        <p>
          Test setini bir kez kullanırsın ve model ona göre ayarlanmaya başlar.
          Cross-validation, veriyi birden fazla parçaya bölerek daha güvenilir
          bir performans tahmini verir.
        </p>

        <pre>{`from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5, scoring='r2')
print(f"CV skorları: {scores}")
print(f"Ortalama: {scores.mean():.3f} ± {scores.std():.3f}")

# Düşük ortalama → underfitting
# Yüksek std      → overfitting (kararsız model)
# İdeal: yüksek ortalama, düşük std`}</pre>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>zaman serisi analizi</strong>: trend,
          mevsimsellik ve Python&apos;da Prophet ile basit tahmin.
        </p>
      </article>
    </main>
  );
}
