<template>
  <vg-mapbox v-if="pm.initialized" @load="mapLoaded"> </vg-mapbox>
</template>

<script lang="ts">
import VgMapbox from '../../components/deprecated/VgMapbox.vue';
import Vue from 'vue';
import { BranchServedZonesPM } from '../../../core/presentation-models/zones/BranchServedZonesPM';
import { GeojsonFeatureCollection } from '@survv/commons/core/models/GeoJSON';
import { Layer, LngLat, LngLatBounds, Map } from 'mapbox-gl';
import { Zone } from '../../../core/models/Zone';
import { ZonesRepoImpl } from '../../repositories/zones/ZonesRepoImpl';
import { notificationService } from '@survv/commons/shell/services/notificationService';

const mapboxSourcesID = {
  branchServedZones: 'branch-served-zones',
};

export default Vue.extend({
  name: 'BranchServedZones',
  components: { VgMapbox },
  data() {
    return {
      pm: new BranchServedZonesPM({
        zonesRepo: new ZonesRepoImpl(),
        notificationService,
      }),
      map: undefined as Map | undefined,
      branchServedZonesLayers: [
        {
          id: 'zone-border',
          source: mapboxSourcesID.branchServedZones,
          type: 'line',
          paint: {
            'line-width': 1,
            'line-color': [
              'case',
              ['==', ['get', 'rateName'], 'rate1'],
              '#66bb6a',
              ['==', ['get', 'rateName'], 'rate2'],
              '#ffee58',
              ['==', ['get', 'rateName'], 'rate3'],
              '#ff9800',
              ['==', ['get', 'rateName'], 'rate4'],
              '#f44336',
              '#b0bec5',
            ],
            'line-opacity': 0.7,
          },
          filter: ['==', ['get', 'type'], 'zone-polygon'],
        },
        {
          id: 'zone-polygon',
          source: mapboxSourcesID.branchServedZones,
          type: 'fill',
          paint: {
            'fill-opacity': 0.4,
            'fill-color': [
              'case',
              ['==', ['get', 'rateName'], 'rate1'],
              '#66bb6a',
              ['==', ['get', 'rateName'], 'rate2'],
              '#ffee58',
              ['==', ['get', 'rateName'], 'rate3'],
              '#ff9800',
              ['==', ['get', 'rateName'], 'rate4'],
              '#f44336',
              '#b0bec5',
            ],
          },
          filter: ['==', ['get', 'type'], 'zone-polygon'],
        },
        {
          id: 'branch-location',
          source: mapboxSourcesID.branchServedZones,
          type: 'symbol',
          layout: {
            'icon-image': [
              'match',
              ['get', 'type'],
              'branch-location',
              'branch-location',
              'circle-15',
            ],
            'icon-size': 1,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true,
          },
          filter: ['==', ['get', 'type'], 'branch-location'],
        },
      ] as Layer[],
    };
  },
  async created() {
    await this.pm.init();
  },
  methods: {
    mapLoaded(map: Map): void {
      this.map = map;

      this.addMapSources();
      this.addMapLayers();
      this.fitMapBounds();
    },
    addMapSources(): void {
      const geoJson: GeojsonFeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: this.pm.servedZones.branchLocation,
            properties: {
              type: 'branch-location',
            },
          },
          {
            type: 'Feature',
            geometry: this.pm.servedZones.hubLocation,
            properties: {
              type: 'hub-location',
            },
          },
        ],
      };

      this.pm.servedZones.zones.forEach((zone) => {
        geoJson.features.push({
          type: 'Feature',
          geometry: zone.polygon,
          properties: {
            type: 'zone-polygon',
            zoneName: zone.name,
            rateName: zone.rateName,
            rateValue: zone.rateValue,
          },
        });
      });

      this.map!.addSource(mapboxSourcesID.branchServedZones, {
        type: 'geojson',
        data: geoJson,
      });
    },
    addMapLayers(): void {
      this.branchServedZonesLayers.forEach((layer: Layer) => {
        this.map!.addLayer(layer);
      });
    },
    fitMapBounds(): void {
      const mapBounds = new LngLatBounds();
      const zonesCoordinates = this.pm.servedZones.zones
        .map((zone: Zone) => zone.polygon.coordinates.flat())
        .flat();
      const branchLocation = this.pm.servedZones.hubLocation.coordinates;

      [...zonesCoordinates, branchLocation].forEach((coordinate) => {
        mapBounds.extend(new LngLat(coordinate[0], coordinate[1]));
      });

      this.map!.fitBounds(mapBounds, {
        padding: 70,
        maxZoom: 17,
      });
    },
  },
});
</script>

<style scoped></style>
