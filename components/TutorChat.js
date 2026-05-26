'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ─── Topic map ─── */
const TOPIC_MAP = {
  '/yazilar/linear-regression':    'Linear Regression (Doğrusal Regresyon)',
  '/yazilar/gradient-descent':     'Gradient Descent (Eğim İnişi)',
  '/yazilar/kmeans':               'K-Means Kümeleme',
  '/yazilar/confusion-matrix':     'Confusion Matrix ve ROC Eğrisi',
  '/yazilar/bias-variance':        'Bias-Variance Trade-off',
  '/yazilar/sinir-agi':            'Sinir Ağları ve Derin Öğrenme',
  '/yazilar/ab-test':              'A/B Testi ve İstatistiksel Anlamlılık',
  '/yazilar/sample-size':          'Örneklem Büyüklüğü Hesaplama',
  '/yazilar/pandas-7-sey':         'Pandas ile Veri Manipülasyonu',
  '/yazilar/pandas-referans':      'Pandas Fonksiyon Referansı',
  '/yazilar/feature-engineering':  'Feature Engineering',
  '/yazilar/sql-temelleri':        'SQL Temelleri',
  '/yazilar/cohort-analizi':       'Cohort Analizi (SQL)',
  '/yazilar/sklearn-pipeline':     'Scikit-learn Pipeline',
  '/yazilar/decision-tree':        'Karar Ağaçları (Decision Tree)',
  '/yazilar/random-forest':        'Random Forest',
  '/yazilar/naive-bayes':          'Naive Bayes ve Metin Sınıflandırma',
  '/yazilar/bezier':               'Bezier Eğrileri ve Matematiksel Animasyon',
  '/yazilar/merkezi-limit-teoremi':'Merkezi Limit Teoremi',
  '/yazilar/anscombe':             "Anscombe'un Dörtlüsü ve Veri Görselleştirme",
  '/yazilar/deprem-analizi':       'Deprem Veri Analizi',
  '/yazilar/churn-tahmini':        'Müşteri Kaybı (Churn) Tahmini',
  '/yazilar/kredi-shap':           'SHAP ve Model Yorumlanabilirliği',
  '/yazilar/sepet-terki':          'E-ticaret Sepet Terki Analizi',
  '/yazilar/banka-fraud':          'Fraud Tespiti ve Dengesiz Sınıf',
  '/yazilar/spotify-turkiye':      'Müzik Veri Analizi',
  '/yazilar/superlig-xg':          'Futbol Veri Analizi ve Expected Goals (xG)',
  '/yazilar/veri-temizleme':       'Veri Temizleme (Pandas)',
  '/yazilar/feature-engineering':  'Feature Engineering',
  '/yazilar/yol-haritasi':         'Veri Analisti Kariyer Yolu',
  '/yazilar/ilk-90-gun':           'Veri Analistinin İlk 90 Günü',
  '/yazilar/rol-farklari':         'Veri Bilimi Rolleri (Analist, DS, MLE)',
  '/yazilar/portfolyo':            'Veri Analisti Portföy Hazırlama',
  '/yazilar/mulakat-sql':          'SQL Mülakat Soruları',
  '/yazilar/linkedin-profili':     'LinkedIn Profil Optimizasyonu',
  '/yazilar/cloud-rehberi':        'Cloud (GCP & AWS) Veri Mühendisliği',
  '/yazilar/etl-nedir':            'ETL Pipeline',
  '/yazilar/dbt-nedir':            'dbt (Analytics Engineering)',
  '/yazilar/databricks-rehberi':   'Databricks ve Lakehouse',
  '/yazilar/bi-karsilastirma':     'BI Araçları (Power BI, Tableau, Looker)',
  '/yazilar/z-skor':               'Normal Dağılım ve Z-Skoru',
  '/yazilar/veri-dedektifi':       'Veri Analizi ile Problem Çözme',
  '/hipotez':  'Hipotez Testleri (t-testi, ANOVA, Ki-kare)',
  '/sql':      'SQL Playground',
  '/python':   'Python ve Veri Bilimi Kütüphaneleri',
  '/csv':      'CSV Veri Analizi',
  '/renk':     'Veri Görselleştirme Renk Paleteri',
  '/mulakat':  'Veri Bilimi Mülakat Hazırlığı',
  '/kalori':   'Beslenme ve Kalori Takibi',
};

/* ─── Markdown renderer ─── */
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', fontSize: '12px', overflowX: 'auto', margin: '8px 0', lineHeight: 1.5, fontFamily: 'var(--font-mono, monospace)' }}>
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Heading
    if (line.startsWith('### ')) {
      elements.push(<p key={i} style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text)', margin: '10px 0 4px' }}>{inlineFormat(line.slice(4))}</p>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<p key={i} style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)', margin: '12px 0 4px' }}>{inlineFormat(line.slice(3))}</p>);
      i++; continue;
    }

    // List item
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
          <span style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '1px' }}>•</span>
          <span style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.5 }}>{inlineFormat(line.slice(2))}</span>
        </div>
      );
      i++; continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} style={{ height: '6px' }} />);
      i++; continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{ fontSize: '13px', color: 'var(--color-text-soft)', lineHeight: 1.6, margin: '2px 0' }}>
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return elements;
}

function inlineFormat(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/);

    const bIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const cIdx = codeMatch ? remaining.indexOf(codeMatch[0]) : Infinity;

    if (bIdx === Infinity && cIdx === Infinity) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (bIdx < cIdx) {
      if (bIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, bIdx)}</span>);
      parts.push(<strong key={key++} style={{ color: 'var(--color-text)' }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(bIdx + boldMatch[0].length);
    } else {
      if (cIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, cIdx)}</span>);
      parts.push(<code key={key++} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '1px 5px', fontSize: '11px', fontFamily: 'var(--font-mono, monospace)' }}>{codeMatch[1]}</code>);
      remaining = remaining.slice(cIdx + codeMatch[0].length);
    }
  }

  return parts;
}

/* ─── Main Component ─── */

export default function TutorChat() {
  const pathname = usePathname();
  if (pathname?.startsWith('/tech-center')) return null;
  return <TutorChatPanel pathname={pathname} />;
}

function TutorChatPanel({ pathname }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const topic = TOPIC_MAP[pathname] || null;

  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = topic
        ? `Merhaba! **${topic}** hakkında sorularını yanıtlamak için buradayım. Ne öğrenmek istersin?`
        : 'Merhaba! Veri bilimi, istatistik, Python veya makine öğrenmesi hakkında sorularını yanıtlamak için buradayım.';
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError('');

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    const assistantPlaceholder = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantPlaceholder]);

    try {
      abortRef.current = new AbortController();
      const resp = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || `HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const finalAccum = accumulated;
        setMessages(prev => {
          const msgs = [...prev];
          msgs[msgs.length - 1] = { role: 'assistant', content: finalAccum };
          return msgs;
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Bir hata oluştu.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function handleClose() {
    abortRef.current?.abort();
    setOpen(false);
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
    setError('');
    // Re-trigger greeting
    const greeting = topic
      ? `Merhaba! **${topic}** hakkında sorularını yanıtlamak için buradayım. Ne öğrenmek istersin?`
      : 'Merhaba! Veri bilimi, istatistik, Python veya makine öğrenmesi hakkında sorularını yanıtlamak için buradayım.';
    setMessages([{ role: 'assistant', content: greeting }]);
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '80px', right: '16px', zIndex: 60,
          width: '360px', maxWidth: 'calc(100vw - 32px)',
          background: 'var(--color-bg-raised)', border: '1px solid var(--color-border)',
          borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          maxHeight: '60vh',
        }}>

          {/* Header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
            background: 'var(--color-bg-raised)',
          }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              🧑‍🏫
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-text)' }}>AI Tutor</div>
              {topic && (
                <div style={{ fontSize: '11px', color: 'var(--color-text-mute)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {topic}
                </div>
              )}
            </div>
            <button onClick={clearChat} title="Sohbeti temizle" style={{ padding: '4px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--color-text-mute)', cursor: 'pointer', fontSize: '12px' }}>
              ↺
            </button>
            <button onClick={handleClose} style={{ padding: '4px 6px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--color-text-mute)', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '88%',
                  padding: msg.role === 'user' ? '8px 12px' : '10px 13px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? 'var(--color-accent)' : 'var(--color-bg)',
                  border: msg.role === 'assistant' ? '1px solid var(--color-border)' : 'none',
                }}>
                  {msg.role === 'user' ? (
                    <p style={{ margin: 0, fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>{msg.content}</p>
                  ) : msg.content === '' ? (
                    <div style={{ display: 'flex', gap: '4px', padding: '2px 4px' }}>
                      {[0, 1, 2].map(j => (
                        <div key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-mute)', animation: `tutorDot 1.2s ease-in-out ${j * 0.2}s infinite` }} />
                      ))}
                    </div>
                  ) : (
                    <div>{renderMarkdown(msg.content)}</div>
                  )}
                </div>
              </div>
            ))}
            {error && (
              <div style={{ fontSize: '12px', color: '#ef4444', padding: '8px 12px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
                ⚠ {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '8px', flexShrink: 0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Bir şey sor…"
              rows={1}
              style={{
                flex: 1, padding: '8px 10px', borderRadius: '8px',
                border: '1px solid var(--color-border)', background: 'var(--color-bg)',
                color: 'var(--color-text)', fontSize: '13px', resize: 'none',
                lineHeight: 1.5, outline: 'none', fontFamily: 'inherit',
                maxHeight: '80px', overflowY: 'auto',
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '8px',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                background: input.trim() && !loading ? 'var(--color-accent)' : 'var(--color-border)',
                color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                alignSelf: 'flex-end',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="AI Tutor"
        style={{
          position: 'fixed', bottom: '24px', right: '84px', zIndex: 60,
          width: '48px', height: '48px', borderRadius: '50%',
          background: open ? 'var(--color-text-soft)' : 'var(--color-accent)',
          border: 'none', cursor: 'pointer', fontSize: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, transform 0.15s',
        }}
      >
        {open ? '✕' : '🧑‍🏫'}
      </button>

      <style>{`
        @keyframes tutorDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
