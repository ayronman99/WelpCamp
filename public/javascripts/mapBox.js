mapboxgl.accessToken = mapToken;


const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campMapData, // starting position [lng, lat]
zoom: 7 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(campMapData)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4>${campTitle}</h4> <p>${campLoc}</p>`
        )
    )
    .addTo(map)