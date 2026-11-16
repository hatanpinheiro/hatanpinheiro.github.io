/* Aula 4 — Classificação Digital de Imagens (Prof. Hatan Pinheiro)
   Fórmulas (KaTeX), blocos de código com cópia, fluxograma e matriz de confusão interativa. */
(function () {
'use strict';
function $(id) { return document.getElementById(id); }
function pct(v, d) { return (v * 100).toLocaleString('pt-BR', { minimumFractionDigits: d == null ? 1 : d, maximumFractionDigits: d == null ? 1 : d }) + '%'; }
function nf(v, d) { return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); }

/* ---------- Fórmulas ---------- */
if (window.renderMathInElement) {
  try { renderMathInElement(document.querySelector('main'), { delimiters: [{ left: '$$', right: '$$', display: true }], throwOnError: false }); } catch (e) { }
}

/* ---------- Blocos de código ---------- */
document.querySelectorAll('.code').forEach(function (box) {
  var lang = document.createElement('span'); lang.className = 'lang'; lang.textContent = box.dataset.lang || ''; box.appendChild(lang);
  var b = document.createElement('button'); b.type = 'button'; b.textContent = 'Copiar'; box.appendChild(b);
  b.addEventListener('click', function () {
    var t = box.querySelector('code').textContent;
    function fb() { var r = document.createRange(); r.selectNodeContents(box.querySelector('code')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selecionado'; }
    try { navigator.clipboard.writeText(t).then(function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1500); }, fb); } catch (e) { fb(); }
  });
});

/* ---------- Fluxograma da demonstração ---------- */
(function () {
  var svg = $('flow'), NS = 'http://www.w3.org/2000/svg';
  function S(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a) { if (k === 'text') e.textContent = a[k]; else e.setAttribute(k, a[k]); } (p || svg).appendChild(e); return e; }
  var W = 150, H = 80, rowA = 118, rowB = 278, cx = [99, 279, 459, 639];
  var defs = S('defs', {}), mk = S('marker', { id: 'fl-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
  S('path', { d: 'M0 0L10 5L0 10z', style: 'fill:var(--muted)' }, mk);
  S('text', { x: 24, y: 34, 'font-size': 15, 'font-weight': 600, style: 'fill:var(--ink)', text: 'A acurácia validada decide se o fluxo volta às amostras e aos atributos' });
  S('text', { x: 24, y: 56, 'font-size': 11.5, style: 'fill:var(--muted)', text: 'Fluxo da demonstração prática (Earth Engine ou QGIS, Sentinel-2 nível 2A)' });
  var g = S('g', { fill: 'none', style: 'stroke:var(--muted)', 'stroke-width': 1.25 });
  function line(d, dash) { var p = S('path', { d: d, 'marker-end': 'url(#fl-arrow)' }, g); if (dash) p.setAttribute('stroke-dasharray', '5 4'); }
  for (var i = 0; i < 3; i++) { line('M' + (cx[i] + W / 2) + ' ' + rowA + 'H' + (cx[i + 1] - W / 2)); line('M' + (cx[i] + W / 2) + ' ' + rowB + 'H' + (cx[i + 1] - W / 2)); }
  line('M' + cx[3] + ' ' + (rowA + H / 2) + 'V198H' + cx[0] + 'V' + (rowB - H / 2));
  line('M' + cx[3] + ' ' + (rowB + H / 2) + 'V350H' + cx[0] + 'V' + (rowB + H / 2), true);
  var steps = [
    ['1 Composição S2', 'máscara SCL', 'mediana anual'], ['2 Espaço espectral', 'dispersão B4 × B8', 'fronteiras de decisão'],
    ['3 Amostras (ROIs)', 'pixels puros', 'treino ≠ validação'], ['4 Separabilidade', 'Jeffries-Matusita', 'por par de classes'],
    ['5 Atributos', 'índices, MDE', 'textura, série anual'], ['6 Classificação', 'K-Means, MaxVer', 'Random Forest, SVM'],
    ['7 Pós-classificação', 'filtro de maioria', 'peneira'], ['8 Validação', 'amostra aleatória', 'estratificada, matriz']];
  steps.forEach(function (s, k) {
    var x = cx[k % 4], y = k < 4 ? rowA : rowB, main = k === 7;
    S('rect', { x: x - W / 2, y: y - H / 2, width: W, height: H, rx: 8, style: main ? 'fill:var(--accent-soft);stroke:var(--accent)' : 'fill:var(--surface);stroke:var(--muted)', 'stroke-width': main ? 2 : 1.25 });
    S('text', { x: x, y: y - 14, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600, style: 'fill:var(--ink)', text: s[0] });
    S('text', { x: x, y: y + 6, 'text-anchor': 'middle', 'font-size': 11.5, style: 'fill:var(--muted)', text: s[1] });
    S('text', { x: x, y: y + 22, 'text-anchor': 'middle', 'font-size': 11.5, style: 'fill:var(--muted)', text: s[2] });
  });
  S('text', { x: (cx[0] + cx[3]) / 2, y: 372, 'text-anchor': 'middle', 'font-size': 11.5, style: 'fill:var(--muted)', text: 'acurácia insuficiente: rever amostras (3) e atributos (5)' });
})();

/* ---------- Matriz de confusão simulada ---------- */
(function () {
  var NAMES = ['Água', 'Floresta', 'Campo', 'Solo exposto', 'Área urbana'];
  var M = {
    A: { n: [[72, 25, 1, 0, 2], [1, 93, 5, 0, 1], [0, 6, 84, 8, 2], [0, 0, 6, 70, 24], [2, 1, 2, 27, 68]], W: [0.025, 0.455, 0.30, 0.12, 0.10] },
    B: { n: [[95, 3, 1, 0, 1], [0, 96, 3, 0, 1], [0, 4, 89, 6, 1], [0, 0, 5, 86, 9], [1, 0, 2, 11, 86]], W: [0.02, 0.46, 0.30, 0.12, 0.10] }
  };
  var model = 'A', weighted = true;
  function compute() {
    var m = M[model], K = NAMES.length, P = [], i, j;
    var tot = m.n.reduce(function (s, r) { return s + r.reduce(function (a, b) { return a + b; }, 0); }, 0);
    for (i = 0; i < K; i++) { var rs = m.n[i].reduce(function (a, b) { return a + b; }, 0); P.push(m.n[i].map(function (v) { return weighted ? m.W[i] * v / rs : v / tot; })); }
    var row = P.map(function (r) { return r.reduce(function (a, b) { return a + b; }, 0); }), col = [];
    for (j = 0; j < K; j++) { col.push(P.reduce(function (s, r) { return s + r[j]; }, 0)); }
    var oa = 0, pe = 0, Q = 0, A = 0; for (i = 0; i < K; i++) { oa += P[i][i]; pe += row[i] * col[i]; Q += Math.abs(row[i] - col[i]); A += 2 * Math.min(col[i] - P[i][i], row[i] - P[i][i]); }
    return { P: P, row: row, col: col, oa: oa, k: (oa - pe) / (1 - pe), Q: Q / 2, A: A / 2, m: m };
  }
  function render() {
    var R = compute(), m = R.m, K = NAMES.length, h = '<thead><tr><th class="rh">Mapeada ↓ · Referência →</th>';
    NAMES.forEach(function (n) { h += '<th>' + n + '</th>'; });
    h += '<th>Total</th><th>W</th><th>Usuário</th></tr></thead><tbody>';
    for (var i = 0; i < K; i++) {
      h += '<tr><th class="rh">' + NAMES[i] + '</th>';
      for (var j = 0; j < K; j++) { var v = m.n[i][j]; h += '<td class="' + (i === j ? 'd' : v ? 'e' : '') + '">' + (weighted ? nf(R.P[i][j] * 100, 2) : v) + '</td>'; }
      h += '<td class="t">' + (weighted ? nf(R.row[i] * 100, 2) : 100) + '</td><td class="t">' + nf(m.W[i], 3) + '</td><td class="t">' + pct(R.P[i][i] / R.row[i]) + '</td></tr>';
    }
    h += '<tr><th class="rh">Produtor</th>' + R.col.map(function (c, j) { return '<td class="t">' + pct(R.P[j][j] / c) + '</td>'; }).join('') + '<td></td><td></td><td></td></tr></tbody>';
    $('cmx').innerHTML = h;
    $('m-oa').textContent = pct(R.oa); $('m-k').textContent = nf(R.k, 2); $('m-q').textContent = pct(R.Q); $('m-a').textContent = pct(R.A);
    $('qa-c').style.width = (R.oa * 100) + '%'; $('qa-q').style.width = (R.Q * 100) + '%'; $('qa-a').style.width = (R.A * 100) + '%';
    $('m-txt').innerHTML = (weighted ? 'Células em % da área (p<sub>ij</sub> = W<sub>i</sub> n<sub>ij</sub> / n<sub>i+</sub>). ' : 'Células em número de pontos; a exatidão global da amostra não estima a do mapa quando W difere entre classes. ') +
      'Discordância total = ' + pct(1 - R.oa) + ', da qual ' + pct(R.Q) + ' é de quantidade e ' + pct(R.A) + ' de alocação.' + (model === 'A' ? ' Observe a coluna Floresta na linha Água (sombra topográfica) e o par Solo exposto × Área urbana.' : ' Compare com o modelo A: a redução ocorre sobretudo na alocação.');
  }
  function seg(el, cb) { var bs = el.querySelectorAll('button'); bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); cb(b.dataset.v); }); }); }
  seg($('seg-model'), function (v) { model = v; render(); });
  seg($('seg-w'), function (v) { weighted = v === 'w'; render(); });
  render();
})();

/* ---------- Navegação ativa ---------- */
(function () {
  var links = document.querySelectorAll('#navlinks a'), map = {}; links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove('on'); }); var a = map[e.target.id]; if (a) { a.classList.add('on'); try { a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (_) { } } } }); }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main .step').forEach(function (s) { io.observe(s); });
})();
})();
