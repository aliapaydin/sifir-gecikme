export const SINAV_SORULARI = [
  {
    id: 1,
    ders: 'SQL',
    soru: 'Aşağıdaki SQL sorgusunun çıktısı ne olur?\n\nSELECT departman, COUNT(*) as sayi\nFROM calisanlar\nGROUP BY departman\nHAVING COUNT(*) > 5\nORDER BY sayi DESC;',
    secenekler: [
      'Tüm departmanlar listelenir',
      '5\'ten fazla çalışanı olan departmanlar, büyükten küçüğe sıralı',
      '5\'ten az çalışanı olan departmanlar',
      'Sadece en büyük departman',
    ],
    dogru: 1,
    aciklama: 'HAVING COUNT(*) > 5 grup filtrelemesi yapar. Sadece 5+ çalışanı olan departmanlar gelir. ORDER BY DESC büyükten küçüğe sıralar.',
  },
  {
    id: 2,
    ders: 'SQL JOIN',
    soru: 'Müşteri tablosunda 80 kayıt, sipariş tablosunda 200 kayıt var.\nSome müşterilerin siparişi yok.\n\nSELECT * FROM musteriler m\nLEFT JOIN siparisler s ON m.id = s.musteri_id;\n\nKaç satır döner?',
    secenekler: [
      'Tam 80 satır',
      '200 satır',
      '80 ile 200 arasında değişir — eşleşmelere göre',
      'En az 80, en fazla 200 olabilir — her müşteri satırı korunur',
    ],
    dogru: 3,
    aciklama: 'LEFT JOIN sol tablodaki (müşteriler) tüm satırları korur. Siparişi olmayan müşteriler NULL ile gelir. Çok siparişli müşteri birden fazla satırda görünür. Minimum 80, maksimum 200 satır.',
  },
  {
    id: 3,
    ders: 'Pandas',
    soru: 'df.groupby("sehir")["maas"].agg(["mean","count","std"])\n\nBu kod ne üretir?',
    secenekler: [
      'Tek bir sayı döndürür',
      'Her şehir için ortalama, sayı ve standart sapma içeren DataFrame',
      'Sadece ortalama maaşları içeren liste',
      'Hata — agg() bu şekilde kullanılamaz',
    ],
    dogru: 1,
    aciklama: 'agg() ile liste verince her agregasyon fonksiyonu için ayrı sütun oluşur. Şehir bazında 3 metriği aynı anda hesaplar.',
  },
  {
    id: 4,
    ders: 'Veri Temizleme',
    soru: 'Bir veri setinde yaş sütununda 210 değeri var.\nNormal yaş aralığı 18-90.\n\nEn doğru yaklaşım hangisi?',
    secenekler: [
      'Satırı sil',
      'IQR yöntemi ile aykırı olduğunu doğrula, sonra clip() veya impute et',
      'Değeri 90 ile değiştir',
      'Olduğu gibi bırak',
    ],
    dogru: 1,
    aciklama: 'Önce aykırı mı kontrol et (IQR veya domain bilgisi). 210 açıkça veri giriş hatası. clip() ile sınırla veya NaN yapıp medyanla doldur. Kör silme veri kaybeder.',
  },
  {
    id: 5,
    ders: 'Model Değerlendirme',
    soru: 'Kanser tespiti modelinin confusion matrix sonuçları:\nTP=90, FP=5, TN=195, FN=10\n\nRecall değeri nedir?',
    secenekler: [
      '%94.7 — TP/(TP+FP)',
      '%90 — TP/(TP+FN)',
      '%97.5 — TN/(TN+FP)',
      '%95.2 — (TP+TN)/Toplam',
    ],
    dogru: 1,
    aciklama: 'Recall = TP / (TP + FN) = 90 / (90 + 10) = 90/100 = %90. Gerçek hastaların ne kadarını yakaladığımızı gösterir. Tıbbi tanıda en kritik metrik.',
  },
  {
    id: 6,
    ders: 'Feature Engineering',
    soru: '"Şehir" sütunu 50 farklı değer içeriyor.\nOne-Hot Encoding uygulanırsa ne olur?',
    secenekler: [
      '1 yeni sütun oluşur',
      '50 yeni binary sütun oluşur (veya 49 drop_first=True ile)',
      'Veri tipi float\'a döner',
      'Sütun silinir',
    ],
    dogru: 1,
    aciklama: 'One-Hot Encoding her kategori için ayrı binary sütun üretir. 50 şehir → 50 sütun (drop_first=True ile 49). Yüksek kardinalitede dikkatli ol.',
  },
  {
    id: 7,
    ders: 'Bias-Variance',
    soru: 'Lasso Regression\'da alpha parametresi artırılırsa ne olur?',
    secenekler: [
      'Model daha karmaşık hale gelir',
      'Regularization güçlenir, bazı katsayılar sıfıra iner, model basitleşir',
      'Model doğruluğu artar',
      'Özellik sayısı artar',
    ],
    dogru: 1,
    aciklama: 'Lasso\'da alpha regularization gücünü kontrol eder. Yüksek alpha → daha güçlü ceza → daha az özellik kullanılır → underfitting riski. İdeal alpha cross-validation ile bulunur.',
  },
  {
    id: 8,
    ders: 'Veri Görselleştirme',
    soru: 'Aşağıdaki durumlar için doğru grafik eşleştirmesi hangisidir?',
    secenekler: [
      'Dağılım → Pasta, Korelasyon → Scatter, Zaman → Bar',
      'Dağılım → Histogram, Korelasyon → Heatmap, Zaman → Line',
      'Dağılım → Line, Korelasyon → Histogram, Zaman → Scatter',
      'Hepsi için Bar grafik kullanılabilir',
    ],
    dogru: 1,
    aciklama: 'Histogram → dağılım şekli, Heatmap → değişkenler arası korelasyon, Line chart → zaman serisi trendi. Her veri tipinin "doğal" grafiği var.',
  },
  {
    id: 9,
    ders: 'İstatistiksel Testler',
    soru: 'A/B testinde:\n- p-değeri = 0.03\n- Etki büyüklüğü (Cohen\'s d) = 0.05\n\nBu sonucu nasıl yorumlarsın?',
    secenekler: [
      'İstatistiksel anlamlı VE pratik anlamlı',
      'İstatistiksel anlamlı AMA pratik olarak önemsiz fark',
      'İstatistiksel anlamlı değil',
      'Yorum yapılamaz',
    ],
    dogru: 1,
    aciklama: 'p < 0.05 istatistiksel anlamlı. Ama Cohen\'s d = 0.05 çok küçük etki (küçük = 0.2, orta = 0.5, büyük = 0.8). Büyük örneklemde anlamsız farklar da anlamlı çıkabilir.',
  },
  {
    id: 10,
    ders: 'sklearn Pipeline',
    soru: 'Pipeline içinde cross_val_score kullanmanın en önemli avantajı nedir?',
    secenekler: [
      'Daha hızlı çalışır',
      'Her CV fold\'unda preprocessing sadece eğitim verisine uygulanır — data leakage önlenir',
      'Daha fazla algoritma dener',
      'Kod yazması daha kolaydır',
    ],
    dogru: 1,
    aciklama: 'Pipeline olmadan CV\'de scaler tüm veriye fit edilirse test verisi bilgisi modele sızar (leakage). Pipeline her fold\'da sadece training parçasına fit eder. Gerçekçi performans tahmini için kritik.',
  },
];

export function derece(puan) {
  if (puan >= 90) return { ad: 'Altın', renk: '#BA7517', bg: '#FAEEDA', emoji: '🥇', min: 90 };
  if (puan >= 70) return { ad: 'Gümüş', renk: '#5F5E5A', bg: '#F1EFE8', emoji: '🥈', min: 70 };
  return { ad: 'Bronz', renk: '#993C1D', bg: '#FAECE7', emoji: '🥉', min: 0 };
}
