export const metadata = {
  title: 'Veri Analisti mi, Data Scientist mi, ML Engineer mı?',
  description: '15 yıllık deneyimle veri kariyerindeki rollerin farkları, maaş aralıkları ve geçiş yolları. Türkçe kariyer rehberi.',
  keywords: ['data scientist nedir', 'veri analisti nedir', 'ml engineer nedir', 'veri kariyeri türkçe', 'data science kariyer'],
  openGraph: {
    title: 'Veri Rollerinin Farkları — Sıfır Gecikme',
    description: 'Hangi rol sana uygun? Maaşlar ve geçiş yolları.',
  },
};

export default function RolFarklari() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-case inline-block mb-3">kariyer</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri analisti mi, data scientist mi, ML engineer mı?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          15 yıllık deneyimle — 12 dakika okuma
        </p>

        <p>
          İş ilanlarına bakınca kafa karışıyor. &quot;Data Analyst&quot;, &quot;Data Scientist&quot;,
          &quot;ML Engineer&quot;, &quot;Analytics Engineer&quot;, &quot;Data Engineer&quot;...
          Hepsi veriyle çalışıyor ama birbirinden farklı. Hangisi sana uygun?
          Hangisi daha çok kazanıyor? Birinden diğerine geçilebilir mi?
        </p>

        <p>
          15 yıldır bu alanda çalışıyorum, ekip kurdum, işe alım yaptım.
          Türkiye&apos;deki ve global iş piyasasını karşılaştırarak anlatalım.
        </p>

        <h2>Özet tablo</h2>

        <div style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-text-mute)', fontWeight: 500 }}>Rol</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-text-mute)', fontWeight: 500 }}>Temel soru</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-text-mute)', fontWeight: 500 }}>Ana araçlar</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-text-mute)', fontWeight: 500 }}>Çıktı</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rol: 'Veri Analisti', soru: 'Ne oldu?', araclar: 'SQL, Excel, BI araçları', cikti: 'Rapor, dashboard' },
                { rol: 'Data Scientist', soru: 'Ne olacak?', araclar: 'Python, ML, istatistik', cikti: 'Model, tahmin' },
                { rol: 'ML Engineer', soru: 'Nasıl ölçeklenir?', araclar: 'Python, cloud, MLOps', cikti: 'Production sistemi' },
                { rol: 'Data Engineer', soru: 'Veri nasıl akar?', araclar: 'SQL, Spark, pipeline', cikti: 'Veri altyapısı' },
                { rol: 'Analytics Engineer', soru: 'Veri nasıl modellenir?', araclar: 'dbt, SQL, BI', cikti: 'Temiz veri katmanı' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '0.5px solid var(--color-border)', background: i % 2 === 0 ? 'transparent' : 'var(--color-cream-card)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--color-text)' }}>{row.rol}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-soft)', fontStyle: 'italic' }}>{row.soru}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-soft)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{row.araclar}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--color-text-soft)' }}>{row.cikti}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Veri Analisti: geçmişe bakar</h2>
        <p>
          Veri analistinin temel sorusu şu: <strong>&quot;Ne oldu?&quot;</strong>
          Satışlar neden düştü? Hangi müşteri segmenti en karlı? Kampanya işe yaradı mı?
        </p>
        <p>
          Günlük işin büyük çoğunluğu SQL sorguları yazmak, dashboard kurmak,
          rapor hazırlamak. Teknik derinlik Data Scientist kadar değil ama
          iş anlayışı çok daha kritik. Yöneticiye doğru soruyu soran analist,
          en karmaşık modeli kuran scientist&apos;tan çok daha değerlidir.
        </p>
        <p>
          <strong>Türkiye&apos;de maaş aralığı:</strong> 30.000 — 80.000 TL (deneyime göre).
          Yurt dışında remote: $50K — $90K.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Veri analistinin en güçlü silahı SQL değil, doğru soruyu sormak.
            Teknik beceri öğrenilir. İş problemi sezgisi geliştirilmesi zaman alır.
          </p>
        </blockquote>

        <p>Temel araçlar:</p>
        <pre>{`-- SQL: günlük ekmeğin
SELECT
    sehir,
    COUNT(*) AS siparis_sayisi,
    SUM(tutar) AS toplam_ciro,
    AVG(tutar) AS ort_siparis
FROM siparisler
WHERE tarih >= '2024-01-01'
GROUP BY sehir
ORDER BY toplam_ciro DESC;

-- Power BI / Tableau / Looker: görselleştirme
-- Excel: hâlâ vazgeçilmez, küçümseme`}</pre>

        <h2>Data Scientist: geleceğe bakar</h2>
        <p>
          Data scientist&apos;in temel sorusu: <strong>&quot;Ne olacak?&quot;</strong>
          Bu müşteri churn olacak mı? Bu işlem fraud mu? Yarın kaç ürün satarız?
        </p>
        <p>
          İstatistik ve makine öğrenmesi ağır basar. Ama çoğu zaman
          yanlış anlaşılır: data scientist zamanının %80&apos;ini veri temizlemekle
          geçirir, model kurmakla değil. Güzel model sunum yapar ama
          production&apos;a almak data scientist&apos;in işi değildir — bu ML engineer&apos;ın işi.
        </p>
        <p>
          <strong>Türkiye&apos;de maaş aralığı:</strong> 50.000 — 120.000 TL.
          Yurt dışında remote: $80K — $150K.
        </p>

        <pre>{`# Data Scientist'in günlük kodu
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# 1. Veriyi anla (zamanın %40'ı burada)
df = pd.read_sql(query, conn)
print(df.describe())
print(df.isnull().sum())

# 2. Feature engineering (zamanın %30'ı)
df['gun_farki'] = (bugun - df['son_alisveris']).dt.days
df['ort_sepet'] = df['toplam'] / df['siparis_sayisi']

# 3. Model (zamanın %20'si)
model = RandomForestClassifier(n_estimators=100)
scores = cross_val_score(model, X, y, cv=5, scoring='roc_auc')
print(f"AUC: {scores.mean():.3f} ± {scores.std():.3f}")

# 4. Sunum (zamanın %10'u)`}</pre>

        <h2>ML Engineer: production&apos;a taşır</h2>
        <p>
          ML engineer&apos;ın sorusu: <strong>&quot;Nasıl ölçeklenir?&quot;</strong>
          Data scientist modeli geliştirdi, peki bu model günde milyonlarca istek
          alacak şekilde nasıl çalıştırılır? Nasıl izlenir? Bozulunca ne olur?
        </p>
        <p>
          Yazılım mühendisliği + ML bilgisi gerektiren bir rol. Docker, Kubernetes,
          API geliştirme, model versiyonlama, A/B test altyapısı — bunlar ML engineer&apos;ın dünyası.
          Türkiye&apos;de nadir bulunan ama çok aranan profil.
        </p>
        <p>
          <strong>Türkiye&apos;de maaş aralığı:</strong> 80.000 — 180.000 TL.
          Yurt dışında remote: $120K — $200K+.
        </p>

        <pre>{`# ML Engineer: modeli API'ye çevir
from fastapi import FastAPI
import mlflow.pyfunc
import pandas as pd

app = FastAPI()
model = mlflow.pyfunc.load_model("models:/churn_model/production")

@app.post("/predict")
async def predict(data: dict):
    df = pd.DataFrame([data])
    prediction = model.predict(df)
    probability = model.predict_proba(df)[:, 1]
    return {
        "churn": bool(prediction[0]),
        "probability": float(probability[0]),
        "model_version": "v2.3.1"
    }

# Docker ile konteynerize et
# Kubernetes ile ölçekle
# MLflow ile versiyonla
# Prometheus ile izle`}</pre>

        <h2>Hangisi sana uygun?</h2>

        <p><strong>Veri Analisti ol eğer:</strong></p>
        <ul>
          <li>İş problemlerini çözmek teknik derinlikten daha çok ilgini çekiyorsa</li>
          <li>Veriden hikaye çıkarmayı, sunum yapmayı seviyorsan</li>
          <li>SQL ve Excel ile rahatsan, Python öğrenmek istiyorsun ama zorlanıyorsan</li>
          <li>Hızlı iş bulmak istiyorsan — en fazla açık pozisyon bu rolde</li>
        </ul>

        <p><strong>Data Scientist ol eğer:</strong></p>
        <ul>
          <li>İstatistik ve matematik seni heyecanlandırıyorsa</li>
          <li>Python ile rahatsan ve ML algoritmalarını anlamak istiyorsan</li>
          <li>Belirsizlikle çalışmaktan çekinmiyorsan — araştırma odaklı iş</li>
          <li>Akademik geçmişin varsa veya sayısal bir bölüm mezunuysan</li>
        </ul>

        <p><strong>ML Engineer ol eğer:</strong></p>
        <ul>
          <li>Yazılım geliştirme geçmişin varsa</li>
          <li>Sistemlerin nasıl çalıştığını anlamak istiyorsan — cloud, API, DevOps</li>
          <li>En yüksek maaşı hedefliyorsan</li>
          <li>Hem kod hem ML bilgisini birleştirmek istiyorsan</li>
        </ul>

        <h2>Türkiye&apos;de gerçek durum</h2>
        <p>
          Yurt dışındaki net rol ayrımları Türkiye&apos;de çok daha bulanık.
          Küçük ve orta ölçekli şirketlerde tek kişi hem analiz yapıyor,
          hem model kuruyor, hem dashboard hazırlıyor. &quot;Data Scientist&quot; unvanıyla
          işe alınan kişi aslında veri analisti işi yapıyor.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            İş ilanındaki unvana değil, iş tanımındaki maddelere bak.
            &quot;Data Scientist&quot; yazıyor ama görevlerde sadece Excel ve Power BI
            görüyorsan, aslında analist arıyorlar.
          </p>
        </blockquote>

        <h2>Geçiş mümkün mü?</h2>
        <p>
          Kesinlikle evet, ve çoğu zaman bu yönde ilerlemek mantıklı:
        </p>
        <ul>
          <li><strong>Analisti → Data Scientist:</strong> Python ve istatistik öğren, kaggle projesi yap, portföy oluştur. 6-12 ay ciddi çalışma ile geçilebilir.</li>
          <li><strong>Data Scientist → ML Engineer:</strong> Docker, FastAPI, cloud sertifikasyonu al. Yazılım mühendisliği pratiklerini öğren. 1-2 yıl.</li>
          <li><strong>Yazılım Geliştirici → ML Engineer:</strong> En kolay yol. Zaten kod yazıyorsun, ML ekle. 6-12 ay.</li>
          <li><strong>Analisti → Analytics Engineer:</strong> dbt öğren, SQL&apos;i derinleştir. 3-6 ay. Popüler geçiş yolu.</li>
        </ul>

        <h2>Başlangıç için önerilen yol</h2>
        <p>
          Kariyerine yeni başlıyorsan öneri şu:
        </p>
        <ul>
          <li><strong>1. SQL öğren</strong> — her rolde lazım, pazarlık yok</li>
          <li><strong>2. Excel/Power BI ile bir dashboard yap</strong> — iş dünyasında anında değer yaratır</li>
          <li><strong>3. Python temeli at</strong> — pandas, numpy, matplotlib</li>
          <li><strong>4. İlk işi analist olarak al</strong> — iş bağlamını öğrenmek için en iyi yer</li>
          <li><strong>5. Sonra uzmanlaş</strong> — veriyi anlayınca hangi yönde gideceğin netleşir</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki kariyer yazısında: <strong>Veri bilimi mülakatına nasıl hazırlanılır</strong> —
          teknik sorular, davranışsal sorular ve portföy hazırlığı.
        </p>
      </article>
    </main>
  );
}
