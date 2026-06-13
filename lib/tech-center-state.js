'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  calcFirmaValue, processDayStart, processDayEnd, placeOrder,
  upgradeStore, hireStaff, fireStaff, sellToCustomer, skipCustomer,
  setProductPrice, generateCustomers, calcDailyFixedCost,
  getUnlockedCategories, handleService, setServicePrice, sellSecondHand,
  delayCustomer, buildPC, sellBuiltPC, listBuiltPC,
  addToShoppingList, removeFromShoppingList, cancelOrder, takeLoan,
  acceptPCOrder, fulfillPCOrder,
} from './tech-center-engine';
import { STARTING_CASH } from './tech-center-data';
import { SYNC_READY_EVENT } from './userSync';

const STORAGE_KEY = 'tc_game_v2';

async function saveToDb(state) {
  try {
    await fetch('/api/v3/tc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    });
  } catch {}
}

async function loadFromDb() {
  try {
    const res = await fetch('/api/v3/tc');
    if (!res.ok) return null;
    const data = await res.json();
    return data.state || null;
  } catch {
    return null;
  }
}

function createInitialState(setupData) {
  const { companyName, city, logoId } = setupData;
  const unlockedCategories = getUnlockedCategories(1);
  return {
    // Meta
    gamePhase: 'day_new',
    currentDay: 1,
    companyName,
    city,
    logoId,

    // Finans
    cash: STARTING_CASH,

    // Mağaza
    storeLevel: 1,

    // Envanter & Fiyatlar
    inventory: {},
    prices: {},
    pendingOrders: [],

    // Müşteriler
    customersToday: [],
    skippedCount: 0,

    // Satışlar
    todaySales: [],
    allTimeSales: [],
    salesHistory: [],

    // Personel
    staff: [],

    // Olaylar
    activeEvents: [],
    newEventsToday: [],
    deliveredToday: [],
    newUnlocksToday: [],
    lastEventDays: {},

    // Unlock
    unlockedCategories,

    // Özet
    daySummary: null,
    wonOnDay: null,

    // Hizmet
    servicePrices: {},
    secondHandInventory: {},
    builtPCs: [],
    xp: 0,

    // Memnuniyet & Gecikme
    satisfaction: 75,
    delayedCustomers: [],

    // Alışveriş listesi
    shoppingList: [],

    // Krediler
    loans: [],
    cancelNotif: null,

    // PC Siparişleri
    pendingPCOrders: [],

    // Yorumlar
    reviews: [],
    pendingReviews: [],

    // Sistem Mailleri
    systemMails: [],

    // Errors (geçici)
    orderError: null,
    upgradeError: null,
    staffError: null,
    loanError: null,
  };
}

export function useTechCenterState() {
  const [state, setStateRaw] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const dbSaveTimer = useRef(null);
  const isLoggedIn = useRef(false);

  // Yükle — önce localStorage, sonra DB (eğer giriş yapılmışsa)
  useEffect(() => {
    async function load() {
      let localState = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) localState = JSON.parse(raw);
      } catch {}

      // Giriş durumunu kontrol et
      try {
        const res = await fetch('/api/v3/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            isLoggedIn.current = true;
            const dbState = await loadFromDb();
            if (dbState) {
              // DB'deki state'i al (daha güncel olabilir — farklı cihaz)
              setStateRaw(dbState);
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(dbState)); } catch {}
              setLoaded(true);
              return;
            }
          }
        }
      } catch {}

      if (localState) setStateRaw(localState);
      setLoaded(true);
    }
    load();

  }, []);

  // Kaydet — localStorage + DB (debounced 10s)
  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('TC State save error', e);
      }
      if (isLoggedIn.current) {
        if (dbSaveTimer.current) clearTimeout(dbSaveTimer.current);
        dbSaveTimer.current = setTimeout(() => saveToDb(next), 10000);
      }
      return next;
    });
  }, []);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const startGame = useCallback((setupData) => {
    const initial = createInitialState(setupData);
    // Gün 1 başını işle
    const afterDayStart = processDayStart(initial);
    setState(afterDayStart);
  }, [setState]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStateRaw(null);
  }, []);

  const startDay = useCallback(() => {
    setState(prev => {
      if (!prev || prev.gamePhase !== 'day_new') return prev;
      const freshCustomers = generateCustomers(prev);
      const arrivedDelayed = (prev.delayedCustomers || [])
        .filter(c => c.waitUntilDay <= prev.currentDay)
        .map(c => ({ ...c, dealt: false, result: undefined, counterOffer: undefined }));
      const stillDelayed = (prev.delayedCustomers || [])
        .filter(c => c.waitUntilDay > prev.currentDay);
      return {
        ...prev,
        gamePhase: 'day_active',
        customersToday: [...arrivedDelayed, ...freshCustomers],
        todaySales: [],
        skippedCount: 0,
        delayedCustomers: stillDelayed,
      };
    });
  }, [setState]);

  const closeDay = useCallback(() => {
    setStateRaw(prev => {
      if (!prev || prev.gamePhase !== 'day_active') return prev;
      const next = processDayEnd(prev);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      if (isLoggedIn.current) saveToDb(next);
      return next;
    });
  }, []);

  const nextDay = useCallback(() => {
    setStateRaw(prev => {
      if (!prev || prev.gamePhase !== 'day_summary') return prev;
      const next = processDayStart(prev);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      if (isLoggedIn.current) saveToDb(next);
      return next;
    });
  }, []);

  const orderProduct = useCallback((productId, quantity, supplier) => {
    setState(prev => placeOrder(prev, productId, quantity, supplier));
  }, [setState]);

  const setPriceAction = useCallback((productId, price) => {
    setState(prev => setProductPrice(prev, productId, price));
  }, [setState]);

  const upgradeStoreAction = useCallback(() => {
    setState(prev => upgradeStore(prev));
  }, [setState]);

  const hireStaffAction = useCallback((role) => {
    setState(prev => hireStaff(prev, role));
  }, [setState]);

  const fireStaffAction = useCallback((staffId) => {
    setState(prev => fireStaff(prev, staffId));
  }, [setState]);

  const sellAction = useCallback((customerId, listedPrice) => {
    setState(prev => sellToCustomer(prev, customerId, listedPrice));
  }, [setState]);

  const skipAction = useCallback((customerId) => {
    setState(prev => skipCustomer(prev, customerId));
  }, [setState]);

  const clearError = useCallback((errorKey) => {
    setState(prev => ({ ...prev, [errorKey]: null }));
  }, [setState]);

  const handleServiceAction = useCallback((customerId, accepted, counterPrice) => {
    setState(prev => handleService(prev, customerId, accepted, counterPrice));
  }, [setState]);

  const setServicePriceAction = useCallback((serviceId, price) => {
    setState(prev => setServicePrice(prev, serviceId, price));
  }, [setState]);

  const sellSecondHandAction = useCallback((productId, price) => {
    setState(prev => sellSecondHand(prev, productId, price));
  }, [setState]);

  const buildPCAction = useCallback((components, listPrice) => {
    setState(prev => buildPC(prev, components, listPrice));
  }, [setState]);

  const sellBuiltPCAction = useCallback((pcId, price) => {
    setState(prev => sellBuiltPC(prev, pcId, price));
  }, [setState]);

  const listBuiltPCAction = useCallback((pcId, price) => {
    setState(prev => listBuiltPC(prev, pcId, price));
  }, [setState]);

  const delayCustomerAction = useCallback((customerId, days) => {
    setState(prev => delayCustomer(prev, customerId, days));
  }, [setState]);

  const cancelOrderAction = useCallback((orderId) => {
    setState(prev => cancelOrder(prev, orderId));
  }, [setState]);

  const takeLoanAction = useCallback((amount) => {
    setState(prev => takeLoan(prev, amount));
  }, [setState]);

  const clearCancelNotif = useCallback(() => {
    setState(prev => ({ ...prev, cancelNotif: null }));
  }, [setState]);

  const addToShoppingListAction = useCallback((productId, quantity, customerId, customerName) => {
    setState(prev => addToShoppingList(prev, productId, quantity, customerId, customerName));
  }, [setState]);

  const removeFromShoppingListAction = useCallback((itemId) => {
    setState(prev => removeFromShoppingList(prev, itemId));
  }, [setState]);

  const acceptPCOrderAction = useCallback((customerId) => {
    setState(prev => acceptPCOrder(prev, customerId));
  }, [setState]);

  const fulfillPCOrderAction = useCallback((orderId, pcId) => {
    setState(prev => fulfillPCOrder(prev, orderId, pcId));
  }, [setState]);

  const clearLoanError = useCallback(() => {
    setState(prev => ({ ...prev, loanError: null }));
  }, [setState]);

  const markReviewsReadAction = useCallback(() => {
    setState(prev => ({ ...prev, reviews: (prev.reviews || []).map(r => ({ ...r, read: true })) }));
  }, [setState]);

  const markSystemMailReadAction = useCallback((mailId) => {
    setState(prev => ({
      ...prev,
      systemMails: (prev.systemMails || []).map(m => m.id === mailId ? { ...m, read: true } : m),
    }));
  }, [setState]);

  const firmaValue = state ? calcFirmaValue(state) : 0;
  const dailyFixedCost = state ? calcDailyFixedCost(state) : 0;

  return {
    state,
    loaded,
    firmaValue,
    dailyFixedCost,
    // Actions
    startGame,
    resetGame,
    startDay,
    closeDay,
    nextDay,
    orderProduct,
    setPriceAction,
    upgradeStoreAction,
    hireStaffAction,
    fireStaffAction,
    sellAction,
    skipAction,
    clearError,
    handleServiceAction,
    setServicePriceAction,
    sellSecondHandAction,
    delayCustomerAction,
    buildPCAction,
    sellBuiltPCAction,
    listBuiltPCAction,
    cancelOrderAction,
    takeLoanAction,
    clearCancelNotif,
    addToShoppingListAction,
    removeFromShoppingListAction,
    acceptPCOrderAction,
    fulfillPCOrderAction,
    clearLoanError,
    markReviewsReadAction,
    markSystemMailReadAction,
  };
}
