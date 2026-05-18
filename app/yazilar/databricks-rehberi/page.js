import { LakehouseDiyagram, ClusterKarsilastirici, DeltaOps, MedallionMimari, MaliyetIpuclari } from './DatabricksDemo';

export const metadata = {
  title: 'Databricks Kullanım Rehberi — Sıfır Gecikme',
  description: 'Databricks\'e sıfırdan başla: Lakehouse mimarisi, Delta Lake, PySpark, Medallion pattern, MLflow ve maliyet optimizasyonu.',
  keywords: ['databricks', 'delta lake', 'apache spark', 'lakehouse', 'databricks türkçe', 'pyspark', 'databricks rehberi'],
  openGraph: {
    title: 'Databricks Kullanım Rehberi — Sıfır Gecikme',
    description: 'Delta Lake, Medallion mimarisi, PySpark, MLflow entegrasyonu. Türkçe kapsamlı rehber.',
  },
};

export default function DatabricksRehberi() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-guide inline-block mb-3">rehber</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Databricks kullanım rehberi
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2025 · 30 dakika okuma · Databricks Community Edition ile başlayabilirsin
        </p>

        <p>
          Veri mühendisliği, veri bilimi ve makine öğrenmesi — genellikle üç farklı araç,
          üç farklı ekip, birbiriyle konuşmayan üç pipeline. Databricks bu üçünü tek bir
          platformda toplamak için kuruldu.
        </p>
        <p>
          Bu rehberde Databricks&apos;i sıfırdan kavrayacak, Delta Lake&apos;i ve
          Medallion mimarisini anlayacak, PySpark ile veri işleyecek, MLflow ile
          deney takip edecek ve maliyet tuzaklarından kaçınacaksın.
        </p>

        <h2>Databricks nedir?</h2>
        <p>
          Databricks, Apache Spark&apos;ın yaratıcıları tarafından kurulan bir şirketin
          geliştirdiği <strong>birleşik analitik platformu</strong>. Altta Spark çalışır,
          ama Databricks onun üzerine şunları ekler:
        </p>
        <ul>
          <li><strong>Delta Lake</strong> — ACID işlemler destekleyen açık formatlı depolama katmanı</li>
          <li><strong>Photon Engine</strong> — SQL sorgularını hızlandıran C++ tabanlı vectorized execution engine</li>
          <li><strong>Unity Catalog</strong> — merkezi veri yönetimi ve erişim kontrolü</li>
          <li><strong>MLflow</strong> — model deneyi takibi ve deployment</li>
          <li><strong>Notebooks</strong> — Python, SQL, Scala, R desteği tek arayüzde</li>
        </ul>

        <p>
          AWS (EMR), Azure (Synapse) veya GCP (Dataproc) ile de Spark kullanabilirsin —
          ama Databricks bunların üzerinde çalışan, yönetilen ve optimize edilmiş bir katman
          sunar. Fiyat farkı vardır; karşılığında ciddi operasyonel kolaylık alırsın.
        </p>

        <h2>Lakehouse mimarisi</h2>
        <p>
          Geleneksel yaklaşımda Data Warehouse (yapılandırılmış, pahalı, esnek değil) ile
          Data Lake (ham, ucuz, ama yönetilmesi zor) arasında seçim yapılırdı.
          <strong> Lakehouse</strong>, ikisinin güçlü yanlarını birleştiriyor: Data Lake&apos;in
          düşük maliyetli depolaması + Data Warehouse&apos;un ACID işlemleri ve performansı.
        </p>

        <LakehouseDiyagram />

        <p>
          Katmanlara tıklayarak ne içerdiğini görebilirsin. Temel fikir:
          her şey açık formatta (Delta Lake → Parquet + transaction log) depolanıyor,
          farklı motorlar aynı veriyi okuyabiliyor.
        </p>

        <h2>İlk adımlar: Community Edition</h2>
        <p>
          Databricks&apos;i denemek için kredi kartı gerekmez.
          <strong> Community Edition</strong> ücretsiz, sınırlı ama öğrenmek için yeterli.
        </p>

        <pre>{`# 1. community.cloud.databricks.com adresine git
# 2. Hesap oluştur (Google ile giriş yapabilirsin)
# 3. Compute → Create Cluster
#    Runtime: 14.3 LTS (Scala 2.12, Spark 3.5.0)
#    Node Type: Community Edition otomatik seçer
# 4. Cluster başlaması ~3-5 dakika sürer
# 5. New → Notebook → Python seç
# 6. Hazırsın!

# İlk test — Spark çalışıyor mu?
spark.version`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Community Edition&apos;da cluster başlattıktan 2 saat sonra otomatik kapanır.
            Çalışmanı kaybet memek için DBFS&apos;e veya GitHub&apos;a düzenli commit yap.
          </p>
        </blockquote>

        <h2>Cluster türleri</h2>
        <p>
          Databricks&apos;te hangi cluster&apos;ı ne zaman kullanacağını bilmek hem
          doğru sonuç hem de düşük maliyet için kritik.
        </p>

        <ClusterKarsilastirici />

        <pre>{`# Cluster yapılandırması — Terraform ile Infrastructure as Code
resource "databricks_cluster" "etl_cluster" {
  cluster_name            = "etl-prod"
  spark_version           = "14.3.x-scala2.12"
  node_type_id            = "m5d.2xlarge"          # AWS

  autoscale {
    min_workers = 2
    max_workers = 10                                # iş yüküne göre scale
  }

  auto_termination_minutes = 30                     # 30 dk boşta → kapat

  aws_attributes {
    availability          = "SPOT_WITH_FALLBACK"    # önce spot, yoksa on-demand
    first_on_demand       = 1                        # driver always on-demand
    spot_bid_price_percent = 80
  }

  spark_conf = {
    "spark.databricks.delta.optimizeWrite.enabled" = "true"
    "spark.databricks.delta.autoCompact.enabled"   = "true"
  }
}`}</pre>

        <h2>Notebook temelleri</h2>
        <p>
          Databricks Notebook&apos;lar Jupyter&apos;a benzer ama Spark entegrasyonu
          hazır gelir. <code>spark</code> ve <code>dbutils</code> nesneleri her
          notebook&apos;ta otomatik tanımlıdır.
        </p>

        <pre>{`# spark: SparkSession otomatik tanımlı
df = spark.read.format("csv") \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .load("/databricks-datasets/airlines/")

df.printSchema()
display(df.limit(10))          # Databricks'e özel güzel tablo görünümü

# dbutils: dosya sistemi, gizli anahtarlar, widget'lar
dbutils.fs.ls("/databricks-datasets/")
dbutils.secrets.get(scope="prod", key="api_key")

# Magic komutlar
# %sql   → SQL hücresi
# %md    → Markdown
# %sh    → Shell komutu
# %pip   → Paket yükle
# %run   → Başka notebook çalıştır`}</pre>

        <pre>{`%sql
-- Aynı notebook'ta SQL
SELECT origin, COUNT(*) as ucus_sayisi
FROM airlines
GROUP BY origin
ORDER BY ucus_sayisi DESC
LIMIT 20`}</pre>

        <h2>Delta Lake</h2>
        <p>
          Delta Lake, Databricks&apos;in kalbindeki depolama formatı. Parquet&apos;ın
          üzerine bir transaction log (<code>_delta_log/</code>) ekler —
          bu sayede ACID garantisi, time travel ve schema evolution kazanırsın.
        </p>

        <DeltaOps />

        <pre>{`# Delta tablosu oluştur — Python
df.write.format("delta") \
    .mode("overwrite") \
    .partitionBy("siparis_yili", "siparis_ayi") \
    .save("/delta/siparisler")

# Veya Spark SQL
CREATE TABLE IF NOT EXISTS siparisler
USING DELTA
PARTITIONED BY (siparis_yili, siparis_ayi)
AS SELECT * FROM json.'/landing/siparisler/';

# Tabloya kaydet
spark.sql("""
  CREATE TABLE IF NOT EXISTS siparisler
  LOCATION '/delta/siparisler'
""")

# Tablo özelliklerini gör
DESCRIBE DETAIL siparisler;
-- numFiles, sizeInBytes, partitionColumns, minWriterVersion...`}</pre>

        <h2>Medallion mimarisi</h2>
        <p>
          Databricks&apos;te veri katmanlandırması için endüstri standardı yaklaşım.
          Her katmanın kendi amacı, dönüşüm mantığı ve kalite beklentisi vardır.
        </p>

        <MedallionMimari />

        <pre>{`# Bronze → Silver dönüşümü örneği
from pyspark.sql import functions as F
from pyspark.sql.types import TimestampType

# Bronze: ham JSON verisi
bronze_df = spark.read.format("delta").load("/delta/bronze/siparisler")

# Silver: temizle, doğrula, normalize et
silver_df = (
    bronze_df
    # Duplikat temizle (aynı sipariş_id tekrar işlendiyse)
    .dropDuplicates(["siparis_id"])
    # NULL kritik alanları filtrele
    .filter(F.col("musteri_id").isNotNull())
    .filter(F.col("tutar") > 0)
    # Tip dönüşümleri
    .withColumn("siparis_tarihi", F.to_timestamp("siparis_tarihi_str"))
    .withColumn("tutar",          F.col("tutar").cast("double"))
    # Derived columns
    .withColumn("siparis_yili",   F.year("siparis_tarihi"))
    .withColumn("siparis_ayi",    F.month("siparis_tarihi"))
    # İşlenme metadata
    .withColumn("_silver_ts",     F.current_timestamp())
    .drop("siparis_tarihi_str")   # ham string artık gereksiz
)

silver_df.write.format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .partitionBy("siparis_yili", "siparis_ayi") \
    .save("/delta/silver/siparisler")`}</pre>

        <pre>{`# Silver → Gold: iş metriklerini hazırla
gold_df = (
    spark.read.format("delta").load("/delta/silver/siparisler")
    .join(
        spark.read.format("delta").load("/delta/silver/musteriler"),
        on="musteri_id", how="left"
    )
    .groupBy("musteri_id", "musteri_segmenti", "siparis_yili", "siparis_ayi")
    .agg(
        F.count("siparis_id").alias("siparis_sayisi"),
        F.sum("tutar").alias("toplam_tutar"),
        F.avg("tutar").alias("ort_tutar"),
        F.countDistinct("urun_id").alias("benzersiz_urun"),
    )
)

gold_df.write.format("delta") \
    .mode("overwrite") \
    .save("/delta/gold/musteri_aylik_ozet")`}</pre>

        <h2>PySpark ile veri işleme</h2>
        <p>
          Databricks&apos;te PySpark, Pandas&apos;tan daha yaygın — çünkü milyarlarca
          satırı dağıtık işleyebilir. Temel dönüşümler Pandas&apos;a benzer ama
          lazy evaluation ile çalışır: <code>collect()</code> veya <code>display()</code>
          çağırılana kadar hiçbir şey gerçekten işlenmez.
        </p>

        <pre>{`from pyspark.sql import functions as F, Window

df = spark.read.format("delta").load("/delta/silver/siparisler")

# ─── Temel dönüşümler ────────────────────────────────
df.select("musteri_id", "tutar", "siparis_tarihi")
df.filter(F.col("tutar") > 100)
df.withColumn("kdvli_tutar", F.col("tutar") * 1.20)
df.groupBy("musteri_id").agg(F.sum("tutar").alias("toplam"))
df.orderBy(F.col("tutar").desc())

# ─── Window fonksiyonlar ─────────────────────────────
w = Window.partitionBy("musteri_id").orderBy("siparis_tarihi")

df.withColumn("onceki_siparis",   F.lag("tutar", 1).over(w)) \
  .withColumn("kumulatif_tutar",  F.sum("tutar").over(w))   \
  .withColumn("siparis_no",       F.row_number().over(w))

# ─── Pandas API (küçük veri) ─────────────────────────
# Spark 3.2+ ile Pandas API doğrudan kullanılabilir
import pyspark.pandas as ps
psdf = ps.read_delta("/delta/silver/siparisler")
psdf.describe()                    # Pandas sözdizimiyle!

# ─── UDF (User Defined Function) ─────────────────────
from pyspark.sql.types import StringType

@F.udf(returnType=StringType())
def segment_belirle(tutar):
    if tutar is None: return "bilinmiyor"
    if tutar > 10000: return "premium"
    if tutar > 1000:  return "standart"
    return "basic"

df.withColumn("segment", segment_belirle(F.col("tutar")))`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Python UDF&apos;ler Spark&apos;ın JVM&apos;ini her satır için terk ettiğinden yavaştır.
            Mümkünse built-in <code>pyspark.sql.functions</code> kullan. Mecbur kalırsan
            Pandas UDF (<code>@F.pandas_udf</code>) kullan — çok daha hızlı.
          </p>
        </blockquote>

        <h2>Structured Streaming</h2>
        <p>
          Databricks&apos;in en güçlü özelliklerinden biri: aynı PySpark kodu
          hem batch hem streaming için çalışır. Kafka, Kinesis, Event Hub veya
          Delta tablosunu kaynak olarak kullanabilirsin.
        </p>

        <pre>{`# Kafka'dan gerçek zamanlı okuma
stream_df = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "broker:9092")
    .option("subscribe", "siparis-olaylari")
    .option("startingOffsets", "latest")
    .load()
)

# JSON parse et
from pyspark.sql.types import StructType, StructField, StringType, DoubleType

siparis_schema = StructType([
    StructField("siparis_id",  StringType()),
    StructField("musteri_id",  StringType()),
    StructField("tutar",       DoubleType()),
])

parsed_df = stream_df.select(
    F.from_json(F.col("value").cast("string"), siparis_schema).alias("data")
).select("data.*")

# Delta tablosuna yaz — continuous micro-batch
query = (
    parsed_df.writeStream
    .format("delta")
    .outputMode("append")
    .option("checkpointLocation", "/delta/checkpoints/siparisler")
    .trigger(processingTime="30 seconds")    # her 30 sn'de bir işle
    .start("/delta/bronze/siparisler")
)

# Aktif stream'leri izle
spark.streams.active`}</pre>

        <h2>Databricks SQL</h2>
        <p>
          SQL tabanlı analistler için Databricks SQL ayrı bir arayüz sunar —
          SQL Warehouse üzerinde sorgu çalıştır, dashboard kur, alert tanımla.
          BI araçlarına (Tableau, Power BI, Superset) JDBC/ODBC ile bağlanır.
        </p>

        <pre>{`-- Unity Catalog ile tam yolu belirt: katalog.şema.tablo
USE CATALOG prod_catalog;
USE SCHEMA gold;

-- Performanslı sorgu — partition pruning için tarih filtresi
SELECT
    musteri_segmenti,
    siparis_yili,
    siparis_ayi,
    SUM(toplam_tutar)      AS aylik_ciro,
    AVG(ort_tutar)         AS ort_sepet,
    SUM(siparis_sayisi)    AS siparis_adedi
FROM musteri_aylik_ozet
WHERE siparis_yili = 2024
GROUP BY ALL
ORDER BY siparis_yili, siparis_ayi, aylik_ciro DESC;

-- Canlı tablo (Materialized View gibi)
CREATE OR REPLACE LIVE TABLE gunluk_ciro
AS
SELECT
    DATE(siparis_tarihi)  AS gun,
    SUM(tutar)            AS gunluk_ciro
FROM LIVE.silver_siparisler
GROUP BY 1;`}</pre>

        <h2>MLflow entegrasyonu</h2>
        <p>
          Databricks&apos;te MLflow otomatik entegre gelir — hiçbir kurulum gerekmez.
          Her deneyi, metriği, parametreyi ve modeli kayıt altına alır.
        </p>

        <pre>{`import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics  import roc_auc_score, accuracy_score

mlflow.set_experiment("/Users/ali@sirket.com/churn-modeli")

with mlflow.start_run(run_name="rf-baseline"):

    # Parametreler
    params = {"n_estimators": 200, "max_depth": 8, "random_state": 42}
    mlflow.log_params(params)

    # Model eğit
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)

    # Metrikler
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    mlflow.log_metric("accuracy",  accuracy_score(y_test, y_pred))
    mlflow.log_metric("roc_auc",   roc_auc_score(y_test, y_prob))
    mlflow.log_metric("train_size", len(X_train))

    # Modeli kaydet
    mlflow.sklearn.log_model(
        model,
        artifact_path="model",
        registered_model_name="churn-rf",
        input_example=X_train.iloc[:3],
    )

    # Ekstra artifact (feature importance grafiği vb.)
    mlflow.log_artifact("feature_importance.png")`}</pre>

        <pre>{`# Model Registry ile deployment
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Modeli Staging'e al
client.transition_model_version_stage(
    name="churn-rf",
    version=3,
    stage="Staging",
)

# Production'a al
client.transition_model_version_stage(
    name="churn-rf",
    version=3,
    stage="Production",
)

# Production modelini yükle ve kullan
model_uri = "models:/churn-rf/Production"
loaded_model = mlflow.sklearn.load_model(model_uri)
predictions = loaded_model.predict(new_data)`}</pre>

        <h2>Jobs & Workflows</h2>
        <p>
          Manuel çalıştırma production&apos;a gitmez. Jobs ile notebook veya Python script&apos;ini
          zamanlayabilir, birden fazla task&apos;ı zincirlere bağlayabilirsin.
        </p>

        <pre>{`# Databricks Asset Bundle ile job tanımla (databricks.yml)

bundle:
  name: veri-pipeline

resources:
  jobs:
    gunluk_etl:
      name: "Günlük ETL — Medallion Pipeline"
      schedule:
        quartz_cron_expression: "0 0 3 * * ?"   # her gün 03:00
        timezone_id: "Europe/Istanbul"
        pause_status: UNPAUSED

      tasks:
        - task_key: bronze_yukle
          notebook_task:
            notebook_path: /Repos/main/notebooks/01_bronze
          job_cluster_key: etl_cluster
          timeout_seconds: 3600

        - task_key: silver_temizle
          depends_on:
            - task_key: bronze_yukle
          notebook_task:
            notebook_path: /Repos/main/notebooks/02_silver
          job_cluster_key: etl_cluster

        - task_key: gold_aggregate
          depends_on:
            - task_key: silver_temizle
          notebook_task:
            notebook_path: /Repos/main/notebooks/03_gold
          job_cluster_key: etl_cluster

      job_clusters:
        - job_cluster_key: etl_cluster
          new_cluster:
            spark_version: "14.3.x-scala2.12"
            node_type_id: "m5d.xlarge"
            num_workers: 4
            aws_attributes:
              availability: SPOT_WITH_FALLBACK`}</pre>

        <h2>Unity Catalog</h2>
        <p>
          Unity Catalog, tüm Databricks workspace&apos;larında merkezi veri yönetimi sağlar:
          erişim kontrolü, veri lineage, audit log. <strong>3 katmanlı isim alanı:</strong>
          <code>katalog.şema.tablo</code>
        </p>

        <pre>{`-- Katalog yapısı
-- prod_catalog
--   ├── bronze
--   │   ├── siparisler
--   │   └── musteriler
--   ├── silver
--   │   ├── siparisler
--   │   └── musteriler
--   └── gold
--       └── musteri_aylik_ozet

-- Tabloya erişim ver
GRANT SELECT ON TABLE prod_catalog.gold.musteri_aylik_ozet
    TO analist_grubu;

-- Sütun bazlı maskeleme (hassas veri)
CREATE OR REPLACE FUNCTION mask_email(email STRING)
RETURNS STRING
RETURN CASE
    WHEN IS_MEMBER('admin') THEN email
    ELSE CONCAT(LEFT(email, 2), '***@***.com')
END;

ALTER TABLE musteriler
ALTER COLUMN email
SET MASK mask_email;

-- Veri lineage — hangi tablo nereden geliyor?
-- Databricks UI'da otomatik görünür
-- API ile de çekilebilir:
-- GET /api/2.0/lineage-tracking/column-lineage/get`}</pre>

        <h2>Maliyet optimizasyonu</h2>
        <p>
          Databricks DBU (Databricks Unit) bazlı fiyatlandırır. Yanlış yapılandırılmış
          bir cluster aylık faturayı 10x artırabilir.
        </p>

        <MaliyetIpuclari />

        <pre>{`# Akıllı partition stratejisi
# Kötü: çok küçük partitionlar (< 128 MB) → overhead
# Kötü: çok büyük partitionlar (> 1 GB) → parallelism yok

# İdeal: 128MB - 512MB arası partition
df.repartition(200)                         # shuffle repartition
df.coalesce(50)                             # azalt (shuffle yok)

# Partition sayısını otomatik ayarla
spark.conf.set(
    "spark.sql.adaptive.enabled", "true"   # AQE açık olsun
)
spark.conf.set(
    "spark.sql.adaptive.coalescePartitions.enabled", "true"
)

# Delta'da küçük dosya birleştirme — auto-optimize
spark.conf.set(
    "spark.databricks.delta.optimizeWrite.enabled", "true"
)
spark.conf.set(
    "spark.databricks.delta.autoCompact.enabled", "true"
)`}</pre>

        <h2>Databricks vs Alternatifler</h2>

        <div style={{
          overflowX: 'auto', margin: '1.5rem 0',
        }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--color-cream)', borderBottom: '1px solid var(--color-border)' }}>
                {['', 'Databricks', 'AWS EMR', 'Google Dataproc', 'Azure Synapse'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: 'var(--color-text)', fontSize: '12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Spark Yönetimi', '✅ Tam yönetilen', '⚠️ Kısmen', '⚠️ Kısmen', '⚠️ Kısmen'],
                ['Delta Lake', '✅ Nativ', '⚠️ Ekstra kur', '⚠️ Ekstra kur', '⚠️ Ekstra kur'],
                ['MLflow', '✅ Entegre', '❌ Manuel', '❌ Manuel', '❌ Manuel'],
                ['Notebook', '✅ Gelişmiş', '⚠️ JupyterHub', '⚠️ Jupyter', '⚠️ Synapse NB'],
                ['Fiyat', '💰💰💰', '💰💰', '💰💰', '💰💰'],
                ['Multi-cloud', '✅ AWS/Azure/GCP', '❌ Sadece AWS', '❌ Sadece GCP', '❌ Sadece Azure'],
              ].map(([özellik, ...değerler], i) => (
                <tr key={özellik} style={{ background: i % 2 === 0 ? 'var(--color-cream-card)' : 'var(--color-cream)', borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--color-text)', fontSize: '12px' }}>{özellik}</td>
                  {değerler.map((d, j) => (
                    <td key={j} style={{ padding: '9px 14px', color: 'var(--color-text-soft)', fontSize: '12px' }}>{d}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Başlangıç için pratik yol haritası</h2>
        <ul>
          <li>
            <strong>1. Hafta:</strong> Community Edition kurulumu, ilk notebook, DBFS&apos;e dosya yükleme,
            temel PySpark dönüşümleri (<code>filter</code>, <code>groupBy</code>, <code>join</code>).
          </li>
          <li>
            <strong>2. Hafta:</strong> Delta Lake oluşturma, Time Travel dene, OPTIMIZE çalıştır.
            Küçük bir Bronze→Silver pipeline yaz.
          </li>
          <li>
            <strong>3. Hafta:</strong> MLflow ile bir sklearn modelini kaydet.
            Job oluştur, schedule ayarla, notifkasyon kur.
          </li>
          <li>
            <strong>4. Hafta:</strong> Medallion mimarisini tam kur: 3 katman, gerçek veriyle.
            Unity Catalog izinlerini ayarla.
          </li>
        </ul>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Databricks&apos;i öğrenmek için en iyi kaynak: Databricks Academy.
            Ücretsiz online kursları var — <em>Data Engineering with Databricks</em> ile başla.
            Associate sınavı (~200$) endüstride geçer akçe.
          </p>
        </blockquote>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Bu rehber temel akışı kapsar. Daha ileri konular:
          Delta Live Tables (DLT) ile deklaratif pipeline, Databricks Feature Store,
          Model Serving endpoint&apos;leri ve Lakehouse Monitoring.
        </p>
      </article>
    </main>
  );
}
