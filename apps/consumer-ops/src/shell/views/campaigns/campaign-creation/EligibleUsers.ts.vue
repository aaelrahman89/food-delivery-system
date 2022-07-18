<template>
  <div class="eligible-users-container">
    <vg-panel :title="$t('ELIGIBLE_USERS')" dark>
      <v-radio-group
        :value="eligibleUsersCriteria"
        hide-details
        class="eligible-users-container__radio-group"
        @change="updateEligibleUsersCriteria"
      >
        <eligibility-option
          :text="$t(customerEligibilityCriteria.ALL_CUSTOMERS.toString())"
          :value="customerEligibilityCriteria.ALL_CUSTOMERS.value"
        ></eligibility-option>
        <eligibility-option
          :text="$t(customerEligibilityCriteria.NEW_CUSTOMERS.toString())"
          :value="customerEligibilityCriteria.NEW_CUSTOMERS.value"
        ></eligibility-option>
        <eligibility-option
          :text="
            $t(customerEligibilityCriteria.REGISTERED_CUSTOMERS.toString())
          "
          :value="customerEligibilityCriteria.REGISTERED_CUSTOMERS.value"
        ></eligibility-option>
        <eligibility-option
          :text="$t(customerEligibilityCriteria.SUBSET_OF_CUSTOMERS.toString())"
          :value="customerEligibilityCriteria.SUBSET_OF_CUSTOMERS.value"
        >
          <div
            v-if="
              eligibleUsersCriteria ===
              customerEligibilityCriteria.SUBSET_OF_CUSTOMERS.value
            "
          >
            <input
              ref="CSVUpload"
              type="file"
              accept=".csv"
              style="display: none"
              @input="uploadCSV"
            />
            <div class="csv-uploader">
              <div>
                {{ csvFileName ? csvFileName : $t('AUDIENCE_FILE') }}
              </div>
              <div>
                <vg-button flat icon @click="triggerUpload">
                  <vg-svg :src="SVG_FILE" width="24px" height="24px"></vg-svg>
                </vg-button>
              </div>
            </div>
            <bdi class="csv-uploader-hint">
              {{ $t('CSV_MUST_CONTAIN_PHONE_NUMBERS') }}
            </bdi>
          </div>
        </eligibility-option>
      </v-radio-group>
    </vg-panel>
  </div>
</template>

<script lang="ts">
import EligibilityOption from './EligibilityOption.ts.vue';
import Vue from 'vue';
import parser from 'papaparse';
import { SVG_FILE } from '@survv/assets';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgSvg } from '@survv/commons/components/VgSvg';

const events = {
  updateEligibleUsersCriteria: 'update:eligible-users-criteria',
  inputCSVData: 'input:csv-data',
};

export default Vue.extend({
  name: 'EligibleUsers',
  components: { VgPanel, EligibilityOption, VgSvg, VgButton },
  props: {
    eligibleUsersCriteria: {
      type: String,
      required: true,
    },
    customerEligibilityCriteria: {
      type: Object,
      required: true,
    },
    csvFileName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      SVG_FILE,
    };
  },
  methods: {
    updateEligibleUsersCriteria(val: string): void {
      this.$emit(events.updateEligibleUsersCriteria, val);
    },
    triggerUpload(): void {
      (this.$refs.CSVUpload as HTMLInputElement).click();
    },
    uploadCSV(event: Event): void {
      const element = event.target as HTMLInputElement;
      const { files } = element;
      if (files && files[0]) {
        parser.parse(files[0], {
          header: true,
          complete: (CSVData: { data: Record<string, string> }) => {
            this.$emit(events.inputCSVData, {
              data: CSVData.data,
              fileName: files[0].name,
            });
          },
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.eligible-users-container {
  width: 354px;
  color: var(--color-on-surface-low-emphasis);

  &__radio-group {
    margin: 0;
  }
}
.csv-uploader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  padding: var(--inset-mid);
  margin-top: var(--inset-small);
  color: var(--color-on-surface-low-emphasis);
}
.csv-uploader-hint {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-inline-start: var(--inset-mid);
  color: var(--color-on-surface-low-emphasis);
  font-size: 12px;
}
</style>
