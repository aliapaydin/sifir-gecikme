'use client';
import { useState } from 'react';
import HeroCanvas from '../components/HeroCanvas';
import OgrenKarti from '../components/OgrenKarti';
import GununSorusu from '../components/GununSorusu';
import AboneOl from '../components/AboneOl';
import YolHaritasiKarti from '../components/YolHaritasiKarti';

function Icon({ type }) {
  const icons = {
    'linear-regression': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <circle cx="10" cy="22" r="2" fill="#1D9E75"/>
        <circle cx="15" cy="16" r="2" fill="#1D9E75"/>
        <circle cx="20" cy="12" r="2" fill="#1D9E75"/>
        <circle cx="24" cy="9" r="2" fill="#1D9E75"/>
        <line x1="8" y1="24" x2="26" y2="24" stroke="#0F6E56" strokeWidth="1.2"/>
        <line x1="8" y1="8" x2="8" y2="24" stroke="#0F6E56" strokeWidth="1.2"/>
        <line x1="9" y1="23" x2="25" y2="8" stroke="#1D9E75" strokeWidth="1.5"/>
      </svg>
    ),
    'izmir-kira': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
        <rect x="7" y="18" width="4" height="8" rx="1" fill="#e8a04a"/>
        <rect x="13" y="13" width="4" height="13" rx="1" fill="#e8a04a"/>
        <rect x="19" y="9" width="4" height="17" rx="1" fill="#BA7517"/>
        <line x1="7" y1="26.5" x2="24" y2="26.5" stroke="#854F0B" strokeWidth="1"/>
      </svg>
    ),
    'gradient-descent': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <path d="M7 9 Q16 26 25 9" stroke="#1D9E75" strokeWidth="2" fill="none"/>
        <circle cx="16" cy="23" r="3" fill="#7F77DD" stroke="#26215C" strokeWidth="1"/>
        <line x1="16" y1="8" x2="16" y2="20" stroke="#0F6E56" strokeWidth="1" strokeDasharray="2 2"/>
      </svg>
    ),
    'ab-test': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <rect x="7" y="11" width="8" height="14" rx="2" fill="#AFA9EC"/>
        <rect x="17" y="11" width="8" height="14" rx="2" fill="#7F77DD"/>
        <text x="11" y="21" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="600">A</text>
        <text x="21" y="21" fontSize="7" fill="#fff" textAnchor="middle" fontWeight="600">B</text>
      </svg>
    ),
    'kmeans': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <circle cx="11" cy="13" r="3.5" fill="#1D9E75" opacity=".35"/>
        <circle cx="21" cy="11" r="3.5" fill="#1D9E75" opacity=".35"/>
        <circle cx="16" cy="21" r="3.5" fill="#1D9E75" opacity=".35"/>
        <circle cx="11" cy="13" r="1.5" fill="#0F6E56"/>
        <circle cx="21" cy="11" r="1.5" fill="#0F6E56"/>
        <circle cx="16" cy="21" r="1.5" fill="#0F6E56"/>
        <line x1="11" y1="13" x2="21" y2="11" stroke="#1D9E75" strokeWidth="1" strokeDasharray="2 1"/>
        <line x1="21" y1="11" x2="16" y2="21" stroke="#1D9E75" strokeWidth="1" strokeDasharray="2 1"/>
        <line x1="16" y1="21" x2="11" y2="13" stroke="#1D9E75" strokeWidth="1" strokeDasharray="2 1"/>
      </svg>
    ),
    'ilk-90-gun': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
        <circle cx="16" cy="12" r="4.5" fill="#e8a04a" opacity=".6"/>
        <circle cx="16" cy="12" r="2.5" fill="#BA7517"/>
        <path d="M9 26 C9 21 23 21 23 26" stroke="#e8a04a" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    'confusion-matrix': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <rect x="8" y="9" width="7" height="7" rx="1" fill="#1D9E75" opacity=".9"/>
        <rect x="17" y="9" width="7" height="7" rx="1" fill="#9FE1CB"/>
        <rect x="8" y="18" width="7" height="7" rx="1" fill="#9FE1CB"/>
        <rect x="17" y="18" width="7" height="7" rx="1" fill="#1D9E75" opacity=".9"/>
        <text x="11.5" y="15" fontSize="5.5" fill="#fff" textAnchor="middle" fontWeight="600">TP</text>
        <text x="20.5" y="15" fontSize="5.5" fill="#0F6E56" textAnchor="middle" fontWeight="600">FP</text>
        <text x="11.5" y="24" fontSize="5.5" fill="#0F6E56" textAnchor="middle" fontWeight="600">FN</text>
        <text x="20.5" y="24" fontSize="5.5" fill="#fff" textAnchor="middle" fontWeight="600">TN</text>
      </svg>
    ),
    'pandas-7-sey': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <rect x="8" y="9" width="14" height="2" rx="1" fill="#AFA9EC"/>
        <rect x="8" y="14" width="10" height="2" rx="1" fill="#7F77DD"/>
        <rect x="8" y="19" width="12" height="2" rx="1" fill="#AFA9EC"/>
        <rect x="8" y="24" width="8" height="2" rx="1" fill="#7F77DD"/>
        <circle cx="24" cy="21" r="4" fill="none" stroke="#E24B4A" strokeWidth="1.5"/>
        <line x1="27" y1="24" x2="29" y2="26" stroke="#E24B4A" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'bias-variance': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
        <path d="M7 22 Q11 8 16 16 Q21 24 25 10" stroke="#1D9E75" strokeWidth="2" fill="none"/>
        <line x1="7" y1="24" x2="26" y2="24" stroke="#0F6E56" strokeWidth="1"/>
        <line x1="7" y1="7" x2="7" y2="24" stroke="#0F6E56" strokeWidth="1"/>
        <circle cx="16" cy="16" r="2.5" fill="#7F77DD"/>
      </svg>
    ),
    'feature-engineering': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <rect x="7" y="20" width="5" height="7" rx="1" fill="#AFA9EC"/>
        <rect x="14" y="15" width="5" height="12" rx="1" fill="#7F77DD"/>
        <rect x="21" y="10" width="5" height="17" rx="1" fill="#534AB7"/>
        <path d="M9.5 20 L9.5 16 L16.5 16 L16.5 12 L23.5 12 L23.5 9" stroke="#534AB7" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
        <circle cx="23.5" cy="9" r="1.5" fill="#534AB7"/>
      </svg>
    ),
    'sql-temelleri': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <ellipse cx="16" cy="10" rx="8" ry="3" fill="#7F77DD"/>
        <path d="M8 10 C8 10 8 14 16 14 C24 14 24 10 24 10" stroke="#534AB7" strokeWidth="1.2" fill="none"/>
        <path d="M8 14 C8 14 8 18 16 18 C24 18 24 14 24 14" stroke="#534AB7" strokeWidth="1.2" fill="none"/>
        <path d="M8 18 C8 18 8 22 16 22 C24 22 24 18 24 18" stroke="#534AB7" strokeWidth="1.2" fill="none"/>
        <ellipse cx="16" cy="22" rx="8" ry="3" fill="none" stroke="#534AB7" strokeWidth="1.2"/>
      </svg>
    ),
    'sample-size': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
    <rect x="7" y="22" width="4" height="5" rx="1" fill="#AFA9EC"/>
    <rect x="13" y="17" width="4" height="10" rx="1" fill="#7F77DD"/>
    <rect x="19" y="12" width="4" height="15" rx="1" fill="#534AB7"/>
    <line x1="7" y1="10" x2="25" y2="10" stroke="#534AB7" strokeWidth="1" strokeDasharray="2 2"/>
    <circle cx="9" cy="10" r="2" fill="#E24B4A"/>
    <circle cx="15" cy="10" r="2" fill="#E24B4A"/>
    <circle cx="21" cy="10" r="2" fill="#1D9E75"/>
  </svg>
),
'sinir-agi': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <circle cx="8" cy="16" r="2.5" fill="#5DCAA5"/>
    <circle cx="16" cy="10" r="2.5" fill="#7F77DD"/>
    <circle cx="16" cy="22" r="2.5" fill="#7F77DD"/>
    <circle cx="24" cy="16" r="2.5" fill="#e8a04a"/>
    <line x1="10" y1="15" x2="14" y2="11" stroke="#1D9E75" strokeWidth="1.2"/>
    <line x1="10" y1="17" x2="14" y2="21" stroke="#1D9E75" strokeWidth="1.2"/>
    <line x1="18" y1="11" x2="22" y2="15" stroke="#7F77DD" strokeWidth="1.2"/>
    <line x1="18" y1="21" x2="22" y2="17" stroke="#7F77DD" strokeWidth="1.2"/>
  </svg>
),
'bezier': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <circle cx="6" cy="24" r="2.5" fill="#1D9E75"/>
    <circle cx="12" cy="8" r="2.5" fill="#7F77DD"/>
    <circle cx="22" cy="8" r="2.5" fill="#7F77DD"/>
    <circle cx="27" cy="24" r="2.5" fill="#1D9E75"/>
    <path d="M6 24 C6 24 12 8 16 16 C20 24 27 24 27 24" stroke="#1D9E75" strokeWidth="2" fill="none"/>
    <line x1="6" y1="24" x2="12" y2="8" stroke="#e8e2d5" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="27" y1="24" x2="22" y2="8" stroke="#e8e2d5" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
),
'superlig': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <circle cx="16" cy="16" r="8" fill="none" stroke="#e8a04a" strokeWidth="1.5"/>
    <path d="M16 8 L16 24 M8 16 L24 16" stroke="#e8a04a" strokeWidth="1" strokeDasharray="2 2"/>
    <circle cx="16" cy="16" r="3" fill="#BA7517"/>
    <path d="M12 10 Q16 8 20 10 Q22 14 20 18 Q16 22 12 18 Q10 14 12 10Z" fill="none" stroke="#BA7517" strokeWidth="1" opacity="0.5"/>
  </svg>
),
'kariyer': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <rect x="10" y="8" width="12" height="8" rx="2" fill="none" stroke="#e8a04a" strokeWidth="1.5"/>
    <line x1="16" y1="16" x2="16" y2="20" stroke="#e8a04a" strokeWidth="1.5"/>
    <rect x="6" y="20" width="8" height="6" rx="1.5" fill="#e8a04a" opacity=".7"/>
    <rect x="18" y="20" width="8" height="6" rx="1.5" fill="#e8a04a" opacity=".7"/>
    <line x1="10" y1="23" x2="22" y2="23" stroke="#BA7517" strokeWidth="1"/>
  </svg>
),
'decision-tree': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <circle cx="16" cy="7" r="3" fill="#1D9E75"/>
    <circle cx="9"  cy="18" r="2.5" fill="#1D9E75" opacity=".8"/>
    <circle cx="23" cy="18" r="2.5" fill="#1D9E75" opacity=".8"/>
    <circle cx="6"  cy="27" r="2" fill="#9FE1CB"/>
    <circle cx="12" cy="27" r="2" fill="#9FE1CB"/>
    <circle cx="20" cy="27" r="2" fill="#9FE1CB"/>
    <circle cx="26" cy="27" r="2" fill="#9FE1CB"/>
    <line x1="16" y1="10" x2="9"  y2="16" stroke="#1D9E75" strokeWidth="1.2"/>
    <line x1="16" y1="10" x2="23" y2="16" stroke="#1D9E75" strokeWidth="1.2"/>
    <line x1="9"  y1="20" x2="6"  y2="25" stroke="#0F6E56" strokeWidth="1"/>
    <line x1="9"  y1="20" x2="12" y2="25" stroke="#0F6E56" strokeWidth="1"/>
    <line x1="23" y1="20" x2="20" y2="25" stroke="#0F6E56" strokeWidth="1"/>
    <line x1="23" y1="20" x2="26" y2="25" stroke="#0F6E56" strokeWidth="1"/>
  </svg>
),
'portfolyo': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <rect x="7" y="10" width="18" height="14" rx="2" fill="none" stroke="#e8a04a" strokeWidth="1.5"/>
    <line x1="7" y1="15" x2="25" y2="15" stroke="#e8a04a" strokeWidth="1"/>
    <rect x="10" y="18" width="5" height="3" rx="0.5" fill="#e8a04a" opacity=".6"/>
    <rect x="17" y="18" width="5" height="3" rx="0.5" fill="#BA7517" opacity=".8"/>
    <line x1="12" y1="10" x2="12" y2="7" stroke="#BA7517" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="20" y1="10" x2="20" y2="7" stroke="#BA7517" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
),
'mulakat-sql': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <rect x="7" y="8" width="18" height="16" rx="2" fill="none" stroke="#e8a04a" strokeWidth="1.5"/>
    <text x="10" y="17" fontSize="6" fill="#BA7517" fontFamily="monospace" fontWeight="700">SQL</text>
    <line x1="10" y1="20" x2="22" y2="20" stroke="#e8a04a" strokeWidth="1" opacity=".7"/>
    <circle cx="23" cy="22" r="4" fill="#BA7517" opacity=".15"/>
    <text x="21.5" y="24.5" fontSize="6" fill="#BA7517" fontWeight="700">?</text>
  </svg>
),
'linkedin': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <circle cx="12" cy="11" r="3" fill="#e8a04a" opacity=".7"/>
    <rect x="9" y="16" width="6" height="9" rx="1" fill="#e8a04a" opacity=".7"/>
    <rect x="17" y="14" width="6" height="11" rx="1" fill="#BA7517" opacity=".8"/>
    <circle cx="20" cy="14" r="2" fill="#BA7517" opacity=".5"/>
    <line x1="17" y1="17" x2="23" y2="17" stroke="#BA7517" strokeWidth="0.8" opacity=".5"/>
  </svg>
),
'cloud': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
    <ellipse cx="16" cy="19" rx="9" ry="5" fill="#7F77DD" opacity=".25"/>
    <ellipse cx="13" cy="17" rx="5" ry="4" fill="#7F77DD" opacity=".6"/>
    <ellipse cx="19" cy="18" rx="6" ry="4.5" fill="#7F77DD" opacity=".5"/>
    <ellipse cx="16" cy="15" rx="7" ry="5" fill="#534AB7" opacity=".7"/>
    <text x="12.5" y="17.5" fontSize="7" fill="#fff" fontWeight="700">☁</text>
  </svg>
),
'bayes': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <circle cx="16" cy="16" r="9" stroke="#1D9E75" strokeWidth="1.2" fill="none" opacity=".4"/>
    <circle cx="13" cy="14" r="5" fill="#1D9E75" opacity=".35"/>
    <circle cx="19" cy="14" r="5" fill="#0d3d2e" opacity=".35"/>
    <text x="9" y="27" fontSize="6.5" fill="#0F6E56" fontWeight="700">P(A|B)</text>
  </svg>
),
'clt': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <rect x="5" y="22" width="4" height="5" rx="1" fill="#1D9E75" opacity=".4"/>
    <rect x="10" y="17" width="4" height="10" rx="1" fill="#1D9E75" opacity=".6"/>
    <rect x="15" y="11" width="4" height="16" rx="1" fill="#1D9E75" opacity=".9"/>
    <rect x="20" y="17" width="4" height="10" rx="1" fill="#1D9E75" opacity=".6"/>
    <rect x="25" y="22" width="3" height="5" rx="1" fill="#1D9E75" opacity=".4"/>
    <path d="M5,21 Q10,10 16,9 Q22,10 27,21" stroke="#0d3d2e" strokeWidth="1.5" fill="none" opacity=".5"/>
  </svg>
),
'forest': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <polygon points="16,4 21,13 11,13" fill="#1D9E75" opacity=".9"/>
    <polygon points="10,8 14,15 6,15" fill="#1D9E75" opacity=".6"/>
    <polygon points="22,8 26,15 18,15" fill="#1D9E75" opacity=".6"/>
    <rect x="9" y="13" width="4" height="5" rx="1" fill="#0d3d2e" opacity=".5"/>
    <rect x="15" y="13" width="3" height="5" rx="1" fill="#0d3d2e" opacity=".7"/>
    <rect x="20" y="13" width="4" height="5" rx="1" fill="#0d3d2e" opacity=".5"/>
    <rect x="4" y="18" width="24" height="1.5" rx="0.75" fill="#0d3d2e" opacity=".2"/>
  </svg>
),
'dedektif': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <circle cx="14" cy="14" r="6" stroke="#1D9E75" strokeWidth="1.8" fill="none"/>
    <line x1="19" y1="19" x2="25" y2="25" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round"/>
    <line x1="11" y1="14" x2="17" y2="14" stroke="#1D9E75" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="14" y1="11" x2="14" y2="17" stroke="#1D9E75" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
),
'spotify': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <circle cx="16" cy="16" r="9" fill="none" stroke="#e8a04a" strokeWidth="1.5" opacity=".4"/>
    <path d="M10 13.5 C13 12 19 12.5 22 11" stroke="#e8a04a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 16.5 C13 15 18 15.5 21 14.5" stroke="#e8a04a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 19.5 C12.5 18.5 17 19 20 18" stroke="#BA7517" strokeWidth="1" strokeLinecap="round"/>
  </svg>
),
'anscombe': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <rect x="6" y="14" width="8" height="12" rx="1" fill="#1D9E75" opacity=".25"/>
    <rect x="18" y="8" width="8" height="18" rx="1" fill="#1D9E75" opacity=".25"/>
    <circle cx="8" cy="20" r="2" fill="#1D9E75"/>
    <circle cx="11" cy="17" r="2" fill="#1D9E75"/>
    <circle cx="9" cy="23" r="2" fill="#1D9E75"/>
    <circle cx="20" cy="11" r="2" fill="#7F77DD"/>
    <circle cx="23" cy="14" r="2" fill="#7F77DD"/>
    <circle cx="22" cy="18" r="2" fill="#7F77DD"/>
    <circle cx="25" cy="10" r="2" fill="#e8a04a"/>
    <line x1="6" y1="26" x2="26" y2="8" stroke="#1D9E75" strokeWidth="1" strokeDasharray="3 2" opacity=".5"/>
  </svg>
),
'deprem': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <polyline points="4,18 8,18 10,12 13,22 16,10 19,20 22,16 25,16 28,16" stroke="#e8a04a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="10" r="2" fill="#BA7517" opacity=".8"/>
  </svg>
),
'csv': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
    <rect x="7" y="8" width="18" height="16" rx="2" fill="none" stroke="#7F77DD" strokeWidth="1.5"/>
    <line x1="7" y1="13" x2="25" y2="13" stroke="#7F77DD" strokeWidth="1"/>
    <line x1="7" y1="18" x2="25" y2="18" stroke="#7F77DD" strokeWidth="1"/>
    <line x1="13" y1="8" x2="13" y2="24" stroke="#7F77DD" strokeWidth="1"/>
    <rect x="8" y="9" width="4" height="3" rx="0.5" fill="#7F77DD" opacity=".35"/>
    <rect x="14" y="14" width="5" height="3" rx="0.5" fill="#AFA9EC"/>
    <rect x="14" y="19" width="8" height="3" rx="0.5" fill="#AFA9EC"/>
  </svg>
),
'renk': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#F5F0FF"/>
    <circle cx="12" cy="14" r="5" fill="#E15759" opacity=".85"/>
    <circle cx="20" cy="14" r="5" fill="#4E79A7" opacity=".85"/>
    <circle cx="16" cy="20" r="5" fill="#59A14F" opacity=".85"/>
  </svg>
),
'veri-setleri': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
    <ellipse cx="16" cy="10" rx="9" ry="3.5" fill="#7F77DD" opacity=".8"/>
    <path d="M7 10 Q7 14 16 14 Q25 14 25 10" stroke="#7F77DD" strokeWidth="1.2" fill="none"/>
    <path d="M7 14 Q7 18 16 18 Q25 18 25 14" stroke="#7F77DD" strokeWidth="1.2" fill="none"/>
    <path d="M7 18 Q7 22 16 22 Q25 22 25 18" stroke="#534AB7" strokeWidth="1.2" fill="none"/>
    <ellipse cx="16" cy="22" rx="9" ry="3.5" fill="#534AB7" opacity=".3"/>
  </svg>
),
'zaman-serisi': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <polyline points="5,24 9,20 13,22 17,13 21,16 27,8" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
    <line x1="5" y1="26" x2="27" y2="26" stroke="#0F6E56" strokeWidth="1" opacity=".4"/>
    <circle cx="27" cy="8" r="2.5" fill="#1D9E75"/>
  </svg>
),
'mulakat': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
    <rect x="12" y="6" width="8" height="12" rx="4" fill="#7F77DD" opacity=".85"/>
    <path d="M7 17 Q7 24 16 24 Q25 24 25 17" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="16" y1="24" x2="16" y2="28" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="12" y1="28" x2="20" y2="28" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
),
'churn': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <circle cx="12" cy="13" r="4" fill="#e8a04a" opacity=".8"/>
    <circle cx="22" cy="11" r="3" fill="#e8a04a" opacity=".5"/>
    <path d="M6 22 Q12 18 18 22 Q22 19 28 22" fill="none" stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 15 L25 12 M25 12 L22 12 M25 12 L25 15" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
),
'kredi-shap': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
    <rect x="6" y="20" width="4" height="6" rx="1" fill="#e8a04a" opacity=".5"/>
    <rect x="12" y="15" width="4" height="11" rx="1" fill="#e8a04a" opacity=".7"/>
    <rect x="18" y="10" width="4" height="16" rx="1" fill="#e8a04a"/>
    <rect x="24" y="14" width="4" height="12" rx="1" fill="#BA7517" opacity=".6"/>
    <polyline points="8,19 14,14 20,9 26,13" fill="none" stroke="#854F0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="26" cy="13" r="2" fill="#854F0B"/>
  </svg>
),
'rol-farklari': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <polyline points="5,26 5,20 11,20 11,14 17,14 17,8 23,8" stroke="#1D9E75" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5" cy="26" r="2.5" fill="#9FE1CB"/>
    <circle cx="11" cy="20" r="2" fill="#1D9E75" opacity=".7"/>
    <circle cx="17" cy="14" r="2" fill="#1D9E75" opacity=".85"/>
    <line x1="23" y1="5" x2="23" y2="11" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round"/>
    <polygon points="23,5 23,9 27,7" fill="#0F6E56"/>
  </svg>
),
'veri-temizleme': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#E1F5EE"/>
    <rect x="3" y="12" width="7" height="8" rx="1.5" fill="#9FE1CB"/>
    <rect x="12.5" y="12" width="7" height="8" rx="1.5" fill="#1D9E75"/>
    <rect x="22" y="12" width="7" height="8" rx="1.5" fill="#0F6E56"/>
    <line x1="10" y1="16" x2="12.5" y2="16" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="19.5" y1="16" x2="22" y2="16" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="6.5" y="17.5" fontSize="5.5" fill="#0F6E56" textAnchor="middle" fontWeight="700">E</text>
    <text x="16" y="17.5" fontSize="5.5" fill="#fff" textAnchor="middle" fontWeight="700">T</text>
    <text x="25.5" y="17.5" fontSize="5.5" fill="#fff" textAnchor="middle" fontWeight="700">L</text>
  </svg>
),
'etl-nedir': (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
    <rect x="4" y="8" width="6" height="4" rx="1" fill="#AFA9EC"/>
    <rect x="4" y="19" width="6" height="4" rx="1" fill="#AFA9EC"/>
    <rect x="13" y="12.5" width="7" height="7" rx="1.5" fill="#7F77DD"/>
    <rect x="22" y="9" width="6" height="4" rx="1" fill="#534AB7"/>
    <rect x="22" y="19" width="6" height="4" rx="1" fill="#534AB7"/>
    <line x1="10" y1="10" x2="13" y2="14.5" stroke="#7F77DD" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="10" y1="21" x2="13" y2="17.5" stroke="#7F77DD" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="20" y1="14.5" x2="22" y2="11" stroke="#534AB7" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="20" y1="17.5" x2="22" y2="21" stroke="#534AB7" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
),
  };
  return icons[type] || null;
}

function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Tema değiştir"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-cream-card)',
        cursor: 'pointer',
        flexShrink: 0,
        padding: 0,
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ◐
    </button>
  );
}

function karistir(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function DahaFazlaBar({ ornekler, digerSayi }) {
  return (
    <div style={{ marginTop: '16px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-border)', background: 'var(--color-cream-card)' }}>
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--color-accent), var(--color-purple-text), var(--color-amber-text))' }} />
      <div style={{ padding: '28px 28px 24px', display: 'flex', gap: '28px', alignItems: 'stretch', flexWrap: 'wrap' }}>

        {/* Sol: sayı + açıklama + kategori linkleri */}
        <div style={{ flex: '0 0 auto', minWidth: '185px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '52px', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1, fontFamily: 'var(--font-mono)', letterSpacing: '-2px' }}>
              +{digerSayi}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', marginTop: '6px' }}>içerik daha var</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-mute)', marginTop: '6px', lineHeight: 1.6 }}>
              İnteraktif demolar, vaka çalışmaları,<br />rehberler ve araçlar seni bekliyor.
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { href: '/kategori/interaktif', label: '⚡ Demo',   cls: 'badge-interactive' },
              { href: '/kategori/rehber',     label: '📖 Rehber', cls: 'badge-guide' },
              { href: '/kategori/vaka',       label: '📊 Vaka',   cls: 'badge-case' },
            ].map(c => (
              <a key={c.href} href={c.href} className={`badge ${c.cls}`} style={{ textDecoration: 'none' }}>{c.label}</a>
            ))}
          </div>
        </div>

        {/* Dikey çizgi */}
        <div style={{ width: '1px', background: 'var(--color-border)', alignSelf: 'stretch', flexShrink: 0 }} />

        {/* Sağ: 3 önizleme kartı + CTA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '240px' }}>
          {ornekler.map(item => (
            <a key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '10px', flex: 1,
              background: 'var(--color-cream)',
              border: '1px solid var(--color-border)',
              borderLeft: `3px solid ${item.borderColor}`,
              textDecoration: 'none',
            }}>
              <div style={{ flexShrink: 0 }}><Icon type={item.icon} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.badge && (
                  <span className={`badge ${item.badgeClass}`} style={{ fontSize: '10px', marginBottom: '3px', display: 'inline-block' }}>{item.badge}</span>
                )}
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.35, fontFamily: 'var(--font-serif)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.baslik}
                </div>
              </div>
            </a>
          ))}
          <a href="/kategori/interaktif" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            padding: '11px', borderRadius: '10px', marginTop: '4px',
            background: 'var(--color-accent)', color: '#fff',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}>
            Tüm içeriklere git →
          </a>
        </div>

      </div>
    </div>
  );
}

export default function Home() {
  const yazilar = [
    {
      href: '/yazilar/linear-regression',
      icon: 'linear-regression',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Linear regression: çizgiyi sen çiz',
      ozet: 'Noktaları sürükle, regresyon çizgisi ve R² anlık değişsin.',
      meta: '8 dakika',
    },
    {
      href: '/yazilar/izmir-kira-analizi',
      icon: 'izmir-kira',
      badge: 'vaka çalışması',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'İzmir kira piyasası: 5.841 ilan, bir analist gözüyle',
      ozet: 'Hangi ilçe gerçekten pahalı? m² fiyatı hikayeyi nasıl değiştiriyor?',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/gradient-descent',
      icon: 'gradient-descent',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Gradient descent: top yuvarlama oyunu',
      ozet: 'Öğrenme hızını ayarla, top minimuma insin.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/ab-test',
      icon: 'ab-test',
      badge: 'araç',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'A/B test anlamlılık hesaplayıcı',
      ozet: 'p-değeri, güven aralığı ve etki büyüklüğünü hesapla.',
      meta: 'interaktif araç',
    },
    {
      href: '/yazilar/kmeans',
      icon: 'kmeans',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'K-Means: müşterilerini kümele',
      ozet: "Centroid'lerin adım adım nasıl yer değiştirdiğini izle.",
      meta: '10 dakika',
    },
    {
      href: '/yazilar/ilk-90-gun',
      icon: 'ilk-90-gun',
      badge: 'kariyer',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Veri analisti olarak ilk 90 günüm',
      ozet: '15 yıl sonra geriye bakınca keşke bilseydim dediklerim.',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/confusion-matrix',
      icon: 'confusion-matrix',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Confusion matrix: eşik dansı',
      ozet: 'Eşiği kaydır, TP/FP/TN/FN ve ROC eğrisi canlı değişsin.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/pandas-7-sey',
      icon: 'pandas-7-sey',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: "Pandas'ta en çok yanlış bilinen 7 şey",
      ozet: 'inplace, apply, merge, category dtype ve daha fazlası.',
      meta: '15 dakika',
    },
    {
      href: '/yazilar/bias-variance',
      icon: 'bias-variance',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Bias-variance trade-off: ezber mi, genelleme mi?',
      ozet: 'Polinom derecesini artır, underfitting ve overfitting arasındaki geçişi izle.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/feature-engineering',
      icon: 'feature-engineering',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Feature engineering: modelden önce gelen sanat',
      ozet: 'Encoding, ölçekleme, zaman özellikleri, etkileşim ve seçim.',
      meta: '15 dakika',
    },
    {
      href: '/yazilar/sql-temelleri',
      icon: 'sql-temelleri',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'SQL temelleri: veri analistinin en önemli becerisi',
      ozet: 'SELECT, JOIN, GROUP BY, window fonksiyonlar — sıfırdan ileri seviyeye.',
      meta: 'rehber · 20 dakika',
    },
    {
      href: '/yazilar/sample-size',
      icon: 'sample-size',
      badge: 'araç',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Sample size hesaplayıcı',
      ozet: 'A/B testi başlatmadan önce kaç kullanıcıya ihtiyacın var?',
      meta: 'interaktif araç',
    },
    {
      href: '/yazilar/sinir-agi',
      icon: 'sinir-agi',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Sinir ağı visualizer: veri nasıl akar?',
      ozet: 'Katmanları ayarla, sinyal gönder, nöronların nasıl ateşlendiğini izle.',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/bezier',
      icon: 'bezier',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Bezier eğrisi: kontrol noktalarının dansı',
      ozet: 'Noktaları sürükle, De Casteljau adımlarını izle, CSS animasyonlarının matematiğini keşfet.',
      meta: 'geometri · 10 dakika',
    },
    {
      href: '/yazilar/superlig-xg',
      icon: 'superlig',
      badge: 'vaka çalışması',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: "Süper Lig'de xG analizi: gol mü şans mı?",
      ozet: 'Icardi 25 gol attı ama beklentisi ne kadardı? Expected Goals ile futbol verisini keşfet.',
      meta: 'vaka · 12 dakika',
    },
    {
      href: '/yazilar/rol-farklari',
      icon: 'kariyer',
      badge: 'kariyer',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Veri analisti mi, data scientist mi, ML engineer mı?',
      ozet: 'Rollerin farkları, maaş aralıkları ve geçiş yolları.',
      meta: 'kariyer · 12 dakika',
    },
    {
      href: '/yazilar/veri-temizleme',
      icon: 'pandas-7-sey',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Veri temizleme: kirli veriden temiz veriye',
      ozet: 'Eksik değerler, aykırı değerler, tip dönüşümleri — pandas ile tam rehber.',
      meta: 'rehber · 20 dakika',
    },
    {
      href: '/yazilar/bi-karsilastirma',
      icon: 'pandas-7-sey',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Power BI vs Tableau vs Looker: hangisi sana uygun?',
      ozet: 'Fiyat, öğrenme eğrisi, güçlü/zayıf yanlar ve Türkiye iş piyasasında durum.',
      meta: 'rehber · 15 dakika',
    },
      {
      href: '/yazilar/yol-haritasi',
      baslik: 'Veri analisti olma yol haritası',
      ozet: 'Sıfırdan veri analistine giden 10 adım. Her adımda ne öğreneceksin, ne kadar sürer, hangi kaynakları kullanacaksın.',
      meta: '10 adım · interaktif',
      kategori: 'kariyer',
      borderColor: '#1D9E75',
      icon: 'rol-farklari',
    },
    {
      href: '/yazilar/etl-nedir',
      baslik: 'ETL nedir? Veriyi taşımanın sistematik yolu',
      ozet: 'Extract, Transform, Load — ETL pipeline nedir, nasıl kurulur? Python ile gerçek ETL örnekleri.',
      meta: 'rehber · 18 dakika',
      kategori: 'rehber',
      borderColor: '#1D9E75',
      icon: 'veri-temizleme',
    },
    {
      href: '/yazilar/dbt-nedir',
      baslik: 'dbt nedir? Analytics engineering rehberi',
      ozet: 'dbt ile SQL tabanlı veri modelleme, staging-mart hiyerarşisi, testler ve CI/CD. Türkçe dbt rehberi.',
      meta: 'rehber · 20 dakika',
      kategori: 'rehber',
      borderColor: '#7F77DD',
      icon: 'etl-nedir',
    },
    {
      href: '/yazilar/portfolyo',
      icon: 'portfolyo',
      badge: 'kariyer',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Veri analisti portföyü nasıl hazırlanır?',
      ozet: 'GitHub, Kaggle, proje seçimi ve işe alımcıların gerçekten baktığı şeyler.',
      meta: 'kariyer · 15 dakika',
    },
    {
      href: '/yazilar/mulakat-sql',
      icon: 'mulakat-sql',
      badge: 'kariyer',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Mülakatta sorulan 10 SQL sorusu',
      ozet: 'Senaryo, çözüm ve sık yapılan hatalarla gerçek mülakat soruları.',
      meta: 'kariyer · 20 dakika',
    },
    {
      href: '/yazilar/decision-tree',
      icon: 'decision-tree',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Decision tree: ağacı sen büyüt',
      ozet: 'Bölme eşiklerini sürükle, Gini impurity\'nin nasıl düştüğünü izle.',
      meta: '10 dakika',
    },
    {
      href: '/yazilar/linkedin-profili',
      icon: 'linkedin',
      badge: 'kariyer',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Veri analisti LinkedIn profili nasıl olmalı?',
      ozet: 'Headline, about bölümü, deneyim yazımı ve işe alımcıların dikkat ettiği şeyler.',
      meta: 'kariyer · 12 dakika',
    },
    {
      href: '/yazilar/cloud-rehberi',
      icon: 'cloud',
      badge: 'rehber',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Veri bilimcisi için cloud: GCP mi AWS mi?',
      ozet: 'BigQuery vs Redshift, Vertex AI vs SageMaker. Hangi servisi ne zaman kullanırsın?',
      meta: 'rehber · 18 dakika',
    },
    {
      href: '/yazilar/merkezi-limit-teoremi',
      icon: 'clt',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Merkezi Limit Teoremi: her şey normal dağılıma yaklaşır',
      ozet: 'Dağılım seç, örnekle, histogramın gözün önünde normale yaklaştığını gör.',
      meta: 'interaktif · 10 dakika',
    },
    {
      href: '/yazilar/random-forest',
      icon: 'forest',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Random Forest: yüz ağaç bir orman yapar',
      ozet: 'Slider ile ağaç ekle, karar sınırının nasıl yumuşadığını izle. Test noktasını sürükle.',
      meta: 'interaktif · 14 dakika',
    },
    {
      href: '/yazilar/naive-bayes',
      icon: 'bayes',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Naive Bayes: spam filtresi nasıl öğrenir?',
      ozet: 'Kelimeleri seç, spam olasılığını canlı gör. Bayes teoremi adım adım.',
      meta: 'interaktif · 12 dakika',
    },
    {
      href: '/yazilar/spotify-turkiye',
      icon: 'spotify',
      badge: 'vaka çalışması',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Spotify Türkiye: 82 milyon kulak, ne dinliyor?',
      ozet: 'Tür dağılımı, ses özellikleri, gece yarısı arabesk zirvelemesi ve yaz pop patlaması.',
      meta: '12 dakika',
    },
    {
      href: '/yazilar/anscombe',
      icon: 'anscombe',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: "Anscombe'un Dörtlüsü: sayılar aynı, gerçek farklı",
      ozet: '4 veri seti, birebir aynı istatistikler — ama grafikleri bambaşka. Görselleştirme neden zorunlu?',
      meta: 'interaktif · 10 dakika',
    },
    {
      href: '/yazilar/veri-dedektifi',
      icon: 'dedektif',
      badge: 'interaktif',
      badgeClass: 'badge-interactive',
      borderColor: '#1D9E75',
      baslik: 'Veri dedektifi: gelir düşüşünün sebebini bul',
      ozet: 'FikirzadeTech geliri %28 düştü. 8 panel incele, kanıtları topla, kök nedeni bul.',
      meta: 'interaktif · soruşturma oyunu',
    },
    {
      href: '/yazilar/deprem-analizi',
      icon: 'deprem',
      badge: 'vaka çalışması',
      badgeClass: 'badge-case',
      borderColor: '#e8a04a',
      baslik: 'Türkiye deprem verisi: 1900-2024 ne anlatıyor?',
      ozet: 'Bölgesel dağılım, Gutenberg-Richter yasası, derinlik-büyüklük ilişkisi ve 125 yılın büyük depremleri.',
      meta: 'vaka · 14 dakika',
    },
    {
      href: '/csv',
      icon: 'csv',
      badge: 'araç',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'CSV Analiz Aracı',
      ozet: 'CSV yapıştır ya da yükle. Veri tipleri, eksik değerler, istatistikler ve dağılımlar anında.',
      meta: 'araç · tarayıcıda çalışır',
    },
    {
      href: '/renk',
      icon: 'renk',
      badge: 'araç',
      badgeClass: 'badge-guide',
      borderColor: '#7F77DD',
      baslik: 'Renk Paleti Seçici',
      ozet: 'Kategorik, sıralı, ayrışık ve renk körü dostu paletler. Tıkla, önizle, hex kodu kopyala.',
      meta: 'araç · görselleştirme',
    },
  ];

  const interaktif = yazilar.filter(y => y.badge === 'interaktif').length;
  const arac = yazilar.filter(y => y.badge === 'araç').length;
  const rehber = yazilar.filter(y => ['rehber', 'kariyer', 'vaka çalışması'].includes(y.badge)).length;

  const [sira, setSira] = useState(() => karistir(yazilar));
  const gorunenler = sira.slice(0, 18);
  const bannerOrnekler = sira.slice(18, 21);
  const shuffle = () => setSira(karistir(yazilar));

  return (
    <main className="min-h-screen">

      <section className="max-w-5xl mx-auto px-6 py-14" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-start justify-between gap-8 flex-wrap">
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div className="flex gap-2 flex-wrap mb-5">
              <span className="badge badge-interactive">{yazilar.length} içerik</span>
              <span className="badge badge-interactive">{interaktif} interaktif demo</span>
              <span className="badge badge-case">Türkçe &amp; ücretsiz</span>
            </div>
            <h1 className="font-serif font-medium leading-tight mb-4" style={{ fontSize: '2.6rem', color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              Birlikte öğreniyoruz,<br />birlikte deniyoruz.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-soft)', maxWidth: '420px' }}>
              Veri bilimi, makine öğrenmesi ve istatistik üzerine interaktif Türkçe içerikler. Her kavramı önce dener, sonra konuşuruz.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', flexShrink: 0 }}>
            {[
              { sayi: yazilar.length, etiket: 'içerik', renk: 'var(--color-accent)' },
              { sayi: interaktif, etiket: 'demo', renk: '#7F77DD' },
              { sayi: arac, etiket: 'araç', renk: '#e8a04a' },
              { sayi: rehber, etiket: 'rehber', renk: '#E24B4A' },
            ].map(({ sayi, etiket, renk }) => (
              <div key={etiket} className="card text-center" style={{ padding: '16px 20px', minWidth: '90px' }}>
                <div className="text-2xl font-medium mb-1" style={{ color: renk }}>{sayi}</div>
                <div className="text-xs" style={{ color: 'var(--color-text-mute)' }}>{etiket}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

<OgrenKarti />
<YolHaritasiKarti />

      <section className="max-w-5xl mx-auto px-6 py-10 pb-20">
        <HeroCanvas />

        <div style={{ marginBottom: '2.5rem' }}>
          <GununSorusu />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-mute)' }}>İçerikler</div>
          <button onClick={shuffle} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            border: '0.5px solid var(--color-border)',
            background: 'var(--color-cream-card)',
            color: 'var(--color-text-soft)',
            fontSize: '12px', fontWeight: 500, cursor: 'pointer',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <rect x="2" y="2" width="20" height="20" rx="3.5"/>
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            Karıştır
          </button>
        </div>
        <div className="icerik-grid">
          {gorunenler.map((y) => (
            <a key={y.href} href={y.href} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
              <div className="card" style={{ borderTop: `3px solid ${y.borderColor}`, padding: '18px 20px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '12px' }}>
                  <Icon type={y.icon} />
                </div>
                {y.badge && <span className={`badge ${y.badgeClass} inline-block mb-3`}>{y.badge}</span>}
                <h3 className="font-serif font-medium mb-2" style={{ fontSize: '16px', color: 'var(--color-text)', lineHeight: '1.4', flex: 1 }}>{y.baslik}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--color-text-mute)' }}>{y.ozet}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{y.meta}</p>
              </div>
            </a>
          ))}
        </div>

        <DahaFazlaBar ornekler={bannerOrnekler} digerSayi={yazilar.length - 18} />

        <div className="mt-10">
</div>
      </section>
      <AboneOl />
    </main>
  );
}
