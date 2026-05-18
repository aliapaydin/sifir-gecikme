'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Soru Havuzu ─────────────────────────────────────────────────────────────

const SORULAR = [
  // ── Python ───────────────────────────────────────────────────────────────
  {
    id: 1, kategori: 'python', zorluk: 'temel',
    soru: 'Python\'da liste ile tuple arasındaki temel fark nedir?',
    cevap: 'Liste (list) değiştirilebilir (mutable); tuple değiştirilemez (immutable). Tuple\'lar genellikle sabit veri için kullanılır, daha hızlıdır ve dict/set içinde anahtar olabilir. Liste ise dinamik koleksiyonlar için tercih edilir.',
    anahtarlar: ['mutable vs immutable', 'performans farkı', 'tuple hashable olduğu için dict key olabilir'],
  },
  {
    id: 2, kategori: 'python', zorluk: 'temel',
    soru: 'List comprehension nedir? Basit bir örnek ver.',
    cevap: 'List comprehension, döngü ve koşulları tek satırda birleştirerek liste oluşturma yöntemidir. `[x**2 for x in range(10) if x % 2 == 0]` → çift sayıların kareleri. Okunabilir, genellikle for döngüsünden daha hızlıdır.',
    anahtarlar: ['döngü + koşul tek satır', 'generator expression ile farkı (bellek)', 'performans avantajı'],
  },
  {
    id: 3, kategori: 'python', zorluk: 'orta',
    soru: '`*args` ve `**kwargs` ne işe yarar?',
    cevap: '`*args` fonksiyona değişken sayıda pozisyonel argüman geçirir, tuple olarak alınır. `**kwargs` değişken sayıda anahtar-değer argümanı geçirir, dict olarak alınır. Örnek: `def f(*args, **kwargs): print(args, kwargs)` → `f(1,2, a=3)` çıktısı `(1,2) {\'a\':3}`.',
    anahtarlar: ['*args tuple döner', '**kwargs dict döner', 'decorator\'larda sıkça kullanım'],
  },
  {
    id: 4, kategori: 'python', zorluk: 'orta',
    soru: 'Python\'da `deepcopy` ile `copy` (shallow copy) arasındaki fark nedir?',
    cevap: 'Shallow copy yeni bir nesne oluşturur ama içindeki nesnelere referans kopyalar — iç içe yapılar hâlâ paylaşılır. Deep copy tüm ağacı özyinelemeli kopyalar, tamamen bağımsız nesne üretir. İç içe listeler veya objeler içeren yapılarda shallow copy sürpriz bug\'lara yol açar.',
    anahtarlar: ['shallow: referans kopyalar', 'deep: tamamen bağımsız', 'performans tradeoff'],
  },
  {
    id: 5, kategori: 'python', zorluk: 'orta',
    soru: 'Generator ile liste arasındaki fark nedir? Neden generator tercih edilir?',
    cevap: 'Generator, değerleri tek tek üretir ve bellekte tüm listeyi tutmaz (lazy evaluation). `yield` anahtar kelimesiyle tanımlanır. 10 milyon elemanlı bir listede tüm veri RAM\'e yüklenir; generator sadece anlık elemanı tutar. Büyük veri işlemede ve pipeline\'larda tercih edilir.',
    anahtarlar: ['lazy evaluation', 'bellek tasarrufu', 'yield keyword', 'generator expression: ()'],
  },
  {
    id: 6, kategori: 'python', zorluk: 'orta',
    soru: 'Pandas\'ta `loc` ile `iloc` farkı nedir?',
    cevap: '`loc` etiket bazlı indeksleme yapar (sütun/satır adı). `iloc` pozisyon bazlı yapar (0-indexed integer). Örnek: `df.loc[\'Ali\', \'yas\']` vs `df.iloc[0, 2]`. Önemli fark: `loc` slice\'da son eleman dahil, `iloc`\'ta değil.',
    anahtarlar: ['loc: label based', 'iloc: integer position', 'slice davranışı farkı'],
  },
  {
    id: 7, kategori: 'python', zorluk: 'orta',
    soru: 'Pandas\'ta `apply`, `map` ve `applymap` (transform) ne zaman kullanılır?',
    cevap: '`map` → Series üzerinde element bazlı (tek sütun). `apply` → Series veya DataFrame üzerinde satır/sütun fonksiyonu; daha esnek. `applymap`/`map` (df) → DataFrame\'in her elementine fonksiyon uygular. Performans için vektörel operasyonlar tercih edilmeli; `apply` Python döngüsüne benzer yavaşlığı olabilir.',
    anahtarlar: ['map: Series element', 'apply: row/col fonksiyon', 'vektörel alternatifler daha hızlı'],
  },
  {
    id: 8, kategori: 'python', zorluk: 'ileri',
    soru: 'Python\'da decorator nedir? Basit bir örnek yaz.',
    cevap: 'Decorator, bir fonksiyonu sarmalayan ve davranışını değiştiren yüksek-seviye fonksiyondur. `@` sözdizimi kullanılır. Örnek: `def timer(func): def wrapper(*a,**k): t=time(); r=func(*a,**k); print(time()-t); return r; return wrapper`. Logging, cache, yetki kontrolü için yaygın kullanım.',
    anahtarlar: ['higher-order function', 'wrapper pattern', 'functools.wraps ile metadata koruma'],
  },
  {
    id: 9, kategori: 'python', zorluk: 'ileri',
    soru: 'GIL (Global Interpreter Lock) nedir ve ne zaman sorun çıkarır?',
    cevap: 'GIL, CPython\'da aynı anda yalnızca bir thread\'in Python bytecode\'u çalıştırmasına izin verir. CPU-bound (yoğun hesaplama) işlemlerde multi-threading beklenen hızlanmayı sağlamaz. Çözüm: multiprocessing modülü (ayrı process), ya da NumPy/Pandas gibi C extension\'lar (GIL\'i release eder).',
    anahtarlar: ['sadece CPython\'da', 'I/O-bound\'da sorun değil', 'multiprocessing çözüm'],
  },
  {
    id: 10, kategori: 'python', zorluk: 'ileri',
    soru: 'Büyük bir CSV dosyasını RAM\'e sığmayacak şekilde işlemek için ne yaparsın?',
    cevap: '`pd.read_csv(..., chunksize=N)` ile chunk\'lara bölerek okursan. Alternatif: Polars (daha bellek verimli), Dask (paralel + lazy), PyArrow/Parquet formatı. Sütun seçimi `usecols` ile yapılır, dtype optimizasyonu (float32 yerine float64 gibi) ek tasarruf sağlar.',
    anahtarlar: ['chunksize parametresi', 'Dask / Polars alternatifleri', 'dtype optimizasyonu', 'Parquet format'],
  },
  {
    id: 11, kategori: 'python', zorluk: 'temel',
    soru: 'Python\'da mutable default argüman tuzağı nedir?',
    cevap: '`def f(lst=[]):` yazdığında liste bir kez oluşturulur ve tüm çağrılar aynı nesneyi paylaşır. Her çağrıda `lst.append(1)` yaparsanız liste büyür. Doğru pattern: `def f(lst=None): if lst is None: lst = []`. Bu en yaygın Python interview tuzaklarından biridir.',
    anahtarlar: ['default args bir kez oluşturulur', 'None default pattern', 'mutable types: list/dict/set'],
  },
  {
    id: 12, kategori: 'python', zorluk: 'orta',
    soru: 'NumPy\'da broadcasting nedir?',
    cevap: 'Broadcasting, farklı şekillerdeki array\'leri otomatik uyumlu hale getirerek element-wise işlem yapma mekanizmasıdır. `(3,1) + (1,4)` → `(3,4)` sonuç. Kopyalama yapmadan bellek verimli çalışır. Kural: boyutlar sağdan hizalanır, 1 olan boyutlar genişler, uyumsuz boyutlar hata verir.',
    anahtarlar: ['sağdan hizalama kuralı', 'bellek kopyalamaz', 'vektörel işlem hızı'],
  },

  // ── SQL ───────────────────────────────────────────────────────────────────
  {
    id: 13, kategori: 'sql', zorluk: 'temel',
    soru: 'INNER JOIN ile LEFT JOIN arasındaki fark nedir?',
    cevap: 'INNER JOIN yalnızca her iki tabloda eşleşen satırları döndürür. LEFT JOIN sol tablonun tüm satırlarını döndürür; sağ tabloda eşleşme yoksa NULL koyar. Müşteri/sipariş örneğinde: INNER JOIN siparişsiz müşteriyi göstermez, LEFT JOIN gösterir (sipariş sütunları NULL olur).',
    anahtarlar: ['INNER: yalnızca kesişim', 'LEFT: tüm sol + eşleşen sağ', 'NULL kontrolü WHERE ile'],
  },
  {
    id: 14, kategori: 'sql', zorluk: 'temel',
    soru: 'WHERE ile HAVING arasındaki fark nedir?',
    cevap: 'WHERE, GROUP BY\'dan önce satırları filtreler — aggregate fonksiyon kullanamazsın. HAVING, GROUP BY\'dan sonra grupları filtreler — `HAVING COUNT(*) > 5` gibi aggregate koşul yazabilirsin. Sıra: WHERE → GROUP BY → HAVING → ORDER BY.',
    anahtarlar: ['WHERE: satır filtresi, gruplama öncesi', 'HAVING: grup filtresi, aggregate kullanabilir', 'çalışma sırası'],
  },
  {
    id: 15, kategori: 'sql', zorluk: 'orta',
    soru: 'Window function nedir? ROW_NUMBER, RANK ve DENSE_RANK farkları neler?',
    cevap: 'Window function, OVER() ile partition üzerinde çalışır ve satırı elimine etmez — satır sayısı korunur. ROW_NUMBER: eşit değerlerde bile sıralı numara. RANK: eşit değerlere aynı rank, sonraki atlıyor (1,1,3). DENSE_RANK: eşit değerlere aynı rank, atlamıyor (1,1,2).',
    anahtarlar: ['OVER(PARTITION BY ... ORDER BY ...)', 'satır sayısı değişmez', 'RANK vs DENSE_RANK boşluk farkı'],
  },
  {
    id: 16, kategori: 'sql', zorluk: 'orta',
    soru: 'CTE (Common Table Expression) nedir ve subquery\'den farkı nedir?',
    cevap: 'CTE, WITH anahtar kelimesiyle tanımlanan geçici isimli sorgu bloğudur. Okunabilirliği artırır, aynı sonucu birden fazla yerde kullanabilirsin ve recursive sorgulara izin verir. Subquery\'nin aksine bir kez tanımlanır, defalarca referans verilebilir. Performans farkı genellikle minimal, ama okunabilirlik büyük fark yaratır.',
    anahtarlar: ['WITH keyword', 'recursive CTE (ağaç yapıları)', 'okunabilirlik avantajı', 'birden fazla referans'],
  },
  {
    id: 17, kategori: 'sql', zorluk: 'orta',
    soru: 'SQL\'de NULL değerlerle çalışırken dikkat edilmesi gereken durumlar nelerdir?',
    cevap: 'NULL ile her karşılaştırma UNKNOWN döndürür (NULL = NULL bile FALSE). Bu yüzden `WHERE kolon = NULL` çalışmaz, `WHERE kolon IS NULL` kullanılır. SUM/AVG NULL\'ları yok sayar. COUNT(*) NULL dahil sayar, COUNT(kolon) saymaz. COALESCE(kolon, 0) ile NULL yerine varsayılan değer konar.',
    anahtarlar: ['NULL = NULL → FALSE', 'IS NULL / IS NOT NULL', 'aggregate\'lerde NULL davranışı', 'COALESCE'],
  },
  {
    id: 18, kategori: 'sql', zorluk: 'orta',
    soru: 'Her müşterinin en son siparişini getiren bir sorgu yaz.',
    cevap: 'İki yöntem: (1) Window function: `SELECT * FROM (SELECT *, ROW_NUMBER() OVER(PARTITION BY musteri_id ORDER BY tarih DESC) AS rn FROM siparisler) t WHERE rn = 1`. (2) Subquery: `SELECT * FROM siparisler s WHERE tarih = (SELECT MAX(tarih) FROM siparisler WHERE musteri_id = s.musteri_id)`. Window function yöntemi büyük veride genellikle daha verimli.',
    anahtarlar: ['ROW_NUMBER() PARTITION BY', 'correlated subquery alternatifi', 'performans farkı'],
  },
  {
    id: 19, kategori: 'sql', zorluk: 'orta',
    soru: 'Index nedir, ne zaman yavaşlatabilir?',
    cevap: 'Index, sorgu hızını artıran B-tree veri yapısıdır — tüm tabloyu taramak yerine doğrudan satıra erişilir. Ancak INSERT/UPDATE/DELETE işlemlerini yavaşlatır çünkü index de güncellenir. Düşük cardinality\'li (az benzersiz değer) sütunlarda (örn. evet/hayır) index fayda sağlamaz. Çok fazla index de sorgu planını karmaşıklaştırabilir.',
    anahtarlar: ['B-tree yapısı', 'write performansı düşer', 'cardinality önemli', 'composite index sırası'],
  },
  {
    id: 20, kategori: 'sql', zorluk: 'ileri',
    soru: 'LAG ve LEAD fonksiyonları nedir? Günlük satış değişim yüzdesi nasıl hesaplanır?',
    cevap: 'LAG önceki satırın değerini, LEAD sonraki satırın değerini getirir. Değişim yüzdesi: `SELECT tarih, satis, LAG(satis) OVER(ORDER BY tarih) AS onceki, ROUND(100.0*(satis - LAG(satis) OVER(ORDER BY tarih)) / LAG(satis) OVER(ORDER BY tarih), 2) AS degisim_pct FROM gunluk_satis`. İlk satırda LAG NULL döner.',
    anahtarlar: ['LAG/LEAD OVER(ORDER BY)', 'offset parametresi', 'ilk/son satırda NULL', 'NULLIF sıfıra bölme koruması'],
  },
  {
    id: 21, kategori: 'sql', zorluk: 'ileri',
    soru: 'EXPLAIN / EXPLAIN ANALYZE ne gösterir, nasıl kullanılır?',
    cevap: 'EXPLAIN, sorgunun nasıl çalışacağını (execution plan) tahmini olarak gösterir. EXPLAIN ANALYZE gerçekten çalıştırır ve gerçek süreleri raporlar. Seq Scan (tüm tablo), Index Scan (index kullanıyor), Hash Join, Nested Loop gibi operasyonları görürsün. Yüksek "rows" tahmini olan Seq Scan → index ihtiyacı işareti.',
    anahtarlar: ['Seq Scan vs Index Scan', 'cost: tahmin, actual: gerçek', 'planner istatistikleri ANALYZE ile güncellenir'],
  },
  {
    id: 22, kategori: 'sql', zorluk: 'temel',
    soru: 'UNION ile UNION ALL farkı nedir?',
    cevap: 'UNION tekrarlanan satırları siler (distinct gibi çalışır) — bu ekstra sort/hash işlemi gerektirir. UNION ALL tüm satırları alır, tekrarlara dokunmaz — daha hızlı. Duplicate\'a ihtiyaç yoksa UNION ALL tercih edilmeli. Her iki sorgunun sütun sayısı ve tipleri uyumlu olmalı.',
    anahtarlar: ['UNION: distinct, yavaş', 'UNION ALL: tümü, hızlı', 'sütun uyumu zorunlu'],
  },
  {
    id: 23, kategori: 'sql', zorluk: 'orta',
    soru: 'Hangi ayda en fazla yeni müşteri kazanıldığını bulan sorguyu yaz.',
    cevap: '`SELECT EXTRACT(MONTH FROM kayit_tarihi) AS ay, COUNT(*) AS yeni_musteri FROM musteriler GROUP BY ay ORDER BY yeni_musteri DESC LIMIT 1`. Daha iyi okunabilirlik için CTE kullanılabilir. EXTRACT yerine DATE_TRUNC veya MONTH() (MySQL) da kullanılabilir — dialekte göre değişir.',
    anahtarlar: ['EXTRACT / DATE_TRUNC', 'GROUP BY + COUNT', 'TOP 1 / LIMIT 1 dialekt farkı'],
  },
  {
    id: 24, kategori: 'sql', zorluk: 'orta',
    soru: 'Self join ne zaman kullanılır? Örnek ver.',
    cevap: 'Aynı tablonun kendisiyle birleştirilmesidir. Hiyerarşik veri (çalışan-yönetici ilişkisi), karşılaştırmalı analizler için kullanılır. Örnek: `SELECT c.isim, y.isim AS yonetici FROM calisanlar c LEFT JOIN calisanlar y ON c.yonetici_id = y.id`. Tablo takma adları zorunludur.',
    anahtarlar: ['alias zorunlu', 'hiyerarşik veri', 'recursive CTE daha güçlü alternatif'],
  },

  // ── İstatistik ───────────────────────────────────────────────────────────
  {
    id: 25, kategori: 'istatistik', zorluk: 'temel',
    soru: 'p-değeri nedir? "p < 0.05 anlamlı" ne demek?',
    cevap: 'p-değeri, sıfır hipotezi (H₀) doğru olsaydı gözlemlenen veri kadar veya daha aşırı bir sonuç alma olasılığıdır. p < 0.05, eğer H₀ doğruysa bu sonucu görme şansının %5\'ten düşük olduğunu söyler — H₀\'ı reddederiz. p-değeri "etki büyüklüğünü" ölçmez; sadece rastlantı olup olmadığına dair kanıt sunar.',
    anahtarlar: ['H₀ doğruysa bu veriyi görme olasılığı', 'etki büyüklüğü ölçmez', '0.05 eşiği keyfi seçimdir'],
  },
  {
    id: 26, kategori: 'istatistik', zorluk: 'temel',
    soru: 'Tip I ve Tip II hata nedir?',
    cevap: 'Tip I hata (α): H₀ doğruyken reddetmek — yanlış pozitif. "Yokken var" demek. Tip II hata (β): H₀ yanlışken reddetmememek — yanlış negatif. "Varken yok" demek. Güç (power) = 1-β, gerçek etkiyi yakalama olasılığı. α küçülttükçe β büyür — tradeoff vardır.',
    anahtarlar: ['Tip I: false positive', 'Tip II: false negative', 'power = 1-β', 'α-β tradeoff'],
  },
  {
    id: 27, kategori: 'istatistik', zorluk: 'orta',
    soru: 'Merkezi Limit Teoremi nedir ve neden önemlidir?',
    cevap: 'CLT: yeterince büyük örneklem için, orijinal dağılımdan bağımsız olarak örneklem ortalaması normal dağılıma yaklaşır. n ≥ 30 kural-of-thumb. Bu önemlidir çünkü gerçek dünya dağılımı ne olursa olsun, parametrik testler (t-test, z-test) uygulanabilir. Büyük veri analizinin matematiksel temelidir.',
    anahtarlar: ['n≥30 kural', 'orijinal dağılımdan bağımsız', 'parametrik testlerin temeli', 'standart hata = σ/√n'],
  },
  {
    id: 28, kategori: 'istatistik', zorluk: 'orta',
    soru: 'Güven aralığı (confidence interval) ne anlama gelir? Sık yapılan yanlış yorum nedir?',
    cevap: '%95 güven aralığı: aynı prosedürü 100 kez tekrarlasaydık, üretilen aralıkların %95\'i gerçek parametreyi kapsardı. Sık yanlış yorum: "Bu aralıkta parametre %95 olasılıkla" — parametre sabit, sabit değil. Aralık rastgele, parametre değil. Daha geniş aralık = daha fazla belirsizlik.',
    anahtarlar: ['aralık rastgele, parametre sabit', 'frekantist yorum', 'n arttıkça daralır', 'güven seviyesi ↑ → geniş aralık'],
  },
  {
    id: 29, kategori: 'istatistik', zorluk: 'orta',
    soru: 'Korelasyon ile nedensellik farkı nedir? Örnek ver.',
    cevap: 'Korelasyon, iki değişkenin birlikte değiştiğini gösterir; nedensellik birinin diğerine yol açtığını. Örnek: dondurma satışı ile boğulma vakası yüksek korelasyonlu — ikisinin de nedeni sıcaklık (confounding variable). Nedensellik için randomize kontrollü deney (RCT) veya doğal deney, enstrümantal değişken gibi yöntemler gerekir.',
    anahtarlar: ['confounding variable', 'RCT altın standart', '"correlation is not causation"', 'Simpson paradoksu'],
  },
  {
    id: 30, kategori: 'istatistik', zorluk: 'orta',
    soru: 'A/B testinde örneklem büyüklüğünü nasıl belirlersin?',
    cevap: 'Örneklem büyüklüğü üç parametreye bağlı: (1) minimum tespit edilebilir etki (MDE) — küçük fark için daha fazla veri, (2) anlamlılık seviyesi α (genellikle 0.05), (3) güç (1-β, genellikle 0.80). Formül: `n = 2*(z_α/2 + z_β)² * σ² / δ²`. Scipy veya online hesaplayıcılarla kolayca yapılır.',
    anahtarlar: ['MDE, α, power üçlüsü', 'küçük etki → büyük n', 'iki yönlü vs tek yönlü test', 'statsmodels.stats.power'],
  },
  {
    id: 31, kategori: 'istatistik', zorluk: 'ileri',
    soru: 'Bayes teoremi nedir? Sezgisel bir örnekle açıkla.',
    cevap: 'P(A|B) = P(B|A)*P(A) / P(B). Örnek: nadir bir hastalık testi. Test %99 doğru, hastalık prevalansı %0.1. Pozitif test geldi, hasta olma olasılığı? P(hasta|+) = (0.99×0.001) / (0.99×0.001 + 0.01×0.999) ≈ %9. Çünkü hastalık nadir — yanlış pozitifler gerçek pozitifleri sayıca geçiyor. Prior (önceki bilgi) çok önemli.',
    anahtarlar: ['prior × likelihood / evidence', 'base rate ne ihmal edilmez', 'Bayesian vs Frequentist yaklaşım'],
  },
  {
    id: 32, kategori: 'istatistik', zorluk: 'ileri',
    soru: 'Çoklu karşılaştırma problemi (multiple testing) nedir? Nasıl çözülür?',
    cevap: '20 bağımsız test yapıp her birinde α=0.05 kullanırsan, şans eseri en az bir yanlış pozitif beklenir. Aile genelinde hata oranı artar. Bonferroni düzeltmesi: her testte α/n eşiği kullan. FDR kontrolü (Benjamini-Hochberg): daha az konservatif, keşifsel analizde tercih edilir.',
    anahtarlar: ['p-value fishing / p-hacking', 'Bonferroni: α/n', 'FDR: Benjamini-Hochberg', 'pre-registration çözümü'],
  },
  {
    id: 33, kategori: 'istatistik', zorluk: 'temel',
    soru: 'Standart sapma ile standart hata arasındaki fark nedir?',
    cevap: 'Standart sapma (σ/s), tek bir örneklemdeki verilerin yayılımını ölçer. Standart hata (SE = s/√n), örneklem ortalamasının değişkenliğini ölçer — farklı örneklemler arasında ortalama ne kadar değişir? SE, n arttıkça küçülür. Güven aralığı ve hipotez testlerinde SE kullanılır.',
    anahtarlar: ['SD: veri yayılımı', 'SE: örneklem ortalamasının yayılımı', 'SE = SD/√n', 'n büyüdükçe SE küçülür'],
  },

  // ── Makine Öğrenmesi ─────────────────────────────────────────────────────
  {
    id: 34, kategori: 'ml', zorluk: 'temel',
    soru: 'Overfitting nedir, nasıl anlaşılır ve nasıl önlenir?',
    cevap: 'Overfitting: model eğitim verisini çok iyi öğrenir ama yeni veriye genelleyemez. Train accuracy yüksek, test accuracy düşük → overfitting. Önleme: regularization (L1/L2), dropout (sinir ağları), cross-validation ile parametre seçimi, daha fazla veri, daha basit model, erken durdurma (early stopping).',
    anahtarlar: ['train-test gap', 'regularization L1/L2', 'cross-validation', 'early stopping', 'daha fazla veri'],
  },
  {
    id: 35, kategori: 'ml', zorluk: 'temel',
    soru: 'Denetimli ve denetimsiz öğrenme arasındaki fark nedir? Birer örnek ver.',
    cevap: 'Denetimli: etiketli veri var, model input→output ilişkisini öğrenir. Örnek: spam sınıflandırma, ev fiyatı tahmini. Denetimsiz: etiket yok, model veri içindeki yapıyı keşfeder. Örnek: müşteri segmentasyonu (K-Means), boyut indirgeme (PCA). Pekiştirmeli öğrenme ise ödül/ceza sinyaliyle öğrenme (üçüncü kategori).',
    anahtarlar: ['denetimli: etiketli veri', 'denetimsiz: yapı keşfi', 'pekiştirmeli: ödül sinyali', 'yarı denetimli'],
  },
  {
    id: 36, kategori: 'ml', zorluk: 'orta',
    soru: 'Cross-validation nedir ve neden train/test split\'ten üstündür?',
    cevap: 'k-fold CV: veri k parçaya bölünür, her tur k-1 parça train, 1 parça test olarak döner. k ayrı skor ortalaması alınır. Train/test split\'e göre üstün çünkü: tüm veriyi hem train hem test için kullanır, değerlendirme varyansı düşer, özellikle küçük veri setlerinde kritik. Dezavantaj: k kat daha yavaş.',
    anahtarlar: ['k tur, her seferinde farklı test fold', 'daha güvenilir genelleme tahmini', 'stratified k-fold (sınıf dengesizliği)', 'leave-one-out aşırı uç'],
  },
  {
    id: 37, kategori: 'ml', zorluk: 'orta',
    soru: 'L1 (Lasso) ve L2 (Ridge) regularization arasındaki fark nedir?',
    cevap: 'L1 (Lasso): ceza |w| — bazı ağırlıkları tam sıfırlar, özellik seçimi yapar, sparse model üretir. L2 (Ridge): ceza w² — tüm ağırlıkları küçültür ama sıfırlamaz. L1 çok sayıda alakasız özellik varsa tercih edilir. Elastic Net ikisini birleştirir. Multicollinearity durumunda Ridge daha kararlı.',
    anahtarlar: ['L1: sparse model, özellik seçimi', 'L2: küçültür ama sıfırlamaz', 'Elastic Net hibrit', 'multicollinearity → Ridge'],
  },
  {
    id: 38, kategori: 'ml', zorluk: 'orta',
    soru: 'Precision ve Recall arasındaki fark nedir? Hangisi ne zaman önemli?',
    cevap: 'Precision = TP/(TP+FP): "pozitif dediğimin kaçı gerçekten pozitif?" — yanlış alarm maliyeti yüksekse önemli (spam filtresi: meşru maili spam yapma). Recall = TP/(TP+FN): "gerçek pozitiflerin kaçını yakaladım?" — kaçırmanın maliyeti yüksekse (kanser taraması: hasta olanı kaçırma). F1 = harmonik ortalama, ikisini dengeler.',
    anahtarlar: ['precision: yanlış alarm', 'recall: kaçırma', 'F1 harmonik ortalama', 'threshold değiştirince ikisi ters orantılı'],
  },
  {
    id: 39, kategori: 'ml', zorluk: 'orta',
    soru: 'Random Forest neden tek bir karar ağacından iyidir?',
    cevap: 'Karar ağacı yüksek varyanslıdır — küçük veri değişiminde çok farklı ağaç çıkar. Random Forest bagging (bootstrap örnekleri) + rastgele özellik seçimi ile yüzlerce ağaç kurar ve oylamayla birleştirir. Bireysel hataları birbirini iptal eder, genelleme iyileşir. Overfitting\'e daha dirençli. Tek dezavantaj: yorumlaması zorlaşır.',
    anahtarlar: ['bagging + rastgele özellik', 'bias artar biraz, varyans çok düşer', 'feature importance', 'out-of-bag error'],
  },
  {
    id: 40, kategori: 'ml', zorluk: 'orta',
    soru: 'Gradient Boosting nedir, Random Forest\'tan nasıl ayrılır?',
    cevap: 'GB sıralı çalışır: her yeni ağaç öncekinin hatasını (residuals) düzeltir. Random Forest paralel ağaçlar kurar. GB genellikle daha yüksek doğruluk verir ama daha yavaş eğitim ve hiperparametre ayarı gerektirir (learning rate, max depth). Overfitting\'e daha duyarlı. XGBoost/LightGBM optimize implementasyonları.',
    anahtarlar: ['sıralı vs paralel', 'residual öğrenme', 'learning rate kritik', 'XGBoost/LightGBM farkı'],
  },
  {
    id: 41, kategori: 'ml', zorluk: 'ileri',
    soru: 'Data leakage nedir? Gerçek bir senaryoda nasıl ortaya çıkabilir?',
    cevap: 'Leakage: modelin eğitim sırasında test zamanında sahip olmayacağı bilgiye erişmesi. Senaryo: normalizasyon için tüm veri ortalaması kullanıyorsan test setinin ortalaması train\'e sızar. Zaman serisi verisi chronological split yerine random split ile bölünürse gelecekten veri sızar. Sonuç: gerçekçi olmayan yüksek model skoru. Çözüm: pipeline içinde her transformasyon sadece train verisinden fit edilmeli.',
    anahtarlar: ['train-test pipeline içi fit', 'zaman serisi: tarih bazlı split', 'target leakage', 'şüphe: AUC çok iyi → leakage ara'],
  },
  {
    id: 42, kategori: 'ml', zorluk: 'ileri',
    soru: 'Sınıf dengesizliğini nasıl ele alırsın?',
    cevap: 'Veri seviyesi: oversampling (SMOTE — sentetik minority örnekler), undersampling (majority azalt). Algoritma seviyesi: class_weight="balanced" parametresi, scale_pos_weight (XGBoost). Değerlendirme: accuracy yerine PR-AUC, F1, recall. Eşik: 0.5 yerine maliyet matrisine göre optimize et. Başlamadan önce: problem gerçekten dengesiz mi, yoksa domain\'de nadir mi bekleniyordu?',
    anahtarlar: ['SMOTE oversampling', 'class_weight', 'PR-AUC > ROC-AUC (çok dengesizde)', 'eşik optimizasyonu'],
  },
  {
    id: 43, kategori: 'ml', zorluk: 'orta',
    soru: 'K-Means\'te k sayısını nasıl seçersin?',
    cevap: 'Elbow method: farklı k değerlerinde WCSS (within-cluster sum of squares) hesapla, grafikte "dirsek" noktası optimal k. Silhouette score: küme içi yoğunluk vs kümeler arası uzaklık, 1\'e yakın iyi. Gap statistic: gerçek WCSS\'yi rastgele dağılımla karşılaştırır. Domain bilgisi de sıklıkla kullanılır ("4 müşteri segmenti mantıklı").',
    anahtarlar: ['elbow method', 'silhouette score (-1 ile 1)', 'domain knowledge', 'K-Means kümeler sabit boyutluysa başarılı'],
  },
  {
    id: 44, kategori: 'ml', zorluk: 'temel',
    soru: 'Feature scaling neden gereklidir? Hangi modeller için zorunludur?',
    cevap: 'KNN, SVM, lojistik regresyon, PCA, sinir ağları gibi uzaklık veya gradyan tabanlı modeller için zorunludur — büyük ölçekli özellik küçükleri baskılar. Karar ağaçları ve türevleri (Random Forest, XGBoost) için gerek yoktur — threshold bazlı split skale bağımsız. StandardScaler (z-score) veya MinMaxScaler kullanılır. Pipeline içinde sadece train set ile fit edilmeli.',
    anahtarlar: ['mesafe tabanlı modeller zorunlu', 'ağaç modelleri bağımsız', 'StandardScaler vs MinMaxScaler', 'pipeline içi fit'],
  },

  // ── Davranışsal ──────────────────────────────────────────────────────────
  {
    id: 45, kategori: 'davranissal', zorluk: 'orta',
    soru: 'Bir veri projesinde teknik borç bırakmak zorunda kaldığın bir durumu anlat.',
    cevap: 'STAR formatı: Durum (proje zamanlaması/baskısı), Görev (ne yapman gerekiyordu), Aksiyon (teknik borcu neden ve nasıl aldın, nasıl belgeledikten), Sonuç (kısa vadeli etki + ne zaman geri dönüp düzelttin). Vurgula: bilinçli bir karar olduğunu, trade-off\'u anladığını ve geri ödeme planı yaptığını göster.',
    anahtarlar: ['STAR format', 'bilinçli trade-off', 'belgeleme ve geri ödeme planı', 'ekiple şeffaf iletişim'],
  },
  {
    id: 46, kategori: 'davranissal', zorluk: 'orta',
    soru: 'Paydaşlar yanlış veriyi "doğru" sanıyordu ve bunu fark ettin. Ne yaptın?',
    cevap: 'STAR + empati: veriyi şüpheli bulduğunda kaynak analizi yap, kanıt topla. Paydaşa doğrudan değil, merak ile yaklaş: "Bu noktayı kontrol edelim mi?" Buluğunu somut, teknik olmayan dille açıkla. Çözüm öner — sadece problem taşıma değil. Şirket kararını etkileyen yanlış veriyi sessizce geçmemek kritik.',
    anahtarlar: ['kanıt topla, spekülatif konuşma', 'empati + merak dili', 'çözüm öner', 'şeffaflık > koltuk koruma'],
  },
  {
    id: 47, kategori: 'davranissal', zorluk: 'orta',
    soru: '"Veriden çıkardığın en önemli bulgu hangisiydi?" sorusunu nasıl yanıtlarsın?',
    cevap: 'Iş etkisi olan somut bir örnek seç. Yapıyı şöyle kur: (1) bağlam — hangi problem, (2) yaklaşım — nasıl analiz ettin, (3) bulgu — ne keşfettin, (4) etki — bu kararı veya parayı nasıl etkiledi? Sayısal etki ("+%15 dönüşüm", "2M TL tasarruf") çarpıcıdır. Süreç kadar iş etkisini öne çıkar.',
    anahtarlar: ['iş etkisi önce', 'sayısal sonuç', 'kararı nasıl değiştirdi', 'teknik detayı paydaşa uyarla'],
  },
  {
    id: 48, kategori: 'davranissal', zorluk: 'orta',
    soru: 'Teknik olmayan bir paydaşa karmaşık bir modeli nasıl açıklarsın?',
    cevap: 'Analoji kullan, matematikten kaçın. "Model, geçmiş %1000 müşterinin davranışını inceleyip "bu profile benzer müşteriler ne yaptı?" sorusunu soruyor." Çıktıya odaklan (tahmin + güven), algoritma detayına değil. Kısıtlardan bahset (model yanılabilir, şu koşullarda geçerli). Somut karar etkisini göster: "Bu skoru aşanları aramak, kör aramadan 3 kat daha verimli."',
    anahtarlar: ['analoji kullan', 'çıktı ve karar odak', 'kısıtları saklamayın', 'iş dili, teknik jargon yok'],
  },
  {
    id: 49, kategori: 'davranissal', zorluk: 'orta',
    soru: 'Zaman baskısı altında analiz kalitesini nasıl dengelersin?',
    cevap: '"Acil ama yanlış" analizden kaçın. Baskı altında yapılacaklar: (1) kapsam netleştir — gerçekten ne soruluyor, (2) en büyük riski tanımla ve önce onu incele, (3) paydaşa erken "ön bulgu + güven seviyesi" sun, (4) "şimdi %80, sonra %100" anlaşması yap. Teslim ettikten sonra sınırları açıkça belirt.',
    anahtarlar: ['kapsam netleştirme', 'riski önceliklendir', '"erken ön bulgu" iletişimi', '"80/20" anlaşması'],
  },
  {
    id: 50, kategori: 'davranissal', zorluk: 'temel',
    soru: 'Bir proje ya da analiz başarısız olduğunda ne yaparsın?',
    cevap: 'STAR formatında yeniden çerçevele: başarısızlığı fırsat olarak sun ama gerçekçi ol — blameshifting yapma. Yapıyı şöyle kur: ne yanlış gitti (spesifik), neden (köken analizi), ne öğrendin (somut), sonraki sefer ne değiştirirdin. Büyük şirketler öğrenen, düzelten kişileri sever. "Hiç başarısız olmadım" cevabı kırmızı bayrak.',
    anahtarlar: ['blameshifting yapma', 'köken analizi', 'somut ders', 'sistemi değiştirmek (kişiyi değil)'],
  },
  {
    id: 51, kategori: 'davranissal', zorluk: 'temel',
    soru: '"5 yıl sonra nerede olmak istiyorsun?" sorusuna nasıl yanıt verirsin?',
    cevap: 'Çok genel veya çok spesifik olmaktan kaçın. Şirkete ve role bağla: "Teknik derinliğimi koruyarak domain uzmanlığı kazanmak ve daha büyük sistemlere etki etmek istiyorum." Gerçekçi ol — CEO olmak istiyorum demek güven erozyonu yaratır. Merak ve büyüme isteğini öne çıkar; kariyer planını şirkete bağlamak artı puan.',
    anahtarlar: ['şirkete bağla', 'teknik vs liderlik yolu netleştir', 'gerçekçilik + büyüme isteği', 'uzun vadeli değer katma'],
  },
  {
    id: 52, kategori: 'davranissal', zorluk: 'orta',
    soru: 'Ekipte fikir çatışması yaşadığında nasıl yönetirsin?',
    cevap: 'Önce dinle ve anla — "haklı olmak" yerine "doğruyu bulmak" perspektifi. Veri ile tartış: kanıt getir, kişisel ataktan kaçın. Anlaşmazlık devam ederse: deneyle çöz (A/B test, prototip), senior\'a eskalate et veya "bu sefer senin yönteminle deneyelim, ölçelim" pozisyonunu benimse. Takım uyumunu kırmak, haklı olmaktan daha pahalıdır.',
    anahtarlar: ['veriye dayalı tartışma', 'deney ile çöz', 'eskalasyon ne zaman', 'ilişki > haklılık'],
  },
];

const KATEGORILER = [
  { slug: 'hepsi',       label: 'Hepsi',        emoji: '🎯', renk: '#6B7280' },
  { slug: 'python',      label: 'Python',        emoji: '🐍', renk: '#3B82F6' },
  { slug: 'sql',         label: 'SQL',           emoji: '🗄️', renk: '#8B5CF6' },
  { slug: 'istatistik',  label: 'İstatistik',    emoji: '📊', renk: '#10B981' },
  { slug: 'ml',          label: 'ML',            emoji: '🤖', renk: '#F59E0B' },
  { slug: 'davranissal', label: 'Davranışsal',   emoji: '💬', renk: '#EC4899' },
];

const ZORLUK = {
  temel: { label: 'Temel',  renk: '#10B981' },
  orta:  { label: 'Orta',   renk: '#F59E0B' },
  ileri: { label: 'İleri',  renk: '#EF4444' },
};

const DEGERLENDIRME = {
  biliyorum: { label: '✓ Biliyorum',  renk: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  kismen:    { label: '△ Kısmen',     renk: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  bilmiyorum:{ label: '✗ Bilmiyorum', renk: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
};

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

export default function Mulakat() {
  const [kategori,   setKategori]   = useState('hepsi');
  const [sorular,    setSorular]    = useState(() => shuffle(SORULAR));
  const [idx,        setIdx]        = useState(0);
  const [acik,       setAcik]       = useState(false);
  const [seans,      setSeans]      = useState({});
  const [bitti,      setBitti]      = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!bitti) return;
    try {
      const values = Object.values(seans);
      const toplam = values.length;
      const biliyorum = values.filter(v => v === 'biliyorum').length;
      const prev = Number(localStorage.getItem('sz_mulakat_soru') || 0);
      localStorage.setItem('sz_mulakat_soru', String(prev + toplam));
      const prevB = Number(localStorage.getItem('sz_mulakat_biliyorum') || 0);
      localStorage.setItem('sz_mulakat_biliyorum', String(prevB + biliyorum));
    } catch {}
  }, [bitti]);

  const filtrelenmis = kategori === 'hepsi'
    ? sorular
    : sorular.filter(s => s.kategori === kategori);

  const soru = filtrelenmis[idx];

  const ileri = useCallback((puan) => {
    if (soru) setSeans(prev => ({ ...prev, [soru.id]: puan }));
    const sonraki = idx + 1;
    if (sonraki >= filtrelenmis.length) {
      setBitti(true);
    } else {
      setIdx(sonraki);
      setAcik(false);
    }
  }, [idx, filtrelenmis, soru]);

  const yenidenBasla = (yeniKategori) => {
    const kat = yeniKategori ?? kategori;
    setKategori(kat);
    setSorular(shuffle(SORULAR));
    setIdx(0);
    setAcik(false);
    setSeans({});
    setBitti(false);
  };

  const katDegistir = (slug) => {
    setKategori(slug);
    setIdx(0);
    setAcik(false);
    setBitti(false);
  };

  const seansIstatistik = () => {
    const values = Object.values(seans);
    return {
      biliyorum:  values.filter(v => v === 'biliyorum').length,
      kismen:     values.filter(v => v === 'kismen').length,
      bilmiyorum: values.filter(v => v === 'bilmiyorum').length,
      toplam:     values.length,
    };
  };

  const ilerleme = filtrelenmis.length > 0
    ? Math.round((idx / filtrelenmis.length) * 100)
    : 0;

  const aktifKat = KATEGORILER.find(k => k.slug === kategori);

  // ─── Bitti ekranı ──────────────────────────────────────────────────────────
  if (bitti) {
    const ist = seansIstatistik();
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>Seans tamamlandı!</h2>
          <p style={{ color: 'var(--color-text-mute)', fontSize: '14px', marginBottom: '32px' }}>
            {ist.toplam} soruyu yanıtladın
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {Object.entries(DEGERLENDIRME).map(([key, d]) => (
              <div key={key} style={{ padding: '16px 12px', borderRadius: '12px', background: d.bg, border: `1px solid ${d.renk}30` }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: d.renk }}>{ist[key]}</div>
                <div style={{ fontSize: '11px', color: d.renk, marginTop: '4px' }}>{d.label}</div>
              </div>
            ))}
          </div>

          {ist.bilmiyorum > 0 && (
            <div style={{ padding: '14px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', marginBottom: '24px', fontSize: '13px', color: 'var(--color-text-soft)' }}>
              <strong style={{ color: '#EF4444' }}>{ist.bilmiyorum} soru</strong> tekrar çalışmayı bekliyor.
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => yenidenBasla()} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--color-accent)', color: '#fff', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
              Tekrar Karıştır
            </button>
            <button onClick={() => { setKategori('hepsi'); yenidenBasla('hepsi'); }} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--color-cream-card)', color: 'var(--color-text-soft)', border: '1px solid var(--color-border)', fontSize: '14px', cursor: 'pointer' }}>
              Ana Menü
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!soru) return null;

  const katRenk = KATEGORILER.find(k => k.slug === soru.kategori)?.renk ?? '#6B7280';
  const zorRenk = ZORLUK[soru.zorluk]?.renk ?? '#6B7280';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      {/* Üst bar */}
      <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-cream)', position: 'sticky', top: 90, zIndex: 20 }}>
        {/* Kategori filtreleri */}
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'flex', gap: '6px', padding: '10px 20px', width: 'max-content', minWidth: '100%' }}>
            {KATEGORILER.map(k => {
              const aktif = kategori === k.slug;
              return (
                <button key={k.slug} onClick={() => katDegistir(k.slug)} style={{
                  padding: '5px 14px', borderRadius: '999px', fontSize: '12.5px',
                  border: `1px solid ${aktif ? k.renk : 'var(--color-border)'}`,
                  background: aktif ? `${k.renk}18` : 'transparent',
                  color: aktif ? k.renk : 'var(--color-text-mute)',
                  fontWeight: aktif ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: '11px' }}>{k.emoji}</span>{k.label}
                  <span style={{ fontSize: '10px', opacity: 0.6 }}>
                    {k.slug === 'hepsi' ? SORULAR.length : SORULAR.filter(s => s.kategori === k.slug).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* İlerleme çubuğu */}
        <div style={{ height: '2px', background: 'var(--color-border)' }}>
          <div style={{ height: '100%', background: aktifKat?.renk ?? 'var(--color-accent)', width: `${ilerleme}%`, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Soru kartı */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 20px' }}>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '999px', background: `${katRenk}18`, color: katRenk, border: `1px solid ${katRenk}30`, fontWeight: 600 }}>
              {KATEGORILER.find(k => k.slug === soru.kategori)?.emoji} {KATEGORILER.find(k => k.slug === soru.kategori)?.label}
            </span>
            <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '999px', background: `${zorRenk}12`, color: zorRenk, border: `1px solid ${zorRenk}25` }}>
              {ZORLUK[soru.zorluk]?.label}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
            {idx + 1} / {filtrelenmis.length}
          </span>
        </div>

        {/* Soru */}
        <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: isMobile ? '20px' : '28px', marginBottom: '16px' }}>
          <p style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.65, margin: 0 }}>
            {soru.soru}
          </p>
        </div>

        {/* Cevap bölümü */}
        {!acik ? (
          <button onClick={() => setAcik(true)} style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'var(--color-accent)', color: '#fff',
            border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            letterSpacing: '0.02em', transition: 'opacity 0.15s',
          }}>
            Cevabı Gör →
          </button>
        ) : (
          <div style={{ animation: 'fadeInUp 0.25s ease' }}>

            {/* Model cevap */}
            <div style={{ background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: isMobile ? '18px' : '24px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-mute)', letterSpacing: '0.08em', marginBottom: '10px' }}>MODEL CEVAP</div>
              <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--color-text-soft)', margin: 0 }}>
                {soru.cevap}
              </p>
            </div>

            {/* Anahtar noktalar */}
            <div style={{ background: `${katRenk}0a`, border: `1px solid ${katRenk}20`, borderRadius: '12px', padding: '14px 18px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: katRenk, letterSpacing: '0.08em', marginBottom: '10px' }}>VURGULANACAKLAR</div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {soru.anahtarlar.map((a, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.5 }}>{a}</li>
                ))}
              </ul>
            </div>

            {/* Kendin değerlendir */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginBottom: '10px', textAlign: 'center' }}>Bu soruyu nasıl buldun?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {Object.entries(DEGERLENDIRME).map(([key, d]) => (
                  <button key={key} onClick={() => ileri(key)} style={{
                    padding: isMobile ? '12px 6px' : '12px 8px', borderRadius: '10px',
                    background: d.bg, border: `1px solid ${d.renk}40`,
                    color: d.renk, fontSize: isMobile ? '12px' : '13px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Atla */}
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button onClick={() => ileri('atla')} style={{ background: 'none', border: 'none', color: 'var(--color-text-mute)', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                Atla →
              </button>
            </div>
          </div>
        )}

        {/* Mini seans skoru */}
        {Object.keys(seans).length > 0 && (
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {Object.entries(DEGERLENDIRME).map(([key, d]) => {
              const sayi = Object.values(seans).filter(v => v === key).length;
              if (!sayi) return null;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: d.renk }}>
                  <span style={{ fontWeight: 700 }}>{sayi}</span>
                  <span style={{ opacity: 0.7 }}>{d.label.split(' ')[1]}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
