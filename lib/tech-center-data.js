// Tech Center - Oyun Veri Kataloğu

export const PRODUCTS = {
  // RAM
  'ram-kingston-8':  { id:'ram-kingston-8',  category:'ram', brand:'Kingston',   name:'8GB DDR4 2666MHz',         specs:'DDR4 / 2666MHz / 8GB',         buyPrice:380,   unlockDay:1,  icon:'🧩', ramType:'DDR4' },
  'ram-corsair-16':  { id:'ram-corsair-16',  category:'ram', brand:'Corsair',    name:'16GB DDR4 3200MHz',        specs:'DDR4 / 3200MHz / 16GB',        buyPrice:780,   unlockDay:1,  icon:'🧩', ramType:'DDR4' },
  'ram-crucial-16':  { id:'ram-crucial-16',  category:'ram', brand:'Crucial',    name:'16GB DDR5 5200MHz',        specs:'DDR5 / 5200MHz / 16GB',        buyPrice:980,   unlockDay:5,  icon:'🧩', ramType:'DDR5' },
  'ram-gskill-32':   { id:'ram-gskill-32',   category:'ram', brand:'G.Skill',    name:'32GB DDR5 6000MHz',        specs:'DDR5 / 6000MHz / 32GB',        buyPrice:2200,  unlockDay:10, icon:'🧩', ramType:'DDR5' },

  // SSD
  'ssd-kingston-480':{ id:'ssd-kingston-480',category:'ssd', brand:'Kingston',   name:'480GB SATA SSD',           specs:'SATA / 480GB',                 buyPrice:420,   unlockDay:1,  icon:'💿' },
  'ssd-crucial-1tb': { id:'ssd-crucial-1tb', category:'ssd', brand:'Crucial',    name:'1TB SATA SSD (BX500)',     specs:'SATA / 1TB',                   buyPrice:580,   unlockDay:1,  icon:'💿' },
  'ssd-samsung-1tb': { id:'ssd-samsung-1tb', category:'ssd', brand:'Samsung',    name:'1TB NVMe SSD (970 EVO)',   specs:'NVMe / 1TB / PCIe 3.0',        buyPrice:1150,  unlockDay:5,  icon:'💿' },
  'ssd-wd-2tb':      { id:'ssd-wd-2tb',      category:'ssd', brand:'WD',         name:'2TB NVMe SSD (SN850X)',    specs:'NVMe / 2TB / PCIe 4.0',        buyPrice:3300,  unlockDay:12, icon:'💿' },

  // Mouse
  'mouse-logitech-g102':      { id:'mouse-logitech-g102',      category:'mouse', brand:'Logitech',    name:'G102 Lightsync',        specs:'8000 DPI / Kablolu',           buyPrice:360,   unlockDay:1, icon:'🖱️' },
  'mouse-steelseries-rival':  { id:'mouse-steelseries-rival',  category:'mouse', brand:'SteelSeries', name:'Rival 3',               specs:'8500 DPI / Kablolu',           buyPrice:480,   unlockDay:1, icon:'🖱️' },
  'mouse-razer-deathadder':   { id:'mouse-razer-deathadder',   category:'mouse', brand:'Razer',       name:'DeathAdder V3',         specs:'30000 DPI / Kablolu',          buyPrice:980,   unlockDay:5, icon:'🖱️' },
  'mouse-logitech-superlight':{ id:'mouse-logitech-superlight',category:'mouse', brand:'Logitech',    name:'G Pro X Superlight 2',  specs:'32000 DPI / 60g / Kablosuz',   buyPrice:3400,  unlockDay:15,icon:'🖱️' },

  // Klavye
  'kb-redragon-k552':  { id:'kb-redragon-k552',  category:'keyboard', brand:'Redragon', name:'K552 Mekanik',       specs:'Red Switch / RGB / TKL',   buyPrice:480,  unlockDay:1, icon:'⌨️' },
  'kb-logitech-g413':  { id:'kb-logitech-g413',  category:'keyboard', brand:'Logitech', name:'G413 SE',            specs:'Mekanik / Alüminyum',      buyPrice:1250, unlockDay:1, icon:'⌨️' },
  'kb-razer-blackwidow':{ id:'kb-razer-blackwidow',category:'keyboard',brand:'Razer',   name:'BlackWidow V3',      specs:'Green Switch',             buyPrice:1900, unlockDay:8, icon:'⌨️' },
  'kb-corsair-k70':    { id:'kb-corsair-k70',    category:'keyboard', brand:'Corsair',  name:'K70 RGB MK.2',       specs:'Cherry MX Red',            buyPrice:2600, unlockDay:12,icon:'⌨️' },

  // CPU
  'cpu-amd-r5':   { id:'cpu-amd-r5',   category:'cpu', brand:'AMD',   name:'Ryzen 5 5600',    specs:'6C/12T / AM4',      buyPrice:4400,  unlockDay:1,  icon:'🔲', socket:'AM4',    tdp:65  },
  'cpu-intel-i3': { id:'cpu-intel-i3', category:'cpu', brand:'Intel', name:'Core i3-12100F',  specs:'4C/8T / LGA1700',   buyPrice:3600,  unlockDay:1,  icon:'🔲', socket:'LGA1700',tdp:60  },
  'cpu-intel-i5': { id:'cpu-intel-i5', category:'cpu', brand:'Intel', name:'Core i5-13400F',  specs:'10C/16T / LGA1700', buyPrice:6000,  unlockDay:5,  icon:'🔲', socket:'LGA1700',tdp:65  },
  'cpu-amd-r7':   { id:'cpu-amd-r7',   category:'cpu', brand:'AMD',   name:'Ryzen 7 7700X',   specs:'8C/16T / AM5',      buyPrice:11000, unlockDay:10, icon:'🔲', socket:'AM5',    tdp:105 },
  'cpu-intel-i7': { id:'cpu-intel-i7', category:'cpu', brand:'Intel', name:'Core i7-13700K',  specs:'16C/24T / LGA1700', buyPrice:12500, unlockDay:15, icon:'🔲', socket:'LGA1700',tdp:125 },

  // Anakart
  'mb-msi-b550':      { id:'mb-msi-b550',      category:'motherboard', brand:'MSI',      name:'B550M Pro-VDH',    specs:'AM4 / DDR4 / mATX',  buyPrice:3400,  unlockDay:1,  icon:'🟩', socket:'AM4',    ramType:'DDR4', formFactor:'mATX', supportedMB:['mATX'] },
  'mb-asus-b650':     { id:'mb-asus-b650',      category:'motherboard', brand:'ASUS',     name:'ROG Strix B650-F', specs:'AM5 / DDR5 / ATX',   buyPrice:8200,  unlockDay:10, icon:'🟩', socket:'AM5',    ramType:'DDR5', formFactor:'ATX',  supportedMB:['ATX','mATX'] },
  'mb-gigabyte-z790': { id:'mb-gigabyte-z790',  category:'motherboard', brand:'Gigabyte', name:'Z790 Aorus Elite', specs:'LGA1700 / DDR5 / ATX',buyPrice:9800, unlockDay:15, icon:'🟩', socket:'LGA1700',ramType:'DDR5', formFactor:'ATX',  supportedMB:['ATX','mATX'] },

  // PSU
  'psu-corsair-550': { id:'psu-corsair-550', category:'psu', brand:'Corsair',   name:'CV550 550W',      specs:'80+ Bronze',         buyPrice:1300, unlockDay:1,  icon:'🔌', wattage:550 },
  'psu-bequiet-650': { id:'psu-bequiet-650', category:'psu', brand:'be quiet!', name:'Pure Power 650W', specs:'80+ Gold',           buyPrice:2900, unlockDay:5,  icon:'🔌', wattage:650 },
  'psu-seasonic-750':{ id:'psu-seasonic-750',category:'psu', brand:'Seasonic',  name:'Focus GX-750',    specs:'80+ Gold / Modüler', buyPrice:4800, unlockDay:10, icon:'🔌', wattage:750 },

  // GPU
  'gpu-rx-6600':   { id:'gpu-rx-6600',   category:'gpu', brand:'AMD',    name:'RX 6600 8GB',         specs:'8GB GDDR6 / RDNA2',   buyPrice:6500,  unlockDay:1,  icon:'🎮', tdp:132 },
  'gpu-rtx-2060':  { id:'gpu-rtx-2060',  category:'gpu', brand:'NVIDIA', name:'RTX 2060 6GB',        specs:'6GB GDDR6 / Turing',  buyPrice:6800,  unlockDay:1,  icon:'🎮', tdp:160 },
  'gpu-rtx-3060':  { id:'gpu-rtx-3060',  category:'gpu', brand:'NVIDIA', name:'RTX 3060 12GB',       specs:'12GB GDDR6',          buyPrice:9800,  unlockDay:6,  icon:'🎮', tdp:170 },
  'gpu-rtx-4060':  { id:'gpu-rtx-4060',  category:'gpu', brand:'NVIDIA', name:'RTX 4060 8GB',        specs:'8GB GDDR6 / Ada',     buyPrice:11500, unlockDay:12, icon:'🎮', tdp:115 },
  'gpu-rx-7700xt': { id:'gpu-rx-7700xt', category:'gpu', brand:'AMD',    name:'RX 7700 XT 12GB',     specs:'12GB GDDR6 / RDNA3',  buyPrice:14500, unlockDay:15, icon:'🎮', tdp:245 },
  'gpu-rtx-4070s': { id:'gpu-rtx-4070s', category:'gpu', brand:'NVIDIA', name:'RTX 4070 Super 12GB', specs:'12GB GDDR6X / Ada',   buyPrice:22000, unlockDay:20, icon:'🎮', tdp:220 },
  'gpu-rtx-4080s': { id:'gpu-rtx-4080s', category:'gpu', brand:'NVIDIA', name:'RTX 4080 Super 16GB', specs:'16GB GDDR6X / Ada',   buyPrice:44000, unlockDay:28, icon:'🎮', tdp:320 },

  // Kasa
  'case-deepcool': { id:'case-deepcool', category:'case', brand:'Deepcool', name:'CC560 Mid Tower',  specs:'ATX / Mesh Front',       buyPrice:1150, unlockDay:1, icon:'🖥️', formFactor:'ATX', supportedMB:['ATX','mATX'], caseColor:'#1a1a2e', caseAccent:'#4a9eff' },
  'case-nzxt':     { id:'case-nzxt',     category:'case', brand:'NZXT',     name:'H510 Flow',        specs:'ATX / Tempered Glass',   buyPrice:2300, unlockDay:1, icon:'🖥️', formFactor:'ATX', supportedMB:['ATX','mATX'], caseColor:'#f5f5f5', caseAccent:'#333333' },
  'case-lianli':   { id:'case-lianli',   category:'case', brand:'Lian Li',  name:'PC-O11 Dynamic',   specs:'ATX / Dual Chamber',     buyPrice:5800, unlockDay:8, icon:'🖥️', formFactor:'ATX', supportedMB:['ATX','mATX'], caseColor:'#2a2a2a', caseAccent:'#ffffff' },

  // Monitör
  'mon-aoc-24': { id:'mon-aoc-24', category:'monitor', brand:'AOC',  name:'24G2SP 24" FHD',  specs:'24" / FHD / 165Hz / IPS',     buyPrice:3900,  unlockDay:1,  icon:'🖥️' },
  'mon-asus-27':{ id:'mon-asus-27',category:'monitor', brand:'ASUS', name:'TUF 27" QHD',     specs:'27" / QHD / 144Hz / IPS',     buyPrice:7500,  unlockDay:10, icon:'🖥️' },
  'mon-lg-32':  { id:'mon-lg-32',  category:'monitor', brand:'LG',   name:'32" 4K UHD',      specs:'32" / 4K / 144Hz / Nano IPS', buyPrice:18500, unlockDay:20, icon:'🖥️' },

  // Laptop
  'lap-asus-vivobook': { id:'lap-asus-vivobook', category:'laptop', brand:'ASUS',   name:'VivoBook 15',       specs:'i5-12500H / 8GB / 512GB', buyPrice:18500, unlockDay:15, icon:'💻' },
  'lap-lenovo-gaming': { id:'lap-lenovo-gaming', category:'laptop', brand:'Lenovo', name:'IdeaPad Gaming 3',  specs:'i5 / RTX3050 / 16GB',     buyPrice:23000, unlockDay:15, icon:'💻' },
  'lap-msi-katana':    { id:'lap-msi-katana',    category:'laptop', brand:'MSI',    name:'Katana 15',         specs:'i7 / RTX4060 / 16GB',     buyPrice:37000, unlockDay:25, icon:'💻' },
  'lap-asus-rog':      { id:'lap-asus-rog',      category:'laptop', brand:'ASUS',   name:'ROG Zephyrus G14',  specs:'R9 / RTX4070 / 32GB',     buyPrice:58000, unlockDay:35, icon:'💻' },

  // Kulaklık
  'hs-hyperx':      { id:'hs-hyperx',      category:'headset', brand:'HyperX',     name:'Cloud Stinger 2', specs:'Stereo / USB',         buyPrice:880,  unlockDay:5,  icon:'🎧' },
  'hs-razer':       { id:'hs-razer',       category:'headset', brand:'Razer',       name:'BlackShark V2',   specs:'7.1 Surround',         buyPrice:2300, unlockDay:12, icon:'🎧' },
  'hs-steelseries': { id:'hs-steelseries', category:'headset', brand:'SteelSeries', name:'Arctis 7+',       specs:'2.4GHz Kablosuz',      buyPrice:4700, unlockDay:25, icon:'🎧' },

  // Webcam
  'cam-logitech':{ id:'cam-logitech', category:'webcam', brand:'Logitech', name:'C920 HD Pro', specs:'1080p / 30fps',       buyPrice:1600, unlockDay:8,  icon:'📷' },
  'cam-razer':   { id:'cam-razer',    category:'webcam', brand:'Razer',    name:'Kiyo Pro',    specs:'1080p / 60fps / HDR', buyPrice:3400, unlockDay:18, icon:'📷' },

  // RAM (yeni)
  'ram-kingston-4':    { id:'ram-kingston-4',    category:'ram', brand:'Kingston', name:'4GB DDR4 2666MHz',              specs:'DDR4 / 2666MHz / 4GB',          buyPrice:180,  unlockDay:1,  icon:'🧩', ramType:'DDR4' },
  'ram-gskill-16-rgb': { id:'ram-gskill-16-rgb', category:'ram', brand:'G.Skill',  name:'16GB DDR4 3600MHz (Trident Z)', specs:'DDR4 / 3600MHz / 16GB',         buyPrice:1050, unlockDay:5,  icon:'🧩', ramType:'DDR4' },
  'ram-corsair-64':    { id:'ram-corsair-64',    category:'ram', brand:'Corsair',  name:'64GB DDR5 5600MHz Kit',         specs:'DDR5 / 5600MHz / 64GB',         buyPrice:6800, unlockDay:22, icon:'🧩', ramType:'DDR5' },

  // SSD (yeni)
  'ssd-kingston-240': { id:'ssd-kingston-240', category:'ssd', brand:'Kingston', name:'240GB SATA SSD',           specs:'SATA / 240GB',                buyPrice:270,  unlockDay:1,  icon:'💿' },
  'ssd-samsung-870':  { id:'ssd-samsung-870',  category:'ssd', brand:'Samsung',  name:'870 EVO 1TB SATA',         specs:'SATA / 1TB',                  buyPrice:720,  unlockDay:3,  icon:'💿' },
  'ssd-samsung-990':  { id:'ssd-samsung-990',  category:'ssd', brand:'Samsung',  name:'990 Pro 2TB NVMe',         specs:'NVMe / 2TB / PCIe 4.0',       buyPrice:5100, unlockDay:18, icon:'💿' },

  // GPU (yeni)
  'gpu-gtx-1660s':  { id:'gpu-gtx-1660s',  category:'gpu', brand:'NVIDIA', name:'GTX 1660 Super 6GB',   specs:'6GB GDDR6 / Turing', buyPrice:4800,  unlockDay:1,  icon:'🎮', tdp:125 },
  'gpu-rx-6700xt':  { id:'gpu-rx-6700xt',  category:'gpu', brand:'AMD',    name:'RX 6700 XT 12GB',      specs:'12GB GDDR6 / RDNA2', buyPrice:11500, unlockDay:10, icon:'🎮', tdp:230 },
  'gpu-rtx-4090':   { id:'gpu-rtx-4090',   category:'gpu', brand:'NVIDIA', name:'RTX 4090 24GB',        specs:'24GB GDDR6X / Ada',  buyPrice:68000, unlockDay:35, icon:'🎮', tdp:450 },

  // CPU (yeni)
  'cpu-amd-r3':     { id:'cpu-amd-r3',     category:'cpu', brand:'AMD',   name:'Ryzen 3 3200G',      specs:'4C/4T + Vega 8 / AM4',  buyPrice:1800,  unlockDay:1,  icon:'🔲', socket:'AM4',    tdp:65  },
  'cpu-amd-r5-5500':{ id:'cpu-amd-r5-5500',category:'cpu', brand:'AMD',   name:'Ryzen 5 5500',       specs:'6C/12T / AM4',           buyPrice:3100,  unlockDay:1,  icon:'🔲', socket:'AM4',    tdp:65  },
  'cpu-intel-i9':   { id:'cpu-intel-i9',   category:'cpu', brand:'Intel', name:'Core i9-13900K',     specs:'24C/32T / LGA1700',      buyPrice:17500, unlockDay:22, icon:'🔲', socket:'LGA1700',tdp:253 },

  // Anakart (yeni)
  'mb-asrock-a520': { id:'mb-asrock-a520', category:'motherboard', brand:'ASRock', name:'A520M-HDV',     specs:'AM4 / DDR4 / mATX',    buyPrice:2100, unlockDay:1,  icon:'🟩', socket:'AM4',    ramType:'DDR4', formFactor:'mATX', supportedMB:['mATX'] },
  'mb-msi-b760':    { id:'mb-msi-b760',    category:'motherboard', brand:'MSI',    name:'PRO B760M-P',   specs:'LGA1700 / DDR5 / mATX', buyPrice:4600, unlockDay:8,  icon:'🟩', socket:'LGA1700',ramType:'DDR5', formFactor:'mATX', supportedMB:['mATX'] },

  // Monitör (yeni)
  'mon-benq-24-144': { id:'mon-benq-24-144', category:'monitor', brand:'BenQ',    name:'ZOWIE XL2411K 24" FHD',   specs:'24" / FHD / 144Hz / TN',          buyPrice:4800,  unlockDay:5,  icon:'🖥️' },
  'mon-asus-24-240': { id:'mon-asus-24-240', category:'monitor', brand:'ASUS',    name:'TUF 24" FHD 240Hz',       specs:'24" / FHD / 240Hz / IPS',         buyPrice:7800,  unlockDay:12, icon:'🖥️' },
  'mon-samsung-34':  { id:'mon-samsung-34',  category:'monitor', brand:'Samsung', name:'S65UC 34" Ultrawide',     specs:'34" / QHD / 100Hz / VA Curved',   buyPrice:11500, unlockDay:18, icon:'🖥️' },

  // Laptop (yeni)
  'lap-hp-15':         { id:'lap-hp-15',         category:'laptop', brand:'HP',    name:'15s i5-1235U',      specs:'i5 / 8GB / 256GB SSD', buyPrice:15500, unlockDay:10, icon:'💻' },
  'lap-apple-macbook': { id:'lap-apple-macbook',  category:'laptop', brand:'Apple', name:'MacBook Air M2',    specs:'M2 / 8GB / 256GB',     buyPrice:41000, unlockDay:22, icon:'💻' },

  // Tablet
  'tab-lenovo-m10': { id:'tab-lenovo-m10', category:'tablet', brand:'Lenovo',  name:'Tab M10 Plus',       specs:'10.6" / 4GB / 128GB', buyPrice:4800,  unlockDay:5,  icon:'📱' },
  'tab-samsung-a8': { id:'tab-samsung-a8', category:'tablet', brand:'Samsung', name:'Galaxy Tab A8',      specs:'10.5" / 3GB / 32GB',  buyPrice:7200,  unlockDay:8,  icon:'📱' },
  'tab-ipad-air':   { id:'tab-ipad-air',   category:'tablet', brand:'Apple',   name:'iPad Air 5',         specs:'10.9" / M1 / 64GB',   buyPrice:15000, unlockDay:15, icon:'📱' },

  // Hoparlör
  'spk-logitech-z207':    { id:'spk-logitech-z207',    category:'speaker', brand:'Logitech', name:'Z207 2.0',         specs:'2.0 / Bluetooth / 10W',       buyPrice:580,  unlockDay:3,  icon:'🔊' },
  'spk-creative-pebble':  { id:'spk-creative-pebble',  category:'speaker', brand:'Creative', name:'Pebble Pro',       specs:'2.0 / USB-C / 8W',            buyPrice:920,  unlockDay:5,  icon:'🔊' },
  'spk-razer-leviathan':  { id:'spk-razer-leviathan',  category:'speaker', brand:'Razer',    name:'Leviathan V2',     specs:'2.1 / THX Spatial / 100W',    buyPrice:3800, unlockDay:18, icon:'🔊' },

  // Soğutma
  'cool-deepcool-ak400':  { id:'cool-deepcool-ak400',  category:'cooling', brand:'Deepcool', name:'AK400',            specs:'120mm / 220W TDP',            buyPrice:720,  unlockDay:1,  icon:'❄️' },
  'cool-noctua-nh15':     { id:'cool-noctua-nh15',     category:'cooling', brand:'Noctua',   name:'NH-D15',           specs:'2x140mm / 250W TDP',          buyPrice:2600, unlockDay:8,  icon:'❄️' },
  'cool-nzxt-kraken-240': { id:'cool-nzxt-kraken-240', category:'cooling', brand:'NZXT',     name:'Kraken X53 240mm', specs:'240mm / RGB / 300W TDP',      buyPrice:4900, unlockDay:15, icon:'❄️' },

  // Ağ Ürünleri
  'net-tp-ax55':  { id:'net-tp-ax55',  category:'networking', brand:'TP-Link', name:'Archer AX55',    specs:'AX3000 / WiFi 6 / 4-port',    buyPrice:2000, unlockDay:5, icon:'📡' },
  'net-switch-8': { id:'net-switch-8', category:'networking', brand:'TP-Link', name:'TL-SG108',       specs:'8-Port Gigabit Switch',        buyPrice:480,  unlockDay:3, icon:'📡' },

  // Harici Depo
  'ext-wd-1tb':      { id:'ext-wd-1tb',      category:'external_storage', brand:'WD',      name:'My Passport 1TB',       specs:'1TB / USB 3.0 / Taşınabilir', buyPrice:1000, unlockDay:3, icon:'💾' },
  'ext-seagate-2tb': { id:'ext-seagate-2tb', category:'external_storage', brand:'Seagate', name:'Backup Plus 2TB',       specs:'2TB / USB 3.0 / Taşınabilir', buyPrice:1450, unlockDay:5, icon:'💾' },

  // Yazıcı
  'print-epson-l3210':  { id:'print-epson-l3210',  category:'printer', brand:'Epson', name:'L3210',             specs:'Tanklı Yazıcı / Tarayıcı / Fotokopi', buyPrice:5400, unlockDay:8, icon:'🖨️' },
  'print-hp-laserjet':  { id:'print-hp-laserjet',  category:'printer', brand:'HP',    name:'LaserJet MFP M140we', specs:'Lazer / WiFi / Tarayıcı',           buyPrice:3000, unlockDay:5, icon:'🖨️' },
};

export const CATEGORY_LABELS = {
  ram:        'RAM',
  ssd:        'SSD',
  mouse:      'Mouse',
  keyboard:   'Klavye',
  cpu:        'İşlemci',
  motherboard:'Anakart',
  psu:        'Güç Kaynağı',
  gpu:        'Ekran Kartı',
  case:       'Kasa',
  monitor:    'Monitör',
  laptop:     'Laptop',
  headset:    'Kulaklık',
  webcam:     'Webcam',
  tablet:           'Tablet',
  speaker:          'Hoparlör',
  cooling:          'Soğutma',
  networking:       'Ağ Ürünleri',
  external_storage: 'Harici Depo',
  printer:          'Yazıcı',
};

export const CATEGORY_COLORS = {
  ram:        '#7F77DD',
  ssd:        '#0EA5E9',
  mouse:      '#E24B4A',
  keyboard:   '#e8a04a',
  cpu:        '#185FA5',
  motherboard:'#1D9E75',
  psu:        '#8B5CF6',
  gpu:        '#F59E0B',
  case:       '#6B7280',
  monitor:    '#10B981',
  laptop:     '#EC4899',
  headset:    '#F97316',
  webcam:     '#06B6D4',
  tablet:           '#E879F9',
  speaker:          '#14B8A6',
  cooling:          '#64748B',
  networking:       '#3B82F6',
  external_storage: '#D97706',
  printer:          '#6366F1',
};

export const CATEGORY_ICONS = {
  ram:'🧩', ssd:'💿', mouse:'🖱️', keyboard:'⌨️',
  cpu:'🔲', motherboard:'🟩', psu:'🔌', gpu:'🎮',
  case:'📦', monitor:'🖥️', laptop:'💻', headset:'🎧', webcam:'📷',
  tablet:'📱', speaker:'🔊', cooling:'❄️', networking:'📡', external_storage:'💾', printer:'🖨️',
};

export const UNLOCK_DAYS = [1];

export const UNLOCK_CATEGORIES = {
  1: ['ram','ssd','mouse','keyboard','cpu','motherboard','psu','gpu','case','monitor','laptop','headset','webcam','tablet','speaker','cooling','networking','external_storage','printer'],
};

export const CUSTOMER_TYPES = {
  student: {
    label:'Öğrenci',
    avatars:['👨‍🎓','👩‍🎓'],
    color:'#7F77DD',
    budgetRange:[300,8000],
    wantedCategories:['ram','ssd','mouse','keyboard','headset','tablet','speaker','cooling'],
    negotiationBuffer:0.12,
    frequency:0.30,
  },
  gamer: {
    label:'Gamer',
    avatars:['🎮','👾'],
    color:'#E24B4A',
    budgetRange:[2000,50000],
    wantedCategories:['gpu','monitor','ram','keyboard','mouse','headset','laptop','speaker','cooling'],
    negotiationBuffer:0.08,
    frequency:0.35,
  },
  professional: {
    label:'Profesyonel',
    avatars:['👨‍💼','👩‍💼'],
    color:'#185FA5',
    budgetRange:[5000,80000],
    wantedCategories:['cpu','ram','ssd','monitor','laptop','webcam','tablet','printer','external_storage'],
    negotiationBuffer:0.10,
    frequency:0.20,
  },
  corporate: {
    label:'Kurumsal',
    avatars:['🏢','👔'],
    color:'#1D9E75',
    budgetRange:[20000,200000],
    wantedCategories:['laptop','monitor','keyboard','mouse','webcam','printer','networking','external_storage'],
    negotiationBuffer:0.05,
    frequency:0.15,
    bulkMin:2,
    bulkMax:4,
  },
  service: {
    label:'Servis Müşterisi',
    avatars:['🔧','👨‍🔧','👩‍🔧'],
    color:'#10B981',
    budgetRange:[200,3000],
    wantedCategories:[],
    negotiationBuffer:0.15,
    frequency:0.10,
  },
};

export const CUSTOMER_NAMES = [
  'Ahmet K.','Mehmet Y.','Ayşe D.','Fatma Ş.','Ali R.',
  'Emre T.','Burak A.','Zeynep K.','Selin M.','Cem Ö.',
  'Deniz B.','Yusuf H.','Elif T.','Can S.','Mert A.',
  'Büşra Ç.','Kerem D.','Tuğba K.','Ozan Y.','Merve L.',
];

export const CITIES = {
  istanbul: { id:'istanbul', label:'İstanbul', rent:12000, trafficMult:1.5, emoji:'🌉' },
  ankara:   { id:'ankara',   label:'Ankara',   rent:8000,  trafficMult:1.0, emoji:'🏛️' },
  izmir:    { id:'izmir',    label:'İzmir',     rent:5500,  trafficMult:0.75,emoji:'⛵' },
};

export const STORE_LEVELS = [
  { level:1, label:'Küçük Dükkan', emoji:'🏪', customerRange:[6,10],  storage:50,  upgradeCost:0      },
  { level:2, label:'Orta Mağaza',  emoji:'🏬', customerRange:[12,18], storage:100, upgradeCost:75000  },
  { level:3, label:'Büyük Mağaza', emoji:'🏢', customerRange:[20,30], storage:150, upgradeCost:280000 },
  { level:4, label:'Megastore',    emoji:'🏭', customerRange:[35,50], storage:300, upgradeCost:700000 },
];

export const STORE_LEVEL_BONUS = [0, 50000, 200000, 600000];

export const STAFF_ROLES = {
  cashier:    { id:'cashier',    label:'Kasiyer',          emoji:'💁', salary:15000, desc:'+3 günlük müşteri kapasitesi',    maxCount:2 },
  technician: { id:'technician', label:'Teknisyen',         emoji:'🔧', salary:22000, desc:'İkinci el satın alma açılır',     maxCount:2 },
  warehouse:  { id:'warehouse',  label:'Depo Görevlisi',    emoji:'📦', salary:13000, desc:'+20 depo kapasitesi',             maxCount:2 },
  marketing:  { id:'marketing',  label:'Pazarlama',         emoji:'📣', salary:18000, desc:'%20 müşteri trafiği artışı',      maxCount:2 },
};

export const LOGOS = [
  { id:'chip',      emoji:'💾', label:'Chip',      bg:'#1D9E75' },
  { id:'monitor',   emoji:'🖥️', label:'Monitor',   bg:'#185FA5' },
  { id:'rocket',    emoji:'🚀', label:'Rocket',    bg:'#E24B4A' },
  { id:'gear',      emoji:'⚙️', label:'Gear',      bg:'#7F77DD' },
  { id:'lightning', emoji:'⚡', label:'Lightning', bg:'#e8a04a' },
  { id:'diamond',   emoji:'💎', label:'Diamond',   bg:'#0EA5E9' },
  { id:'cpu',       emoji:'🔲', label:'CPU',       bg:'#8B5CF6' },
  { id:'star',      emoji:'⭐', label:'Star',      bg:'#F59E0B' },
];

export const EVENTS = [
  { id:'gpu_shortage',    cooldownDays:14, type:'bad',   title:'⚠️ GPU Kıtlığı',        desc:'Tedarik zinciri sorunu! GPU alış fiyatları %35 arttı.',    duration:[4,7],  effect:{ category:'gpu',  buyPriceMult:1.35 } },
  { id:'school_season',   cooldownDays:10, type:'good',  title:'🎒 Okul Dönemi',         desc:'Öğrenci talebi patladı!',                                  duration:[5,10], effect:{ customerTypeMult:{ student:2.0 } } },
  { id:'crypto_crash',    cooldownDays:20, type:'good',  title:'📉 Kripto Çöküşü',       desc:'Madenciler GPU satıyor, fırsatçı ol!',                     duration:[3,6],  effect:{ category:'gpu',  buyPriceMult:0.72 } },
  { id:'black_friday',    cooldownDays:60, type:'good',  title:'🛍️ Black Friday',        desc:'Müşteri trafiği 2 katına çıktı!',                          duration:[3,5],  effect:{ customerCountMult:2.0 } },
  { id:'competitor_sale', cooldownDays:12, type:'bad',   title:'🏪 Rakip İndirim',       desc:'TechPlus büyük indirim başlattı, müşteri kaçabilir.',      duration:[3,5],  effect:{ customerCountMult:0.7 } },
  { id:'new_gpu_gen',     cooldownDays:30, type:'mixed', title:'🚀 Yeni Nesil GPU',      desc:'Eski GPU modelleri değer kaybetti.',                       duration:[7,14], effect:{ category:'gpu',  buyPriceMult:0.80 } },
  { id:'ram_drop',        cooldownDays:15, type:'good',  title:'💰 RAM Fiyatları Düştü', desc:'Global arz fazlası. RAM alış fiyatları geriledi.',         duration:[5,8],  effect:{ category:'ram',  buyPriceMult:0.75 } },
  { id:'gaming_tourney',  cooldownDays:8,  type:'good',  title:'🏆 Gaming Turnuvası',    desc:'E-spor turnuvası var. Gamer müşteriler geliyor!',          duration:[2,4],  effect:{ customerTypeMult:{ gamer:2.5 } } },
  { id:'power_outage',    cooldownDays:5,  type:'bad',   title:'⚡ Elektrik Kesintisi',  desc:'Bugün mağaza geç açıldı. 3 müşteri az gelecek.',           duration:[1,1],  effect:{ customerCountFixed:-3 } },
  { id:'tax_audit',       cooldownDays:20, type:'bad',   title:'🔍 Vergi Denetimi',      desc:'Bu ay ekstra ₺10.000 vergi ödedin.',                      duration:[1,1],  effect:{ oneShotExpense:10000 } },
  { id:'tech_fair',       cooldownDays:15, type:'good',  title:'🎪 Teknoloji Fuarı',      desc:'Şehirde tech fuarı var! Tüm müşteri tipleri artış gösteriyor.',     duration:[2,4],  effect:{ customerCountMult:1.6 } },
  { id:'winter_holiday',  cooldownDays:30, type:'good',  title:'🎁 Yılbaşı Sezonu',        desc:'Hediye alışverişi patladı! Müşteri trafiği zirveye çıktı.',          duration:[5,10], effect:{ customerCountMult:1.8 } },
  { id:'ssd_price_drop',  cooldownDays:18, type:'good',  title:'💿 SSD Fiyatları Düştü',  desc:'Flash depolama pazarında arz fazlası. SSD alış fiyatları geriledi.', duration:[5,8],  effect:{ category:'ssd', buyPriceMult:0.78 } },
  { id:'laptop_season',   cooldownDays:20, type:'good',  title:'💻 Laptop Sezonu',          desc:'Eğitim dönemi yaklaşıyor. Öğrenci ve kurumsal talep arttı.',         duration:[5,8],  effect:{ customerTypeMult:{ student:1.8, corporate:1.5 } } },
  { id:'office_opening',  cooldownDays:25, type:'good',  title:'🏢 Yeni Ofis Sezonu',       desc:'Birçok şirket ofis açıyor. Kurumsal siparişler geldi!',               duration:[3,5],  effect:{ customerTypeMult:{ corporate:3.0 } } },
  { id:'supply_delay',    cooldownDays:10, type:'bad',   title:'🚚 Tedarik Gecikmesi',      desc:'Lojistik sorunu! Tüm teslimatlar 1 gün gecikmeli.',                  duration:[3,5],  effect:{ deliveryDelay:1 } },
  { id:'influencer_post', cooldownDays:12, type:'good',  title:'📱 Influencer Postu',       desc:'Ünlü YouTuber dükkanı ziyaret etti. Gamer müşteriler akın ediyor!', duration:[2,3],  effect:{ customerTypeMult:{ gamer:3.0 } } },
  { id:'cpu_shortage',    cooldownDays:16, type:'bad',   title:'⚠️ CPU Kıtlığı',           desc:'Fabrika yangını! CPU alış fiyatları %30 arttı.',                     duration:[4,7],  effect:{ category:'cpu', buyPriceMult:1.30 } },
];

export const SERVICES = {
  format:   { id:'format',   label:'Format Atma',         emoji:'💻', avgPrice:800,   desc:'Windows/Linux kurulumu, sürücü yükleme',                          duration:60,  xpReward:15 },
  yazici:   { id:'yazici',   label:'Yazıcı Bakımı',       emoji:'🖨️', avgPrice:350,   desc:'Temizleme, kartuş, sürücü kurulumu',                              duration:30,  xpReward:8  },
  overclock:{ id:'overclock',label:'Overclock İşlemi',    emoji:'⚡', avgPrice:1200,  desc:'CPU/GPU hız aşırtma ve testleme',                                 duration:120, xpReward:25 },
  termal:   { id:'termal',   label:'Termal Macun',        emoji:'🧴', avgPrice:300,   desc:'CPU/GPU termal macun yenileme',                                   duration:45,  xpReward:6  },
  fan:      { id:'fan',      label:'Fan Temizliği',       emoji:'🌀', avgPrice:250,   desc:'Tüm fanların temizlenmesi ve test',                               duration:30,  xpReward:5  },
  upgrade:  { id:'upgrade',  label:'Parça Yükseltme',     emoji:'🔧', avgPrice:500,   desc:'Eski parça söküm, yeni parça takma. Eski parça ikinci ele geçer.',duration:90,  xpReward:12 },
  veri:     { id:'veri',     label:'Veri Kurtarma',       emoji:'💾', avgPrice:2500,  desc:'Arızalı diskten veri kurtarma',                                   duration:180, xpReward:40 },
  temizlik: { id:'temizlik', label:'Derin Temizlik',      emoji:'🧹', avgPrice:450,   desc:'Tüm bilgisayar bileşenlerini temizleme',                          duration:60,  xpReward:10 },
};

export const WIN_TARGET = 1_000_000_000;
export const STARTING_CASH = 50_000;

export const PC_BUILD_SLOTS = ['case','cpu','motherboard','ram','storage','psu','gpu']; // gpu is optional
