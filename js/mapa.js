// Configuración inicial del mapa
var map = L.map("map", {
  zoomControl: false
}).setView([-34.92, -57.95], 14);

// Agregamos el control de zoom manualmente en la posición deseada
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

// Modifica la función de estilo de cada capa para usar fillPattern solo si ayudasVisuales está activo
function getStyle(feature) {
  const risk = feature.properties.risk;
  if (risk === "alto") {
    return {
      fillPattern: ayudasVisuales ? patternAlto : undefined,
      fillColor: ayudasVisuales ? undefined : 'rgba(220,53,69,0.4)', // rojo translúcido
      color: '#dc3545', // borde rojo
      fillOpacity: 0.5,
      weight: 3,
      dashArray: '24,14', // rayado ancho para alto riesgo
    };
  }
  if (risk === "medio") {
    return {
      fillPattern: ayudasVisuales ? patternMedio : undefined,
      fillColor: ayudasVisuales ? undefined : 'rgba(255,193,7,0.4)', // amarillo translúcido
      color: '#ff9900', // borde naranja
      fillOpacity: 0.5,
      weight: 3,
      dashArray: '4,4', // borde punteado
    };
  }
  // Bajo riesgo
  return {
    fillPattern: ayudasVisuales ? patternBajo : undefined,
    fillColor: ayudasVisuales ? undefined : 'rgba(40,167,69,0.4)', // verde translúcido
    color: '#28a745', // borde verde
    fillOpacity: 0.5,
    weight: 3,
    dashArray: '', // borde sólido
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
  color: "rgba(40, 167, 69, 0.4)",       // Borde transparente
  fillColor: "rgba(40, 167, 69, 0.4)",   // Relleno transparente
});
var patternBajo = new L.Pattern({ width: 15, height: 15 });
patternBajo.addShape(shape);
patternBajo.addTo(map);

var geojsonLayers = {
  alto: L.geoJSON(geojsonData, {
    style: getStyle,
    filter: f => f.properties.risk === "alto",
  }),
  medio: L.geoJSON(geojsonData, {
    style: getStyle,
    filter: f => f.properties.risk == "medio",
  }),
  bajo: L.geoJSON(geojsonData, {
    style: getStyle,
    filter: f => f.properties.risk == "bajo",
  })
};

geojsonLayers.alto.on('click', function(e) {
  const barrio = e.layer.feature.properties.barrio;
  L.popup()
    .setLatLng(e.latlng)
    .setContent('Zona de riesgo alto: ' + barrio)
    .openOn(map);
});
geojsonLayers.medio.on('click', function(e) {
  const barrio = e.layer.feature.properties.barrio;
  L.popup()
    .setLatLng(e.latlng)
    .setContent('Zona de riesgo medio: ' + barrio)
    .openOn(map);
});
geojsonLayers.bajo.on('click', function(e) {
  const barrio = e.layer.feature.properties.barrio;
  L.popup()
    .setLatLng(e.latlng)
    .setContent('Zona de riesgo bajo: ' + barrio)
    .openOn(map);
});



// 2. Marcadores 
var markerLayers = {
  refugios: L.layerGroup(),
  "puntos-encuentro": L.layerGroup(),
  "centros-asistencia": L.layerGroup()
};

marcadoresMapa.forEach(m => {
  // Mapea el tipo al grupo correspondiente
  let tipoGrupo = m.tipo === "refugio" ? "refugios" :
    m.tipo === "punto-encuentro" ? "puntos-encuentro" :
      m.tipo === "centro-asistencia" ? "centros-asistencia" : null;
  if (!tipoGrupo) return;

  L.marker(m.coords, {
    icon: L.divIcon({
      className: "bi", html: `<i class="bi bi-${m.tipo === "refugio" ? "house" :
        m.tipo === "punto-encuentro" ? "geo-alt" :
          m.tipo === "centro-asistencia" ? "plus-square" : ""
        }"></i>`
    })
  }).bindPopup(m.nombre).addTo(markerLayers[tipoGrupo]);
});

// 3. Añadir capas al mapa
function initLayers() {
  // Zonas de riesgo (mostrar/ocultar según checkbox)
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

  // Marcadores (mostrar/ocultar según checkbox)
  if (document.getElementById("refugios").checked) map.addLayer(markerLayers.refugios);
  if (document.getElementById("puntos-encuentro").checked) map.addLayer(markerLayers["puntos-encuentro"]);
  if (document.getElementById("centros-asistencia").checked) map.addLayer(markerLayers["centros-asistencia"]);
}

// 4. Función de filtrado
function applyFilters() {
  geojsonLayers.alto.setStyle(getStyle);
  geojsonLayers.medio.setStyle(getStyle);
  geojsonLayers.bajo.setStyle(getStyle);

  // Zonas
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

  // Marcadores
  document.getElementById("refugios").checked
    ? map.addLayer(markerLayers.refugios)
    : map.removeLayer(markerLayers.refugios);

  document.getElementById("puntos-encuentro").checked
    ? map.addLayer(markerLayers["puntos-encuentro"])
    : map.removeLayer(markerLayers["puntos-encuentro"]);

  document.getElementById("centros-asistencia").checked
    ? map.addLayer(markerLayers["centros-asistencia"])
    : map.removeLayer(markerLayers["centros-asistencia"]);

  // --- Listado accesible de datos filtrados ---
  const datosFiltrados = [];

  // Zonas de riesgo
  if (document.getElementById("alto-riesgo").checked) {
    datosFiltrados.push({ tipo: "Zona Inundable", riesgo: "Alto", descripcion: "Zona de riesgo alto" });
  }
  if (document.getElementById("riesgo-medio").checked) {
    datosFiltrados.push({ tipo: "Zona Inundable", riesgo: "Medio", descripcion: "Zona de riesgo medio" });
  }
  if (document.getElementById("riesgo-bajo").checked) {
    datosFiltrados.push({ tipo: "Zona Inundable", riesgo: "Bajo", descripcion: "Zona de riesgo bajo" });
  }

  // Marcadores
  if (document.getElementById("refugios").checked) {
    datosFiltrados.push(
      { tipo: "Refugio", nombre: "Parque Juan Vucetich", descripcion: "Refugio en Parque Juan Vucetich" },
      { tipo: "Refugio", nombre: "Refugio - Club Vecinal", descripcion: "Refugio en Club Vecinal" }
    );
  }
  if (document.getElementById("centros-asistencia").checked) {
    datosFiltrados.push(
      { tipo: "Centro de Asistencia", nombre: "Centro de Salud - Reencuentro", descripcion: "Centro de Salud - Reencuentro" },
      { tipo: "Centro de Asistencia", nombre: "Centro de Salud - Salita", descripcion: "Centro de Salud - Salita" }
    );
  }
  if (document.getElementById("puntos-encuentro").checked) {
    datosFiltrados.push(
      { tipo: "Punto de Encuentro", nombre: "Plaza Matheu", descripcion: "Punto de Encuentro - Plaza Matheu" },
      { tipo: "Punto de Encuentro", nombre: "Parque San Martín", descripcion: "Punto de Encuentro - Parque San Martín" }
    );
  }

  mostrarListadoFiltrado(datosFiltrados);
}

// Lógica para el botón de ayudas visuales:
document.getElementById("toggle-ayudas").addEventListener("click", function() {
  ayudasVisuales = !ayudasVisuales;
  this.setAttribute('aria-pressed', ayudasVisuales);
  this.textContent = ayudasVisuales ? "Ocultar ayudas visuales" : "Mostrar ayudas visuales";
  applyFilters();

  // Mostrar el toast
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

  // Event listeners
  document.querySelectorAll(".form-check-input").forEach(cb => {
    cb.addEventListener("change", applyFilters);
  });
});

function resetFilters() {
  document.querySelectorAll(".form-check-input").forEach(cb => cb.checked = true);
  applyFilters();
}

function mostrarListadoFiltrado(datosFiltrados) {
  const contenedor = document.getElementById('listado-filtrado');
  contenedor.innerHTML = ''; // Limpia el listado anterior
  if (datosFiltrados.length === 0) {
    contenedor.textContent = 'No se encontraron datos filtrados.';
    return;
  }
  const ul = document.createElement('ul');
  datosFiltrados.forEach(dato => {
    const li = document.createElement('li');
    li.textContent =
      (dato.tipo ? dato.tipo + ": " : "") +
      (dato.nombre ? dato.nombre : dato.descripcion);
    ul.appendChild(li);
  });
  contenedor.appendChild(ul);
}
