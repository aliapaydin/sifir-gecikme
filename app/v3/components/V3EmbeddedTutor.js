'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'v3_tutor_history';
const MAX_MESSAGES = 60;

const DEFAULT_MESSAGES = [
  { role: 'assistant', content: 'Merhaba! Veri bilimi, makine öğrenmesi veya istatistik hakkında her soruyu sorabilirsin.' }
];

const SUGGESTIONS = [
  'Linear regression ne zaman kullanılır?',
  'p-değeri ne anlama gelir?',
  'Overfitting nedir, nasıl önlenir?',
  'SQL JOIN türlerini açıklar mısın?',
];

function parseMarkdown(text) {
  return text
    .replace(/```([\w]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
      const escaped = code.trim().replace(/</g, '&lt;');
      return `<pre style="background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:14px 16px;margin:10px 0;overflow-x:auto;font-size:12px;line-height:1.6"><code>${escaped}</code></pre>`;
    })
    .replace(/`([^`]+)`/g, '<code style="background:rgba(99,102,241,0.15);color:#a5b4fc;padding:2px 6px;border-radius:5px;font-size:0.88em">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:inherit;font-weight:700">$1</strong>')
    .replace(/^### (.+)$/gm, '<div style="font-size:13px;font-weight:700;margin:10px 0 4px;color:var(--v3-text)">$1</div>')
    .replace(/^## (.+)$/gm, '<div style="font-size:14px;font-weight:700;margin:12px 0 6px;color:var(--v3-text)">$1</div>')
    .replace(/^- (.+)$/gm, '<div style="padding-left:14px;margin:2px 0">• $1</div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function V3EmbeddedTutor() {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [loaded, setLoaded]     = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const messagesEndRef   = useRef(null);
  const isFirstRender    = useRef(true);
  const justLoaded       = useRef(false);
  const pendingSave      = useRef([]);

  // Yükle — giriş yapılmışsa DB'den, değilse localStorage'dan
  useEffect(() => {
    async function load() {
      let fromDb = false;
      try {
        const res = await fetch('/api/v3/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setIsLoggedIn(true);
            const dbRes = await fetch('/api/v3/tutor');
            if (dbRes.ok) {
              const { messages: dbMsgs } = await dbRes.json();
              if (dbMsgs?.length > 0) {
                justLoaded.current = true;
                setMessages([DEFAULT_MESSAGES[0], ...dbMsgs]);
                fromDb = true;
              }
            }
          }
        }
      } catch {}

      if (!fromDb) {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              justLoaded.current = true;
              setMessages(parsed);
            }
          }
        } catch {}
      }
      setLoaded(true);
    }
    load();
  }, []);

  // localStorage'a kaydet
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {}
  }, [messages, loaded]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (justLoaded.current) { justLoaded.current = false; return; }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  async function clearHistory() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    if (isLoggedIn) {
      try { await fetch('/api/v3/tutor', { method: 'DELETE' }); } catch {}
    }
    setMessages(DEFAULT_MESSAGES);
  }

  const send = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);

    const userMsg = { role: 'user', content: q };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, topic: 'veri bilimi' }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => 'Hata');
        setMessages(prev => { const m = [...prev]; m[m.length - 1].content = errText; return m; });
        return;
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages(prev => { const m = [...prev]; m[m.length - 1].content = full; return m; });
      }

      // DB'ye kaydet
      if (isLoggedIn) {
        const assistantMsg = { role: 'assistant', content: full };
        fetch('/api/v3/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [userMsg, assistantMsg] }),
        }).catch(() => {});
      }
    } catch {
      setMessages(prev => { const m = [...prev]; m[m.length - 1].content = 'Bağlantı hatası. Lütfen tekrar dene.'; return m; });
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, isLoggedIn]);

  const hasConversation = messages.length > 1;

  return (
    <>
      <style>{`
        .v3t-wrap {
          border: 1px solid var(--v3-border);
          border-radius: 24px;
          overflow: hidden;
          background: var(--v3-surface);
          display: flex;
          flex-direction: column;
          height: 480px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          position: relative;
        }
        .v3t-header {
          padding: 18px 20px 16px;
          border-bottom: 1px solid var(--v3-border);
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 60%, rgba(20,184,166,0.04) 100%);
        }
        .v3t-avatar {
          width: 40px; height: 40px; border-radius: 14px; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #14b8a6 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(99,102,241,0.35);
        }
        .v3t-name { font-size: 14px; font-weight: 700; color: var(--v3-text); letter-spacing: -0.01em; }
        .v3t-status {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: var(--v3-text-muted); font-weight: 500;
        }
        .v3t-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #10b981; box-shadow: 0 0 0 2px rgba(16,185,129,0.2);
          animation: v3t-pulse 2s infinite;
        }
        @keyframes v3t-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .v3t-badge {
          margin-left: auto;
          display: flex; align-items: center; gap: 6px;
        }
        .v3t-db-badge {
          padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 600;
          background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2);
        }
        .v3t-clear {
          padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 600;
          background: transparent; border: 1px solid var(--v3-border-bright);
          color: var(--v3-text-muted); cursor: pointer; transition: color 0.15s, border-color 0.15s;
          flex-shrink: 0;
        }
        .v3t-clear:hover { color: #f87171; border-color: rgba(248,113,113,0.4); }
        .v3t-messages {
          flex: 1; overflow-y: auto; padding: 20px 16px;
          display: flex; flex-direction: column; gap: 14px;
          scroll-behavior: smooth;
        }
        .v3t-messages::-webkit-scrollbar { width: 3px; }
        .v3t-messages::-webkit-scrollbar-thumb { background: var(--v3-border-bright); border-radius: 2px; }
        .v3t-msg-row {
          display: flex; gap: 8px; align-items: flex-end;
        }
        .v3t-msg-row.user { flex-direction: row-reverse; }
        .v3t-msg-avatar {
          width: 28px; height: 28px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 14px;
        }
        .v3t-msg-avatar.ai {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .v3t-msg-avatar.user-av {
          background: var(--v3-surface2);
          border: 1px solid var(--v3-border-bright);
        }
        .v3t-bubble {
          max-width: 82%; font-size: 13.5px; line-height: 1.6;
          padding: 11px 15px; border-radius: 16px;
        }
        .v3t-bubble.user {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border-radius: 16px 16px 4px 16px;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .v3t-bubble.assistant {
          background: var(--v3-surface2);
          border: 1px solid var(--v3-border);
          color: var(--v3-text);
          border-radius: 4px 16px 16px 16px;
        }
        .v3t-cursor {
          display: inline-block; width: 2px; height: 13px;
          background: var(--v3-accent); animation: v3t-blink 1s step-end infinite;
          vertical-align: middle; margin-left: 2px; border-radius: 1px;
        }
        @keyframes v3t-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .v3t-suggestions {
          padding: 0 16px 10px;
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .v3t-sug {
          padding: 6px 13px; border-radius: 20px; font-size: 12px; font-weight: 500;
          background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.18);
          color: #818cf8; cursor: pointer; transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .v3t-sug:hover { background: rgba(99,102,241,0.16); transform: translateY(-1px); }
        .v3t-input-row {
          display: flex; gap: 8px; padding: 12px 14px 14px;
          border-top: 1px solid var(--v3-border); flex-shrink: 0;
          background: var(--v3-surface);
        }
        .v3t-input {
          flex: 1; background: var(--v3-surface2);
          border: 1.5px solid var(--v3-border);
          border-radius: 14px; padding: 10px 14px;
          font-size: 13.5px; color: var(--v3-text); outline: none;
          resize: none; font-family: inherit; line-height: 1.4;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .v3t-input:focus {
          border-color: rgba(99,102,241,0.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .v3t-input::placeholder { color: var(--v3-text-faint); }
        .v3t-send {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; cursor: pointer; color: #fff; font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.15s, transform 0.1s; align-self: flex-end;
          box-shadow: 0 4px 12px rgba(99,102,241,0.35);
        }
        .v3t-send:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .v3t-send:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
        .v3t-thinking {
          display: flex; align-items: center; gap: 4px; padding: 12px 15px;
          background: var(--v3-surface2); border: 1px solid var(--v3-border);
          border-radius: 4px 16px 16px 16px;
        }
        .v3t-thinking span {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--v3-text-muted); animation: v3t-bounce 1.2s infinite;
        }
        .v3t-thinking span:nth-child(2) { animation-delay: 0.2s; }
        .v3t-thinking span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes v3t-bounce {
          0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)}
        }
      `}</style>

      <div className="v3t-wrap">
        {/* Header */}
        <div className="v3t-header">
          <div className="v3t-avatar">✦</div>
          <div>
            <div className="v3t-name">AI Tutor</div>
            <div className="v3t-status">
              <span className="v3t-dot" />
              Veri bilimi asistanın
            </div>
          </div>
          <div className="v3t-badge">
            {isLoggedIn && (
              <span className="v3t-db-badge">☁ Senkron</span>
            )}
            {hasConversation && (
              <button className="v3t-clear" onClick={clearHistory}>Temizle</button>
            )}
          </div>
        </div>

        {/* Mesajlar */}
        <div className="v3t-messages">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const isLast = i === messages.length - 1;
            const isStreaming = !isUser && loading && isLast;
            const showThinking = isStreaming && msg.content === '';

            return (
              <div key={i} className={`v3t-msg-row ${isUser ? 'user' : ''}`}>
                <div className={`v3t-msg-avatar ${isUser ? 'user-av' : 'ai'}`}>
                  {isUser ? '👤' : '✦'}
                </div>
                {showThinking ? (
                  <div className="v3t-thinking">
                    <span/><span/><span/>
                  </div>
                ) : (
                  <div
                    className={`v3t-bubble ${isUser ? 'user' : 'assistant'}`}
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(msg.content) +
                        (isStreaming && msg.content ? '<span class="v3t-cursor"></span>' : '')
                    }}
                  />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Öneri butonları */}
        {!hasConversation && (
          <div className="v3t-suggestions">
            {SUGGESTIONS.map(s => (
              <button key={s} className="v3t-sug" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="v3t-input-row">
          <textarea
            className="v3t-input"
            rows={1}
            placeholder="Bir soru sor... (Enter ile gönder)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button className="v3t-send" onClick={() => send()} disabled={loading || !input.trim()}>
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
