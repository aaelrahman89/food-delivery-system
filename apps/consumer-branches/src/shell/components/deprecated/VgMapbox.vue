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
import { images } from '../../../core/deprecated/constants';

export default {
  name: 'VgMapbox',

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
        this.map.addControl(this.geolocateController);
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

      Object.entries(images.mapMarkers)
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
