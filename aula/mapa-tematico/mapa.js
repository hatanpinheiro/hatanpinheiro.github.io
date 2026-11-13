/* Aula 3 — Produção de Mapa Temático no QGIS (Prof. Hatan Pinheiro)
   Layout, escala e PEC, UTM/SIRGAS 2000, cores e acessibilidade, generalização, áreas e metadados. */
(function () {
'use strict';
var N = 200, NP = N * N, NC = 5;
var NAMES = ['Água', 'Vegetação densa', 'Vegetação rala', 'Solo exposto', 'Área construída'];
var PAL = {
  conv: ['#2a62b0', '#2b8a3c', '#9ccc5a', '#d4831f', '#8a8d96'],
  seq: ['#08306b', '#2171b5', '#6baed6', '#c6dbef', '#f7fbff'],
  arb: ['#2b8a3c', '#d62728', '#1f77b4', '#8c564b', '#e377c2']
};
var NS = 'http://www.w3.org/2000/svg';
function $(id) { return document.getElementById(id); }
function nf(v, d) { return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function int(v) { return Math.round(v).toLocaleString('pt-BR'); }
function pct(v, d) { return nf(v * 100, d == null ? 1 : d) + '%'; }
var store = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
function S(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) { if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); } if (parent) parent.appendChild(e); return e; }
function segGroup(el, cb) { var bs = el.querySelectorAll('button'); bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); cb(b.dataset.v); }); }); }
function hex(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
function toHex(c) { return '#' + c.map(function (v) { var s = Math.round(Math.max(0, Math.min(255, v))).toString(16); return s.length < 2 ? '0' + s : s; }).join(''); }

/* ---------- Cor: simulação de deficiência de visão de cores e ΔE ---------- */
var CVD = {
  prot: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deut: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  trit: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]]
};
function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
function unlin(v) { v = Math.max(0, Math.min(1, v)); return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); }
function simulate(rgb, mode) {
  if (mode === 'none') return rgb.slice();
  var l = rgb.map(lin);
  if (mode === 'gray') { var y = 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2], g = unlin(y); return [g, g, g]; }
  var M = CVD[mode]; return M.map(function (r) { return unlin(r[0] * l[0] + r[1] * l[1] + r[2] * l[2]); });
}
function lab(rgb) {
  var l = rgb.map(lin), X = (0.4124 * l[0] + 0.3576 * l[1] + 0.1805 * l[2]) / 0.95047, Y = 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2], Z = (0.0193 * l[0] + 0.1192 * l[1] + 0.9505 * l[2]) / 1.08883;
  function f(t) { return t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116; }
  var fx = f(X), fy = f(Y), fz = f(Z); return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
function dE(a, b) { var p = lab(a), q = lab(b); return Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2) + Math.pow(p[2] - q[2], 2)); }

/* ---------- Estado compartilhado ---------- */
var palKey = 'conv', cvd = 'none', custom = store.get('sr3-custom', PAL.conv.slice());
function palette() { return palKey === 'custom' ? custom : PAL[palKey]; }
function shown() { return palette().map(function (h) { return simulate(hex(h), cvd); }); }
var MAPS = {};

/* ---------- Mapas ---------- */
function decode(uri) {
  return new Promise(function (res, rej) {
    var im = new Image(); im.onload = function () { var c = document.createElement('canvas'); c.width = N; c.height = N; var x = c.getContext('2d'); x.drawImage(im, 0, 0); var d = x.getImageData(0, 0, N, N).data, out = new Uint8Array(NP); for (var p = 0; p < NP; p++) out[p] = Math.round(d[p * 4] / 50); res(out); }; im.onerror = rej; im.src = uri;
  });
}
var off = document.createElement('canvas'); off.width = N; off.height = N;
var offx = off.getContext('2d'), offimg = offx.createImageData(N, N);
function renderLabels(labels, cols, extra) {
  var d = offimg.data;
  for (var p = 0; p < NP; p++) { var c = extra ? extra(p) : cols[labels[p]], q = p * 4; d[q] = c[0]; d[q + 1] = c[1]; d[q + 2] = c[2]; d[q + 3] = 255; }
  offx.putImageData(offimg, 0, 0); return off;
}
function paint(cv, labels, cols, extra) { var ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false; renderLabels(labels, cols, extra); ctx.drawImage(off, 0, 0, cv.width, cv.height); }

/* =========================================================
   2. Layout
   ========================================================= */
var ELS = [
  { k: 'titulo', n: 'Título', on: true, d: 'Informa o quê, onde e quando. Deve ser curto e específico; o período de referência evita leituras fora de contexto.' },
  { k: 'legenda', n: 'Legenda', on: true, d: 'Lista todas as classes representadas, com a mesma simbologia do mapa e nomes compreensíveis, em ordem lógica.' },
  { k: 'escala', n: 'Escala', on: true, d: 'A escala gráfica permanece correta quando o mapa é ampliado ou reduzido; a numérica vale apenas para o tamanho impresso.' },
  { k: 'norte', n: 'Orientação (norte)', on: true, d: 'Indica a direção do norte. Com grade de coordenadas, a orientação também pode ser lida pela própria grade.' },
  { k: 'grade', n: 'Grade de coordenadas', on: false, d: 'Permite localizar feições e verificar posições. Os rótulos devem estar no sistema de referência informado.' },
  { k: 'src', n: 'Sistema de referência', on: false, d: 'Informa datum e projeção (ex.: SIRGAS 2000 / UTM zona 22S, EPSG:31982). Sem ele, as coordenadas não podem ser interpretadas.' },
  { k: 'fonte', n: 'Fonte e data da imagem', on: true, d: 'Identifica a origem dos dados e a data de aquisição: o uso da terra muda com o tempo.' },
  { k: 'acuracia', n: 'Acurácia temática', on: false, d: 'Informa exatidão global e kappa (ou discordâncias), permitindo ao leitor avaliar a confiabilidade das classes.' },
  { k: 'autoria', n: 'Autoria e data de elaboração', on: true, d: 'Identifica o responsável pelo mapa e quando foi produzido.' },
  { k: 'local', n: 'Mapa de localização', on: false, d: 'Situa a área de estudo em um contexto mais amplo (município, estado ou país).' }];
var MAPINFO = { d: 'Mapa: elemento dominante da folha. A área mapeada, a moldura e a simbologia das classes devem ser legíveis na escala de impressão.' };
var selEl = null, sheet = $('sheet');
(function () {
  var box = $('toggles'), saved = store.get('sr3-layout', null);
  ELS.forEach(function (e) {
    if (saved && saved[e.k] !== undefined) e.on = saved[e.k];
    var l = document.createElement('label'); l.innerHTML = '<input type="checkbox" id="t-' + e.k + '"' + (e.on ? ' checked' : '') + '> ' + e.n; box.appendChild(l);
    l.querySelector('input').addEventListener('change', function () { e.on = this.checked; var s = {}; ELS.forEach(function (x) { s[x.k] = x.on; }); store.set('sr3-layout', s); drawSheet(); });
  });
  ['f-title', 'f-author', 'f-source', 'f-date'].forEach(function (id) { var v = store.get('sr3-' + id, null); if (v !== null) $(id).value = v; $(id).addEventListener('input', function () { store.set('sr3-' + id, this.value); drawSheet(); }); });
})();
function on(k) { return ELS.filter(function (e) { return e.k === k; })[0].on; }
function group(k) { var g = S('g', { 'class': 'el' + (selEl === k ? ' sel' : ''), 'data-k': k, tabindex: 0, role: 'button' }, sheet); g.addEventListener('click', function () { pick(k); }); g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(k); } }); return g; }
function pick(k) { selEl = k; var e = k === 'mapa' ? MAPINFO : ELS.filter(function (x) { return x.k === k; })[0]; $('el-info').innerHTML = '<strong>' + (k === 'mapa' ? 'Mapa' : e.n) + '.</strong> ' + e.d; drawSheet(); }
var ACC = { oa: null, k: null };
function drawSheet() {
  while (sheet.firstChild) sheet.removeChild(sheet.firstChild);
  S('rect', { x: 0, y: 0, width: 297, height: 210, fill: '#ffffff' }, sheet);
  S('rect', { x: 2, y: 2, width: 293, height: 206, fill: 'none', stroke: '#333', 'stroke-width': .5 }, sheet);
  var cols = shown(), mx = 12, my = 23, mw = 165;
  var title = $('f-title').value.trim();
  if (on('titulo')) { var g = group('titulo'); S('rect', { 'class': 'hit', x: 20, y: 6, width: 257, height: 11 }, g); S('text', { x: 148.5, y: 14, 'text-anchor': 'middle', 'font-size': 6.4, 'font-weight': 700, text: (title || '(título vazio)').toUpperCase() }, g); }
  var gm = group('mapa'); renderLabels(MAPS.classif, cols);
  S('image', { href: off.toDataURL(), x: mx, y: my, width: mw, height: mw, style: 'image-rendering:pixelated', preserveAspectRatio: 'none' }, gm);
  S('rect', { 'class': 'hit', x: mx, y: my, width: mw, height: mw }, gm); S('rect', { x: mx, y: my, width: mw, height: mw, fill: 'none', stroke: '#333', 'stroke-width': .4 }, gm);
  if (on('grade')) {
    var gg = group('grade'); S('rect', { 'class': 'hit', x: mx - 6, y: my, width: mw + 6, height: mw + 8 }, gg);
    for (var i = 0; i <= 4; i++) {
      var x = mx + i * mw / 4, y = my + i * mw / 4;
      S('line', { x1: x, x2: x, y1: my, y2: my + mw, stroke: '#000', 'stroke-width': .2, opacity: .6 }, gg);
      S('line', { x1: mx, x2: mx + mw, y1: y, y2: y, stroke: '#000', 'stroke-width': .2, opacity: .6 }, gg);
      S('text', { x: x, y: my + mw + 5, 'text-anchor': 'middle', 'font-size': 2.6, text: int(552000 + i * 500) }, gg);
      S('text', { x: mx - 2, y: y, 'text-anchor': 'middle', 'font-size': 2.6, transform: 'rotate(-90 ' + (mx - 2) + ' ' + y + ')', text: int(6834000 - i * 500) }, gg);
    }
  }
  if (on('norte')) { var gn = group('norte'); S('rect', { 'class': 'hit', x: 262, y: 14, width: 20, height: 30 }, gn); S('polygon', { points: '267,42 272,24 277,42 272,38', fill: '#000' }, gn); S('text', { x: 272, y: 21, 'text-anchor': 'middle', 'font-size': 5, 'font-weight': 700, text: 'N' }, gn); }
  if (on('legenda')) {
    var gl = group('legenda'); S('rect', { 'class': 'hit', x: 188, y: 44, width: 54, height: 50 }, gl);
    S('text', { x: 190, y: 50, 'font-size': 4.2, 'font-weight': 700, text: 'Legenda' }, gl);
    for (var k = 0; k < NC; k++) { S('rect', { x: 190, y: 54 + k * 8, width: 7, height: 5, fill: toHex(cols[k]), stroke: '#333', 'stroke-width': .2 }, gl); S('text', { x: 200, y: 57.8 + k * 8, 'font-size': 3.4, text: NAMES[k] }, gl); }
  }
  if (on('escala')) {
    var gs = group('escala'), sb = 82.5 / 4; S('rect', { 'class': 'hit', x: 188, y: 96, width: 96, height: 30 }, gs);
    S('text', { x: 190, y: 101, 'font-size': 3.4, text: 'Escala gráfica' }, gs);
    for (i = 0; i < 4; i++) S('rect', { x: 190 + i * sb, y: 104, width: sb, height: 2.6, fill: i % 2 ? '#fff' : '#000', stroke: '#000', 'stroke-width': .25 }, gs);
    ['0', '250', '500', '750', '1.000 m'].forEach(function (t, i) { S('text', { x: 190 + i * sb, y: 111, 'text-anchor': 'middle', 'font-size': 2.8, text: t }, gs); });
    S('text', { x: 190, y: 118, 'font-size': 3.2, text: 'Escala numérica 1:' + int(2000 / 0.165) + ' (impressão A4)' }, gs);
  }
  if (on('local')) {
    var go = group('local'); S('rect', { 'class': 'hit', x: 244, y: 47, width: 44, height: 46 }, go);
    S('text', { x: 266, y: 51, 'text-anchor': 'middle', 'font-size': 3, text: 'Mapa de localização' }, go);
    S('rect', { x: 245, y: 54, width: 42, height: 38, fill: '#eef2f7', stroke: '#333', 'stroke-width': .3 }, go);
    S('polygon', { points: '251,88 254,60 272,57 283,73 276,87', fill: '#d9e2ee', stroke: '#666', 'stroke-width': .3 }, go);
    S('rect', { x: 266, y: 74, width: 4, height: 4, fill: '#c0392b' }, go);
  }
  var lines = [];
  if (on('src')) lines.push(['src', 'Sistema de referência: SIRGAS 2000 / UTM zona 22S (EPSG:31982)']);
  if (on('fonte')) lines.push(['fonte', 'Fonte: ' + ($('f-source').value || '—') + '; imagem de ' + ($('f-date').value || '—')]);
  if (on('acuracia')) lines.push(['acuracia', 'Acurácia: exatidão global ' + (ACC.oa == null ? '—' : pct(ACC.oa)) + '; kappa ' + (ACC.k == null ? '—' : nf(ACC.k, 2))]);
  if (on('autoria')) lines.push(['autoria', 'Elaboração: ' + ($('f-author').value || '—') + ' · ' + new Date().toLocaleDateString('pt-BR')]);
  lines.forEach(function (l, i) { var g = group(l[0]), y = 134 + i * 7; S('rect', { 'class': 'hit', x: 188, y: y - 4.5, width: 104, height: 6.4 }, g); S('text', { x: 190, y: y, 'font-size': 3.05, text: l[1] }, g); });
  /* Verificação */
  var ul = $('lay-checks'), ok = 0; ul.innerHTML = '';
  ELS.forEach(function (e) {
    var good = e.on, why = e.on ? '' : 'ausente';
    if (e.k === 'titulo' && e.on) { if (!title) { good = false; why = 'título vazio'; } else if (!/\d{4}/.test(title)) { good = false; why = 'indicar o período (ano) no título'; } }
    if (e.k === 'fonte' && e.on && (!$('f-source').value.trim() || !$('f-date').value.trim())) { good = false; why = 'preencher fonte e data da imagem'; }
    if (e.k === 'autoria' && e.on && !$('f-author').value.trim()) { good = false; why = 'preencher autoria'; }
    if (good) ok++;
    var li = document.createElement('li'); li.className = good ? 'ok' : 'no'; li.innerHTML = '<span class="st">' + (good ? '✓' : '✗') + '</span><span>' + e.n + (why ? ' <span class="muted">(' + why + ')</span>' : '') + '</span>'; ul.appendChild(li);
  });
  $('lay-meter').style.width = (ok / ELS.length * 100) + '%';
  $('lay-score').innerHTML = '<strong>' + ok + ' de ' + ELS.length + '</strong> elementos atendidos.' + (ok === ELS.length ? ' O mapa pode ser lido e avaliado sem explicação oral.' : '');
}

/* =========================================================
   3. Escala e PEC
   ========================================================= */
var SCALES = [5000, 10000, 20000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000];
var PEC = [['A', 0.5], ['B', 0.8], ['C', 1.0]];
var curScale = 25000;
function updScale() {
  var S_ = SCALES[+$('sl-scale').value], err = +$('sl-err').value, mmu = +$('sl-mmu').value; curScale = S_;
  $('o-scale').textContent = '1:' + int(S_); $('o-err').textContent = int(err) + ' m'; $('o-mmu').textContent = nf(mmu, 2) + ' ha';
  var best = null;
  $('pec-tb').innerHTML = PEC.map(function (c) { var m = c[1] * S_ / 1000, okc = err <= m; if (okc && !best) best = c[0]; return '<tr><td><strong>' + c[0] + '</strong></td><td class="mono">' + nf(c[1], 1) + ' mm</td><td class="mono">' + nf(m, 1) + ' m</td><td><span class="pill ' + (okc ? 'ok' : 'no') + '">' + (okc ? 'atende' : 'não atende') + '</span></td></tr>'; }).join('');
  var pix = 10 / (S_ / 1000), area = mmu * 10000 * Math.pow(1000 / S_, 2);
  $('o-pix').textContent = nf(pix, pix < 0.1 ? 3 : 2) + ' mm'; $('o-mmupaper').textContent = nf(area, area < 1 ? 2 : 1) + ' mm²';
  $('o-mmupix').textContent = int(mmu * 100) + ' pixels'; $('o-cm').textContent = int(S_ / 100) + ' m';
  var maxS = PEC.map(function (c) { return c[0] + ' até 1:' + int(err / (c[1] / 1000)); }).join('; ');
  $('o-scalemsg').innerHTML = (best ? 'Na escala 1:' + int(S_) + ', um erro posicional de ' + int(err) + ' m atende ao PEC <strong>classe ' + best + '</strong>.' : 'Na escala 1:' + int(S_) + ', um erro de ' + int(err) + ' m <strong>não atende</strong> a nenhuma classe do PEC: a escala é grande demais para o dado.') +
    ' Escala máxima compatível com esse erro: ' + maxS + '.' + (pix > 1 ? ' Atenção: cada pixel de 10 m ocupa mais de 1 mm no papel; a estrutura de pixels ficará visível.' : '');
}
['sl-scale', 'sl-err', 'sl-mmu'].forEach(function (id) { $(id).addEventListener('input', updScale); });

/* =========================================================
   4. UTM
   ========================================================= */
var zsvg = $("zones"), L0 = -76.5, L1 = -28;
function zx(l) { return 10 + (l - L0) / (L1 - L0) * 460; }
(function () {
  for (var z = 18; z <= 25; z++) {
    var a = Math.max(L0, -180 + 6 * (z - 1)), b = Math.min(L1, -180 + 6 * z), mc = 6 * z - 183;
    S('rect', { x: zx(a), y: 18, width: zx(b) - zx(a), height: 60, style: 'fill:var(' + (z % 2 ? '--surface-2' : '--accent-soft') + ')' }, zsvg);
    S('line', { x1: zx(mc), x2: zx(mc), y1: 18, y2: 78, style: 'stroke:var(--accent);stroke-dasharray:3 3' }, zsvg);
    S('text', { x: zx(mc), y: 13, 'text-anchor': 'middle', 'font-size': 11, style: 'fill:var(--accent);font-weight:600', text: z + 'S' }, zsvg);
  }
  [-70, -60, -50, -40, -30].forEach(function (l) { S('text', { x: zx(l), y: 94, 'text-anchor': 'middle', 'font-size': 10, style: 'fill:var(--muted)', text: l + '°' }, zsvg); });
  S('text', { x: 240, y: 112, 'text-anchor': 'middle', 'font-size': 10, style: 'fill:var(--muted)', text: 'Longitude (meridianos centrais tracejados)' }, zsvg);
})();
var zmark = S('g', {}, zsvg); S('line', { y1: 14, y2: 82, style: 'stroke:var(--no);stroke-width:2.5' }, zmark); S('circle', { cy: 48, r: 5, style: 'fill:var(--no)' }, zmark);
function updUTM() {
  var lon = +$('sl-lon').value, lat = +$('sl-lat').value;
  $('o-lon').textContent = nf(Math.abs(lon), 1) + '° O'; $('o-lat').textContent = nf(Math.abs(lat), 1) + '° ' + (lat < 0 ? 'S' : 'N');
  var z = Math.floor((lon + 180) / 6) + 1, mc = 6 * z - 183, south = lat < 0;
  $('o-zone').textContent = z + (south ? 'S' : 'N'); $('o-mc').textContent = Math.abs(mc) + '° O';
  $('o-epsg').textContent = south && z >= 17 && z <= 25 ? String(31960 + z) : 'consultar';
  var phi = lat * Math.PI / 180, B = Math.cos(phi) * Math.sin((lon - mc) * Math.PI / 180), k = 0.9996 / Math.sqrt(1 - B * B);
  $('o-k').textContent = nf(k, 5); $('o-area').textContent = (k * k - 1 >= 0 ? '+' : '') + nf((k * k - 1) * 100, 3) + '%';
  var R = 6371008.8, d = 0.0001 * Math.PI / 180, a = R * d * R * Math.cos(phi) * d, a0 = R * d * R * d;
  $('o-deg').textContent = nf(a, 1) + ' m²';
  zmark.setAttribute('transform', 'translate(' + zx(lon) + ',0)');
  $('o-projmsg').innerHTML = 'A área está na zona <strong>' + z + (south ? 'S' : 'N') + '</strong>' + (south && z >= 17 && z <= 25 ? ' (SIRGAS 2000 / UTM zona ' + z + 'S, <strong>EPSG:' + (31960 + z) + '</strong>)' : '') + '. A ' + nf(Math.abs(lon - mc), 1) + '° do meridiano central, distâncias são ' + (k >= 1 ? 'ampliadas' : 'reduzidas') + ' em ' + nf(Math.abs(k - 1) * 100, 3) + '%. Em coordenadas geográficas, uma “célula” de 0,0001° tem ' + nf(a, 1) + ' m² nesta latitude e ' + nf(a0, 1) + ' m² no Equador: o grau não é unidade de área constante.';
}
['sl-lon', 'sl-lat'].forEach(function (id) { $(id).addEventListener('input', updUTM); });

/* =========================================================
   5. Cores
   ========================================================= */
function drawPalette() {
  var cols = shown(); paint($('cv-pal'), MAPS.classif, cols);
  var ed = $('legend-ed'); ed.innerHTML = '';
  palette().forEach(function (h, i) {
    var row = document.createElement('div'), sw = toHex(cols[i]);
    row.innerHTML = (palKey === 'custom' ? '<input type="color" value="' + h + '" aria-label="Cor de ' + NAMES[i] + '">' : '<i style="background:' + sw + '"></i>') + '<span>' + NAMES[i] + '</span><span class="mono small muted">' + sw + '</span>';
    if (palKey === 'custom') row.querySelector('input').addEventListener('input', function () { custom[i] = this.value; store.set('sr3-custom', custom); drawPalette(); drawSheet(); });
    ed.appendChild(row);
  });
  var pairs = [], min = Infinity;
  for (var a = 0; a < NC; a++) for (var b = a + 1; b < NC; b++) { var d = dE(cols[a], cols[b]); pairs.push([a, b, d]); if (d < min) min = d; }
  pairs.sort(function (p, q) { return p[2] - q[2]; });
  $('o-de').textContent = nf(min, 1);
  var bad = pairs.filter(function (p) { return p[2] < 15; });
  $('o-pairs').innerHTML = bad.length ? '<span class="pill no">' + bad.length + (bad.length > 1 ? ' pares' : ' par') + ' de difícil distinção</span> ' + bad.map(function (p) { return NAMES[p[0]] + ' × ' + NAMES[p[1]] + ' (ΔE ' + nf(p[2], 1) + ')'; }).join('; ') + '.'
    : '<span class="pill ok">Todas as classes distinguíveis</span> Par mais próximo: ' + NAMES[pairs[0][0]] + ' × ' + NAMES[pairs[0][1]] + ' (ΔE ' + nf(pairs[0][2], 1) + ').';
  var warn = { seq: ' Esquema sequencial: sugere ordem entre classes que não existe.', arb: ' Esquema arbitrário: vegetação em vermelho e água em verde contrariam associações usuais.' }[palKey];
  if (warn) $('o-pairs').innerHTML += '<br><strong style="color:var(--no)">Inadequado para dados qualitativos.</strong>' + warn;
}
segGroup($('seg-pal'), function (v) { palKey = v; drawPalette(); drawSheet(); });
$('sel-cvd').addEventListener('change', function () { cvd = this.value; drawPalette(); drawSheet(); });

/* =========================================================
   6. Generalização (peneira) e áreas
   ========================================================= */
var GEN = null, genView = 'gen';
function sieve(src, minpx) {
  var out = new Uint8Array(src), comp = new Int32Array(NP).fill(-1), q = new Int32Array(NP), removed = 0, cid = 0;
  for (var s = 0; s < NP; s++) {
    if (comp[s] >= 0) continue;
    var c = src[s], head = 0, tail = 0; q[tail++] = s; comp[s] = cid; var nb = [0, 0, 0, 0, 0];
    while (head < tail) {
      var p = q[head++], i = Math.floor(p / N), j = p % N;
      for (var di = -1; di <= 1; di++) for (var dj = -1; dj <= 1; dj++) {
        if (!di && !dj) continue; var a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= N || b >= N) continue;
        var o = a * N + b; if (src[o] === c) { if (comp[o] < 0) { comp[o] = cid; q[tail++] = o; } } else nb[src[o]]++;
      }
    }
    if (tail < minpx) { var best = -1; for (var k = 0; k < NC; k++) if (k !== c && (best < 0 || nb[k] > nb[best])) best = k; if (best >= 0 && nb[best] > 0) { for (var t = 0; t < tail; t++) out[q[t]] = best; removed++; } }
    cid++;
  }
  return { lab: out, removed: removed };
}
function accuracy(pred) {
  var cm = []; for (var r = 0; r < NC; r++) cm.push([0, 0, 0, 0, 0]);
  for (var p = 0; p < NP; p++) cm[pred[p]][MAPS.verdade[p]]++;
  var d = 0, pe = 0; for (var k = 0; k < NC; k++) { d += cm[k][k]; var rt = 0, ct = 0; for (var j = 0; j < NC; j++) { rt += cm[k][j]; ct += cm[j][k]; } pe += rt * ct / (NP * NP); }
  var po = d / NP; return { oa: po, k: (po - pe) / (1 - pe) };
}
function updGen() {
  var px = +$('sl-sieve').value; $('o-sieve').textContent = px === 1 ? 'sem generalização' : px + ' pixels (' + nf(px * 0.01, 2) + ' ha)';
  var r = px > 1 ? sieve(MAPS.ruidoso, px) : { lab: MAPS.ruidoso, removed: 0 }; GEN = r.lab;
  $('o-removed').textContent = int(r.removed);
  var A = accuracy(GEN); $('o-gen-oa').textContent = pct(A.oa); $('o-gen-k').textContent = nf(A.k, 2);
  var cnt = [0, 0, 0, 0, 0]; for (var p = 0; p < NP; p++) cnt[GEN[p]]++;
  var cols = shown();
  $('area-tb').innerHTML = cnt.map(function (c, i) { return '<tr><td><span style="display:inline-block;width:11px;height:11px;border-radius:2px;margin-right:8px;background:' + toHex(cols[i]) + '"></span>' + NAMES[i] + '</td><td class="mono">' + nf(c * 0.01, 2) + '</td><td class="mono">' + nf(c / NP * 100, 1) + '</td><td><div class="bar" style="width:' + Math.max(1, c / NP * 100) + '%;background:' + toHex(cols[i]) + '"></div></td></tr>'; }).join('') +
    '<tr><td><strong>Total</strong></td><td class="mono"><strong>' + nf(NP * 0.01, 2) + '</strong></td><td class="mono">100,0</td><td></td></tr>';
  $('o-acc-text').innerHTML = '<strong>Texto sugerido para o mapa:</strong> “Classificação supervisionada (máxima verossimilhança) de imagem Sentinel-2' + (px > 1 ? ', generalizada com unidade mínima de ' + nf(px * 0.01, 2) + ' ha' : '') + '. Exatidão global de ' + pct(A.oa) + ' e kappa de ' + nf(A.k, 2) + ', obtidos por comparação com dados de referência.”';
  drawGen();
}
function drawGen() {
  var cols = shown(), cv = $('cv-gen');
  if (genView === 'gen') paint(cv, GEN, cols);
  else if (genView === 'orig') paint(cv, MAPS.ruidoso, cols);
  else paint(cv, GEN, cols, function (p) { if (GEN[p] !== MAPS.ruidoso[p]) return [255, 214, 0]; var c = cols[GEN[p]]; return [c[0] * .35 + 60, c[1] * .35 + 60, c[2] * .35 + 60]; });
}
$('sl-sieve').addEventListener('input', updGen);
segGroup($('seg-genview'), function (v) { genView = v; drawGen(); });

/* =========================================================
   7. Metadados
   ========================================================= */
var META = [
  { id: 'titulo', l: 'Título', r: 'O', v: 'Uso e cobertura da terra — área de estudo (2026)' },
  { id: 'data', l: 'Data de referência', r: 'O', t: 'date', v: '2026-11-13' },
  { id: 'resp', l: 'Responsável (nome e papel)', r: 'O', v: 'Prof. Hatan Pinheiro — autor' },
  { id: 'resumo', l: 'Resumo', r: 'O', t: 'area', v: 'Mapa de uso e cobertura da terra obtido por classificação supervisionada (máxima verossimilhança) de imagem Sentinel-2 L2A, com cinco classes: água, vegetação densa, vegetação rala, solo exposto e área construída.' },
  { id: 'cat', l: 'Categoria temática', r: 'O', t: 'select', o: ['Imagens, mapas de base e cobertura da terra (imageryBaseMapsEarthCover)', 'Meio ambiente (environment)', 'Planejamento e cadastro (planningCadastre)', 'Águas interiores (inlandWaters)', 'Agricultura (farming)'] },
  { id: 'idioma', l: 'Idioma', r: 'O', v: 'Português (por)' },
  { id: 'src', l: 'Sistema de referência', r: 'O', v: 'SIRGAS 2000 / UTM zona 22S (EPSG:31982)' },
  { id: 'formato', l: 'Formato de distribuição', r: 'O', v: 'GeoTIFF (dado); PDF (layout)' },
  { id: 'contato', l: 'Contato dos metadados', r: 'O', v: 'Prof. Hatan Pinheiro' },
  { id: 'ext', l: 'Extensão geográfica (O, L, S, N)', r: 'C', v: '' },
  { id: 'linhagem', l: 'Linhagem', r: 'Op', t: 'area', v: '' },
  { id: 'res', l: 'Resolução espacial', r: 'Op', v: '10 m' },
  { id: 'status', l: 'Status', r: 'Op', t: 'select', o: ['Concluído', 'Em andamento', 'Planejado'] }];
var RL = { O: 'obrigatório', C: 'condicional', Op: 'opcional' };
(function () {
  var form = $('meta-form'), saved = store.get('sr3-meta', {});
  META.forEach(function (f) {
    var lab = document.createElement('label'); lab.className = 'field'; if (f.t === 'area') lab.style.gridColumn = '1 / -1';
    var ctl = f.t === 'area' ? '<textarea class="fx" id="m-' + f.id + '"></textarea>' : f.t === 'select' ? '<select id="m-' + f.id + '">' + f.o.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>' : '<input type="' + (f.t || 'text') + '" id="m-' + f.id + '">';
    lab.innerHTML = '<span>' + f.l + ' ' + (f.r === 'O' ? '<b>*</b>' : '') + '<em class="muted" style="font-style:normal;font-size:.8em">· ' + RL[f.r] + '</em></span>' + ctl;
    form.appendChild(lab);
    var el = lab.querySelector('#m-' + f.id); el.value = saved[f.id] !== undefined ? saved[f.id] : (f.v !== undefined ? f.v : (f.o ? f.o[0] : ''));
    el.addEventListener('input', function () { saved[f.id] = el.value; store.set('sr3-meta', saved); updMeta(); });
  });
  $('meta-reset').addEventListener('click', function () { saved = {}; store.set('sr3-meta', {}); META.forEach(function (f) { $('m-' + f.id).value = f.v !== undefined ? f.v : (f.o ? f.o[0] : ''); }); updMeta(); });
  $('meta-copy').addEventListener('click', function () {
    var b = this, t = $('meta-out').textContent;
    function fb() { var r = document.createRange(); r.selectNodeContents($('meta-out')); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selecionada: use Ctrl+C'; }
    try { navigator.clipboard.writeText(t).then(function () { b.textContent = 'Copiada'; setTimeout(function () { b.textContent = 'Copiar ficha'; }, 1500); }, fb); } catch (e) { fb(); }
  });
})();
function updMeta() {
  var req = META.filter(function (f) { return f.r === 'O'; }), done = req.filter(function (f) { return $('m-' + f.id).value.trim(); }).length, opt = META.filter(function (f) { return f.r !== 'O' && $('m-' + f.id).value.trim(); }).length;
  $('meta-meter').style.width = (done / req.length * 100) + '%';
  var miss = req.filter(function (f) { return !$('m-' + f.id).value.trim(); }).map(function (f) { return f.l; });
  $('meta-score').innerHTML = '<strong>' + done + ' de ' + req.length + '</strong> elementos obrigatórios preenchidos; ' + opt + ' de ' + (META.length - req.length) + ' condicionais e opcionais.' + (miss.length ? ' Faltam: ' + miss.join(', ') + '.' : '') + (!$('m-linhagem').value.trim() ? ' Recomenda-se descrever a linhagem (imagem, data, algoritmo, amostras, generalização).' : '');
  $('meta-out').textContent = 'FICHA DE METADADOS (Perfil MGB sumarizado — síntese)\n' + META.map(function (f) { var v = $('m-' + f.id).value.trim(); return '\n' + f.l.toUpperCase() + ' [' + RL[f.r] + ']\n  ' + (v || '— não preenchido —'); }).join('\n');
}

/* =========================================================
   Prática, discussão e navegação
   ========================================================= */
function checklist(listId, barId, key) {
  var saved = store.get(key, {}), boxes = $(listId).querySelectorAll('input[type=checkbox]');
  function upd() { var n = 0; boxes.forEach(function (b) { b.closest('li').classList.toggle('done', b.checked); if (b.checked) n++; }); $(barId).style.width = (n / boxes.length * 100) + '%'; }
  boxes.forEach(function (b) { b.checked = !!saved[b.id]; b.addEventListener('change', function () { saved[b.id] = b.checked; store.set(key, saved); upd(); }); }); upd();
}
checklist('ck-a', 'pg-a', 'sr3-ck-a'); checklist('ck-b', 'pg-b', 'sr3-ck-b'); checklist('ck-c', 'pg-c', 'sr3-ck-c');
(function () {
  var Q = [
    { s: 'Slide 20', q: 'Que escala máxima é compatível com um mapa feito a partir de pixels de 10 m?', l: [['#escala', '3. Calculadora de escala']] },
    { s: 'Slide 20', q: 'Por que calcular áreas em coordenadas geográficas leva a erro?', l: [['#projecao', '4. Área de 0,0001°']] },
    { s: 'Slide 20', q: 'Que paleta de cores evita confusão para leitores daltônicos?', l: [['#cores', '5. Simulação de visão']] },
    { s: 'Slide 20', q: 'Que informação de qualidade deve acompanhar um mapa de uso da terra?', l: [['#generalizacao', '6. Acurácia'], ['#metadados', '7. Linhagem']] },
    { s: 'Slide 24', q: 'O mapa pode ser lido sem explicação oral?', l: [['#elementos', '2. Verificação do layout']] },
    { s: 'Slide 24', q: 'A escala escolhida é compatível com a resolução e com a acurácia do dado?', l: [['#escala', '3. PEC']] },
    { s: 'Slide 24', q: 'A legenda permite distinguir todas as classes, inclusive em impressão em tons de cinza?', l: [['#cores', '5. Tons de cinza']] },
    { s: 'Slide 24', q: 'Os metadados permitiriam a outra pessoa reproduzir o mapa?', l: [['#metadados', '7. Ficha de metadados']] }];
  var notes = store.get('sr3-notes', {}), box = $('qs');
  Q.forEach(function (q, i) {
    var d = document.createElement('div'); d.className = 'q';
    d.innerHTML = '<span class="eyebrow">' + q.s + '</span><p>' + q.q + '</p><div class="links">Retomar: ' + q.l.map(function (x) { return '<a href="' + x[0] + '">' + x[1] + '</a>'; }).join(' · ') + '</div><label class="small muted" for="nt3-' + i + '">Anotações</label><textarea id="nt3-' + i + '" placeholder="Registre aqui os argumentos e as evidências."></textarea>';
    box.appendChild(d); var ta = d.querySelector('textarea'); ta.value = notes[i] || ''; ta.addEventListener('input', function () { notes[i] = ta.value; store.set('sr3-notes', notes); });
  });
})();
(function () {
  var links = document.querySelectorAll('#navlinks a'), map = {}; links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove('on'); }); var a = map[e.target.id]; if (a) { a.classList.add('on'); try { a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (_) { } } } }); }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main .step').forEach(function (s) { io.observe(s); });
})();

/* ---------- Início ---------- */
updScale(); updUTM(); updMeta();
Promise.all([decode(window.SR_MAPS.classif), decode(window.SR_MAPS.ruidoso), decode(window.SR_MAPS.verdade)]).then(function (m) {
  MAPS.classif = m[0]; MAPS.ruidoso = m[1]; MAPS.verdade = m[2];
  var A = accuracy(MAPS.classif); ACC.oa = A.oa; ACC.k = A.k;
  drawSheet(); drawPalette(); updGen();
});
})();
