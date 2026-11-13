/* Aula 2 — Classificação de Imagens de Sensoriamento Remoto (Prof. Hatan Pinheiro)
   Cena sintética, K-médias, classificadores supervisionados, segmentação e avaliação da acurácia. */
(function () {
'use strict';

/* ---------- Constantes ---------- */
var N = 200, NP = N * N, NB = 5;
var BANDS = ['B02', 'B03', 'B04', 'B08', 'B11'];
var BLABEL = ['B02 · azul', 'B03 · verde', 'B04 · vermelho', 'B08 · IV próximo', 'B11 · SWIR'];
var BMAX = [20, 25, 35, 60, 45];
var CL = [
  { n: 'Água', c: '#2a62b0' }, { n: 'Vegetação densa', c: '#2b8a3c' }, { n: 'Vegetação rala', c: '#9ccc5a' },
  { n: 'Solo exposto', c: '#d4831f' }, { n: 'Área construída', c: '#8a8d96' }];
var NC = CL.length;
var MU = [[6.5, 5.0, 3.0, 1.0, 0.5], [3.0, 6.5, 3.5, 42, 18], [5.5, 8.5, 9.0, 30, 26], [8, 12, 20, 27, 35], [13, 16, 21, 25, 24]];
var SD = [[.6, .5, .5, .4, .3], [.5, .8, .7, 3.5, 2], [.8, 1, 1.5, 3, 2.5], [1, 1.2, 2, 2, 2.5], [2, 2.2, 2.5, 2.5, 3]];
var KCOL = ['#e15759', '#4e79a7', '#f28e2b', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'];
var UNC = [30, 30, 34];
function hex(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
var CRGB = CL.map(function (c) { return hex(c.c); });
var KRGB = KCOL.map(hex);

/* ---------- Utilidades ---------- */
function $(id) { return document.getElementById(id); }
function nf(v, d) { return v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function pct(v, d) { return nf(v * 100, d == null ? 1 : d) + '%'; }
function int(v) { return v.toLocaleString('pt-BR'); }
var store = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function gaussFn(r) { var s = null; return function () { if (s !== null) { var t = s; s = null; return t; } var u = 0, v = 0; while (u === 0) u = r(); v = r(); var m = Math.sqrt(-2 * Math.log(u)); s = m * Math.sin(2 * Math.PI * v); return m * Math.cos(2 * Math.PI * v); }; }
function cssv(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function segGroup(el, cb) {
  var bs = el.querySelectorAll('button');
  bs.forEach(function (b) { b.addEventListener('click', function () { bs.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); cb(b.dataset.v); }); });
}
function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

/* ---------- Cena sintética ---------- */
var X = new Float32Array(NP * NB), TRUTH = new Uint8Array(NP), PURE = new Uint8Array(NP), WFR = new Float32Array(NP * NC);
(function buildScene() {
  var S = 600, sub = new Uint8Array(S * S);
  function circ(u, v, cx, cy, r) { return (u - cx) * (u - cx) + (v - cy) * (v - cy) < r * r; }
  for (var v = 0; v < S; v++) for (var u = 0; u < S; u++) {
    var c = 2;
    if (circ(u, v, 120, 110, 85) || circ(u, v, 190, 150, 70) || circ(u, v, 80, 190, 60)) c = 1;
    if (u >= 330 && u < 450 && v >= 40 && v < 150) c = 3;
    if (u >= 460 && u < 570 && v >= 40 && v < 150) c = 1;
    if (circ(u, v, 380, 260, 55)) c = 1;
    if (circ(u, v, 500, 260, 55)) c = 3;
    if (circ(u, v, 440, 375, 50)) c = 1;
    if (Math.pow((u - 250) / 55, 2) + Math.pow((v - 330) / 35, 2) < 1) c = 0;
    if (u >= 40 && u < 250 && v >= 420 && v < 580) c = 4;
    if (u >= 120 && u < 160 && v >= 470 && v < 510) c = 1;
    if (Math.abs(u - (300 + 40 * Math.sin(v / 60))) < 9) c = 0;
    if (Math.abs(v - (400 + 0.15 * (u - 300))) < 4) c = 4;
    sub[v * S + u] = c;
  }
  var r = mulberry(42), g = gaussFn(r);
  for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
    var p = i * N + j, cnt = [0, 0, 0, 0, 0];
    for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) cnt[sub[(3 * i + a) * S + 3 * j + b]]++;
    var best = 0; for (var k = 1; k < NC; k++) if (cnt[k] > cnt[best]) best = k;
    TRUTH[p] = best; PURE[p] = cnt[best] === 9 ? 1 : 0;
    for (k = 0; k < NC; k++) WFR[p * NC + k] = cnt[k] / 9;
    var g0 = g();
    for (var bd = 0; bd < NB; bd++) {
      var mix = 0; for (k = 0; k < NC; k++) mix += WFR[p * NC + k] * MU[k][bd];
      X[p * NB + bd] = Math.max(0.05, mix * (1 + 0.07 * g0) + SD[best][bd] * g());
    }
  }
})();
var SAMPLE = (function () { var r = mulberry(7), a = []; for (var i = 0; i < 3000; i++) a.push(Math.floor(r() * NP)); return a; })();
var PURE_BY = (function () { var a = [[], [], [], [], []]; for (var p = 0; p < NP; p++) if (PURE[p]) a[TRUTH[p]].push(p); return a; })();

/* ---------- Renderização de mapas ---------- */
var off = document.createElement('canvas'); off.width = N; off.height = N;
var offx = off.getContext('2d'), offimg = offx.createImageData(N, N);
function falseColor(p) { var a = X[p * NB + 3] / 50, b = X[p * NB + 2] / 28, c = X[p * NB + 1] / 22; return [255 * Math.pow(Math.min(1, a), .85), 255 * Math.pow(Math.min(1, b), .85), 255 * Math.pow(Math.min(1, c), .85)]; }
function natColor(p) { var a = X[p * NB + 2] / 26, b = X[p * NB + 1] / 22, c = X[p * NB + 0] / 20; return [255 * Math.pow(Math.min(1, a), .8), 255 * Math.pow(Math.min(1, b), .8), 255 * Math.pow(Math.min(1, c), .8)]; }
function paintMap(cv, colorOf, overlay) {
  var d = offimg.data;
  for (var p = 0; p < NP; p++) { var c = colorOf(p), q = p * 4; d[q] = c[0]; d[q + 1] = c[1]; d[q + 2] = c[2]; d[q + 3] = 255; }
  offx.putImageData(offimg, 0, 0);
  var ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(off, 0, 0, cv.width, cv.height);
  if (overlay) overlay(ctx, cv.width / N);
}
function pixelAt(cv, e) {
  var r = cv.getBoundingClientRect(); var x = Math.floor((e.clientX - r.left) / r.width * N), y = Math.floor((e.clientY - r.top) / r.height * N);
  if (x < 0 || y < 0 || x >= N || y >= N) return -1; return y * N + x;
}
function legend(el, extra) {
  el.innerHTML = CL.map(function (c) { return '<span><i style="background:' + c.c + '"></i>' + c.n + '</span>'; }).join('') + (extra || '');
}

/* ---------- Gráficos de dispersão (canvas) ---------- */
function Plot(cv, draw) {
  var self = this; this.cv = cv; this.draw = draw; this.m = { l: 50, r: 12, t: 12, b: 40 };
  function fit() { var dpr = window.devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); self.dpr = dpr; self.w = w; self.h = h; self.render(); }
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(cv); else window.addEventListener('resize', fit);
  setTimeout(fit, 0);
}
Plot.prototype.render = function () { if (!this.w) return; var ctx = this.cv.getContext('2d'); ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); ctx.clearRect(0, 0, this.w, this.h); this.draw(ctx, this); };
Plot.prototype.frame = function (ctx, bx, by) {
  var m = this.m, w = this.w, h = this.h, x1 = BMAX[bx], y1 = BMAX[by];
  var f = { sx: function (v) { return m.l + v / x1 * (w - m.l - m.r); }, sy: function (v) { return h - m.b - v / y1 * (h - m.t - m.b); }, x0: m.l, y0: m.t, pw: w - m.l - m.r, ph: h - m.t - m.b, bx: bx, by: by };
  var ink = cssv('--ink'), muted = cssv('--muted'), line = cssv('--line');
  ctx.font = '12px "IBM Plex Mono", monospace'; ctx.fillStyle = muted; ctx.strokeStyle = line; ctx.lineWidth = 1;
  function ticks(mx) { var st = mx <= 20 ? 5 : mx <= 35 ? 5 : 10, a = []; for (var v = 0; v <= mx + 1e-9; v += st) a.push(v); return a; }
  ticks(x1).forEach(function (v) { var x = f.sx(v); ctx.beginPath(); ctx.moveTo(x, h - m.b); ctx.lineTo(x, h - m.b + 4); ctx.stroke(); ctx.textAlign = 'center'; ctx.fillText(String(v), x, h - m.b + 16); });
  ticks(y1).forEach(function (v) { var y = f.sy(v); ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(m.l, y); ctx.lineTo(w - m.r, y); ctx.stroke(); ctx.setLineDash([]); ctx.textAlign = 'right'; ctx.fillText(String(v), m.l - 6, y + 4); });
  ctx.beginPath(); ctx.moveTo(m.l, m.t); ctx.lineTo(m.l, h - m.b); ctx.lineTo(w - m.r, h - m.b); ctx.stroke();
  ctx.font = '12.5px "Source Sans 3", sans-serif'; ctx.fillStyle = ink; ctx.textAlign = 'center';
  ctx.fillText(BLABEL[bx] + ' (%)', m.l + f.pw / 2, h - 6);
  ctx.save(); ctx.translate(13, m.t + f.ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(BLABEL[by] + ' (%)', 0, 0); ctx.restore();
  return f;
};
function dots(ctx, f, idx, colorOf, r, alpha) {
  ctx.globalAlpha = alpha;
  for (var k = 0; k < idx.length; k++) { var p = idx[k], c = colorOf(p); if (!c) continue; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(f.sx(X[p * NB + f.bx]), f.sy(X[p * NB + f.by]), r, 0, 6.2832); ctx.fill(); }
  ctx.globalAlpha = 1;
}
function clipTo(ctx, f) { ctx.save(); ctx.beginPath(); ctx.rect(f.x0, f.y0, f.pw, f.ph); ctx.clip(); }

/* ---------- Seletores de bandas ---------- */
function fillSelect(sel, v) { sel.innerHTML = BLABEL.map(function (b, i) { return '<option value="' + i + '">' + b + '</option>'; }).join(''); sel.value = v; }

/* =========================================================
   1. Explorar a cena
   ========================================================= */
var selPix = -1, comp = 'fc';
var cvScene = $('cv-scene');
function drawScene() {
  var fn = comp === 'fc' ? falseColor : comp === 'nat' ? natColor : function (p) { return CRGB[TRUTH[p]]; };
  paintMap(cvScene, fn, function (ctx, s) { if (selPix < 0) return; var x = selPix % N, y = Math.floor(selPix / N); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.strokeRect((x - 2) * s, (y - 2) * s, 5 * s, 5 * s); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect((x - 2) * s - 1.5, (y - 2) * s - 1.5, 5 * s + 3, 5 * s + 3); });
}
var bars = $('sigbars');
bars.innerHTML = BANDS.map(function (b, i) { return '<div><span class="bar" id="bar' + i + '"></span><b id="bv' + i + '">–</b><small>' + b + '</small></div>'; }).join('');
function selectPixel(p) {
  if (p < 0) return; selPix = p;
  for (var b = 0; b < NB; b++) { var v = X[p * NB + b]; $('bar' + b).style.height = Math.min(100, v / 50 * 100) + '%'; $('bv' + b).textContent = nf(v, 1); }
  $('o-pxy').textContent = Math.floor(p / N) + ', ' + (p % N);
  $('o-pref').textContent = CL[TRUTH[p]].n;
  var parts = []; for (var k = 0; k < NC; k++) if (WFR[p * NC + k] > 0) parts.push(CL[k].n.toLowerCase() + ' ' + pct(WFR[p * NC + k], 0));
  $('o-pmix').innerHTML = PURE[p] ? 'Pixel puro: toda a área do pixel pertence a uma única classe.' : '<strong>Pixel misto:</strong> ' + parts.join(', ') + '. A reflectância registrada é a média ponderada dessas respostas.';
  drawScene(); plotSpace.render();
}
cvScene.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') selectPixel(pixelAt(cvScene, e)); });
cvScene.addEventListener('click', function (e) { selectPixel(pixelAt(cvScene, e)); });
segGroup($('seg-comp'), function (v) { comp = v; drawScene(); });
legend($('legend1'));

/* =========================================================
   2. Espaço de atributos
   ========================================================= */
var visCls = [1, 1, 1, 1, 1];
fillSelect($('ax-x'), 2); fillSelect($('ax-y'), 3);
var plotSpace = new Plot($('sc-space'), function (ctx, P) {
  var f = P.frame(ctx, +$('ax-x').value, +$('ax-y').value);
  clipTo(ctx, f);
  dots(ctx, f, SAMPLE, function (p) { return visCls[TRUTH[p]] ? CL[TRUTH[p]].c : null; }, 2.1, .6);
  if (selPix >= 0) { ctx.lineWidth = 2.5; ctx.strokeStyle = cssv('--ink'); ctx.beginPath(); ctx.arc(f.sx(X[selPix * NB + f.bx]), f.sy(X[selPix * NB + f.by]), 7, 0, 6.2832); ctx.stroke(); }
  ctx.restore();
});
(function () {
  var el = $('cls-toggle');
  el.innerHTML = CL.map(function (c, i) { return '<button class="chip cls" data-i="' + i + '" aria-pressed="true"><i style="background:' + c.c + '"></i>' + c.n + '</button>'; }).join('');
  el.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { var i = +b.dataset.i; visCls[i] = visCls[i] ? 0 : 1; b.setAttribute('aria-pressed', visCls[i] ? 'true' : 'false'); plotSpace.render(); }); });
})();
/* Confusão entre pares: classificador gaussiano de duas classes aplicado aos pixels puros da amostra. */
function gauss2(points) { var n = points.length, mx = 0, my = 0; points.forEach(function (q) { mx += q[0]; my += q[1]; }); mx /= n; my /= n; var a = 0, b = 0, c = 0; points.forEach(function (q) { var dx = q[0] - mx, dy = q[1] - my; a += dx * dx; b += dx * dy; c += dy * dy; }); a = a / (n - 1) + 1e-3; b /= (n - 1); c = c / (n - 1) + 1e-3; var det = a * c - b * b; return { mx: mx, my: my, ia: c / det, ib: -b / det, ic: a / det, ld: Math.log(det) }; }
function gll(g, x, y) { var dx = x - g.mx, dy = y - g.my; return -0.5 * (g.ia * dx * dx + 2 * g.ib * dx * dy + g.ic * dy * dy) - 0.5 * g.ld; }
function separability() {
  var bx = +$('ax-x').value, by = +$('ax-y').value, pts = [[], [], [], [], []];
  SAMPLE.forEach(function (p) { if (PURE[p]) pts[TRUTH[p]].push([X[p * NB + bx], X[p * NB + by]]); });
  var G = pts.map(function (a) { return a.length > 3 ? gauss2(a) : null; }), res = [];
  for (var a = 0; a < NC; a++) for (var b = a + 1; b < NC; b++) {
    if (!G[a] || !G[b]) continue; var err = 0, tot = 0;
    pts[a].forEach(function (q) { tot++; if (gll(G[b], q[0], q[1]) > gll(G[a], q[0], q[1])) err++; });
    pts[b].forEach(function (q) { tot++; if (gll(G[a], q[0], q[1]) > gll(G[b], q[0], q[1])) err++; });
    res.push({ a: a, b: b, e: err / tot });
  }
  res.sort(function (u, v) { return v.e - u.e; });
  var top = res.filter(function (r) { return r.e >= 0.005; }).slice(0, 3);
  $('o-sep').innerHTML = bx === by ? 'Selecione duas bandas diferentes.' : top.length ?
    '<strong>Pares mais confundidos em ' + BANDS[bx] + ' × ' + BANDS[by] + ':</strong> ' + top.map(function (r) { return CL[r.a].n + ' × ' + CL[r.b].n + ' (' + pct(r.e) + ')'; }).join('; ') + '. Percentual de pixels puros atribuídos à classe errada por um classificador gaussiano de duas classes.'
    : '<strong>' + BANDS[bx] + ' × ' + BANDS[by] + ':</strong> todas as classes são separáveis (menos de 0,5% de confusão entre pares).';
}
function onAxes() { plotSpace.render(); separability(); }
$('ax-x').addEventListener('change', onAxes); $('ax-y').addEventListener('change', onAxes);
$('btn-pair1').addEventListener('click', function () { $('ax-x').value = 2; $('ax-y').value = 3; onAxes(); });
$('btn-pair2').addEventListener('click', function () { $('ax-x').value = 2; $('ax-y').value = 4; onAxes(); });
separability();

/* =========================================================
   3. K-médias (B04, B08)
   ========================================================= */
var KB = [2, 3], km = { k: 5, cent: [], hist: [], asg: new Int8Array(NP).fill(-1), it: 0, seed: 1 };
var cvKm = $('cv-km');
function kmReset() {
  var r = mulberry(km.seed++ * 977); km.cent = []; km.hist = []; km.asg.fill(-1); km.it = 0;
  for (var c = 0; c < km.k; c++) { var p = Math.floor(r() * NP); km.cent.push([X[p * NB + KB[0]], X[p * NB + KB[1]]]); }
  km.hist = km.cent.map(function (c) { return [c.slice()]; });
  $('o-kit').textContent = '0'; $('o-kchg').textContent = '–'; $('o-ksse').textContent = '–'; kmDraw();
}
function kmStep() {
  var k = km.k, chg = 0, sse = 0, sx = new Float64Array(k), sy = new Float64Array(k), n = new Float64Array(k);
  for (var p = 0; p < NP; p++) {
    var x = X[p * NB + KB[0]], y = X[p * NB + KB[1]], best = 0, bd = Infinity;
    for (var c = 0; c < k; c++) { var dx = x - km.cent[c][0], dy = y - km.cent[c][1], d = dx * dx + dy * dy; if (d < bd) { bd = d; best = c; } }
    if (km.asg[p] !== best) chg++; km.asg[p] = best; sse += bd; sx[best] += x; sy[best] += y; n[best]++;
  }
  for (c = 0; c < k; c++) if (n[c]) { km.cent[c] = [sx[c] / n[c], sy[c] / n[c]]; km.hist[c].push(km.cent[c].slice()); }
  km.it++; $('o-kit').textContent = km.it; $('o-kchg').textContent = int(chg); $('o-ksse').textContent = int(Math.round(sse));
  return chg;
}
function kmDraw() {
  plotKm.render();
  paintMap(cvKm, function (p) { return km.asg[p] < 0 ? falseColor(p) : KRGB[km.asg[p]]; });
  var tb = $('km-table');
  if (km.it === 0) { tb.innerHTML = '<tr><td colspan="4" class="muted">Execute uma iteração para atribuir os pixels aos grupos.</td></tr>'; return; }
  var rows = [];
  for (var c = 0; c < km.k; c++) {
    var cnt = [0, 0, 0, 0, 0], n = 0;
    for (var p = 0; p < NP; p++) if (km.asg[p] === c) { cnt[TRUTH[p]]++; n++; }
    var best = 0; for (var q = 1; q < NC; q++) if (cnt[q] > cnt[best]) best = q;
    rows.push('<tr><td><span style="display:inline-block;width:11px;height:11px;border-radius:2px;margin-right:8px;background:' + KCOL[c] + '"></span>Grupo ' + (c + 1) + '</td><td class="mono">' + int(n) + '</td><td>' + (n ? CL[best].n : '–') + '</td><td class="mono">' + (n ? pct(cnt[best] / n) : '–') + '</td></tr>');
  }
  tb.innerHTML = rows.join('');
}
var plotKm = new Plot($('sc-km'), function (ctx, P) {
  var f = P.frame(ctx, KB[0], KB[1]); clipTo(ctx, f);
  var mut = cssv('--muted');
  dots(ctx, f, SAMPLE, function (p) { return km.asg[p] < 0 ? mut : KCOL[km.asg[p]]; }, 2, .55);
  km.hist.forEach(function (h, c) {
    ctx.strokeStyle = cssv('--ink'); ctx.lineWidth = 1.5; ctx.beginPath();
    h.forEach(function (q, i) { var x = f.sx(q[0]), y = f.sy(q[1]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }); ctx.stroke();
    var q = h[h.length - 1], x = f.sx(q[0]), y = f.sy(q[1]);
    ctx.lineWidth = 5; ctx.strokeStyle = cssv('--surface'); ctx.beginPath(); ctx.moveTo(x - 7, y - 7); ctx.lineTo(x + 7, y + 7); ctx.moveTo(x + 7, y - 7); ctx.lineTo(x - 7, y + 7); ctx.stroke();
    ctx.lineWidth = 2.5; ctx.strokeStyle = KCOL[c]; ctx.stroke();
  });
  ctx.restore();
});
$('sl-k').addEventListener('input', function () { km.k = +this.value; $('o-k').textContent = km.k; kmReset(); });
$('km-reset').addEventListener('click', kmReset);
$('km-step').addEventListener('click', function () { kmStep(); kmDraw(); });
$('km-run').addEventListener('click', function () { var g = 0; while (g++ < 60 && kmStep() > 0) { } kmDraw(); });
kmReset();

/* =========================================================
   4. Classificação supervisionada
   ========================================================= */
var tr = { idx: [], y: [], seed: 11 }, curCls = 0, alg = 'ml', fmode = '2', supView = 'cls';
var PRED = new Int8Array(NP), OBJPRED = new Int8Array(NP), MODEL = null, FEAT = [2, 3], REGION = null;
fillSelect($('sup-x'), 2); fillSelect($('sup-y'), 3);
(function () {
  var el = $('tr-cls');
  el.innerHTML = '<span class="small muted" style="align-self:center">Coleta manual:</span>' + CL.map(function (c, i) { return '<button class="chip cls" data-i="' + i + '" aria-pressed="' + (i === 0) + '"><i style="background:' + c.c + '"></i>' + c.n + '</button>'; }).join('');
  el.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { curCls = +b.dataset.i; el.querySelectorAll('button').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); }); });
})();
function autoSamples() {
  var n = +$('sl-ns').value, r = mulberry(tr.seed++ * 131); tr.idx = []; tr.y = [];
  PURE_BY.forEach(function (list, c) { var pick = {}; for (var k = 0; k < n && k < list.length; k++) { var p; do { p = list[Math.floor(r() * list.length)]; } while (pick[p]); pick[p] = 1; tr.idx.push(p); tr.y.push(c); } });
}
function trCount() {
  var cnt = [0, 0, 0, 0, 0]; tr.y.forEach(function (c) { cnt[c]++; });
  $('o-trcount').textContent = 'Amostras atuais: ' + CL.map(function (c, i) { return c.n + ' ' + cnt[i]; }).join(' · ') + '.';
  return cnt;
}

/* --- Álgebra linear mínima --- */
function invert(M) {
  var n = M.length, A = M.map(function (r, i) { return r.concat(Array.from({ length: n }, function (_, j) { return i === j ? 1 : 0; })); }), det = 1;
  for (var c = 0; c < n; c++) {
    var piv = c; for (var r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
    if (Math.abs(A[piv][c]) < 1e-12) return null;
    if (piv !== c) { var t = A[c]; A[c] = A[piv]; A[piv] = t; det = -det; }
    var pv = A[c][c]; det *= pv; for (var j = 0; j < 2 * n; j++) A[c][j] /= pv;
    for (r = 0; r < n; r++) if (r !== c) { var fct = A[r][c]; if (fct) for (j = 0; j < 2 * n; j++) A[r][j] -= fct * A[c][j]; }
  }
  return { inv: A.map(function (r) { return r.slice(n); }), det: det };
}

/* --- Treinamento --- */
function train() {
  var d = FEAT.length, Xs = tr.idx.map(function (p) { return FEAT.map(function (b) { return X[p * NB + b]; }); }), y = tr.y;
  var st = [], warn = [];
  for (var c = 0; c < NC; c++) {
    var rows = Xs.filter(function (_, i) { return y[i] === c; }), n = rows.length;
    if (!n) { st.push(null); continue; }
    var mu = new Array(d).fill(0); rows.forEach(function (r) { for (var k = 0; k < d; k++) mu[k] += r[k] / n; });
    var cov = []; for (var a = 0; a < d; a++) { cov.push([]); for (var b = 0; b < d; b++) { var s = 0; rows.forEach(function (r) { s += (r[a] - mu[a]) * (r[b] - mu[b]); }); cov[a].push(n > 1 ? s / (n - 1) : 0); } }
    var sd = cov.map(function (r, k) { return Math.sqrt(r[k]); });
    st.push({ n: n, mu: mu, cov: cov, sd: sd });
    if (alg === 'ml' && n <= d) warn.push(CL[c].n + ' (' + n + ' amostras para ' + d + ' bandas)');
  }
  var present = st.map(function (s, c) { return s ? c : -1; }).filter(function (c) { return c >= 0; });
  var model = { d: d, warn: warn, present: present };
  if (alg === 'md') model.predict = function (x) { var best = -1, bd = Infinity; present.forEach(function (c) { var m = st[c].mu, s = 0; for (var k = 0; k < d; k++) s += (x[k] - m[k]) * (x[k] - m[k]); if (s < bd) { bd = s; best = c; } }); return best; };
  if (alg === 'pp') { var kk = +$('sl-ppk').value; model.predict = function (x) { var best = -1, bd = Infinity; present.forEach(function (c) { var m = st[c].mu, sd = st[c].sd, s = 0; for (var k = 0; k < d; k++) { if (Math.abs(x[k] - m[k]) > kk * sd[k]) return; s += (x[k] - m[k]) * (x[k] - m[k]); } if (s < bd) { bd = s; best = c; } }); return best; }; }
  if (alg === 'ml') {
    var G = []; present.forEach(function (c) {
      var cv = st[c].cov.map(function (r, i) { return r.map(function (v, j) { return v + (i === j ? 0.05 : 0); }); });
      var iv = invert(cv); if (!iv || iv.det <= 0) { iv = invert(cv.map(function (r, i) { return r.map(function (v, j) { return i === j ? Math.max(v, .5) : 0; }); })); }
      G.push({ c: c, mu: st[c].mu, iv: iv.inv, ld: Math.log(iv.det) });
    });
    model.predict = function (x) { var best = -1, bl = -Infinity; for (var g = 0; g < G.length; g++) { var q = G[g], dlt = [], s = 0; for (var k = 0; k < d; k++) dlt.push(x[k] - q.mu[k]); for (var a = 0; a < d; a++) { var t = 0; for (var b = 0; b < d; b++) t += q.iv[a][b] * dlt[b]; s += dlt[a] * t; } var l = -0.5 * s - 0.5 * q.ld; if (l > bl) { bl = l; best = q.c; } } return best; };
  }
  if (alg === 'knn') {
    var K = Math.min(+$('sl-knn').value, Xs.length), flat = new Float64Array(Xs.length * d); Xs.forEach(function (r, i) { for (var k = 0; k < d; k++) flat[i * d + k] = r[k]; });
    var bd = new Float64Array(K), bc = new Int8Array(K);
    model.predict = function (x) {
      bd.fill(Infinity); for (var i = 0; i < Xs.length; i++) { var s = 0; for (var k = 0; k < d; k++) { var t = x[k] - flat[i * d + k]; s += t * t; } if (s < bd[K - 1]) { var j = K - 1; while (j > 0 && bd[j - 1] > s) { bd[j] = bd[j - 1]; bc[j] = bc[j - 1]; j--; } bd[j] = s; bc[j] = y[i]; } }
      var v = [0, 0, 0, 0, 0], best = bc[0]; for (i = 0; i < K; i++) { v[bc[i]]++; if (v[bc[i]] > v[best]) best = bc[i]; } return best;
    };
  }
  if (alg === 'rf') {
    var T = +$('sl-rf').value, mtry = Math.max(1, Math.round(Math.sqrt(d))), rr = mulberry(2024), trees = [];
    var gini = function (cnt, n) { if (!n) return 0; var s = 1; for (var q = 0; q < NC; q++) { var p = cnt[q] / n; s -= p * p; } return s; };
    var build = function (ids, depth) {
      var cnt = [0, 0, 0, 0, 0]; ids.forEach(function (i) { cnt[y[i]]++; });
      var maj = 0; for (var q = 1; q < NC; q++) if (cnt[q] > cnt[maj]) maj = q;
      if (depth >= 12 || cnt[maj] === ids.length || ids.length < 3) return { leaf: maj };
      var feats = []; while (feats.length < mtry) { var fz = Math.floor(rr() * d); if (feats.indexOf(fz) < 0) feats.push(fz); }
      var best = null, parent = gini(cnt, ids.length);
      feats.forEach(function (fz) {
        for (var t = 0; t < 14; t++) {
          var thr = Xs[ids[Math.floor(rr() * ids.length)]][fz], L = [0, 0, 0, 0, 0], R = [0, 0, 0, 0, 0], nl = 0;
          ids.forEach(function (i) { if (Xs[i][fz] <= thr) { L[y[i]]++; nl++; } else R[y[i]]++; });
          var nr = ids.length - nl; if (!nl || !nr) continue;
          var g = (nl * gini(L, nl) + nr * gini(R, nr)) / ids.length;
          if (!best || g < best.g) best = { g: g, f: fz, t: thr };
        }
      });
      if (!best || best.g >= parent - 1e-9) return { leaf: maj };
      var li = ids.filter(function (i) { return Xs[i][best.f] <= best.t; }), ri = ids.filter(function (i) { return Xs[i][best.f] > best.t; });
      return { f: best.f, t: best.t, l: build(li, depth + 1), r: build(ri, depth + 1) };
    };
    for (var t = 0; t < T; t++) { var boot = []; for (var i = 0; i < Xs.length; i++) boot.push(Math.floor(rr() * Xs.length)); trees.push(build(boot, 0)); }
    var votes = new Int32Array(NC);
    model.predict = function (x) { votes.fill(0); for (var t = 0; t < trees.length; t++) { var nd = trees[t]; while (nd.leaf === undefined) nd = x[nd.f] <= nd.t ? nd.l : nd.r; votes[nd.leaf]++; } var best = 0; for (var q = 1; q < NC; q++) if (votes[q] > votes[best]) best = q; return best; };
  }
  return model;
}
function classifyAll(model, out) {
  var d = FEAT.length, x = new Float64Array(d);
  for (var p = 0; p < NP; p++) { for (var k = 0; k < d; k++) x[k] = X[p * NB + FEAT[k]]; out[p] = model.predict(x); }
}
function regionImage(model) {
  var GR = 110, c = document.createElement('canvas'); c.width = GR; c.height = GR;
  var ctx = c.getContext('2d'), im = ctx.createImageData(GR, GR), bx = FEAT[0], by = FEAT[1], x = new Float64Array(2);
  for (var j = 0; j < GR; j++) for (var i = 0; i < GR; i++) {
    x[0] = (i + .5) / GR * BMAX[bx]; x[1] = (GR - j - .5) / GR * BMAX[by];
    var lab = model.predict(x), q = (j * GR + i) * 4;
    if (lab < 0) { im.data[q + 3] = 0; continue; }
    im.data[q] = CRGB[lab][0]; im.data[q + 1] = CRGB[lab][1]; im.data[q + 2] = CRGB[lab][2]; im.data[q + 3] = 95;
  }
  ctx.putImageData(im, 0, 0); return c;
}

/* --- Matriz de confusão --- */
function confusion(pred) {
  var cm = []; for (var r = 0; r <= NC; r++) cm.push([0, 0, 0, 0, 0]);
  for (var p = 0; p < NP; p++) { var a = pred[p] < 0 ? NC : pred[p]; cm[a][TRUTH[p]]++; }
  var n = NP, diag = 0; for (var k = 0; k < NC; k++) diag += cm[k][k];
  var rowT = cm.map(function (r) { return r.reduce(function (s, v) { return s + v; }, 0); }), colT = [0, 0, 0, 0, 0];
  cm.forEach(function (r) { r.forEach(function (v, j) { colT[j] += v; }); });
  var po = diag / n, pe = 0; for (k = 0; k < NC; k++) pe += rowT[k] * colT[k] / (n * n);
  var Q = 0; for (k = 0; k <= NC; k++) Q += Math.abs(rowT[k] / n - (k < NC ? colT[k] / n : 0)); Q /= 2;
  return { cm: cm, rowT: rowT, colT: colT, oa: po, kappa: (po - pe) / (1 - pe), Q: Q, A: (1 - po) - Q, unc: rowT[NC] };
}

/* --- Descrição dos algoritmos --- */
var INFO = {
  md: '<strong>Distância mínima.</strong> Calcula a média de cada classe nas amostras e atribui o pixel à classe de média mais próxima (distância euclidiana). As fronteiras são retas e a dispersão das classes é ignorada.<span class="eq">classe(x) = argmin<sub>k</sub> ‖x − μ<sub>k</sub>‖</span>',
  pp: '<strong>Paralelepípedo.</strong> Para cada classe, define o intervalo μ ± k·σ em cada banda; o pixel pertence à classe se estiver dentro de todos os intervalos. Pixels fora de todas as caixas ficam sem classe; caixas sobrepostas são resolvidas, aqui, pela menor distância à média.<span class="eq">x ∈ k ⇔ |x<sub>b</sub> − μ<sub>k,b</sub>| ≤ k·σ<sub>k,b</sub> para toda banda b</span>',
  ml: '<strong>Máxima verossimilhança.</strong> Modela cada classe por uma distribuição normal multivariada, com média e matriz de covariância estimadas das amostras, e atribui o pixel à classe de maior verossimilhança. As fronteiras são curvas e acompanham a forma e a orientação de cada nuvem. É o princípio do GMM do dzetsaka.<span class="eq">g<sub>k</sub>(x) = −½ ln|Σ<sub>k</sub>| − ½ (x − μ<sub>k</sub>)ᵀ Σ<sub>k</sub>⁻¹ (x − μ<sub>k</sub>)</span>',
  knn: '<strong>k vizinhos mais próximos (k-NN).</strong> Não estima parâmetros: o pixel recebe a classe mais frequente entre as k amostras de treinamento mais próximas. k pequeno produz fronteiras irregulares e sensíveis a amostras ruidosas; k grande suaviza as fronteiras.<span class="eq">classe(x) = moda das classes dos k vizinhos de x</span>',
  rf: '<strong>Random Forest.</strong> Treina várias árvores de decisão, cada uma com uma reamostragem das amostras e com sorteio de bandas em cada divisão; a classe final é a mais votada (BREIMAN, 2001). As fronteiras são compostas de segmentos paralelos aos eixos, suavizados pela votação.<span class="eq">classe(x) = moda { árvore<sub>1</sub>(x), …, árvore<sub>T</sub>(x) }</span>'
};
function showParams() {
  $('p-pp').hidden = alg !== 'pp'; $('p-knn').hidden = alg !== 'knn'; $('p-rf').hidden = alg !== 'rf';
  $('param-row').hidden = ['pp', 'knn', 'rf'].indexOf(alg) < 0;
}

/* --- Execução --- */
var cvSup = $('cv-sup');
var plotSup = new Plot($('sc-sup'), function (ctx, P) {
  var bx = +$('sup-x').value, by = +$('sup-y').value, f = P.frame(ctx, bx, by); clipTo(ctx, f);
  if (REGION && fmode === '2') { ctx.imageSmoothingEnabled = false; ctx.drawImage(REGION, f.x0, f.y0, f.pw, f.ph); }
  dots(ctx, f, SAMPLE, function () { return cssv('--muted'); }, 1.6, .28);
  var ink = cssv('--ink');
  tr.idx.forEach(function (p, i) { ctx.fillStyle = CL[tr.y[i]].c; ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(f.sx(X[p * NB + bx]), f.sy(X[p * NB + by]), 4.2, 0, 6.2832); ctx.fill(); ctx.stroke(); });
  ctx.restore();
  if (fmode === '5') { ctx.fillStyle = cssv('--surface'); ctx.globalAlpha = .88; ctx.fillRect(f.x0 + 10, f.y0 + 10, f.pw - 20, 46); ctx.globalAlpha = 1; ctx.fillStyle = ink; ctx.font = '13px "Source Sans 3", sans-serif'; ctx.textAlign = 'left'; ctx.fillText('Classificação com 5 bandas: as regiões de decisão', f.x0 + 18, f.y0 + 29); ctx.fillText('não podem ser desenhadas em 2 dimensões.', f.x0 + 18, f.y0 + 47); }
});
function drawSup() {
  plotSup.render();
  var fn = supView === 'img' ? falseColor : supView === 'err' ? function (p) { return PRED[p] === TRUTH[p] ? [205, 215, 208] : [200, 40, 40]; } : function (p) { return PRED[p] < 0 ? UNC : CRGB[PRED[p]]; };
  paintMap(cvSup, fn, function (ctx, s) {
    tr.idx.forEach(function (p, i) { var x = (p % N) * s, y = Math.floor(p / N) * s; ctx.fillStyle = '#fff'; ctx.fillRect(x - 3, y - 3, s + 6, s + 6); ctx.fillStyle = CL[tr.y[i]].c; ctx.fillRect(x - 1, y - 1, s + 2, s + 2); });
  });
}
function run() {
  var t0 = performance.now(); trCount();
  FEAT = fmode === '2' ? [+$('sup-x').value, +$('sup-y').value] : [0, 1, 2, 3, 4];
  if (fmode === '2' && FEAT[0] === FEAT[1]) { $('algo-info').innerHTML = 'Selecione duas bandas diferentes nos eixos X e Y.'; return; }
  if (!tr.idx.length) { MODEL = null; PRED.fill(-1); REGION = null; ['o-oa', 'o-kappa', 'o-unc', 'o-time'].forEach(function (id) { $(id).textContent = '–'; }); $('algo-info').innerHTML = INFO[alg] + '<br><em>Sem amostras: sorteie ou colete amostras no mapa.</em>'; drawSup(); runObj(); return; }
  MODEL = train(); classifyAll(MODEL, PRED); REGION = fmode === '2' ? regionImage(MODEL) : null;
  var cm = confusion(PRED), dt = performance.now() - t0;
  $('o-oa').textContent = pct(cm.oa); $('o-kappa').textContent = nf(cm.kappa, 2); $('o-unc').textContent = int(cm.unc); $('o-time').textContent = nf(dt, 0) + ' ms';
  var miss = CL.filter(function (_, c) { return MODEL.present.indexOf(c) < 0; }).map(function (c) { return c.n; });
  $('algo-info').innerHTML = INFO[alg] + (MODEL.warn.length ? '<br><strong style="color:var(--no)">Atenção:</strong> covariância mal estimada para ' + MODEL.warn.join(', ') + '. São necessárias mais amostras que bandas.' : '') + (miss.length ? '<br><strong style="color:var(--no)">Classes sem amostras</strong> (nunca serão atribuídas): ' + miss.join(', ') + '.' : '');
  drawSup(); runObj();
}
var runSoon = debounce(run, 140);
segGroup($('seg-alg'), function (v) { alg = v; showParams(); run(); });
segGroup($('seg-feat'), function (v) { fmode = v; run(); });
segGroup($('seg-supview'), function (v) { supView = v; drawSup(); });
$('sup-x').addEventListener('change', run); $('sup-y').addEventListener('change', run);
$('sl-ns').addEventListener('input', function () { $('o-ns').textContent = this.value; });
$('tr-auto').addEventListener('click', function () { autoSamples(); run(); });
$('tr-clear').addEventListener('click', function () { tr.idx = []; tr.y = []; run(); });
$('sl-ppk').addEventListener('input', function () { $('o-ppk').textContent = nf(+this.value, 1); runSoon(); });
$('sl-knn').addEventListener('input', function () { $('o-knn').textContent = this.value; runSoon(); });
$('sl-rf').addEventListener('input', function () { $('o-rf').textContent = this.value; runSoon(); });
cvSup.addEventListener('click', function (e) {
  var p = pixelAt(cvSup, e); if (p < 0) return;
  var k = tr.idx.indexOf(p); if (k >= 0) { tr.y[k] = curCls; } else { tr.idx.push(p); tr.y.push(curCls); }
  run();
});
legend($('legend2'), '<span><i style="background:rgb(30,30,34)"></i>Não classificado</span>');

/* =========================================================
   5. Pixel e objeto
   ========================================================= */
var SEG = new Int32Array(NP), NSEG = 0, SEGMEAN = null, EDGE = new Uint8Array(NP), objView = 'seg', segT = -1;
function segment(T) {
  SEG.fill(-1); var means = [], q = new Int32Array(NP), sid = 0, T2 = T * T;
  for (var s = 0; s < NP; s++) {
    if (SEG[s] >= 0) continue;
    var head = 0, tail = 0, sum = new Float64Array(NB), n = 1; q[tail++] = s; SEG[s] = sid; for (var b = 0; b < NB; b++) sum[b] = X[s * NB + b];
    while (head < tail) {
      var p = q[head++], i = Math.floor(p / N), j = p % N, nb = [i > 0 ? p - N : -1, i < N - 1 ? p + N : -1, j > 0 ? p - 1 : -1, j < N - 1 ? p + 1 : -1];
      for (var k = 0; k < 4; k++) {
        var o = nb[k]; if (o < 0 || SEG[o] >= 0) continue;
        var d = 0; for (b = 0; b < NB; b++) { var t = X[o * NB + b] - sum[b] / n; d += t * t; }
        if (d < T2) { SEG[o] = sid; for (b = 0; b < NB; b++) sum[b] += X[o * NB + b]; n++; q[tail++] = o; }
      }
    }
    for (b = 0; b < NB; b++) sum[b] /= n; means.push(sum); sid++;
  }
  NSEG = sid; SEGMEAN = means;
  for (var p2 = 0; p2 < NP; p2++) { var r = Math.floor(p2 / N), c = p2 % N; EDGE[p2] = (c < N - 1 && SEG[p2] !== SEG[p2 + 1]) || (r < N - 1 && SEG[p2] !== SEG[p2 + N]) ? 1 : 0; }
}
function runObj() {
  var T = +$('sl-seg').value; if (T !== segT) { segment(T); segT = T; }
  $('o-nseg').textContent = int(NSEG);
  if (MODEL) {
    var d = FEAT.length, x = new Float64Array(d), lab = new Int8Array(NSEG);
    for (var s = 0; s < NSEG; s++) { for (var k = 0; k < d; k++) x[k] = SEGMEAN[s][FEAT[k]]; lab[s] = MODEL.predict(x); }
    for (var p = 0; p < NP; p++) OBJPRED[p] = lab[SEG[p]];
    $('o-oapix').textContent = pct(confusion(PRED).oa); $('o-oaobj').textContent = pct(confusion(OBJPRED).oa);
  } else { OBJPRED.fill(-1); $('o-oapix').textContent = '–'; $('o-oaobj').textContent = '–'; }
  drawObj(); updateAcc();
}
function drawObj() {
  var fn = objView === 'seg' ? function (p) { return EDGE[p] ? [255, 255, 255] : falseColor(p); }
    : objView === 'obj' ? function (p) { return OBJPRED[p] < 0 ? UNC : CRGB[OBJPRED[p]]; } : function (p) { return PRED[p] < 0 ? UNC : CRGB[PRED[p]]; };
  paintMap($('cv-obj'), fn);
}
$('sl-seg').addEventListener('input', function () { $('o-seg').textContent = nf(+this.value, 1); });
$('sl-seg').addEventListener('change', runObj);
segGroup($('seg-objview'), function (v) { objView = v; drawObj(); });

/* =========================================================
   6. Avaliação da acurácia
   ========================================================= */
var accSrc = 'pix', selCell = null;
var LK = [[-1, 0, '< 0', 'Pobre'], [0, .2, '0 a 0,20', 'Leve'], [.2, .4, '0,21 a 0,40', 'Razoável'], [.4, .6, '0,41 a 0,60', 'Moderada'], [.6, .8, '0,61 a 0,80', 'Substancial'], [.8, 1.01, '0,81 a 1', 'Quase perfeita']];
function updateAcc() {
  var pred = accSrc === 'pix' ? PRED : OBJPRED, R = confusion(pred), cm = R.cm, short = ['Água', 'Veg. densa', 'Veg. rala', 'Solo', 'Construída'];
  $('acc-src').textContent = accSrc === 'pix' ? 'Classificação por pixel (etapa 4)' : 'Classificação por objeto (etapa 5)';
  if (!selCell || (selCell[0] === selCell[1])) { var best = null; for (var i = 0; i <= NC; i++) for (var j = 0; j < NC; j++) if (i !== j && cm[i][j] && (!best || cm[i][j] > cm[best[0]][best[1]])) best = [i, j]; selCell = best || [0, 0]; }
  var h = '<thead><tr><th class="rowh">Classif. ↓ Ref. →</th>' + short.map(function (s) { return '<th>' + s + '</th>'; }).join('') + '<th>Total</th><th>Usuário</th></tr></thead><tbody>';
  for (i = 0; i <= NC; i++) {
    if (i === NC && !R.unc) continue;
    h += '<tr><th class="rowh">' + (i < NC ? short[i] : 'Não classif.') + '</th>';
    for (j = 0; j < NC; j++) { var cls = 'cell' + (i === j ? ' diag' : cm[i][j] ? ' err' : '') + (selCell[0] === i && selCell[1] === j ? ' sel' : ''); h += '<td class="' + cls + '" data-i="' + i + '" data-j="' + j + '" tabindex="0">' + int(cm[i][j]) + '</td>'; }
    h += '<td class="tot">' + int(R.rowT[i]) + '</td><td class="tot">' + (i < NC && R.rowT[i] ? pct(cm[i][i] / R.rowT[i]) : '–') + '</td></tr>';
  }
  h += '<tr><th class="rowh">Total</th>' + R.colT.map(function (v) { return '<td class="tot">' + int(v) + '</td>'; }).join('') + '<td class="tot">' + int(NP) + '</td><td></td></tr>';
  h += '<tr><th class="rowh">Produtor</th>' + R.colT.map(function (v, k) { return '<td class="tot">' + (v ? pct(cm[k][k] / v) : '–') + '</td>'; }).join('') + '<td></td><td></td></tr></tbody>';
  var tb = $('matrix'); tb.innerHTML = h;
  tb.querySelectorAll('td.cell').forEach(function (td) { var go = function () { selCell = [+td.dataset.i, +td.dataset.j]; updateAcc(); }; td.addEventListener('click', go); td.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); });
  $('a-oa').textContent = pct(R.oa); $('a-k').textContent = nf(R.kappa, 2); $('a-q').textContent = pct(R.Q); $('a-a').textContent = pct(R.A);
  $('lk').innerHTML = LK.map(function (b) { return '<div class="' + (R.kappa >= b[0] && R.kappa < b[1] ? 'on' : '') + '"><b>' + b[2] + '</b>' + b[3] + '</div>'; }).join('');
  var si = selCell[0], sj = selCell[1], n = cm[si][sj], rowName = si < NC ? CL[si].n : 'Não classificado';
  $('o-cell').innerHTML = '<strong>' + int(n) + ' pixels</strong> de referência <strong>' + CL[sj].n.toLowerCase() + '</strong> classificados como <strong>' + rowName.toLowerCase() + '</strong>' + (si === sj ? ' (acertos).' : si < NC ? '. Para ' + CL[sj].n.toLowerCase() + ', são erros de omissão; para ' + rowName.toLowerCase() + ', erros de comissão.' : '.');
  paintMap($('cv-acc'), function (p) { var a = pred[p] < 0 ? NC : pred[p]; if (a === si && TRUTH[p] === sj) return [255, 214, 0]; var c = falseColor(p), g = (c[0] + c[1] + c[2]) / 3; return [g * .45, g * .45, g * .5]; });
}
segGroup($('seg-accsrc'), function (v) { accSrc = v; selCell = null; updateAcc(); });

/* =========================================================
   7. Prática, discussão e navegação
   ========================================================= */
$('codes').innerHTML = CL.map(function (c, i) { return '<tr><td class="mono">' + (i + 1) + '</td><td><span style="display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:8px;background:' + c.c + '"></span>' + c.n + '</td></tr>'; }).join('');
function checklist(listId, barId, key) {
  var saved = store.get(key, {}), boxes = $(listId).querySelectorAll('input[type=checkbox]');
  function upd() { var n = 0; boxes.forEach(function (b) { b.closest('li').classList.toggle('done', b.checked); if (b.checked) n++; }); $(barId).style.width = (n / boxes.length * 100) + '%'; }
  boxes.forEach(function (b) { b.checked = !!saved[b.id]; b.addEventListener('change', function () { saved[b.id] = b.checked; store.set(key, saved); upd(); }); }); upd();
}
checklist('ck-a', 'pg-a', 'sr2-ck-a'); checklist('ck-b', 'pg-b', 'sr2-ck-b'); checklist('ck-c', 'pg-c', 'sr2-ck-c');
(function () {
  var Q = [
    { s: 'Slide 19', q: 'Por que solo exposto e área construída se confundem? Que bandas ajudam a separá-los?', l: [['#atributos', '2. Espaço de atributos'], ['#supervisionada', '4. 2 × 5 bandas']] },
    { s: 'Slide 19', q: 'Quando a classificação não supervisionada é preferível à supervisionada?', l: [['#kmedias', '3. K-médias']] },
    { s: 'Slide 19', q: 'Por que a máxima verossimilhança exige um número mínimo de amostras por classe?', l: [['#supervisionada', '4. Laboratório (3 amostras por classe)']] },
    { s: 'Slide 19', q: 'Como o pixel misto afeta a acurácia em resoluções de 10 m e de 30 m?', l: [['#mapa', '1. Pixel misto'], ['#acuracia', '6. Matriz de confusão']] },
    { s: 'Slide 23', q: 'Quais classes apresentaram maior omissão e maior comissão? Por quê?', l: [['#acuracia', '6. Produtor e usuário']] },
    { s: 'Slide 23', q: 'O resultado mudou entre GMM e Random Forest?', l: [['#supervisionada', '4. Máxima verossimilhança × Random Forest']] },
    { s: 'Slide 23', q: 'O mapa de confiança coincide com as áreas de erro?', l: [['#supervisionada', '4. Acertos e erros']] },
    { s: 'Slide 23', q: 'Como a data da imagem influencia a confusão entre classes?', l: [['#atributos', '2. Separabilidade']] }];
  var notes = store.get('sr2-notes', {}), box = $('qs');
  Q.forEach(function (q, i) {
    var d = document.createElement('div'); d.className = 'q';
    d.innerHTML = '<span class="eyebrow">' + q.s + '</span><p>' + q.q + '</p><div class="links">Retomar: ' + q.l.map(function (x) { return '<a href="' + x[0] + '">' + x[1] + '</a>'; }).join(' · ') + '</div><label class="small muted" for="nt2-' + i + '">Anotações</label><textarea id="nt2-' + i + '" placeholder="Registre aqui os argumentos e as evidências."></textarea>';
    box.appendChild(d); var ta = d.querySelector('textarea'); ta.value = notes[i] || ''; ta.addEventListener('input', function () { notes[i] = ta.value; store.set('sr2-notes', notes); });
  });
})();
(function () {
  var links = document.querySelectorAll('#navlinks a'), map = {}; links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (a) { a.classList.remove('on'); }); var a = map[e.target.id]; if (a) { a.classList.add('on'); try { a.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (_) { } } } }); }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main .step').forEach(function (s) { io.observe(s); });
})();
document.addEventListener('sr-theme', function () { plotSpace.render(); plotKm.render(); plotSup.render(); });

/* ---------- Estado inicial ---------- */
showParams();
selectPixel(Math.floor(N * 0.70) * N + Math.floor(N * 0.2));
autoSamples(); run();
})();
