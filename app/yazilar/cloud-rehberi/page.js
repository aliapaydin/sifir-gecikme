export const metadata = {
  title: 'Veri Bilimcisi için Cloud: GCP mi AWS mi? Hangisi Ne İşe Yarar?',
  description: 'BigQuery vs Redshift, Vertex AI vs SageMaker, GCS vs S3. Veri bilimcisi gözünden GCP ve AWS servislerini karşılaştırıyoruz.',
  keywords: ['gcp veri bilimi', 'aws veri bilimi', 'bigquery vs redshift', 'vertex ai vs sagemaker', 'cloud veri bilimi türkçe'],
};

function ServisKart({ isim, aciklama, renk, bg, etiket }) {
  return (
    <div style={{
      background: bg, borderRadius: '10px', padding: '14px 16px',
      border: `1px solid ${renk}30`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: renk, background: `${renk}20`, padding: '2px 8px', borderRadius: '999px' }}>{etiket}</span>
      </div>
      <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--color-text)', marginBottom: '4px' }}>{isim}</div>
      <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.55' }}>{aciklama}</div>
    </div>
  );
}

function KarsilastirmaTablosu({ basliklar, satirlar }) {
  return (
    <div style={{ overflowX: 'auto', margin: '1.5rem 0', borderRadius: '12px', border: '0.5px solid var(--color-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: 'var(--color-cream-card)' }}>
            {basliklar.map((b, i) => (
              <th key={i} style={{
                padding: '10px 14px', textAlign: 'left', fontWeight: 600,
                color: 'var(--color-text)', borderBottom: '0.5px solid var(--color-border)',
                whiteSpace: 'nowrap',
              }}>{b}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {satirlar.map((satir, i) => (
            <tr key={i} style={{ borderBottom: i < satirlar.length - 1 ? '0.5px solid var(--color-border)' : 'none' }}>
              {satir.map((hucre, j) => (
                <td key={j} style={{
                  padding: '10px 14px', color: j === 0 ? 'var(--color-text)' : 'var(--color-text-soft)',
                  fontWeight: j === 0 ? 500 : 400, lineHeight: '1.5',
                }}>{hucre}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CloudRehberi() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Veri bilimcisi için cloud: GCP mi AWS mi?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2026 · cloud · veri mühendisliği · 18 dakika okuma
        </p>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: '1.8', color: 'var(--color-text)', marginBottom: '1.5rem' }}>
          İş ilanlarına bak: çoğunda "AWS veya GCP deneyimi tercih sebebi" yazar.
          Peki hangisini öğreneceksin? Hangisi ne işe yarar?
          Veri bilimcisi gözünden, pratik örneklerle anlatalım.
        </p>

        <h2>Önce şunu söyleyelim</h2>
        <p>
          GCP ve AWS arasındaki seçim çoğu zaman şirkete göre değişir — ekibin ne kullandığına
          bak. Ama servis mantığını anlarsan birinden diğerine geçmek 2-3 haftada olur.
          Kavramlar aynı, isimler farklı.
        </p>
        <p>
          Bu rehberde veri bilimcisinin en çok karşılaştığı 6 kategoriyi işleyeceğiz:
          depolama, veri ambarı, notebook ortamı, ML platformu, pipeline/ETL ve maliyet.
        </p>

        <h2>1. Depolama — S3 vs Cloud Storage</h2>
        <p>
          Her veri projesinin ilk adımı: veriyi bir yere koymak. Ham CSV, Parquet dosyaları,
          model artifact'ları, log dosyaları — hepsi nesne depolama alanına gider.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          <ServisKart
            etiket="AWS"
            isim="Amazon S3"
            aciklama="Piyasanın standardı. Neredeyse her açık kaynak araç S3'ü destekler. Bucket → prefix → nesne hiyerarşisi."
            renk="#FF9900"
            bg="rgba(255,153,0,0.10)"
          />
          <ServisKart
            etiket="GCP"
            isim="Cloud Storage (GCS)"
            aciklama="S3 ile neredeyse birebir aynı mantık. BigQuery ile entegrasyonu çok daha pürüzsüz. gsutil veya gcloud CLI ile yönetilir."
            renk="#4285F4"
            bg="rgba(66,133,244,0.10)"
          />
        </div>

        <pre>{`# AWS S3 — veri yükleme
aws s3 cp veri.parquet s3://bucket-adim/raw/veri.parquet
aws s3 sync ./data/ s3://bucket-adim/processed/

# GCP Cloud Storage — aynı işlem
gsutil cp veri.parquet gs://bucket-adim/raw/veri.parquet
gsutil -m rsync -r ./data/ gs://bucket-adim/processed/`}</pre>

        <p>
          Python'da her ikisi de benzer şekilde kullanılır:
        </p>

        <pre>{`# AWS — boto3
import boto3
s3 = boto3.client('s3')
s3.upload_file('veri.csv', 'bucket-adim', 'raw/veri.csv')

# GCP — google-cloud-storage
from google.cloud import storage
client = storage.Client()
bucket = client.bucket('bucket-adim')
bucket.blob('raw/veri.csv').upload_from_filename('veri.csv')`}</pre>

        <div style={{ background: 'var(--color-cream-card)', border: '0.5px solid var(--color-border)', borderRadius: '12px', padding: '16px 20px', margin: '1.5rem 0' }}>
          <strong style={{ fontSize: '13px', color: 'var(--color-text)' }}>Ne seçmeli?</strong>
          <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', margin: '6px 0 0' }}>
            BigQuery kullanacaksan GCS daha kolay. Diğer her şey için S3 — ekosistem daha geniş,
            Stack Overflow'daki cevap sayısı 3 kat fazla.
          </p>
        </div>

        <h2>2. Veri Ambarı — BigQuery vs Redshift</h2>
        <p>
          Veri bilimcisinin en çok zaman geçirdiği yer. Petabyte ölçeğinde SQL,
          hızlı analiz, BI araçlarına bağlantı.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          <ServisKart
            etiket="GCP"
            isim="BigQuery"
            aciklama="Serverless — cluster yönetimi yok. Sorgulayan veri kadar öde. Çok büyük sorgular için genellikle daha ucuz ve hızlı."
            renk="#4285F4"
            bg="rgba(66,133,244,0.10)"
          />
          <ServisKart
            etiket="AWS"
            isim="Redshift"
            aciklama="Cluster tabanlı — saatlik ödeme. Sürekli yük varsa maliyet daha öngörülebilir. Redshift Serverless de var artık."
            renk="#FF9900"
            bg="rgba(255,153,0,0.10)"
          />
        </div>

        <KarsilastirmaTablosu
          basliklar={['Özellik', 'BigQuery', 'Redshift']}
          satirlar={[
            ['Fiyat modeli', 'Taranan veri başına ($5/TB)', 'Saatlik cluster veya serverless'],
            ['Kurulum', 'Sıfır — hemen kullan', 'Cluster oluşturman gerekir'],
            ['ML entegrasyonu', 'BigQuery ML — SQL ile model eğit', 'Redshift ML — SageMaker entegrasyonu'],
            ['Coğrafi dağılım', 'Bölgeden bağımsız sorgulama', 'Bölgeye bağlı'],
            ['dbt uyumu', 'Çok iyi', 'Çok iyi'],
            ['Ücretsiz katman', '10 GB depo + 1 TB/ay sorgu', '2 ay ücretsiz DC2.Large'],
          ]}
        />

        <p>BigQuery'nin en büyük avantajı: SQL ile doğrudan ML modeli eğitebilirsin.</p>

        <pre>{`-- BigQuery ML — SQL ile lojistik regresyon
CREATE OR REPLACE MODEL dataset.churn_model
OPTIONS(
  model_type = 'LOGISTIC_REG',
  input_label_cols = ['is_churned'],
  auto_class_weights = TRUE
) AS
SELECT
  kullanici_yasi,
  son_30_gun_giris,
  odeme_gecikme_sayisi,
  plan_tipi,
  is_churned
FROM dataset.kullanici_ozellikleri
WHERE tarih < '2025-01-01';

-- Tahmin yap
SELECT *
FROM ML.PREDICT(
  MODEL dataset.churn_model,
  (SELECT * FROM dataset.yeni_kullanicilar)
);`}</pre>

        <h2>3. Notebook Ortamı — Colab vs SageMaker Studio</h2>
        <p>
          Keşif analizi, model geliştirme, prototip oluşturma — bunların hepsi
          notebook ortamında olur.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          <ServisKart
            etiket="GCP"
            isim="Vertex AI Workbench / Colab Enterprise"
            aciklama="Google Colab'ın kurumsal versiyonu. GCS ve BigQuery ile sıfır config entegrasyon. GPU'lu notebook kolayca açılıyor."
            renk="#4285F4"
            bg="rgba(66,133,244,0.10)"
          />
          <ServisKart
            etiket="AWS"
            isim="SageMaker Studio"
            aciklama="Tam entegre ML IDE. Notebook, deney takibi, model deployu tek çatı altında. Öğrenmesi biraz zaman alır."
            renk="#FF9900"
            bg="rgba(255,153,0,0.10)"
          />
        </div>

        <p>
          İkisinde de temel kullanım aynı — Jupyter notebook. Fark ortamın nasıl
          kurulduğunda ve servislerle entegrasyonda.
        </p>

        <pre>{`# SageMaker Studio'da S3'ten veri okuma
import boto3
import pandas as pd

s3 = boto3.client('s3')
obj = s3.get_object(Bucket='bucket-adim', Key='data/egitim.csv')
df = pd.read_csv(obj['Body'])

# Vertex AI Workbench'te GCS'ten veri okuma
from google.cloud import storage
import pandas as pd

client = storage.Client()
df = pd.read_csv('gs://bucket-adim/data/egitim.csv')
# ya da daha kısa:
df = pd.read_gbq('SELECT * FROM dataset.tablo', project_id='proje-id')`}</pre>

        <h2>4. ML Platformu — Vertex AI vs SageMaker</h2>
        <p>
          Model eğitimi, hyperparametre optimizasyonu, deney takibi, model servise alma —
          bunlar için managed ML platformu kullanmak işleri kolaylaştırır.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          <ServisKart
            etiket="GCP"
            isim="Vertex AI"
            aciklama="Unified ML platform. AutoML, custom training, model registry, feature store, pipeline — hepsi tek API altında. 2021'de yenilendi, temiz arayüzü var."
            renk="#4285F4"
            bg="rgba(66,133,244,0.10)"
          />
          <ServisKart
            etiket="AWS"
            isim="Amazon SageMaker"
            aciklama="Piyasanın en olgun ML platformu. Onlarca özellik — bazen kafa karıştırıcı olabiliyor. Autopilot, Pipelines, Model Monitor, Clarify dahil."
            renk="#FF9900"
            bg="rgba(255,153,0,0.10)"
          />
        </div>

        <pre>{`# Vertex AI — özel eğitim işi başlatma
from google.cloud import aiplatform

aiplatform.init(project='proje-id', location='europe-west4')

job = aiplatform.CustomTrainingJob(
    display_name='churn-modeli',
    script_path='train.py',
    container_uri='europe-docker.pkg.dev/vertex-ai/training/sklearn-cpu.1-0:latest',
    requirements=['pandas', 'scikit-learn'],
)

model = job.run(
    dataset=dataset,
    replica_count=1,
    machine_type='n1-standard-4',
    args=['--epochs', '50', '--lr', '0.001'],
)`}</pre>

        <pre>{`# SageMaker — aynı işlem
import sagemaker
from sagemaker.sklearn import SKLearn

estimator = SKLearn(
    entry_point='train.py',
    framework_version='1.2-1',
    instance_type='ml.m5.xlarge',
    instance_count=1,
    role=sagemaker.get_execution_role(),
    hyperparameters={'epochs': 50, 'lr': 0.001},
)

estimator.fit({'train': 's3://bucket/data/egitim'})`}</pre>

        <KarsilastirmaTablosu
          basliklar={['Özellik', 'Vertex AI', 'SageMaker']}
          satirlar={[
            ['Olgunluk', 'Daha yeni, temiz API', 'Daha eski, daha geniş ekosistem'],
            ['AutoML', 'Vertex AutoML — tablolar, görüntü, NLP', 'Autopilot — tablolar odaklı'],
            ['Feature Store', 'Vertex Feature Store', 'SageMaker Feature Store'],
            ['MLflow uyumu', 'Vertex Experiments (MLflow benzeri)', 'MLflow doğrudan destekleniyor'],
            ['Model deployment', 'Vertex Prediction endpoints', 'SageMaker Endpoints'],
            ['Fiyat', 'Kullanım bazlı', 'Kullanım bazlı'],
          ]}
        />

        <h2>5. Pipeline ve ETL — Dataflow vs Glue</h2>
        <p>
          Verinin bir yerden alınıp başka bir yere dönüştürülerek taşınması — ETL.
          Büyük ölçekte bunu yönetmek için managed servisler.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          <ServisKart
            etiket="GCP"
            isim="Dataflow + Cloud Composer"
            aciklama="Dataflow: Apache Beam tabanlı, batch ve streaming için. Cloud Composer: yönetilen Apache Airflow — pipeline orkestrasyon için."
            renk="#4285F4"
            bg="rgba(66,133,244,0.10)"
          />
          <ServisKart
            etiket="AWS"
            isim="AWS Glue + MWAA"
            aciklama="Glue: serverless Spark ETL, Data Catalog dahil. MWAA: yönetilen Airflow. Step Functions ile de pipeline kurulabilir."
            renk="#FF9900"
            bg="rgba(255,153,0,0.10)"
          />
        </div>

        <pre>{`# AWS Glue — basit ETL scripti
import sys
from awsglue.context import GlueContext
from pyspark.context import SparkContext

sc = SparkContext()
glueContext = GlueContext(sc)

# S3'ten veri oku
datasource = glueContext.create_dynamic_frame.from_catalog(
    database='veritabanim',
    table_name='ham_satislar'
)

# Dönüştür
from awsglue.transforms import ApplyMapping
donusturulmus = ApplyMapping.apply(
    frame=datasource,
    mappings=[
        ('satis_id', 'string', 'satis_id', 'string'),
        ('tutar', 'string', 'tutar', 'double'),
        ('tarih', 'string', 'tarih', 'date'),
    ]
)

# Redshift'e yaz
glueContext.write_dynamic_frame.from_jdbc_conf(
    frame=donusturulmus,
    catalog_connection='redshift-baglantim',
    connection_options={'dbtable': 'temiz_satislar', 'database': 'analizdb'},
)`}</pre>

        <h2>6. Hangi senaryoda hangisi?</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '1.5rem 0' }}>
          {[
            {
              senaryo: 'Büyük SQL analizleri, ad-hoc sorgular',
              tercih: 'BigQuery (GCP)',
              neden: 'Serverless, taranan veri başına ödeme — büyük veri ucuza gelir',
              renk: '#4285F4', bg: 'rgba(66,133,244,0.10)',
            },
            {
              senaryo: 'Kurumsal ML pipeline\'ı, A/B testi',
              tercih: 'SageMaker (AWS)',
              neden: 'En olgun ekosistem, MLOps araçları hazır',
              renk: '#FF9900', bg: 'rgba(255,153,0,0.10)',
            },
            {
              senaryo: 'Hızlı prototip, GPU\'lu notebook',
              tercih: 'Colab Enterprise (GCP)',
              neden: 'BigQuery + GCS entegrasyonu sıfır config',
              renk: '#4285F4', bg: 'rgba(66,133,244,0.10)',
            },
            {
              senaryo: 'Startup — her şey için bir ekosistem',
              tercih: 'AWS',
              neden: 'En geniş servis kataloğu, en fazla kaynak/topluluk',
              renk: '#FF9900', bg: 'rgba(255,153,0,0.10)',
            },
            {
              senaryo: 'Analytics engineering + dbt',
              tercih: 'GCP + BigQuery',
              neden: 'dbt + BigQuery kombinasyonu sektörde popüler ve hızlı',
              renk: '#4285F4', bg: 'rgba(66,133,244,0.10)',
            },
            {
              senaryo: 'Mevcut ekip AWS kullanıyor',
              tercih: 'AWS',
              neden: 'Geçiş maliyeti seçim kriterinden ağır basar',
              renk: '#FF9900', bg: 'rgba(255,153,0,0.10)',
            },
          ].map(({ senaryo, tercih, neden, renk, bg }) => (
            <div key={senaryo} style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              background: bg, borderRadius: '10px', padding: '14px 16px',
              border: `1px solid ${renk}25`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '3px' }}>{senaryo}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{neden}</div>
              </div>
              <div style={{
                flexShrink: 0, fontSize: '12px', fontWeight: 700,
                color: renk, background: `${renk}15`,
                padding: '4px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
              }}>{tercih}</div>
            </div>
          ))}
        </div>

        <h2>Ücretsiz başlamak</h2>
        <p>Her iki platform da ücretsiz katmanla başlamana izin veriyor:</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '1.5rem 0' }}>
          <div style={{ background: 'rgba(66,133,244,0.10)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: 600, color: '#4285F4', marginBottom: '10px', fontSize: '15px' }}>GCP Ücretsiz Katman</div>
            {[
              'BigQuery: 1 TB/ay ücretsiz sorgu',
              'Cloud Storage: 5 GB ücretsiz',
              'Vertex AI Workbench: sınırlı ücretsiz',
              '$300 başlangıç kredisi (90 gün)',
            ].map(m => (
              <div key={m} style={{ fontSize: '12.5px', color: 'var(--color-text-soft)', marginBottom: '5px', display: 'flex', gap: '6px' }}>
                <span style={{ color: '#4285F4', flexShrink: 0 }}>✓</span> {m}
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,153,0,0.10)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: 600, color: '#FF9900', marginBottom: '10px', fontSize: '15px' }}>AWS Ücretsiz Katman</div>
            {[
              'S3: 5 GB depolama (12 ay)',
              'SageMaker Studio Lab: ücretsiz notebook',
              'Athena: 5 TB/ay ücretsiz sorgu',
              '$300 başlangıç kredisi',
            ].map(m => (
              <div key={m} style={{ fontSize: '12.5px', color: 'var(--color-text-soft)', marginBottom: '5px', display: 'flex', gap: '6px' }}>
                <span style={{ color: '#FF9900', flexShrink: 0 }}>✓</span> {m}
              </div>
            ))}
          </div>
        </div>

        <blockquote style={{ borderLeft: '3px solid #1D9E75', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0, fontFamily: 'var(--font-serif)', fontSize: '17px', lineHeight: '1.7' }}>
            Başlangıç için tavsiyem: GCP ücretsiz katmanından BigQuery'e gir,
            birkaç GB'lık açık veri setiyle SQL yaz. Hem serverless demek ne demek anlarsın,
            hem de BigQuery'nin hızına şaşırırsın.
          </p>
        </blockquote>

        <h2>Özet — Hızlı Referans</h2>

        <KarsilastirmaTablosu
          basliklar={['Kategori', 'GCP Servisi', 'AWS Servisi']}
          satirlar={[
            ['Nesne depolama', 'Cloud Storage (GCS)', 'Amazon S3'],
            ['Veri ambarı', 'BigQuery', 'Redshift'],
            ['Notebook', 'Colab Enterprise / Workbench', 'SageMaker Studio'],
            ['ML platformu', 'Vertex AI', 'SageMaker'],
            ['Batch ETL', 'Dataflow / Dataproc', 'Glue / EMR'],
            ['Pipeline orkestrasyon', 'Cloud Composer (Airflow)', 'MWAA (Airflow)'],
            ['Streaming', 'Pub/Sub + Dataflow', 'Kinesis + Lambda'],
            ['Data catalog', 'Dataplex', 'Glue Data Catalog'],
            ['BI araçları', 'Looker Studio', 'QuickSight'],
          ]}
        />

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sonraki adım: <a href="/yazilar/etl-nedir" style={{ color: '#1D9E75', textDecoration: 'none' }}>ETL nedir? Veriyi taşımanın sistematik yolu →</a>
        </p>
      </article>
    </main>
  );
}
