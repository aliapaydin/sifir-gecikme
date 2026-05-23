'use client';

import { useState, useCallback } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitNext, setWaitNext] = useState(false);
  const [history, setHistory] = useState('');

  const inputDigit = (digit) => {
    if (waitNext) {
      setDisplay(String(digit));
      setWaitNext(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitNext) { setDisplay('0.'); setWaitNext(false); return; }
    if (!display.includes('.')) setDisplay(display + '.');
  };

  const handleOperator = (op) => {
    const val = parseFloat(display);
    if (prevValue !== null && !waitNext) {
      const result = calculate(prevValue, val, operator);
      setDisplay(formatResult(result));
      setPrevValue(result);
      setHistory(`${result} ${op}`);
    } else {
      setPrevValue(val);
      setHistory(`${val} ${op}`);
    }
    setWaitNext(true);
    setOperator(op);
  };

  const calculate = (a, b, op) => {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '×') return a * b;
    if (op === '÷') return b !== 0 ? a / b : 0;
    return b;
  };

  const formatResult = (n) => {
    if (isNaN(n) || !isFinite(n)) return 'Hata';
    const s = String(n);
    return s.length > 12 ? parseFloat(n.toPrecision(10)).toString() : s;
  };

  const handleEquals = () => {
    if (operator === null || prevValue === null) return;
    const val = parseFloat(display);
    const result = calculate(prevValue, val, operator);
    setHistory(`${prevValue} ${operator} ${val} =`);
    setDisplay(formatResult(result));
    setPrevValue(null);
    setOperator(null);
    setWaitNext(true);
  };

  const handleClear = () => {
    setDisplay('0'); setPrevValue(null); setOperator(null);
    setWaitNext(false); setHistory('');
  };

  const handlePlusMinus = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const ROWS = [
    [
      { label: 'C', action: handleClear, style: 'func' },
      { label: '±', action: handlePlusMinus, style: 'func' },
      { label: '%', action: handlePercent, style: 'func' },
      { label: '÷', action: () => handleOperator('÷'), style: 'op' },
    ],
    [
      { label: '7', action: () => inputDigit('7'), style: 'num' },
      { label: '8', action: () => inputDigit('8'), style: 'num' },
      { label: '9', action: () => inputDigit('9'), style: 'num' },
      { label: '×', action: () => handleOperator('×'), style: 'op' },
    ],
    [
      { label: '4', action: () => inputDigit('4'), style: 'num' },
      { label: '5', action: () => inputDigit('5'), style: 'num' },
      { label: '6', action: () => inputDigit('6'), style: 'num' },
      { label: '-', action: () => handleOperator('-'), style: 'op' },
    ],
    [
      { label: '1', action: () => inputDigit('1'), style: 'num' },
      { label: '2', action: () => inputDigit('2'), style: 'num' },
      { label: '3', action: () => inputDigit('3'), style: 'num' },
      { label: '+', action: () => handleOperator('+'), style: 'op' },
    ],
    [
      { label: '0', action: () => inputDigit('0'), style: 'num', wide: true },
      { label: '.', action: inputDecimal, style: 'num' },
      { label: '=', action: handleEquals, style: 'eq' },
    ],
  ];

  const getButtonStyle = (type, active) => {
    const base = {
      borderRadius: '50%', border: 'none', cursor: 'pointer',
      fontSize: '1.25rem', fontWeight: 500,
      transition: 'filter 0.1s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    };
    if (type === 'func') return { ...base, background: '#A5A5A5', color: '#000' };
    if (type === 'op')   return { ...base, background: '#FF9F0A', color: '#fff' };
    if (type === 'eq')   return { ...base, background: '#FF9F0A', color: '#fff' };
    return { ...base, background: '#333', color: '#fff' };
  };

  return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#1a1a1a',
    }}>
      <div style={{
        width: '280px',
        background: '#000',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Display */}
        <div style={{ padding: '20px 20px 10px', minHeight: '100px' }}>
          <div style={{ fontSize: '0.75rem', color: '#555', textAlign: 'right', minHeight: '18px', marginBottom: '4px' }}>
            {history}
          </div>
          <div style={{
            fontSize: display.length > 9 ? '2rem' : '3rem',
            fontWeight: 200,
            color: '#fff',
            textAlign: 'right',
            lineHeight: 1.1,
            wordBreak: 'break-all',
          }}>
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ROWS.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: '10px' }}>
              {row.map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  style={{
                    ...getButtonStyle(btn.style, operator === btn.label),
                    flex: btn.wide ? 2 : 1,
                    height: '58px',
                    borderRadius: btn.wide ? '29px' : '50%',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
