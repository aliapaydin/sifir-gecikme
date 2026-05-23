'use client';
import { useState, useMemo } from 'react';

// ── Veri ──────────────────────────────────────────────────────
const KATEGORILER = [
  { id: 'hepsi',    label: 'Hepsi',         icon: '⚡' },
  { id: 'okuma',    label: 'Okuma / Yazma',  icon: '📂' },
  { id: 'inceleme', label: 'İnceleme',       icon: '🔍' },
  { id: 'secim',    label: 'Seçim & Filtre', icon: '🎯' },
  { id: 'temizlik', label: 'Temizlik',       icon: '🧹' },
  { id: 'gruplama', label: 'Gruplama',       icon: '📊' },
  { id: 'birlestir',label: 'Birleştirme',    icon: '🔗' },
  { id: 'sekil',    label: 'Şekillendirme',  icon: '🔄' },
  { id: 'string',   label: 'String',         icon: '📝' },
  { id: 'zaman',    label: 'Zaman Serisi',   icon: '📅' },
];

const REFERANS = [
  // ── OKUMA / YAZMA ──────────────────────────────────────────
  {
    id: 'read_csv',
    kategori: 'okuma',
    baslik: 'CSV oku',
    aciklama: 'CSV dosyasından DataFrame oluştur. Ayraç, encoding ve satır sayısı ayarlanabilir.',
    etiketler: ['read_csv', 'csv', 'dosya'],
    kod: `df = pd.read_csv('veri.csv')

# Gelişmiş seçenekler
df = pd.read_csv('veri.csv',
    sep=';',            # noktalı virgül ayraç
    encoding='utf-8',   # Türkçe karakter
    index_col=0,        # ilk sütun indeks
    usecols=['A','B'],  # sadece bu sütunlar
    nrows=1000,         # ilk 1000 satır
    skiprows=2,         # ilk 2 satırı atla
    na_values=['N/A','-'])  # NaN olarak say`,
  },
  {
    id: 'read_excel',
    kategori: 'okuma',
    baslik: 'Excel oku',
    aciklama: 'Excel dosyasından oku. Sayfa adı veya indeksiyle belirli bir sekme seçilebilir.',
    etiketler: ['read_excel', 'excel', 'xlsx'],
    kod: `df = pd.read_excel('veri.xlsx')

# Sayfa seç
df = pd.read_excel('veri.xlsx', sheet_name='Sayfa1')

# Tüm sayfaları sözlük olarak al
sayfalar = pd.read_excel('veri.xlsx', sheet_name=None)
df = sayfalar['Ocak']`,
  },
  {
    id: 'read_json_sql',
    kategori: 'okuma',
    baslik: 'JSON & SQL oku',
    aciklama: 'JSON dosyası veya veritabanı sorgusundan DataFrame oluştur.',
    etiketler: ['read_json', 'read_sql', 'json', 'sql', 'veritabanı'],
    kod: `# JSON
df = pd.read_json('veri.json')
df = pd.read_json('veri.json', orient='records')

# SQL — SQLAlchemy bağlantısıyla
import sqlalchemy
engine = sqlalchemy.create_engine('sqlite:///db.sqlite')
df = pd.read_sql('SELECT * FROM tablo', engine)
df = pd.read_sql_query(
    'SELECT id, ad FROM users WHERE aktif=1', engine)`,
  },
  {
    id: 'yaz',
    kategori: 'okuma',
    baslik: 'Kaydet (CSV / Excel / JSON)',
    aciklama: 'DataFrame\'i dosyaya yaz. index=False genellikle tercih edilir.',
    etiketler: ['to_csv', 'to_excel', 'to_json', 'kaydet', 'yaz'],
    kod: `# CSV
df.to_csv('sonuc.csv', index=False, encoding='utf-8-sig')

# Excel
df.to_excel('sonuc.xlsx', index=False, sheet_name='Veri')

# Birden fazla sayfa
with pd.ExcelWriter('rapor.xlsx') as writer:
    df1.to_excel(writer, sheet_name='Ocak', index=False)
    df2.to_excel(writer, sheet_name='Şubat', index=False)

# JSON
df.to_json('sonuc.json', orient='records', force_ascii=False)`,
  },

  // ── İNCELEME ──────────────────────────────────────────────
  {
    id: 'genel_bakis',
    kategori: 'inceleme',
    baslik: 'Genel bakış',
    aciklama: 'Veriyi tanımak için ilk çalıştırılacak komutlar.',
    etiketler: ['head', 'tail', 'shape', 'info', 'describe'],
    kod: `df.head(5)         # ilk 5 satır
df.tail(3)         # son 3 satır
df.shape           # (satır, sütun) — (1200, 8)
df.dtypes          # her sütunun tipi
df.info()          # tip + null sayısı + bellek
df.describe()      # sayısal sütunlar özet istatistik

# Kategorik sütunlar dahil
df.describe(include='all')

# Belirli tip
df.describe(include=['object'])`,
  },
  {
    id: 'eksik_kontrol',
    kategori: 'inceleme',
    baslik: 'Eksik değer kontrolü',
    aciklama: 'Hangi sütunda kaç eksik değer var, yüzde kaçı eksik.',
    etiketler: ['isnull', 'isna', 'eksik', 'null', 'nan'],
    kod: `# Sütun bazında eksik sayısı
df.isnull().sum()

# Yüzde olarak
df.isnull().mean().mul(100).round(1)

# Herhangi bir eksik içeren satırlar
df[df.isnull().any(axis=1)]

# Güzel özet
eksik = df.isnull().sum()
eksik = eksik[eksik > 0].sort_values(ascending=False)
print(eksik.to_frame('eksik').assign(
    yuzde=lambda x: (x['eksik']/len(df)*100).round(1)))`,
  },
  {
    id: 'tekil_sayim',
    kategori: 'inceleme',
    baslik: 'Tekil değer & frekans',
    aciklama: 'Kaç farklı değer var, en çok hangisi, dağılım nasıl.',
    etiketler: ['value_counts', 'nunique', 'unique', 'frekans'],
    kod: `df['sehir'].nunique()        # kaç farklı şehir
df['sehir'].unique()         # tüm farklı değerler (dizi)
df['sehir'].value_counts()   # her değer kaç kez

# Normalize (yüzde)
df['sehir'].value_counts(normalize=True).mul(100).round(1)

# Tüm sütunlar için tekil sayısı
df.nunique()

# Belirli değer var mı?
'İzmir' in df['sehir'].values`,
  },
  {
    id: 'bellek',
    kategori: 'inceleme',
    baslik: 'Bellek & tip özeti',
    aciklama: 'DataFrame ne kadar yer kaplıyor, tipler doğru mu.',
    etiketler: ['memory_usage', 'dtypes', 'bellek'],
    kod: `# Toplam bellek (MB)
df.memory_usage(deep=True).sum() / 1024**2

# Sütun bazında
df.memory_usage(deep=True)

# Kategorik tipe dönüştürerek bellek tasarrufu
for col in df.select_dtypes('object').columns:
    if df[col].nunique() / len(df) < 0.5:
        df[col] = df[col].astype('category')

df.memory_usage(deep=True).sum() / 1024**2  # sonrası`,
  },

  // ── SEÇİM & FİLTRELEME ────────────────────────────────────
  {
    id: 'sutun_secim',
    kategori: 'secim',
    baslik: 'Sütun seçimi',
    aciklama: 'Tek sütun Series, birden fazla sütun DataFrame döndürür.',
    etiketler: ['loc', 'iloc', 'sütun', 'seçim', 'columns'],
    kod: `df['yas']              # Series
df[['ad', 'yas']]      # DataFrame (listele)

# Tip bazında seçim
df.select_dtypes(include='number')
df.select_dtypes(exclude='object')

# Sütun adına göre filtre
df.filter(like='gelir')     # 'gelir' içeren sütunlar
df.filter(regex='^Q')       # Q ile başlayanlar`,
  },
  {
    id: 'loc_iloc',
    kategori: 'secim',
    baslik: 'loc & iloc',
    aciklama: 'loc etiket bazlı, iloc konum bazlı seçim yapar.',
    etiketler: ['loc', 'iloc', 'satır', 'indeks', 'konumsal'],
    kod: `# loc — etiket bazlı
df.loc[5]              # indeks 5 olan satır
df.loc[0:4]            # indeks 0-4 arası (4 dahil!)
df.loc[0:4, 'ad':'yas']  # satır ve sütun aralığı

# iloc — konum bazlı (Python gibi, son hariç)
df.iloc[0]             # ilk satır
df.iloc[-1]            # son satır
df.iloc[0:5]           # ilk 5 satır
df.iloc[:, 0:3]        # tüm satırlar, ilk 3 sütun
df.iloc[[0, 2, 4], [1, 3]]  # belirli satır & sütun`,
  },
  {
    id: 'boolean_filtre',
    kategori: 'secim',
    baslik: 'Koşullu filtreleme',
    aciklama: 'Boolean maskeleme ile satır filtrele. & ve | operatörleri, her koşul parantez içinde.',
    etiketler: ['filtre', 'koşul', 'boolean', 'mask', 'query'],
    kod: `# Tek koşul
df[df['yas'] > 30]
df[df['sehir'] == 'İstanbul']

# Çoklu koşul (&=ve, |=veya)
df[(df['yas'] > 25) & (df['gelir'] > 5000)]
df[(df['sehir'] == 'İzmir') | (df['sehir'] == 'Ankara')]

# Liste içinde mi?
df[df['sehir'].isin(['İstanbul', 'Ankara', 'İzmir'])]

# İçeriyor mu? (string)
df[df['ad'].str.contains('Ali', na=False)]

# query ile okunabilir yazım
df.query("yas > 25 and gelir > 5000")
df.query("sehir in ['İstanbul','Ankara']")`,
  },
  {
    id: 'sample_nlargest',
    kategori: 'secim',
    baslik: 'Rastgele & sıralı seçim',
    aciklama: 'Örneklem al, en büyük/küçük N satırı getir.',
    etiketler: ['sample', 'nlargest', 'nsmallest', 'sort_values', 'head'],
    kod: `# Rastgele örneklem
df.sample(100)                    # 100 satır
df.sample(frac=0.1, random_state=42)  # %10

# En büyük N
df.nlargest(5, 'gelir')           # geliri en yüksek 5
df.nsmallest(3, 'yas')            # en genç 3

# Sıralama
df.sort_values('gelir', ascending=False)
df.sort_values(['sehir', 'gelir'], ascending=[True, False])`,
  },

  // ── TEMİZLİK ──────────────────────────────────────────────
  {
    id: 'eksik_isle',
    kategori: 'temizlik',
    baslik: 'Eksik değer işleme',
    aciklama: 'Eksik satırları sil ya da doldur. inplace=True yerine atama tercih edilir.',
    etiketler: ['dropna', 'fillna', 'ffill', 'bfill', 'interpolate', 'eksik'],
    kod: `# Sil
df.dropna()                          # herhangi eksik → satır sil
df.dropna(subset=['gelir', 'yas'])   # bu sütunlarda eksik olanlar
df.dropna(thresh=5)                  # en az 5 dolu değer olsun

# Sabit değerle doldur
df.fillna(0)
df['gelir'].fillna(df['gelir'].median())
df.fillna({'gelir': 0, 'sehir': 'Bilinmiyor'})

# İleri/geri taşı
df['fiyat'].ffill()   # önceki değeri taşı
df['fiyat'].bfill()   # sonraki değeri taşı

# Interpolasyon (zaman serisi ideal)
df['fiyat'].interpolate(method='linear')`,
  },
  {
    id: 'duplikat',
    kategori: 'temizlik',
    baslik: 'Duplikat işleme',
    aciklama: 'Aynı satırları bul ve sil.',
    etiketler: ['drop_duplicates', 'duplicated', 'tekrar'],
    kod: `# Duplikat var mı?
df.duplicated().sum()

# Hangi satırlar?
df[df.duplicated(keep=False)]

# Sil
df.drop_duplicates()
df.drop_duplicates(subset=['tc_no'])        # bu sütun bazında
df.drop_duplicates(subset=['ad'], keep='last')  # son geleni sakla`,
  },
  {
    id: 'tip_donusum',
    kategori: 'temizlik',
    baslik: 'Tip dönüşümü',
    aciklama: 'Sütun tiplerini düzelt. Tarih, sayı, kategori dönüşümleri.',
    etiketler: ['astype', 'to_numeric', 'to_datetime', 'category', 'tip'],
    kod: `# Temel tip dönüşümü
df['yas'] = df['yas'].astype(int)
df['fiyat'] = df['fiyat'].astype(float)
df['sehir'] = df['sehir'].astype('category')

# Hatalı değerleri NaN yap (errors='coerce')
df['gelir'] = pd.to_numeric(df['gelir'], errors='coerce')

# Tarih dönüşümü
df['tarih'] = pd.to_datetime(df['tarih'])
df['tarih'] = pd.to_datetime(df['tarih'], format='%d/%m/%Y')

# Toplu sayısal dönüşüm
sayisal_sutunlar = ['fiyat', 'adet', 'indirim']
df[sayisal_sutunlar] = df[sayisal_sutunlar].apply(
    pd.to_numeric, errors='coerce')`,
  },
  {
    id: 'yeniden_adlandir',
    kategori: 'temizlik',
    baslik: 'Sütun / satır yeniden adlandırma',
    aciklama: 'Sütun isimlerini değiştir, indeksi sıfırla.',
    etiketler: ['rename', 'columns', 'reset_index', 'set_index'],
    kod: `# Belirli sütunları yeniden adlandır
df.rename(columns={'ad': 'isim', 'yas': 'yaş'})

# Tüm sütunları küçük harfe ve _ ile yaz
df.columns = df.columns.str.lower().str.replace(' ', '_')

# İndeksi sütun yap / sıfırla
df.reset_index(drop=True)         # eski indeksi sil
df.reset_index()                   # eski indeksi sütun yap
df.set_index('tc_no')             # sütunu indeks yap`,
  },
  {
    id: 'apply_map',
    kategori: 'temizlik',
    baslik: 'apply, map, replace',
    aciklama: 'Her satıra / sütuna fonksiyon uygula. map ile değer eşle.',
    etiketler: ['apply', 'map', 'replace', 'lambda', 'transform'],
    kod: `# Sütuna fonksiyon uygula
df['yas_grubu'] = df['yas'].apply(
    lambda x: 'genç' if x < 30 else 'orta' if x < 50 else 'kıdemli')

# Satıra uygula (axis=1)
df['tam_ad'] = df.apply(
    lambda row: f"{row['ad']} {row['soyad']}", axis=1)

# map ile değer eşleştirme
sehir_map = {'IST': 'İstanbul', 'ANK': 'Ankara', 'IZM': 'İzmir'}
df['sehir'] = df['sehir_kodu'].map(sehir_map)

# replace
df['cinsiyet'].replace({'E': 'Erkek', 'K': 'Kadın'})
df.replace({'': None})  # boş stringleri NaN yap`,
  },
  {
    id: 'clip_outlier',
    kategori: 'temizlik',
    baslik: 'Aykırı değer kırpma',
    aciklama: 'Belirli aralığın dışındaki değerleri sınıra çek. IQR yöntemi.',
    etiketler: ['clip', 'aykırı', 'outlier', 'iqr', 'quantile'],
    kod: `# Sabit aralıkla kırp
df['yas'] = df['yas'].clip(lower=0, upper=100)

# IQR yöntemiyle aykırıları temizle
Q1 = df['gelir'].quantile(0.25)
Q3 = df['gelir'].quantile(0.75)
IQR = Q3 - Q1
alt = Q1 - 1.5 * IQR
ust = Q3 + 1.5 * IQR

# Sadece filtrele
df_temiz = df[df['gelir'].between(alt, ust)]

# Kırp (kayıt kaybetme)
df['gelir'] = df['gelir'].clip(alt, ust)`,
  },

  // ── GRUPLAMA ──────────────────────────────────────────────
  {
    id: 'groupby_temel',
    kategori: 'gruplama',
    baslik: 'groupby temelleri',
    aciklama: 'Gruba göre topla, say, ortalama al.',
    etiketler: ['groupby', 'sum', 'mean', 'count', 'gruplama'],
    kod: `# Temel aggregasyon
df.groupby('sehir')['gelir'].mean()
df.groupby('sehir')['gelir'].sum()
df.groupby('sehir').size()          # satır sayısı

# Çoklu sütun
df.groupby(['sehir', 'cinsiyet'])['gelir'].mean()

# reset_index ile düzgün DataFrame
df.groupby('sehir')['gelir'].mean().reset_index()`,
  },
  {
    id: 'agg',
    kategori: 'gruplama',
    baslik: 'agg — çoklu istatistik',
    aciklama: 'Aynı anda birden fazla aggregasyon fonksiyonu uygula.',
    etiketler: ['agg', 'aggregate', 'named', 'çoklu'],
    kod: `# Birden fazla fonksiyon
df.groupby('sehir')['gelir'].agg(['mean', 'median', 'std', 'count'])

# Sütun bazında farklı fonksiyon
df.groupby('sehir').agg({
    'gelir': ['mean', 'max'],
    'yas': 'median',
    'id': 'count'
})

# Named aggregation (temiz sütun adları)
df.groupby('sehir').agg(
    ort_gelir=('gelir', 'mean'),
    maks_gelir=('gelir', 'max'),
    kisi_sayisi=('id', 'count')
).reset_index()`,
  },
  {
    id: 'pivot_table',
    kategori: 'gruplama',
    baslik: 'pivot_table',
    aciklama: 'Satır × sütun matris halinde özetle. Eksik değerleri fill_value ile doldur.',
    etiketler: ['pivot_table', 'pivot', 'crosstab', 'çapraz'],
    kod: `# Temel pivot
pd.pivot_table(df,
    values='gelir',
    index='sehir',
    columns='cinsiyet',
    aggfunc='mean')

# Çoklu aggregasyon
pd.pivot_table(df,
    values=['gelir', 'yas'],
    index='sehir',
    columns='egitim',
    aggfunc={'gelir': 'mean', 'yas': 'median'},
    fill_value=0)

# Crosstab — frekans tablosu
pd.crosstab(df['sehir'], df['cinsiyet'], margins=True)`,
  },
  {
    id: 'transform_filter',
    kategori: 'gruplama',
    baslik: 'transform & filter',
    aciklama: 'transform gruba göre değer hesaplar ama orijinal şekli korur. filter grubu koşula göre eler.',
    etiketler: ['transform', 'filter', 'group', 'normalize'],
    kod: `# transform — grup ortalamasını satıra ekle
df['grup_ort_gelir'] = df.groupby('sehir')['gelir'].transform('mean')

# z-score normalize (grup içinde)
df['gelir_z'] = df.groupby('sehir')['gelir'].transform(
    lambda x: (x - x.mean()) / x.std())

# Gruba kümülatif toplam
df['kumulatif'] = df.groupby('sehir')['gelir'].transform('cumsum')

# filter — en az 10 kişisi olan şehirler
buyuk_sehirler = df.groupby('sehir').filter(lambda g: len(g) >= 10)`,
  },

  // ── BİRLEŞTİRME ───────────────────────────────────────────
  {
    id: 'merge',
    kategori: 'birlestir',
    baslik: 'merge — JOIN benzeri birleştirme',
    aciklama: 'İki DataFrame\'i ortak sütun üzerinden birleştir. SQL JOIN\'e eşdeğer.',
    etiketler: ['merge', 'join', 'inner', 'left', 'outer', 'birleştir'],
    kod: `# Inner join (varsayılan)
pd.merge(df1, df2, on='musteri_id')

# Left join (df1'deki tüm kayıtlar)
pd.merge(df1, df2, on='musteri_id', how='left')

# Farklı sütun adlarıyla
pd.merge(df1, df2,
    left_on='musteri_no',
    right_on='id',
    how='inner')

# Çakışan sütun adları için suffix
pd.merge(df1, df2, on='id', suffixes=('_sol', '_sag'))

# Hangi satırların eşleşmediğini bul
pd.merge(df1, df2, on='id', how='left', indicator=True)\
  .query("_merge == 'left_only'")`,
  },
  {
    id: 'concat',
    kategori: 'birlestir',
    baslik: 'concat — üst üste / yan yana ekle',
    aciklama: 'Aynı yapıdaki DataFrame\'leri dikey (satır) veya yatay (sütun) birleştir.',
    etiketler: ['concat', 'append', 'dikey', 'yatay', 'stack'],
    kod: `# Dikey birleştirme (satır ekle)
pd.concat([df1, df2, df3], ignore_index=True)

# Hangi DataFrame'den geldiğini işaretle
pd.concat([df1, df2], keys=['ocak', 'subat'])

# Yatay birleştirme (sütun ekle)
pd.concat([df1, df2], axis=1)

# Sadece ortak sütunlar (inner)
pd.concat([df1, df2], join='inner', ignore_index=True)

# Listedeki tüm CSV'leri birleştir
import glob
dosyalar = glob.glob('data/*.csv')
df = pd.concat([pd.read_csv(f) for f in dosyalar],
               ignore_index=True)`,
  },

  // ── ŞEKİLLENDİRME ─────────────────────────────────────────
  {
    id: 'melt',
    kategori: 'sekil',
    baslik: 'melt — geniş → uzun format',
    aciklama: 'Birden fazla değer sütununu tek bir sütunda topla (wide→long). Tidy data için.',
    etiketler: ['melt', 'wide', 'long', 'tidy', 'unpivot'],
    kod: `# Örnek: yıl sütunları → satırlara dönüştür
# Önce:  sehir | 2022 | 2023 | 2024
# Sonra: sehir | yil  | nufus

df_uzun = df.melt(
    id_vars=['sehir'],           # sabit kalacak sütunlar
    value_vars=['2022','2023','2024'],  # dönüştürülecek
    var_name='yil',              # yeni sütun adı (değişken)
    value_name='nufus')          # yeni sütun adı (değer)`,
  },
  {
    id: 'pivot',
    kategori: 'sekil',
    baslik: 'pivot — uzun → geniş format',
    aciklama: 'Bir sütundaki değerleri sütun başlığına dönüştür (long→wide).',
    etiketler: ['pivot', 'long', 'wide', 'reshape'],
    kod: `# Önce: sehir | yil  | nufus
# Sonra: sehir | 2022 | 2023 | 2024
df_genis = df_uzun.pivot(
    index='sehir',
    columns='yil',
    values='nufus')

df_genis.columns.name = None      # sütun grubunu temizle
df_genis.reset_index()             # sehir tekrar sütun olsun`,
  },
  {
    id: 'explode_stack',
    kategori: 'sekil',
    baslik: 'explode, stack & unstack',
    aciklama: 'Liste içeren sütunu patlatarak satırlara böl. Stack/unstack hiyerarşik indeks için.',
    etiketler: ['explode', 'stack', 'unstack', 'liste', 'hiyerarşik'],
    kod: `# explode — liste içeren sütun
# df['etiketler'] = ['python', 'pandas', ...]
df.explode('etiketler').reset_index(drop=True)

# stack — sütunları satıra çevir
df.stack()          # en içteki sütun seviyesi → satır
df.unstack()        # en içteki satır seviyesi → sütun

# Transpose
df.T`,
  },

  // ── STRING ────────────────────────────────────────────────
  {
    id: 'str_temel',
    kategori: 'string',
    baslik: 'Temel string işlemleri',
    aciklama: 'Metin sütunlarında büyük/küçük harf, boşluk temizleme ve uzunluk.',
    etiketler: ['str', 'lower', 'upper', 'strip', 'len', 'metin'],
    kod: `df['ad'].str.lower()           # küçük harf
df['ad'].str.upper()           # büyük harf
df['ad'].str.title()           # Her Kelimenin Baş Harfi
df['ad'].str.strip()           # baştaki/sondaki boşluk sil
df['ad'].str.len()             # karakter sayısı
df['ad'].str.replace(' ','_')  # boşlukları _ ile değiştir

# Türkçe temizleme — büyük/küçük + strip birlikte
df['sehir'] = df['sehir'].str.strip().str.lower()`,
  },
  {
    id: 'str_filtre_bol',
    kategori: 'string',
    baslik: 'contains, split & extract',
    aciklama: 'Metin içinde ara, böl, regex ile çıkar.',
    etiketler: ['contains', 'split', 'extract', 'startswith', 'endswith', 'regex'],
    kod: `# İçeriyor mu?
df[df['ad'].str.contains('Ali', na=False)]
df[df['email'].str.contains(r'@gmail\.com$', regex=True)]

# Başlıyor/bitiyor mu?
df[df['kod'].str.startswith('TR')]
df[df['dosya'].str.endswith('.csv')]

# Böl
df['ad'].str.split(' ')               # liste döner
df[['ad', 'soyad']] = df['tam_ad'].str.split(' ', n=1, expand=True)

# Regex ile çıkar
df['telefon'].str.extract(r'(\\d{3}-\\d{3}-\\d{4})')

# Kategori çıkar (ilk kelime)
df['kategori'] = df['aciklama'].str.split().str[0]`,
  },

  // ── ZAMAN SERİSİ ──────────────────────────────────────────
  {
    id: 'tarih_donusum',
    kategori: 'zaman',
    baslik: 'Tarih dönüşümü & bileşen çıkarma',
    aciklama: 'Stringe çevir, bileşen çek (yıl, ay, gün, hafta, saat).',
    etiketler: ['to_datetime', 'dt', 'year', 'month', 'dayofweek', 'tarih'],
    kod: `df['tarih'] = pd.to_datetime(df['tarih'])

# Bileşen çıkar
df['yil']      = df['tarih'].dt.year
df['ay']       = df['tarih'].dt.month
df['gun']      = df['tarih'].dt.day
df['saat']     = df['tarih'].dt.hour
df['haftaici'] = df['tarih'].dt.dayofweek   # 0=Pzt, 6=Paz
df['hafta_no'] = df['tarih'].dt.isocalendar().week
df['ay_adi']   = df['tarih'].dt.month_name(locale='tr_TR')

# Hafta sonu mu?
df['hafta_sonu'] = df['tarih'].dt.dayofweek >= 5`,
  },
  {
    id: 'resample_rolling',
    kategori: 'zaman',
    baslik: 'resample & rolling',
    aciklama: 'Zaman serisini yeniden örnekle (günlük → haftalık), hareketli ortalama hesapla.',
    etiketler: ['resample', 'rolling', 'hareketli', 'ortalama', 'haftalık', 'aylık'],
    kod: `df = df.set_index('tarih')  # önce tarih indeks olmalı

# Yeniden örnekleme
df.resample('W').sum()      # haftalık toplam
df.resample('M').mean()     # aylık ortalama
df.resample('Q').sum()      # çeyreklik toplam
df.resample('D').ffill()    # günlük, boşlukları doldur

# Hareketli istatistikler
df['fiyat'].rolling(window=7).mean()   # 7 günlük hareketli ort
df['fiyat'].rolling(7).std()           # hareketli std sapma
df['fiyat'].ewm(span=7).mean()         # üstel ağırlıklı ort

# Lag / shift
df['fiyat_dun'] = df['fiyat'].shift(1)
df['gunluk_degisim'] = df['fiyat'].pct_change()`,
  },
  {
    id: 'tarih_aralik',
    kategori: 'zaman',
    baslik: 'Tarih aralığı & fark hesaplama',
    aciklama: 'Belirli tarihler arasını filtrele, iki tarih arasındaki farkı bul.',
    etiketler: ['date_range', 'timedelta', 'fark', 'between', 'aralık'],
    kod: `# Tarih aralığı oluştur
pd.date_range('2024-01-01', periods=365, freq='D')
pd.date_range('2024-01-01', '2024-12-31', freq='W')

# Aralıkta filtrele
df[df['tarih'].between('2024-01-01', '2024-06-30')]

# Zaman farkı
df['gun_farki'] = (df['bitis'] - df['baslangic']).dt.days
df['ay_farki']  = (df['bitis'] - df['baslangic']).dt.days // 30

# Bugünden kaç gün önce/sonra
bugun = pd.Timestamp.now()
df['gecen_gun'] = (bugun - df['tarih']).dt.days`,
  },
];

// ── Bileşenler ────────────────────────────────────────────────
function KopyalaButon({ kod }) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(kod);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 1800);
    } catch {
      // fallback
    }
  };

  return (
    <button
      onClick={kopyala}
      title={kopyalandi ? 'Kopyalandı!' : 'Kopyala'}
      style={{
        position: 'absolute', top: '10px', right: '10px',
        padding: '4px 10px', borderRadius: '6px', fontSize: '11px',
        border: `1px solid ${kopyalandi ? '#1D9E75' : 'var(--color-border)'}`,
        background: kopyalandi ? 'rgba(29,158,117,0.12)' : 'var(--color-cream)',
        color: kopyalandi ? '#1D9E75' : 'var(--color-text-mute)',
        cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500,
      }}
    >
      {kopyalandi ? '✓ Kopyalandı' : 'Kopyala'}
    </button>
  );
}

function ReferansKart({ item }) {
  const [acik, setAcik] = useState(false);
  const kat = KATEGORILER.find(k => k.id === item.kategori);

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'var(--color-cream-card)',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Başlık */}
      <button
        onClick={() => setAcik(v => !v)}
        style={{
          width: '100%', textAlign: 'left', padding: '14px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600 }}>
              {kat?.icon} {kat?.label}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '3px' }}>
            {item.baslik}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>
            {item.aciklama}
          </div>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            color: 'var(--color-text-mute)', flexShrink: 0, marginTop: '2px',
            transform: acik ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Kod bloğu */}
      {acik && (
        <div style={{ position: 'relative', borderTop: '1px solid var(--color-border)' }}>
          <pre style={{
            margin: 0,
            padding: '14px 44px 14px 16px',
            fontSize: '12px',
            lineHeight: 1.7,
            color: 'var(--color-text-soft)',
            background: 'var(--color-cream)',
            overflowX: 'auto',
            fontFamily: 'var(--font-mono)',
          }}>
            <code>{item.kod}</code>
          </pre>
          <KopyalaButon kod={item.kod} />
        </div>
      )}
    </div>
  );
}

// ── Ana Sayfa ─────────────────────────────────────────────────
export default function PandasReferans() {
  const [aktifKat, setAktifKat] = useState('hepsi');
  const [aramaMetni, setAramaMetni] = useState('');
  const [hepsiniAc, setHepsiniAc] = useState(false);

  const filtreli = useMemo(() => {
    let liste = REFERANS;
    if (aktifKat !== 'hepsi') {
      liste = liste.filter(r => r.kategori === aktifKat);
    }
    if (aramaMetni.trim()) {
      const q = aramaMetni.toLowerCase();
      liste = liste.filter(r =>
        r.baslik.toLowerCase().includes(q) ||
        r.aciklama.toLowerCase().includes(q) ||
        r.etiketler.some(e => e.toLowerCase().includes(q)) ||
        r.kod.toLowerCase().includes(q)
      );
    }
    return liste;
  }, [aktifKat, aramaMetni]);

  return (
    <main className="min-h-screen">
      <article className="max-w-5xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-8 inline-block" style={{ color: 'var(--color-text-mute)' }}>← Ana sayfa</a>

        {/* Hero */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="badge badge-guide">araç</span>
            <span className="badge badge-interactive">interaktif</span>
          </div>
          <h1 className="font-serif font-medium mb-3"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', color: 'var(--color-text)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Pandas hızlı referans
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-soft)', lineHeight: 1.7, maxWidth: '580px' }}>
            {REFERANS.length} fonksiyon, Türkçe açıklama, kopyalanabilir kod.
            Ara, kategoriye göre filtrele, koda tıkla.
          </p>
        </div>

        {/* Arama */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-mute)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Ara: merge, groupby, dropna, tarih..."
            value={aramaMetni}
            onChange={e => setAramaMetni(e.target.value)}
            style={{
              width: '100%', padding: '11px 14px 11px 42px',
              borderRadius: '10px', fontSize: '14px',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-cream-card)',
              color: 'var(--color-text)',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {aramaMetni && (
            <button
              onClick={() => setAramaMetni('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '16px', color: 'var(--color-text-mute)', lineHeight: 1,
              }}>×</button>
          )}
        </div>

        {/* Kategori filtreleri */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
          {KATEGORILER.map(k => {
            const secili = aktifKat === k.id;
            const sayi = k.id === 'hepsi'
              ? REFERANS.length
              : REFERANS.filter(r => r.kategori === k.id).length;
            return (
              <button key={k.id}
                onClick={() => setAktifKat(k.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px', borderRadius: '999px', fontSize: '12px',
                  border: `1.5px solid ${secili ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: secili ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
                  color: secili ? 'var(--color-accent)' : 'var(--color-text-mute)',
                  cursor: 'pointer', fontWeight: secili ? 600 : 400,
                  transition: 'all 0.15s',
                }}>
                {k.icon} {k.label}
                <span style={{
                  fontSize: '10px', fontFamily: 'var(--font-mono)',
                  background: secili ? 'var(--color-accent)' : 'var(--color-border)',
                  color: secili ? '#fff' : 'var(--color-text-mute)',
                  borderRadius: '999px', padding: '1px 5px', lineHeight: '1.4',
                }}>
                  {sayi}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sonuç satırı */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>
            {filtreli.length === 0
              ? 'Sonuç bulunamadı'
              : `${filtreli.length} fonksiyon${aramaMetni ? ` — "${aramaMetni}"` : ''}`}
          </div>
          <button
            onClick={() => setHepsiniAc(v => !v)}
            style={{
              fontSize: '12px', color: 'var(--color-accent)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, fontWeight: 500,
            }}>
            {hepsiniAc ? 'Hepsini kapat ↑' : 'Hepsini aç ↓'}
          </button>
        </div>

        {/* Kartlar */}
        {filtreli.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-mute)', fontSize: '14px' }}>
            "{aramaMetni}" için sonuç bulunamadı.<br />
            <button onClick={() => setAramaMetni('')} style={{ marginTop: '8px', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              Aramayı temizle
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '10px' }}>
            {filtreli.map(item => (
              <AcikKapatKart key={`${item.id}-${hepsiniAc}`} item={item} zorlaAcik={hepsiniAc} />
            ))}
          </div>
        )}

        {/* import notu */}
        <div style={{ marginTop: '2.5rem', padding: '16px 20px', borderRadius: '10px', background: 'var(--color-cream)', border: '0.5px solid var(--color-border)', fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--color-text-soft)' }}>Standart import:</strong>
          <pre style={{ margin: '6px 0 0', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-soft)' }}>
            {`import pandas as pd\nimport numpy as np`}
          </pre>
        </div>
      </article>
    </main>
  );
}

// Dışarıdan "hepsini aç" bayrağını alan wrapper kart
function AcikKapatKart({ item, zorlaAcik }) {
  const [acik, setAcik] = useState(zorlaAcik);
  const kat = KATEGORILER.find(k => k.id === item.kategori);

  // zorlaAcik değişince sync et
  const [son, setSon] = useState(zorlaAcik);
  if (zorlaAcik !== son) {
    setSon(zorlaAcik);
    setAcik(zorlaAcik);
  }

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'var(--color-cream-card)',
    }}>
      <button
        onClick={() => setAcik(v => !v)}
        style={{
          width: '100%', textAlign: 'left', padding: '14px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '3px' }}>
            {kat?.icon} {kat?.label}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '3px' }}>
            {item.baslik}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', lineHeight: 1.5 }}>
            {item.aciklama}
          </div>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{
            color: 'var(--color-text-mute)', flexShrink: 0, marginTop: '2px',
            transform: acik ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {acik && (
        <div style={{ position: 'relative', borderTop: '1px solid var(--color-border)' }}>
          <pre style={{
            margin: 0,
            padding: '14px 48px 14px 16px',
            fontSize: '12px',
            lineHeight: 1.7,
            color: 'var(--color-text-soft)',
            background: 'var(--color-cream)',
            overflowX: 'auto',
            fontFamily: 'var(--font-mono)',
          }}>
            <code>{item.kod}</code>
          </pre>
          <KopyalaButon kod={item.kod} />
        </div>
      )}
    </div>
  );
}
