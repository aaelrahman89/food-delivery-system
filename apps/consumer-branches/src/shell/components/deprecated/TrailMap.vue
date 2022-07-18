<template>
  <vg-mapbox v-if="geojson" :map-options="mapOptions" @load="mapLoaded" />
  <div v-else class="pa-4">
    {{ $t(warnings.noTrail) }}
  </div>
</template>

<script>
import VgMapbox from './VgMapbox.vue';
import mapboxgl from 'mapbox-gl';
import polylabel from 'polylabel';
import warnings from '../../../core/deprecated/warnings';

export default {
  name: 'TrailMap',
  components: { VgMapbox },
  props: {
    geojson: {
      type: Object,
      default() {},
    },
    canRefresh: {
      type: null, // indicates any type is ok
      default: false,
    },
  },
  data() {
    return {
      warnings,
      map: undefined,
      refreshIntervalMs: 10000,
      intervalId: 0,
      layers: [
        {
          id: 'zones-borders',
          source: 'trail',
          type: 'line',
          paint: {
            'line-width': 1,
            'line-color': [
              'case',
              ['==', ['get', 'selected'], true],
              '#ff74d5',
              ['==', ['get', 'rate'], 'R1'],
              '#3ad01f',
              ['==', ['get', 'rate'], 'R2'],
              '#da3432',
              ['has', 'rate'],
              '#68eeff',
              '#222222',
            ],
            'line-opacity': 0.7,
          },
          filter: ['==', '$type', 'Polygon'],
        },
        {
          id: 'zones-polygons',
          source: 'trail',
          type: 'fill',
          paint: {
            'fill-opacity': 0.4,
            'fill-color': [
              'case',
              ['==', ['get', 'selected'], true],
              '#ff74d5',
              ['==', ['get', 'rate'], 'R1'],
              '#3ad01f',
              ['==', ['get', 'rate'], 'R2'],
              '#da3432',
              ['has', 'rate'],
              '#68eeff',
              '#222222',
            ],
          },
          filter: ['==', '$type', 'Polygon'],
        },
        {
          id: 'labels',
          source: 'labels',
          type: 'symbol',
          layout: {
            'text-field': [
              'downcase',
              [
                'concat',
                ['get', 'ar'],
                '\n',
                ['get', 'en'],
                [
                  'case',
                  ['has', 'rateText'],
                  ['concat', '\n', ['get', 'rateText']],
                  '',
                ],
              ],
            ],
            'text-allow-overlap': true,
            'text-size': [
              'interpolate',
              ['exponential', 2],
              ['zoom'],
              // zoom is 5 (or less) -> text size will be 1px
              1,
              6,
              // zoom is 10 (or greater) -> text size radius will be 5px
              14,
              16,
            ],
          },
          paint: {
            'text-color': '#0022ff',
          },
          filter: ['==', '$type', 'Point'],
        },
        {
          id: 'trail-line',
          source: 'trail',
          type: 'line',
          paint: {
            'line-color': '#10bdff',
            'line-opacity': ['case', ['==', ['get', 'inactive'], true], 0.5, 1],
            'line-width': 4,
          },
          filter: ['==', '$type', 'LineString'],
        },
        {
          id: 'trail-markers',
          source: 'trail',
          type: 'symbol',
          layout: {
            'icon-image': [
              'match',
              ['get', 'dataType'],
              'DELIVERY_POINT',
              ['concat', 'numbered-', ['get', 'sequence']],
              'BRANCH_LOCATION',
              'branch-location',
              'BRANCH_HUB',
              'branch-hub',
              'PILOT_HUB',
              'pilot-hub',
              'ASSIGNMENT_LOCATION',
              'assignment-location',
              'circle-15',
            ],
            'icon-size': 1,
            'icon-anchor': 'bottom',
            'text-allow-overlap': true,
            'icon-allow-overlap': true,
            'text-field': ['get', 'label'],
            'text-anchor': 'top',
          },
          paint: {
            'icon-opacity': ['case', ['==', ['get', 'inactive'], true], 0.5, 1],
            'text-color': '#338824',
            'text-halo-color': '#fff',
            'text-halo-width': 0.5,
          },
          filter: ['==', '$type', 'Point'],
        },
      ],
    };
  },
  computed: {
    mapOptions() {
      const options = {};
      if (this.geojson) {
        const bounds = new mapboxgl.LngLatBounds();
        this.geojson.features
          .filter((feature) => feature.geometry.type === 'LineString')
          .forEach((feature) =>
            feature.geometry.coordinates.forEach((coordinate) =>
              bounds.extend(mapboxgl.LngLat.convert(coordinate))
            )
          );
        this.geojson.features
          .filter((feature) => feature.geometry.type === 'Point')
          .map((feature) => feature.geometry.coordinates)
          .forEach((coordinate) =>
            bounds.extend(mapboxgl.LngLat.convert(coordinate))
          );
        options.bounds = bounds;
        options.fitBoundsOptions = {
          padding: 40,
        };
      }
      return options;
    },
  },
  watch: {
    geojson(value) {
      if (value && this.map) {
        this.map.getSource('trail').setData(value);
      }
    },
  },
  created() {
    this.intervalId = setInterval(
      () => this.canRefresh && this.$emit('refresh'),
      this.refreshIntervalMs
    );
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    async mapLoaded(map) {
      this.map = map;
      this.addZonesLabels();
      this.renderTrail();
      this.addPopupHandler();
    },

    renderTrail() {
      this.map.addSource('trail', {
        type: 'geojson',
        data: this.geojson,
      });

      this.layers.forEach((layer) => this.map.addLayer(layer));
    },

    addZonesLabels() {
      this.map.addSource('labels', {
        type: 'geojson',
        data: this.extractLabelPositions(),
      });
    },
    extractLabelPositions() {
      return {
        type: 'FeatureCollection',
        features: this.geojson.features
          .filter((feature) => feature.geometry.type === 'Polygon')
          .map((feature) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: polylabel(feature.geometry.coordinates),
            },
            properties: feature.properties,
          })),
      };
    },
    addPopupHandler() {
      let popup;
      const markerWidth = 23;
      const markerHeight = 30;
      const markerHalfWidth = markerWidth / 2;
      const linearOffset = Math.round(Math.sqrt(0.5 * markerHalfWidth ** 2));
      const showPopup = (event) => {
        popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: true,
          offset: {
            // offset calculation is based on code from
            // https://bl.ocks.org/andrewharvey/db2e3421b8f0c58be06cdfff156527ae
            'top': [0, 0],
            'top-left': [0, 0], // [linearOffset, (markerHeight - markerHalfWidth - linearOffset) * -1],
            'top-right': [0, 0], // [-linearOffset, (markerHeight - markerHalfWidth - linearOffset) * -1],
            'bottom': [0, -markerHeight],
            'bottom-left': [
              linearOffset,
              (markerHeight - markerHalfWidth + linearOffset) * -1,
            ],
            'bottom-right': [
              -linearOffset,
              (markerHeight - markerHalfWidth + linearOffset) * -1,
            ],
            'left': [markerHalfWidth, -(markerHeight - markerHalfWidth)],
            'right': [-markerHalfWidth, -(markerHeight - markerHalfWidth)],
          },
        });

        // code is copied and modified from
        // https://docs.mapbox.com/mapbox-gl-js/example/popup-on-hover/
        const coordinates = event.features[0].geometry.coordinates.slice();
        const { template } = event.features[0].properties;

        // Populate the popup and set its coordinates
        // based on the feature found.
        if (template) {
          this.map.getCanvas().style.cursor = 'pointer';
          popup.setLngLat(coordinates).setHTML(template).addTo(this.map);
        }
      };
      this.map.on('mouseenter', 'trail-markers', showPopup);
      this.map.on('click', 'trail-markers', showPopup);

      this.map.on('mouseleave', 'trail-markers', () => {
        this.map.getCanvas().style.cursor = '';
        popup.remove();
      });
    },
  },
};
</script>

<style scoped></style>
