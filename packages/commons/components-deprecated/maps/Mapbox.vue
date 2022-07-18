<template>
  <div
    v-if="isSupportedPlatform"
    :style="mapSize"
    class="map-container"
    dir="ltr"
  >
    <div ref="map" class="map"></div>
    <slot></slot>
  </div>
  <div v-else column>
    <div>Mapbox GL unsupported</div>
    <div xs12>
      Mapbox GL requires <a href="http://caniuse.com/webgl">WebGL support</a>.
      Please check that you are using a supported browser and that WebGL is
      <a href="http://get.webgl.org/">enabled</a>.
    </div>
  </div>
</template>

<script>
import '@mapbox/mapbox-gl-traffic/mapbox-gl-traffic.css';
import 'mapbox-gl-style-switcher/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash.debounce';
import mapboxgl from 'mapbox-gl';
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher';

export default {
  name: 'Mapbox',

  props: {
    minWidth: {
      type: String,
      default: '300px',
    },
    minHeight: {
      type: String,
      default: '350px',
    },
    geolocate: {
      type: [Boolean, String],
      default: false,
    },
    mapOptions: {
      type: Object,
      default() {},
    },
    navigationControl: {
      type: [Boolean, String],
      default: true,
    },
    fullscreenControl: {
      type: [Boolean, String],
      default: true,
    },
    styleSwitcherControl: {
      type: [Boolean, String],
      default: false,
    },
    geolocateControl: {
      type: [Boolean, String],
      default: false,
    },
    trafficControl: {
      type: [Boolean, String],
      default: false,
    },
    scaleControl: {
      type: [Boolean, String],
      default: true,
    },
    defaultLanguage: {
      type: String,
      default: 'ar',
    },
  },
  data() {
    return {
      map: undefined,
      geolocateController: undefined,
      resizeObserver: undefined,
      mapMarkers: {
        BRANCH_LOCATION: '/assets/images/map-markers/branch-location-30.png',
        DELIVERY_POINT: '/assets/images/map-markers/delivery-point-30.png',
        ASSIGNMENT_LOCATION:
          '/assets/images/map-markers/assignment-location-30.png',
        BRANCH_HUB: '/assets/images/map-markers/branch-hub-30.png',
        PILOT_HUB: '/assets/images/map-markers/pilot-hub-30.png',
        HUB: '/assets/images/map-markers/hub-30.png',
        HUB_SELECTED: '/assets/images/map-markers/hub-selected-30.png',
        NUMBERED_1: '/assets/images/map-markers/numbered-1-30.png',
        NUMBERED_2: '/assets/images/map-markers/numbered-2-30.png',
        NUMBERED_3: '/assets/images/map-markers/numbered-3-30.png',
        NUMBERED_4: '/assets/images/map-markers/numbered-4-30.png',
        NUMBERED_5: '/assets/images/map-markers/numbered-5-30.png',
        NUMBERED_6: '/assets/images/map-markers/numbered-6-30.png',
        NUMBERED_7: '/assets/images/map-markers/numbered-7-30.png',
        NUMBERED_8: '/assets/images/map-markers/numbered-8-30.png',
        NUMBERED_9: '/assets/images/map-markers/numbered-9-30.png',
      },
    };
  },

  computed: {
    mapSize() {
      return {
        'min-width': this.minWidth,
        'min-height': this.minHeight,
      };
    },
    isSupportedPlatform() {
      return mapboxgl.supported();
    },
    mapConfig() {
      return {
        container: this.$refs.map,
        style: 'mapbox://styles/mapbox/streets-v10',
        zoom: 12,
        center: [31.29191, 30.069305],
        ...this.mapOptions,
      };
    },
  },

  mounted() {
    if (this.isSupportedPlatform) {
      this.initMap();
      this.addControls();
      this.setMapEventHandlers();
      this.setResizeObserver();
    }
  },

  destroyed() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },

  methods: {
    initMap() {
      this.map = new mapboxgl.Map(this.mapConfig);
    },

    addControls() {
      this.geolocateController = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          trackUserLocation: true,
          showUSerLocation: true,
        },
      });

      if (this.navigationControl) {
        this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      }

      if (this.fullscreenControl) {
        this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
      }

      if (this.geolocateControl) {
        this.map.addControl(this.geolocateController, 'bottom-right');
      }

      if (this.styleSwitcherControl) {
        this.map.addControl(
          new MapboxStyleSwitcherControl([
            {
              title: 'Streets',
              uri: 'mapbox://styles/mapbox/streets-v10',
            },
            {
              title: 'Satellite Streets',
              uri: 'mapbox://styles/mapbox/satellite-streets-v9',
            },
          ])
        );
      }

      if (this.scaleControl) {
        this.map.addControl(new mapboxgl.ScaleControl());
      }

      if (this.trafficControl) {
        this.map.addControl(
          new MapboxTraffic({
            showTraffic: false,
          })
        );
      }

      this.map.addControl(
        new MapboxLanguage({
          defaultLanguage: this.defaultLanguage,
        })
      );
    },

    setMapEventHandlers() {
      this.map.on('load', () => this.mapLoaded());
    },

    setResizeObserver() {
      this.resizeObserver = new ResizeObserver(
        debounce(() => {
          if (this.map) {
            this.map.resize();
          }
        }, 50)
      );
      this.resizeObserver.observe(this.$refs.map);
    },

    detectUserLocation() {
      if (this.geolocate) {
        this.geolocateController.trigger();
      }
    },

    async addCustomSymbols() {
      const addImage = ({ name, url }) =>
        new Promise((resolve, reject) => {
          this.map.loadImage(url, (err, loadedImage) => {
            if (err) reject(err);
            this.map.addImage(name, loadedImage);
            resolve();
          });
        });

      const promises = [];

      Object.entries(this.mapMarkers)
        .map(([key, value]) => ({
          name: key.toLowerCase().replace(/_/g, '-'),
          url: value,
        }))
        .forEach((obj) => promises.push(addImage(obj)));

      await Promise.all(promises);
    },

    async mapLoaded() {
      await this.addCustomSymbols();
      this.$emit('load', this.map);
      this.detectUserLocation();
    },
  },
};
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
  position: relative;
}
.map {
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
