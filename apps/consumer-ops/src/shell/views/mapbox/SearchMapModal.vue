<template>
  <div>
    <v-dialog
      :value="open"
      :fullscreen="fullscreen"
      :hide-overlay="hideOverlay"
      :persistent="persistent"
      :max-width="maxWidth"
      :lazy="lazy"
      scrollable
      transition="dialog-bottom-transition"
      @input="backdrop"
    >
      <v-card>
        <v-card-text>
          <v-row class="fill-height">
            <v-progress-linear
              v-show="pm.loading"
              indeterminate
              color="vg-red"
              height="3"
              class="my-0"
              style="position: absolute; top: 0; left: 0; right: 0"
            />
            <vg-flex class="px-2 py-6" gap-size="mid">
              <v-col cols="12">
                <h3 class="geomap-header">
                  {{ $t('GEOMAP_HEADER') }}
                </h3>
                <div class="geomap-body">
                  <zones-map
                    :geojson="geojson"
                    :max-height="mapMaxHeight"
                    interactive
                    :clickable="true"
                    @point-click="clickPoint"
                  >
                    <div class="geomap-autocomplete">
                      <v-autocomplete
                        :value="data"
                        :items="pm.items"
                        hide-no-data
                        flat
                        hide-details
                        item-text="text"
                        item-value="geometry"
                        solo
                        max-width="100%"
                        :label="$t('GEOMAP_SEARCH_FIELD')"
                        type="text"
                        @input="select"
                        @update:search-input="search"
                      ></v-autocomplete>
                    </div>
                  </zones-map>
                </div>
              </v-col>
              <vg-flex gap-size="small" justify-content="space-between">
                <div>
                  <span>{{ pm.selectedLocationName }}</span>
                </div>
                <div>
                  <div class="buttons-container">
                    <div class="vg-margin-inline-end--mid">
                      <vg-button expand outlined @click="discard">
                        {{ $t('GEOMAP_DISCARD') }}
                      </vg-button>
                    </div>
                    <div>
                      <vg-button
                        expand
                        :disabled="!canContinue"
                        @click="submit"
                      >
                        {{ $t('GEOMAP_CONFIRM') }}
                      </vg-button>
                    </div>
                  </div>
                </div>
              </vg-flex>
            </vg-flex>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ZonesMap from '../../components/ZonesMap.vue';
import { MapboxRepoImpl } from '../../repositories/map-box/MapboxRepoImpl';
import { SearchableMapboxModalPM } from '../../../core/presentation-models/map-box/SearchableMapboxModalPM';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { notificationService } from '@survv/commons/shell/services/notificationService';

const events = {
  submitted: 'submitted',
  discard: 'discard',
  backdrop: 'backdrop',
};
export default {
  name: 'SearchMapModal',
  components: { ZonesMap, VgButton, VgFlex },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    startingPointCoordinates: {
      type: Array,
      required: true,
    },
    supportedZonesCoordinates: {
      type: Array,
      default: () => [],
    },
    maxWidth: {
      type: String,
      default: '80%',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    hideOverlay: {
      type: Boolean,
      default: false,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    noContainer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const pm = new SearchableMapboxModalPM({
      notificationService,
      mapboxRepo: new MapboxRepoImpl(),
      startingPointCoordinates: this.startingPointCoordinates,
      supportedZonesCoordinates: this.supportedZonesCoordinates,
    });
    return {
      pm,
      selectedPoint: pm.selectedPoint,
      supportedZones: pm.supportedZones,
      data: '',
      mapMaxHeight: '500px',
    };
  },
  computed: {
    geojson() {
      return {
        type: 'FeatureCollection',
        features: [this.selectedPoint, ...this.supportedZones],
      };
    },
    canContinue() {
      return this.pm.canContinue(
        this.selectedPoint.geometry.coordinates,
        this.startingPointCoordinates
      );
    },
  },
  watch: {
    startingPointCoordinates() {
      this.pm.setDefaultPoints(this.startingPointCoordinates);
      this.selectedPoint = this.pm.selectedPoint;
    },
    async selectedPoint() {
      const [lng, lat] = this.selectedPoint.geometry.coordinates;
      this.pm.reverseGeocoding(lng, lat);
      this.data = this.pm.selectedLocationName;
    },
  },
  methods: {
    reset() {
      this.pm.setDefaultPoints(this.startingPointCoordinates);
      this.selectedPoint = this.pm.selectedPoint;
    },
    backdrop() {
      this.$emit(events.backdrop);
      this.reset();
    },
    discard() {
      this.$emit(events.discard);
      this.reset();
    },
    submit() {
      this.$emit(events.submitted, {
        pickupPointCoordinates: this.selectedPoint.geometry.coordinates,
        locationName: this.pm.selectedLocationName,
      });
    },
    search(searchToken) {
      this.pm.search(searchToken);
    },
    clickPoint(event) {
      this.selectedPoint = this.pm.clickPoint(event);
    },
    select(selectionGeometry) {
      this.selectedPoint = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: selectionGeometry.coordinates,
        },
        properties: {
          dataType: 'CUSTOMER_LOCATION',
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.geomap-header {
  color: var(--color-primary);
  margin-bottom: 10px;
}
.geomap-autocomplete {
  width: 100%;
  padding: 16px;
  background-color: white;
  border-radius: 4px;
}
.buttons-container {
  display: flex;
  justify-content: flex-end;
}
</style>
