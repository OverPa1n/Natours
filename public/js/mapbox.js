export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib3ZlcnBhMW4iLCJhIjoiY2t4bzk3ZjNnMXZybjJycWtncGV4ejB5bSJ9.m2AXY-t2qEl0UxRH0KX3KA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/overpa1n/ckxo9s1ph31xb16ryraallkqd',
    center: [-118.243683,34.052235],
    zoom: 10,
    // interactive: false,
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(location => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(location.coordinates).addTo(map);
    new mapboxgl.Popup({offset: 30}).setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map)
    // extend map bounds to include current location
    bounds.extend(location.coordinates)

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    })
  });
}

