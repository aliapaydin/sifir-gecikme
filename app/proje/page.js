'use client';

import { useEffect, useRef, useState } from 'react';

const SENARYOLAR = {
  eticaret: {
    id: 'eticaret',
    isim: '🛒 E-Ticaret Analizi',
    aciklama: 'Bir e-ticaret şirketinin veri analisti olarak işe başladın. Satış verilerini analiz edip yönetim için rapor hazırlayacaksın.',
    renk: '#1D9E75',
    bg: '#E1F5EE',
  },
  ik: {
    id: 'ik',
    isim: '👥 İK Analizi',
    aciklama: 'Bir şirketin İK analisti olarak işe başladın. Çalışan verilerini analiz edip performans ve maaş raporunu hazırlayacaksın.',
    renk: '#7F77DD',
    bg: '#EEEDFE',
  },
};

const ADIMLAR = {
  eticaret: [
    {
      no: 1, baslik: 'Veri Oluştur', emoji: '🏗️',
      gorev: 'E-ticaret şirketine veri analisti olarak katıldın. İlk görevin: ham satış verisini oluşturmak. Aşağıdaki kodu çalıştırarak 3 dataset oluştur.',
      ipuclari: ['Kodu olduğu gibi çalıştırabilirsin — veri otomatik oluşacak.', 'Çıktıda 3 tablo ve boyutları görmelisin.', 'Kasıtlı hatalar var! Eksik değerler, yanlış tarih formatları, tekrar satırlar.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 300

musteriler = pd.DataFrame({
    'musteri_id': range(1, 101),
    'sehir': np.random.choice(['Istanbul','Izmir','Ankara','Bursa','Antalya'], 100),
    'yas': np.random.randint(18, 65, 100),
    'segment': np.random.choice(['Bireysel','Kurumsal','Premium'], 100, p=[0.6,0.3,0.1])
})

urunler = pd.DataFrame({
    'urun_id': range(1, 31),
    'kategori': np.random.choice(['Elektronik','Giyim','Ev','Spor','Kitap'], 30),
    'fiyat': np.random.choice([99,199,299,499,799,999,1499,1999,2999,4999], 30),
    'maliyet': np.random.choice([50,100,150,250,400,500,750,1000,1500,2500], 30)
})

siparisler = pd.DataFrame({
    'siparis_id': range(1, n+1),
    'musteri_id': np.random.randint(1, 101, n),
    'urun_id': np.random.randint(1, 31, n),
    'tarih': pd.date_range('2024-01-01', periods=n, freq='1D').strftime('%Y/%m/%d'),
    'adet': np.random.randint(1, 6, n),
    'indirim': np.random.choice([0, 0.05, 0.10, 0.15, 0.20], n),
    'durum': np.random.choice(['tamamlandi','iptal','iade','beklemede'], n, p=[0.7,0.1,0.1,0.1])
})

siparisler.loc[np.random.choice(n, 20, replace=False), 'musteri_id'] = np.nan
siparisler.loc[np.random.choice(n, 15, replace=False), 'indirim'] = np.nan
siparisler.loc[5:10, 'tarih'] = '01-2024-15'
siparisler = pd.concat([siparisler, siparisler.iloc[:10]], ignore_index=True)

print("Siparisler: " + str(siparisler.shape))
print("Musteriler: " + str(musteriler.shape))
print("Urunler: " + str(urunler.shape))
print("Veri olusturuldu!")`,
      dogrulama: (o) => o.includes('olusturuldu'),
    },
    {
      no: 2, baslik: 'Keşifsel Analiz', emoji: '🔍',
      gorev: 'Veriyi tanıma zamanı! EDA ile veriyi incele. Kaç satır var? Hangi kolonlarda eksik değer var? Veri tipleri doğru mu?',
      ipuclari: ['df.info() kolon tiplerini ve eksik değerleri gösterir.', 'df.isnull().sum() her kolondaki eksik değer sayısını verir.', 'df.describe() sayısal kolonların istatistiklerini gösterir.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 300
siparisler = pd.DataFrame({
    'siparis_id': range(1, n+1),
    'musteri_id': np.random.randint(1, 101, n),
    'urun_id': np.random.randint(1, 31, n),
    'tarih': pd.date_range('2024-01-01', periods=n, freq='1D').strftime('%Y/%m/%d'),
    'adet': np.random.randint(1, 6, n),
    'indirim': np.random.choice([0, 0.05, 0.10, 0.15, 0.20], n),
    'durum': np.random.choice(['tamamlandi','iptal','iade','beklemede'], n, p=[0.7,0.1,0.1,0.1])
})
siparisler.loc[np.random.choice(n, 20, replace=False), 'musteri_id'] = np.nan
siparisler.loc[np.random.choice(n, 15, replace=False), 'indirim'] = np.nan
siparisler.loc[5:10, 'tarih'] = '01-2024-15'
siparisler = pd.concat([siparisler, siparisler.iloc[:10]], ignore_index=True)

print("=== TEMEL BILGILER ===")
print("Satir: " + str(len(siparisler)) + " | Kolon: " + str(len(siparisler.columns)))
print("")
print("=== VERI TIPLERI ===")
print(siparisler.dtypes)
print("")
print("=== EKSIK DEGERLER ===")
print(siparisler.isnull().sum())
print("")
print("=== ISTATISTIKSEL OZET ===")
print(siparisler.describe())
print("")
print("=== DURUM DAGILIMI ===")
print(siparisler['durum'].value_counts())
print("")
print("EDA tamamlandi!")`,
      dogrulama: (o) => o.includes('EDA tamamlandi'),
    },
    {
      no: 3, baslik: 'ETL — Temizle', emoji: '🔧',
      gorev: 'Sorunları tespit ettin. Şimdi temizle! Eksik değerleri doldur, tarih formatlarını düzelt, tekrar eden satırları sil.',
      ipuclari: ['pd.to_datetime(errors="coerce") yanlış formatları NaT\'a çevirir.', 'fillna() ile eksik değerleri doldur — sayısallar için medyan.', 'drop_duplicates() tekrar eden satırları siler.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 300
siparisler = pd.DataFrame({
    'siparis_id': range(1, n+1),
    'musteri_id': np.random.randint(1, 101, n),
    'urun_id': np.random.randint(1, 31, n),
    'tarih': pd.date_range('2024-01-01', periods=n, freq='1D').strftime('%Y/%m/%d'),
    'adet': np.random.randint(1, 6, n),
    'indirim': np.random.choice([0, 0.05, 0.10, 0.15, 0.20], n),
    'durum': np.random.choice(['tamamlandi','iptal','iade','beklemede'], n, p=[0.7,0.1,0.1,0.1])
})
siparisler.loc[np.random.choice(n, 20, replace=False), 'musteri_id'] = np.nan
siparisler.loc[np.random.choice(n, 15, replace=False), 'indirim'] = np.nan
siparisler.loc[5:10, 'tarih'] = '01-2024-15'
siparisler = pd.concat([siparisler, siparisler.iloc[:10]], ignore_index=True)

print("Ham veri: " + str(siparisler.shape))
siparisler = siparisler.drop_duplicates()
print("Tekrar silinince: " + str(siparisler.shape))
siparisler['tarih'] = pd.to_datetime(siparisler['tarih'], errors='coerce')
siparisler = siparisler.dropna(subset=['tarih'])
siparisler['musteri_id'] = siparisler['musteri_id'].fillna(siparisler['musteri_id'].median())
siparisler['indirim'] = siparisler['indirim'].fillna(0)
siparisler['musteri_id'] = siparisler['musteri_id'].astype(int)
print("Temiz veri: " + str(siparisler.shape))
print("Kalan eksik: " + str(siparisler.isnull().sum().sum()))
print("Temizleme tamamlandi!")`,
      dogrulama: (o) => o.includes('Temizleme tamamlandi'),
    },
    {
      no: 4, baslik: 'ETL — Dönüştür', emoji: '⚙️',
      gorev: 'Temiz veriyi zenginleştir! Tabloları birleştir, yeni kolonlar türet, iş metriklerini hesapla.',
      ipuclari: ['merge() ile tabloları birleştir — SQL JOIN gibi çalışır.', 'dt.to_period() ile tarihten ay çıkar.', 'groupby ile aylık özet oluştur.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 300
urunler = pd.DataFrame({
    'urun_id': range(1, 31),
    'kategori': np.random.choice(['Elektronik','Giyim','Ev','Spor','Kitap'], 30),
    'fiyat': np.random.choice([99,199,299,499,799,999,1499,1999,2999,4999], 30),
    'maliyet': np.random.choice([50,100,150,250,400,500,750,1000,1500,2500], 30)
})
musteriler = pd.DataFrame({
    'musteri_id': range(1, 101),
    'sehir': np.random.choice(['Istanbul','Izmir','Ankara','Bursa','Antalya'], 100),
    'segment': np.random.choice(['Bireysel','Kurumsal','Premium'], 100, p=[0.6,0.3,0.1])
})
siparisler = pd.DataFrame({
    'siparis_id': range(1, n+1),
    'musteri_id': np.random.randint(1, 101, n),
    'urun_id': np.random.randint(1, 31, n),
    'tarih': pd.date_range('2024-01-01', periods=n, freq='1D'),
    'adet': np.random.randint(1, 6, n),
    'indirim': np.random.choice([0, 0.05, 0.10, 0.15, 0.20], n),
    'durum': np.random.choice(['tamamlandi','iptal','iade','beklemede'], n, p=[0.7,0.1,0.1,0.1])
})

df = siparisler.merge(urunler, on='urun_id', how='left')
df = df.merge(musteriler, on='musteri_id', how='left')
print("Birlesik tablo: " + str(df.shape))

df['satis_tutari'] = df['fiyat'] * df['adet'] * (1 - df['indirim'])
df['kar'] = (df['fiyat'] - df['maliyet']) * df['adet']
df['kar_marji'] = (df['kar'] / df['satis_tutari'] * 100).round(1)
df['ay'] = df['tarih'].dt.to_period('M').astype(str)

aylik = df[df['durum']=='tamamlandi'].groupby(['ay','kategori']).agg(
    siparis_sayisi=('siparis_id','count'),
    toplam_ciro=('satis_tutari','sum'),
    toplam_kar=('kar','sum'),
).round(2).reset_index()

print("Aylik ozet: " + str(aylik.shape))
print(aylik.head(6).to_string(index=False))
print("Donusum tamamlandi!")`,
      dogrulama: (o) => o.includes('Donusum tamamlandi'),
    },
    {
      no: 5, baslik: 'Görselleştir', emoji: '📊',
      gorev: 'Veriyi görsel hale getir! 4 farklı grafik içeren bir yönetim dashboard\'u oluştur.',
      ipuclari: ['plt.subplots(2,2) ile 4 grafik alanı oluştur.', 'Her axes için ayrı grafik tipi kullan.', 'plt.savefig() ile grafiği kaydet — burada göreceksin!'],
      baslangicKodu: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

np.random.seed(42)
n = 300
urunler = pd.DataFrame({'urun_id':range(1,31),'kategori':np.random.choice(['Elektronik','Giyim','Ev','Spor','Kitap'],30),'fiyat':np.random.choice([99,199,299,499,799,999,1499,1999,2999,4999],30),'maliyet':np.random.choice([50,100,150,250,400,500,750,1000,1500,2500],30)})
musteriler = pd.DataFrame({'musteri_id':range(1,101),'sehir':np.random.choice(['Istanbul','Izmir','Ankara','Bursa','Antalya'],100),'segment':np.random.choice(['Bireysel','Kurumsal','Premium'],100,p=[0.6,0.3,0.1])})
siparisler = pd.DataFrame({'siparis_id':range(1,n+1),'musteri_id':np.random.randint(1,101,n),'urun_id':np.random.randint(1,31,n),'tarih':pd.date_range('2024-01-01',periods=n,freq='1D'),'adet':np.random.randint(1,6,n),'indirim':np.random.choice([0,0.05,0.10,0.15,0.20],n),'durum':np.random.choice(['tamamlandi','iptal','iade','beklemede'],n,p=[0.7,0.1,0.1,0.1])})
df = siparisler.merge(urunler,on='urun_id',how='left').merge(musteriler,on='musteri_id',how='left')
df['satis_tutari'] = df['fiyat']*df['adet']*(1-df['indirim'])
df['kar'] = (df['fiyat']-df['maliyet'])*df['adet']
df['ay'] = df['tarih'].dt.to_period('M').astype(str)
df_tamam = df[df['durum']=='tamamlandi']

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle('E-Ticaret Satis Dashboard', fontsize=15, fontweight='bold')
renkler = ['#1D9E75','#7F77DD','#e8a04a','#E24B4A','#5DCAA5']

aylik_ciro = df_tamam.groupby('ay')['satis_tutari'].sum()
axes[0,0].plot(range(len(aylik_ciro)), aylik_ciro.values, color='#1D9E75', linewidth=2.5, marker='o', markersize=5)
axes[0,0].set_title('Aylik Ciro Trendi', fontsize=11)
axes[0,0].set_xticks(range(len(aylik_ciro)))
axes[0,0].set_xticklabels(aylik_ciro.index, rotation=45, fontsize=7)
axes[0,0].set_ylabel('Ciro (TL)')
axes[0,0].spines[['top','right']].set_visible(False)

kat_ciro = df_tamam.groupby('kategori')['satis_tutari'].sum().sort_values(ascending=True)
axes[0,1].barh(kat_ciro.index, kat_ciro.values, color=renkler[:len(kat_ciro)])
axes[0,1].set_title('Kategoriye Gore Ciro', fontsize=11)
axes[0,1].set_xlabel('Ciro (TL)')
axes[0,1].spines[['top','right']].set_visible(False)

durum = df['durum'].value_counts()
axes[1,0].pie(durum.values, labels=durum.index, colors=renkler, autopct='%1.1f%%', startangle=90, wedgeprops=dict(edgecolor='white',linewidth=2))
axes[1,0].set_title('Siparis Durum Dagilimi', fontsize=11)

seg = df_tamam.groupby('segment')['satis_tutari'].mean().sort_values(ascending=False)
bars = axes[1,1].bar(seg.index, seg.values, color=renkler[:len(seg)], edgecolor='none', alpha=0.85)
for bar, val in zip(bars, seg.values):
    axes[1,1].text(bar.get_x()+bar.get_width()/2, bar.get_height()+50, str(int(val)), ha='center', fontsize=9)
axes[1,1].set_title('Segment Ort. Siparis Degeri', fontsize=11)
axes[1,1].set_ylabel('Ort. Deger (TL)')
axes[1,1].spines[['top','right']].set_visible(False)

plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("Dashboard olusturuldu!")`,
      dogrulama: (o) => o.includes('olusturuldu'),
    },
    {
      no: 6, baslik: 'Rapor & İçgörü', emoji: '🎯',
      gorev: 'Son adım! Analizinden içgörü çıkar. En iyi ve en kötü performansları bul, yönetime sunacağın özet raporu oluştur.',
      ipuclari: ['idxmax() en yüksek değerin indeksini verir.', 'String birleştirme ile dinamik metin oluştur.', 'groupby ile kategori ve şehir bazında karşılaştır.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 300
urunler = pd.DataFrame({'urun_id':range(1,31),'kategori':np.random.choice(['Elektronik','Giyim','Ev','Spor','Kitap'],30),'fiyat':np.random.choice([99,199,299,499,799,999,1499,1999,2999,4999],30),'maliyet':np.random.choice([50,100,150,250,400,500,750,1000,1500,2500],30)})
musteriler = pd.DataFrame({'musteri_id':range(1,101),'sehir':np.random.choice(['Istanbul','Izmir','Ankara','Bursa','Antalya'],100),'segment':np.random.choice(['Bireysel','Kurumsal','Premium'],100,p=[0.6,0.3,0.1])})
siparisler = pd.DataFrame({'siparis_id':range(1,n+1),'musteri_id':np.random.randint(1,101,n),'urun_id':np.random.randint(1,31,n),'tarih':pd.date_range('2024-01-01',periods=n,freq='1D'),'adet':np.random.randint(1,6,n),'indirim':np.random.choice([0,0.05,0.10,0.15,0.20],n),'durum':np.random.choice(['tamamlandi','iptal','iade','beklemede'],n,p=[0.7,0.1,0.1,0.1])})
df = siparisler.merge(urunler,on='urun_id',how='left').merge(musteriler,on='musteri_id',how='left')
df['satis_tutari'] = df['fiyat']*df['adet']*(1-df['indirim'])
df['kar'] = (df['fiyat']-df['maliyet'])*df['adet']
df['kar_marji'] = (df['kar']/df['satis_tutari']*100).round(1)
df['ay'] = df['tarih'].dt.to_period('M').astype(str)
df_tamam = df[df['durum']=='tamamlandi']

print("=" * 50)
print("E-TICARET SATIS ANALIZI - YONETIM RAPORU")
print("=" * 50)

toplam_ciro = df_tamam['satis_tutari'].sum()
toplam_kar = df_tamam['kar'].sum()
ort_marj = df_tamam['kar_marji'].mean()
tamamlanma = (df['durum']=='tamamlandi').mean()*100

print("")
print("GENEL PERFORMANS")
print("  Toplam Ciro   : " + str(int(toplam_ciro)) + " TL")
print("  Toplam Kar    : " + str(int(toplam_kar)) + " TL")
print("  Ort. Kar Marji: " + str(round(ort_marj, 1)) + "%")
print("  Tamamlanma    : " + str(round(tamamlanma, 1)) + "%")

kat_ozet = df_tamam.groupby('kategori').agg(ciro=('satis_tutari','sum'),kar=('kar','sum')).round(0)
en_iyi_kat = kat_ozet['ciro'].idxmax()
en_dusuk_kat = kat_ozet['ciro'].idxmin()

print("")
print("KATEGORI ANALIZI")
print("  En Yuksek Ciro: " + en_iyi_kat + " (" + str(int(kat_ozet.loc[en_iyi_kat,'ciro'])) + " TL)")
print("  En Dusuk Ciro : " + en_dusuk_kat + " (" + str(int(kat_ozet.loc[en_dusuk_kat,'ciro'])) + " TL)")

sehir = df_tamam.groupby('sehir')['satis_tutari'].sum().sort_values(ascending=False)
print("")
print("SEHIR SIRALAMASI")
for i, (s, v) in enumerate(sehir.items(), 1):
    print("  " + str(i) + ". " + s + ": " + str(int(v)) + " TL")

aylik = df_tamam.groupby('ay')['satis_tutari'].sum()
en_iyi_ay = aylik.idxmax()
print("")
print("TREND")
print("  En Iyi Ay: " + en_iyi_ay + " (" + str(int(aylik[en_iyi_ay])) + " TL)")

print("")
print("=" * 50)
print("Rapor tamamlandi! Tebrikler - uctan uca proje bitti!")
print("=" * 50)`,
      dogrulama: (o) => o.includes('Rapor tamamlandi'),
    },
  ],
  ik: [
    {
      no: 1, baslik: 'Veri Oluştur', emoji: '🏗️',
      gorev: 'İK analisti olarak işe başladın. Ham çalışan verisini oluştur — kasıtlı hatalar dahil!',
      ipuclari: ['Kodu çalıştır, veri otomatik oluşacak.', 'Eksik maaşlar, yanlış tarihler ve tekrar satırlar var.', 'Gerçek dünyada veri her zaman bu kadar kirli gelir!'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 250

departmanlar = pd.DataFrame({
    'dept_id': range(1, 8),
    'dept_adi': ['Muhendislik','Veri Bilimi','Urun','Pazarlama','Satis','IK','Finans'],
    'butce': [3000000,2000000,1500000,1000000,1200000,600000,800000],
    'lokasyon': ['Istanbul','Istanbul','Izmir','Istanbul','Ankara','Ankara','Istanbul']
})

calisanlar = pd.DataFrame({
    'calisan_id': range(1, n+1),
    'dept_id': np.random.randint(1, 8, n),
    'unvan': np.random.choice(['Junior','Mid','Senior','Lead','Manager'], n, p=[0.3,0.35,0.25,0.07,0.03]),
    'maas': np.random.normal(75000, 25000, n).astype(int),
    'ise_giris': pd.date_range('2018-01-01', periods=n, freq='5D').strftime('%Y/%m/%d'),
    'performans': np.random.choice([1,2,3,4,5], n, p=[0.05,0.10,0.40,0.35,0.10]),
    'uzaktan': np.random.choice(['Evet','Hayir','Hibrit'], n)
})

calisanlar.loc[np.random.choice(n, 20, replace=False), 'maas'] = np.nan
calisanlar.loc[np.random.choice(n, 15, replace=False), 'performans'] = np.nan
calisanlar.loc[5:12, 'ise_giris'] = '15-2020-03'
calisanlar = pd.concat([calisanlar, calisanlar.iloc[:15]], ignore_index=True)

print("Calisanlar: " + str(calisanlar.shape))
print("Departmanlar: " + str(departmanlar.shape))
print("Veri olusturuldu!")`,
      dogrulama: (o) => o.includes('olusturuldu'),
    },
    {
      no: 2, baslik: 'Keşifsel Analiz', emoji: '🔍',
      gorev: 'Çalışan verisini tanı! Kaç çalışan var? Hangi kolonlarda sorun var? Maaş dağılımı nasıl?',
      ipuclari: ['df.info() ile kolon tiplerini ve eksik değerleri gör.', 'df.describe() ile maaş istatistiklerini incele.', 'value_counts() ile unvan dağılımına bak.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 250
calisanlar = pd.DataFrame({
    'calisan_id': range(1, n+1),
    'dept_id': np.random.randint(1, 8, n),
    'unvan': np.random.choice(['Junior','Mid','Senior','Lead','Manager'], n, p=[0.3,0.35,0.25,0.07,0.03]),
    'maas': np.random.normal(75000, 25000, n).astype(int),
    'ise_giris': pd.date_range('2018-01-01', periods=n, freq='5D').strftime('%Y/%m/%d'),
    'performans': np.random.choice([1,2,3,4,5], n, p=[0.05,0.10,0.40,0.35,0.10])
})
calisanlar.loc[np.random.choice(n, 20, replace=False), 'maas'] = np.nan
calisanlar.loc[np.random.choice(n, 15, replace=False), 'performans'] = np.nan
calisanlar.loc[5:12, 'ise_giris'] = '15-2020-03'
calisanlar = pd.concat([calisanlar, calisanlar.iloc[:15]], ignore_index=True)

print("=== TEMEL BILGILER ===")
print("Toplam kayit: " + str(len(calisanlar)))
print("")
print("=== VERI TIPLERI ===")
print(calisanlar.dtypes)
print("")
print("=== EKSIK DEGERLER ===")
print(calisanlar.isnull().sum())
print("")
print("=== MAAS ISTATISTIKLERI ===")
print(calisanlar['maas'].describe())
print("")
print("=== UNVAN DAGILIMI ===")
print(calisanlar['unvan'].value_counts())
print("")
print("EDA tamamlandi!")`,
      dogrulama: (o) => o.includes('EDA tamamlandi'),
    },
    {
      no: 3, baslik: 'ETL — Temizle', emoji: '🔧',
      gorev: 'Veriyi temizle! Yanlış tarihler, eksik maaşlar ve tekrar satırlarla başa çık.',
      ipuclari: ['Negatif maaşları medyanla değiştir.', 'pd.to_datetime(errors="coerce") yanlış formatları NaT yapar.', 'drop_duplicates() tekrar satırları temizler.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 250
calisanlar = pd.DataFrame({
    'calisan_id': range(1, n+1),
    'dept_id': np.random.randint(1, 8, n),
    'unvan': np.random.choice(['Junior','Mid','Senior','Lead','Manager'], n, p=[0.3,0.35,0.25,0.07,0.03]),
    'maas': np.random.normal(75000, 25000, n).astype(int),
    'ise_giris': pd.date_range('2018-01-01', periods=n, freq='5D').strftime('%Y/%m/%d'),
    'performans': np.random.choice([1,2,3,4,5], n, p=[0.05,0.10,0.40,0.35,0.10])
})
calisanlar.loc[np.random.choice(n, 20, replace=False), 'maas'] = np.nan
calisanlar.loc[np.random.choice(n, 15, replace=False), 'performans'] = np.nan
calisanlar.loc[5:12, 'ise_giris'] = '15-2020-03'
calisanlar = pd.concat([calisanlar, calisanlar.iloc[:15]], ignore_index=True)

print("Ham: " + str(calisanlar.shape))
calisanlar = calisanlar.drop_duplicates()
print("Tekrar silinince: " + str(calisanlar.shape))
calisanlar['ise_giris'] = pd.to_datetime(calisanlar['ise_giris'], errors='coerce')
calisanlar = calisanlar.dropna(subset=['ise_giris'])
medyan_maas = calisanlar['maas'].median()
calisanlar['maas'] = calisanlar['maas'].fillna(medyan_maas)
calisanlar.loc[calisanlar['maas'] < 0, 'maas'] = medyan_maas
calisanlar['performans'] = calisanlar['performans'].fillna(calisanlar['performans'].median())
print("Temiz: " + str(calisanlar.shape))
print("Kalan eksik: " + str(calisanlar.isnull().sum().sum()))
print("Temizleme tamamlandi!")`,
      dogrulama: (o) => o.includes('Temizleme tamamlandi'),
    },
    {
      no: 4, baslik: 'ETL — Dönüştür', emoji: '⚙️',
      gorev: 'Departman bilgilerini ekle, kıdem hesapla, maaş bantları oluştur.',
      ipuclari: ['merge() ile departman bilgilerini ekle.', 'Tarih farkı ile kıdemi hesapla.', 'pd.cut() ile maaşı bantlara böl.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 250
departmanlar = pd.DataFrame({
    'dept_id': range(1, 8),
    'dept_adi': ['Muhendislik','Veri Bilimi','Urun','Pazarlama','Satis','IK','Finans'],
    'butce': [3000000,2000000,1500000,1000000,1200000,600000,800000],
    'lokasyon': ['Istanbul','Istanbul','Izmir','Istanbul','Ankara','Ankara','Istanbul']
})
calisanlar = pd.DataFrame({
    'calisan_id': range(1, n+1),
    'dept_id': np.random.randint(1, 8, n),
    'unvan': np.random.choice(['Junior','Mid','Senior','Lead','Manager'], n, p=[0.3,0.35,0.25,0.07,0.03]),
    'maas': np.random.normal(75000, 25000, n).clip(30000, 200000).astype(int),
    'ise_giris': pd.date_range('2018-01-01', periods=n, freq='5D'),
    'performans': np.random.choice([1,2,3,4,5], n, p=[0.05,0.10,0.40,0.35,0.10]).astype(float)
})

df = calisanlar.merge(departmanlar, on='dept_id', how='left')
print("Birlesik tablo: " + str(df.shape))

referans = pd.Timestamp('2024-01-01')
df['kidem_yil'] = ((referans - df['ise_giris']).dt.days / 365).round(1)
df['maas_bandi'] = pd.cut(df['maas'],
    bins=[0, 50000, 75000, 100000, 150000, float('inf')],
    labels=['Alt','Orta-Alt','Orta','Orta-Ust','Ust'])

dept_ozet = df.groupby('dept_adi').agg(
    calisan_sayisi=('calisan_id','count'),
    ort_maas=('maas','mean'),
    ort_performans=('performans','mean'),
    ort_kidem=('kidem_yil','mean')
).round(1)

print("")
print("Departman ozeti:")
print(dept_ozet.to_string())
print("")
print("Donusum tamamlandi!")`,
      dogrulama: (o) => o.includes('Donusum tamamlandi'),
    },
    {
      no: 5, baslik: 'Görselleştir', emoji: '📊',
      gorev: 'İK dashboard\'u oluştur! Maaş dağılımı, departman karşılaştırması, performans ve kıdem grafiği.',
      ipuclari: ['plt.subplots(2,2) ile 4 grafik alanı.', 'Boxplot maaş dağılımı için idealdir.', 'Scatter plot kıdem-maaş ilişkisini gösterir.'],
      baslangicKodu: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

np.random.seed(42)
n = 250
departmanlar = pd.DataFrame({'dept_id':range(1,8),'dept_adi':['Muhendislik','Veri Bilimi','Urun','Pazarlama','Satis','IK','Finans'],'butce':[3000000,2000000,1500000,1000000,1200000,600000,800000]})
calisanlar = pd.DataFrame({'calisan_id':range(1,n+1),'dept_id':np.random.randint(1,8,n),'unvan':np.random.choice(['Junior','Mid','Senior','Lead','Manager'],n,p=[0.3,0.35,0.25,0.07,0.03]),'maas':np.random.normal(75000,25000,n).clip(30000,200000).astype(int),'ise_giris':pd.date_range('2018-01-01',periods=n,freq='5D'),'performans':np.random.choice([1,2,3,4,5],n,p=[0.05,0.10,0.40,0.35,0.10]).astype(float)})
df = calisanlar.merge(departmanlar,on='dept_id',how='left')
df['kidem_yil'] = ((pd.Timestamp('2024-01-01') - df['ise_giris']).dt.days / 365).round(1)

fig, axes = plt.subplots(2, 2, figsize=(12, 8))
fig.suptitle('IK Analizi Dashboard', fontsize=15, fontweight='bold')
renkler = ['#7F77DD','#1D9E75','#e8a04a','#E24B4A','#5DCAA5','#BA7517','#993C1D']

dept_maas = df.groupby('dept_adi')['maas'].mean().sort_values(ascending=True)
axes[0,0].barh(dept_maas.index, dept_maas.values, color='#7F77DD', alpha=0.85)
axes[0,0].set_title('Departmana Gore Ort. Maas', fontsize=11)
axes[0,0].set_xlabel('Maas (TL)')
axes[0,0].spines[['top','right']].set_visible(False)

unvan_say = df['unvan'].value_counts()
axes[0,1].pie(unvan_say.values, labels=unvan_say.index, colors=renkler[:5], autopct='%1.0f%%', startangle=90, wedgeprops=dict(edgecolor='white',linewidth=2))
axes[0,1].set_title('Unvan Dagilimi', fontsize=11)

axes[1,0].scatter(df['kidem_yil'], df['maas'], alpha=0.4, color='#7F77DD', s=30)
axes[1,0].set_title('Kidem - Maas Iliskisi', fontsize=11)
axes[1,0].set_xlabel('Kidem (Yil)')
axes[1,0].set_ylabel('Maas (TL)')
axes[1,0].spines[['top','right']].set_visible(False)

perf_say = df['performans'].value_counts().sort_index()
axes[1,1].bar(perf_say.index, perf_say.values, color=renkler[:5], edgecolor='none')
axes[1,1].set_title('Performans Puan Dagilimi', fontsize=11)
axes[1,1].set_xlabel('Puan (1-5)')
axes[1,1].set_ylabel('Calisan Sayisi')
axes[1,1].spines[['top','right']].set_visible(False)

plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("IK Dashboard olusturuldu!")`,
      dogrulama: (o) => o.includes('olusturuldu'),
    },
    {
      no: 6, baslik: 'Rapor & İçgörü', emoji: '🎯',
      gorev: 'Yönetim raporu hazırla! En yüksek maaşlı departman, performans-maaş ilişkisi, kıdem analizi.',
      ipuclari: ['corr() ile korelasyonu hesapla.', 'String birleştirme ile dinamik metin oluştur.', 'groupby ile departman karşılaştırması yap.'],
      baslangicKodu: `import pandas as pd
import numpy as np

np.random.seed(42)
n = 250
departmanlar = pd.DataFrame({'dept_id':range(1,8),'dept_adi':['Muhendislik','Veri Bilimi','Urun','Pazarlama','Satis','IK','Finans'],'butce':[3000000,2000000,1500000,1000000,1200000,600000,800000]})
calisanlar = pd.DataFrame({'calisan_id':range(1,n+1),'dept_id':np.random.randint(1,8,n),'unvan':np.random.choice(['Junior','Mid','Senior','Lead','Manager'],n,p=[0.3,0.35,0.25,0.07,0.03]),'maas':np.random.normal(75000,25000,n).clip(30000,200000).astype(int),'ise_giris':pd.date_range('2018-01-01',periods=n,freq='5D'),'performans':np.random.choice([1,2,3,4,5],n,p=[0.05,0.10,0.40,0.35,0.10]).astype(float)})
df = calisanlar.merge(departmanlar,on='dept_id',how='left')
df['kidem_yil'] = ((pd.Timestamp('2024-01-01') - df['ise_giris']).dt.days / 365).round(1)

print("=" * 50)
print("IK ANALIZI - YONETIM RAPORU")
print("=" * 50)
print("")
print("GENEL DURUM")
print("  Toplam Calisan : " + str(len(df)))
print("  Ort. Maas      : " + str(int(df['maas'].mean())) + " TL")
print("  Ort. Performans: " + str(round(df['performans'].mean(), 2)) + " / 5.0")
print("  Ort. Kidem     : " + str(round(df['kidem_yil'].mean(), 1)) + " yil")

dept_ozet = df.groupby('dept_adi').agg(
    calisan=('calisan_id','count'),
    ort_maas=('maas','mean'),
    ort_perf=('performans','mean')
).round(1).sort_values('ort_maas', ascending=False)

print("")
print("DEPARTMAN SIRALAMASI")
for dept, row in dept_ozet.iterrows():
    print("  " + dept + ": " + str(int(row['ort_maas'])) + " TL | Perf: " + str(row['ort_perf']) + " | " + str(int(row['calisan'])) + " kisi")

korelasyon = df['kidem_yil'].corr(df['maas'])
print("")
print("KIDEM-MAAS KORELASYONU: " + str(round(korelasyon, 3)))
if korelasyon > 0.5:
    print("  Guclu pozitif iliski: Kidem arttikca maas artiyor")
elif korelasyon > 0.2:
    print("  Zayif pozitif iliski: Kidem maasi kismen etkiliyor")
else:
    print("  Zayif iliski: Kidem maasi belirlemede etkili degil")

unvan_maas = df.groupby('unvan')['maas'].mean().sort_values(ascending=False)
print("")
print("UNVANA GORE ORTALAMA MAAS")
for unvan, maas in unvan_maas.items():
    print("  " + unvan + ": " + str(int(maas)) + " TL")

print("")
print("=" * 50)
print("Rapor tamamlandi! Tebrikler - uctan uca proje bitti!")
print("=" * 50)`,
      dogrulama: (o) => o.includes('Rapor tamamlandi'),
    },
  ],
};

export default function ProjeCalismasi() {
  const [senaryo, setSenaryo] = useState(null);
  const [aktifAdim, setAktifAdim] = useState(0);
  const [tamamlananAdimlar, setTamamlananAdimlar] = useState([]);
  const [kod, setKod] = useState('');
  const [output, setOutput] = useState('');
  const [imgSrc, setImgSrc] = useState(null);
  const [hata, setHata] = useState(null);
  const [calistiriliyor, setCalistiriliyor] = useState(false);
  const [pyHazir, setPyHazir] = useState(false);
  const [pyYukleniyor, setPyYukleniyor] = useState(false);
  const [ipucuIdx, setIpucuIdx] = useState(-1);
  const [adimTamamlandi, setAdimTamamlandi] = useState(false);
  const pyRef = useRef(null);

  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
    s.onload = async () => {
      setPyYukleniyor(true);
      try {
        const py = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
        await py.loadPackage(['numpy', 'pandas', 'matplotlib']);
        await py.runPythonAsync('import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt');
        pyRef.current = py;
        setPyHazir(true);
      } catch (e) { console.error(e); }
      setPyYukleniyor(false);
    };
    document.head.appendChild(s);
  }, []);

  const senaryoSec = (s) => {
    setSenaryo(s);
    setAktifAdim(0);
    setTamamlananAdimlar([]);
    setKod(ADIMLAR[s.id][0].baslangicKodu);
    setOutput(''); setImgSrc(null); setHata(null);
    setIpucuIdx(-1); setAdimTamamlandi(false);
  };

  const calistir = async () => {
    if (!pyRef.current || !senaryo) return;
    setCalistiriliyor(true);
    setOutput(''); setImgSrc(null); setHata(null); setAdimTamamlandi(false);
    const py = pyRef.current;
    let out = '';
    py.globals.set('print', (...args) => { out += args.map(String).join(' ') + '\n'; });
    try {
      await py.runPythonAsync(`
import matplotlib.pyplot as plt, io, base64
_img_b64 = None
_hooking = False
def _hook(fname, **kw):
    global _img_b64, _hooking
    if _hooking: return
    _hooking = True
    buf = io.BytesIO()
    plt.gcf().savefig(buf, format='png', **{k:v for k,v in kw.items() if k!='format'})
    buf.seek(0); _img_b64 = base64.b64encode(buf.read()).decode(); buf.close(); _hooking = False
plt.savefig = _hook; _img_b64 = None`);
      await py.runPythonAsync(kod);
      await py.runPythonAsync(`
import io,base64
if _img_b64 is None:
    figs=[plt.figure(n) for n in plt.get_fignums()]
    if figs:
        buf=io.BytesIO(); figs[-1].savefig(buf,format='png',dpi=120,bbox_inches='tight',facecolor='white')
        buf.seek(0); _img_b64=base64.b64encode(buf.read()).decode(); buf.close()
plt.close('all')`);
      const imgB64 = py.globals.get('_img_b64');
      if (imgB64) setImgSrc(`data:image/png;base64,${imgB64}`);
      setOutput(out);
      const adim = ADIMLAR[senaryo.id][aktifAdim];
      if (adim.dogrulama(out)) {
        setAdimTamamlandi(true);
        if (!tamamlananAdimlar.includes(aktifAdim))
          setTamamlananAdimlar(prev => [...prev, aktifAdim]);
      }
    } catch (e) { setHata(e.message); }
    setCalistiriliyor(false);
  };

  const sonrakiAdim = () => {
    const adimlar = ADIMLAR[senaryo.id];
    if (aktifAdim < adimlar.length - 1) {
      const yeni = aktifAdim + 1;
      setAktifAdim(yeni);
      setKod(adimlar[yeni].baslangicKodu);
      setOutput(''); setImgSrc(null); setHata(null);
      setIpucuIdx(-1); setAdimTamamlandi(false);
    }
  };

  const adimSec = (idx) => {
    if (!senaryo) return;
    setAktifAdim(idx);
    setKod(ADIMLAR[senaryo.id][idx].baslangicKodu);
    setOutput(''); setImgSrc(null); setHata(null);
    setIpucuIdx(-1); setAdimTamamlandi(false);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); calistir(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target, s = ta.selectionStart;
      const yeni = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
      setKod(yeni);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
  };

  // Senaryo seçim ekranı
  if (!senaryo) {
    return (
      <main className="min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
          <span className="badge badge-interactive inline-block mb-3">proje</span>
          <h1 className="font-serif text-4xl font-medium mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
            Uçtan Uca Veri Analizi
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-soft)', lineHeight: '1.7', marginBottom: '2rem' }}>
            Gerçek bir veri analisti gibi çalış. Ham veri oluştur, temizle, dönüştür, görselleştir, raporla. 6 adımlı interaktif proje.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px', marginBottom: '2rem' }}>
            {Object.values(SENARYOLAR).map(s => (
              <button key={s.id} onClick={() => senaryoSec(s)} style={{
                padding: '24px', borderRadius: '14px', border: `1.5px solid ${s.renk}`,
                background: `${s.renk}18`, cursor: 'pointer', textAlign: 'left', transition: 'all .15s',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{s.isim.split(' ')[0]}</div>
                <div className="font-serif" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>
                  {s.isim.replace(/^\S+\s/, '')}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: '1.6', margin: 0 }}>{s.aciklama}</p>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
            {[{val:'6',label:'adım',renk:'#1D9E75'},{val:'2',label:'senaryo',renk:'#7F77DD'},{val:'🆓',label:'ücretsiz',renk:'#e8a04a'}].map(({val,label,renk}) => (
              <div key={label} className="card" style={{ padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 500, color: renk }}>{val}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const adimlar = ADIMLAR[senaryo.id];
  const aktifAdimData = adimlar[aktifAdim];

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => setSenaryo(null)} style={{ fontSize: '13px', padding: '5px 12px', borderRadius: '8px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', cursor: 'pointer', color: 'var(--color-text-soft)' }}>
            ← Senaryo seç
          </button>
          <div style={{ fontSize: '14px', fontWeight: 500, color: senaryo.renk }}>{senaryo.isim}</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-mute)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: pyHazir ? '#1D9E75' : '#e8a04a' }} />
            {pyHazir ? 'Pyodide hazır' : pyYukleniyor ? 'Yükleniyor...' : 'Bekliyor'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {adimlar.map((a, idx) => {
            const tamam = tamamlananAdimlar.includes(idx);
            const aktif = idx === aktifAdim;
            return (
              <button key={idx} onClick={() => adimSec(idx)} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: aktif ? 500 : 400,
                border: `1.5px solid ${aktif ? senaryo.renk : tamam ? '#1D9E75' : 'var(--color-border)'}`,
                background: aktif ? `${senaryo.renk}18` : tamam ? '#1D9E7518' : 'var(--color-cream-card)',
                color: aktif ? senaryo.renk : tamam ? '#0F6E56' : 'var(--color-text-mute)',
                cursor: 'pointer', transition: 'all .15s',
              }}>
                <span>{tamam ? '✓' : a.emoji}</span>
                <span>{a.baslik}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ padding: '16px 20px', borderLeft: `4px solid ${senaryo.renk}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: '6px' }}>
                  Adım {aktifAdimData.no} / {adimlar.length} — {aktifAdimData.baslik}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: '1.65', margin: 0 }}>
                  {aktifAdimData.gorev}
                </p>
              </div>
              <button onClick={() => setIpucuIdx(prev => prev < aktifAdimData.ipuclari.length - 1 ? prev + 1 : prev)} style={{
                fontSize: '12px', padding: '6px 12px', borderRadius: '8px',
                border: '0.5px solid var(--color-border)', background: 'var(--color-cream)',
                cursor: 'pointer', color: 'var(--color-text-soft)', whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                💡 İpucu {ipucuIdx + 1}/{aktifAdimData.ipuclari.length}
              </button>
            </div>
            {ipucuIdx >= 0 && (
              <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: `${senaryo.renk}18`, fontSize: '13px', color: senaryo.renk }}>
                {aktifAdimData.ipuclari[ipucuIdx]}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-mute)' }}>adim_{aktifAdimData.no}.py</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setKod(aktifAdimData.baslangicKodu)} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '0.5px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-mute)' }}>Sıfırla</button>
                <button onClick={calistir} disabled={calistiriliyor || !pyHazir} style={{ fontSize: '13px', fontWeight: 500, padding: '5px 18px', borderRadius: '8px', border: 'none', background: !pyHazir ? 'var(--color-border)' : senaryo.renk, color: '#fff', cursor: !pyHazir ? 'not-allowed' : 'pointer' }}>
                  {calistiriliyor ? '⏳' : '▶ Çalıştır'}
                </button>
              </div>
            </div>
            <textarea value={kod} onChange={e => setKod(e.target.value)} onKeyDown={handleKeyDown} spellCheck={false} style={{ width: '100%', minHeight: '240px', padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.7', border: 'none', outline: 'none', resize: 'vertical', background: 'var(--color-cream-card)', color: 'var(--color-text)', boxSizing: 'border-box' }} />
            <div style={{ padding: '5px 14px', background: 'var(--color-cream)', borderTop: '0.5px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-mute)' }}>
              Cmd+Enter ile çalıştır · Tab ile girinti
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-mute)' }}>çıktı</span>
              {adimTamamlandi && <span style={{ fontSize: '12px', fontWeight: 500, color: '#0F6E56', background: '#E1F5EE', padding: '2px 10px', borderRadius: '999px' }}>✓ Adım tamamlandı!</span>}
              {hata && <span style={{ fontSize: '12px', color: '#E24B4A' }}>✗ Hata</span>}
            </div>
            {imgSrc && (
              <div style={{ padding: '12px', background: 'var(--color-cream-card)', borderBottom: output ? '0.5px solid var(--color-border)' : 'none', textAlign: 'center' }}>
                <img src={imgSrc} alt="Grafik" style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }} />
                <div style={{ marginTop: '6px' }}>
                  <a href={imgSrc} download="grafik.png" style={{ fontSize: '12px', color: senaryo.renk, textDecoration: 'none' }}>⬇ Grafiği indir</a>
                </div>
              </div>
            )}
            <pre style={{ margin: 0, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.65', minHeight: '80px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: hata ? '#E24B4A' : 'var(--color-text)', background: 'var(--color-cream-card)' }}>
              {hata ? 'Hata:\n' + hata : output || '▶ Kodu çalıştır, çıktı burada görünür.'}
            </pre>
          </div>

          {adimTamamlandi && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {aktifAdim < adimlar.length - 1 ? (
                <button onClick={sonrakiAdim} style={{ padding: '12px 28px', borderRadius: '10px', border: 'none', background: senaryo.renk, color: '#fff', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}>
                  Sonraki: {adimlar[aktifAdim + 1].emoji} {adimlar[aktifAdim + 1].baslik} →
                </button>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', background: `${senaryo.renk}18`, borderRadius: '14px', width: '100%' }}>
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
                  <div className="font-serif" style={{ fontSize: '22px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>Proje tamamlandı!</div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '16px' }}>
                    Uçtan uca bir veri analizi projesi yaptın. Veri oluşturdun, temizledin, dönüştürdün, görselleştirdin ve raporladın.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => senaryoSec(Object.values(SENARYOLAR).find(s => s.id !== senaryo.id))} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: senaryo.renk, color: '#fff', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                      Diğer senaryoyu dene
                    </button>
                    <a href="/ogren" style={{ padding: '10px 20px', borderRadius: '10px', border: '0.5px solid var(--color-border)', background: 'var(--color-cream-card)', color: 'var(--color-text)', fontSize: '14px', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Öğrenme modülüne dön
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
