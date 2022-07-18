<template>
  <div>
    <vg-flex flex-direction="column" no-wrap>
      <template v-for="(item, index) in orderJourney">
        <div :key="item.stepTitle + index" class="item-container">
          <div class="timeline-left">
            <div class="top">
              <div class="top__fill"></div>
            </div>
            <div class="center">
              <div class="center__fill"></div>
            </div>
            <div class="bottom">
              <div class="bottom__fill"></div>
            </div>
          </div>
          <div class="timeline-right vg-padding-block-end--large">
            <order-journey-step
              v-if="item.stepTitle === 'PICKUP'"
              :title="
                $t('ORDER_JOURNEY_PICKUP', {
                  pickupsCount: item.pickupsCount,
                  pickupPointIndex: item.pickupIndex,
                  pointLabel: item.pointLabel,
                })
              "
            >
              <vg-flex gap-size="small">
                <div
                  v-for="(dataItem, stepIndex) in item.extraData"
                  :key="stepIndex"
                >
                  <div v-if="item.clickable" class="step-data-item">
                    <div class="step-data-item">
                      <vg-clickable-pair
                        max-width="100%"
                        dense
                        :label="$t('ORDER_JOURNEY_' + dataItem.name)"
                        :value="$t(dataItem.value)"
                        :route="dataItem.route"
                      ></vg-clickable-pair>
                    </div>
                  </div>
                  <div v-else class="step-data-item">
                    <vg-pair
                      max-width="100%"
                      dense
                      :label="$t('ORDER_JOURNEY_' + dataItem.name)"
                      :value="$t(dataItem.value)"
                    ></vg-pair>
                  </div>
                </div>
              </vg-flex>
            </order-journey-step>
            <order-journey-step
              v-else
              :title="$t('ERRAND_ORDER_STATUS_' + item.stepTitle)"
            >
              <vg-flex gap-size="small">
                <div class="step-data-item">
                  <vg-pair
                    max-width="100%"
                    dense
                    :label="$t('ORDER_JOURNEY_TIME_STAMP')"
                    :value="$t(item.stepTimeStamp)"
                  ></vg-pair>
                </div>
                <div
                  v-for="(dataItem, extraDataIndex) in item.extraData"
                  :key="extraDataIndex"
                >
                  <div v-if="item.clickable" class="step-data-item">
                    <vg-clickable-pair
                      max-width="100%"
                      dense
                      :label="$t('ORDER_JOURNEY_' + dataItem.name)"
                      :value="$t(dataItem.value)"
                      :route="dataItem.route"
                    ></vg-clickable-pair>
                  </div>

                  <div v-else class="step-data-item">
                    <vg-pair
                      max-width="100%"
                      dense
                      :label="$t('ORDER_JOURNEY_' + dataItem.name)"
                      :value="$t(getDateItemValue(dataItem))"
                    ></vg-pair>
                  </div>
                </div>
              </vg-flex>
            </order-journey-step>
          </div>
        </div>
      </template>
    </vg-flex>
  </div>
</template>

<script lang="ts">
import OrderJourneyStep from '../order-details/OrderJourneyStep.ts.vue';
import Vue from 'vue';
import { VgClickablePair } from '@survv/commons/components/VgClickablePair';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgPair } from '@survv/commons/components/VgPair';

export default Vue.extend({
  name: 'ErrandsOrderJourney',
  components: { VgFlex, VgPair, VgClickablePair, OrderJourneyStep },
  props: {
    orderJourney: {
      type: Array,
      default(): [] {
        return [];
      },
    },
  },
  methods: {
    getDateItemValue(dataItem: Record<string, string>): string {
      if (dataItem.name === 'REFUNDED') {
        return dataItem.value == 'true' ? this.$t('YES') : this.$t('NO');
      }
      if (dataItem.name === 'PLATFORM') {
        return dataItem.value === 'IOS' ? 'ios' : 'Android';
      }
      return dataItem.value;
    },
  },
});
</script>

<style scoped lang="scss">
.item-container {
  display: flex;
  flex-direction: row;
}
.item-container:first-child .top__fill {
  display: none;
}
.item-container:last-child .bottom__fill {
  display: none;
}
.step-data-item {
  min-width: 300px;
}
.timeline-left {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: unset;
  padding: 0 10px;
}
.timeline-right {
  flex-grow: 1;
}
.top {
  height: 18px;

  &__fill {
    width: 3px;
    height: 100%;
    background-color: var(--color-primary);
  }
}
.center {
  &__fill {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: var(--color-primary);
  }
}
.bottom {
  height: 100%;

  &__fill {
    width: 3px;
    height: 100%;
    background-color: var(--color-primary);
  }
}
</style>
