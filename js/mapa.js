// Initialize the map
var map = L.map("map").setView([-34.92, -57.95], 12); // Approximate coordinates for Villa Elvira, Argentina

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Sample GeoJSON data for flood zones
var geojsonData = {
  type: "FeatureCollection",
  features: [
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
            [-57.95, -34.92],
            [-57.93, -34.92],
            [-57.93, -34.9],
            [-57.95, -34.9],
            [-57.95, -34.92],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { risk: "bajo" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-57.97, -34.94],
            [-57.95, -34.94],
            [-57.95, -34.92],
            [-57.97, -34.92],
            [-57.97, -34.94],
          ],
        ],
      },
    },
  ],
};

// Style function for flood zones
function getColor(risk) {
  return risk === "alto"
    ? "#dc3545"
    : risk === "medio"
      ? "#ffc107"
      : "#28a745";
}

// Create separate layers for each risk level
var geojsonLayers = {
  alto: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        color: getColor(feature.properties.risk),
        fillColor: getColor(feature.properties.risk),
        fillOpacity: document.getElementById("alto-riesgo").checked
          ? 0.5
          : 0,
        weight: 1,
      };
    },
    filter: function(feature) {
      return feature.properties.risk === "alto";
    },
  }).addTo(map),
  medio: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        color: getColor(feature.properties.risk),
        fillColor: getColor(feature.properties.risk),
        fillOpacity: document.getElementById("riesgo-medio").checked
          ? 0.5
          : 0,
        weight: 1,
      };
    },
    filter: function(feature) {
      return feature.properties.risk === "medio";
    },
  }).addTo(map),
  bajo: L.geoJSON(geojsonData, {
    style: function(feature) {
      return {
        color: getColor(feature.properties.risk),
        fillColor: getColor(feature.properties.risk),
        fillOpacity: document.getElementById("riesgo-bajo").checked
          ? 0.5
          : 0,
        weight: 1,
      };
    },
    filter: function(feature) {
      return feature.properties.risk === "bajo";
    },
  }).addTo(map),
};

// Sample markers
var markers = [
  {
    type: "refugios",
    coords: [-34.92, -57.95],
    icon: L.divIcon({
      className: "bi bi-house",
      html: '<i class="bi bi-house"></i>',
    }),
  },
  {
    type: "puntos-encuentro",
    coords: [-34.91, -57.94],
    icon: L.divIcon({
      className: "bi bi-geo-alt",
      html: '<i class="bi bi-geo-alt"></i>',
    }),
  },
  {
    type: "centros-asistencia",
    coords: [-34.93, -57.96],
    icon: L.divIcon({
      className: "bi bi-plus-square",
      html: '<i class="bi bi-plus-square"></i>',
    }),
  },
].map((marker) => {
  return L.marker(marker.coords, { icon: marker.icon });
});

// Assign types to markers and add to map
markers.forEach((marker) => {
  marker.type = marker.options.icon.options.className.split(" ")[1]; // Extract type from className
  marker.addTo(map);
});

// Group markers by type for filtering
var markerLayers = {
  refugios: L.layerGroup(markers.filter((m) => m.type === "refugios")),
  "puntos-encuentro": L.layerGroup(
    markers.filter((m) => m.type === "puntos-encuentro"),
  ),
  "centros-asistencia": L.layerGroup(
    markers.filter((m) => m.type === "centros-asistencia"),
  ),
};

// Add marker layers to map
Object.values(markerLayers).forEach((layer) => layer.addTo(map));

// Filter function
function applyFilters() {
  var filters = {
    "alto-riesgo": document.getElementById("alto-riesgo").checked,
    "riesgo-medio": document.getElementById("riesgo-medio").checked,
    "riesgo-bajo": document.getElementById("riesgo-bajo").checked,
    refugios: document.getElementById("refugios").checked,
    "puntos-encuentro":
      document.getElementById("puntos-encuentro").checked,
    "centros-asistencia":
      document.getElementById("centros-asistencia").checked,
  };

  geojsonLayers["alto"].eachLayer(function(layer) {
    layer.setStyle({
      fillOpacity: filters["alto-riesgo"] ? 0.5 : 0,
      weight: filters["alto-riesgo"] ? 1 : 0,
    });
  });
  geojsonLayers["medio"].eachLayer(function(layer) {
    layer.setStyle({
      fillOpacity: filters["riesgo-medio"] ? 0.5 : 0,
      weight: filters["riesgo-medio"] ? 1 : 0,
    });
  });
  geojsonLayers["bajo"].eachLayer(function(layer) {
    layer.setStyle({
      fillOpacity: filters["riesgo-bajo"] ? 0.5 : 0,
      weight: filters["riesgo-bajo"] ? 1 : 0,
    });
  });

  Object.keys(markerLayers).forEach((type) => {
    markerLayers[type].eachLayer((layer) => {
      layer.getElement().style.display = filters[type] ? "block" : "none";
    });
  });
}

// Reset function
function resetFilters() {
  document
    .querySelectorAll(".form-check-input")
    .forEach((cb) => (cb.checked = true));
  applyFilters();
}

// Initial application of filters
applyFilters();

// Add event listeners for real-time filtering
document.querySelectorAll(".form-check-input").forEach((cb) => {
  cb.addEventListener("change", applyFilters);
});
