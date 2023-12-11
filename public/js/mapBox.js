/* Eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibXVydWdhMjAwNSIsImEiOiJjbHBpNWM5dTYwNjNxMmtwamc3M2pocXFpIn0.PHYPaX6BrTxK4nL4_PqFpw";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    scrollZoom: false,
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement("div");
    el.className = "marker";

    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 100,
      left: 50,
      right: 50,
    },
  });
};
