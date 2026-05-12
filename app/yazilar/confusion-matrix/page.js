'use client';

import { useState, useMemo } from 'react';

const N_POS = 50, N_NEG = 50;

const posScores = Array.from({ length: N_POS }, (_, i) => 0.5 + 0.45 * (i / N_POS) + Math.sin(i * 1.7) * 0.08);
const negScores = Array.from({ length: N_NEG }, (_, i) => 0.05 + 0.45 * (i / N_NEG) + Math.cos(i * 2.3) * 0.06);

function calcMetrics(thresh) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  posScores.forEach(s => s >= thresh ? tp++ : fn++);
  negScores.forEach(s => s >= thresh ? fp++ : tn++);
  const acc = (tp + tn) / (tp + fp + fn + tn);
  const prec = tp + fp > 0 ? tp / (tp + fp) : 1;
  const rec = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = prec + rec > 0 ? 2 * prec * rec / (prec + rec) : 0;
  return { tp, fp, fn, tn, acc, prec, rec, f1 };
}

function rocCurve() {
  return Array.from({ length: 101 }, (_, i) => i / 100).reverse().map(t => {
    let tp = 0, fp = 0, fn = 0, tn = 0;
    posScores.forEach(s => s >= t ? tp++ : fn++);
    negScores.forEach(s => s >= t ? fp++ : tn++);
    return { fpr: fp / (fp + tn) || 0, tpr: tp / (tp + fn) || 0 };
  });
}

const roc = rocCurve();
let auc = 0;
for (let i = 1; i < roc.length; i++) auc += Math.abs(roc[i].fpr - roc[i - 1].fpr) * (roc[i].tpr + roc[i - 1].tpr) / 2;
const rocPath = roc.map((p, i) => `${i === 0 ? 'M' : 'L'}${(40 + p.fpr * 340).toFixed(1)},${(170 - p.tpr * 150).toFixed(1)}`).join(' ');

function getScenario(thresh, prec, rec) {
  if (thresh < 0.3) return `Eşik çok düşük (${thresh.toFixed(2)}): Model neredeyse herkesi pozitif diyor. Recall yüksek ama Precision düşük — çok fazla yanlış alarm var.`;
  if (thresh > 0.75) return `Eşik çok yüksek (${thresh.toFixed(2)}): Model sadece çok emin olduğunda pozitif diyor. Precision yüksek ama Recall düşük — birçok pozitif vaka kaçıyor.`;
  return `Eşik: ${thresh.toFixed(2)} — Precision: ${(prec * 100).toFixed(0)}%, Recall: ${(rec * 100).toFixed(0)}%. ${prec > rec ? 'Kesinliği öne çıkaran ayar — spam filtresine benzer.' : 'Yakalamayı öne çıkaran ayar — kanser taramasına benzer.'}`;
}

function ConfusionMatrixDemo() {
  const [thresh, setThresh] = useState(50);
  const t = thresh / 100;
  const m = useMemo(() => calcMetrics(t), [thresh]);
  const fpr = (m.fp / (m.fp + m.tn)) || 0;
  const tpr = (m.tp / (m.tp + m.fn)) || 0;
  const dotX = (40 + fpr * 340).toFixed(1);
  const dotY = (170 - tpr * 150).toFixed(1);

  return (
    <div className="my-8">
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm whitespace-nowrap" style={{ color: 'var(--color-text-soft)' }}>Eşik değeri (threshold)</label>
        <input type="range" min="1" max="99" value={thresh} className="flex-1"
          onChange={e => setThresh(parseInt(e.target.value))} />
        <span className="text-lg font-medium w-10 text-right">{t.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-center mb-2" style={{ color: 'var(--color-text-mute)' }}>Tahmin: Pozitif</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(29,158,117,0.12)' }}>
              <div className="text-xs mb-1" style={{ color: '#0F6E56' }}>TP</div>
              <div className="text-3xl font-semibold" style={{ color: '#0F6E56' }}>{m.tp}</div>
              <div className="text-xs mt-1" style={{ color: '#0F6E56' }}>Gerçek Pozitif</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: '#fdecea' }}>
              <div className="text-xs mb-1" style={{ color: '#c0392b' }}>FP</div>
              <div className="text-3xl font-semibold" style={{ color: '#c0392b' }}>{m.fp}</div>
              <div className="text-xs mt-1" style={{ color: '#c0392b' }}>Yanlış Pozitif</div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-center mb-2" style={{ color: 'var(--color-text-mute)' }}>Tahmin: Negatif</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="rounded-lg p-3 text-center" style={{ background: '#fdecea' }}>
              <div className="text-xs mb-1" style={{ color: '#c0392b' }}>FN</div>
              <div className="text-3xl font-semibold" style={{ color: '#c0392b' }}>{m.fn}</div>
              <div className="text-xs mt-1" style={{ color: '#c0392b' }}>Yanlış Negatif</div>
            </div>
            <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(29,158,117,0.12)' }}>
              <div className="text-xs mb-1" style={{ color: '#0F6E56' }}>TN</div>
              <div className="text-3xl font-semibold" style={{ color: '#0F6E56' }}>{m.tn}</div>
              <div className="text-xs mt-1" style={{ color: '#0F6E56' }}>Gerçek Negatif</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Accuracy', val: m.acc },
          { label: 'Precision', val: m.prec },
          { label: 'Recall', val: m.rec },
          { label: 'F1', val: m.f1 },
        ].map(({ label, val }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>{label}</div>
            <div className="text-xl font-semibold">{(val * 100).toFixed(1)}%</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
        <svg viewBox="0 0 400 200" className="w-full h-auto block">
          <text x="200" y="16" fontSize="12" fill="#8a7e6d" textAnchor="middle">ROC Eğrisi</text>
          <line x1="40" y1="170" x2="380" y2="170" stroke="#e8e2d5" strokeWidth="1"/>
          <line x1="40" y1="20" x2="40" y2="170" stroke="#e8e2d5" strokeWidth="1"/>
          <line x1="40" y1="170" x2="380" y2="20" stroke="#e8e2d5" strokeWidth="1" strokeDasharray="4 3"/>
          <text x="380" y="185" fontSize="10" fill="#8a7e6d" textAnchor="end">FPR</text>
          <text x="28" y="20" fontSize="10" fill="#8a7e6d" textAnchor="middle">TPR</text>
          <path d={rocPath} fill="none" stroke="#1D9E75" strokeWidth="2"/>
          <circle cx={dotX} cy={dotY} r="5" fill="#7F77DD" stroke="#26215C" strokeWidth="1.5"/>
          <text x="280" y="100" fontSize="11" fill="#8a7e6d" textAnchor="middle">AUC = {auc.toFixed(3)}</text>
        </svg>
      </div>

      <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed" style={{ color: 'var(--color-text-soft)' }}>
        {getScenario(t, m.prec, m.rec)}
      </p>
    </div>
  );
}

export default function ConfusionMatrixPost() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Confusion matrix: eşik dansı
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>2026 · 10 dakika okuma</p>

        <p>
          Modelinin doğruluğu %95. Harika görünüyor, değil mi? Şimdi şunu söyleyeyim:
          veri setinin %95&apos;i negatif sınıf. Model her şeye &quot;negatif&quot; dese
          %95 accuracy alır. Hiçbir şey öğrenmeden.
        </p>
        <p>
          İşte bu yüzden accuracy tek başına yeterli değil. Confusion matrix, modelin
          gerçekte ne yaptığını gösterir.
        </p>

        <h2>Önce dene</h2>
        <p>
          Senaryo: bir hastalık testi. 50 hasta, 50 sağlıklı kişi var.
          Eşik değerini kaydır, TP/FP/TN/FN ve türetilen metriklerin nasıl değiştiğini izle.
        </p>

        <ConfusionMatrixDemo />

        <h2>4 hücre ne anlama geliyor?</h2>
        <ul>
          <li><strong>TP (True Positive):</strong> Hasta, hasta dendi. Doğru yakalandı.</li>
          <li><strong>TN (True Negative):</strong> Sağlıklı, sağlıklı dendi. Doğru bırakıldı.</li>
          <li><strong>FP (False Positive):</strong> Sağlıklı ama hasta dendi. Tip-1 hata, yanlış alarm.</li>
          <li><strong>FN (False Negative):</strong> Hasta ama sağlıklı dendi. Tip-2 hata, kaçırılan vaka.</li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Kanser taramasında FN&apos;den kaçınmak kritik — hastayı kaçırmak ölümcül olabilir.
            Spam filtresinde ise FP&apos;den kaçınmak önemli — önemli maili spam&apos;e atmak
            kullanıcıyı kaybettirir.
          </p>
        </blockquote>

        <h2>Metrikler türetilir</h2>
        <pre>{`from sklearn.metrics import classification_report, confusion_matrix

y_true = [1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 0, 1, 1, 0, 1, 0]

cm = confusion_matrix(y_true, y_pred)
print(cm)
# [[TN, FP],
#  [FN, TP]]

print(classification_report(y_true, y_pred))
# precision  recall  f1-score   support`}</pre>

        <h2>Hangi metriği ne zaman kullanırım?</h2>
        <ul>
          <li><strong>Accuracy:</strong> Dengeli veri setinde iyi. Dengesiz veri setinde yanıltıcı.</li>
          <li><strong>Precision:</strong> &quot;Pozitif dediğimde ne kadar haklıyız?&quot; — yanlış alarm maliyetli olduğunda.</li>
          <li><strong>Recall:</strong> &quot;Tüm pozitifleri ne kadar yakaladık?&quot; — kaçırmak maliyetli olduğunda.</li>
          <li><strong>F1:</strong> Precision ve Recall&apos;un harmonik ortalaması. İkisini birlikte optimize etmek istediğinde.</li>
          <li><strong>AUC-ROC:</strong> Eşikten bağımsız, modelin genel ayrıştırma gücü. 0.5 rastgele, 1.0 mükemmel.</li>
        </ul>

        <h2>ROC eğrisi ne anlatır?</h2>
        <p>
          ROC eğrisi, tüm olası eşik değerleri için TPR (Recall) ve FPR ilişkisini gösterir.
          Demoda mor noktanın eşikle birlikte eğri üzerinde hareket ettiğini gördün.
          AUC (Area Under Curve) bu eğrinin altındaki alan — modelin eşikten bağımsız
          genel performansı.
        </p>

        <pre>{`from sklearn.metrics import roc_auc_score, roc_curve
import matplotlib.pyplot as plt

fpr, tpr, thresholds = roc_curve(y_true, y_scores)
auc = roc_auc_score(y_true, y_scores)

plt.plot(fpr, tpr, label=f'AUC = {auc:.3f}')
plt.plot([0,1], [0,1], '--', color='gray')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Eğrisi')
plt.legend()
plt.show()`}</pre>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>Pandas&apos;ta en çok yanlış bilinen 7 şey</strong>:
          yıllarca gördüğüm yaygın ama yanlış pattern&apos;ler.
        </p>
      </article>
    </main>
  );
}
