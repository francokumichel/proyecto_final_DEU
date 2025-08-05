// Configuración inicial del mapa
var map = L.map("map", {
  zoomControl: false
}).setView([-34.92, -57.95], 14);

L.control.zoom({
  position: 'topright'
}).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: 'map-tiles' }).addTo(map);

// 1. Zonas de riesgo
var geojsonData = {
  type: "FeatureCollection",
  features: zonasInundables.map(zona => ({
    type: "Feature",
    properties: { risk: zona.risk, barrio: zona.barrio },
    geometry: {
      type: "Polygon",
      coordinates: [zona.coordinates]
    }
  }))
};

function getColor(risk) {
  return risk === "alto" ? "#dc3545" :
    risk === "medio" ? "#ffc107" :
      "#28a745";
}

let ayudasVisuales = false;

function getStyle(feature) {
  const risk = feature.properties.risk;
  if (risk === "alto") {
    return {
      fillPattern: ayudasVisuales ? patternAlto : undefined,
      fillColor: ayudasVisuales ? undefined : 'rgba(220,53,69,0.4)',
      color: '#dc3545',
      fillOpacity: 0.5,
      weight: 3,
      dashArray: '24,14',
    };
  }
  if (risk === "medio") {
    return {
      fillPattern: ayudasVisuales ? patternMedio : undefined,
      fillColor: ayudasVisuales ? undefined : 'rgba(255,193,7,0.4)',
      color: '#ff9900',
      fillOpacity: 0.5,
      weight: 3,
      dashArray: '4,4',
    };
  }
  return {
    fillPattern: ayudasVisuales ? patternBajo : undefined,
    fillColor: ayudasVisuales ? undefined : 'rgba(40,167,69,0.4)',
    color: '#28a745',
    fillOpacity: 0.5,
    weight: 3,
    dashArray: '',
  };
}

var patternAlto = new L.StripePattern({ weight: 4, spaceColor: '#fff', color: 'rgba(220, 53, 69, 0.4)', spaceOpacity: 0.6, angle: 45 });
patternAlto.addTo(map);

var patternMedio = new L.StripePattern({ weight: 4, spaceColor: '#fff', color: 'rgba(255, 193, 7, 0.4)', spaceOpacity: 0.6, angle: -45 });
patternMedio.addTo(map);

var shape = new L.PatternCircle({
  x: 7.5,
  y: 7.5,
  radius: 6,
  fill: false,
  color: "rgba(40, 167, 69, 0.4)",
  fillColor: "rgba(40, 167, 69, 0.4)",
});
var patternBajo = new L.Pattern({ width: 15, height: 15 });
patternBajo.addShape(shape);
patternBajo.addTo(map);

var geojsonLayers = {
  alto: L.geoJSON(geojsonData, { style: getStyle, filter: f => f.properties.risk === "alto" }),
  medio: L.geoJSON(geojsonData, { style: getStyle, filter: f => f.properties.risk === "medio" }),
  bajo: L.geoJSON(geojsonData, { style: getStyle, filter: f => f.properties.risk === "bajo" })
};

geojsonLayers.alto.on('click', e => mostrarPopupZona(e, 'alto'));
geojsonLayers.medio.on('click', e => mostrarPopupZona(e, 'medio'));
geojsonLayers.bajo.on('click', e => mostrarPopupZona(e, 'bajo'));

function mostrarPopupZona(e, riesgo) {
  const barrio = e.layer.feature.properties.barrio;
  L.popup()
    .setLatLng(e.latlng)
    .setContent(`Zona de riesgo ${riesgo}: ${barrio}`)
    .openOn(map);
}

// 2. Marcadores
var markerLayers = {
  refugios: L.layerGroup(),
  "puntos-encuentro": L.layerGroup(),
  "centros-asistencia": L.layerGroup()
};

marcadoresMapa.forEach(m => {
  let tipoGrupo = m.tipo === "refugio" ? "refugios" :
    m.tipo === "punto-encuentro" ? "puntos-encuentro" :
      m.tipo === "centro-asistencia" ? "centros-asistencia" : null;
  if (!tipoGrupo) return;

  L.marker(m.coords, {
    icon: L.divIcon({
      className: "bi",
      html: `<i class="bi bi-${m.tipo === "refugio" ? "house" :
        m.tipo === "punto-encuentro" ? "geo-alt" :
          m.tipo === "centro-asistencia" ? "plus-square" : ""
        }"></i>`
    })
  }).bindPopup(m.nombre).addTo(markerLayers[tipoGrupo]);
});

// 3. Añadir capas al mapa
function initLayers() {
  geojsonLayers.alto.addTo(map).setStyle({
    fillOpacity: document.getElementById("alto-riesgo").checked ? 0.5 : 0,
    weight: document.getElementById("alto-riesgo").checked ? 1 : 0
  });
  geojsonLayers.medio.addTo(map).setStyle({
    fillOpacity: document.getElementById("riesgo-medio").checked ? 0.5 : 0,
    weight: document.getElementById("riesgo-medio").checked ? 1 : 0
  });
  geojsonLayers.bajo.addTo(map).setStyle({
    fillOpacity: document.getElementById("riesgo-bajo").checked ? 0.5 : 0,
    weight: document.getElementById("riesgo-bajo").checked ? 1 : 0
  });

  if (document.getElementById("refugios").checked) map.addLayer(markerLayers.refugios);
  if (document.getElementById("puntos-encuentro").checked) map.addLayer(markerLayers["puntos-encuentro"]);
  if (document.getElementById("centros-asistencia").checked) map.addLayer(markerLayers["centros-asistencia"]);
}

// 4. Función de filtrado
function applyFilters() {
  geojsonLayers.alto.setStyle(getStyle);
  geojsonLayers.medio.setStyle(getStyle);
  geojsonLayers.bajo.setStyle(getStyle);

  geojsonLayers.alto.setStyle({
    fillOpacity: document.getElementById("alto-riesgo").checked ? 0.5 : 0,
    weight: document.getElementById("alto-riesgo").checked ? 1 : 0
  });
  geojsonLayers.medio.setStyle({
    fillOpacity: document.getElementById("riesgo-medio").checked ? 0.5 : 0,
    weight: document.getElementById("riesgo-medio").checked ? 1 : 0
  });
  geojsonLayers.bajo.setStyle({
    fillOpacity: document.getElementById("riesgo-bajo").checked ? 0.5 : 0,
    weight: document.getElementById("riesgo-bajo").checked ? 1 : 0
  });

  document.getElementById("refugios").checked
    ? map.addLayer(markerLayers.refugios)
    : map.removeLayer(markerLayers.refugios);

  document.getElementById("puntos-encuentro").checked
    ? map.addLayer(markerLayers["puntos-encuentro"])
    : map.removeLayer(markerLayers["puntos-encuentro"]);

  document.getElementById("centros-asistencia").checked
    ? map.addLayer(markerLayers["centros-asistencia"])
    : map.removeLayer(markerLayers["centros-asistencia"]);

  // Listado accesible filtrado
  const zonasFiltradas = zonasInundables.filter(z =>
    (z.risk === "alto" && document.getElementById("alto-riesgo").checked) ||
    (z.risk === "medio" && document.getElementById("riesgo-medio").checked) ||
    (z.risk === "bajo" && document.getElementById("riesgo-bajo").checked)
  );

  const marcadoresFiltrados = [];
  if (document.getElementById("refugios").checked) {
    marcadoresFiltrados.push(
      { tipo: "Refugio", nombre: "Parque Juan Vucetich", descripcion: "Refugio en Parque Juan Vucetich" },
      { tipo: "Refugio", nombre: "Refugio - Club Vecinal", descripcion: "Refugio en Club Vecinal" }
    );
  }
  if (document.getElementById("centros-asistencia").checked) {
    marcadoresFiltrados.push(
      { tipo: "Centro de Asistencia", nombre: "Centro de Salud - Reencuentro", descripcion: "Centro de Salud - Reencuentro" },
      { tipo: "Centro de Asistencia", nombre: "Centro de Salud - Salita", descripcion: "Centro de Salud - Salita" }
    );
  }
  if (document.getElementById("puntos-encuentro").checked) {
    marcadoresFiltrados.push(
      { tipo: "Punto de Encuentro", nombre: "Plaza Matheu", descripcion: "Punto de Encuentro - Plaza Matheu" },
      { tipo: "Punto de Encuentro", nombre: "Parque San Martín", descripcion: "Punto de Encuentro - Parque San Martín" }
    );
  }

  mostrarListadoFiltrado(zonasFiltradas, marcadoresFiltrados);
}

// Ayudas visuales
document.getElementById("toggle-ayudas").addEventListener("click", function() {
  ayudasVisuales = !ayudasVisuales;
  this.setAttribute('aria-pressed', ayudasVisuales);
  this.textContent = ayudasVisuales ? "Ocultar ayudas visuales" : "Mostrar ayudas visuales";
  applyFilters();

  const toastEl = document.getElementById("ayudasToast");
  const toast = new bootstrap.Toast(toastEl);
  toastEl.querySelector(".toast-header strong").textContent = ayudasVisuales
    ? "Ayudas Visuales Activadas"
    : "Ayudas Visuales Desactivadas";
  toast.show();
});

// Inicialización
document.addEventListener("DOMContentLoaded", function() {
  initLayers();
  applyFilters();
  document.querySelectorAll(".form-check-input").forEach(cb => cb.addEventListener("change", applyFilters));
});

function resetFilters() {
  document.querySelectorAll(".form-check-input").forEach(cb => cb.checked = true);
  applyFilters();
}

// ✅ NUEVA FUNCIÓN LISTADO MEJORADO
function mostrarListadoFiltrado(zonasFiltradas, marcadoresFiltrados) {
  const contenedor = document.getElementById('listado-filtrado');
  contenedor.innerHTML = '';

  if (zonasFiltradas.length === 0 && marcadoresFiltrados.length === 0) {
    contenedor.textContent = 'No se encontraron datos filtrados.';
    return;
  }

  // Zonas de riesgo
  const riesgos = ['alto', 'medio', 'bajo'];
  const titulosZonas = { alto: 'Zonas de Riesgo Alto', medio: 'Zonas de Riesgo Medio', bajo: 'Zonas de Riesgo Bajo' };

  riesgos.forEach(risk => {
    const zonas = zonasFiltradas.filter(z => z.risk === risk);
    if (zonas.length > 0) {
      const h = document.createElement('h4');
      h.classList.add('mt-4', 'mb-2', 'd-flex', 'align-items-center', 'gap-2', 'text-primary', 'fw-semibold');

      let colorClass = {
        alto: 'text-danger',
        medio: 'text-warning',
        bajo: 'text-success'
      }[risk] ?? 'text-secondary';

      h.innerHTML = `<span class="${colorClass}" aria-hidden="true">●</span> ${titulosZonas[risk]}`;
      contenedor.appendChild(h);

      const ul = document.createElement('ul');
      zonas.forEach(z => {
        const li = document.createElement('li');
        li.classList.add('text-secondary', 'mb-1');
        li.style.listStyleType = 'none';
        li.innerHTML = `<strong>${z.barrio}</strong>`;
        ul.appendChild(li);
      });
      contenedor.appendChild(ul);
    }
  });

  // Marcadores
  const nombreSeccion = {
    'Refugio': 'Refugios',
    'Centro de Asistencia': 'Centros de Asistencia',
    'Punto de Encuentro': 'Puntos de Encuentro'
  };

  ['Refugio', 'Centro de Asistencia', 'Punto de Encuentro'].forEach(tipo => {
    const marcadores = marcadoresFiltrados.filter(m => m.tipo === tipo);
    if (marcadores.length > 0) {
      const h = document.createElement('h4');
      h.classList.add('mt-4', 'mb-2', 'd-flex', 'align-items-center', 'gap-2', 'text-primary', 'fw-semibold');

      let iconClass = {
        'Refugio': 'bi-house',
        'Centro de Asistencia': 'bi-plus-square',
        'Punto de Encuentro': 'bi-geo-alt'
      }[tipo] ?? 'bi-question-circle';

      h.innerHTML = `<span class="bi ${iconClass} text-primary" aria-hidden="true"></span> ${nombreSeccion[tipo] ?? tipo}`;
      contenedor.appendChild(h);

      const ul = document.createElement('ul');
      marcadores.forEach(m => {
        const li = document.createElement('li');
        li.classList.add('text-secondary', 'mb-1');
        li.style.listStyleType = 'none';
        li.innerHTML = `<strong>Nombre:</strong> ${m.nombre}<br><strong>Descripción:</strong> ${m.descripcion}`;
        ul.appendChild(li);
      });
      contenedor.appendChild(ul);
    }
  });
}

