export default function SuperLigXG() {
  return (
    <main className="min-h-screen">
      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-case inline-block mb-3">vaka çalışması</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Süper Lig&apos;de xG analizi: gol mü şans mı?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>
          2023/24 sezonu · 12 dakika okuma · Python + pandas + mplsoccer
        </p>

        <p>
          Mauro Icardi 2023/24 sezonunda 25 golle gol krallığını aldı. Peki bu goller
          gerçekten Icardi&apos;nin kalitesini mi yansıtıyor, yoksa şanslı pozisyonlar mı?
          <strong> xG (Expected Goals)</strong> tam olarak bu soruyu cevaplar.
        </p>

        <p>
          xG, bir şutun gole dönüşme olasılığını 0 ile 1 arasında ifade eder.
          Ceza sahasının ortasından yapılan kafa vuruşu ~0.7 xG taşır.
          Uzaktan sert bir şut ise ~0.03. Sezon sonunda bir oyuncunun toplam
          xG&apos;si ile attığı gol sayısını karşılaştırmak, gerçek katkısını ortaya koyar.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Gol &gt; xG: oyuncu şansını iyi kullanıyor veya bitişi güçlü.<br/>
            Gol &lt; xG: şut kalitesine rağmen gole çevirememiş, ya şanssız ya da bitişi zayıf.
          </p>
        </blockquote>

        <h2>Veri nereden geliyor?</h2>
        <p>
          xG verisi için en yaygın açık kaynak <strong>StatsBomb</strong> ve
          <strong> Understat</strong>&apos;tır. Python ile çekmek için:
        </p>

        <pre>{`import requests
import pandas as pd

# Understat API — ücretsiz, kayıt gerektirmez
# Süper Lig 2023/24 oyuncu istatistikleri
url = "https://understat.com/league/Super_Lig/2023"

# understatapi kütüphanesi ile daha kolay
# pip install understatapi
from understatapi import UnderstatClient

async def get_player_stats():
    async with UnderstatClient() as understat:
        players = await understat.league(league="Super_Lig").get_player_data(
            season="2023"
        )
    return pd.DataFrame(players)

import asyncio
df = asyncio.run(get_player_stats())
print(df.columns.tolist())
# ['id', 'player_name', 'games', 'time', 'goals', 'xG',
#  'assists', 'xA', 'shots', 'key_passes', 'yellow', 'red']`}</pre>

        <h2>xG vs Gerçek Gol — Kim Şanslı, Kim Şanssız?</h2>
        <p>
          2023/24 Süper Lig sezonundan öne çıkan veriler. Her oyuncunun
          beklenen golü (xG) ile attığı gerçek gol sayısını karşılaştıralım:
        </p>

        <pre>{`# Veriyi temizle ve analiz et
df['goals'] = pd.to_numeric(df['goals'])
df['xG'] = pd.to_numeric(df['xG'])
df['xG_diff'] = df['goals'] - df['xG']  # pozitif = beklentinin üstünde

# Minimum 5 maç oynamış forveti filtrele
forvetler = df[
    (df['games'] >= 5) &
    (df['goals'] >= 3)
].copy()

# En çok "beklentiyi aşan" oyuncular
asanlar = forvetler.nlargest(10, 'xG_diff')[
    ['player_name', 'goals', 'xG', 'xG_diff', 'shots']
]
print(asanlar.to_string(index=False))

# Gerçek gol / xG oranı (bitiricilik)
forvetler['bitis_orani'] = forvetler['goals'] / forvetler['xG']
print(forvetler.nlargest(5, 'bitis_orani')[['player_name','bitis_orani']])`}</pre>

        <h2>2023/24 Sezonu Öne Çıkan Bulgular</h2>
        <p>
          Transfermarkt ve Understat verilerine göre sezonun dikkat çekici xG bulguları:
        </p>

        <ul>
          <li>
            <strong>Mauro Icardi (Galatasaray) — 25 gol:</strong> Sezonun gol kralı.
            xG&apos;si yaklaşık 18-19 civarında tahmin ediliyor. Yani beklentinin
            6-7 gol üzerinde bitirdi — olağanüstü bir bitiricilik ya da
            yüksek baskı altında verilen kötü şutları değerlendirme yeteneği.
          </li>
          <li>
            <strong>Ciro Immobile (Beşiktaş) — 14 gol:</strong> Kariyerinin
            altın yıllarından uzakta ama xG&apos;sine yakın bitirdi. Pozisyon alma
            kalitesi hâlâ yüksek, bitiriş gücü düşmüş.
          </li>
          <li>
            <strong>Dries Mertens (Galatasaray) — Asist krallığı:</strong>
            xA (Expected Assists) metriğinde de öne çıktı. Pas kalitesi
            yaşına rağmen elit seviyede.
          </li>
        </ul>

        <h2>Takım Bazında xG Analizi</h2>
        <p>
          Bireysel değil takım xG&apos;si, hücum sisteminin ne kadar kaliteli pozisyon
          ürettiğini gösterir. xGF (For) − xGA (Against) farkı ise gerçek güç göstergesi.
        </p>

        <pre>{`# Takım bazında xG analizi
async def get_team_stats():
    async with UnderstatClient() as understat:
        teams = await understat.league(league="Super_Lig").get_team_data(
            season="2023"
        )
    return teams

# xGF - xGA = net xG farkı
takim_df['xG_net'] = takim_df['xGF'] - takim_df['xGA']

# Gerçek puan vs xG bazlı beklenen puan karşılaştırması
takim_df['puan_farki'] = takim_df['gercek_puan'] - takim_df['beklenen_puan']

# Puan farkı pozitif = şanslı takım
# Puan farkı negatif = hak ettiğinden az puan alan takım
print(takim_df.sort_values('puan_farki', ascending=False)[
    ['takim', 'gercek_puan', 'beklenen_puan', 'puan_farki']
])`}</pre>

        <h2>Şut Haritası: Pozisyon Kalitesi</h2>
        <p>
          xG analizinin en görsel hali şut haritasıdır. Her şutun konumu ve
          xG değeri birlikte gösterilir. <code>mplsoccer</code> kütüphanesi
          Python&apos;da bunu çok kolay yapıyor:
        </p>

        <pre>{`from mplsoccer import Pitch
import matplotlib.pyplot as plt
import numpy as np

# Pitch çiz
pitch = Pitch(pitch_type='statsbomb', pitch_color='#1a2a1a',
              line_color='white', line_alpha=0.5)
fig, ax = pitch.draw(figsize=(12, 8))

# Şutları çiz — boyut xG, renk gol/gol yok
for _, sut in oyuncu_sutlari.iterrows():
    renk = '#FFD700' if sut['sonuc'] == 'Goal' else '#ffffff'
    pitch.scatter(
        sut['x'], sut['y'],
        s=sut['xG'] * 1000,   # boyut = xG büyüklüğü
        c=renk, alpha=0.6, ax=ax
    )

plt.title(f"{oyuncu_adi} — 2023/24 Şut Haritası", color='white', fontsize=14)
plt.savefig('sut_haritasi.png', dpi=150, bbox_inches='tight',
            facecolor='#1a2a1a')`}</pre>

        <h2>xG Neden Mükemmel Değil?</h2>
        <p>
          Her metrik gibi xG&apos;nin de sınırları var:
        </p>
        <ul>
          <li>
            <strong>Kaleci kalitesini yok sayar.</strong> Dünya kalecisine karşı
            0.3 xG&apos;lik şut atman ile kötü kaleciye atman aynı değeri taşır.
          </li>
          <li>
            <strong>Şutun tekniğini ölçemez.</strong> Köşeye yerleştirilen
            hassas bir şut ile savunmacıya giden şut aynı pozisyondan olsa aynı xG alır.
          </li>
          <li>
            <strong>Küçük örneklemde yanıltıcı.</strong> 5-10 şutte xG anlamı
            zayıflar. En az bir sezonluk veri gerekir.
          </li>
          <li>
            <strong>Model farkı.</strong> Statsbomb xG modeli ile Understat modeli
            aynı şut için farklı değer verebilir.
          </li>
        </ul>

        <h2>Veriyi Sen de Çek</h2>
        <p>
          Kendi analizini yapmak istersen açık kaynak alternatifleri:
        </p>

        <pre>{`# Ücretsiz veri kaynakları

# 1. Understat — Avrupa ligleri + Süper Lig
# pip install understatapi

# 2. StatsBomb açık veri (bazı ligler ücretsiz)
# pip install statsbombpy
from statsbombpy import sb
comp = sb.competitions()  # mevcut ligleri gör

# 3. FBref üzerinden manuel scraping
import requests
from bs4 import BeautifulSoup

url = "https://fbref.com/en/comps/26/Super-Lig-Stats"
r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
soup = BeautifulSoup(r.text, 'html.parser')

# 4. Soccerway API (gayri resmi)
# 5. Fotmob scraping (dikkatli kullan)`}</pre>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            Futbol analitiği artık kulüplerin teknik direktörlerine rapor sunduğu
            bir alan. Türkiye&apos;de bu alanda çalışan analist sayısı hâlâ çok az.
            Veri bilimi + futbol tutkusu = ciddi bir kariyer fırsatı.
          </p>
        </blockquote>

        <h2>3 Ana Bulgu</h2>
        <ul>
          <li>
            <strong>xG, gol sayısından daha iyi bir performans göstergesi.</strong>
            Şans faktörünü arındırarak oyuncunun gerçek katkısını ölçer.
          </li>
          <li>
            <strong>Sürekli xG&apos;yi aşmak sürdürülebilir değil.</strong>
            İstatistiksel olarak ortalamaya dönüş (regression to mean) kaçınılmaz.
            Bu sezon harika görünen forvet gelecek sezon düşebilir.
          </li>
          <li>
            <strong>Takım xG&apos;si bireysel xG&apos;den daha önemli.</strong>
            İyi bir sistem kaliteli pozisyon üretir, bireysel yıldız olmadan da.
          </li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki vaka çalışmasında <strong>BIST momentum analizi</strong>:
          Türk borsasında basit bir momentum stratejisi gerçekten işe yarıyor mu?
        </p>
      </article>
    </main>
  );
}
