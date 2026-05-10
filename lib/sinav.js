export const SINAV_SORULARI = [
  {
    id: 1,
    ders: 'Python Temelleri',
    soru: 'Aşağıdaki kodun çıktısı nedir?\n\nx = [1, 2, 3, 4, 5]\nprint(x[-2])',
    secenekler: ['2', '3', '4', '5'],
    dogru: 2,
    aciklama: 'Negatif index sondan başlar. x[-1]=5, x[-2]=4 olur.',
  },
  {
    id: 2,
    ders: 'Döngüler & Fonksiyonlar',
    soru: 'Aşağıdaki fonksiyon ne döndürür?\n\ndef f(n):\n    return [x**2 for x in range(n)]\n\nprint(f(4))',
    secenekler: ['[1, 4, 9, 16]', '[0, 1, 4, 9]', '[0, 1, 2, 3]', '[1, 2, 3, 4]'],
    dogru: 1,
    aciklama: 'range(4) → 0,1,2,3. Kareleri: 0,1,4,9 olur.',
  },
  {
    id: 3,
    ders: 'NumPy Temelleri',
    soru: 'NumPy ile aşağıdaki işlemin sonucu nedir?\n\nimport numpy as np\na = np.array([1, 2, 3, 4])\nprint(a.mean())',
    secenekler: ['2.0', '2.5', '3.0', '10'],
    dogru: 1,
    aciklama: '(1+2+3+4)/4 = 10/4 = 2.5 olur.',
  },
  {
    id: 4,
    ders: 'NumPy Temelleri',
    soru: 'M = np.array([[1,2],[3,4]])\nprint(M.sum(axis=0))\n\nBu kodun çıktısı nedir?',
    secenekler: ['[3, 7]', '[4, 6]', '[10]', '[1, 2, 3, 4]'],
    dogru: 1,
    aciklama: 'axis=0 sütun toplamları: 1+3=4, 2+4=6 → [4, 6]',
  },
  {
    id: 5,
    ders: 'Pandas ile Veri Analizi',
    soru: 'Bir DataFrame\'de sadece "İzmir" şehrindeki satırları seçmek için hangi kod doğrudur?',
    secenekler: [
      'df.filter(sehir="İzmir")',
      "df[df['sehir'] == 'İzmir']",
      "df.select('sehir', 'İzmir')",
      "df.where(sehir='İzmir')",
    ],
    dogru: 1,
    aciklama: 'Boolean filtreleme: df[koşul] sadece koşulu sağlayan satırları döndürür.',
  },
  {
    id: 6,
    ders: 'Pandas ile Veri Analizi',
    soru: 'df.groupby("departman")["maas"].mean() ne yapar?',
    secenekler: [
      'Tüm maaşların ortalamasını alır',
      'Departmana göre gruplar ve her departmanın ortalama maaşını hesaplar',
      'Maaşa göre sıralama yapar',
      'Departman sütununu siler',
    ],
    dogru: 1,
    aciklama: 'groupby departmana göre gruplar, mean() her grubun ortalamasını alır.',
  },
  {
    id: 7,
    ders: 'Matplotlib Temelleri',
    soru: 'plt.subplots(2, 3) çağrısı kaç grafik alanı oluşturur?',
    secenekler: ['2', '3', '5', '6'],
    dogru: 3,
    aciklama: '2 satır × 3 sütun = 6 grafik alanı (axes) oluşturur.',
  },
  {
    id: 8,
    ders: 'Seaborn ile Güzel Grafikler',
    soru: 'Korelasyon matrisi için en uygun renk paleti hangisidir?',
    secenekler: [
      'Niteliksel (husl) — kategoriler için',
      'Ardışık (Blues) — düşükten yükseğe',
      'Iraksak (RdBu) — ortası 0, iki yön',
      'Döngüsel (hsv) — başı=sonu',
    ],
    dogru: 2,
    aciklama: 'Korelasyon -1 ile +1 arası, 0 merkez. Iraksak palet bu yapı için idealdir.',
  },
  {
    id: 9,
    ders: 'İstatistik & ML Giriş',
    soru: 'Bir modelin R² skoru 0.85 çıktı. Bu ne anlama gelir?',
    secenekler: [
      'Model %15 doğru tahmin yapıyor',
      "Hedef değişkenin varyansının %85'i açıklanıyor",
      'Test hatası %85',
      'Model 0.85 hata yapıyor',
    ],
    dogru: 1,
    aciklama: 'R² (R-kare) modelin bağımlı değişkenin varyansını açıklama oranıdır. 0.85 → çok iyi.',
  },
  {
    id: 10,
    ders: 'Veri Görselleştirme',
    soru: '12 aylık satış trendini göstermek için hangi grafik tipi en uygundur?',
    secenekler: [
      'Pasta grafik (pie chart)',
      'Scatter plot',
      'Çizgi grafik (line chart)',
      'Kutu grafiği (boxplot)',
    ],
    dogru: 2,
    aciklama: 'Zaman içindeki değişimi ve trendi göstermek için çizgi grafik idealdir.',
  },
];

export function derece(puan) {
  if (puan >= 90) return { ad: 'Altın', renk: '#BA7517', bg: '#FAEEDA', emoji: '🥇', min: 90 };
  if (puan >= 70) return { ad: 'Gümüş', renk: '#5F5E5A', bg: '#F1EFE8', emoji: '🥈', min: 70 };
  return { ad: 'Bronz', renk: '#993C1D', bg: '#FAECE7', emoji: '🥉', min: 0 };
}
