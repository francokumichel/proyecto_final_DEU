// Configuración inicial del mapa
var map = L.map("map", {
  zoomControl: false
}).setView([-34.92, -57.95], 13);

// Agregamos el control de zoom manualmente en la posición deseada
L.control.zoom({
  position: 'topright'
}).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, className: 'map-tiles' }).addTo(map);


// 1. Zonas de riesgo
var geojsonData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { risk: "bajo" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-57.981000, -34.936800], // oeste-noroeste (cerca de Tolosa)
          [-57.962500, -34.936800], // noreste
          [-57.962500, -34.917000], // sureste
          [-57.981000, -34.917000], // suroeste
          [-57.981000, -34.936800]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { risk: "alto" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-57.958000, -34.931800], // zona centro
          [-57.940000, -34.931800],
          [-57.940000, -34.911800],
          [-57.958000, -34.911800],
          [-57.958000, -34.931800]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { risk: "medio" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-57.938500, -34.925000], // zona este, cerca de Av. 13 y Plaza Matheu
          [-57.917000, -34.925000],
          [-57.917000, -34.904500],
          [-57.938500, -34.904500],
          [-57.938500, -34.925000]
        ]]
      }
    },
  ]
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
  L.popup()
    .setLatLng(e.latlng)
    .setContent('Zona de riesgo alto')
    .openOn(map);
});
geojsonLayers.medio.on('click', function(e) {
  L.popup()
    .setLatLng(e.latlng)
    .setContent('Zona de riesgo medio')
    .openOn(map);
});
geojsonLayers.bajo.on('click', function(e) {
  L.popup()
    .setLatLng(e.latlng)
    .setContent('Zona de riesgo bajo')
    .openOn(map);
});



// 2. Marcadores 
var markerLayers = {
  refugios: L.layerGroup(),
  "puntos-encuentro": L.layerGroup(),
  "centros-asistencia": L.layerGroup()
};

[
  { type: "refugios", coords: [-34.934185, -57.969457], icon: "house", popup: "Parque Juan Vucetich" },
  { type: "refugios", coords: [-34.9251, -57.9582], icon: "house", popup: "Refugio - Club Vecinal" },
  { type: "centros-asistencia", coords: [-34.923960, -57.936876], icon: "plus-square", popup: "Centro de Salud - Reencuentro" },
  { type: "centros-asistencia", coords: [-34.924029, -57.975154], icon: "plus-square", popup: "Centro de Salud - Salita" },
  { type: "puntos-encuentro", coords: [-34.920216, -57.929031], icon: "geo-alt", popup: "Punto de Encuentro - Plaza Matheu" },
  { type: "puntos-encuentro", coords: [-34.915430, -57.947785], icon: "geo-alt", popup: "Punto de Encuentro - Parque San Martín" }
].forEach(m => {
  L.marker(m.coords, {
    icon: L.divIcon({ className: "bi", html: `<i class="bi bi-${m.icon}"></i>` })
  }).bindPopup(m.popup).addTo(markerLayers[m.type]);
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
}

// Lógica para el botón de ayudas visuales:
document.getElementById("toggle-ayudas").addEventListener("click", function() {
  ayudasVisuales = !ayudasVisuales;
  this.setAttribute('aria-pressed', ayudasVisuales);
  this.textContent = ayudasVisuales ? "Ocultar ayudas visuales" : "Mostrar ayudas visuales";
  applyFilters();
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
