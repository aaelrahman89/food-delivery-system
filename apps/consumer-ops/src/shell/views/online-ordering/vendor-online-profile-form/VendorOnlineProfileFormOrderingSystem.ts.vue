<template>
  <vg-panel :title="`${$t('VENDOR_ONLINE_PROFILE_ORDERING_SUPPORT')}*`">
    <template>
      <div>
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-form ref="form" lazy-validation>
                    <v-container>
                      <v-row>
                        <v-col>
                          <h3>{{ $t('vendors.profile.ordering_system') }}</h3>
                          <v-radio-group
                            :value="orderingSystem"
                            row
                            @change="onOrderingSystemChanged"
                          >
                            <template v-for="item in mappedOrderingSystems">
                              <v-radio
                                :key="item.value"
                                :label="$t(item.string)"
                                :value="item.value"
                              ></v-radio>
                            </template>
                          </v-radio-group>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-if="pm.shouldShowDeliverBy">
                          <v-select
                            :value="deliverBy"
                            :label="$t('vendors.profile.deliver_by')"
                            :items="mappedDeliveryFleets"
                            :rules="[validate('deliverBy')]"
                          >
                            <template slot="item" slot-scope="data">
                              <span>{{ $t(data.item.text) }}</span>
                            </template>
                            <template slot="selection" slot-scope="dataItem">
                              <span>{{ $t(dataItem.item.text) }}</span>
                            </template>
                          </v-select>
                        </v-col>
                        <v-col v-if="pm.shouldShowDispatchingModel">
                          <v-select
                            v-model="pm.vendor.dispatchingModel"
                            :label="$t('vendors.profile.dispatching_model')"
                            :items="mappedDispatchingModels"
                            :rules="[validate('dispatchingModel')]"
                          >
                            <template slot="item" slot-scope="data">
                              <span>{{ $t(data.item.text) }}</span>
                            </template>
                            <template slot="selection" slot-scope="dataItem">
                              <span>{{ $t(dataItem.item.text) }}</span>
                            </template>
                          </v-select>
                        </v-col>
                        <v-col v-if="pm.shouldShowEstimatedDeliveryTime">
                          <v-text-field
                            v-model.trim="
                              pm.vendor.estimatedDeliveryTimeInMinutes
                            "
                            :label="
                              $t(
                                'vendors.profile.estimated_delivery_time_in_minutes'
                              )
                            "
                            type="number"
                            required
                            :rules="[
                              validate('estimatedDeliveryTimeInMinutes'),
                            ]"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </vg-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { DeliveryFleet } from '../../../../core/models/DeliveryFleet';
import { DispatchingModel } from '../../../../core/models/DispatchingModel';
import { OrderingSystem } from '../../../../core/models/OrderingSystem';
import { VgPanel } from '@survv/commons/components/VgPanel/index';

const events = {
  update: 'update:language-support-options',
};

export default Vue.extend({
  name: 'VendorOnlineProfileFormOrderingSystem',
  components: { VgPanel },
  props: {
    orderingSystem: {
      type: Object,
      required: true,
    },
    deliverBy: {
      type: Object,
      required: true,
    },
    dispatchingModel: {
      type: Object,
      required: true,
    },
    estimatedDeliveryTimeInMinutes: {
      type: Number,
      required: true,
    },
    validators: {
      type: Object,
      default(): unknown {
        return {};
      },
    },
  },
  computed: {
    computedValidation(): false | string {
      const validationResult = this.validators.languageSupport();
      if (validationResult === true) {
        return false;
      }
      return validationResult;
    },

    mappedOrderingSystems() {
      return OrderingSystem.lookup().map((system) => {
        return {
          string: this.$t(system),
          value: system.valueOf(),
        };
      });
    },
    mappedDeliveryFleets() {
      return DeliveryFleet.lookup().map((item) => ({
        text: item.toString(),
        value: item.valueOf(),
      }));
    },
    mappedDispatchingModels() {
      return DispatchingModel.lookup().map((item) => ({
        text: item.toString(),
        value: item.valueOf(),
      }));
    },
  },
  methods: {
    onOrderingSystemChanged(val) {
      this.pm.onOrderingSystemChanged(val);
      this.$refs.form.resetValidation();
    },
    updateEnOption(newVal: boolean): void {
      this.$emit(events.update, {
        en: newVal,
        ar: this.languageSupportOptions.ar,
      });
    },
    updateArOption(newVal: boolean): void {
      this.$emit(events.update, {
        en: this.languageSupportOptions.en,
        ar: newVal,
      });
    },
  },
});
</script>

<style scoped lang="scss">
.language-support-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  column-gap: var(--inset-mid);
  row-gap: var(--inset-mid);
}
.language-support-__validation-msg {
  padding-top: var(--inset-small);
  color: var(--color-primary);
}
</style>
