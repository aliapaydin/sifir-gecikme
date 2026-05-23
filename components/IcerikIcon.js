export default function IcerikIcon({ type }) {
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
        <text x="12.5" y="17.5" fontSize="7" fill="#fff" fontWeight="700">&#9729;</text>
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
    'sepet-terki': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
        <path d="M5 8h2.5l2.5 10h12l2-7H10" stroke="#BA7517" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="13" cy="24" r="1.8" fill="#e8a04a"/>
        <circle cx="20" cy="24" r="1.8" fill="#e8a04a"/>
        <line x1="22" y1="7" x2="27" y2="12" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="27" y1="7" x2="22" y2="12" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    'banka-fraud': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FAEEDA"/>
        <rect x="5" y="10" width="22" height="14" rx="3" fill="#e8a04a" opacity=".25" stroke="#e8a04a" strokeWidth="1.5"/>
        <rect x="5" y="13" width="22" height="3" fill="#e8a04a" opacity=".5"/>
        <rect x="8" y="18" width="6" height="2" rx="1" fill="#BA7517" opacity=".7"/>
        <circle cx="23" cy="10" r="6" fill="#EF4444"/>
        <line x1="20.5" y1="7.5" x2="25.5" y2="12.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="25.5" y1="7.5" x2="20.5" y2="12.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
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
    'z-skor': (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#EEEDFE"/>
        <path d="M4 22 Q8 22 10 16 Q13 8 16 8 Q19 8 22 16 Q24 22 28 22" stroke="#7F77DD" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M4 22 Q8 22 10 16 Q13 8 16 8 Q19 8 22 16 Q24 22 28 22 L28 24 L4 24 Z" fill="#AFA9EC" opacity="0.3"/>
        <line x1="4" y1="24" x2="28" y2="24" stroke="#534AB7" strokeWidth="1.2"/>
        <line x1="16" y1="8" x2="16" y2="24" stroke="#534AB7" strokeWidth="1" strokeDasharray="2 2" opacity="0.6"/>
      </svg>
    ),
  };
  return icons[type] || null;
}
