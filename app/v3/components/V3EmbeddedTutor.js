'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const SUGGESTIONS = [
  'Linear regression ne zaman kullanılır?',
  'p-değeri ne anlama gelir?',
  'Overfitting nedir, nasıl önlenir?',
  'SQL JOIN türlerini açıklar mısın?',
];

function parseMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, m => `<pre style="background:rgba(0,0,0,0.25);border-radius:8px;padding:12px;margin:8px 0;overflow-x:auto;font-size:12px;line-height:1.5">${m.slice(m.indexOf('\n') + 1, m.lastIndexOf('```')).replace(/</g, '&lt;')}</pre>`)
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.2);padding:1px 5px;border-radius:4px;font-size:0.9em">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function V3EmbeddedTutor() {
  const [messages, setMessages]   = useState([
    { role: 'assistant', content: 'Merhaba! Veri bilimi, makine öğrenmesi veya istatistik hakkında her soruyu sorabilirsin.' }
  ]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const messagesEndRef             = useRef(null);
  const inputRef                   = useRef(null);
  const abortRef                   = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: q }];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, page: '/v3' }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessages(prev => { const m = [...prev]; m[m.length - 1].content = err.error || 'Bir hata oluştu.'; return m; });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') break;
            try { full += JSON.parse(raw); } catch {}
          }
        }
        setMessages(prev => { const m = [...prev]; m[m.length - 1].content = full; return m; });
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        setMessages(prev => { const m = [...prev]; m[m.length - 1].content = 'Bağlantı hatası.'; return m; });
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      <style>{`
        .v3t-wrap {
          border: 1px solid var(--v3-border);
          border-radius: 20px;
          overflow: hidden;
          background: var(--v3-surface);
          display: flex; flex-direction: column;
          height: 420px;
        }
        .v3t-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--v3-border);
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06));
        }
        .v3t-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .v3t-title { font-size: 15px; font-weight: 700; color: var(--v3-text); }
        .v3t-sub   { font-size: 12px; color: var(--v3-text-muted); }
        .v3t-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
          scroll-behavior: smooth;
        }
        .v3t-messages::-webkit-scrollbar { width: 4px; }
        .v3t-messages::-webkit-scrollbar-track { background: transparent; }
        .v3t-messages::-webkit-scrollbar-thumb { background: var(--v3-border-bright); border-radius: 2px; }
        .v3t-msg { max-width: 88%; font-size: 14px; line-height: 1.55; }
        .v3t-msg.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; padding: 10px 14px; border-radius: 14px 14px 4px 14px;
        }
        .v3t-msg.assistant {
          align-self: flex-start;
          background: var(--v3-surface2);
          border: 1px solid var(--v3-border);
          color: var(--v3-text); padding: 10px 14px; border-radius: 4px 14px 14px 14px;
        }
        .v3t-cursor { display: inline-block; width: 2px; height: 14px; background: var(--v3-accent); animation: v3t-blink 1s step-end infinite; vertical-align: middle; margin-left: 2px; }
        @keyframes v3t-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .v3t-suggestions {
          padding: 0 16px 8px; display: flex; gap: 6px; flex-wrap: wrap;
        }
        .v3t-sug {
          padding: 5px 11px; border-radius: 20px; font-size: 12px; font-weight: 500;
          background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2);
          color: #818cf8; cursor: pointer; transition: background 0.15s;
          white-space: nowrap;
        }
        .v3t-sug:hover { background: rgba(99,102,241,0.18); }
        .v3t-input-row {
          display: flex; gap: 8px; padding: 12px 16px;
          border-top: 1px solid var(--v3-border); flex-shrink: 0;
          background: var(--v3-surface);
        }
        .v3t-input {
          flex: 1; background: var(--v3-surface2);
          border: 1px solid var(--v3-border); border-radius: 10px;
          padding: 10px 14px; font-size: 14px; color: var(--v3-text);
          outline: none; resize: none; font-family: inherit; line-height: 1.4;
          transition: border-color 0.15s;
        }
        .v3t-input:focus { border-color: var(--v3-border-bright); }
        .v3t-input::placeholder { color: var(--v3-text-muted); }
        .v3t-send {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; cursor: pointer; color: #fff; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.15s; align-self: flex-end;
        }
        .v3t-send:hover { opacity: 0.85; }
        .v3t-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div className="v3t-wrap">
        {/* Header */}
        <div className="v3t-header">
          <div className="v3t-icon">🤖</div>
          <div>
            <div className="v3t-title">AI Tutor</div>
            <div className="v3t-sub">Veri bilimi asistanın — her soruyu sor</div>
          </div>
        </div>

        {/* Mesajlar */}
        <div className="v3t-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`v3t-msg ${msg.role}`}
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(msg.content) + (msg.role === 'assistant' && loading && i === messages.length - 1 ? '<span class="v3t-cursor"></span>' : '')
              }}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Öneri butonları (sadece başlangıçta) */}
        {messages.length <= 1 && (
          <div className="v3t-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="v3t-sug" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="v3t-input-row">
          <textarea
            ref={inputRef}
            className="v3t-input"
            rows={1}
            placeholder="Bir soru sor..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
          />
          <button className="v3t-send" onClick={() => send()} disabled={loading || !input.trim()}>
            {loading ? '⏳' : '↑'}
          </button>
        </div>
      </div>
    </>
  );
}
