'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Soru Havuzu ─────────────────────────────────────────────────────────────

const HAVUZ = {
  kolay: [
    { soru: "Python'da bir listenin eleman sayısını veren fonksiyon?", secenekler: ['len()', 'count()', 'size()', 'length()'], dogru: 0 },
    { soru: 'Veri görselleştirme için kullanılan Python kütüphanesi hangisidir?', secenekler: ['NumPy', 'Pandas', 'Matplotlib', 'Requests'], dogru: 2 },
    { soru: "SQL'de tüm sütunları getirmek için hangi sembol kullanılır?", secenekler: ['#', '%', '@', '*'], dogru: 3 },
    { soru: "CSV açılımı nedir?", secenekler: ['Comma Separated Values', 'Computer Stored Variables', 'Coded Sequential Values', 'Column Sorted Values'], dogru: 0 },
    { soru: "Pandas kütüphanesi öncelikle ne için kullanılır?", secenekler: ['Derin öğrenme', 'Web geliştirme', 'Veri manipülasyonu ve analizi', 'Şifreleme'], dogru: 2 },
    { soru: "Veri setindeki en sık tekrar eden değere ne denir?", secenekler: ['Medyan', 'Ortalama', 'Varyans', 'Mod'], dogru: 3 },
    { soru: "Python'da sözlük (dictionary) tanımlamak için hangi parantez kullanılır?", secenekler: ['[]', '()', '{}', '<>'], dogru: 2 },
    { soru: "Bir veri setinin ortanca değerine ne denir?", secenekler: ['Ortalama', 'Mod', 'Medyan', 'Standart sapma'], dogru: 2 },
    { soru: "Makine öğrenmesinde etiketli veriyle yapılan öğrenme türü?", secenekler: ['Denetimsiz', 'Denetimli', 'Pekiştirmeli', 'Hibrit'], dogru: 1 },
    { soru: "SQL'de verileri büyükten küçüğe sıralamak için hangi komut kullanılır?", secenekler: ['ORDER BY ASC', 'ORDER BY DESC', 'SORT BY MAX', 'FILTER BY'], dogru: 1 },
    { soru: "R² (R-kare) skoru 1'e ne kadar yakınsa model o kadar…", secenekler: ['Yavaş çalışır', 'Veriyi iyi açıklar', 'Overfitting yapar', 'Büyük bir modeldir'], dogru: 1 },
    { soru: "Python'da bir sayıyı string'e çevirmek için hangi fonksiyon kullanılır?", secenekler: ['int()', 'float()', 'str()', 'bool()'], dogru: 2 },
    { soru: "Veritabanında PRIMARY KEY ne işe yarar?", secenekler: ['Veriyi şifreler', 'Her satırı benzersiz tanımlar', 'Tabloları birleştirir', 'Veriyi sıralar'], dogru: 1 },
    { soru: "İki sayısal değişken arasındaki ilişkiyi en iyi hangi grafik gösterir?", secenekler: ['Pasta grafiği', 'Bar grafiği', 'Scatter (saçılım) grafiği', 'Histogram'], dogru: 2 },
    { soru: "Python'da `range(0, 10, 2)` kaç eleman üretir?", secenekler: ['4', '5', '6', '10'], dogru: 1 },
    { soru: "Aşağıdakilerden hangisi bir makine öğrenmesi algoritması değildir?", secenekler: ['Karar Ağacı', 'K-Means', 'HTTP', 'Lojistik Regresyon'], dogru: 2 },
  ],

  ortaKolay: [
    { soru: "Pandas'ta eksik değerleri kontrol eden metod hangisidir?", secenekler: ['.isnull()', '.isempty()', '.isnan()', '.missing()'], dogru: 0 },
    { soru: "SQL'de sadece eşleşen satırları getiren JOIN türü hangisidir?", secenekler: ['LEFT JOIN', 'FULL OUTER JOIN', 'INNER JOIN', 'CROSS JOIN'], dogru: 2 },
    { soru: "Overfitting'i azaltmak için kullanılan tekniklerden biri hangisidir?", secenekler: ['Daha büyük model', 'Regularization', 'Daha az veri kullanma', 'Öğrenme hızını artırma'], dogru: 1 },
    { soru: "Sınıflandırma problemlerinde kullanılan metrik hangisidir?", secenekler: ['MAE', 'RMSE', 'Accuracy (Doğruluk)', 'R²'], dogru: 2 },
    { soru: "Train-test split'te test seti genellikle ne kadardır?", secenekler: ['%5', '%20-30', '%60', '%80'], dogru: 1 },
    { soru: "K-Means algoritması hangi problemi çözer?", secenekler: ['Sınıflandırma', 'Regresyon', 'Kümeleme', 'Anomali tespiti'], dogru: 2 },
    { soru: "Lojistik Regresyon hangi problem için kullanılır?", secenekler: ['Regresyon', 'Sınıflandırma', 'Kümeleme', 'Boyut indirgeme'], dogru: 1 },
    { soru: "Pandas'ta DataFrame sütun isimlerini görmek için?", secenekler: ['.columns', '.headers', '.names', '.fields'], dogru: 0 },
    { soru: "SQL'de gruplama sonrası filtre için hangi komut kullanılır?", secenekler: ['WHERE', 'HAVING', 'FILTER', 'AND'], dogru: 1 },
    { soru: "Regresyon problemlerinde kullanılan hata metriği hangisidir?", seceneklers: ['Accuracy', 'Precision', 'MSE (Mean Squared Error)', 'F1 Score'], secenekler: ['Accuracy', 'Precision', 'MSE', 'F1 Score'], dogru: 2 },
    { soru: "Feature Engineering ne anlama gelir?", secenekler: ['Model seçimi', 'Hiperparametre ayarı', 'Yeni anlamlı özellikler türetme', 'Veri silme'], dogru: 2 },
    { soru: "Normal dağılımda ortalama, medyan ve modun ilişkisi nedir?", secenekler: ['Ortalama > Medyan > Mod', 'Mod > Medyan > Ortalama', 'Üçü birbirine eşittir', 'Ortalama her zaman en büyük'], dogru: 2 },
    { soru: "Confusion matrix'te 'True Positive' ne anlama gelir?", secenekler: ['Yanlış tahmin edilmiş pozitif', 'Doğru tahmin edilmiş pozitif', 'Yanlış tahmin edilmiş negatif', 'Doğru tahmin edilmiş negatif'], dogru: 1 },
    { soru: "Pandas'ta bir CSV dosyasını okumak için hangi metod kullanılır?", secenekler: ['pd.load_csv()', 'pd.read_csv()', 'pd.open_csv()', 'pd.import_csv()'], dogru: 1 },
    { soru: "Veri standardizasyonunda hangi dönüşüm kullanılır?", secenekler: ['(x - min) / (max - min)', '(x - ortalama) / std', 'x / max', 'x * std'], dogru: 1 },
    { soru: "SQL'de iki tabloyu birleştiren komut hangisidir?", secenekler: ['MERGE', 'COMBINE', 'JOIN', 'CONNECT'], dogru: 2 },
  ],

  ortaZor: [
    { soru: "Pearson korelasyon katsayısı −1 değeri ne anlama gelir?", secenekler: ['İki değişken bağımsızdır', 'Mükemmel pozitif doğrusal ilişki', 'Mükemmel negatif doğrusal ilişki', 'Zayıf ilişki'], dogru: 2 },
    { soru: "Gradient Descent'te öğrenme hızı çok büyük olursa ne olur?", secenekler: ['Yavaş öğrenir', 'Iraksayabilir, minimum bulamaz', 'Model aşırı öğrenir', 'Model hiç öğrenemez'], dogru: 1 },
    { soru: "Random Forest'ta hangi ensemble yöntemi kullanılır?", secenekler: ['Boosting', 'Bagging', 'Stacking', 'Pruning'], dogru: 1 },
    { soru: "Confusion matrix'te 'Recall' (Duyarlılık) nasıl hesaplanır?", secenekler: ['TP / (TP + FP)', 'TP / (TP + FN)', 'TN / (TN + FP)', '(TP + TN) / Toplam'], dogru: 1 },
    { soru: "PCA (Principal Component Analysis) neden kullanılır?", secenekler: ['Sınıflandırma için', 'Regresyon için', 'Boyut indirgeme için', 'Kümeleme için'], dogru: 2 },
    { soru: "L1 regularization (Lasso) neyi özelleştirir?", secenekler: ['Ağırlıkları küçültür', 'Bazı ağırlıkları tam sıfırlar (sparse model)', 'Dropout uygular', 'Batch normalizasyonu yapar'], dogru: 1 },
    { soru: "'p-value < 0.05' istatistiksel olarak ne anlama gelir?", secenekler: ['Hipotez kesinlikle doğrudur', 'H₀ reddedilir, güçlü kanıt var', 'Veri yetersizdir', 'Model hatalıdır'], dogru: 1 },
    { soru: "Cross-validation neden kullanılır?", secenekler: ['Modeli hızlandırmak için', 'Daha güvenilir genelleme tahmini için', 'Veriyi temizlemek için', 'Hiperparametre seçmek için'], dogru: 1 },
    { soru: "Decision Tree'de 'Gini impurity' neyi ölçer?", secenekler: ['Ağaç derinliğini', 'Düğümdeki sınıf karışıklığını', 'Özellik önem skorunu', 'Hata oranını'], dogru: 1 },
    { soru: "Sinir ağında backpropagation ne işe yarar?", secenekler: ['Veriyi hazırlar', 'Ağırlıkları günceller (gradyan ile)', 'Model seçimi yapar', 'Veriyi normalleştirir'], dogru: 1 },
    { soru: "SMOTE hangi problemi çözmek için kullanılır?", secenekler: ['Veri temizleme', 'Sınıf dengesizliği', 'Boyut indirgeme', 'Özellik seçimi'], dogru: 1 },
    { soru: "Pandas'ta groupby sonrası birden fazla istatistik almak için hangi metod kullanılır?", secenekler: ['.apply()', '.agg()', '.transform()', '.pivot()'], dogru: 1 },
  ],

  zor: [
    { soru: "Bias-Variance Tradeoff'ta yüksek bias + düşük variance hangi soruna işaret eder?", secenekler: ['Overfitting', 'Underfitting', 'Data Leakage', 'Multicollinearity'], dogru: 1 },
    { soru: "Hem AR hem MA bileşenlerini birleştiren zaman serisi modeli hangisidir?", secenekler: ['ARCH', 'ARMA', 'GARCH', 'VAR'], dogru: 1 },
    { soru: "Softmax fonksiyonu çıktısı her zaman hangi koşulu sağlar?", secenekler: ['Tüm değerler negatif', 'Tüm değerlerin toplamı 1\'e eşit', 'En büyük değer 0', 'Tüm değerler 0-0.5 arasında'], dogru: 1 },
    { soru: "Kullback-Leibler (KL) divergence ne ölçer?", secenekler: ['İki model arasındaki hız farkını', 'İki olasılık dağılımı arasındaki farkı', 'Model doğruluğunu', 'Korelasyonu'], dogru: 1 },
    { soru: "Transformer mimarisindeki 'self-attention' mekanizması ne işe yarar?", secenekler: ['Hesaplamayı hızlandırır', 'Giriş dizisinin farklı konumları arasındaki ilişkiyi öğrenir', 'Boyut indirgeme yapar', 'Veriyi normalleştirir'], dogru: 1 },
    { soru: "Stochastic Gradient Descent (SGD) normal Gradient Descent'ten nasıl ayrılır?", secenekler: ['Daha yavaş çalışır', 'Her adımda tüm veri yerine tek örnek veya mini-batch kullanır', 'Daha kesin sonuç verir', 'Sadece konveks fonksiyonlarda çalışır'], dogru: 1 },
    { soru: "AUC-ROC eğrisinde AUC = 0.5 ne anlama gelir?", secenekler: ['Mükemmel model', 'Rastgele tahminle eşdeğer model', 'En kötü model', 'Aşırı öğrenme var'], dogru: 1 },
    { soru: "Vanishing gradient problemi neden ortaya çıkar?", secenekler: ['Az katmanlı ağlarda', 'Derin ağlarda aktivasyon gradyanları çarpım yoluyla sıfıra yaklaşır', 'Küçük veri setlerinde', 'Büyük öğrenme hızında'], dogru: 1 },
    { soru: "Batch Normalization ne için kullanılır?", secenekler: ['Veri artırımı için', 'Her katman girdisini normalleştirerek eğitimi stabilize eder', 'Model boyutunu küçültür', 'Öğrenme hızını sabit tutar'], dogru: 1 },
    { soru: "LSTM (Long Short-Term Memory) hangi problemi çözer?", secenekler: ['Görüntü sınıflandırma', 'Normal MLP\'deki uzun vadeli bağımlılık kaybı (vanishing gradient)', 'Veri temizleme', 'Kümeleme'], dogru: 1 },
  ],
};

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

function soruSec() {
  return [
    ...shuffle(HAVUZ.kolay).slice(0, 3),
    ...shuffle(HAVUZ.ortaKolay).slice(0, 3),
    ...shuffle(HAVUZ.ortaZor).slice(0, 2),
    ...shuffle(HAVUZ.zor).slice(0, 2),
  ];
}

const ODULLER    = [5000, 10000, 25000, 50000, 100000, 250000, 500000, 750000, 1000000, 2000000];
const GUVENCELER = [4, 7];
const ETIKET     = ['A', 'B', 'C', 'D'];
const MAX_SURE   = 15;

const TELEFON_KISILER = [
  { isim: 'Ayşe Kaya',    rol: 'Veri Bilimci',      avatar: '👩‍💻', renk: '#9F7AEA' },
  { isim: 'Mehmet Demir', rol: 'AI Araştırmacısı',  avatar: '👨‍🔬', renk: '#68D391' },
  { isim: 'Selin Yılmaz', rol: 'İstatistik Prof.',  avatar: '👩‍🏫', renk: '#F6AD55' },
];

const formatPara = n => n.toLocaleString('tr-TR') + ' ₺';

// ─── Ses ─────────────────────────────────────────────────────────────────────

function useSes() {
  const ctxRef  = useRef(null);
  const ambiRef = useRef([]);
  const getCtx  = () => {
    if (!ctxRef.current && typeof window !== 'undefined')
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return ctxRef.current;
  };
  const playTick = useCallback((acil = false) => {
    const ctx = getCtx(); if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = acil ? 1400 : 900;
    g.gain.setValueAtTime(acil ? 0.18 : 0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    o.start(); o.stop(ctx.currentTime + 0.07);
  }, []);
  const playDogru = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = 'sine';
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t); o.stop(t + 0.35);
    });
  }, []);
  const playYanlis = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    [400, 350, 300].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = 'sawtooth';
      const t = ctx.currentTime + i * 0.15;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.start(t); o.stop(t + 0.3);
    });
  }, []);
  const playTelefonZili = useCallback((ms = 2800) => {
    const ctx = getCtx(); if (!ctx) return;
    for (let i = 0; i < Math.floor(ms / 600); i++)
      [480, 440].forEach((f, j) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f;
        const t = ctx.currentTime + i * 0.6 + j * 0.1;
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        o.start(t); o.stop(t + 0.1);
      });
  }, []);
  const startAmbi = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const nodes = [];
    [[55, 0.04], [110, 0.02]].forEach(([f, v]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = 0.3; lg.gain.value = f * 0.01;
      lfo.connect(lg); lg.connect(o.frequency);
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = 'sine'; g.gain.value = v;
      o.start(); lfo.start();
      nodes.push(o, g, lfo, lg);
    });
    ambiRef.current = nodes;
  }, []);
  const stopAmbi = useCallback(() => {
    ambiRef.current.forEach(n => { try { n.stop?.(); } catch {} });
    ambiRef.current = [];
  }, []);
  return { playTick, playDogru, playYanlis, playTelefonZili, startAmbi, stopAmbi };
}

// ─── Bileşenler ───────────────────────────────────────────────────────────────

function TimerHalka({ sure }) {
  const R = 26, C = 2 * Math.PI * R;
  const pct  = sure / MAX_SURE;
  const renk = sure <= 4 ? '#EF4444' : sure <= 8 ? '#F59E0B' : '#1D9E75';
  return (
    <svg width="70" height="70" viewBox="0 0 70 70" style={{ filter: `drop-shadow(0 0 6px ${renk}80)` }}>
      <circle cx="35" cy="35" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
      <circle cx="35" cy="35" r={R} fill="none" stroke={renk} strokeWidth="5"
        strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '35px 35px', transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
      />
      <text x="35" y="40" textAnchor="middle" fontSize="18" fontWeight="700" fill={renk}>{sure}</text>
    </svg>
  );
}

function ParaMerdiveni({ soruIdx }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '3px' }}>
      {ODULLER.map((para, i) => {
        const aktif   = i === soruIdx;
        const gecildi = i < soruIdx;
        const guvence = GUVENCELER.includes(i + 1);
        return (
          <div key={i} style={{
            padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: aktif ? 700 : 500,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px',
            background: aktif ? 'rgba(251,191,36,0.2)' : gecildi ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.04)',
            border: aktif ? '1px solid rgba(251,191,36,0.6)' : guvence ? '1px solid rgba(29,158,117,0.4)' : '1px solid rgba(255,255,255,0.06)',
            color: aktif ? '#FCD34D' : gecildi ? '#6EE7B7' : guvence ? '#86EFAC' : 'rgba(255,255,255,0.55)',
            boxShadow: aktif ? '0 0 12px rgba(251,191,36,0.3)' : 'none',
            transition: 'all 0.3s',
          }}>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>{i + 1}</span>
            <span>{formatPara(para)}</span>
            {guvence && <span style={{ fontSize: '9px' }}>★</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Sunucu Silueti (düzeltilmiş) ────────────────────────────────────────────

function SunucuSiluet() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 140 360" style={{ width: '100%', maxWidth: '100px', opacity: 0.22, filter: 'blur(0.5px)' }}>
        {/* Işık halesi */}
        <ellipse cx="70" cy="320" rx="55" ry="14" fill="rgba(200,160,255,0.25)" />
        {/* Ayaklar */}
        <path d="M47 255 Q44 310 38 340 Q50 345 56 340 Q56 305 60 265 Z" fill="white" />
        <path d="M93 255 Q96 310 102 340 Q90 345 84 340 Q84 305 80 265 Z" fill="white" />
        {/* Gövde - takım elbise */}
        <path d="M28 255 Q24 180 30 120 Q42 105 55 115 L60 100 L70 120 L80 100 L85 115 Q98 105 110 120 Q116 180 112 255 Z" fill="white" />
        {/* Kravat */}
        <path d="M63 115 L70 130 L77 115 L74 220 L66 220 Z" fill="rgba(180,140,255,0.6)" />
        {/* Sol kol - doğal sarkıyor */}
        <path d="M30 125 Q14 165 18 205 Q22 215 30 212 Q28 178 38 145 Z" fill="white" />
        {/* Sağ kol - mikrofon tutuyor */}
        <path d="M110 125 Q126 155 122 195 Q118 205 110 200 Q112 168 102 140 Z" fill="white" />
        {/* Mikrofon sapı */}
        <rect x="116" y="188" width="10" height="34" rx="5" fill="rgba(255,255,255,0.75)" />
        {/* Mikrofon kapsülü */}
        <ellipse cx="121" cy="186" rx="10" ry="13" fill="rgba(255,255,255,0.6)" />
        <ellipse cx="121" cy="186" rx="6" ry="8" fill="rgba(200,160,255,0.5)" />
        {/* Boyun */}
        <path d="M62 72 L78 72 L76 95 L64 95 Z" fill="white" />
        {/* Baş */}
        <ellipse cx="70" cy="50" rx="26" ry="30" fill="white" />
        {/* Saç */}
        <path d="M44 38 Q55 16 70 14 Q85 16 96 38 Q88 28 70 26 Q52 28 44 38 Z" fill="rgba(180,140,80,0.6)" />
        {/* Yüz detayları - gözler */}
        <ellipse cx="62" cy="48" rx="3.5" ry="4" fill="rgba(0,0,0,0.4)" />
        <ellipse cx="78" cy="48" rx="3.5" ry="4" fill="rgba(0,0,0,0.4)" />
        {/* Ağız - gülümseme */}
        <path d="M63 62 Q70 68 77 62" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" />
        {/* Yaka - takım elbise */}
        <path d="M55 115 L60 100 L70 120 L63 115 Z" fill="rgba(220,220,255,0.2)" />
        <path d="M85 115 L80 100 L70 120 L77 115 Z" fill="rgba(220,220,255,0.2)" />
      </svg>
      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', marginTop: '4px', letterSpacing: '0.1em' }}>SUNUCU</div>
    </div>
  );
}

// ─── Telefon Jokeri Modalı ────────────────────────────────────────────────────

function TelefonModal({ soru, onKapat }) {
  const [faz, setFaz] = useState('araniyor');
  const [metin, setMetin] = useState('');
  const kisi       = useRef(TELEFON_KISILER[Math.floor(Math.random() * TELEFON_KISILER.length)]).current;
  const dogru70    = useRef(Math.random() < 0.7).current;
  const onerilecek = useRef(
    dogru70 ? soru.dogru
      : (() => { const y = [0,1,2,3].filter(i => i !== soru.dogru); return y[Math.floor(Math.random() * y.length)]; })()
  ).current;

  useEffect(() => {
    const t = setTimeout(() => {
      setFaz('konusuyor');
      const tam = `Bence cevap "${ETIKET[onerilecek]}) ${soru.secenekler[onerilecek]}" olmalı... %${dogru70 ? '70' : '30'} eminim, ama sen bilirsin!`;
      let i = 0;
      const iv = setInterval(() => { setMetin(tam.slice(0, ++i)); if (i >= tam.length) clearInterval(iv); }, 28);
      return () => clearInterval(iv);
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', border: `2px solid ${kisi.renk}50`, borderRadius: '20px', padding: '32px', maxWidth: '380px', width: '90%', boxShadow: `0 0 40px ${kisi.renk}30`, animation: 'slideUp 0.3s ease' }}>
        {faz === 'araniyor' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px', animation: 'phoneRing 0.5s ease infinite' }}>📞</div>
            <div style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{kisi.isim}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px' }}>{kisi.rol}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {[0,1,2].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: kisi.renk, animation: `bounce 0.8s ease ${i * 0.15}s infinite` }} />)}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '12px' }}>Aranıyor...</div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${kisi.renk}20`, border: `2px solid ${kisi.renk}60` }}>{kisi.avatar}</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700 }}>{kisi.isim}</div>
                <div style={{ color: kisi.renk, fontSize: '12px' }}>{kisi.rol}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '20px', animation: 'pulse 1s ease infinite' }}>📱</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.6', minHeight: '60px', borderLeft: `3px solid ${kisi.renk}` }}>
              {metin}<span style={{ opacity: metin.length < 10 ? 1 : 0, animation: 'blink 0.7s step-end infinite' }}>|</span>
            </div>
          </div>
        )}
        {faz === 'konusuyor' && metin.length > 30 && (
          <button onClick={onKapat} style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '10px', background: kisi.renk, border: 'none', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
            Teşekkürler, karar veriyorum →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideUp  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes phoneRing{ 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
  @keyframes bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
  @keyframes ambient  { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes timerBeat{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
  @keyframes starTwink{ 0%,100%{opacity:0.2} 50%{opacity:0.8} }
  @keyframes correctPop{ 0%{transform:scale(1)} 40%{transform:scale(1.04)} 100%{transform:scale(1)} }
`;

// ─── localStorage takip ──────────────────────────────────────────────────────

function kaydetOyunSonu(kazanim, soruSayisi) {
  try {
    const oyun = Number(localStorage.getItem('sz_milyon_oyun') || 0);
    localStorage.setItem('sz_milyon_oyun', String(oyun + 1));
    const maxK = Number(localStorage.getItem('sz_milyon_max_kazanim') || 0);
    if (kazanim > maxK) localStorage.setItem('sz_milyon_max_kazanim', String(kazanim));
    const toplamS = Number(localStorage.getItem('sz_milyon_toplam_soru') || 0);
    localStorage.setItem('sz_milyon_toplam_soru', String(toplamS + soruSayisi));
    // DB sync
    import('../../lib/syncStats').then(({ syncStatsToDB }) => syncStatsToDB()).catch(() => {});
  } catch {}
}

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────

export default function Milyon() {
  const [durum,    setDurum]    = useState('intro');
  const [sorular,  setSorular]  = useState(() => soruSec());
  const [soruIdx,  setSoruIdx]  = useState(0);
  const [sure,     setSure]     = useState(MAX_SURE);
  const [secilen,  setSecilen]  = useState(null);
  const [aciklaniyor, setAciklaniyor] = useState(false);
  const [kazanilanPara, setKazanilanPara] = useState(0);
  const [duraklat, setDuraklat] = useState(false);

  const [jokerler,       setJokerler]       = useState({ telefon: false, elim: false, cift: false });
  const [gizliSecenekler,setGizliSecenekler]= useState([]);
  const [telefonAcik,    setTelefonAcik]    = useState(false);
  const [ciftDurum,      setCiftDurum]      = useState('yok'); // yok | aktif | ikinci
  const [ilkYanlisIdx,   setIlkYanlisIdx]   = useState(null);
  const [isMobile,       setIsMobile]       = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { playTick, playDogru, playYanlis, playTelefonZili, startAmbi, stopAmbi } = useSes();

  const soru = sorular[soruIdx] ?? sorular[0];

  // Güvence hesabı
  const guvenliPara = useCallback(() => {
    for (let i = GUVENCELER.length - 1; i >= 0; i--)
      if (soruIdx >= GUVENCELER[i] - 1) return ODULLER[GUVENCELER[i] - 2] ?? 0;
    return 0;
  }, [soruIdx]);

  // Timer
  useEffect(() => {
    if (durum !== 'oynuyor' || duraklat || secilen !== null) return;
    const iv = setInterval(() => {
      setSure(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          playYanlis();
          const gp = guvenliPara();
          kaydetOyunSonu(gp, soruIdx + 1);
          setKazanilanPara(gp);
          setDurum('bitti');
          stopAmbi();
          return 0;
        }
        playTick(prev <= 5);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [durum, duraklat, secilen]);

  // Cevap seç
  const cevapla = useCallback((idx) => {
    if (secilen !== null || aciklaniyor || gizliSecenekler.includes(idx) || idx === ilkYanlisIdx) return;
    const dogru = soru.dogru;

    if (ciftDurum === 'aktif' && idx !== dogru) {
      setIlkYanlisIdx(idx);
      setCiftDurum('ikinci');
      return;
    }

    setSecilen(idx);
    setAciklaniyor(true);
    setDuraklat(true);

    setTimeout(() => {
      if (idx === dogru) {
        playDogru();
        if (soruIdx === 9) {
          kaydetOyunSonu(ODULLER[9], 10);
          setKazanilanPara(ODULLER[9]);
          setDurum('kazandi');
          stopAmbi();
        } else {
          setTimeout(() => {
            setSoruIdx(i => i + 1);
            setSure(MAX_SURE);
            setSecilen(null);
            setAciklaniyor(false);
            setDuraklat(false);
            setGizliSecenekler([]);
            setCiftDurum('yok');
            setIlkYanlisIdx(null);
          }, 1400);
        }
      } else {
        playYanlis();
        setTimeout(() => {
          const gp = guvenliPara();
          kaydetOyunSonu(gp, soruIdx + 1);
          setKazanilanPara(gp);
          setDurum('bitti');
          stopAmbi();
        }, 1600);
      }
    }, 1200);
  }, [secilen, aciklaniyor, soruIdx, ciftDurum, gizliSecenekler, ilkYanlisIdx, soru, guvenliPara]);

  // Joker: %50
  const jokerElim = () => {
    if (jokerler.elim) return;
    const yanlisTumu = [0,1,2,3].filter(i => i !== soru.dogru && !gizliSecenekler.includes(i));
    setGizliSecenekler(shuffle(yanlisTumu).slice(0, 2));
    setJokerler(j => ({ ...j, elim: true }));
  };

  // Joker: Çift Cevap
  const jokerCift = () => {
    if (jokerler.cift) return;
    setCiftDurum('aktif');
    setJokerler(j => ({ ...j, cift: true }));
  };

  // Joker: Telefon
  const jokerTelefon = () => {
    if (jokerler.telefon) return;
    setDuraklat(true);
    setTelefonAcik(true);
    setJokerler(j => ({ ...j, telefon: true }));
    playTelefonZili(2800);
  };

  const telefonKapat = () => { setTelefonAcik(false); setDuraklat(false); };

  const yenidenBasla = () => {
    setSorular(soruSec());
    setSoruIdx(0); setSure(MAX_SURE); setSecilen(null); setAciklaniyor(false);
    setKazanilanPara(0); setDuraklat(false);
    setJokerler({ telefon: false, elim: false, cift: false });
    setGizliSecenekler([]); setCiftDurum('yok'); setIlkYanlisIdx(null);
    setDurum('oynuyor');
    setTimeout(startAmbi, 200);
  };

  // ─── Intro ──────────────────────────────────────────────────────────────────
  if (durum === 'intro') return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 100%,#1a1040 0%,#0a0a16 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <style>{STYLES}</style>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 120%,rgba(100,50,200,0.15) 0%,transparent 60%)', animation: 'ambient 4s ease infinite', pointerEvents: 'none' }} />
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', width: '2px', height: '2px', borderRadius: '50%', background: 'white', left: `${5 + (i * 37) % 90}%`, top: `${5 + (i * 53) % 90}%`, animation: `starTwink ${2 + (i % 3)}s ease ${(i % 5) * 0.4}s infinite`, pointerEvents: 'none' }} />
      ))}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '460px', width: '100%' }}>
        <div style={{ fontSize: '52px', marginBottom: '8px' }}>💰</div>
        <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', fontWeight: 800, color: '#FCD34D', marginBottom: '6px', textShadow: '0 0 30px rgba(252,211,77,0.5)', lineHeight: 1.2 }}>
          Kim Milyoner Olmak İster?
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '32px' }}>
          Veri Bilimi Baskısı · 10 Soru · 3 Joker · 15 Saniye
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '36px' }}>
          {[...ODULLER].reverse().map((p, i) => {
            const n = ODULLER.length - i;
            const g = GUVENCELER.includes(n);
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 12px', borderRadius: '6px', background: g ? 'rgba(29,158,117,0.12)' : 'rgba(255,255,255,0.03)', color: g ? '#6EE7B7' : 'rgba(255,255,255,0.45)', border: g ? '1px solid rgba(29,158,117,0.25)' : '1px solid rgba(255,255,255,0.05)' }}>
                <span>{n}.</span><span>{formatPara(p)}{g ? ' ★' : ''}</span>
              </div>
            );
          })}
        </div>
        <button onClick={() => { setDurum('oynuyor'); setTimeout(startAmbi, 200); }} style={{ padding: '16px 52px', borderRadius: '14px', fontSize: '18px', fontWeight: 800, cursor: 'pointer', border: '2px solid rgba(252,211,77,0.5)', background: 'linear-gradient(135deg,rgba(252,211,77,0.2),rgba(252,211,77,0.05))', color: '#FCD34D', boxShadow: '0 0 30px rgba(252,211,77,0.2)', letterSpacing: '0.05em' }}>
          OYNA →
        </button>
      </div>
    </div>
  );

  // ─── Bitti ──────────────────────────────────────────────────────────────────
  if (durum === 'bitti') return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 100%,#2a0a0a 0%,#0a0a16 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{STYLES}</style>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>😢</div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#EF4444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ELENDİNİZ!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>{soruIdx + 1}. soruda takıldınız.</p>
        <div style={{ padding: '16px 24px', borderRadius: '12px', background: kazanilanPara > 0 ? 'rgba(252,211,77,0.08)' : 'rgba(255,255,255,0.04)', border: kazanilanPara > 0 ? '1px solid rgba(252,211,77,0.2)' : '1px solid rgba(255,255,255,0.08)', marginBottom: '32px' }}>
          {kazanilanPara > 0
            ? <p style={{ fontSize: '1.4rem', color: '#FCD34D', fontWeight: 800, margin: 0 }}>Kazandığınız: {formatPara(kazanilanPara)} 🎉</p>
            : <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>Güvence noktasına ulaşamadınız. Kazanç: 0 ₺</p>
          }
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={yenidenBasla} style={{ padding: '12px 28px', borderRadius: '10px', background: '#FCD34D', color: '#0a0a16', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none' }}>Tekrar Dene</button>
          <a href="/" style={{ padding: '12px 28px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Ana Sayfa</a>
        </div>
      </div>
    </div>
  );

  // ─── Kazandı ────────────────────────────────────────────────────────────────
  if (durum === 'kazandi') return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 100%,#0a2a0a 0%,#0a0a16 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <style>{STYLES}</style>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px', animation: 'bounce 0.8s ease infinite' }}>🏆</div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FCD34D', marginBottom: '8px', textShadow: '0 0 30px rgba(252,211,77,0.5)' }}>2.000.000 ₺ KAZANDINIZ!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>Tebrikler! 10 soruyu da doğru cevapladınız. 🎉</p>
        <button onClick={yenidenBasla} style={{ padding: '12px 28px', borderRadius: '10px', background: '#FCD34D', color: '#0a0a16', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none' }}>Tekrar Oyna</button>
      </div>
    </div>
  );

  // ─── Oyun Ekranı ─────────────────────────────────────────────────────────────
  const secenekRengi = (idx) => {
    if (idx === ilkYanlisIdx)       return { bg: 'rgba(239,68,68,0.2)',  border: 'rgba(239,68,68,0.4)',  color: 'rgba(255,100,100,0.5)' };
    if (gizliSecenekler.includes(idx)) return { bg: 'transparent', border: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.08)' };
    if (secilen === null)           return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.88)' };
    if (idx === soru.dogru)         return { bg: 'rgba(16,185,129,0.25)', border: '#10B981', color: '#6EE7B7', anim: 'correctPop 0.5s ease' };
    if (idx === secilen)            return { bg: 'rgba(239,68,68,0.25)', border: '#EF4444', color: '#FCA5A5', anim: 'shake 0.4s ease' };
    return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)' };
  };

  const jokerBtn = (used, renk, icon, title, fn) => (
    <button onClick={fn} disabled={used} title={title} style={{
      width: isMobile ? '44px' : '52px', height: isMobile ? '44px' : '52px',
      borderRadius: '50%', fontSize: isMobile ? '17px' : '20px', cursor: used ? 'not-allowed' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: used ? 'rgba(255,255,255,0.04)' : `${renk}20`,
      border: `2px solid ${used ? 'rgba(255,255,255,0.1)' : renk + '60'}`,
      opacity: used ? 0.3 : 1,
      boxShadow: used ? 'none' : `0 0 12px ${renk}40`,
      transition: 'all 0.2s', flexShrink: 0,
    }}>{icon}</button>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 110%,#14103a 0%,#0a0a16 65%)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <style>{STYLES}</style>

      {/* Sahne ışıkları */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 90%,rgba(100,60,220,0.12) 0%,transparent 60%)', animation: 'ambient 5s ease infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '40%', background: 'radial-gradient(ellipse at 50% 0%,rgba(252,211,77,0.04) 0%,transparent 70%)', pointerEvents: 'none' }} />
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', width: '2px', height: '2px', borderRadius: '50%', background: 'white', left: `${(i * 41) % 95}%`, top: `${(i * 67) % 90}%`, animation: `starTwink ${2 + i % 3}s ease ${(i % 4) * 0.5}s infinite`, pointerEvents: 'none' }} />
      ))}

      {telefonAcik && <TelefonModal soru={soru} onKapat={telefonKapat} />}

      {/* Ana layout */}
      <div style={{
        flex: 1,
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : 'auto 1fr auto',
        maxWidth: '1200px', width: '100%', margin: '0 auto',
        padding: isMobile ? '8px 10px' : '20px 16px',
        alignItems: 'start', gap: '0',
      }}>

        {/* Sol: Host — masaüstünde */}
        {!isMobile && (
          <div style={{ width: '90px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '40px', minHeight: '300px' }}>
            <SunucuSiluet />
          </div>
        )}

        {/* Orta: Oyun */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isMobile ? '0' : '0 12px', width: isMobile ? '100%' : undefined }}>
          <div style={{ width: '100%', maxWidth: '640px' }}>

            {/* Mobil: Yatay para şeridi */}
            {isMobile && (
              <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', padding: '2px 0', width: 'max-content' }}>
                  {ODULLER.map((para, i) => {
                    const aktif = i === soruIdx;
                    const gecildi = i < soruIdx;
                    const guvence = GUVENCELER.includes(i + 1);
                    return (
                      <div key={i} style={{
                        padding: '3px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: aktif ? 700 : 400,
                        whiteSpace: 'nowrap', flexShrink: 0,
                        background: aktif ? 'rgba(251,191,36,0.2)' : gecildi ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${aktif ? 'rgba(251,191,36,0.6)' : guvence ? 'rgba(29,158,117,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        color: aktif ? '#FCD34D' : gecildi ? '#6EE7B7' : guvence ? '#86EFAC' : 'rgba(255,255,255,0.35)',
                      }}>
                        {i + 1}. {formatPara(para)}{guvence ? ' ★' : ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monitör gövdesi */}
            <div style={{ background: 'linear-gradient(160deg,#0f0f23 0%,#0a0a1a 100%)', border: '2px solid rgba(100,80,220,0.4)', borderRadius: '16px', boxShadow: '0 0 40px rgba(100,60,220,0.2),inset 0 0 20px rgba(0,0,0,0.5)', overflow: 'hidden' }}>

              {/* Başlık barı */}
              <div style={{ background: 'rgba(100,60,220,0.15)', padding: isMobile ? '8px 12px' : '10px 16px', borderBottom: '1px solid rgba(100,80,220,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['#EF4444','#F59E0B','#10B981'].map((c, i) => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />)}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: 'monospace' }}>soru_{String(soruIdx + 1).padStart(2,'0')}.veri</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>{formatPara(ODULLER[soruIdx])}</span>
              </div>

              {/* Soru içeriği */}
              <div style={{ padding: isMobile ? '14px 12px 12px' : '24px 24px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? '12px' : '20px' }}>
                  <div style={{ color: 'rgba(252,211,77,0.7)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em' }}>SORU {soruIdx + 1} / 10</div>
                  <div style={{ animation: sure <= 4 ? 'timerBeat 0.5s ease infinite' : 'none' }}>
                    <TimerHalka sure={sure} />
                  </div>
                </div>

                <div style={{ color: 'white', fontSize: isMobile ? '14px' : 'clamp(14px,2.5vw,17px)', lineHeight: '1.65', fontWeight: 500, marginBottom: isMobile ? '14px' : '24px', minHeight: isMobile ? '40px' : '52px' }}>
                  {soru.soru}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '8px' : '10px' }}>
                  {soru.secenekler.map((opt, i) => {
                    const s = secenekRengi(i);
                    const gizli   = gizliSecenekler.includes(i);
                    const ilkY    = i === ilkYanlisIdx;
                    return (
                      <button key={i} onClick={() => cevapla(i)} disabled={gizli || ilkY || secilen !== null}
                        style={{ padding: isMobile ? '10px 10px' : '12px 14px', borderRadius: '10px', textAlign: 'left', border: `1.5px solid ${s.border}`, background: s.bg, color: s.color, fontSize: isMobile ? '12px' : '13px', cursor: (gizli || ilkY || secilen !== null) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', lineHeight: '1.4', animation: s.anim }}>
                        <span style={{ fontWeight: 800, fontSize: '11px', opacity: 0.8, flexShrink: 0 }}>{ETIKET[i]}</span>
                        <span style={{ visibility: gizli ? 'hidden' : 'visible' }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {ciftDurum === 'aktif' && <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '11px', color: '#F59E0B', animation: 'pulse 2s ease infinite' }}>⚡ Çift cevap aktif — yanlış olsa bile bir kez daha hakkın var</div>}
                {ciftDurum === 'ikinci' && <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '11px', color: '#EF4444', animation: 'pulse 0.8s ease infinite' }}>⚠️ İlk cevap yanlıştı! Son şansın — dikkatli seç</div>}
              </div>

              {/* Joker barı */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: isMobile ? '10px 12px' : '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '16px' : '24px', background: 'rgba(0,0,0,0.2)' }}>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', letterSpacing: '0.08em' }}>JOKERLER</span>
                {jokerBtn(jokerler.telefon, '#9F7AEA', '📞', 'Telefon Jokeri', jokerTelefon)}
                {jokerBtn(jokerler.elim,    '#F59E0B', '50/50', '%50 Jokeri', jokerElim)}
                {jokerBtn(jokerler.cift,    '#34D399', '2×', 'Çift Cevap', jokerCift)}
              </div>
            </div>

            {/* Laptop alt kenarı — masaüstünde */}
            {!isMobile && (
              <>
                <div style={{ height: '10px', background: 'linear-gradient(to bottom,#1a1a2e,#0f0f1a)', borderRadius: '0 0 6px 6px', margin: '0 8px', opacity: 0.8 }} />
                <div style={{ height: '6px', background: '#0a0a14', borderRadius: '0 0 10px 10px', margin: '0 20px' }} />
              </>
            )}
          </div>
          {!isMobile && <div style={{ marginTop: '14px', color: 'rgba(255,255,255,0.18)', fontSize: '11px', letterSpacing: '0.1em' }}>YARIŞMACI</div>}
        </div>

        {/* Sağ: Para merdiveni — masaüstünde */}
        {!isMobile && (
          <div style={{ width: '152px', paddingTop: '8px' }}>
            <div style={{ color: 'rgba(252,211,77,0.4)', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '8px', textAlign: 'center' }}>ÖDÜL MERDİVENİ</div>
            <ParaMerdiveni soruIdx={soruIdx} />
          </div>
        )}
      </div>
    </div>
  );
}
