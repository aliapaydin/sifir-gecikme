// Tech Center - Oyun Engine (pure functions)

import {
  PRODUCTS, CUSTOMER_TYPES, CUSTOMER_NAMES, STORE_LEVELS,
  STORE_LEVEL_BONUS, EVENTS, UNLOCK_CATEGORIES, WIN_TARGET, STAFF_ROLES,
  CITIES, SERVICES, CORPORATE_COMPANIES,
} from './tech-center-data';

// ─── Yardımcı ────────────────────────────────────────────────────────────────

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// ─── Yorum Sistemi ────────────────────────────────────────────────────────────

const REVIEW_COMMENTS = {
  5: ['Mükemmel ürün, çok memnun kaldım!', 'Harika kalite, hızlı işlem!', 'Tam istediğim gibi, teşekkürler!', 'Kesinlikle tavsiye ederim.', 'Fiyat/performans çok iyi!'],
  4: ['Güzel ürün, genel olarak memnunum.', 'İyi kalite, fiyatı biraz yüksekti ama olur.', 'Beğendim, tavsiye ederim.', 'Gayet iyi, memnun kaldım.'],
  3: ['Eh işte, ortalama bir deneyimdi.', 'Fiyatı biraz fazla geldi açıkçası.', 'Ürün iyi ama biraz beklettiniz.', 'İdare eder, ortalama kalite.'],
  2: ['Fiyat çok yüksekti bence.', 'Beklediğim kadar iyi değildi.', 'Pahalı buldum, pişman oldum biraz.'],
  1: ['Çok pahalı! Başka yerde ucuz buldum.', 'Hiç memnun kalmadım, öneriyorum.'],
};

function generateReviewRating(margin) {
  if (margin <= 0.10) return Math.random() < 0.7 ? 5 : 4;
  if (margin <= 0.20) return Math.random() < 0.6 ? 5 : Math.random() < 0.7 ? 4 : 3;
  if (margin <= 0.35) return Math.random() < 0.4 ? 5 : Math.random() < 0.5 ? 4 : Math.random() < 0.7 ? 3 : 2;
  return Math.random() < 0.2 ? 4 : Math.random() < 0.4 ? 3 : Math.random() < 0.7 ? 2 : 1;
}

export function generatePendingReview(state, customerId, productId, productName, category, revenue, cogs) {
  const customer = (state.customersToday || []).find(c => c.id === customerId);
  if (!customer) return null;
  const margin = cogs > 0 ? (revenue - cogs) / cogs : 0.25;
  const rating = generateReviewRating(margin);
  const comments = REVIEW_COMMENTS[rating];
  return {
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,
    reviewDay: state.currentDay + 1,
    customerId,
    customerName: customer.name,
    customerAvatar: customer.avatar,
    customerType: customer.type,
    productId,
    productName,
    category,
    rating,
    comment: comments[Math.floor(Math.random() * comments.length)],
    read: false,
  };
}

function generatePendingReviewForPC(state, productName, revenue, cogs) {
  const margin = cogs > 0 ? (revenue - cogs) / cogs : 0.25;
  const rating = generateReviewRating(margin);
  const comments = REVIEW_COMMENTS[rating];
  const avatars = ['🧑‍💻', '👨‍💼', '👩‍💼', '🧑‍🎮', '👨‍🎨'];
  const names = ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Veli'];
  return {
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,
    reviewDay: state.currentDay + 1,
    customerId: null,
    customerName: names[Math.floor(Math.random() * names.length)],
    customerAvatar: avatars[Math.floor(Math.random() * avatars.length)],
    customerType: 'direct',
    productId: null,
    productName,
    category: 'pc_build',
    rating,
    comment: comments[Math.floor(Math.random() * comments.length)],
    read: false,
  };
}

// ─── Firma Değeri ─────────────────────────────────────────────────────────────

export function calcFirmaValue(state) {
  const levelBonus = STORE_LEVEL_BONUS[state.storeLevel - 1] || 0;
  let stockValue = 0;
  for (const [productId, qty] of Object.entries(state.inventory)) {
    const product = PRODUCTS[productId];
    if (product && qty > 0) {
      stockValue += product.buyPrice * qty;
    }
  }
  return state.cash + stockValue * 1.5 + levelBonus;
}

// ─── Fiyat Efektleri ─────────────────────────────────────────────────────────

export function getEffectiveBuyPrice(productId, activeEvents) {
  const product = PRODUCTS[productId];
  if (!product) return 0;
  let mult = 1;
  for (const ev of activeEvents) {
    if (ev.effect.category === product.category && ev.effect.buyPriceMult) {
      mult *= ev.effect.buyPriceMult;
    }
  }
  return Math.round(product.buyPrice * mult);
}

// ─── Kilit Açık Kategoriler ──────────────────────────────────────────────────

export function getUnlockedCategories(currentDay) {
  const cats = new Set();
  for (const [day, categories] of Object.entries(UNLOCK_CATEGORIES)) {
    if (currentDay >= parseInt(day)) {
      categories.forEach(c => cats.add(c));
    }
  }
  return Array.from(cats);
}

export function getNewUnlocks(currentDay) {
  return UNLOCK_CATEGORIES[currentDay] || [];
}

// ─── Müşteri Üretimi ─────────────────────────────────────────────────────────

export function generateCustomers(state) {
  const storeInfo = STORE_LEVELS[state.storeLevel - 1];
  const city = CITIES[state.city];

  // Baz müşteri sayısı
  let baseCount = randInt(storeInfo.customerRange[0], storeInfo.customerRange[1]);

  // Trafik çarpanı (şehir)
  baseCount = Math.round(baseCount * city.trafficMult);

  // Personel: kasiyer +3, pazarlama +%20
  const cashierCount = state.staff.filter(s => s.role === 'cashier').length;
  const marketingCount = state.staff.filter(s => s.role === 'marketing').length;
  baseCount += cashierCount * 3;
  baseCount = Math.round(baseCount * (1 + marketingCount * 0.2));

  // Event efektleri
  let countMult = 1;
  let countFixed = 0;
  for (const ev of state.activeEvents) {
    if (ev.effect.customerCountMult) countMult *= ev.effect.customerCountMult;
    if (ev.effect.customerCountFixed) countFixed += ev.effect.customerCountFixed;
  }
  baseCount = Math.max(0, Math.round(baseCount * countMult) + countFixed);

  const unlockedCats = getUnlockedCategories(state.currentDay);
  const customers = [];

  for (let i = 0; i < baseCount; i++) {
    customers.push(generateOneCustomer(state, unlockedCats));
  }

  // 12% chance of a pc_order customer if day >= 5
  if (state.currentDay >= 5 && Math.random() < 0.12) {
    customers.push(generatePCOrderCustomer(state));
  }

  return customers;
}

export function generateOneCustomer(state, unlockedCats) {
  // Müşteri tipi seç (weighted)
  const typeKeys = Object.keys(CUSTOMER_TYPES);
  let freqTotal = 0;

  // Event: customerTypeMult
  const typeMults = {};
  for (const ev of (state.activeEvents || [])) {
    if (ev.effect.customerTypeMult) {
      for (const [t, m] of Object.entries(ev.effect.customerTypeMult)) {
        typeMults[t] = (typeMults[t] || 1) * m;
      }
    }
  }

  const weights = typeKeys.map(k => {
    let base = CUSTOMER_TYPES[k].frequency;
    // Kurumsal siparişler gün 7'den sonra kademeli olarak artar
    if (k === 'corporate' && state.currentDay >= 7) {
      base = base * Math.min(4, 1 + (state.currentDay - 7) * 0.10);
    }
    return base * (typeMults[k] || 1);
  });
  freqTotal = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * freqTotal;
  let typeKey = typeKeys[typeKeys.length - 1];
  for (let i = 0; i < typeKeys.length; i++) {
    r -= weights[i];
    if (r <= 0) { typeKey = typeKeys[i]; break; }
  }

  // Servis müşterisi
  if (typeKey === 'service') {
    const serviceIds = Object.keys(SERVICES);
    const requestedServiceId = randPick(serviceIds);
    const service = SERVICES[requestedServiceId];
    const basePrice = service.avgPrice;
    const offeredPrice = Math.round(basePrice * randFloat(0.75, 1.25));

    // upgrade ise random bir ikinci el parça getirsin
    let oldPartId = null;
    if (requestedServiceId === 'upgrade') {
      const allProducts = Object.keys(PRODUCTS);
      oldPartId = randPick(allProducts);
    }

    return {
      id: `cust_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      name: randPick(CUSTOMER_NAMES),
      type: 'service',
      avatar: randPick(CUSTOMER_TYPES.service.avatars),
      budget: offeredPrice * 1.2,
      wantedProductId: null,
      quantity: 1,
      negotiationBuffer: CUSTOMER_TYPES.service.negotiationBuffer,
      requestedServiceId,
      offeredPrice,
      oldPartId,
      dealt: false,
      skipped: false,
    };
  }

  const ctype = CUSTOMER_TYPES[typeKey];
  const budget = randInt(ctype.budgetRange[0], ctype.budgetRange[1]);

  // İstediği kategori: unlockedCats ile kesişim
  const available = ctype.wantedCategories.filter(c => unlockedCats.includes(c));
  if (available.length === 0) {
    // fallback
    return generateOneCustomer({ ...state, activeEvents: [] }, unlockedCats);
  }
  const wantedCat = randPick(available);

  // O kategoriden bir ürün seç
  const catProducts = Object.values(PRODUCTS).filter(p =>
    p.category === wantedCat && (p.unlockDay || 1) <= state.currentDay
  );
  if (catProducts.length === 0) return generateOneCustomer(state, unlockedCats);

  // 70% chance: prefer in-stock products
  const inStockProds = catProducts.filter(p => (state.inventory[p.id] || 0) >= 1);
  let wantedProduct;
  if (inStockProds.length > 0 && Math.random() < 0.70) {
    wantedProduct = randPick(inStockProds);
  } else {
    wantedProduct = randPick(catProducts);
  }

  // Toplu alım (kurumsal) - gün 7'den sonra miktar ve bütçe artar
  let quantity = 1;
  let corporateCompany = null;
  if (typeKey === 'corporate') {
    const dayScale = state.currentDay >= 7 ? Math.min(4, Math.floor((state.currentDay - 7) / 4)) : 0;
    quantity = randInt((ctype.bulkMin || 2) + dayScale, (ctype.bulkMax || 4) + dayScale * 2);
    corporateCompany = CORPORATE_COMPANIES[Math.floor(Math.random() * CORPORATE_COMPANIES.length)];
  } else if (ctype.bulkMin && ctype.bulkMax) {
    quantity = randInt(ctype.bulkMin, ctype.bulkMax);
  }

  return {
    id: `cust_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    name: corporateCompany ? corporateCompany.name : randPick(CUSTOMER_NAMES),
    type: typeKey,
    avatar: corporateCompany ? corporateCompany.emoji : randPick(ctype.avatars),
    budget,
    wantedProductId: wantedProduct.id,
    quantity,
    negotiationBuffer: ctype.negotiationBuffer,
    corporateCompany,
    dealt: false,
    skipped: false,
  };
}

// ─── Satış Mantığı ───────────────────────────────────────────────────────────

// Returns: { success, negotiated, tooExpensive, counterOffer }
export function attemptSale(customer, listedPrice) {
  const total = listedPrice * customer.quantity;
  const budget = customer.budget;
  const maxAccept = budget * (1 + customer.negotiationBuffer);

  if (total <= budget) {
    return { success: true, negotiated: false, finalPrice: listedPrice };
  }
  if (total <= maxAccept) {
    // %70 ihtimalle kabul
    if (Math.random() < 0.7) {
      return { success: true, negotiated: true, finalPrice: listedPrice };
    } else {
      // Karşı teklif: bütçenin tam altında
      const counterPrice = Math.floor(budget / customer.quantity);
      return { success: false, negotiated: true, counterOffer: counterPrice, finalPrice: listedPrice };
    }
  }
  return { success: false, tooExpensive: true, finalPrice: listedPrice };
}

// ─── Gün Başı Hesaplama ──────────────────────────────────────────────────────

export function processDayStart(state) {
  let newState = { ...state };

  // Bekleyen siparişleri teslim et
  const arrivedOrders = [];
  const stillPending = [];
  for (const order of newState.pendingOrders) {
    if (order.deliveryDay <= newState.currentDay) {
      arrivedOrders.push(order);
    } else {
      stillPending.push(order);
    }
  }

  // Envantere ekle
  const newInventory = { ...newState.inventory };
  for (const order of arrivedOrders) {
    newInventory[order.productId] = (newInventory[order.productId] || 0) + order.quantity;
  }

  newState = {
    ...newState,
    inventory: newInventory,
    pendingOrders: stillPending,
    deliveredToday: arrivedOrders,
  };

  // Yeni olaylar üret (günde %20 ihtimalle)
  const newEvents = [];
  const activeEventIds = newState.activeEvents.map(e => e.id);
  const stillActive = newState.activeEvents.filter(e => e.endsOnDay > newState.currentDay);

  if (Math.random() < 0.20 && stillActive.length < 3) {
    const available = EVENTS.filter(e => {
      if (activeEventIds.includes(e.id)) return false;
      const lastDay = (newState.lastEventDays || {})[e.id] || 0;
      const cooldown = e.cooldownDays || 0;
      return (newState.currentDay - lastDay) >= cooldown;
    });
    if (available.length > 0) {
      const ev = randPick(available);
      const dur = randInt(ev.duration[0], ev.duration[1]);
      newEvents.push({ ...ev, endsOnDay: newState.currentDay + dur });
    }
  }

  const activeEvents = [...stillActive, ...newEvents];

  // lastEventDays güncelle
  const lastEventDays = { ...(newState.lastEventDays || {}) };
  for (const ev of newEvents) {
    lastEventDays[ev.id] = newState.currentDay;
  }

  // One-shot gider (tax_audit vb.)
  let cashAfterOneShot = newState.cash;
  for (const ev of newEvents) {
    if (ev.effect.oneShotExpense) {
      cashAfterOneShot -= ev.effect.oneShotExpense;
    }
  }

  // Yeni kategori unlock? — ayrıca tüm güncel verileri geriye dönük reconcile et
  // (eski save game'lerde eksik kalabilecek kategorileri düzelt)
  const currentUnlocked = newState.unlockedCategories || [];
  const allShouldBeUnlocked = getUnlockedCategories(newState.currentDay);
  const mergedUnlocked = Array.from(new Set([...currentUnlocked, ...allShouldBeUnlocked]));
  const freshUnlocks = mergedUnlocked.filter(c => !currentUnlocked.includes(c));

  // Bugün kilit açılan ürünler (product-level)
  const newProductUnlocksToday = Object.values(PRODUCTS)
    .filter(p => (p.unlockDay || 1) === newState.currentDay)
    .map(p => p.id);

  // Sistem mailleri üret
  const newSystemMails = [];
  if (newProductUnlocksToday.length > 0) {
    newSystemMails.push({
      id: `sysmail_unlock_${newState.currentDay}`,
      day: newState.currentDay,
      type: 'product_unlock',
      read: false,
      emoji: '🛍️',
      from: 'Tedarikçi Sistemi',
      subject: `${newProductUnlocksToday.length} yeni ürün kataloğa eklendi`,
      body: `Bugünden itibaren ${newProductUnlocksToday.length} yeni ürün siparişe açıldı. Pazar sekmesinden görüntüleyebilirsin.`,
      productIds: newProductUnlocksToday,
    });
  }

  // Auto-clean ordered shopping list items after 2 days
  const cleanedShoppingList = (newState.shoppingList || []).filter(item => {
    if (!item.ordered) return true;
    const orderedAt = item.orderedDay ?? item.addedDay ?? 0;
    return (newState.currentDay - orderedAt) < 2;
  });

  // Process pending reviews that are due
  const now = newState.currentDay;
  const dueReviews = (newState.pendingReviews || []).filter(r => r.reviewDay <= now);
  const stillPendingReviews = (newState.pendingReviews || []).filter(r => r.reviewDay > now);

  // Event sistem mailleri
  for (const ev of newEvents) {
    newSystemMails.push({
      id: `sysmail_event_${ev.id}_${newState.currentDay}`,
      day: newState.currentDay,
      type: 'event',
      read: false,
      emoji: ev.type === 'good' ? '📈' : ev.type === 'bad' ? '⚠️' : '📊',
      from: 'Pazar Haberleri',
      subject: ev.title,
      body: ev.desc,
      eventType: ev.type,
      endsOnDay: ev.endsOnDay,
    });
  }
  // Yorum bildirimi
  if (dueReviews.length > 0) {
    newSystemMails.push({
      id: `sysmail_reviews_${newState.currentDay}`,
      day: newState.currentDay,
      type: 'reviews',
      read: false,
      emoji: '⭐',
      from: 'Yorum Sistemi',
      subject: `${dueReviews.length} yeni müşteri yorumu geldi`,
      body: `Dünkü satışlardan ${dueReviews.length} yorum alındı. Yorumlar uygulamasından inceleyebilirsin.`,
      count: dueReviews.length,
    });
  }

  newState = {
    ...newState,
    activeEvents,
    lastEventDays,
    cash: cashAfterOneShot,
    unlockedCategories: mergedUnlocked,
    newUnlocksToday: freshUnlocks,
    newProductUnlocksToday,
    newEventsToday: newEvents,
    loans: newState.loans || [],
    shoppingList: cleanedShoppingList,
    delayedCustomers: newState.delayedCustomers || [],
    reviews: [...(newState.reviews || []), ...dueReviews],
    pendingReviews: stillPendingReviews,
    systemMails: [...(newState.systemMails || []), ...newSystemMails],
    gamePhase: 'day_new',
  };

  return newState;
}

// ─── Gün Sonu Hesaplama ──────────────────────────────────────────────────────

export function processDayEnd(state) {
  let newState = { ...state };

  // Aylık giderler (30 günde bir)
  let dailyExpense = 0;
  const city = CITIES[newState.city];

  // Kira (aylık → günlük)
  const dailyRent = city.rent / 30;
  dailyExpense += dailyRent;

  // Maaşlar (aylık → günlük)
  for (const staff of newState.staff) {
    const role = STAFF_ROLES[staff.role];
    if (role) dailyExpense += role.salary / 30;
  }

  let cashAfterExpenses = newState.cash - dailyExpense;

  // Kredi taksit ödemeleri
  let loanExpenseToday = 0;
  const updatedLoans = [];
  for (const loan of (newState.loans || [])) {
    if (loan.nextPaymentDay <= newState.currentDay) {
      loanExpenseToday += loan.dailyPayment;
      cashAfterExpenses -= loan.dailyPayment;
      const remaining = loan.remainingPayments - 1;
      if (remaining > 0) {
        updatedLoans.push({ ...loan, remainingPayments: remaining, nextPaymentDay: loan.nextPaymentDay + 1 });
      }
      // remaining === 0: kredi bitti, listeye ekleme
    } else {
      updatedLoans.push(loan);
    }
  }
  dailyExpense += loanExpenseToday; // özete yansıt

  // Satışa koyulmuş PC'leri otomatik sat
  const pcAutoSales = [];
  let updatedBuiltPCs = [...(newState.builtPCs || [])];
  let cashFromPCSales = 0;
  let pendingReviewsAfterPC = [...(newState.pendingReviews || [])];

  for (let i = 0; i < updatedBuiltPCs.length; i++) {
    const pc = updatedBuiltPCs[i];
    if (pc.listed && !pc.sold && pc.sellOnDay <= newState.currentDay) {
      const saleRecord = {
        id: `pcsale_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,
        day: newState.currentDay,
        productId: pc.id,
        productName: 'Toplama PC',
        brand: 'Özel',
        category: 'pc_build',
        quantity: 1,
        unitPrice: pc.listPrice,
        revenue: pc.listPrice,
        cogs: pc.totalCost,
        profit: pc.listPrice - pc.totalCost,
        customerType: 'direct',
        negotiated: false,
      };
      pcAutoSales.push(saleRecord);
      cashFromPCSales += pc.listPrice;
      updatedBuiltPCs[i] = { ...pc, sold: true, soldDay: newState.currentDay, soldPrice: pc.listPrice };
      if (Math.random() < 0.55) {
        const rev = generatePendingReviewForPC(newState, 'Toplama PC', pc.listPrice, pc.totalCost);
        if (rev) pendingReviewsAfterPC = [...pendingReviewsAfterPC, rev];
      }
    }
  }

  newState = {
    ...newState,
    builtPCs: updatedBuiltPCs,
    cash: newState.cash + cashFromPCSales,
    todaySales: [...(newState.todaySales || []), ...pcAutoSales],
    pendingReviews: pendingReviewsAfterPC,
  };

  // Gün özetini hesapla
  const todaySales = newState.todaySales || [];
  const todayRevenue = todaySales.reduce((s, t) => s + t.revenue, 0);
  const todayCOGS    = todaySales.reduce((s, t) => s + t.cogs, 0);
  const todayProfit  = todayRevenue - todayCOGS - dailyExpense;

  // Compute top products from today's sales
  const productTotals = {};
  for (const sale of todaySales) {
    const key = sale.productId;
    if (!productTotals[key]) {
      productTotals[key] = { productId: key, productName: sale.productName, revenue: 0, quantity: 0, profit: 0 };
    }
    productTotals[key].revenue += sale.revenue;
    productTotals[key].quantity += sale.quantity;
    productTotals[key].profit += sale.profit;
  }
  const topProducts = Object.values(productTotals)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Satış geçmişine ekle
  const salesHistory = [...(newState.salesHistory || []), {
    day: newState.currentDay,
    revenue: todayRevenue,
    cogs: todayCOGS,
    profit: todayProfit,
    expenses: dailyExpense,
    loanExpense: loanExpenseToday,
    customerCount: newState.customersToday?.length || 0,
    salesCount: todaySales.length,
    topProducts,
  }];

  // En fazla son 60 gün tut
  const trimmedHistory = salesHistory.slice(-60);

  // Toplam istatistik düzgün hesapla
  const allTimeSales = [...(newState.allTimeSales || []), ...todaySales];

  const nextDay = newState.currentDay + 1;
  const firmaValue = calcFirmaValue({ ...newState, cash: cashAfterExpenses });

  const daySummary = {
    day: newState.currentDay,
    revenue: todayRevenue,
    cogs: todayCOGS,
    expenses: dailyExpense,
    profit: todayProfit,
    customerCount: newState.customersToday?.length || 0,
    salesCount: todaySales.length,
    prevFirmaValue: calcFirmaValue(newState),
    newFirmaValue: firmaValue,
    topProducts,
    pcSales: pcAutoSales.map(s => ({ revenue: s.revenue, cogs: s.cogs, profit: s.profit })),
  };

  // Determine game phase
  let gamePhase;
  if (cashAfterExpenses < -100000) {
    gamePhase = 'game_over';
  } else if (firmaValue >= WIN_TARGET) {
    gamePhase = 'won';
  } else {
    gamePhase = 'day_summary';
  }

  newState = {
    ...newState,
    cash: cashAfterExpenses + cashFromPCSales,
    loans: updatedLoans,
    currentDay: nextDay,
    salesHistory: trimmedHistory,
    allTimeSales,
    todaySales: [],
    customersToday: [],
    skippedCount: 0,
    daySummary,
    gamePhase,
    wonOnDay: gamePhase === 'won' ? newState.currentDay : newState.wonOnDay,
  };

  return newState;
}

// ─── Sipariş Ver ──────────────────────────────────────────────────────────────

export function placeOrder(state, productId, quantity, supplier) {
  const product = PRODUCTS[productId];
  if (!product) return state;

  const effectiveBase = getEffectiveBuyPrice(productId, state.activeEvents);
  const isLocal = supplier === 'local';
  const unitPrice = isLocal
    ? Math.round(effectiveBase * 1.05)
    : effectiveBase;
  const totalCost = unitPrice * quantity;

  if (state.cash < totalCost) return { ...state, orderError: 'Yetersiz nakit!' };

  // Stok kontrolü
  const warehouseCapacity = calcWarehouseCapacity(state);
  const currentStock = Object.values(state.inventory).reduce((s, q) => s + q, 0);
  const pendingStock = state.pendingOrders.reduce((s, o) => s + o.quantity, 0);
  if (currentStock + pendingStock + quantity > warehouseCapacity) {
    return { ...state, orderError: 'Depo kapasitesi yetersiz!' };
  }

  // deliveryDelay efekti
  let extraDelay = 0;
  for (const ev of state.activeEvents) {
    if (ev.effect.deliveryDelay) extraDelay += ev.effect.deliveryDelay;
  }
  const deliveryDay = state.currentDay + (isLocal ? 1 : 2) + extraDelay;

  const newOrder = {
    id: `ord_${Date.now()}`,
    productId,
    quantity,
    unitPrice,
    totalCost,
    supplier,
    deliveryDay,
    orderedDay: state.currentDay,
  };

  // Mark matching shopping list items as ordered (track orderedDay)
  const updatedShoppingList = (state.shoppingList || []).map(item =>
    item.productId === productId && !item.ordered ? { ...item, ordered: true, orderedDay: state.currentDay } : item
  );

  return {
    ...state,
    cash: state.cash - totalCost,
    pendingOrders: [...state.pendingOrders, newOrder],
    shoppingList: updatedShoppingList,
    orderError: null,
  };
}

// ─── Sipariş İptal ────────────────────────────────────────────────────────────

export function cancelOrder(state, orderId) {
  const order = state.pendingOrders.find(o => o.id === orderId);
  if (!order) return state;

  const product = PRODUCTS[order.productId];

  // Bu ürünü bekleyen geciktirilmiş müşterileri bul
  const affectedDelayed = (state.delayedCustomers || []).filter(
    c => c.wantedProductId === order.productId
  );
  const stillDelayed = (state.delayedCustomers || []).filter(
    c => c.wantedProductId !== order.productId
  );

  // Her etkilenen müşteri için memnuniyet cezası
  const satPenalty = affectedDelayed.length * 7;

  // shopping list'te bu ürün varsa ordered=false'a çek
  const updatedShoppingList = (state.shoppingList || []).map(item =>
    item.productId === order.productId && item.ordered
      ? { ...item, ordered: false }
      : item
  );

  // Müşteri bildirimi metni
  const notifText = affectedDelayed.length > 0
    ? `⚠️ ${product?.name || 'Ürün'} siparişi iptal edildi. ${affectedDelayed.length} bekleyen müşteri etkilendi (-${satPenalty} memnuniyet).`
    : `Sipariş iptal edildi, ₺${Math.round(order.totalCost).toLocaleString('tr-TR')} iade edildi.`;

  return {
    ...state,
    cash: state.cash + order.totalCost,
    pendingOrders: state.pendingOrders.filter(o => o.id !== orderId),
    shoppingList: updatedShoppingList,
    delayedCustomers: stillDelayed,
    satisfaction: Math.max(0, (state.satisfaction || 75) - satPenalty),
    cancelNotif: notifText,
  };
}

// ─── Kredi Sistemi ───────────────────────────────────────────────────────────

const LOAN_INTEREST = 0.10; // %10 faiz
const LOAN_INSTALLMENTS = 5; // 5 günde ödeme

export const LOAN_OPTIONS = [
  { amount: 10_000,  label: '₺10.000' },
  { amount: 25_000,  label: '₺25.000' },
  { amount: 50_000,  label: '₺50.000' },
  { amount: 100_000, label: '₺100.000' },
];

export function takeLoan(state, amount) {
  const activeLoans = (state.loans || []).filter(l => l.remainingPayments > 0);
  if (activeLoans.length >= 4) {
    return { ...state, loanError: 'Maksimum 4 aktif kredi!' };
  }

  const totalRepayment = Math.round(amount * (1 + LOAN_INTEREST));
  const dailyPayment = Math.ceil(totalRepayment / LOAN_INSTALLMENTS);

  const loan = {
    id: `loan_${Date.now()}`,
    amount,
    totalRepayment,
    dailyPayment,
    remainingPayments: LOAN_INSTALLMENTS,
    nextPaymentDay: state.currentDay + 1,
    takenOnDay: state.currentDay,
  };

  return {
    ...state,
    cash: state.cash + amount,
    loans: [...(state.loans || []), loan],
    loanError: null,
  };
}

// ─── Alışveriş Listesi ───────────────────────────────────────────────────────

export function addToShoppingList(state, productId, quantity, customerId, customerName) {
  const existing = (state.shoppingList || []).find(
    i => i.productId === productId && !i.ordered
  );
  if (existing) return state; // zaten listede

  const item = {
    id: `sl_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    productId,
    quantity: quantity || 1,
    customerId: customerId || null,
    customerName: customerName || '',
    addedDay: state.currentDay,
    ordered: false,
  };
  return {
    ...state,
    shoppingList: [...(state.shoppingList || []), item],
  };
}

export function removeFromShoppingList(state, itemId) {
  return {
    ...state,
    shoppingList: (state.shoppingList || []).filter(i => i.id !== itemId),
  };
}

// ─── Stok Kapasitesi ─────────────────────────────────────────────────────────

export function calcWarehouseCapacity(state) {
  const base = STORE_LEVELS[state.storeLevel - 1].storage;
  const warehouseCount = state.staff.filter(s => s.role === 'warehouse').length;
  return base + warehouseCount * 20;
}

// ─── Fiyatlandırma ───────────────────────────────────────────────────────────

export function setProductPrice(state, productId, price) {
  return {
    ...state,
    prices: { ...state.prices, [productId]: price },
  };
}

// ─── Mağaza Yükselt ───────────────────────────────────────────────────────────

export function upgradeStore(state) {
  if (state.storeLevel >= 4) return state;
  const nextLevel = state.storeLevel + 1;
  const cost = STORE_LEVELS[nextLevel - 1].upgradeCost;
  if (state.cash < cost) return { ...state, upgradeError: 'Yetersiz nakit!' };
  return {
    ...state,
    cash: state.cash - cost,
    storeLevel: nextLevel,
    upgradeError: null,
  };
}

// ─── Personel İşe Al ─────────────────────────────────────────────────────────

export function hireStaff(state, role) {
  const roleInfo = STAFF_ROLES[role];
  if (!roleInfo) return state;
  const currentCount = state.staff.filter(s => s.role === role).length;
  if (currentCount >= roleInfo.maxCount) return { ...state, staffError: `Bu rolden en fazla ${roleInfo.maxCount} kişi çalışabilir.` };
  if (state.cash < roleInfo.salary) return { ...state, staffError: 'Yetersiz nakit!' };

  const newStaff = { id: `staff_${Date.now()}`, role, hiredDay: state.currentDay };
  return {
    ...state,
    cash: state.cash - roleInfo.salary,
    staff: [...state.staff, newStaff],
    staffError: null,
  };
}

export function fireStaff(state, staffId) {
  return {
    ...state,
    staff: state.staff.filter(s => s.id !== staffId),
    staffError: null,
  };
}

// ─── Satış Yap ───────────────────────────────────────────────────────────────

export function sellToCustomer(state, customerId, listedPrice) {
  const customer = state.customersToday.find(c => c.id === customerId);
  if (!customer || customer.dealt || customer.skipped) return state;

  const product = PRODUCTS[customer.wantedProductId];
  if (!product) return state;

  const inStock = (state.inventory[customer.wantedProductId] || 0);
  if (inStock < customer.quantity) return state;

  const result = attemptSale(customer, listedPrice);

  if (!result.success && result.tooExpensive) {
    // Müşteri gitti
    const updatedCustomers = state.customersToday.map(c =>
      c.id === customerId ? { ...c, dealt: true, result: 'too_expensive' } : c
    );
    return { ...state, customersToday: updatedCustomers };
  }

  if (!result.success && result.counterOffer !== undefined) {
    // Karşı teklif
    const updatedCustomers = state.customersToday.map(c =>
      c.id === customerId ? { ...c, counterOffer: result.counterOffer, result: 'counter' } : c
    );
    return { ...state, customersToday: updatedCustomers };
  }

  if (result.success) {
    const finalRevenue = result.finalPrice * customer.quantity;
    const cogs = product.buyPrice * customer.quantity;

    const newInventory = { ...state.inventory };
    newInventory[customer.wantedProductId] = inStock - customer.quantity;

    const saleRecord = {
      id: `sale_${Date.now()}`,
      day: state.currentDay,
      productId: customer.wantedProductId,
      productName: product.name,
      brand: product.brand,
      category: product.category,
      quantity: customer.quantity,
      unitPrice: result.finalPrice,
      revenue: finalRevenue,
      cogs,
      profit: finalRevenue - cogs,
      customerId,
      customerType: customer.type,
      negotiated: result.negotiated,
    };

    const updatedCustomers = state.customersToday.map(c =>
      c.id === customerId ? { ...c, dealt: true, result: 'sold' } : c
    );

    let pendingReviews = [...(state.pendingReviews || [])];
    if (Math.random() < 0.55) {
      const rev = generatePendingReview(state, customerId, customer.wantedProductId, `${product.brand} ${product.name}`, product.category, finalRevenue, cogs);
      if (rev) pendingReviews = [...pendingReviews, rev];
    }

    return {
      ...state,
      cash: state.cash + finalRevenue,
      inventory: newInventory,
      customersToday: updatedCustomers,
      todaySales: [...(state.todaySales || []), saleRecord],
      satisfaction: Math.min(100, (state.satisfaction || 75) + 3),
      pendingReviews,
    };
  }

  return state;
}

// ─── Müşteriyi Geç ───────────────────────────────────────────────────────────

export function skipCustomer(state, customerId) {
  const updatedCustomers = state.customersToday.map(c =>
    c.id === customerId ? { ...c, dealt: true, skipped: true, result: 'skipped' } : c
  );
  return {
    ...state,
    customersToday: updatedCustomers,
    skippedCount: (state.skippedCount || 0) + 1,
    satisfaction: Math.max(0, (state.satisfaction || 75) - 5),
  };
}

// ─── Günlük Sabit Gider Tahmini ──────────────────────────────────────────────

export function calcDailyFixedCost(state) {
  const city = CITIES[state.city];
  let total = city.rent / 30;
  for (const s of state.staff) {
    const role = STAFF_ROLES[s.role];
    if (role) total += role.salary / 30;
  }
  return Math.round(total);
}

// ─── Hizmet İşlemleri ────────────────────────────────────────────────────────

export function handleService(state, customerId, accepted, counterPrice) {
  const customer = state.customersToday.find(c => c.id === customerId);
  if (!customer || customer.dealt) return state;

  if (!accepted) {
    return {
      ...state,
      customersToday: state.customersToday.map(c =>
        c.id === customerId ? { ...c, dealt: true, result: 'skipped' } : c
      ),
    };
  }

  const price = counterPrice ?? customer.offeredPrice;
  const service = SERVICES[customer.requestedServiceId];

  // upgrade ise eski parçayı ikinci ele ekle
  let newSecondHand = { ...(state.secondHandInventory || {}) };
  if (customer.requestedServiceId === 'upgrade' && customer.oldPartId) {
    newSecondHand[customer.oldPartId] = (newSecondHand[customer.oldPartId] || 0) + 1;
  }

  const saleRecord = {
    id: `svc_${Date.now()}`,
    day: state.currentDay,
    productId: customer.requestedServiceId,
    productName: service?.label || 'Hizmet',
    brand: 'Servis',
    category: 'service',
    quantity: 1,
    unitPrice: price,
    revenue: price,
    cogs: 0,
    profit: price,
    customerId,
    customerType: 'service',
    negotiated: counterPrice !== undefined,
  };

  const xpGained = service?.xpReward || Math.round(price / 100);

  let pendingReviews = [...(state.pendingReviews || [])];
  if (Math.random() < 0.55) {
    const rev = generatePendingReview(state, customerId, customer.requestedServiceId, service?.label || 'Hizmet', 'service', price, 0);
    if (rev) pendingReviews = [...pendingReviews, rev];
  }

  return {
    ...state,
    cash: state.cash + price,
    xp: (state.xp || 0) + xpGained,
    secondHandInventory: newSecondHand,
    customersToday: state.customersToday.map(c =>
      c.id === customerId ? { ...c, dealt: true, result: 'sold' } : c
    ),
    todaySales: [...(state.todaySales || []), saleRecord],
    satisfaction: Math.min(100, (state.satisfaction || 75) + 2),
    pendingReviews,
  };
}

// ─── Müşteri Geciktirme ──────────────────────────────────────────────────────
export function delayCustomer(state, customerId, days) {
  const customer = state.customersToday.find(c => c.id === customerId);
  if (!customer || customer.dealt) return state;

  const acceptChance = days === 1 ? 0.90 : 0.80;
  const accepted = Math.random() < acceptChance;

  if (accepted) {
    const delayedCustomer = {
      ...customer,
      dealt: false,
      result: undefined,
      counterOffer: undefined,
      waitUntilDay: state.currentDay + days,
      delayedOnDay: state.currentDay,
      isReturning: true,
    };
    const updatedCustomers = state.customersToday.map(c =>
      c.id === customerId ? {
        ...c,
        dealt: true,
        result: 'delayed',
        delayedDays: days,
        delayedOnDay: state.currentDay,
        waitUntilDay: state.currentDay + days,
      } : c
    );
    return {
      ...state,
      customersToday: updatedCustomers,
      delayedCustomers: [...(state.delayedCustomers || []), delayedCustomer],
    };
  } else {
    const updatedCustomers = state.customersToday.map(c =>
      c.id === customerId ? { ...c, dealt: true, result: 'delay_rejected' } : c
    );
    return {
      ...state,
      satisfaction: Math.max(0, (state.satisfaction || 75) - 4),
      customersToday: updatedCustomers,
      skippedCount: (state.skippedCount || 0) + 1,
    };
  }
}

export function setServicePrice(state, serviceId, price) {
  return {
    ...state,
    servicePrices: { ...state.servicePrices, [serviceId]: price },
  };
}

export function sellSecondHand(state, productId, price) {
  const qty = (state.secondHandInventory || {})[productId] || 0;
  if (qty <= 0) return state;

  const product = PRODUCTS[productId];
  const newSecondHand = { ...state.secondHandInventory, [productId]: qty - 1 };

  const saleRecord = {
    id: `sh_${Date.now()}`,
    day: state.currentDay,
    productId,
    productName: product ? `[2.El] ${product.brand} ${product.name}` : '[2.El]',
    brand: product?.brand || '2.El',
    category: product?.category || 'secondhand',
    quantity: 1,
    unitPrice: price,
    revenue: price,
    cogs: 0,
    profit: price,
    customerType: 'secondhand',
  };

  return {
    ...state,
    cash: state.cash + price,
    secondHandInventory: newSecondHand,
    todaySales: [...(state.todaySales || []), saleRecord],
  };
}

// ─── PC Toplama ───────────────────────────────────────────────────────────────

export function buildPC(state, components, listPrice) {
  // components: { case: productId, cpu: productId, motherboard: productId, ram: productId, storage: productId, psu: productId, gpu: productId|null }
  const newInventory = { ...state.inventory };

  // Verify and deduct each component
  for (const [slot, productId] of Object.entries(components)) {
    if (!productId) continue;
    const qty = newInventory[productId] || 0;
    if (qty < 1) return { ...state, orderError: `Stokta yok: ${PRODUCTS[productId]?.name || productId}` };
    newInventory[productId] = qty - 1;
  }

  // Calculate component cost
  const totalCost = Object.values(components)
    .filter(Boolean)
    .reduce((sum, id) => sum + (PRODUCTS[id]?.buyPrice || 0), 0);

  const pc = {
    id: `pc_${Date.now()}`,
    builtDay: state.currentDay,
    components,
    totalCost,
    listPrice: listPrice || Math.round(totalCost * 1.30 + 2000),
    sold: false,
  };

  return {
    ...state,
    inventory: newInventory,
    builtPCs: [...(state.builtPCs || []), pc],
    orderError: null,
  };
}

// ─── PC Sipariş Müşterileri ───────────────────────────────────────────────────

const PC_ORDER_SPECS = [
  { label: 'Ofis PC', budget: 15000, specs: 'Intel Core i3, 8GB RAM, 256GB SSD', useCase: 'Ofis & belge işleme' },
  { label: 'Oyun PC', budget: 35000, specs: 'AMD Ryzen 5, 16GB RAM, RTX GPU, 512GB SSD', useCase: 'Oyun & streaming' },
  { label: 'Workstation', budget: 60000, specs: 'Intel Core i9, 32GB RAM, profesyonel GPU, 1TB SSD', useCase: 'Video düzenleme & 3D render' },
  { label: 'Öğrenci PC', budget: 10000, specs: 'Intel Core i5, 8GB RAM, 256GB SSD', useCase: 'Ders & araştırma' },
  { label: 'Medya PC', budget: 20000, specs: 'AMD Ryzen 5, 16GB RAM, 512GB SSD', useCase: 'Fotoğrafçılık & müzik üretim' },
];

export function generatePCOrderCustomer(state) {
  const spec = randPick(PC_ORDER_SPECS);
  const budget = Math.round(spec.budget * randFloat(0.85, 1.15));
  return {
    id: `cust_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: randPick(CUSTOMER_NAMES),
    type: 'pc_order',
    avatar: randPick(['🧑‍💻', '👨‍💼', '👩‍💼', '🧑‍🎮', '👨‍🎨']),
    budget,
    wantedProductId: null,
    quantity: 1,
    negotiationBuffer: 0.10,
    pcOrderSpec: spec,
    dealt: false,
    skipped: false,
  };
}

export function acceptPCOrder(state, customerId) {
  const customer = (state.customersToday || []).find(c => c.id === customerId);
  if (!customer || customer.dealt) return state;

  const order = {
    id: `pco_${Date.now()}`,
    customerId,
    customerName: customer.name,
    spec: customer.pcOrderSpec,
    budget: customer.budget,
    acceptedDay: state.currentDay,
    fulfilled: false,
    pcId: null,
  };

  return {
    ...state,
    customersToday: state.customersToday.map(c =>
      c.id === customerId ? { ...c, dealt: true, result: 'pc_order_accepted' } : c
    ),
    pendingPCOrders: [...(state.pendingPCOrders || []), order],
  };
}

export function fulfillPCOrder(state, orderId, pcId) {
  const order = (state.pendingPCOrders || []).find(o => o.id === orderId);
  const pc = (state.builtPCs || []).find(p => p.id === pcId && !p.sold);
  if (!order || !pc || order.fulfilled) return state;

  const salePrice = Math.min(order.budget, Math.round(pc.totalCost * 1.30 + 2000));

  const saleRecord = {
    id: `pcsale_${Date.now()}`,
    day: state.currentDay,
    productId: pcId,
    productName: `Toplama PC (${order.spec?.label || 'Özel'})`,
    brand: 'Özel',
    category: 'pc_build',
    quantity: 1,
    unitPrice: salePrice,
    revenue: salePrice,
    cogs: pc.totalCost,
    profit: salePrice - pc.totalCost,
    customerType: 'pc_order',
    negotiated: false,
    components: pc.components,
  };

  let pendingReviews = [...(state.pendingReviews || [])];
  if (Math.random() < 0.55) {
    const rev = generatePendingReview(state, order.customerId, pcId, `Toplama PC (${order.spec?.label || 'Özel'})`, 'pc_build', salePrice, pc.totalCost);
    if (rev) pendingReviews = [...pendingReviews, rev];
  }

  return {
    ...state,
    cash: state.cash + salePrice,
    builtPCs: state.builtPCs.map(p =>
      p.id === pcId ? { ...p, sold: true, soldDay: state.currentDay, soldPrice: salePrice } : p
    ),
    pendingPCOrders: (state.pendingPCOrders || []).map(o =>
      o.id === orderId ? { ...o, fulfilled: true, pcId, soldPrice: salePrice } : o
    ),
    todaySales: [...(state.todaySales || []), saleRecord],
    satisfaction: Math.min(100, (state.satisfaction || 75) + 5),
    pendingReviews,
  };
}

export function listBuiltPC(state, pcId, price) {
  const pc = (state.builtPCs || []).find(p => p.id === pcId);
  if (!pc || pc.sold || pc.listed) return state;
  const sellDelay = randInt(2, 3);
  return {
    ...state,
    builtPCs: state.builtPCs.map(p =>
      p.id === pcId ? { ...p, listed: true, listPrice: price, sellOnDay: state.currentDay + sellDelay } : p
    ),
  };
}

export function sellBuiltPC(state, pcId, price) {
  const pc = (state.builtPCs || []).find(p => p.id === pcId);
  if (!pc || pc.sold) return state;

  const saleRecord = {
    id: `pcsale_${Date.now()}`,
    day: state.currentDay,
    productId: pcId,
    productName: 'Toplama PC',
    brand: 'Özel',
    category: 'pc_build',
    quantity: 1,
    unitPrice: price,
    revenue: price,
    cogs: pc.totalCost,
    profit: price - pc.totalCost,
    customerType: 'direct',
    negotiated: false,
    components: pc.components,
  };

  let pendingReviews = [...(state.pendingReviews || [])];
  if (Math.random() < 0.55) {
    // For direct PC sales, use a synthetic customerId (no real customer)
    const rev = generatePendingReviewForPC(state, 'Toplama PC', price, pc.totalCost);
    if (rev) pendingReviews = [...pendingReviews, rev];
  }

  return {
    ...state,
    cash: state.cash + price,
    builtPCs: state.builtPCs.map(p => p.id === pcId ? { ...p, sold: true, soldDay: state.currentDay, soldPrice: price } : p),
    todaySales: [...(state.todaySales || []), saleRecord],
    satisfaction: Math.min(100, (state.satisfaction || 75) + 2),
    pendingReviews,
  };
}
