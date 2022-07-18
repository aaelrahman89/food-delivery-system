<template>
  <vg-mapbox
    v-if="geojson"
    :map-options="mapOptions"
    :min-height="minHeight"
    :max-height="maxHeight"
    :style="style"
    @load="mapLoaded"
  >
    <slot></slot>
  </vg-mapbox>
  <v-row v-else justify="center" :style="style" class="ma-0">
    <v-col
      class="shrink d-flex"
      tag="h4"
      style="color: darkgray"
      align-self="center"
    >
      {{ $t('misc.no_data') }}
    </v-col>
  </v-row>
</template>

<script>
import VgMapbox from './VgMapbox.vue';
import mapboxgl from 'mapbox-gl';
import polylabel from 'polylabel';

export default {
  name: 'ZonesMap',
  components: { VgMapbox },
  props: {
    geojson: {
      type: Object,
      default: undefined,
    },
    fitChangedBounds: {
      type: Boolean,
      default: true,
    },
    interactive: {
      type: Boolean,
      default: true,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: undefined,
    },
    minHeight: {
      type: String,
      default: '350px',
    },
    maxHeight: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      style: undefined,
      map: undefined,
      layers: [
        {
          id: 'zones-borders',
          source: 'zones',
          type: 'line',
          paint: {
            'line-width': 1,
            'line-color': [
              'case',
              ['==', ['get', 'selected'], true],
              '#ff74d5',
              ['==', ['get', 'assigned'], true],
              '#66bb6a',
              ['==', ['get', 'rateName'], 'rate1'],
              '#66bb6a',
              ['==', ['get', 'rateName'], 'rate2'],
              '#ffee58',
              ['==', ['get', 'rateName'], 'rate3'],
              '#ff9800',
              ['==', ['get', 'rateName'], 'rate4'],
              '#f44336',
              ['==', ['get', 'rateName'], 'outOfZone'],
              '#b0bec5',
              '#222222',
            ],
            'line-opacity': 0.7,
          },
          filter: ['==', '$type', 'Polygon'],
        },
        {
          id: 'zones-polygons',
          source: 'zones',
          type: 'fill',
          paint: {
            'fill-opacity': 0.4,
            'fill-color': [
              'case',
              ['==', ['get', 'selected'], true],
              '#ff74d5',
              ['==', ['get', 'assigned'], true],
              '#66bb6a',
              ['==', ['get', 'rateName'], 'rate1'],
              '#66bb6a',
              ['==', ['get', 'rateName'], 'rate2'],
              '#ffee58',
              ['==', ['get', 'rateName'], 'rate3'],
              '#ff9800',
              ['==', ['get', 'rateName'], 'rate4'],
              '#f44336',
              ['==', ['get', 'rateName'], 'outOfZone'],
              '#b0bec5',
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
                  ['has', 'rateName'],
                  ['concat', '\n', ['get', 'rateName']],
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
          id: 'hubs',
          source: 'zones',
          type: 'symbol',
          layout: {
            'icon-image': [
              'match',
              ['get', 'dataType'],
              'HUB',
              [
                'case',
                ['==', ['get', 'selected'], true],
                'hub-selected',
                'hub',
              ],
              'CUSTOMER_LOCATION',
              'customer-location',
              'circle-15',
            ],
            'icon-size': 1,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true,
          },
          filter: ['==', '$type', 'Point'],
        },
      ],
    };
  },
  computed: {
    mapOptions() {
      const options = {};
      if (this.geojson && this.geojson.features.length) {
        const bounds = new mapboxgl.LngLatBounds();
        const polygons = this.geojson.features.filter(
          (feature) => feature.geometry.type == 'Polygon'
        );
        const points = this.geojson.features.filter(
          (feature) => feature.geometry.type == 'Point'
        );

        if (polygons) {
          polygons.forEach((feature) => {
            return feature.geometry.coordinates[0].forEach((coordinate) =>
              bounds.extend(mapboxgl.LngLat.convert(coordinate))
            );
          });
        }

        if (points) {
          points.forEach((feature) => {
            bounds.extend(
              mapboxgl.LngLat.convert(feature.geometry.coordinates)
            );
          });
        }
        options.bounds = bounds;
        options.fitBoundsOptions = {
          padding: 70,
          maxZoom: 17,
        };
      }
      return options;
    },
  },
  watch: {
    geojson(value) {
      if (!value || !this.map) {
        return;
      }
      this.updateZonesPolygons();
      this.updateZonesLabels();
      if (this.fitChangedBounds) {
        this.fitPolygons();
      }
    },
  },
  mounted() {
    this.style = {
      height: this.height
        ? this.height
        : `calc(100vh - ${
            this.$el.getBoundingClientRect().top + window.scrollY
          }px - 24px)`,
    };
  },
  methods: {
    mapLoaded(map) {
      this.map = map;
      this.map.resize();
      this.addZonesPolygons();
      this.addZonesLabels();
      this.addLayers();
      if (this.interactive) {
        this.addHubsPopupHandlers();
        this.addZonesHandlers();
      }

      if (this.clickable) {
        this.map.on('click', (event) => {
          this.$emit('point-click', event.lngLat);
        });
      }
    },

    addZonesPolygons() {
      this.map.addSource('zones', {
        type: 'geojson',
        data: this.geojson,
      });
    },

    addZonesLabels() {
      this.map.addSource('labels', {
        type: 'geojson',
        data: this.extractLabelPositions(),
      });
    },

    addLayers() {
      this.layers.forEach((layer) => {
        this.map.addLayer(layer);
      });
    },

    extractLabelPositions() {
      return {
        type: 'FeatureCollection',
        features: this.geojson.features
          .filter((feature) => feature.geometry.type == 'Polygon')
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

    updateZonesPolygons() {
      this.map.getSource('zones').setData(this.geojson);
    },
    updateZonesLabels() {
      this.map.getSource('labels').setData(this.extractLabelPositions());
    },

    fitPolygons() {
      this.map.fitBounds(
        this.mapOptions.bounds,
        this.mapOptions.fitBoundsOptions
      );
    },
    addZonesHandlers() {
      this.map
        .on('mouseenter', 'zones-polygons', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        })
        .on('click', 'zones-polygons', (event) => {
          this.$emit('zone-click', event.features[0].properties.en);
        })
        .on('mouseleave', 'zones-polygons', () => {
          this.map.getCanvas().style.cursor = '';
        });
    },
    addHubsPopupHandlers() {
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
      this.map
        .on('mouseenter', 'hubs', showPopup)
        .on('click', 'hubs', (event) => {
          showPopup(event);
          this.$emit('hub-click', event.features[0].properties.hubId);
        })
        .on('mouseleave', 'hubs', () => {
          this.map.getCanvas().style.cursor = '';
          popup.remove();
        });
    },
  },
};
</script>

<style scoped></style>
