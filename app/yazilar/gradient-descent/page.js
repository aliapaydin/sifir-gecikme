'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

function GradientDescentDemo() {
  const [step, setStep] = useState(0);
  const [x, setX] = useState(3.0);
  const [lr, setLr] = useState(0.05);
  const [running, setRunning] = useState(false);
  const [trail, setTrail] = useState([]);
  const [converged, setConverged] = useState(false);
  const [status, setStatus] = useState('Başlangıç noktası x = 3.00. Öğrenme hızını ayarlayıp "Bir adım at" butonuna bas.');
  const timerRef = useRef(null);
  const stateRef = useRef({ x: 3.0, step: 0, trail: [], converged: false });

  const W = 600, H = 280;
  const PAD_L = 30, PAD_R = 30, PAD_T = 25, PAD_B = 30;
  const X_MIN = -4, X_MAX = 4;
  const Y_MIN = -1, Y_MAX = 16;

  const lrValues = [0.01,0.02,0.03,0.05,0.08,0.1,0.12,0.15,0.18,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.7,0.9,1.05];

  const toSvgX = (v) => PAD_L + (v - X_MIN) / (X_MAX - X_MIN) * (W - PAD_L - PAD_R);
  const toSvgY = (v) => H - PAD_B - (v - Y_MIN) / (Y_MAX - Y_MIN) * (H - PAD_T - PAD_B);
  const f = (v) => v * v;
  const df = (v) => 2 * v;

  const curvePath = () => {
    let d = '';
    for (let i = 0; i <= 200; i++) {
      const xv = X_MIN + i * (X_MAX - X_MIN) / 200;
      const sx = toSvgX(xv), sy = toSvgY(f(xv));
      d += (i === 0 ? 'M' : 'L') + sx.toFixed(1) + ',' + sy.toFixed(1) + ' ';
    }
    return d;
  };

  const getStatus = (cx, cs, cc) => {
    if (cc) return 'Minimum bulundu! x ≈ 0, f(x) ≈ 0. Gradient descent başarıyla yakınsadı.';
    if (Math.abs(cx) > 10) return 'Iraksama! Öğrenme hızı çok büyük — top minimumdan uzaklaşıyor. Hızı düşür ve sıfırla.';
    const grad = df(cx);
    const sign = grad > 0 ? 'sola' : 'sağa';
    return `Adım ${cs}: x = ${cx.toFixed(3)}, gradient = ${grad.toFixed(3)}. Top ${sign} gidecek.`;
  };

  const doStep = useCallback(() => {
    const s = stateRef.current;
    if (Math.abs(s.x) > 15 || s.converged) {
      setRunning(false);
      return;
    }
    const newTrail = [...s.trail, s.x];
    const newX = s.x - lr * df(s.x);
    const newStep = s.step + 1;
    const newConverged = Math.abs(newX) < 0.001;
    stateRef.current = { x: newX, step: newStep, trail: newTrail, converged: newConverged };
    setX(newX);
    setStep(newStep);
    setTrail(newTrail);
    setConverged(newConverged);
    setStatus(getStatus(newX, newStep, newConverged));
  }, [lr]);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(doStep, 120);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running, doStep]);

  const reset = () => {
    clearInterval(timerRef.current);
    stateRef.current = { x: 3.0, step: 0, trail: [], converged: false };
    setX(3.0); setStep(0); setTrail([]); setConverged(false); setRunning(false);
    setStatus('Başlangıç noktası x = 3.00. Öğrenme hızını ayarlayıp "Bir adım at" butonuna bas.');
  };

  const ballX = toSvgX(x);
  const ballY = toSvgY(f(x));
  const grad = df(x);
  const tx1 = Math.max(X_MIN, x - 1.5);
  const tx2 = Math.min(X_MAX, x + 1.5);

  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Adım</div>
          <div className="text-2xl font-medium">{step}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Konum (x)</div>
          <div className="text-2xl font-medium">{x.toFixed(3)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Kayıp f(x)</div>
          <div className="text-2xl font-medium">{f(x).toFixed(4)}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm whitespace-nowrap" style={{ color: 'var(--color-text-soft)' }}>Öğrenme hızı (α)</label>
        <input type="range" min="1" max="19" defaultValue="4" className="flex-1"
          onChange={(e) => setLr(lrValues[parseInt(e.target.value) - 1])} />
        <span className="text-sm font-medium w-10 text-right">{lr.toFixed(2)}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
          <defs>
            <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#888780"/>
            </marker>
          </defs>
          <line x1="30" y1="250" x2="570" y2="250" stroke="#888780" strokeWidth="1" markerEnd="url(#arr2)"/>
          <line x1="300" y1="260" x2="300" y2="20" stroke="#888780" strokeWidth="1" markerEnd="url(#arr2)"/>
          <text x="575" y="254" fontSize="12" fill="#888780">x</text>
          <text x="304" y="18" fontSize="12" fill="#888780">f(x)</text>
          <path d={curvePath()} fill="none" stroke="#1D9E75" strokeWidth="2.5"/>
          {trail.slice(-30).map((tx, i, arr) => (
            <circle key={i} cx={toSvgX(tx)} cy={toSvgY(f(tx))} r="3"
              fill="#7F77DD" opacity={(i / arr.length * 0.5).toFixed(2)}/>
          ))}
          {step > 0 && (
            <line x1={toSvgX(tx1)} y1={toSvgY(f(x) + grad * (tx1 - x))}
              x2={toSvgX(tx2)} y2={toSvgY(f(x) + grad * (tx2 - x))}
              stroke="#E24B4A" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.7"/>
          )}
          <circle cx={ballX} cy={ballY} r="9" fill="#7F77DD" stroke="#26215C" strokeWidth="1.5"/>
          <text x={toSvgX(0)} y={toSvgY(-0.7)} fontSize="11" fill="#0F6E56" textAnchor="middle" fontStyle="italic">minimum</text>
        </svg>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        <button onClick={doStep} className="flex-1 min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Bir adım at</button>
        <button onClick={() => setRunning(!running)} className="flex-1 min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          {running ? 'Durdur' : 'Otomatik çalıştır'}
        </button>
        <button onClick={reset} className="flex-1 min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sıfırla</button>
      </div>

      <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed" style={{ color: 'var(--color-text-soft)' }}>
        {status}
      </p>
    </div>
  );
}

export default function GradientDescentPost() {
  return (
    <main className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <a href="/" className="font-serif text-lg font-medium" style={{ color: 'var(--color-text)' }}>Sıfır Gecikme</a>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
          <a href="/" style={{ color: 'var(--color-text)', fontWeight: 500 }}>Yazılar</a>
          <a href="#">Demolar</a>
          <a href="#">Araçlar</a>
          <a href="/hakkimda">Hakkımda</a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>

        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Gradient descent: top yuvarlama oyunu
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>2026 · 10 dakika okuma</p>

        <p>
          Karanlık bir vadiye düştüğünü hayal et. En alçak noktayı bulmak istiyorsun ama
          görüş sıfır. Elinden gelen tek şey şu: ayağının altındaki zeminin ne kadar eğimli
          olduğunu hissetmek. Eğime karşı yürü, tekrar kontrol et, tekrar yürü.
        </p>

        <p>
          İşte <strong>gradient descent</strong> tam olarak bu. Makine öğrenmesindeki tüm
          büyük modellerin — linear regression&apos;dan GPT&apos;ye kadar — parametrelerini
          öğrenmek için kullandığı temel yöntem.
        </p>

        <h2>Önce dene</h2>
        <p>
          Aşağıdaki demoda mor top bir parabolün üzerinde yuvarlanıyor. Öğrenme hızını
          ayarla, "Bir adım at" veya "Otomatik çalıştır" ile ne olduğunu izle.
        </p>

        <GradientDescentDemo />

        <h2>Ne oluyor aslında?</h2>
        <p>
          Her adımda şu hesap yapılıyor:
        </p>

        <pre>{`x_yeni = x_eski - α × f'(x_eski)

# f(x) = x²  →  f'(x) = 2x (türev = gradient)
# α = öğrenme hızı (learning rate)

# Örnek: x=3, α=0.1 ise
x_yeni = 3 - 0.1 × (2 × 3)
x_yeni = 3 - 0.6
x_yeni = 2.4  # minimuma yaklaştı`}</pre>

        <p>
          Türev bize o noktadaki eğimi söyler. Eğim pozitifse sol tarafa git (x azalt),
          negatifse sağ tarafa (x artır). Her seferinde biraz daha minimuma yaklaşırsın.
        </p>

        <h2>Öğrenme hızı neden bu kadar önemli?</h2>
        <p>
          Demoda gördüğün üzere:
        </p>
        <ul>
          <li><strong>Çok küçük α (0.01):</strong> Top minimuma ulaşır ama çok yavaş. Yüzlerce adım gerekir.</li>
          <li><strong>İdeal α (0.1-0.2):</strong> Düzgün iniş, hızlı yakınsama.</li>
          <li><strong>Çok büyük α (1.05):</strong> Top minimum etrafında zıplar, ıraksır. Model öğrenemez.</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Makine öğrenmesinde en çok ayarlanan hiperparametre learning rate&apos;tir.
            Doğru değeri bulmak hâlâ büyük ölçüde deneme yanılma işi.
          </p>
        </blockquote>

        <h2>Gerçek hayatta nasıl kullanılır?</h2>
        <p>
          Bizim örneğimizde tek bir parametre (x) ve basit bir kayıp fonksiyonu (x²) vardı.
          Gerçek bir sinir ağında milyarlarca parametre ve çok daha karmaşık bir kayıp
          fonksiyonu var. Ama temel fikir aynı: her parametreyi gradienti yönünde biraz
          güncelle, tekrarla.
        </p>

        <pre>{`# scikit-learn ile linear regression aslında
# gradient descent kullanır (SGD versiyonu)
from sklearn.linear_model import SGDRegressor

model = SGDRegressor(
    learning_rate='constant',
    eta0=0.01,       # α değeri
    max_iter=1000    # maksimum adım sayısı
)
model.fit(X_train, y_train)`}</pre>

        <h2>Varyantlar: SGD, Mini-batch, Adam</h2>
        <p>
          Klasik gradient descent tüm veriyi her adımda kullanır. Bu büyük veri setlerinde
          çok yavaş olur. O yüzden pratikte şu varyantlar kullanılır:
        </p>
        <ul>
          <li><strong>SGD (Stochastic):</strong> Her seferinde tek bir örnek kullanır. Gürültülü ama hızlı.</li>
          <li><strong>Mini-batch:</strong> 32, 64 veya 128 örneklik gruplarla günceller. En yaygın kullanılan.</li>
          <li><strong>Adam:</strong> Adaptif öğrenme hızı, modern derin öğrenmenin vazgeçilmezi.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>k-means kümeleme</strong>: gradient descent kullanmadan
          da öğrenme olur mu? Centroid&apos;ler nasıl yer değiştirir?
        </p>
      </article>
    </main>
  );
}
