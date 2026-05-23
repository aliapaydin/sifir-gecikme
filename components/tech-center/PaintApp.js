'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const COLORS = [
  '#000000', '#ffffff', '#E24B4A', '#1D9E75', '#3B82F6',
  '#F59E0B', '#8B5CF6', '#EC4899', '#0EA5E9', '#64748B',
  '#7C3AED', '#059669', '#DC2626', '#D97706', '#2563EB',
];

export default function PaintApp() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(6);
  const [tool, setTool] = useState('brush'); // brush | eraser
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e) => {
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    setIsDrawing(true);
    lastPos.current = pos;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? brushSize * 2 : brushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.fill();
  }, [color, brushSize, tool]);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  }, [isDrawing, color, brushSize, tool]);

  const stopDraw = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f5f5f0' }}>
      {/* Toolbar */}
      <div style={{
        padding: '8px 12px', background: '#e8e4dc',
        borderBottom: '1px solid #ccc',
        display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        {/* Tool buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[{ id: 'brush', emoji: '✏️', label: 'Kalem' }, { id: 'eraser', emoji: '🧹', label: 'Silgi' }].map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.label}
              style={{
                padding: '6px 10px', borderRadius: '6px',
                border: tool === t.id ? '2px solid #333' : '1px solid #aaa',
                background: tool === t.id ? '#fff' : 'transparent',
                cursor: 'pointer', fontSize: '1rem',
              }}
            >
              {t.emoji}
            </button>
          ))}
        </div>

        {/* Color palette */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => { setColor(c); setTool('brush'); }}
              style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: c,
                border: color === c && tool === 'brush' ? '2.5px solid #333' : '1.5px solid #aaa',
                cursor: 'pointer', flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Brush size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: '#555' }}>Boyut:</span>
          <input
            type="range" min="2" max="40" value={brushSize}
            onChange={e => setBrushSize(parseInt(e.target.value))}
            style={{ width: '80px' }}
          />
          <span style={{ fontSize: '0.75rem', color: '#555', width: '20px' }}>{brushSize}</span>
        </div>

        {/* Clear */}
        <button
          onClick={clearCanvas}
          style={{
            padding: '5px 12px', borderRadius: '6px',
            border: '1px solid #aaa', background: '#fff',
            fontSize: '0.78rem', cursor: 'pointer', color: '#333',
          }}
        >
          🗑 Temizle
        </button>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', background: '#888' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={560}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          style={{
            background: '#fff',
            cursor: tool === 'eraser' ? 'cell' : 'crosshair',
            maxWidth: '100%', maxHeight: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            touchAction: 'none',
          }}
        />
      </div>
    </div>
  );
}
