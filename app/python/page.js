'use client';

import { useEffect, useRef, useState } from 'react';

const SNIPPETS = [
  // ── TEMEL PYTHON ─────────────────────────────────────────
  {
    grup: 'Python',
    key: 'degiskenler',
    label: '🐍 Değişkenler',
    kod: `# Değişkenler ve veri tipleri
yas = 28
maas = 8500.50
isim = "Ali Apaydın"
aktif = True

print(f"İsim: {isim}")
print(f"Yaş: {yas} ({type(yas).__name__})")
print(f"Maaş: {maas:,.2f} TL ({type(maas).__name__})")
print(f"Aktif: {aktif} ({type(aktif).__name__})")

# String işlemleri
print(isim.upper())
print(isim.split())
print(len(isim))`,
  },
  {
    grup: 'Python',
    key: 'listeler',
    label: '📋 Listeler',
    kod: `# Listeler
meyveler = ["elma", "armut", "kiraz", "muz"]
sayilar = [3, 1, 4, 1, 5, 9, 2, 6]

print(f"İlk: {meyveler[0]}")
print(f"Son: {meyveler[-1]}")
print(f"İlk 2: {meyveler[:2]}")

meyveler.append("üzüm")
meyveler.remove("armut")
print(f"Güncel: {meyveler}")

sayilar.sort()
print(f"Sıralı: {sayilar}")
print(f"Max: {max(sayilar)}, Min: {min(sayilar)}")

# List comprehension
kareler = [x**2 for x in range(1, 6)]
print(f"Kareler: {kareler}")

ciftler = [x for x in sayilar if x % 2 == 0]
print(f"Çiftler: {ciftler}")`,
  },
  {
    grup: 'Python',
    key: 'donguler',
    label: '🔄 Döngüler',
    kod: `# for döngüsü
meyveler = ["elma", "armut", "kiraz"]
for i, meyve in enumerate(meyveler):
    print(f"{i+1}. {meyve}")

# range ile
toplam = 0
for i in range(1, 11):
    toplam += i
print(f"\\n1-10 toplamı: {toplam}")

# while döngüsü
n = 1
print("\\n2'nin kuvvetleri:")
while n <= 128:
    print(n, end=" ")
    n *= 2

# Dictionary döngüsü
print("\\n\\nPuanlar:")
puanlar = {"Ali": 85, "Ayşe": 92, "Mehmet": 78}
for isim, puan in puanlar.items():
    durum = "✓ Geçti" if puan >= 80 else "✗ Kaldı"
    print(f"  {isim}: {puan} — {durum}")`,
  },
  {
    grup: 'Python',
    key: 'fonksiyonlar',
    label: '⚙️ Fonksiyonlar',
    kod: `# Fonksiyonlar
def faktoriyel(n):
    if n <= 1:
        return 1
    return n * faktoriyel(n - 1)

def istatistik(veri):
    n = len(veri)
    ort = sum(veri) / n
    varyans = sum((x - ort)**2 for x in veri) / n
    std = varyans ** 0.5
    return {"n": n, "ortalama": ort, "std": std,
            "min": min(veri), "max": max(veri)}

# Faktöriyel
for i in [5, 7, 10]:
    print(f"{i}! = {faktoriyel(i):,}")

# İstatistik
veri = [23, 45, 12, 67, 34, 89, 56, 78, 45, 32]
sonuc = istatistik(veri)
print()
for k, v in sonuc.items():
    print(f"{k:12}: {v:.2f}" if isinstance(v, float) else f"{k:12}: {v}")

# Lambda
kare = lambda x: x ** 2
print(f"\\n5² = {kare(5)}")

sirala = sorted(["Zeynep","Ali","Mehmet"], key=lambda x: len(x))
print(f"Uzunluğa göre: {sirala}")`,
  },
  {
    grup: 'Python',
    key: 'sozluk',
    label: '📖 Sözlük',
    kod: `# Dictionary (Sözlük)
kisi = {
    "isim": "Ali Apaydın",
    "yas": 28,
    "sehir": "İzmir",
    "beceriler": ["Python", "SQL", "Tableau"]
}

print("Kişi bilgileri:")
for k, v in kisi.items():
    print(f"  {k}: {v}")

# Güvenli erişim
print(f"\\nMaaş: {kisi.get('maas', 'Belirtilmemiş')}")

# Güncelle
kisi["maas"] = 9500
kisi["beceriler"].append("Power BI")

# Sözlük comprehension
notlar = {"Ali": 85, "Ayşe": 92, "Mehmet": 68, "Zeynep": 78}
gecenler = {k: v for k, v in notlar.items() if v >= 75}
print(f"\\nGeçenler: {gecenler}")

# Nested dictionary
sirket = {
    "IT": {"calisan": 15, "butce": 500000},
    "Pazarlama": {"calisan": 8, "butce": 300000},
}
for dep, bilgi in sirket.items():
    print(f"{dep}: {bilgi['calisan']} kişi, {bilgi['butce']:,} TL")`,
  },

  // ── NUMPY ────────────────────────────────────────────────
  {
    grup: 'NumPy',
    key: 'numpy_temel',
    label: '🔢 NumPy Temel',
    kod: `import numpy as np

# Array oluşturma
a = np.array([1, 2, 3, 4, 5])
b = np.zeros(5)
c = np.ones(5)
d = np.arange(0, 10, 2)
e = np.linspace(0, 1, 5)

print("Temel arrayler:")
print(f"  a = {a}")
print(f"  zeros = {b}")
print(f"  ones = {c}")
print(f"  arange = {d}")
print(f"  linspace = {e}")

# Array işlemleri
print(f"\\na * 2 = {a * 2}")
print(f"a ** 2 = {a ** 2}")
print(f"a + b = {a + c}")

# İstatistik
print(f"\\nOrtalama: {a.mean():.2f}")
print(f"Std: {a.std():.2f}")
print(f"Min/Max: {a.min()} / {a.max()}")
print(f"Toplam: {a.sum()}")
print(f"Kümülatif toplam: {a.cumsum()}")`,
  },
  {
    grup: 'NumPy',
    key: 'numpy_matris',
    label: '🧮 Matris',
    kod: `import numpy as np

# 2D matris
A = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])

B = np.random.randint(1, 10, (3, 3))

print(f"A matrisi:\\n{A}")
print(f"\\nŞekil: {A.shape}")
print(f"Toplam: {A.sum()}")
print(f"Sütun toplamları: {A.sum(axis=0)}")
print(f"Satır toplamları: {A.sum(axis=1)}")

# Matris işlemleri
print(f"\\nTranspoz:\\n{A.T}")
print(f"\\nMatris çarpımı A @ A.T:\\n{A @ A.T}")

# İndeksleme
print(f"\\nİlk satır: {A[0]}")
print(f"Son sütun: {A[:, -1]}")
print(f"Alt matris:\\n{A[:2, :2]}")

# Boolean maskeleme
print(f"\\n5'ten büyükler: {A[A > 5]}")`,
  },
  {
    grup: 'NumPy',
    key: 'numpy_istatistik',
    label: '📊 NumPy İstatistik',
    kod: `import numpy as np

np.random.seed(42)
# Normal dağılım
veri = np.random.normal(loc=100, scale=15, size=1000)

print("=== Temel İstatistik ===")
print(f"n        : {len(veri)}")
print(f"Ortalama : {veri.mean():.3f}")
print(f"Medyan   : {np.median(veri):.3f}")
print(f"Std      : {veri.std():.3f}")
print(f"Varyans  : {veri.var():.3f}")
print(f"Min      : {veri.min():.3f}")
print(f"Max      : {veri.max():.3f}")

print("\\n=== Yüzdelikler ===")
for p in [25, 50, 75, 90, 95, 99]:
    print(f"  {p}. yüzdelik: {np.percentile(veri, p):.2f}")

print("\\n=== IQR ve Aykırı Değer ===")
Q1 = np.percentile(veri, 25)
Q3 = np.percentile(veri, 75)
IQR = Q3 - Q1
alt = Q1 - 1.5 * IQR
ust = Q3 + 1.5 * IQR
aykiri = veri[(veri < alt) | (veri > ust)]
print(f"IQR: {IQR:.2f}")
print(f"Alt sınır: {alt:.2f}, Üst sınır: {ust:.2f}")
print(f"Aykırı değer sayısı: {len(aykiri)} ({len(aykiri)/len(veri)*100:.1f}%)")`,
  },

  // ── PANDAS ───────────────────────────────────────────────
  {
    grup: 'Pandas',
    key: 'pandas_temel',
    label: '🐼 Pandas Temel',
    kod: `import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    'isim': ['Ali','Ayşe','Mehmet','Zeynep','Can','Fatma','Ahmet','Selin'],
    'yas': [28, 34, 25, 31, 29, 27, 35, 26],
    'sehir': ['İzmir','İstanbul','Ankara','İzmir','İstanbul','Ankara','İzmir','İstanbul'],
    'departman': ['IT','IT','Satış','Pazarlama','IT','Satış','Pazarlama','IT'],
    'maas': [8500, 12000, 7200, 9800, 11000, 8200, 10500, 9200]
})

print(f"Şekil: {df.shape}")
print(f"\\nİlk 3 satır:")
print(df.head(3).to_string(index=False))
print(f"\\nVeri tipleri:")
print(df.dtypes.to_string())
print(f"\\nİstatistiksel özet:")
print(df[['yas','maas']].describe().round(1).to_string())`,
  },
  {
    grup: 'Pandas',
    key: 'pandas_filtreleme',
    label: '🔍 Filtreleme',
    kod: `import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    'isim': ['Ali','Ayşe','Mehmet','Zeynep','Can','Fatma','Ahmet','Selin'],
    'yas': [28, 34, 25, 31, 29, 27, 35, 26],
    'sehir': ['İzmir','İstanbul','Ankara','İzmir','İstanbul','Ankara','İzmir','İstanbul'],
    'departman': ['IT','IT','Satış','Pazarlama','IT','Satış','Pazarlama','IT'],
    'maas': [8500, 12000, 7200, 9800, 11000, 8200, 10500, 9200]
})

# Tek koşul
izmir = df[df['sehir'] == 'İzmir']
print("İzmir çalışanları:")
print(izmir[['isim','maas']].to_string(index=False))

# Çoklu koşul
it_yuksek = df[(df['departman'] == 'IT') & (df['maas'] > 9000)]
print(f"\\nIT & maaş > 9000:")
print(it_yuksek[['isim','maas']].to_string(index=False))

# isin()
buyuk_sehir = df[df['sehir'].isin(['İstanbul','İzmir'])]
print(f"\\nBüyük şehirler: {len(buyuk_sehir)} kişi")

# query() - daha okunabilir
gencler = df.query("yas < 30 and maas > 8000")
print(f"\\nGenç & yüksek maaş:")
print(gencler[['isim','yas','maas']].to_string(index=False))`,
  },
  {
    grup: 'Pandas',
    key: 'pandas_groupby',
    label: '📦 GroupBy',
    kod: `import pandas as pd
import numpy as np

np.random.seed(42)
df = pd.DataFrame({
    'isim': ['Ali','Ayşe','Mehmet','Zeynep','Can','Fatma','Ahmet','Selin'],
    'yas': [28, 34, 25, 31, 29, 27, 35, 26],
    'sehir': ['İzmir','İstanbul','Ankara','İzmir','İstanbul','Ankara','İzmir','İstanbul'],
    'departman': ['IT','IT','Satış','Pazarlama','IT','Satış','Pazarlama','IT'],
    'maas': [8500, 12000, 7200, 9800, 11000, 8200, 10500, 9200]
})

# Basit groupby
print("Şehre göre ortalama maaş:")
print(df.groupby('sehir')['maas'].mean().round(0).to_string())

# Çoklu aggregation
print("\\nDepartmana göre özet:")
ozet = df.groupby('departman').agg(
    kisi_sayisi=('isim', 'count'),
    ort_yas=('yas', 'mean'),
    ort_maas=('maas', 'mean'),
    max_maas=('maas', 'max')
).round(1)
print(ozet.to_string())

# Pivot table
print("\\nPivot (şehir x departman — ortalama maaş):")
pivot = df.pivot_table(values='maas', index='sehir',
                        columns='departman', aggfunc='mean')
print(pivot.round(0).to_string())`,
  },

  // ── GÖRSELLEŞTİRME ──────────────────────────────────────
  {
    grup: 'Grafik',
    key: 'cubuk',
    label: '📊 Çubuk',
    kod: `import matplotlib.pyplot as plt
import numpy as np

kategoriler = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran']
degerler = [42, 58, 35, 71, 63, 80]

fig, ax = plt.subplots(figsize=(8, 4))
bars = ax.bar(kategoriler, degerler,
              color='#1D9E75', edgecolor='none', alpha=0.85)

for bar, val in zip(bars, degerler):
    ax.text(bar.get_x() + bar.get_width()/2,
            bar.get_height() + 1.5, str(val),
            ha='center', fontsize=10, color='#2a2620')

ax.set_title('Aylık Satış Verisi', fontsize=14, pad=12)
ax.set_ylabel('Satış Adedi')
ax.spines[['top','right']].set_visible(False)
ax.set_ylim(0, 95)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  {
    grup: 'Grafik',
    key: 'cizgi',
    label: '📈 Çizgi',
    kod: `import matplotlib.pyplot as plt
import numpy as np

aylar = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']
satis_2024 = [45, 52, 38, 65, 70, 85, 90, 78, 62, 74, 88, 95]
satis_2023 = [38, 45, 30, 55, 60, 72, 80, 65, 50, 62, 75, 82]

fig, ax = plt.subplots(figsize=(9, 4))
ax.plot(aylar, satis_2024, color='#1D9E75', linewidth=2.5,
        marker='o', markersize=6, label='2024')
ax.plot(aylar, satis_2023, color='#7F77DD', linewidth=2,
        marker='o', markersize=5, linestyle='--', label='2023', alpha=0.7)
ax.fill_between(aylar, satis_2023, satis_2024, alpha=0.08, color='#1D9E75')

ax.set_title('Yıllık Satış Karşılaştırması', fontsize=14, pad=12)
ax.set_ylabel('Satış Adedi')
ax.legend(frameon=False)
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  {
    grup: 'Grafik',
    key: 'scatter',
    label: '🔵 Scatter',
    kod: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
n = 100
yas = np.random.normal(32, 8, n).clip(20, 55)
maas = 3000 + yas * 250 + np.random.normal(0, 1500, n)
departman = np.random.choice(['IT', 'Pazarlama', 'Satış'], n)
renkler = {'IT': '#1D9E75', 'Pazarlama': '#7F77DD', 'Satış': '#e8a04a'}

fig, ax = plt.subplots(figsize=(8, 5))
for dep in renkler:
    mask = departman == dep
    ax.scatter(yas[mask], maas[mask], c=renkler[dep],
               label=dep, alpha=0.7, s=60, edgecolors='none')

z = np.polyfit(yas, maas, 1)
x_line = np.linspace(yas.min(), yas.max(), 100)
ax.plot(x_line, np.poly1d(z)(x_line), 'k--', alpha=0.3, linewidth=1)

ax.set_title('Yaş vs Maaş', fontsize=14, pad=12)
ax.set_xlabel('Yaş'); ax.set_ylabel('Maaş (TL)')
ax.legend(frameon=False)
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  {
    grup: 'Grafik',
    key: 'histogram',
    label: '📉 Histogram',
    kod: `import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

np.random.seed(42)
veri = np.concatenate([np.random.normal(65, 8, 300),
                        np.random.normal(85, 6, 150)])

fig, ax = plt.subplots(figsize=(8, 4))
ax.hist(veri, bins=30, color='#1D9E75', alpha=0.7,
        edgecolor='white', linewidth=0.5)
ax.axvline(np.mean(veri), color='#7F77DD', linestyle='--',
           linewidth=2, label=f'Ort: {np.mean(veri):.1f}')
ax.axvline(np.median(veri), color='#e8a04a', linestyle=':',
           linewidth=2, label=f'Med: {np.median(veri):.1f}')

ax.set_title('Not Dağılımı', fontsize=14, pad=12)
ax.set_xlabel('Not'); ax.set_ylabel('Frekans')
ax.legend(frameon=False)
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  {
    grup: 'Grafik',
    key: 'heatmap',
    label: '🗺️ Heatmap',
    kod: `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

np.random.seed(42)
n = 200
df = pd.DataFrame({
    'Satış': np.random.normal(100, 20, n),
    'Reklam': np.random.normal(50, 10, n),
    'Müşteri': np.random.normal(500, 100, n),
    'Memnuniyet': np.random.normal(4, 0.5, n).clip(1, 5),
    'İade': np.random.normal(5, 2, n).clip(0, 20),
})
df['Satış'] = df['Satış'] + df['Reklam'] * 0.8
corr = df.corr()

fig, ax = plt.subplots(figsize=(7, 6))
im = ax.imshow(corr, cmap='RdYlGn', vmin=-1, vmax=1)
plt.colorbar(im, ax=ax, shrink=0.8)
ax.set_xticks(range(len(corr.columns)))
ax.set_yticks(range(len(corr.columns)))
ax.set_xticklabels(corr.columns, rotation=30, ha='right', fontsize=10)
ax.set_yticklabels(corr.columns, fontsize=10)
for i in range(len(corr)):
    for j in range(len(corr)):
        val = corr.iloc[i, j]
        ax.text(j, i, f'{val:.2f}', ha='center', va='center',
                fontsize=9, color='white' if abs(val) > 0.5 else '#2a2620')
ax.set_title('Korelasyon Matrisi', fontsize=14, pad=12)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  {
    grup: 'Grafik',
    key: 'boxplot',
    label: '📦 Boxplot',
    kod: `import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
veri = {
    'IT': np.random.normal(12000, 2500, 80).clip(6000, 22000),
    'Pazarlama': np.random.normal(9000, 1800, 60).clip(5000, 16000),
    'Satış': np.random.normal(10000, 3000, 70).clip(4000, 20000),
    'İK': np.random.normal(8000, 1500, 50).clip(5000, 14000),
    'Finans': np.random.normal(13000, 2000, 65).clip(7000, 20000),
}
renkler = ['#1D9E75','#7F77DD','#e8a04a','#E24B4A','#5DCAA5']

fig, ax = plt.subplots(figsize=(9, 5))
bp = ax.boxplot(veri.values(), labels=veri.keys(),
                patch_artist=True,
                medianprops=dict(color='white', linewidth=2))
for patch, renk in zip(bp['boxes'], renkler):
    patch.set_facecolor(renk); patch.set_alpha(0.75)

ax.set_title('Departman Maaş Dağılımı', fontsize=14, pad=12)
ax.set_ylabel('Maaş (TL)')
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
  {
    grup: 'Grafik',
    key: 'subplots',
    label: '🔢 Dashboard',
    kod: `import matplotlib.pyplot as plt
import numpy as np

aylar = ['Oca','Şub','Mar','Nis','May','Haz']
satis = [42, 58, 35, 71, 63, 80]
musteri = [320, 410, 280, 520, 480, 590]
memnuniyet = [4.2, 4.5, 3.8, 4.7, 4.4, 4.8]
kategori = ['A','B','C','D']
pazar = [35, 28, 22, 15]

fig, axes = plt.subplots(2, 2, figsize=(10, 7))
fig.suptitle('Satış Dashboard', fontsize=15, fontweight='500')

axes[0,0].bar(aylar, satis, color='#1D9E75', alpha=0.85, edgecolor='none')
axes[0,0].set_title('Aylık Satış', fontsize=11)
axes[0,0].spines[['top','right']].set_visible(False)

axes[0,1].plot(aylar, musteri, color='#7F77DD', linewidth=2.5, marker='o')
axes[0,1].fill_between(aylar, musteri, alpha=0.1, color='#7F77DD')
axes[0,1].set_title('Müşteri Sayısı', fontsize=11)
axes[0,1].spines[['top','right']].set_visible(False)

axes[1,0].plot(aylar, memnuniyet, color='#e8a04a', linewidth=2.5, marker='s')
axes[1,0].set_ylim(3, 5); axes[1,0].set_title('Memnuniyet', fontsize=11)
axes[1,0].spines[['top','right']].set_visible(False)

renkler = ['#1D9E75','#7F77DD','#e8a04a','#E24B4A']
axes[1,1].pie(pazar, labels=kategori, colors=renkler,
              autopct='%1.0f%%', startangle=90,
              wedgeprops=dict(edgecolor='white', linewidth=2))
axes[1,1].set_title('Pazar Payı', fontsize=11)

plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Dashboard hazır!")`,
  },

  // ── MAKİNE ÖĞRENMESİ ────────────────────────────────────
  {
    grup: 'ML',
    key: 'regresyon',
    label: '📉 Regresyon',
    kod: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2.5 * X.ravel() + 5 + np.random.randn(100) * 3

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("=== Linear Regression ===")
print(f"Eğim (coef): {model.coef_[0]:.4f}")
print(f"Kesişim:     {model.intercept_:.4f}")
print(f"R² skoru:    {r2_score(y_test, y_pred):.4f}")
print(f"RMSE:        {mean_squared_error(y_test, y_pred)**0.5:.4f}")

fig, ax = plt.subplots(figsize=(7, 4))
ax.scatter(X_test, y_test, color='#7F77DD', alpha=0.6, s=50, label='Gerçek')
ax.plot(X_test, y_pred, color='#1D9E75', linewidth=2.5, label='Tahmin')
ax.set_title('Linear Regression', fontsize=13)
ax.legend(frameon=False)
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')`,
  },
  {
    grup: 'ML',
    key: 'kmeans',
    label: '🔵 K-Means',
    kod: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
X = np.vstack([
    np.random.normal([2, 2], 0.6, (50, 2)),
    np.random.normal([6, 6], 0.6, (50, 2)),
    np.random.normal([2, 7], 0.6, (50, 2)),
])

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
labels = kmeans.fit_predict(X_scaled)
centers = scaler.inverse_transform(kmeans.cluster_centers_)

print(f"İnertia: {kmeans.inertia_:.2f}")
print(f"İterasyon: {kmeans.n_iter_}")
for i, c in enumerate(centers):
    print(f"Küme {i+1} merkezi: ({c[0]:.2f}, {c[1]:.2f})")

renkler = ['#1D9E75','#7F77DD','#e8a04a']
fig, ax = plt.subplots(figsize=(7, 5))
for i in range(3):
    mask = labels == i
    ax.scatter(X[mask, 0], X[mask, 1], c=renkler[i],
               alpha=0.7, s=50, label=f'Küme {i+1}')
ax.scatter(centers[:, 0], centers[:, 1], c='black',
           marker='X', s=200, zorder=5, label='Merkez')
ax.set_title('K-Means Kümeleme (k=3)', fontsize=13)
ax.legend(frameon=False)
ax.spines[['top','right']].set_visible(False)
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')`,
  },
  {
    grup: 'ML',
    key: 'siniflandirma',
    label: '🤖 Sınıflandırma',
    kod: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt

np.random.seed(42)
X, y = make_classification(n_samples=500, n_features=10,
                            n_informative=5, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("=== Random Forest ===")
print(f"Doğruluk: {(y_pred == y_test).mean():.4f}")
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))

cm = confusion_matrix(y_test, y_pred)
fig, ax = plt.subplots(figsize=(5, 4))
im = ax.imshow(cm, cmap='Greens')
ax.set_xticks([0,1]); ax.set_yticks([0,1])
ax.set_xticklabels(['Negatif','Pozitif'])
ax.set_yticklabels(['Negatif','Pozitif'])
for i in range(2):
    for j in range(2):
        ax.text(j, i, cm[i,j], ha='center', va='center',
                fontsize=16, color='white' if cm[i,j] > cm.max()/2 else '#2a2620')
ax.set_title('Confusion Matrix', fontsize=13)
ax.set_xlabel('Tahmin'); ax.set_ylabel('Gerçek')
plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')`,
  },

  // ── İSTATİSTİK ───────────────────────────────────────────
  {
    grup: 'İstatistik',
    key: 'hipotez',
    label: '🧪 Hipotez Testi',
    kod: `import numpy as np
from scipy import stats

np.random.seed(42)
kontrol = np.random.normal(5.0, 0.8, 50)
deney   = np.random.normal(5.6, 0.8, 50)

# t-testi
t, p = stats.ttest_ind(kontrol, deney)
print("=== Bağımsız t-Testi ===")
print(f"Kontrol: ort={kontrol.mean():.3f}, std={kontrol.std():.3f}")
print(f"Deney:   ort={deney.mean():.3f}, std={deney.std():.3f}")
print(f"t istatistiği: {t:.4f}")
print(f"p değeri:      {p:.4f}")
print("✓ Anlamlı fark var (p<0.05)" if p < 0.05 else "✗ Anlamlı fark yok")

# Etki büyüklüğü (Cohen's d)
pooled_std = np.sqrt((kontrol.std()**2 + deney.std()**2) / 2)
cohens_d = (deney.mean() - kontrol.mean()) / pooled_std
print(f"\\nCohen's d: {cohens_d:.4f}")
if abs(cohens_d) < 0.2: print("Etki: Küçük")
elif abs(cohens_d) < 0.8: print("Etki: Orta")
else: print("Etki: Büyük")

# Güven aralığı
ci = stats.t.interval(0.95, df=len(deney)-1,
                       loc=deney.mean(),
                       scale=stats.sem(deney))
print(f"\\n%95 Güven Aralığı: ({ci[0]:.3f}, {ci[1]:.3f})")`,
  },
  {
    grup: 'İstatistik',
    key: 'dagilim',
    label: '📊 Dağılımlar',
    kod: `import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

np.random.seed(42)
x = np.linspace(-4, 4, 200)

fig, axes = plt.subplots(1, 3, figsize=(11, 4))

# Normal dağılım
axes[0].plot(x, stats.norm.pdf(x, 0, 1), color='#1D9E75', linewidth=2)
axes[0].fill_between(x, stats.norm.pdf(x, 0, 1), alpha=0.2, color='#1D9E75')
axes[0].axvline(0, color='#7F77DD', linestyle='--', linewidth=1)
axes[0].set_title('Normal Dağılım\\nμ=0, σ=1', fontsize=11)
axes[0].spines[['top','right']].set_visible(False)

# t-dağılımı karşılaştırma
for df, renk, label in [(1,'#E24B4A','df=1'), (5,'#e8a04a','df=5'), (30,'#1D9E75','df=30')]:
    axes[1].plot(x, stats.t.pdf(x, df), color=renk, linewidth=2, label=label)
axes[1].plot(x, stats.norm.pdf(x), 'k--', linewidth=1, alpha=0.5, label='Normal')
axes[1].set_title('t-Dağılımı', fontsize=11)
axes[1].legend(frameon=False, fontsize=8)
axes[1].spines[['top','right']].set_visible(False)

# Gerçek veri + normal fit
veri = np.random.normal(100, 15, 500)
axes[2].hist(veri, bins=25, color='#7F77DD', alpha=0.6,
             edgecolor='white', density=True)
x2 = np.linspace(veri.min(), veri.max(), 200)
axes[2].plot(x2, stats.norm.pdf(x2, veri.mean(), veri.std()),
             '#1D9E75', linewidth=2)
axes[2].set_title('Veri + Normal Fit', fontsize=11)
axes[2].spines[['top','right']].set_visible(False)

plt.tight_layout()
plt.savefig('grafik.png', dpi=120, bbox_inches='tight', facecolor='white')
print("✓ Grafik hazır!")`,
  },
];

const GRUPLAR = [...new Set(SNIPPETS.map(s => s.grup))];

export default function PythonPlayground() {
  const [code, setCode] = useState(SNIPPETS[0].kod);
  const [output, setOutput] = useState('▶ Çalıştır butonuna bas veya Cmd+Enter kullan.');
  const [imgSrc, setImgSrc] = useState(null);
  const [status, setStatus] = useState('Bekliyor');
  const [time, setTime] = useState('—');
  const [runs, setRuns] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState('yükleniyor');
  const [activeKey, setActiveKey] = useState(SNIPPETS[0].key);
  const [activeGrup, setActiveGrup] = useState(GRUPLAR[0]);
  const pyodideRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
    script.onload = async () => {
      try {
        setPyStatus('hazırlanıyor');
        const py = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' });
        await py.loadPackage(['matplotlib', 'numpy', 'pandas', 'scipy', 'scikit-learn']);
        await py.runPythonAsync(`import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt`);
        pyodideRef.current = py;
        setPyStatus('hazır');
      } catch (e) {
        setPyStatus('hata');
      }
    };
    document.head.appendChild(script);
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) { setOutput('⏳ Pyodide henüz yüklenmedi...'); return; }
    try { const p = Number(localStorage.getItem('sz_python_sorgu')||0); localStorage.setItem('sz_python_sorgu', p+1); } catch {}
    setIsRunning(true);
    setStatus('Çalışıyor');
    setOutput('');
    setImgSrc(null);
    const t0 = performance.now();

    const el = document.documentElement;
    const tema = el.classList.contains('gece') ? 'gece'
      : el.classList.contains('lacivert') ? 'lacivert'
      : el.classList.contains('dark') ? 'dark' : 'light';

    try {
      const py = pyodideRef.current;
      let out = '';
      py.globals.set('print', (...args) => { out += args.map(a => String(a)).join(' ') + '\n'; });
      py.globals.set('_TEMA_JS', tema);

      // Temaya göre matplotlib ayarla + savefig hook
      await py.runPythonAsync(`
import matplotlib
import matplotlib.pyplot as plt
import io, base64

if _TEMA_JS == 'gece':
    plt.style.use('dark_background')
    _BG  = '#07080E'
    _FG  = '#EEF0F8'
    _GRD = '#1E2130'
    matplotlib.rcParams.update({
        'figure.facecolor': _BG, 'axes.facecolor': _BG, 'savefig.facecolor': _BG,
        'text.color': _FG, 'axes.labelcolor': _FG,
        'xtick.color': _FG, 'ytick.color': _FG,
        'axes.edgecolor': _GRD, 'grid.color': _GRD,
        'legend.facecolor': _BG, 'legend.edgecolor': _GRD,
    })
elif _TEMA_JS == 'lacivert':
    plt.style.use('dark_background')
    _BG  = '#161B22'
    _FG  = '#E6EDF3'
    _GRD = '#30363D'
    matplotlib.rcParams.update({
        'figure.facecolor': _BG, 'axes.facecolor': _BG, 'savefig.facecolor': _BG,
        'text.color': _FG, 'axes.labelcolor': _FG,
        'xtick.color': _FG, 'ytick.color': _FG,
        'axes.edgecolor': _GRD, 'grid.color': _GRD,
        'legend.facecolor': _BG, 'legend.edgecolor': _GRD,
    })
elif _TEMA_JS == 'dark':
    plt.style.use('dark_background')
    _BG  = '#1a1815'
    _FG  = '#f0ebe3'
    _GRD = '#3a3530'
    matplotlib.rcParams.update({
        'figure.facecolor': _BG, 'axes.facecolor': _BG, 'savefig.facecolor': _BG,
        'text.color': _FG, 'axes.labelcolor': _FG,
        'xtick.color': _FG, 'ytick.color': _FG,
        'axes.edgecolor': _GRD, 'grid.color': _GRD,
        'legend.facecolor': _BG, 'legend.edgecolor': _GRD,
    })
else:
    plt.rcdefaults()
    matplotlib.use('Agg')
    _BG  = '#ffffff'
    _FG  = '#2a2620'
    _GRD = '#e8e2d5'
    matplotlib.rcParams.update({
        'figure.facecolor': _BG, 'axes.facecolor': _BG, 'savefig.facecolor': _BG,
    })

_img_b64 = None
_hooking = False

def _hooked_savefig(fname, **kwargs):
    global _img_b64, _hooking
    if _hooking:
        return
    _hooking = True
    buf = io.BytesIO()
    fig = plt.gcf()
    kw = {k: v for k, v in kwargs.items() if k not in ('format', 'facecolor')}
    fig.savefig(buf, format='png', facecolor=_BG, **kw)
    buf.seek(0)
    _img_b64 = base64.b64encode(buf.read()).decode()
    buf.close()
    _hooking = False

plt.savefig = _hooked_savefig
_img_b64 = None
`);

      await py.runPythonAsync(code);

      // plt.show() çağrıldıysa yakala
      await py.runPythonAsync(`
import io, base64
if _img_b64 is None:
    figs = [plt.figure(n) for n in plt.get_fignums()]
    if figs:
        buf = io.BytesIO()
        figs[-1].savefig(buf, format='png', dpi=120, bbox_inches='tight', facecolor=_BG)
        buf.seek(0)
        _img_b64 = base64.b64encode(buf.read()).decode()
        buf.close()
plt.close('all')
`);

      const imgB64 = py.globals.get('_img_b64');
      if (imgB64) setImgSrc(`data:image/png;base64,${imgB64}`);

      const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
      setOutput(out || '');
      setStatus('✓ Başarılı');
      setTime(`${elapsed}s`);
      setRuns(r => r + 1);
    } catch (e) {
      const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
      setOutput('✗ Hata:\n' + e.message);
      setStatus('✗ Hata');
      setTime(`${elapsed}s`);
    }
    setIsRunning(false);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart;
      const newVal = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
      setCode(newVal);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
  };

  const statusColor = pyStatus === 'hazır' ? '#1D9E75' : pyStatus === 'hata' ? '#E24B4A' : '#e8a04a';
  const grupSnippets = SNIPPETS.filter(s => s.grup === activeGrup);

  return (
    <main className="min-h-screen">
      <article className="max-w-4xl mx-auto px-6 py-12">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">araç</span>
        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Python Playground
        </h1>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-mute)' }}>
          Tarayıcında gerçek Python çalıştır — matplotlib, numpy, pandas, scipy, sklearn
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>Pyodide {pyStatus}</span>
        </div>

        {/* Grup sekmeler */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {GRUPLAR.map(g => (
            <button key={g} onClick={() => {
              setActiveGrup(g);
              const first = SNIPPETS.find(s => s.grup === g);
              if (first) { setActiveKey(first.key); setCode(first.kod); setOutput(''); setImgSrc(null); }
            }} style={{
              fontSize: '12px', padding: '5px 14px', borderRadius: '8px',
              border: '0.5px solid var(--color-border)',
              background: activeGrup === g ? '#1D9E75' : 'var(--color-cream-card)',
              color: activeGrup === g ? '#fff' : 'var(--color-text-soft)',
              cursor: 'pointer', fontWeight: activeGrup === g ? 500 : 400, transition: 'all .15s',
            }}>{g}</button>
          ))}
        </div>

        {/* Snippet bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {grupSnippets.map(s => (
            <button key={s.key} onClick={() => {
              setActiveKey(s.key); setCode(s.kod); setOutput(''); setImgSrc(null);
            }} style={{
              fontSize: '12px', padding: '4px 12px', borderRadius: '999px',
              border: '0.5px solid var(--color-border)',
              background: activeKey === s.key ? 'var(--color-accent-soft)' : 'var(--color-cream-card)',
              color: activeKey === s.key ? 'var(--color-accent-text)' : 'var(--color-text-soft)',
              cursor: 'pointer', transition: 'all .15s',
            }}>{s.label}</button>
          ))}
        </div>

        {/* Editor */}
        <div className="card mb-3" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-mute)' }}>main.py</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => { setCode(''); setOutput(''); setImgSrc(null); }}
                style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '6px', border: '0.5px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-mute)' }}>
                Temizle
              </button>
              <button onClick={runCode} disabled={isRunning || pyStatus !== 'hazır'} style={{
                fontSize: '13px', fontWeight: 500, padding: '5px 18px', borderRadius: '8px',
                border: 'none', background: '#1D9E75', color: '#fff',
                cursor: isRunning ? 'wait' : 'pointer', opacity: pyStatus !== 'hazır' ? 0.6 : 1,
              }}>
                {isRunning ? '⏳ Çalışıyor...' : '▶ Çalıştır'}
              </button>
            </div>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} onKeyDown={handleKeyDown}
            spellCheck={false} style={{
              width: '100%', minHeight: '220px', padding: '14px',
              fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.65',
              border: 'none', outline: 'none', resize: 'vertical',
              background: 'var(--color-cream-card)', color: 'var(--color-text)', boxSizing: 'border-box',
            }} />
          <div style={{ padding: '6px 14px', background: 'var(--color-cream)', borderTop: '0.5px solid var(--color-border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-mute)' }}>Cmd+Enter ile çalıştır · Tab ile girinti</span>
          </div>
        </div>

        {/* Output */}
        <div className="card mb-6" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '0.5px solid var(--color-border)', background: 'var(--color-cream)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-mute)' }}>çıktı</span>
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--color-text-mute)' }}>
              <span>{time}</span>
              <span style={{ color: status.includes('Hata') ? '#E24B4A' : status.includes('Başarılı') ? '#1D9E75' : 'var(--color-text-mute)' }}>{status}</span>
            </div>
          </div>
          {imgSrc && (
            <div style={{ padding: '16px', background: 'var(--color-cream-card)', borderBottom: output ? '0.5px solid var(--color-border)' : 'none', textAlign: 'center' }}>
              <img src={imgSrc} alt="Matplotlib grafik" style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
              <div style={{ marginTop: '8px' }}>
                <a href={imgSrc} download="grafik.png" style={{ fontSize: '12px', color: 'var(--color-accent-text)', textDecoration: 'none' }}>⬇ Grafiği indir</a>
              </div>
            </div>
          )}
          <pre style={{
            margin: 0, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '13px',
            lineHeight: '1.65', minHeight: imgSrc ? 'auto' : '80px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            color: status.includes('Hata') ? '#E24B4A' : 'var(--color-text)',
            background: 'var(--color-cream-card)',
          }}>{output || (imgSrc ? '' : '▶ Çalıştır butonuna bas veya Cmd+Enter kullan.')}</pre>
        </div>
      </article>
    </main>
  );
}
