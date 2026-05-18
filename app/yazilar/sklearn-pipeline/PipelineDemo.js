'use client';

import { useState } from 'react';

// ─── Pipeline Diyagramı ───────────────────────────────────────────────────────

const ADIM_RENK = {
  veri:    { bg: '#E1F5EE', border: '#1D9E75', text: '#0F6E56', dot: '#1D9E75' },
  impute:  { bg: '#FEF9C3', border: '#CA8A04', text: '#713F12', dot: '#EAB308' },
  scale:   { bg: '#DBEAFE', border: '#2563EB', text: '#1E3A8A', dot: '#3B82F6' },
  encode:  { bg: '#F3E8FF', border: '#9333EA', text: '#581C87', dot: '#A855F7' },
  model:   { bg: '#FEE2E2', border: '#DC2626', text: '#7F1D1D', dot: '#EF4444' },
  cikti:   { bg: '#F0FDF4', border: '#16A34A', text: '#14532D', dot: '#22C55E' },
};

function AdimKutu({ icon, label, tip, aktif, kucuk }) {
  const r = ADIM_RENK[tip];
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
      padding: kucuk ? '10px 14px' : '14px 20px',
      borderRadius: '12px',
      background: aktif ? r.bg : 'var(--color-cream-card)',
      border: `1.5px solid ${aktif ? r.border : 'var(--color-border)'}`,
      minWidth: kucuk ? '90px' : '110px',
      transition: 'all 0.25s',
      opacity: aktif ? 1 : 0.4,
    }}>
      <span style={{ fontSize: kucuk ? '20px' : '24px' }}>{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 700, color: aktif ? r.text : 'var(--color-text-mute)', textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  );
}

function Ok({ aktif }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', color: aktif ? 'var(--color-accent)' : 'var(--color-border)', fontSize: '20px', padding: '0 2px', transition: 'color 0.25s' }}>
      →
    </div>
  );
}

export function PipelineDiyagram({ adimlar }) {
  const tumAdimlar = [
    { icon: '📋', label: 'Ham Veri', tip: 'veri', id: 'veri' },
    { icon: '🩹', label: 'Imputer', tip: 'impute', id: 'imputer' },
    { icon: '⚖️', label: 'Scaler', tip: 'scale', id: 'scaler' },
    { icon: '🔤', label: 'Encoder', tip: 'encode', id: 'encoder' },
    { icon: '🤖', label: 'Model', tip: 'model', id: 'model' },
    { icon: '✅', label: 'Tahmin', tip: 'cikti', id: 'cikti' },
  ];

  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 'max-content' }}>
        {tumAdimlar.map((a, i) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AdimKutu
              icon={a.icon} label={a.label} tip={a.tip}
              aktif={a.id === 'veri' || a.id === 'cikti' || adimlar.includes(a.id)}
            />
            {i < tumAdimlar.length - 1 && (
              <Ok aktif={a.id === 'veri' || adimlar.includes(a.id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pipeline Oluşturucu ─────────────────────────────────────────────────────

const NUMERIK_ADIMLAR = [
  { id: 'simple_imputer', label: 'SimpleImputer', aciklama: 'Eksik değerleri doldur', icon: '🩹', kod: "('imputer', SimpleImputer(strategy='mean'))" },
  { id: 'standard_scaler', label: 'StandardScaler', aciklama: 'Ortalama 0, std 1', icon: '⚖️', kod: "('scaler', StandardScaler())" },
  { id: 'minmax_scaler', label: 'MinMaxScaler', aciklama: '0-1 aralığına sıkıştır', icon: '📐', kod: "('scaler', MinMaxScaler())" },
  { id: 'robust_scaler', label: 'RobustScaler', aciklama: 'Aykırı değerlere dayanıklı', icon: '🛡️', kod: "('scaler', RobustScaler())" },
  { id: 'poly_features', label: 'PolynomialFeatures', aciklama: 'Polinom özellikler ekle', icon: '📈', kod: "('poly', PolynomialFeatures(degree=2))" },
];

const KATEGORIK_ADIMLAR = [
  { id: 'onehot', label: 'OneHotEncoder', aciklama: 'Kategorileri binary vektöre çevir', icon: '🔢', kod: "('encoder', OneHotEncoder(handle_unknown='ignore'))" },
  { id: 'ordinal', label: 'OrdinalEncoder', aciklama: 'Sıralı sayıya çevir (0, 1, 2…)', icon: '🔤', kod: "('encoder', OrdinalEncoder())" },
  { id: 'freq_enc', label: 'FrequencyEncoder', aciklama: 'Frekansa göre sayıya çevir', icon: '📊', kod: "('encoder', ce.CountEncoder())" },
];

const MODELLER = [
  { id: 'logistic', label: 'LogisticRegression', aciklama: 'Sınıflandırma — lineer', icon: '📉', kod: "LogisticRegression(max_iter=1000)" },
  { id: 'random_forest', label: 'RandomForestClassifier', aciklama: 'Ensemble — ağaç tabanlı', icon: '🌲', kod: "RandomForestClassifier(n_estimators=100)" },
  { id: 'xgb', label: 'XGBClassifier', aciklama: 'Gradient boosting', icon: '⚡', kod: "XGBClassifier()" },
  { id: 'linear_reg', label: 'LinearRegression', aciklama: 'Regresyon — lineer', icon: '📏', kod: "LinearRegression()" },
  { id: 'ridge', label: 'Ridge', aciklama: 'Regresyon — L2 regularizasyon', icon: '⛰️', kod: "Ridge(alpha=1.0)" },
  { id: 'svr', label: 'SVR', aciklama: 'Regresyon — destek vektör', icon: '🎯', kod: "SVR(kernel='rbf')" },
];

function KodBlok({ kod }) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = () => {
    navigator.clipboard?.writeText(kod).then(() => {
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 1500);
    });
  };

  return (
    <div style={{ position: 'relative', margin: '0' }}>
      <button
        onClick={kopyala}
        style={{
          position: 'absolute', top: '10px', right: '10px',
          padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
          background: kopyalandi ? 'var(--color-accent)' : 'var(--color-border)',
          color: kopyalandi ? '#fff' : 'var(--color-text-soft)',
          border: 'none', cursor: 'pointer', zIndex: 1,
          transition: 'all 0.2s',
        }}
      >
        {kopyalandi ? '✓ Kopyalandı' : 'Kopyala'}
      </button>
      <pre style={{
        background: 'var(--color-cream-card)',
        border: '0.5px solid var(--color-border)',
        borderRadius: '10px',
        padding: '18px 20px',
        paddingTop: '40px',
        fontSize: '12.5px',
        lineHeight: '1.65',
        color: 'var(--color-text)',
        overflowX: 'auto',
        margin: 0,
        fontFamily: 'var(--font-mono), Menlo, monospace',
        whiteSpace: 'pre',
      }}>
        {kod}
      </pre>
    </div>
  );
}

function SecenekSatir({ item, secili, onToggle, tip }) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 12px', borderRadius: '8px', width: '100%', textAlign: 'left',
        border: `1px solid ${secili ? 'var(--color-accent)' : 'var(--color-border)'}`,
        background: secili ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12.5px', fontWeight: 600, color: secili ? 'var(--color-accent-text)' : 'var(--color-text)' }}>
          {item.label}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{item.aciklama}</div>
      </div>
      <div style={{
        width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
        background: secili ? 'var(--color-accent)' : 'transparent',
        border: `1.5px solid ${secili ? 'var(--color-accent)' : 'var(--color-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {secili && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
      </div>
    </button>
  );
}

function ModelSecenegi({ item, secili, onSec }) {
  return (
    <button
      onClick={() => onSec(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 12px', borderRadius: '8px', width: '100%', textAlign: 'left',
        border: `1px solid ${secili ? '#DC2626' : 'var(--color-border)'}`,
        background: secili ? '#FEF2F2' : 'var(--color-cream-card)',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '12.5px', fontWeight: 600, color: secili ? '#DC2626' : 'var(--color-text)' }}>
          {item.label}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>{item.aciklama}</div>
      </div>
      {secili && <span style={{ color: '#DC2626', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>✓</span>}
    </button>
  );
}

function kodUret(numerikSec, kategorikSec, model) {
  const modelObj = MODELLER.find(m => m.id === model);
  if (!modelObj) return '# Bir model seç';

  const numAdimlar = NUMERIK_ADIMLAR.filter(a => numerikSec.includes(a.id));
  const katAdimlar = KATEGORIK_ADIMLAR.filter(a => kategorikSec.includes(a.id));

  const imports = new Set(['from sklearn.pipeline import Pipeline, make_pipeline']);
  if (numAdimlar.some(a => a.id === 'simple_imputer')) imports.add('from sklearn.impute import SimpleImputer');
  if (numAdimlar.some(a => a.id === 'standard_scaler')) imports.add('from sklearn.preprocessing import StandardScaler');
  if (numAdimlar.some(a => a.id === 'minmax_scaler')) imports.add('from sklearn.preprocessing import MinMaxScaler');
  if (numAdimlar.some(a => a.id === 'robust_scaler')) imports.add('from sklearn.preprocessing import RobustScaler');
  if (numAdimlar.some(a => a.id === 'poly_features')) imports.add('from sklearn.preprocessing import PolynomialFeatures');
  if (katAdimlar.some(a => a.id === 'onehot')) imports.add('from sklearn.preprocessing import OneHotEncoder');
  if (katAdimlar.some(a => a.id === 'ordinal')) imports.add('from sklearn.preprocessing import OrdinalEncoder');
  if (katAdimlar.length > 0 || numAdimlar.length > 0) imports.add('from sklearn.compose import ColumnTransformer');
  if (['logistic'].includes(model)) imports.add('from sklearn.linear_model import LogisticRegression');
  if (['linear_reg'].includes(model)) imports.add('from sklearn.linear_model import LinearRegression');
  if (['ridge'].includes(model)) imports.add('from sklearn.linear_model import Ridge');
  if (model === 'random_forest') imports.add('from sklearn.ensemble import RandomForestClassifier');
  if (model === 'svr') imports.add('from sklearn.svm import SVR');
  if (model === 'xgb') imports.add('from xgboost import XGBClassifier');

  const importStr = [...imports].join('\n');

  let preprocess = '';
  const hasNum = numAdimlar.length > 0;
  const hasKat = katAdimlar.length > 0;

  if (!hasNum && !hasKat) {
    // Sadece model
    return `${importStr}\n\npipeline = Pipeline([\n    ('model', ${modelObj.kod}),\n])\n\n# Eğit ve tahmin et\npipeline.fit(X_train, y_train)\ny_pred = pipeline.predict(X_test)\nscore = pipeline.score(X_test, y_test)`;
  }

  let colTransLines = [];

  if (hasNum) {
    const steps = numAdimlar.map(a => `        ${a.kod}`).join(',\n');
    colTransLines.push(`    ('numerik', Pipeline([\n${steps},\n    ]), numerik_sutunlar)`);
  }

  if (hasKat) {
    const steps = katAdimlar.map(a => `        ${a.kod}`).join(',\n');
    colTransLines.push(`    ('kategorik', Pipeline([\n${steps},\n    ]), kategorik_sutunlar)`);
  }

  const colTrans = `preprocessor = ColumnTransformer(transformers=[\n${colTransLines.join(',\n')},\n])`;

  const pipeline = `pipeline = Pipeline([\n    ('preprocessor', preprocessor),\n    ('model', ${modelObj.kod}),\n])`;

  return `${importStr}

# Sütun listelerini tanımla
numerik_sutunlar = ['yas', 'gelir', 'skor']
kategorik_sutunlar = ['sehir', 'meslek', 'kategori']

${colTrans}

${pipeline}

# Eğit ve değerlendir
pipeline.fit(X_train, y_train)
y_pred   = pipeline.predict(X_test)
score    = pipeline.score(X_test, y_test)
print(f"Test skoru: {score:.3f}")`;
}

export function PipelineOlusturucu() {
  const [numerikSec, setNumerikSec] = useState(['simple_imputer', 'standard_scaler']);
  const [kategorikSec, setKategorikSec] = useState(['onehot']);
  const [model, setModel] = useState('random_forest');

  const toggleNum = (id) => setNumerikSec(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const toggleKat = (id) => setKategorikSec(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const aktifAdimlar = [
    ...(numerikSec.some(id => id === 'simple_imputer') ? ['imputer'] : []),
    ...(numerikSec.some(id => id.includes('scaler')) ? ['scaler'] : []),
    ...(kategorikSec.length > 0 ? ['encoder'] : []),
    'model',
  ];

  const kod = kodUret(numerikSec, kategorikSec, model);

  return (
    <div style={{
      border: '0.5px solid var(--color-border)', borderRadius: '16px',
      overflow: 'hidden', background: 'var(--color-cream-card)',
      margin: '2rem 0',
    }}>
      {/* Başlık */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '0.5px solid var(--color-border)',
        background: 'var(--color-cream)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{ fontSize: '16px' }}>🔧</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>Pipeline Oluşturucu</span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-mute)', marginLeft: '4px' }}>seçimlerini yap, kodu al</span>
      </div>

      {/* Diyagram */}
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--color-border)' }}>
        <PipelineDiyagram adimlar={aktifAdimlar} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
        {/* Sol: Seçenekler */}
        <div style={{ padding: '20px', borderRight: '0.5px solid var(--color-border)' }}>

          {/* Numerik */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              NUMERİK ÖNIŞLEM
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {NUMERIK_ADIMLAR.map(a => (
                <SecenekSatir key={a.id} item={a} secili={numerikSec.includes(a.id)} onToggle={toggleNum} />
              ))}
            </div>
          </div>

          {/* Kategorik */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              KATEGORİK ÖNIŞLEM
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {KATEGORIK_ADIMLAR.map(a => (
                <SecenekSatir key={a.id} item={a} secili={kategorikSec.includes(a.id)} onToggle={toggleKat} />
              ))}
            </div>
          </div>

          {/* Model */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.08em', marginBottom: '8px' }}>
              MODEL
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {MODELLER.map(m => (
                <ModelSecenegi key={m.id} item={m} secili={model === m.id} onSec={setModel} />
              ))}
            </div>
          </div>
        </div>

        {/* Sağ: Üretilen Kod */}
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.08em', marginBottom: '12px' }}>
            ÜRETİLEN KOD
          </div>
          <KodBlok kod={kod} />
        </div>
      </div>
    </div>
  );
}
