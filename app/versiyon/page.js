import Link from 'next/link';
import { CURRENT_VERSION } from '../../lib/versiyon';

export const metadata = {
  title: 'Versiyon Geçmişi',
  description: 'Sıfır Gecikme sitesinin tüm sürüm notları ve özellik güncellemeleri.',
};

const versiyonlar = [
  {
    versiyon: 'v1.8.0',
    tarih: '20 Mayıs 2026',
    baslik: 'Tüm İçerikler + Z-Skor Aracı + Tek Kaynak Mimarisi',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Tüm İçerikler sayfası (/icerikler): sekmeli görünüm (Demo, Rehber, Kariyer, Vaka, Araç), ziyaret/anladım/tekrar durumları kartlarda gösteriliyor' },
      { tip: 'yeni', metin: 'Z-Skor & Normal Dağılım Hesaplayıcı (/yazilar/z-skor): μ, σ ve x sliderlarıyla dört mod, SVG çan eğrisi ve 68-95-99.7 kartları' },
      { tip: 'yeni', metin: 'Anladım / Tekrar Bak butonları tüm yazı sayfalarına eklendi — karşılıklı dışlayan, localStorage ile kalıcı' },
      { tip: 'iyileştirme', metin: 'Haritam (/harita) ve Bilgi Grafiği (/grafik) artık lib/icerikler.js\'deki yazilar dizisinden besleniyor; yeni içerik ekleyince otomatik görünür' },
      { tip: 'iyileştirme', metin: 'Bilgi Grafiği: koordinatı olmayan yeni içerikler alt satıra otomatik yerleştirilir, MANUAL_META ile hassas konumlandırma korunuyor' },
      { tip: 'iyileştirme', metin: 'Navbar pill bar: "Tümü" → "Anasayfa", "Tüm İçerikler" butonu /icerikler sayfasına eklendi' },
      { tip: 'düzeltme', metin: 'Gece teması navigasyon sırasında beyaza dönme hatası giderildi (ThemeSync bileşenine gece sınıfı eklendi)' },
      { tip: 'düzeltme', metin: 'İçerik grid düzeni Tailwind v4 uyumsuzluğu nedeniyle tek sütuna düşüyordu — @layer utilities ile giderildi' },
    ],
  },
  {
    versiyon: 'v1.7.0',
    tarih: '19 Mayıs 2026',
    baslik: 'Gece Teması + Logo + Tema Uyumlu Grafikler',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Gece teması (4. tema): koyu indigo/violet palet, ✨ ikonu ile tema döngüsüne eklendi' },
      { tip: 'yeni', metin: 'Data bars SVG logosu — "Sz" yazısı yerine yükselen üç sütun, tüm temalarda uyumlu' },
      { tip: 'yeni', metin: 'Harita sayfasına ProfilHero kartı: sitede geçirilen süre, gün serisi, etkileşim ve başarım istatistikleri' },
      { tip: 'yeni', metin: 'Databricks kullanım rehberi (/yazilar/databricks-rehberi): Lakehouse\'dan MLflow\'a interaktif rehber' },
      { tip: 'düzeltme', metin: 'Proje modülü ve Python Playground: matplotlib grafikleri her çalıştırmada aktif temaya göre arka plan ve renk uyumuyla oluşturuluyor' },
      { tip: 'düzeltme', metin: 'Gece modunda Giscus yorum bileşeni koyu temada görüntülenmiyor sorunu giderildi' },
      { tip: 'düzeltme', metin: 'İnteraktif bileşenlerde (Databricks Demo, sklearn Pipeline, Cohort Analizi) sabit hex renkler tema değişkenlerine ve rgba\'ya taşındı' },
    ],
  },
  {
    versiyon: 'v1.6.0',
    tarih: '18 Mayıs 2026',
    baslik: 'Sinir Ağı Playground + İlerleme Haritası 2.0',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Sinir Ağı Playground (/nn): XOR/çember/spiral veri setleriyle gerçek zamanlı karar sınırı görselleştirme' },
      { tip: 'yeni', metin: 'Harita sayfasına Modüller bölümü: 7 modülün kullanım istatistikleri (Kalori, Mülakat, Milyon, Çiz, NN, Regex, Veri Setleri)' },
      { tip: 'yeni', metin: 'Başarımlar 13\'ten 24\'e yükseltildi — mülakat, milyon yarışması ve playground başarımları eklendi' },
      { tip: 'yeni', metin: 'Tüm modüllere localStorage takibi: milyon kazanımı, mülakat soruları, tahmin ve eğitim sayıları' },
      { tip: 'düzeltme', metin: 'Günün Sorusu dark/lacivert temada parlak yeşil/kırmızı arka plan sorunu — CSS değişkenlerine taşındı' },
      { tip: 'düzeltme', metin: 'ZiyaretTakip ana layout\'a taşındı; /veri-setleri ve /mulakat artık haritaya kaydediliyor' },
    ],
  },
  {
    versiyon: 'v1.5.0',
    tarih: '17 Mayıs 2026',
    baslik: 'Rakam Çiz + Versiyon Geçmişi',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Rakam Çiz (/ciz): Tarayıcıda CNN modeli sıfırdan eğiten interaktif araç — TensorFlow.js, MNIST, WebGL' },
      { tip: 'yeni', metin: '65.000 el yazısı rakamla tarayıcıda gerçek zamanlı model eğitimi, IndexedDB önbellekleme' },
      { tip: 'yeni', metin: 'Bounding box normalization: çizilen rakam MNIST formatına otomatik hizalanıyor' },
      { tip: 'yeni', metin: 'Versiyon geçmişi sayfası (/versiyon) ve footer\'da sürüm numarası badge eklendi' },
      { tip: 'düzeltme', metin: 'Dark/lacivert tema navigasyon sırasında beyaza dönme hatası giderildi (ThemeSync bileşeni)' },
      { tip: 'düzeltme', metin: 'Mülakat sayfası sticky bar konum düzeltmesi ve stil hataları giderildi' },
    ],
  },
  {
    versiyon: 'v1.4.0',
    tarih: '14 Mayıs 2026',
    baslik: 'Kalori AI + Mülakat + Milyoner',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Kalori AI (/kalori): Fotoğraftan kalori tahmini yapan yapay zeka aracı' },
      { tip: 'yeni', metin: 'Mülakat Hazırlık (/mulakat): Veri bilimi mülakat soruları ve ipuçları' },
      { tip: 'yeni', metin: 'Kim Milyoner Olmak İster (/milyon): Veri bilimi temalı bilgi yarışması' },
      { tip: 'iyileştirme', metin: 'Kalori AI: 429 quota hatalarında otomatik model geçişi, session boyunca başarısız modelleri atlama' },
    ],
  },
  {
    versiyon: 'v1.3.0',
    tarih: '10 Mayıs 2026',
    baslik: 'Lacivert Tema + Öğren Genişletme',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Lacivert tema eklendi — üç tema döngüsü: açık / koyu / lacivert' },
      { tip: 'yeni', metin: 'Yol haritası (/harita): Veri bilimine giriş öğrenme yolu takip sistemi' },
      { tip: 'yeni', metin: 'Günün sorusu bileşeni ana sayfaya eklendi' },
      { tip: 'iyileştirme', metin: 'Öğren modülü 20 derse yükseltildi, karma sınav sistemi' },
      { tip: 'yeni', metin: 'Regex Playground, Merkezi Limit Teoremi, Veri Dedektifi araçları' },
    ],
  },
  {
    versiyon: 'v1.2.0',
    tarih: '7 Mayıs 2026',
    baslik: 'Pill Bar Navbar + Yeni İçerikler',
    tip: 'feature',
    ozellikler: [
      { tip: 'iyileştirme', metin: 'Navbar pill bar tasarımına geçiş — kategori ve araç linkleri gruplanmış hâlde' },
      { tip: 'yeni', metin: 'SQL Temelleri, Pandas Hataları, Feature Engineering yazıları' },
      { tip: 'yeni', metin: 'Kariyer yazıları: İlk 90 Gün, Rol Farkları' },
      { tip: 'yeni', metin: 'Sosyal paylaşım ve ilgili içerikler bileşenleri' },
      { tip: 'yeni', metin: 'CSV görüntüleyici ve Renk Paleti araçları' },
    ],
  },
  {
    versiyon: 'v1.1.0',
    tarih: '1 Mayıs 2026',
    baslik: 'İnteraktif Demolar',
    tip: 'feature',
    ozellikler: [
      { tip: 'yeni', metin: 'Linear Regression, Gradient Descent, K-Means interaktif demoları' },
      { tip: 'yeni', metin: 'Confusion Matrix, Bias-Variance, Sinir Ağı Visualizer' },
      { tip: 'yeni', metin: 'A/B Test hesaplayıcı ve Sample Size aracı' },
      { tip: 'yeni', metin: 'Bezier eğrileri ve vaka çalışmaları (churn, kredi SHAP, İzmir kira, Süperlig xG)' },
    ],
  },
  {
    versiyon: 'v1.0.0',
    tarih: '29 Nisan 2026',
    baslik: 'İlk Yayın',
    tip: 'launch',
    ozellikler: [
      { tip: 'yeni', metin: 'Türkçe veri bilimi platformu — sıfırdan yayına' },
      { tip: 'yeni', metin: 'Yazılar, Öğren modülü (Python temelleri, NumPy, Pandas, istatistik)' },
      { tip: 'yeni', metin: 'Veri setleri sayfası' },
      { tip: 'yeni', metin: 'Dark mode, PWA desteği, SEO altyapısı' },
    ],
  },
];

const tipRenk = {
  yeni:        { bg: 'var(--color-correct-bg)',  text: 'var(--color-correct-text)',  label: 'Yeni' },
  düzeltme:    { bg: 'var(--color-amber-bg)',    text: 'var(--color-amber-text)',    label: 'Düzeltme' },
  iyileştirme: { bg: 'var(--color-purple-bg)',   text: 'var(--color-purple-text)',   label: 'İyileştirme' },
};

const versiyonTipRenk = {
  feature: { bg: 'var(--color-accent-soft)',  border: 'var(--color-accent)',      text: 'var(--color-accent)' },
  launch:  { bg: 'var(--color-purple-bg)',    border: 'var(--color-purple-text)', text: 'var(--color-purple-text)' },
};

export default function VersiyonPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-cream)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Başlık */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Versiyon Geçmişi
            </h1>
            <span style={{ padding: '4px 12px', borderRadius: '999px', background: 'var(--color-accent)', color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {CURRENT_VERSION}
            </span>
          </div>
          <p style={{ color: 'var(--color-text-soft)', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
            Sıfır Gecikme'nin tüm sürüm notları. Her güncellemeyle ne eklendi, ne düzeltildi.
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: '9 sürüm', color: 'var(--color-accent)' },
              { label: 'Açık kaynak', color: 'var(--color-text-mute)' },
              { label: 'Türkçe & ücretsiz', color: 'var(--color-text-mute)' },
            ].map(b => (
              <span key={b.label} style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', fontSize: '12px', color: b.color, fontWeight: 600 }}>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {versiyonlar.map((v, idx) => {
            const vc = versiyonTipRenk[v.tip];
            return (
              <div key={v.versiyon} style={{ display: 'flex', gap: '0', position: 'relative' }}>

                {/* Sol — çizgi + nokta */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '32px', flexShrink: 0, paddingTop: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: idx === 0 ? 'var(--color-accent)' : 'var(--color-border)', border: `2px solid ${idx === 0 ? 'var(--color-accent)' : 'var(--color-border)'}`, flexShrink: 0, zIndex: 1 }} />
                  {idx < versiyonlar.length - 1 && (
                    <div style={{ width: '2px', flex: 1, background: 'var(--color-border)', marginTop: '4px', minHeight: '40px' }} />
                  )}
                </div>

                {/* Sağ — içerik */}
                <div style={{ flex: 1, paddingBottom: '40px', paddingLeft: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '15px', color: 'var(--color-text)' }}>
                      {v.versiyon}
                    </span>
                    {idx === 0 && (
                      <span style={{ padding: '2px 8px', borderRadius: '999px', background: 'var(--color-accent)', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>GÜNCEL</span>
                    )}
                    <span style={{ fontSize: '12px', color: 'var(--color-text-mute)' }}>{v.tarih}</span>
                  </div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '14px', marginTop: '2px' }}>
                    {v.baslik}
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {v.ozellikler.map((o, i) => {
                      const tc = tipRenk[o.tip];
                      return (
                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', background: tc.bg, color: tc.text, fontSize: '10px', fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0, marginTop: '2px' }}>
                            {tc.label.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--color-text-soft)', lineHeight: 1.6 }}>{o.metin}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alt kısım */}
        <div style={{ marginTop: '8px', padding: '20px', background: 'var(--color-cream-card)', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-mute)', marginBottom: '12px' }}>
            Kaynak kodu GitHub'da açık. Hata bildirimi veya öneri için:
          </p>
          <a
            href="https://github.com/aliapaydin"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', background: 'var(--color-text)', color: 'var(--color-cream)', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub'da görüntüle
          </a>
        </div>

      </div>
    </div>
  );
}
