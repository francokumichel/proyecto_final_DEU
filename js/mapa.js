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
        coordinates: [
          [
            [-57.98, -34.94],
            [-57.96, -34.94],
            [-57.96, -34.92],
            [-57.98, -34.92],
            [-57.98, -34.94],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { risk: "alto" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-57.96, -34.93],
            [-57.94, -34.93],
            [-57.94, -34.91],
            [-57.96, -34.91],
            [-57.96, -34.93],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { risk: "medio" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-57.94, -34.92],
            [-57.92, -34.92],
            [-57.92, -34.90],
            [-57.94, -34.90],
            [-57.94, -34.92],
          ],
        ],
      },
    },
  ],
};

function getColor(risk) {
  return risk === "alto" ? "#dc3545" :
    risk === "medio" ? "#ffc107" :
      "#28a745";
}

var geojsonLayers = {
  alto: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        fillColor: getColor(feature.properties.risk),
        color: getColor(feature.properties.risk),
        fillOpacity: 0.5,
        weight: 1
      };
    },
    filter: (feature) => feature.properties.risk === "alto"
  }),
  medio: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        fillColor: getColor(feature.properties.risk),
        color: getColor(feature.properties.risk),
        fillOpacity: 0.5,
        weight: 1
      };
    },
    filter: (feature) => feature.properties.risk === "medio"
  }),
  bajo: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        fillColor: getColor(feature.properties.risk),
        color: getColor(feature.properties.risk),
        fillOpacity: 0.5,
        weight: 1
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
  { type: "refugios", coords: [-34.932, -57.982], icon: "house", popup: "Refugio 1 - Escuela Primaria N°10" },
  { type: "refugios", coords: [-34.928, -57.978], icon: "house", popup: "Refugio 2 - Sociedad de Fomento" },
  { type: "centros-asistencia", coords: [-34.920, -57.951], icon: "plus-square", popup: "Centro de Asistencia 1 - Hospital San Juan" },
  { type: "centros-asistencia", coords: [-34.918, -57.946], icon: "plus-square", popup: "Centro de Asistencia 2 - Salita 22" },
  { type: "puntos-encuentro", coords: [-34.905, -57.932], icon: "geo-alt", popup: "Punto de Encuentro 1 - Plaza Belgrano" },
  { type: "puntos-encuentro", coords: [-34.907, -57.936], icon: "geo-alt", popup: "Punto de Encuentro 2 - Club El Fortín" }
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
