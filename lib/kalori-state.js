'use client';

import { useState, useEffect, useCallback } from 'react';

const initialProfile = {
  age: 30, gender: 'male', height: 175, weight: 75,
  goalWeight: 70, activityLevel: 'moderate', bmr: 1700, targetCalories: 2000,
};

function ls(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export function useKaloriState() {
  const [profile, setProfile] = useState(initialProfile);
  const [foods, setFoods] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [aiInsight, setAiInsight] = useState({ text: '', foodCount: 0, date: '' });
  const [mealInsights, setMealInsights] = useState({});
  const [waterLog, setWaterLog] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = ls('profile', initialProfile);
    if (p.goalWeight === undefined) p.goalWeight = initialProfile.goalWeight;
    setProfile(p);
    setFoods(ls('foods', []));
    setExercises(ls('exercises', []));
    setWeightHistory(ls('weightHistory', []));
    setGeminiApiKey(localStorage.getItem('geminiApiKey') || '');
    setAiInsight(ls('aiInsight', { text: '', foodCount: 0, date: '' }));
    setMealInsights(ls('mealInsights', {}));
    setWaterLog(ls('waterLog', []));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem('profile', JSON.stringify(profile)); }, [profile, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('foods', JSON.stringify(foods)); }, [foods, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('exercises', JSON.stringify(exercises)); }, [exercises, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('weightHistory', JSON.stringify(weightHistory)); }, [weightHistory, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('aiInsight', JSON.stringify(aiInsight)); }, [aiInsight, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('mealInsights', JSON.stringify(mealInsights)); }, [mealInsights, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem('waterLog', JSON.stringify(waterLog)); }, [waterLog, hydrated]);

  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterLog.find(w => w.date === today)?.glasses || 0;

  const addFood = useCallback((food) => {
    setFoods(prev => [{ ...food, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...prev]);
  }, []);

  const deleteFood = useCallback((id) => setFoods(prev => prev.filter(f => f.id !== id)), []);

  const addExercise = useCallback((exercise) => {
    setExercises(prev => [{ ...exercise, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...prev]);
  }, []);

  const deleteExercise = useCallback((id) => setExercises(prev => prev.filter(e => e.id !== id)), []);

  const addWeightRecord = useCallback((weight) => {
    const d = new Date().toISOString().split('T')[0];
    setWeightHistory(prev => {
      const filtered = prev.filter(w => w.date !== d);
      return [...filtered, { date: d, weight: parseFloat(weight) }]
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    setProfile(prev => ({ ...prev, weight: parseFloat(weight) }));
  }, []);

  const deleteWeightRecord = useCallback((date) => {
    setWeightHistory(prev => prev.filter(w => w.date !== date));
  }, []);

  const updateProfile = useCallback((newProfile) => setProfile(newProfile), []);

  const updateGeminiApiKey = useCallback((key) => {
    setGeminiApiKey(key);
    localStorage.setItem('geminiApiKey', key);
  }, []);

  const updateTodayWater = useCallback((glasses) => {
    const g = Math.max(0, Math.min(12, glasses));
    const d = new Date().toISOString().split('T')[0];
    setWaterLog(prev => [...prev.filter(w => w.date !== d), { date: d, glasses: g }]);
  }, []);

  const clearAllData = useCallback(() => {
    setFoods([]);
    setExercises([]);
    setWeightHistory([]);
    setWaterLog([]);
    setAiInsight({ text: '', foodCount: 0, date: '' });
    setMealInsights({});
  }, []);

  return {
    hydrated, profile, updateProfile,
    foods, addFood, deleteFood,
    exercises, addExercise, deleteExercise,
    weightHistory, addWeightRecord, deleteWeightRecord,
    geminiApiKey, updateGeminiApiKey,
    aiInsight, setAiInsight,
    mealInsights, setMealInsights,
    todayWater, updateTodayWater,
    clearAllData,
  };
}
