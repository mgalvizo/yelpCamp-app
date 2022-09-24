export const displayMap = campground => {
    console.log(campground);

    const [lng, lat] = campground.geometry.coordinates;
    const lnglat = [lng, lat];

    mapboxgl.accessToken =
        'pk.eyJ1IjoieGVwaGlvcyIsImEiOiJjbDhmYXIzaDAwN3Y1M3FsbDZ2Ymo4bjdxIn0.F9W0VlzFNAJRpmvrNcPsAg';

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/xephios/cl7cooyh9000614jswc99qbtk', // style URL
        center: [lng, lat], // starting position [lng, lat]
        zoom: 10, // starting zoom
        projection: 'globe', // display the map as a 3D globe
        scrollZoom: false,
    });

    const popup = new mapboxgl.Popup({
        offset: 25,
        className: 'mapbox-popup',
    })
        .setHTML(`<h5>${campground.title}</h5><p>${campground.location}</p>`)
        .setMaxWidth('300px');

    new mapboxgl.Marker().setLngLat([lng, lat]).setPopup(popup).addTo(map);

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });
};
