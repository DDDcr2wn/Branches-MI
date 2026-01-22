// Initialize map centered on the Philippines
var map = L.map('map').setView([12.8797, 121.7740], 6);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marker cluster group
var markersLayer = L.markerClusterGroup();
map.addLayer(markersLayer);

// Mang Inasal icon
var inasalIcon = L.icon({
    iconUrl: 'Images/Inasal.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

// Load Mang Inasal locations only
function loadMangInasal() {
    markersLayer.clearLayers();

    const query = `
        [out:json][timeout:25];
        area["name"="Philippines"]->.ph;
        node["brand"="Mang Inasal"](area.ph);
        out body;
    `;

    $.ajax({
        url: "https://overpass-api.de/api/interpreter",
        method: "POST",
        data: query,
        success: function (data) {
            if (!data.elements.length) {
                alert("No Mang Inasal locations found.");
                return;
            }

            var markers = [];

            data.elements.forEach(place => {
                if (place.lat && place.lon) {
                    var marker = L.marker(
                        [place.lat, place.lon],
                        { icon: inasalIcon }
                    ).bindPopup(place.tags.name || "Mang Inasal Branch");

                    markersLayer.addLayer(marker);
                    markers.push(marker);
                }
            });

            if (markers.length > 0) {
                var group = new L.featureGroup(markers);
                map.fitBounds(group.getBounds().pad(0.1));
            }
        },
        error: function () {
            alert("Overpass API error. Please try again later.");
        }
    });
}

// Button click
$(".load").click(function () {
    loadMangInasal();
});
