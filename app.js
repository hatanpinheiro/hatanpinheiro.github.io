/**
 * GEOPARQUE MUNDIAL DA UNESCO CAMINHOS DOS CÂNIOS DO SUL (GMUCCS)
 * Web GIS Application Logic (Lowy Institute Global Diplomacy Index style)
 * Cores Oficiais do Geoparque: Verde Floresta/Mata Atlântica (#10b981),
 * Ocre/Dourado Cânions (#f59e0b), Azul Rios e Oceano (#06b6d4)
 */

document.addEventListener('DOMContentLoaded', () => {
  // State management (Clean Light Mode Only)
  let currentTheme = 'light';
  let currentActiveGeosite = null;
  let activeFilterGrau = 'todos';
  let activeFilterCategoria = 'todas';
  let activeFilterMunicipio = 'todos';
  let activeSearchTerm = '';
  let activeNetworkMode = 'municipio';
  
  let showNetworkRays = true;
  let showBoundaries = true;
  let showRadar = true;
  let showCallout = true;
  let currentBasemap = 'light'; // 'light' (Esri Light Gray Canvas), 'topo' (Esri Topo), 'sat' (Esri Sat)

  // Animation frame ID
  let animFrameId = null;
  let animPulseOffset = 0;

  // --------------------------------------------------------------------------
  // 1. MAP INITIALIZATION (LEAFLET)
  // --------------------------------------------------------------------------
  const map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    minZoom: 8,
    maxZoom: 18,
    center: GMUCCS_INFO.centro,
    zoom: GMUCCS_INFO.zoom_padrao
  });

  // Basemap tile layers (100% livres de marca d'água)
  // Modo Claro Minimalista: ESRI World Light Gray Canvas (elegante, clean, alta performance)
  const lightGrayBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Esri, HERE, Garmin, © OpenStreetMap contributors'
  });
  const lightGrayRef = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16
  });
  const lightGrayGroup = L.layerGroup([lightGrayBase, lightGrayRef]);

  // Relevo & Topografia: ESRI World Topographic Map
  const lightTopoLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Esri, DeLorme, NAVTEQ, TomTom, Intermap, USGS'
  });

  // Satélite: ESRI World Imagery
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Esri, Maxar, Earthstar Geographics'
  });

  // Iniciar com o modo claro clean do Geoparque
  lightGrayGroup.addTo(map);

  // Canvas layer for Lowy Network Rays
  const canvas = document.getElementById('network-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // --------------------------------------------------------------------------
  // 2. MUNICIPAL BOUNDARIES (IBGE POLYGONS COM CORES DO GEOPARQUE)
  // --------------------------------------------------------------------------
  let boundariesLayer = null;

  function getBoundaryColor() {
    return '#00552b';
  }

  function initBoundaries() {
    boundariesLayer = L.geoJSON(MUNICIPIOS_GEOJSON, {
      style: (feature) => ({
        color: getBoundaryColor(),
        weight: 1.5,
        dashArray: '3, 4',
        opacity: 0.8,
        fillColor: getBoundaryColor(),
        fillOpacity: 0.04
      }),
      onEachFeature: (feature, layer) => {
        const nome = feature.properties.nome;
        const uf = feature.properties.uf || '';
        layer.bindTooltip(`<strong>${nome} (${uf})</strong><br><span style="font-size:10px;color:var(--accent-primary)">GMUCCS UNESCO</span>`, {
          className: 'custom-leaflet-tooltip',
          direction: 'center',
          permanent: false
        });

        layer.on('mouseover', () => {
          layer.setStyle({
            weight: 2.2,
            opacity: 0.95,
            fillOpacity: 0.12,
            color: '#076d39'
          });
        });

        layer.on('mouseout', () => {
          boundariesLayer.resetStyle(layer);
        });

        layer.on('click', () => {
          const select = document.getElementById('select-municipio');
          select.value = nome;
          activeFilterMunicipio = nome;
          applyFilters();
          map.fitBounds(layer.getBounds(), { padding: [60, 60], maxZoom: 12 });
        });
      }
    }).addTo(map);
  }
  initBoundaries();

  // --------------------------------------------------------------------------
  // 3. GEOSITES MARKERS (PALETA GMUCCS)
  // --------------------------------------------------------------------------
  const markersMap = new Map(); // id -> leaflet marker
  const markersGroup = L.layerGroup().addTo(map);

  const radarGroup = L.layerGroup().addTo(map);

  function createMarkerIcon(geosite, isActive = false) {
    const grauClass = 'marker-' + geosite.grau.toLowerCase();
    const activeClass = isActive ? 'is-active' : '';
    return L.divIcon({
      className: `geosite-marker ${grauClass} ${activeClass}`,
      html: `
        <div class="marker-halo">
          <div class="marker-core"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  }

  function initMarkers() {
    markersGroup.clearLayers();
    markersMap.clear();

    GEOSSITIOS.forEach(geo => {
      const icon = createMarkerIcon(geo, false);
      const marker = L.marker(geo.coords, { icon: icon });

      marker.on('click', () => {
        selectGeosite(geo, true);
      });

      marker.on('mouseover', () => {
        if (currentActiveGeosite && currentActiveGeosite.id === geo.id) return;
        marker.getElement()?.classList.add('is-hovered');
      });

      marker.on('mouseout', () => {
        marker.getElement()?.classList.remove('is-hovered');
      });

      markersMap.set(geo.id, marker);
      markersGroup.addLayer(marker);
    });
  }
  initMarkers();

  // --------------------------------------------------------------------------
  // 4. RADAR PULSING AND HUD CALLOUT
  // --------------------------------------------------------------------------
  function updateRadarOverlay() {
    radarGroup.clearLayers();
    if (!showRadar || !currentActiveGeosite) return;

    const radarIcon = L.divIcon({
      className: 'radar-marker-container',
      html: `
        <div class="radar-ring"></div>
        <div class="radar-ring"></div>
        <div class="radar-ring"></div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });

    const radarMarker = L.marker(currentActiveGeosite.coords, {
      icon: radarIcon,
      interactive: false,
      zIndexOffset: -100
    });
    radarGroup.addLayer(radarMarker);
  }

  function updateHUDCallout() {
    const calloutLayer = document.getElementById('hud-callout-layer');
    calloutLayer.innerHTML = '';
    if (!showCallout || !currentActiveGeosite) return;

    const pt = map.latLngToContainerPoint(currentActiveGeosite.coords);

    const calloutEl = document.createElement('div');
    calloutEl.className = 'hud-callout-anchor';
    calloutEl.style.left = `${pt.x}px`;
    calloutEl.style.top = `${pt.y}px`;

    calloutEl.innerHTML = `
      <div class="hud-callout-leader"></div>
      <div class="hud-callout-box">
        <div class="callout-title">${currentActiveGeosite.nome}</div>
        <div class="callout-sub">${currentActiveGeosite.municipio} • ${currentActiveGeosite.grau.toUpperCase()}</div>
      </div>
    `;

    calloutEl.querySelector('.hud-callout-box').addEventListener('click', () => {
      map.flyTo(currentActiveGeosite.coords, 13, { duration: 1.2 });
    });

    calloutLayer.appendChild(calloutEl);
  }

  // --------------------------------------------------------------------------
  // 5. LOWY RAY NETWORK RENDERER (CANVAS COM CORES DO GEOPARQUE)
  // --------------------------------------------------------------------------
  function getConnectedGeosites(source) {
    if (!source) return [];

    let targets = [];
    const visibleGeos = getVisibleGeosites();

    if (activeNetworkMode === 'municipio') {
      targets = visibleGeos.filter(g => g.municipio === source.municipio && g.id !== source.id);
    } else if (activeNetworkMode === 'categoria') {
      targets = visibleGeos.filter(g => g.categoria_primaria === source.categoria_primaria && g.id !== source.id);
    } else if (activeNetworkMode === 'grau') {
      targets = visibleGeos.filter(g => g.grau === source.grau && g.id !== source.id);
    } else if (activeNetworkMode === 'proximidade') {
      const withDist = visibleGeos
        .filter(g => g.id !== source.id)
        .map(g => ({ geo: g, dist: calculateDistance(source.lat, source.lon, g.lat, g.lon) }))
        .sort((a, b) => a.dist - b.dist);
      targets = withDist.slice(0, 5).map(item => item.geo);
    } else if (activeNetworkMode === 'constelacao') {
      targets = visibleGeos.filter(g => g.id !== source.id);
    }

    return targets;
  }

  function drawNetworkRays() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!showNetworkRays || !currentActiveGeosite) return;

    const sourcePoint = map.latLngToContainerPoint(currentActiveGeosite.coords);
    const connected = getConnectedGeosites(currentActiveGeosite);

    animPulseOffset = (animPulseOffset + 0.015) % 1;

    // Cores oficiais extraídas de canionsdosul.org e logo oficial
    const primaryRayColor = 'rgba(0, 85, 43, 0.85)';   // #00552B
    const midRayColor = 'rgba(157, 179, 0, 0.65)';     // #9DB300
    const endRayColor = 'rgba(0, 164, 186, 0.35)';     // #00A4BA
    const shadowRayColor = 'rgba(0, 85, 43, 0.25)';
    const particleColor = '#00552b';

    connected.forEach((target, index) => {
      const targetPoint = map.latLngToContainerPoint(target.coords);

      const dx = targetPoint.x - sourcePoint.x;
      const dy = targetPoint.y - sourcePoint.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const curveAmount = Math.min(dist * 0.15, 45);
      const mx = (sourcePoint.x + targetPoint.x) / 2 - (dy / dist) * curveAmount;
      const my = (sourcePoint.y + targetPoint.y) / 2 + (dx / dist) * curveAmount;

      // Base beam line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sourcePoint.x, sourcePoint.y);
      ctx.quadraticCurveTo(mx, my, targetPoint.x, targetPoint.y);

      const grad = ctx.createLinearGradient(sourcePoint.x, sourcePoint.y, targetPoint.x, targetPoint.y);
      grad.addColorStop(0, primaryRayColor);
      grad.addColorStop(0.5, midRayColor);
      grad.addColorStop(1, endRayColor);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = shadowRayColor;
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.restore();

      // Traveling photon particle
      const t = (animPulseOffset + (index * 0.18)) % 1;
      const px = (1 - t) * (1 - t) * sourcePoint.x + 2 * (1 - t) * t * mx + t * t * targetPoint.x;
      const py = (1 - t) * (1 - t) * sourcePoint.y + 2 * (1 - t) * t * my + t * t * targetPoint.y;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.shadowColor = shadowRayColor;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    });
  }

  function startAnimationLoop() {
    function loop() {
      drawNetworkRays();
      animFrameId = requestAnimationFrame(loop);
    }
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  map.on('move', () => {
    drawNetworkRays();
    updateHUDCallout();
  });
  map.on('zoom', () => {
    drawNetworkRays();
    updateHUDCallout();
  });
  startAnimationLoop();

  // --------------------------------------------------------------------------
  // 6. DISTANCE UTILITY (HAVERSINE)
  // --------------------------------------------------------------------------
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // --------------------------------------------------------------------------
  // 7. SELECTION & DETAIL HUD PANEL UPDATER
  // --------------------------------------------------------------------------
  function selectGeosite(geo, panMap = false) {
    if (!geo) return;

    if (currentActiveGeosite && markersMap.has(currentActiveGeosite.id)) {
      const oldMarker = markersMap.get(currentActiveGeosite.id);
      oldMarker.setIcon(createMarkerIcon(currentActiveGeosite, false));
    }

    currentActiveGeosite = geo;

    if (markersMap.has(geo.id)) {
      const newMarker = markersMap.get(geo.id);
      newMarker.setIcon(createMarkerIcon(geo, true));
    }

    document.getElementById('focus-id').textContent = `ID #${geo.id}`;
    document.getElementById('detail-name').textContent = geo.nome;

    const grauEl = document.getElementById('detail-grau');
    grauEl.textContent = geo.grau;
    grauEl.className = 'detail-badge-grau badge-' + geo.grau.toLowerCase();

    document.getElementById('detail-muni').textContent = geo.municipio_completo;
    document.getElementById('detail-tipo').textContent = geo.categoria;
    document.getElementById('detail-formacao').textContent = geo.formacao;
    document.getElementById('detail-formacao').title = geo.formacao;
    document.getElementById('detail-altitude').textContent = geo.altitude;
    document.getElementById('detail-coords').textContent = `${geo.lat.toFixed(4)}°, ${geo.lon.toFixed(4)}°`;
    document.getElementById('detail-desc').textContent = geo.descricao;

    // Atualiza Fotografia do Geossítio (busca id{01-30}.png na pasta assets)
    const photoEl = document.getElementById('detail-photo');
    const photoTag = document.getElementById('photo-id-tag');
    const photoCaption = document.getElementById('photo-caption');
    const idFormatted = `id${String(geo.id).padStart(2, '0')}.png`;

    if (photoEl) {
      photoEl.onerror = () => {
        photoEl.src = 'assets/emblema_geoparque.png';
        photoEl.classList.add('photo-fallback');
      };
      photoEl.onload = () => {
        photoEl.classList.remove('photo-fallback');
      };
      photoEl.src = `assets/${idFormatted}`;
      photoEl.alt = `Fotografia do Geossítio ${geo.nome}`;
    }

    if (photoTag) photoTag.textContent = `ID #${geo.id}`;
    if (photoCaption) photoCaption.textContent = geo.nome;

    const proximityList = document.getElementById('proximity-list');
    proximityList.innerHTML = '';
    const neighbors = GEOSSITIOS
      .filter(g => g.id !== geo.id)
      .map(g => ({ geo: g, dist: calculateDistance(geo.lat, geo.lon, g.lat, g.lon) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3);

    neighbors.forEach(item => {
      const row = document.createElement('div');
      row.className = 'proximity-item';
      row.innerHTML = `
        <span>${item.geo.nome} (${item.geo.municipio})</span>
        <span class="proximity-dist">${item.dist.toFixed(1)} km</span>
      `;
      row.addEventListener('click', () => {
        selectGeosite(item.geo, true);
      });
      proximityList.appendChild(row);
    });

    updateRadarOverlay();
    updateHUDCallout();

    if (panMap) {
      map.flyTo(geo.coords, Math.max(map.getZoom(), 11), {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  }

  // --------------------------------------------------------------------------
  // 8. FILTERING SYSTEM
  // --------------------------------------------------------------------------
  function getVisibleGeosites() {
    return GEOSSITIOS.filter(geo => {
      if (activeFilterGrau !== 'todos' && geo.grau.toLowerCase() !== activeFilterGrau.toLowerCase()) {
        return false;
      }
      if (activeFilterCategoria !== 'todas') {
        if (!geo.categoria.toLowerCase().includes(activeFilterCategoria.toLowerCase())) {
          return false;
        }
      }
      if (activeFilterMunicipio !== 'todos') {
        if (geo.municipio.toLowerCase() !== activeFilterMunicipio.toLowerCase()) {
          return false;
        }
      }
      if (activeSearchTerm) {
        const term = activeSearchTerm.toLowerCase();
        const matches =
          geo.nome.toLowerCase().includes(term) ||
          geo.municipio.toLowerCase().includes(term) ||
          geo.categoria.toLowerCase().includes(term) ||
          geo.formacao.toLowerCase().includes(term) ||
          geo.descricao.toLowerCase().includes(term);
        if (!matches) return false;
      }
      return true;
    });
  }

  function applyFilters() {
    const visible = getVisibleGeosites();
    const visibleIds = new Set(visible.map(g => g.id));

    markersMap.forEach((marker, id) => {
      if (visibleIds.has(id)) {
        if (!markersGroup.hasLayer(marker)) {
          markersGroup.addLayer(marker);
        }
      } else {
        if (markersGroup.hasLayer(marker)) {
          markersGroup.removeLayer(marker);
        }
      }
    });

    document.getElementById('val-visible-count').textContent = visible.length;

    if (currentActiveGeosite && !visibleIds.has(currentActiveGeosite.id)) {
      if (visible.length > 0) {
        selectGeosite(visible[0], false);
      } else {
        currentActiveGeosite = null;
        updateRadarOverlay();
        updateHUDCallout();
      }
    } else if (!currentActiveGeosite && visible.length > 0) {
      selectGeosite(visible[0], false);
    }

    drawNetworkRays();
  }

  // Clean Light Mode Basemap & UI State
  function updateBasemap(type) {
    currentBasemap = type;
    const btnLight = document.getElementById('btn-layer-light');
    const btnTopo = document.getElementById('btn-layer-topo');
    const btnSat = document.getElementById('btn-layer-sat');

    [btnLight, btnTopo, btnSat].forEach(b => {
      if (b) b.classList.remove('active');
    });

    map.removeLayer(lightGrayGroup);
    map.removeLayer(lightTopoLayer);
    map.removeLayer(satelliteLayer);

    if (type === 'sat') {
      satelliteLayer.addTo(map);
      if (btnSat) btnSat.classList.add('active');
    } else if (type === 'topo') {
      lightTopoLayer.addTo(map);
      if (btnTopo) btnTopo.classList.add('active');
    } else {
      lightGrayGroup.addTo(map);
      if (btnLight) btnLight.classList.add('active');
    }

    if (boundariesLayer) {
      boundariesLayer.setStyle({
        color: getBoundaryColor(),
        fillColor: getBoundaryColor(),
        fillOpacity: 0.04
      });
    }
  }

  const btnLight = document.getElementById('btn-layer-light');
  const btnTopo = document.getElementById('btn-layer-topo');
  const btnSat = document.getElementById('btn-layer-sat');

  if (btnLight) btnLight.addEventListener('click', () => updateBasemap('light'));
  if (btnTopo) btnTopo.addEventListener('click', () => updateBasemap('topo'));
  if (btnSat) btnSat.addEventListener('click', () => updateBasemap('sat'));

  // --------------------------------------------------------------------------
  // 10. EVENT LISTENERS: FILTERS & CONTROLS
  // --------------------------------------------------------------------------

  // KPI cards filter by Grau
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.kpi-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      activeFilterGrau = card.getAttribute('data-filter-grau');
      applyFilters();
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    activeSearchTerm = e.target.value.trim();
    applyFilters();
  });

  // Município select dropdown
  const selectMunicipio = document.getElementById('select-municipio');
  selectMunicipio.addEventListener('change', (e) => {
    activeFilterMunicipio = e.target.value;
    const badge = document.getElementById('muni-badge');
    badge.textContent = activeFilterMunicipio === 'todos' ? '7 Cidades' : activeFilterMunicipio;
    applyFilters();
  });

  // Category pills
  document.querySelectorAll('#tipo-pill-group .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tipo-pill-group .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilterCategoria = btn.getAttribute('data-categoria');
      document.getElementById('tipo-badge').textContent = activeFilterCategoria === 'todas' ? 'Todas' : activeFilterCategoria;
      applyFilters();
    });
  });

  // Network mode pills (Lowy ray style)
  document.querySelectorAll('#network-mode-group .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#network-mode-group .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeNetworkMode = btn.getAttribute('data-net-mode');
      drawNetworkRays();
    });
  });

  // Toggles
  document.getElementById('toggle-network-rays').addEventListener('change', (e) => {
    showNetworkRays = e.target.checked;
    drawNetworkRays();
  });

  document.getElementById('toggle-boundaries').addEventListener('change', (e) => {
    showBoundaries = e.target.checked;
    if (showBoundaries) {
      if (!map.hasLayer(boundariesLayer)) map.addLayer(boundariesLayer);
    } else {
      if (map.hasLayer(boundariesLayer)) map.removeLayer(boundariesLayer);
    }
  });

  document.getElementById('toggle-radar').addEventListener('change', (e) => {
    showRadar = e.target.checked;
    updateRadarOverlay();
  });

  document.getElementById('toggle-callout').addEventListener('change', (e) => {
    showCallout = e.target.checked;
    updateHUDCallout();
  });

  // Center on active geosite button
  document.getElementById('btn-center-geosite').addEventListener('click', () => {
    if (currentActiveGeosite) {
      map.flyTo(currentActiveGeosite.coords, 13, { duration: 1.2 });
    }
  });

  // --------------------------------------------------------------------------
  // 11. FLOATING MAP TOOLBAR (RIGHT)
  // --------------------------------------------------------------------------
  document.getElementById('btn-zoom-in').addEventListener('click', () => map.zoomIn());
  document.getElementById('btn-zoom-out').addEventListener('click', () => map.zoomOut());
  
  document.getElementById('btn-fit-bounds').addEventListener('click', () => {
    const visible = getVisibleGeosites();
    if (visible.length > 0) {
      const bounds = L.latLngBounds(visible.map(g => g.coords));
      map.fitBounds(bounds, { padding: [60, 60] });
    } else {
      map.setView(GMUCCS_INFO.centro, GMUCCS_INFO.zoom_padrao);
    }
  });


  // HUD panel toggle trigger
  const hudPanel = document.getElementById('hud-panel');
  const panelToggleBtn = document.getElementById('panel-toggle-btn');
  panelToggleBtn.addEventListener('click', () => {
    hudPanel.classList.toggle('collapsed');
    panelToggleBtn.classList.toggle('panel-collapsed');
    setTimeout(() => {
      map.invalidateSize();
      resizeCanvas();
      drawNetworkRays();
      updateHUDCallout();
    }, 300);
  });

  // --------------------------------------------------------------------------
  // 12. TOP NAVIGATION TABS & ACTIONS
  // --------------------------------------------------------------------------
  document.querySelectorAll('.nav-tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const action = tab.getAttribute('data-tab');

      if (action === 'sobre') {
        openModal();
      } else if (action === 'rede') {
        activeNetworkMode = 'constelacao';
        document.querySelectorAll('#network-mode-group .pill-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-net-mode') === 'constelacao');
        });
        showNetworkRays = true;
        document.getElementById('toggle-network-rays').checked = true;
        drawNetworkRays();
      } else if (action === 'municipios') {
        if (boundariesLayer) {
          map.fitBounds(boundariesLayer.getBounds(), { padding: [40, 40] });
        }
      } else if (action === 'tipologia') {
        document.getElementById('tipo-pill-group').scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'relevancia') {
        document.querySelector('.kpi-grid').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Quick toggle rays button
  document.getElementById('btn-toggle-rays').addEventListener('click', () => {
    showNetworkRays = !showNetworkRays;
    document.getElementById('toggle-network-rays').checked = showNetworkRays;
    drawNetworkRays();
  });

  // Fullscreen button
  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  });

  // Modal dialog (Sobre o Geoparque)
  const modal = document.getElementById('modal-sobre');
  const btnInfo = document.getElementById('btn-info');
  const modalClose = document.getElementById('modal-close');

  function openModal() { modal.classList.add('open'); }
  function closeModal() { modal.classList.remove('open'); }

  btnInfo.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Modal dialog (Diagrama da Ferramenta)
  const modalDiagram = document.getElementById('modal-diagrama');
  const btnDiagram = document.getElementById('btn-diagram');
  const modalDiagramClose = document.getElementById('modal-diagram-close');

  function openDiagramModal() { modalDiagram.classList.add('open'); }
  function closeDiagramModal() { modalDiagram.classList.remove('open'); }

  btnDiagram.addEventListener('click', openDiagramModal);
  modalDiagramClose.addEventListener('click', closeDiagramModal);
  modalDiagram.addEventListener('click', (e) => {
    if (e.target === modalDiagram) closeDiagramModal();
  });

  // --------------------------------------------------------------------------
  // 13. MOUSE COORDINATE TRACKER (WGS84 & UTM 22S)
  // --------------------------------------------------------------------------
  function latLonToUTM22S(lat, lon) {
    const a = 6378137.0;
    const f = 1 / 298.257223563;
    const k0 = 0.9996;
    const e = Math.sqrt(2 * f - f * f);
    const ePrimeSquared = (e * e) / (1 - e * e);
    const lon0 = -51.0 * (Math.PI / 180);

    const phi = lat * (Math.PI / 180);
    const lambda = lon * (Math.PI / 180);

    const N = a / Math.sqrt(1 - e * e * Math.sin(phi) * Math.sin(phi));
    const T = Math.tan(phi) * Math.tan(phi);
    const C = ePrimeSquared * Math.cos(phi) * Math.cos(phi);
    const A = Math.cos(phi) * (lambda - lon0);

    const M = a * ((1 - e * e / 4 - 3 * e * e * e * e / 64 - 5 * e * e * e * e * e * e / 256) * phi
      - (3 * e * e / 8 + 3 * e * e * e * e / 32 + 45 * e * e * e * e * e * e / 1024) * Math.sin(2 * phi)
      + (15 * e * e * e * e / 256 + 45 * e * e * e * e * e * e / 1024) * Math.sin(4 * phi)
      - (35 * e * e * e * e * e * e / 3072) * Math.sin(6 * phi));

    const easting = k0 * N * (A + (1 - T + C) * Math.pow(A, 3) / 6
      + (5 - 18 * T + T * T + 72 * C - 58 * ePrimeSquared) * Math.pow(A, 5) / 120) + 500000;

    let northing = k0 * (M + N * Math.tan(phi) * (Math.pow(A, 2) / 2
      + (5 - T + 9 * C + 4 * C * C) * Math.pow(A, 4) / 24
      + (61 - 58 * T + T * T + 600 * C - 330 * ePrimeSquared) * Math.pow(A, 6) / 720));

    if (lat < 0) {
      northing += 10000000;
    }

    return { easting: Math.round(easting), northing: Math.round(northing) };
  }

  const valLat = document.getElementById('val-lat');
  const valLon = document.getElementById('val-lon');
  const valUtm = document.getElementById('val-utm');

  map.on('mousemove', (e) => {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    valLat.textContent = `${lat.toFixed(4)}°`;
    valLon.textContent = `${lon.toFixed(4)}°`;

    const utm = latLonToUTM22S(lat, lon);
    valUtm.textContent = `${utm.easting.toLocaleString('pt-BR')} E, ${utm.northing.toLocaleString('pt-BR')} N`;
  });

  // --------------------------------------------------------------------------
  // 14. INITIAL STATE SELECTION
  // --------------------------------------------------------------------------
  const defaultGeosite = GEOSSITIOS.find(g => g.nome === 'Cânion Itaimbezinho') || GEOSSITIOS[0];
  selectGeosite(defaultGeosite, false);
});
