'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const W = 600, H = 320;
const COLORS = { pos: '#1D9E75', neg: '#E24B4A', neuron: '#7F77DD', active: '#FFD700', input: '#5DCAA5', output: '#e8a04a' };

function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
function relu(x) { return Math.max(0, x); }

function getNeuronPos(layers, layer, neuron) {
  const x = 60 + layer * (W - 120) / (layers.length - 1);
  const n = layers[layer];
  const spacing = Math.min(60, H * 0.85 / Math.max(n, 1));
  const totalH = (n - 1) * spacing;
  const y = H / 2 - totalH / 2 + neuron * spacing;
  return { x, y };
}

function initWeights(layers) {
  return layers.slice(0, -1).map((n, l) =>
    Array.from({ length: n }, () =>
      Array.from({ length: layers[l + 1] }, () => (Math.random() - 0.5) * 2)
    )
  );
}

function forwardPass(layers, weights) {
  const acts = [Array.from({ length: layers[0] }, () => Math.random())];
  for (let l = 1; l < layers.length; l++) {
    acts.push(Array.from({ length: layers[l] }, (_, j) => {
      const sum = acts[l - 1].reduce((s, a, i) => s + a * (weights[l - 1]?.[i]?.[j] ?? 0), 0);
      return l === layers.length - 1 ? sigmoid(sum) : relu(sum);
    }));
  }
  return acts;
}

function NeuralNetDemo() {
  const svgRef = useRef(null);
  const animRef = useRef(null);
  const autoRef = useRef(null);
  const stateRef = useRef({ phase: -1, t: 0, layers: [3,4,4,2], weights: [], acts: [] });
  const [layers, setLayers] = useState([3, 4, 4, 2]);
  const [info, setInfo] = useState('Katman boyutlarını ayarla, sonra "Sinyal gönder" ile verinin ağdan nasıl aktığını izle.');
  const [isAuto, setIsAuto] = useState(false);
  const [stats, setStats] = useState({ neurons: 13, weights: 0 });

  const draw = useCallback((ls, ws, acts, phase, t) => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = '';

    const totalW = ls.slice(0,-1).reduce((s, n, l) => s + n * ls[l+1], 0);

    for (let l = 0; l < ls.length - 1; l++) {
      for (let i = 0; i < ls[l]; i++) {
        for (let j = 0; j < ls[l+1]; j++) {
          const p1 = getNeuronPos(ls, l, i);
          const p2 = getNeuronPos(ls, l+1, j);
          const w = ws[l]?.[i]?.[j] ?? 0;
          const isActive = phase === l;
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', p1.x); line.setAttribute('y1', p1.y);
          line.setAttribute('x2', p2.x); line.setAttribute('y2', p2.y);
          line.setAttribute('stroke', w > 0 ? COLORS.pos : COLORS.neg);
          line.setAttribute('stroke-width', Math.abs(w) * 1.5 + 0.3);
          line.setAttribute('opacity', isActive ? '0.7' : '0.25');
          svg.appendChild(line);

          if (isActive) {
            const px = p1.x + (p2.x - p1.x) * t;
            const py = p1.y + (p2.y - p1.y) * t;
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', px); dot.setAttribute('cy', py); dot.setAttribute('r', 4);
            dot.setAttribute('fill', w > 0 ? COLORS.pos : COLORS.neg); dot.setAttribute('opacity', '0.9');
            svg.appendChild(dot);
          }
        }
      }
    }

    for (let l = 0; l < ls.length; l++) {
      for (let n = 0; n < ls[l]; n++) {
        const { x, y } = getNeuronPos(ls, l, n);
        const val = acts[l]?.[n] ?? 0;
        const isActiveNeuron = phase >= 0 && l <= phase && val > 0.5;
        const fill = isActiveNeuron ? COLORS.active : l === 0 ? COLORS.input : l === ls.length - 1 ? COLORS.output : COLORS.neuron;
        const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 14);
        c.setAttribute('fill', fill); c.setAttribute('stroke', '#fff'); c.setAttribute('stroke-width', '2');
        svg.appendChild(c);
        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', x); txt.setAttribute('y', y + 4);
        txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('font-size', '9');
        txt.setAttribute('fill', '#fff'); txt.setAttribute('font-weight', '600');
        txt.textContent = val.toFixed(1);
        svg.appendChild(txt);
      }
      const labels = ['Girdi', 'Gizli 1', 'Gizli 2', 'Çıktı'];
      const { x } = getNeuronPos(ls, l, 0);
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', x); lbl.setAttribute('y', H - 8);
      lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('font-size', '11'); lbl.setAttribute('fill', '#888780');
      lbl.textContent = labels[l] ?? `Katman ${l}`;
      svg.appendChild(lbl);
    }
    setStats({ neurons: ls.reduce((a,b) => a+b, 0), weights: totalW });
  }, []);

  const fireSignal = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const s = stateRef.current;
    s.acts = forwardPass(s.layers, s.weights);
    s.phase = 0; s.t = 0;

    const step = () => {
      s.t += 0.05;
      if (s.t >= 1) {
        s.t = 0; s.phase++;
        if (s.phase >= s.layers.length - 1) {
          s.phase = -1;
          draw(s.layers, s.weights, s.acts, -1, 0);
          setInfo(`İleri besleme tamamlandı. Çıktı: ${s.acts[s.layers.length-1].map(v=>v.toFixed(3)).join(', ')} — Her nöron önceki katmanın ağırlıklı toplamının aktivasyon fonksiyonundan geçirilmiş hali.`);
          return;
        }
      }
      draw(s.layers, s.weights, s.acts, s.phase, s.t);
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
  }, [draw]);

  useEffect(() => {
    const s = stateRef.current;
    s.layers = layers;
    s.weights = initWeights(layers);
    s.acts = layers.map(n => Array(n).fill(0));
    draw(layers, s.weights, s.acts, -1, 0);
  }, [layers, draw]);

  const toggleAuto = () => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; setIsAuto(false); }
    else { setIsAuto(true); fireSignal(); autoRef.current = setInterval(fireSignal, 2600); }
  };

  const reset = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; setIsAuto(false); }
    const s = stateRef.current;
    s.weights = initWeights(s.layers);
    s.acts = s.layers.map(n => Array(n).fill(0));
    draw(s.layers, s.weights, s.acts, -1, 0);
    setInfo('Ağırlıklar sıfırlandı. Sinyal gönder butonuna bas.');
  };

  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
        {[
          { label: 'Girdi katmanı', id: 0, max: 6 },
          { label: 'Gizli katman 1', id: 1, max: 8 },
          { label: 'Gizli katman 2', id: 2, max: 8 },
          { label: 'Çıktı katmanı', id: 3, max: 4 },
        ].map(({ label, id, max }) => (
          <div key={id} className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs mb-2" style={{ color: 'var(--color-text-mute)' }}>{label}</div>
            <input type="range" min="1" max={max} value={layers[id]} className="w-full"
              onChange={e => {
                const next = [...layers];
                next[id] = parseInt(e.target.value);
                setLayers(next);
              }} />
            <div className="text-sm font-medium mt-1">{layers[id]} nöron</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" />
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={fireSignal} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">▶ Sinyal gönder</button>
        <button onClick={toggleAuto} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          {isAuto ? '⏹ Durdur' : '🔄 Otomatik'}
        </button>
        <button onClick={reset} className="flex-1 min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Sıfırla</button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Toplam nöron</div>
          <div className="text-2xl font-medium">{stats.neurons}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Toplam bağlantı</div>
          <div className="text-2xl font-medium">{stats.weights}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-mute)' }}>Aktivasyon</div>
          <div className="text-sm font-medium mt-1">ReLU / Sigmoid</div>
        </div>
      </div>

      <p className="p-3 bg-gray-50 rounded-lg text-sm leading-relaxed" style={{ color: 'var(--color-text-soft)' }}>
        {info}
      </p>
    </div>
  );
}

export default function SinirAgiPage() {
  return (
    <main className="min-h-screen">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex justify-between items-center" style={{ borderBottom: '0.5px solid var(--color-border)' }}>
        <div className="flex items-center gap-2.5">
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
          <a href="/" className="font-serif text-lg font-medium" style={{ color: 'var(--color-text)' }}>Sıfır Gecikme</a>
        </div>
        <div className="flex gap-6 text-sm" style={{ color: 'var(--color-text-soft)' }}>
          <a href="/" style={{ color: 'var(--color-text)', fontWeight: 500 }}>Yazılar</a>
          <a href="#">Demolar</a>
          <a href="#">Araçlar</a>
          <a href="/hakkimda">Hakkımda</a>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 prose-article">
        <a href="/" className="text-xs mb-6 inline-block" style={{ color: 'var(--color-text-mute)' }}>Ana sayfa</a>
        <span className="badge badge-interactive inline-block mb-3">interaktif</span>

        <h1 className="font-serif text-4xl font-medium leading-tight mb-3" style={{ color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
          Sinir ağı visualizer: veri nasıl akar?
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-mute)' }}>2026 · 12 dakika okuma</p>

        <p>
          Sinir ağları hakkında her yerde "insan beyninden ilham alındı" yazıyor.
          Ama gerçekte ne oluyor? Veri bir uçtan giriyor, öbür uçtan çıkıyor — arada ne var?
        </p>
        <p>
          Cevap: matris çarpımları ve aktivasyon fonksiyonları. Demoya bak, sonra anlat.
        </p>

        <h2>Önce dene</h2>
        <p>
          Katman boyutlarını ayarla. Sinyal gönder, verinin ağdan nasıl aktığını izle.
          Sarı parlayan nöronlar aktif, bağlantı kalınlığı ağırlığı, rengi işareti temsil ediyor.
        </p>

        <NeuralNetDemo />

        <h2>Nöron ne yapar?</h2>
        <p>
          Her nöron üç şey yapar: girdi toplar, ağırlıklarla çarpar, aktivasyon uygular.
        </p>

        <pre>{`# Tek bir nöronun hesabı
def neuron(inputs, weights, bias):
    # 1. Ağırlıklı toplam (dot product)
    z = sum(x * w for x, w in zip(inputs, weights)) + bias
    
    # 2. Aktivasyon fonksiyonu uygula
    output = relu(z)   # veya sigmoid(z)
    return output

def relu(z):
    return max(0, z)   # negatifse 0, pozitifse kendisi

def sigmoid(z):
    return 1 / (1 + exp(-z))  # 0 ile 1 arasına sıkıştır`}</pre>

        <h2>Katmanlar ve ileri besleme</h2>
        <p>
          Bir katmanın tüm nöronları hesaplandıktan sonra sonraki katmana geçilir.
          Buna <strong>ileri besleme (forward pass)</strong> denir.
        </p>

        <pre>{`import numpy as np

def forward_pass(X, weights, biases):
    """
    X: girdi verisi (n_samples, n_features)
    weights: her katman için ağırlık matrisi listesi
    biases: her katman için bias vektörü listesi
    """
    activations = X
    
    for W, b in zip(weights[:-1], biases[:-1]):
        z = activations @ W + b     # matris çarpımı
        activations = relu(z)       # gizli katmanlarda ReLU
    
    # Son katman: sınıflandırma için softmax
    z = activations @ weights[-1] + biases[-1]
    output = softmax(z)
    
    return output

def relu(z):
    return np.maximum(0, z)

def softmax(z):
    e = np.exp(z - z.max(axis=1, keepdims=True))
    return e / e.sum(axis=1, keepdims=True)`}</pre>

        <h2>Ağırlıklar nasıl öğrenir?</h2>
        <p>
          Demoda ağırlıklar rastgele. Gerçek hayatta <strong>geri yayılım (backpropagation)</strong>
          ile öğrenilir. Hata hesaplanır, gradient descent ile ağırlıklar güncellenir.
          Binlerce kez tekrarlanır.
        </p>

        <blockquote style={{ borderLeft: '3px solid var(--color-accent)', paddingLeft: '20px', margin: '2rem 0' }}>
          <p style={{ fontStyle: 'italic', marginBottom: 0 }}>
            GPT gibi modellerde milyarlarca ağırlık var. Ama her ağırlık aynı prensibi
            takip eder: hatayı azaltmak için gradient yönünde biraz güncelle.
            Gradient descent demosumuzu hatırlıyor musun?
          </p>
        </blockquote>

        <pre>{`import torch
import torch.nn as nn

# PyTorch ile basit sinir ağı
class SimpleNN(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, output_size),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        return self.network(x)

# Model oluştur
model = SimpleNN(input_size=3, hidden_size=4, output_size=2)

# Eğit
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = nn.BCELoss()

for epoch in range(100):
    optimizer.zero_grad()
    output = model(X_train)
    loss = criterion(output, y_train)
    loss.backward()    # gradientleri hesapla
    optimizer.step()   # ağırlıkları güncelle`}</pre>

        <h2>Aktivasyon fonksiyonları neden gerekli?</h2>
        <p>
          Aktivasyon fonksiyonu olmasa tüm katmanlar tek bir doğrusal dönüşüme indirgenir.
          Ne kadar katman ekleersen ekle, model doğrusal ilişkileri ancak öğrenebilir.
          ReLU, Sigmoid, Tanh gibi fonksiyonlar <strong>doğrusal olmayan</strong> ilişkileri
          öğrenmesi için gereklidir.
        </p>

        <ul>
          <li><strong>ReLU:</strong> Gizli katmanlarda en yaygın. Hızlı, gradient kaybolma sorununu azaltır.</li>
          <li><strong>Sigmoid:</strong> İkili sınıflandırma çıktısı için. 0-1 arası değer üretir.</li>
          <li><strong>Softmax:</strong> Çok sınıflı sınıflandırma için. Tüm çıktılar toplamı 1&apos;e eşit.</li>
          <li><strong>Tanh:</strong> -1 ile 1 arasında. RNN&apos;lerde yaygın.</li>
        </ul>

        <p style={{ color: 'var(--color-text-soft)', marginTop: '2.5rem' }}>
          Sıradaki yazıda <strong>Central Limit Theorem</strong>: farklı dağılımlardan
          örneklem çek, ortalamaların neden normale yakınsadığını izle.
        </p>
      </article>

      <footer className="max-w-3xl mx-auto px-6 py-8 flex justify-between text-xs" style={{ borderTop: '0.5px solid var(--color-border)', color: 'var(--color-text-mute)' }}>
        <span>Ali Apaydın · {new Date().getFullYear()}</span>
        <span className="flex gap-3">
          <a href="https://x.com/sifirgecikme" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://github.com/aliapaydin" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/aliapaydin35" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </span>
      </footer>
    </main>
  );
}
