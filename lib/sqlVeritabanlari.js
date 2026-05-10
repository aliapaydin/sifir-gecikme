export const VERITABANLARI = [
  {
    id: 'eticaret',
    isim: '🛒 E-Ticaret',
    aciklama: 'Müşteriler, ürünler, siparişler ve sipariş kalemleri',
    renk: '#1D9E75',
    bg: '#E1F5EE',
    renk_text: '#0F6E56',
    tablolar: [
      {
        isim: 'customers',
        aciklama: 'Müşteri kayıtları',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'name', tip: 'TEXT', ozellik: 'NOT NULL' },
          { isim: 'email', tip: 'TEXT', ozellik: 'UNIQUE' },
          { isim: 'city', tip: 'TEXT', ozellik: '' },
          { isim: 'age', tip: 'INTEGER', ozellik: '' },
          { isim: 'created_at', tip: 'DATE', ozellik: '' },
        ],
      },
      {
        isim: 'products',
        aciklama: 'Ürün kataloğu',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'name', tip: 'TEXT', ozellik: 'NOT NULL' },
          { isim: 'category', tip: 'TEXT', ozellik: '' },
          { isim: 'price', tip: 'REAL', ozellik: '' },
          { isim: 'stock', tip: 'INTEGER', ozellik: '' },
          { isim: 'brand', tip: 'TEXT', ozellik: '' },
        ],
      },
      {
        isim: 'orders',
        aciklama: 'Sipariş başlıkları',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'customer_id', tip: 'INTEGER', ozellik: 'FK → customers' },
          { isim: 'order_date', tip: 'DATE', ozellik: '' },
          { isim: 'status', tip: 'TEXT', ozellik: '' },
          { isim: 'total', tip: 'REAL', ozellik: '' },
          { isim: 'shipping_city', tip: 'TEXT', ozellik: '' },
        ],
      },
      {
        isim: 'order_items',
        aciklama: 'Sipariş kalemleri',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'order_id', tip: 'INTEGER', ozellik: 'FK → orders' },
          { isim: 'product_id', tip: 'INTEGER', ozellik: 'FK → products' },
          { isim: 'quantity', tip: 'INTEGER', ozellik: '' },
          { isim: 'unit_price', tip: 'REAL', ozellik: '' },
        ],
      },
    ],
    sql: `
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE, city TEXT, age INTEGER, created_at DATE);
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT, price REAL, stock INTEGER, brand TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date DATE, status TEXT, total REAL, shipping_city TEXT);
CREATE TABLE order_items (id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);
INSERT INTO customers VALUES (1,'Ali Apaydın','ali@email.com','İzmir',28,'2023-01-15');
INSERT INTO customers VALUES (2,'Ayşe Kaya','ayse@email.com','İstanbul',34,'2023-02-20');
INSERT INTO customers VALUES (3,'Mehmet Demir','mehmet@email.com','Ankara',25,'2023-03-10');
INSERT INTO customers VALUES (4,'Zeynep Yıldız','zeynep@email.com','İzmir',31,'2023-04-05');
INSERT INTO customers VALUES (5,'Can Özkan','can@email.com','İstanbul',29,'2023-05-12');
INSERT INTO customers VALUES (6,'Fatma Şahin','fatma@email.com','Bursa',27,'2023-06-18');
INSERT INTO customers VALUES (7,'Ahmet Çelik','ahmet@email.com','Ankara',35,'2023-07-22');
INSERT INTO customers VALUES (8,'Selin Arslan','selin@email.com','İzmir',26,'2023-08-30');
INSERT INTO customers VALUES (9,'Burak Koç','burak@email.com','İstanbul',32,'2023-09-14');
INSERT INTO customers VALUES (10,'Merve Doğan','merve@email.com','Antalya',24,'2023-10-01');
INSERT INTO products VALUES (1,'MacBook Pro 14','Elektronik',45999.99,15,'Apple');
INSERT INTO products VALUES (2,'iPhone 15','Elektronik',34999.99,42,'Apple');
INSERT INTO products VALUES (3,'Samsung TV 55"','Elektronik',18999.99,8,'Samsung');
INSERT INTO products VALUES (4,'Airpods Pro','Elektronik',5999.99,67,'Apple');
INSERT INTO products VALUES (5,'Dyson V15','Ev Aletleri',12999.99,12,'Dyson');
INSERT INTO products VALUES (6,'Nespresso Vertuo','Ev Aletleri',3499.99,28,'Nespresso');
INSERT INTO products VALUES (7,'Nike Air Max','Giyim',4299.99,89,'Nike');
INSERT INTO products VALUES (8,'Levis 501','Giyim',1899.99,134,'Levis');
INSERT INTO products VALUES (9,'Moleskine Defter','Kirtasiye',349.99,256,'Moleskine');
INSERT INTO products VALUES (10,'Logitech MX Keys','Elektronik',3799.99,43,'Logitech');
INSERT INTO products VALUES (11,'Sony WH-1000XM5','Elektronik',7999.99,31,'Sony');
INSERT INTO products VALUES (12,'Philips Hue Kit','Ev Aletleri',2799.99,19,'Philips');
INSERT INTO orders VALUES (1,1,'2024-01-10','Teslim Edildi',45999.99,'İzmir');
INSERT INTO orders VALUES (2,2,'2024-01-15','Teslim Edildi',40999.98,'İstanbul');
INSERT INTO orders VALUES (3,1,'2024-02-01','Teslim Edildi',5999.99,'İzmir');
INSERT INTO orders VALUES (4,3,'2024-02-10','Kargoda',18999.99,'Ankara');
INSERT INTO orders VALUES (5,4,'2024-02-20','Teslim Edildi',6199.98,'İzmir');
INSERT INTO orders VALUES (6,5,'2024-03-05','Iptal',34999.99,'İstanbul');
INSERT INTO orders VALUES (7,2,'2024-03-12','Teslim Edildi',12999.99,'İstanbul');
INSERT INTO orders VALUES (8,6,'2024-03-18','Kargoda',5399.98,'Bursa');
INSERT INTO orders VALUES (9,7,'2024-04-01','Teslim Edildi',11799.98,'Ankara');
INSERT INTO orders VALUES (10,8,'2024-04-10','Teslim Edildi',3799.99,'İzmir');
INSERT INTO orders VALUES (11,9,'2024-04-15','Teslim Edildi',7999.99,'İstanbul');
INSERT INTO orders VALUES (12,10,'2024-04-20','Kargoda',1899.99,'Antalya');
INSERT INTO orders VALUES (13,1,'2024-05-01','Teslim Edildi',3499.99,'İzmir');
INSERT INTO orders VALUES (14,3,'2024-05-10','Teslim Edildi',4299.99,'Ankara');
INSERT INTO orders VALUES (15,2,'2024-05-20','Teslim Edildi',2799.99,'İstanbul');
INSERT INTO order_items VALUES (1,1,1,1,45999.99);
INSERT INTO order_items VALUES (2,2,2,1,34999.99);
INSERT INTO order_items VALUES (3,2,4,1,5999.99);
INSERT INTO order_items VALUES (4,3,4,1,5999.99);
INSERT INTO order_items VALUES (5,4,3,1,18999.99);
INSERT INTO order_items VALUES (6,5,7,1,4299.99);
INSERT INTO order_items VALUES (7,5,9,5,349.99);
INSERT INTO order_items VALUES (8,6,2,1,34999.99);
INSERT INTO order_items VALUES (9,7,5,1,12999.99);
INSERT INTO order_items VALUES (10,8,7,1,4299.99);
INSERT INTO order_items VALUES (11,8,9,3,349.99);
INSERT INTO order_items VALUES (12,9,10,1,3799.99);
INSERT INTO order_items VALUES (13,9,11,1,7999.99);
INSERT INTO order_items VALUES (14,10,10,1,3799.99);
INSERT INTO order_items VALUES (15,11,11,1,7999.99);
INSERT INTO order_items VALUES (16,12,8,1,1899.99);
INSERT INTO order_items VALUES (17,13,6,1,3499.99);
INSERT INTO order_items VALUES (18,14,7,1,4299.99);
INSERT INTO order_items VALUES (19,15,12,1,2799.99);
`,
    ornekSorgular: [
      {
        baslik: 'Tüm müşteriler',
        sql: `SELECT * FROM customers ORDER BY name;`,
      },
      {
        baslik: 'Şehre göre müşteri sayısı',
        sql: `SELECT city, COUNT(*) as musteri_sayisi
FROM customers
GROUP BY city
ORDER BY musteri_sayisi DESC;`,
      },
      {
        baslik: 'En pahalı ürünler',
        sql: `SELECT name, category, price, brand
FROM products
ORDER BY price DESC
LIMIT 5;`,
      },
      {
        baslik: 'Kategori bazında ürün analizi',
        sql: `SELECT
  category,
  COUNT(*) as urun_sayisi,
  ROUND(AVG(price), 2) as ort_fiyat,
  MIN(price) as min_fiyat,
  MAX(price) as max_fiyat
FROM products
GROUP BY category
ORDER BY ort_fiyat DESC;`,
      },
      {
        baslik: 'Müşteri sipariş özeti',
        sql: `SELECT
  c.name,
  c.city,
  COUNT(o.id) as siparis_sayisi,
  ROUND(SUM(o.total), 2) as toplam_harcama
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name, c.city
ORDER BY toplam_harcama DESC;`,
      },
      {
        baslik: 'En çok satan ürünler',
        sql: `SELECT
  p.name,
  p.category,
  SUM(oi.quantity) as toplam_satis,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) as toplam_gelir
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status != 'Iptal'
GROUP BY p.id, p.name
ORDER BY toplam_satis DESC;`,
      },
      {
        baslik: 'Aylık sipariş trendi',
        sql: `SELECT
  strftime('%Y-%m', order_date) as ay,
  COUNT(*) as siparis_sayisi,
  ROUND(SUM(total), 2) as toplam_ciro
FROM orders
WHERE status != 'Iptal'
GROUP BY ay
ORDER BY ay;`,
      },
    ],
  },
  {
    id: 'ik',
    isim: '👥 İnsan Kaynakları',
    aciklama: 'Departmanlar, çalışanlar ve performans verileri',
    renk: '#7F77DD',
    bg: '#EEEDFE',
    renk_text: '#534AB7',
    tablolar: [
      {
        isim: 'departments',
        aciklama: 'Şirket departmanları',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'name', tip: 'TEXT', ozellik: 'NOT NULL' },
          { isim: 'budget', tip: 'REAL', ozellik: '' },
          { isim: 'location', tip: 'TEXT', ozellik: '' },
          { isim: 'manager_id', tip: 'INTEGER', ozellik: 'FK → employees' },
        ],
      },
      {
        isim: 'employees',
        aciklama: 'Çalışan kayıtları',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'name', tip: 'TEXT', ozellik: 'NOT NULL' },
          { isim: 'dept_id', tip: 'INTEGER', ozellik: 'FK → departments' },
          { isim: 'title', tip: 'TEXT', ozellik: '' },
          { isim: 'salary', tip: 'REAL', ozellik: '' },
          { isim: 'hire_date', tip: 'DATE', ozellik: '' },
          { isim: 'level', tip: 'TEXT', ozellik: '' },
        ],
      },
      {
        isim: 'performance',
        aciklama: 'Yıllık performans değerlendirmeleri',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'emp_id', tip: 'INTEGER', ozellik: 'FK → employees' },
          { isim: 'year', tip: 'INTEGER', ozellik: '' },
          { isim: 'score', tip: 'REAL', ozellik: '1.0 - 5.0' },
          { isim: 'bonus', tip: 'REAL', ozellik: '' },
          { isim: 'review', tip: 'TEXT', ozellik: '' },
        ],
      },
    ],
    sql: `
CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT NOT NULL, budget REAL, location TEXT, manager_id INTEGER);
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, dept_id INTEGER, title TEXT, salary REAL, hire_date DATE, level TEXT);
CREATE TABLE performance (id INTEGER PRIMARY KEY, emp_id INTEGER, year INTEGER, score REAL, bonus REAL, review TEXT);
INSERT INTO departments VALUES (1,'Muhendislik',2500000,'Istanbul',2);
INSERT INTO departments VALUES (2,'Veri Bilimi',1800000,'Istanbul',8);
INSERT INTO departments VALUES (3,'Urun Yonetimi',1200000,'Izmir',4);
INSERT INTO departments VALUES (4,'Pazarlama',900000,'Istanbul',9);
INSERT INTO departments VALUES (5,'Insan Kaynaklari',600000,'Ankara',10);
INSERT INTO employees VALUES (1,'Ali Apaydin',2,'Veri Bilimi Muh.',85000,'2020-03-01','Senior');
INSERT INTO employees VALUES (2,'Ayse Kaya',1,'Backend Gelistirici',92000,'2019-06-15','Senior');
INSERT INTO employees VALUES (3,'Mehmet Demir',2,'Veri Analisti',62000,'2022-01-10','Mid');
INSERT INTO employees VALUES (4,'Zeynep Yildiz',3,'Urun Yoneticisi',78000,'2021-04-20','Senior');
INSERT INTO employees VALUES (5,'Can Ozkan',1,'Frontend Gelistirici',75000,'2021-09-01','Mid');
INSERT INTO employees VALUES (6,'Fatma Sahin',4,'Pazarlama Uzmani',55000,'2023-02-14','Junior');
INSERT INTO employees VALUES (7,'Ahmet Celik',1,'DevOps Muh.',88000,'2020-11-30','Senior');
INSERT INTO employees VALUES (8,'Selin Arslan',2,'ML Muh.',95000,'2019-08-01','Senior');
INSERT INTO employees VALUES (9,'Burak Koc',4,'Buyume Analisti',58000,'2022-07-15','Mid');
INSERT INTO employees VALUES (10,'Merve Dogan',5,'IK Uzmani',52000,'2023-05-01','Junior');
INSERT INTO employees VALUES (11,'Ozan Yilmaz',1,'Mobil Gelistirici',70000,'2022-03-15','Mid');
INSERT INTO employees VALUES (12,'Deniz Akin',3,'UX Tasarimci',65000,'2021-10-01','Mid');
INSERT INTO performance VALUES (1,1,2023,4.5,12750,'Mukemmel proje liderligi ve teknik katki');
INSERT INTO performance VALUES (2,1,2022,4.2,10200,'Guclu teknik beceriler, takim calismasi iyi');
INSERT INTO performance VALUES (3,2,2023,4.8,17280,'Olaganustu performans, ekibin en iyisi');
INSERT INTO performance VALUES (4,2,2022,4.5,13800,'Kritik sistemleri basariyla teslim etti');
INSERT INTO performance VALUES (5,3,2023,3.8,5890,'Gelisme gosteriyor, daha fazla inisiyatif gerekli');
INSERT INTO performance VALUES (6,4,2023,4.6,11700,'Urun vizyonu ve yol haritasi mukemmel');
INSERT INTO performance VALUES (7,5,2023,4.1,9750,'Temiz kod, iyi iletisim');
INSERT INTO performance VALUES (8,6,2023,3.5,3850,'Beklentileri karsilıyor, gelisim devam ediyor');
INSERT INTO performance VALUES (9,7,2023,4.7,14960,'Altyapi donusumunu basariyla yonetti');
INSERT INTO performance VALUES (10,8,2023,4.9,18525,'Model performansinda rekor kirdi');
INSERT INTO performance VALUES (11,8,2022,4.7,14100,'Yeni ML pipeline mimarisi kurdu');
INSERT INTO performance VALUES (12,9,2023,4.0,7540,'Buyume metriklerinde yuzde 35 artis sagladi');
INSERT INTO performance VALUES (13,11,2023,3.9,7000,'Mobil uygulamayi yeniden tasarladi');
INSERT INTO performance VALUES (14,12,2023,4.3,8775,'Kullanici memnuniyetini yuzde 28 artirdi');
`,
    ornekSorgular: [
      {
        baslik: 'Tüm çalışanlar',
        sql: `SELECT e.name, e.title, d.name as dept, e.salary, e.level
FROM employees e
JOIN departments d ON e.dept_id = d.id
ORDER BY e.salary DESC;`,
      },
      {
        baslik: 'Departman maaş analizi',
        sql: `SELECT
  d.name as departman,
  COUNT(e.id) as calisan_sayisi,
  ROUND(AVG(e.salary), 0) as ort_maas,
  MIN(e.salary) as min_maas,
  MAX(e.salary) as max_maas
FROM departments d
JOIN employees e ON d.id = e.dept_id
GROUP BY d.id, d.name
ORDER BY ort_maas DESC;`,
      },
      {
        baslik: 'En yüksek performanslılar',
        sql: `SELECT
  e.name,
  e.title,
  d.name as dept,
  p.score,
  p.bonus,
  p.review
FROM performance p
JOIN employees e ON p.emp_id = e.id
JOIN departments d ON e.dept_id = d.id
WHERE p.year = 2023
ORDER BY p.score DESC
LIMIT 5;`,
      },
      {
        baslik: 'Seviyeye göre maaş dağılımı',
        sql: `SELECT
  level,
  COUNT(*) as kisi_sayisi,
  ROUND(AVG(salary), 0) as ort_maas,
  ROUND(MIN(salary), 0) as min_maas,
  ROUND(MAX(salary), 0) as max_maas
FROM employees
GROUP BY level
ORDER BY ort_maas DESC;`,
      },
      {
        baslik: 'Kıdem analizi',
        sql: `SELECT
  name,
  title,
  hire_date,
  CAST((julianday('2024-01-01') - julianday(hire_date)) / 365 AS INTEGER) as yil_kidem,
  salary
FROM employees
ORDER BY yil_kidem DESC;`,
      },
      {
        baslik: 'Performans vs maaş',
        sql: `SELECT
  e.name,
  e.salary,
  p.score as puan,
  p.bonus,
  ROUND(p.bonus / e.salary * 100, 1) as bonus_yuzdesi
FROM employees e
JOIN performance p ON e.id = p.emp_id
WHERE p.year = 2023
ORDER BY puan DESC;`,
      },
    ],
  },
  {
    id: 'spor',
    isim: '⚽ Spor Analitik',
    aciklama: 'Takımlar, oyuncular ve maç istatistikleri',
    renk: '#e8a04a',
    bg: '#FAEEDA',
    renk_text: '#854F0B',
    tablolar: [
      {
        isim: 'teams',
        aciklama: 'Futbol takımları',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'name', tip: 'TEXT', ozellik: 'NOT NULL' },
          { isim: 'city', tip: 'TEXT', ozellik: '' },
          { isim: 'founded', tip: 'INTEGER', ozellik: '' },
          { isim: 'stadium', tip: 'TEXT', ozellik: '' },
          { isim: 'capacity', tip: 'INTEGER', ozellik: '' },
        ],
      },
      {
        isim: 'players',
        aciklama: 'Oyuncu kadrosu',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'name', tip: 'TEXT', ozellik: 'NOT NULL' },
          { isim: 'team_id', tip: 'INTEGER', ozellik: 'FK → teams' },
          { isim: 'position', tip: 'TEXT', ozellik: '' },
          { isim: 'age', tip: 'INTEGER', ozellik: '' },
          { isim: 'nationality', tip: 'TEXT', ozellik: '' },
          { isim: 'market_value', tip: 'REAL', ozellik: 'Milyon €' },
        ],
      },
      {
        isim: 'matches',
        aciklama: 'Lig maçları',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'home_team_id', tip: 'INTEGER', ozellik: 'FK → teams' },
          { isim: 'away_team_id', tip: 'INTEGER', ozellik: 'FK → teams' },
          { isim: 'match_date', tip: 'DATE', ozellik: '' },
          { isim: 'home_score', tip: 'INTEGER', ozellik: '' },
          { isim: 'away_score', tip: 'INTEGER', ozellik: '' },
          { isim: 'attendance', tip: 'INTEGER', ozellik: '' },
        ],
      },
      {
        isim: 'stats',
        aciklama: 'Oyuncu maç istatistikleri',
        kolonlar: [
          { isim: 'id', tip: 'INTEGER', ozellik: 'PRIMARY KEY' },
          { isim: 'player_id', tip: 'INTEGER', ozellik: 'FK → players' },
          { isim: 'match_id', tip: 'INTEGER', ozellik: 'FK → matches' },
          { isim: 'goals', tip: 'INTEGER', ozellik: '' },
          { isim: 'assists', tip: 'INTEGER', ozellik: '' },
          { isim: 'minutes', tip: 'INTEGER', ozellik: '' },
          { isim: 'rating', tip: 'REAL', ozellik: '1.0 - 10.0' },
        ],
      },
    ],
    sql: `
CREATE TABLE teams (id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, founded INTEGER, stadium TEXT, capacity INTEGER);
CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT NOT NULL, team_id INTEGER, position TEXT, age INTEGER, nationality TEXT, market_value REAL);
CREATE TABLE matches (id INTEGER PRIMARY KEY, home_team_id INTEGER, away_team_id INTEGER, match_date DATE, home_score INTEGER, away_score INTEGER, attendance INTEGER);
CREATE TABLE stats (id INTEGER PRIMARY KEY, player_id INTEGER, match_id INTEGER, goals INTEGER DEFAULT 0, assists INTEGER DEFAULT 0, minutes INTEGER DEFAULT 90, rating REAL);
INSERT INTO teams VALUES (1,'Galatasaray','Istanbul',1905,'RAMS Park',52280);
INSERT INTO teams VALUES (2,'Fenerbahce','Istanbul',1907,'Ulker Stadium',50530);
INSERT INTO teams VALUES (3,'Besiktas','Istanbul',1903,'Tupras Stadyumu',42349);
INSERT INTO teams VALUES (4,'Trabzonspor','Trabzon',1967,'Papara Park',40790);
INSERT INTO teams VALUES (5,'Basaksehir','Istanbul',1990,'Basaksehir Fatih Terim',17864);
INSERT INTO players VALUES (1,'Icardi',1,'Forvet',31,'Arjantin',18.5);
INSERT INTO players VALUES (2,'Mertens',1,'Forvet',37,'Belcika',4.2);
INSERT INTO players VALUES (3,'Zaha',1,'Kanat',31,'Fildisi Sahili',12.0);
INSERT INTO players VALUES (4,'Batshuayi',2,'Forvet',33,'Belcika',6.5);
INSERT INTO players VALUES (5,'Fred',2,'Orta Saha',31,'Brezilya',14.0);
INSERT INTO players VALUES (6,'Szymanski',2,'Orta Saha',27,'Polonya',20.0);
INSERT INTO players VALUES (7,'Gedson Fernandes',3,'Orta Saha',25,'Portekiz',18.0);
INSERT INTO players VALUES (8,'Rashica',3,'Kanat',28,'Kosova',5.5);
INSERT INTO players VALUES (9,'Onuachu',4,'Forvet',30,'Nijerya',12.0);
INSERT INTO players VALUES (10,'Berat Ozdemir',4,'Orta Saha',26,'Turkiye',3.5);
INSERT INTO players VALUES (11,'Cham',5,'Kanat',27,'Gine-Bissau',4.0);
INSERT INTO players VALUES (12,'Aleksic',5,'Orta Saha',28,'Sirbistan',5.5);
INSERT INTO players VALUES (13,'Muslera',1,'Kaleci',38,'Uruguay',2.0);
INSERT INTO players VALUES (14,'Livakovic',2,'Kaleci',29,'Hirvatistan',14.0);
INSERT INTO matches VALUES (1,1,2,'2024-01-20',3,1,52280);
INSERT INTO matches VALUES (2,2,3,'2024-01-27',2,2,50530);
INSERT INTO matches VALUES (3,3,4,'2024-02-03',1,0,42349);
INSERT INTO matches VALUES (4,4,5,'2024-02-10',2,1,40790);
INSERT INTO matches VALUES (5,5,1,'2024-02-17',0,4,17864);
INSERT INTO matches VALUES (6,1,3,'2024-02-24',2,0,52280);
INSERT INTO matches VALUES (7,2,4,'2024-03-02',3,2,50530);
INSERT INTO matches VALUES (8,3,5,'2024-03-09',1,1,42349);
INSERT INTO matches VALUES (9,4,1,'2024-03-16',1,3,40790);
INSERT INTO matches VALUES (10,5,2,'2024-03-23',0,2,17864);
INSERT INTO matches VALUES (11,1,4,'2024-04-06',4,0,52280);
INSERT INTO matches VALUES (12,2,5,'2024-04-13',3,0,50530);
INSERT INTO matches VALUES (13,3,1,'2024-04-20',0,2,42349);
INSERT INTO matches VALUES (14,4,2,'2024-04-27',1,2,40790);
INSERT INTO matches VALUES (15,5,3,'2024-05-04',2,3,17864);
INSERT INTO stats VALUES (1,1,1,2,1,90,8.5);
INSERT INTO stats VALUES (2,3,1,1,0,90,7.2);
INSERT INTO stats VALUES (3,4,2,1,1,90,7.8);
INSERT INTO stats VALUES (4,7,2,0,1,90,7.0);
INSERT INTO stats VALUES (5,7,3,1,0,90,7.5);
INSERT INTO stats VALUES (6,9,4,1,1,90,7.8);
INSERT INTO stats VALUES (7,1,5,2,1,90,9.0);
INSERT INTO stats VALUES (8,3,5,1,1,88,8.2);
INSERT INTO stats VALUES (9,1,6,1,0,90,7.5);
INSERT INTO stats VALUES (10,7,6,0,0,73,6.5);
INSERT INTO stats VALUES (11,5,7,1,2,90,8.8);
INSERT INTO stats VALUES (12,6,7,2,0,90,8.5);
INSERT INTO stats VALUES (13,9,8,0,0,90,6.8);
INSERT INTO stats VALUES (14,11,8,1,0,82,7.2);
INSERT INTO stats VALUES (15,4,9,0,1,90,7.0);
INSERT INTO stats VALUES (16,1,9,2,0,90,8.8);
INSERT INTO stats VALUES (17,1,11,3,1,90,9.5);
INSERT INTO stats VALUES (18,2,11,1,0,78,7.5);
INSERT INTO stats VALUES (19,5,12,1,1,90,8.2);
INSERT INTO stats VALUES (20,6,12,2,0,90,8.8);
INSERT INTO stats VALUES (21,1,13,1,0,90,7.8);
INSERT INTO stats VALUES (22,3,13,1,1,90,8.0);
INSERT INTO stats VALUES (23,4,14,0,1,90,7.2);
INSERT INTO stats VALUES (24,5,14,2,0,90,8.5);
INSERT INTO stats VALUES (25,11,15,1,0,88,7.5);
INSERT INTO stats VALUES (26,7,15,0,1,90,7.8);
`,
    ornekSorgular: [
      {
        baslik: 'Tüm takımlar',
        sql: `SELECT name, city, founded, stadium, capacity
FROM teams
ORDER BY founded;`,
      },
      {
        baslik: 'Gol krallığı',
        sql: `SELECT
  p.name as oyuncu,
  t.name as takim,
  p.position as mevki,
  SUM(s.goals) as goller,
  SUM(s.assists) as asistler,
  SUM(s.goals) + SUM(s.assists) as gol_katkisi
FROM players p
JOIN stats s ON p.id = s.player_id
JOIN teams t ON p.team_id = t.id
GROUP BY p.id, p.name, t.name
HAVING goller > 0
ORDER BY goller DESC;`,
      },
      {
        baslik: 'Lig puan tablosu',
        sql: `SELECT
  t.name as takim,
  SUM(CASE WHEN m.home_team_id = t.id AND m.home_score > m.away_score THEN 3
           WHEN m.away_team_id = t.id AND m.away_score > m.home_score THEN 3
           WHEN m.home_score = m.away_score THEN 1
           ELSE 0 END) as puan,
  SUM(CASE WHEN m.home_team_id = t.id THEN m.home_score
           ELSE m.away_score END) as atilan_gol
FROM teams t
JOIN matches m ON t.id = m.home_team_id OR t.id = m.away_team_id
GROUP BY t.id, t.name
ORDER BY puan DESC, atilan_gol DESC;`,
      },
      {
        baslik: 'En değerli oyuncular',
        sql: `SELECT
  p.name,
  t.name as takim,
  p.position,
  p.age,
  p.nationality,
  p.market_value as deger_milyon_euro
FROM players p
JOIN teams t ON p.team_id = t.id
ORDER BY p.market_value DESC
LIMIT 10;`,
      },
      {
        baslik: 'Maç sonuçları',
        sql: `SELECT
  ht.name as ev_sahibi,
  m.home_score || ' - ' || m.away_score as skor,
  at.name as deplasman,
  m.match_date,
  m.attendance as seyirci
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN teams at ON m.away_team_id = at.id
ORDER BY m.match_date DESC;`,
      },
      {
        baslik: 'Ortalama maç rating',
        sql: `SELECT
  p.name,
  t.name as takim,
  COUNT(s.id) as mac_sayisi,
  ROUND(AVG(s.rating), 2) as ort_rating,
  ROUND(AVG(s.minutes), 0) as ort_dakika
FROM players p
JOIN stats s ON p.id = s.player_id
JOIN teams t ON p.team_id = t.id
GROUP BY p.id, p.name
HAVING mac_sayisi >= 3
ORDER BY ort_rating DESC;`,
      },
    ],
  },
];
