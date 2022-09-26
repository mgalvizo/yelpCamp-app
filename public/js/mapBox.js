const MAPBOX_TOKEN =
    'pk.eyJ1IjoieGVwaGlvcyIsImEiOiJjbDhmYXIzaDAwN3Y1M3FsbDZ2Ymo4bjdxIn0.F9W0VlzFNAJRpmvrNcPsAg';

export const displayCampgroundMap = campground => {
    const [lng, lat] = campground.geometry.coordinates;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
        container: 'campgroundMap', // container ID
        style: 'mapbox://styles/xephios/cl7cooyh9000614jswc99qbtk', // style URL
        center: [lng, lat], // starting position [lng, lat]
        zoom: 10, // starting zoom
        projection: 'globe', // display the map as a 3D globe
        scrollZoom: false,
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

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

export const displayClusterMap = campgrounds => {
    // TO MAKE THE MAP APPEAR YOU MUST
    // ADD YOUR ACCESS TOKEN FROM
    // https://account.mapbox.com
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const features = { features: campgrounds };
    const source = 'campgrounds';

    const map = new mapboxgl.Map({
        container: 'clusterMap',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/xephios/cl7cooyh9000614jswc99qbtk',
        center: [-95.665, 37.6],
        zoom: 4,
        projection: 'globe', // display the map as a 3D globe
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', () => {
        // Add a new source from our GeoJSON data and
        // set the 'cluster' option to true. GL-JS will
        // add the point_count property to your source data.
        map.addSource(source, {
            type: 'geojson',
            // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
            // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
            data: features,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: source,
            filter: ['has', 'point_count'],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#00bcd4',
                    10,
                    '#2196f3',
                    30,
                    '#3f51b5',
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    15,
                    10,
                    20,
                    30,
                    25,
                ],
            },
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: source,
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: source,
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff',
            },
        });

        // inspect a cluster on click
        map.on('click', 'clusters', e => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters'],
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource(source).getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom,
                    });
                }
            );
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', e => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const { popupMarkup } = e.features[0].properties;

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup({
                offset: 25,
                className: 'mapbox-popup',
            })
                .setLngLat(coordinates)
                .setHTML(popupMarkup)
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
            map.getCanvas().style.cursor = '';
        });
    });
};
