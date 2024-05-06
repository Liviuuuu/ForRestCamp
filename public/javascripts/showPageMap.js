mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);
