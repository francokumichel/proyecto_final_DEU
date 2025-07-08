// Configuración inicial del mapa
var map = L.map("map", {
  zoomControl: false
}).setView([-34.92, -57.95], 13);

// Agregamos el control de zoom manualmente en la posición deseada
L.control.zoom({
  position: 'topright'
}).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);


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

var patternAlto = new L.StripePattern({ weight: 4, spaceColor: '#fff', color: '#dc3545', spaceOpacity: 0.6, angle: 45 });
patternAlto.addTo(map);

var patternMedio = new L.StripePattern({ weight: 4, spaceColor: '#fff', color: '#ffc107', spaceOpacity: 0.6, angle: -45 });
patternMedio.addTo(map);

var shape = new L.PatternCircle({
  x: 12,
  y: 12,
  radius: 5,
  fill: false
});
var patternBajo = new L.Pattern({ radius: 3, color: '#28a745', fillColor: '#28a745', spaceColor: '#fff', width: 15, height: 15 });
patternBajo.addShape(shape);
patternBajo.addTo(map);

var geojsonLayers = {
  alto: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        fillPattern: patternAlto,
        color: getColor(feature.properties.risk),
        fillOpacity: 0.5,
        weight: 3,
        dashArray: '10,6', // Borde rayado para alto riesgo
      };
    },
    filter: (feature) => feature.properties.risk === "alto"
  }),
  medio: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        fillPattern: patternMedio,
        color: getColor(feature.properties.risk),
        fillOpacity: 0.5,
        weight: 3,
        dashArray: '4,4', // Borde punteado para riesgo medio
      };
    },
    filter: (feature) => feature.properties.risk === "medio"
  }),
  bajo: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        fillPattern: patternBajo,
        color: getColor(feature.properties.risk),
        fillOpacity: 0.5,
        weight: 3,
        dashArray: '', // Borde sólido para riesgo bajo
      };
    },
    filter: (feature) => feature.properties.risk === "bajo"
  })
};

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
