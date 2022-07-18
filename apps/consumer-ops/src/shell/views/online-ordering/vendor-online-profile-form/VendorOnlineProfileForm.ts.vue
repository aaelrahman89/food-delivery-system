<template>
  <vg-cover>
    <template>
      <vg-image-loader
        width="140"
        height="140"
        radius="4"
        :image.sync="pm.form.logo"
        @error="pm.onLogoLoadingFailure($event)"
      ></vg-image-loader>
    </template>
    <template #content>
      <div class="add-vendor-online-profile__vg-cover__content">
        <div
          class="add-vendor-online-profile__vg-cover__content__vendor-status"
        >
          <div
            class="
              add-vendor-online-profile__vg-cover__content__vendor-status__header
            "
          >
            {{ $t('ENABLE_VENDOR_STATUS') }}
          </div>
          <v-switch v-model="pm.form.active"> </v-switch>
        </div>
        <vendor-online-profile-form-legal-info
          :company-name.sync="pm.form.legalInfo.companyName"
          :company-address.sync="pm.form.legalInfo.companyAddress"
          :label.sync="pm.form.label"
          :validators="pm.form.validators"
        >
        </vendor-online-profile-form-legal-info>
        <vendor-online-profile-form-language-support
          :language-support-options.sync="pm.form.languageSupport"
          :validators="pm.form.validators"
        ></vendor-online-profile-form-language-support>
        <vendor-online-profile-form-name
          :name.sync="pm.form.name"
          :validators="pm.form.validators"
        ></vendor-online-profile-form-name>
        <vg-panel :title="$t('VENDOR_ONLINE_PROFILE_ORDERING_SYSTEM')">
          <vg-flex flex-direction="column" gap-size="mid">
            <div>
              <vg-radio-buttons
                v-model="pm.form.orderingSystem"
                :items="mappedOrderingSystems"
                color="primary"
                @input="onOrderingSystemChanged"
              ></vg-radio-buttons>
            </div>
            <div>
              <vg-flex flex-direction="row" gap-size="large">
                <div v-if="pm.shouldShowDeliverBy">
                  <vg-select
                    :selection.sync="pm.form.deliverBy"
                    :label="$t('VENDOR_ONLINE_PROFILE_DELIVER_BY')"
                    :options="pm.mappedDeliveryFleets"
                    :validator="pm.form.validators['deliverBy']"
                    outlined
                  >
                  </vg-select>
                </div>
                <div v-if="pm.shouldShowDispatchingModel">
                  <vg-select
                    :selection.sync="pm.form.dispatchingModel"
                    :label="$t('VENDOR_ONLINE_PROFILE_DISPATCHING_MODEL')"
                    :options="pm.mappedDispatchingModels"
                    :validator="pm.form.validators['dispatchingModel']"
                    outlined
                  >
                  </vg-select>
                </div>
                <div v-if="pm.shouldShowEstimatedDeliveryTime">
                  <vg-text-field
                    v-model.trim="pm.form.estimatedDeliveryTimeInMinutes"
                    :label="$t('VENDOR_ONLINE_PROFILE_ESTIMATED_DELIVERY_TIME')"
                    :validator="
                      pm.form.validators['estimatedDeliveryTimeInMinutes']
                    "
                    type="number"
                    outlined
                    required
                  />
                </div>
                <div v-if="pm.shouldShowEstimatedDeliveryTime">
                  <vg-text-field
                    v-model.trim="pm.form.deliveryFees"
                    :label="$t('VENDOR_ONLINE_PROFILE_DELIVERY_FEES')"
                    :validator="pm.form.validators['deliveryFees']"
                    type="number"
                    outlined
                    required
                  />
                </div>
              </vg-flex>
            </div>
          </vg-flex>
        </vg-panel>
        <vg-panel :title="$t('VENDOR_ONLINE_PROFILE_POS_INTEGRATION')">
          <vg-flex flex-direction="row" gap-size="mid">
            <div>
              <vg-checkbox
                :disabled="pm.form.orderingSystem == 'FAKE_VENDOR'"
                :value="pm.form.posIntegrated"
                label="POS Integrated"
                hide-details
                @input="updateVendorPosIntegrationStatus"
              ></vg-checkbox>
            </div>
            <div v-if="pm.form.posIntegrated">
              <vg-select
                :selection.sync="pm.form.posIntegrationType"
                :label="$t('VENDOR_ONLINE_PROFILE_POS_INTEGRATION_TYPE')"
                :options="pm.posIntegrationTypes"
                outlined
                hide-details
              >
              </vg-select>
            </div>
          </vg-flex>
        </vg-panel>
        <vendor-online-profile-form-attributes
          :opens-at.sync="pm.form.orderingHours.from"
          :closes-at.sync="pm.form.orderingHours.to"
          :minimum-order-value.sync="pm.form.minimumOrderValue"
          :tax-status.sync="pm.form.taxStatus"
          :average-preparation-time.sync="pm.form.averagePreparationTime"
          :validators="pm.form.validators"
        >
        </vendor-online-profile-form-attributes>
        <vendor-online-profile-form-description
          :description.sync="pm.form.description"
        >
        </vendor-online-profile-form-description>
        <vendor-online-profile-form-tags
          :tags.sync="pm.form.tags"
          @open:tag-selection="pm.openTagSelection()"
        ></vendor-online-profile-form-tags>
        <vg-gallery-loader
          :gallery.sync="pm.form.gallery"
          :cover-photo.sync="pm.form.coverPhoto"
          @error="pm.onGalleryImageLoadingFailure($event)"
        ></vg-gallery-loader>
        <vg-panel :title="usersTableTitle">
          <div v-if="pm.hasVendorUsers">
            <vg-flex flex-direction="column" gap-size="small">
              <vendor-online-profile-form-contacts-table
                :items="pm.form.contactPeople"
                :total-items-count="pm.form.contactPeople.length"
                @delete="pm.deleteContact($event)"
              ></vendor-online-profile-form-contacts-table>
              <div
                class="
                  add-vendor-online-profile__vg-cover__content__panel-button
                "
              >
                <vg-button outlined @click="pm.openAddContactPersonForm()">
                  {{ addUserTitle }}
                </vg-button>
              </div>
            </vg-flex>
          </div>
          <vg-flex
            v-else
            flex-direction="column"
            justify-content="center"
            align-items="center"
            gap-size="small"
          >
            <h3 class="gray-h">
              {{ usersTableEmptyState }}
            </h3>
            <vg-button outlined @click="pm.openAddContactPersonForm()">
              {{ addUserTitle }}
            </vg-button>
          </vg-flex>
        </vg-panel>
        <div class="add-vendor-online-profile__vg-cover__actions">
          <div class="add-vendor-online-profile__vg-cover__actions__discard">
            <vg-button outlined @click="discard">
              {{ $t('ADD_VENDOR_ONLINE_PROFILE_DISCARD') }}
            </vg-button>
          </div>
          <div class="add-vendor-online-profile__vg-cover__actions__save">
            <vg-button
              :disabled="!pm.canSubmit"
              :loading="pm.loading"
              @click="checkForUntaxedCataloguesAndSubmitOtherwise"
            >
              {{ $t('ADD_VENDOR_ONLINE_PROFILE_SAVE') }}
            </vg-button>
          </div>
        </div>
      </div>
      <vg-dialog
        :open="pm.isOpenedAffectedTaxedCataloguesDialog"
        :loading="pm.loading"
        :persistent="pm.loading"
        confirmation-label="YES"
        @update:open="pm.hideAffectedUntaxedCataloguesDialog()"
        @apply="submit"
      >
        <template #title>
          <h2>
            {{ $t('VENDOR_ONLINE_PROFILE_DIALOG_HEADER') }}
          </h2>
        </template>
        {{
          $t('VENDOR_ONLINE_PROFILE_DIALOG_BODY', {
            untaxedCatalogues: pm.untaxedCatalogues,
          })
        }}
      </vg-dialog>
    </template>
    <vg-bottom-sheet-list
      :open="pm.shouldShowSelectionsList"
      :item-groups="pm.tagsSelectionsList"
      selectable
      :selections.sync="pm.form.tags"
      @backdrop="pm.closeTagsSelection()"
      @update:selections="pm.closeTagsSelection()"
    >
      <template #header>
        {{ $t('TAG_SELECTION_HEADER') }}
      </template>
      <template #submit="{ selections }">
        {{ $t('TAG_SELECTION_SAVE', { quantity: selections.length }) }}
      </template>
    </vg-bottom-sheet-list>
    <template v-if="allowOpsVendorSelection">
      <vg-bottom-sheet-list
        v-if="pm.opsVendors"
        searchablethis
        :open="pm.shouldShowOpsVendors"
        :item-groups="pm.opsVendors"
        :search-label="
          $t('VENDOR_ONLINE_PROFILE_LIST_OPS_SELECTION_SEARCH_LABEL')
        "
        @search="pm.searchOpsVendors($event)"
        @backdrop="pm.closeOpsVendors()"
        @click:item="pm.changeLinkedVendor($event)"
      >
        <template #header>
          {{ $t('VENDOR_ONLINE_PROFILE_LIST_OPS_SELECTION_HEADER') }}
        </template>
      </vg-bottom-sheet-list>
    </template>
    <add-contact-person-bottom-sheet
      :open="pm.shouldShowContactPersonBottomSheet"
      :name.sync="pm.contactPersonForm.name"
      :email.sync="pm.contactPersonForm.email"
      :mobile-no.sync="pm.contactPersonForm.mobileNumber"
      :title.sync="pm.contactPersonForm.title"
      :validators="pm.contactPersonForm.validators"
      :can-submit="pm.contactPersonForm.submittable"
      :form-title="addUserTitle"
      @backdrop="pm.closeAddContactPersonForm()"
      @discard="pm.closeAddContactPersonForm()"
      @submit="submitContactPersonForm"
    />
  </vg-cover>
</template>

<script lang="ts">
import AddContactPersonBottomSheet from './AddContactPersonBottomSheet.ts.vue';
import VendorOnlineProfileFormAttributes from './VendorOnlineProfileFormAttributes.ts.vue';
import VendorOnlineProfileFormContactsTable from './VendorOnlineProfileFormContactsTable.ts.vue';
import VendorOnlineProfileFormDescription from './VendorOnlineProfileFormDescription.ts.vue';
import VendorOnlineProfileFormLanguageSupport from './VendorOnlineProfileFormLanguageSupport.ts.vue';
import VendorOnlineProfileFormLegalInfo from './VendorOnlineProfileFormLegalInfo.ts.vue';
import VendorOnlineProfileFormName from './VendorOnlineProfileFormName.ts.vue';
import VendorOnlineProfileFormTags from './VendorOnlineProfileFormTags.ts.vue';
import VgDialog from '../../../components/VgDialog.vue';
import Vue from 'vue';
import { OrderingSystem } from '../../../../core/models/OrderingSystem';
import { VendorOnlineProfileCreationPM } from '../../../../core/presentation-models/online-ordering/VendorOnlineProfileCreationPM';
import { VendorOnlineProfileUpdatePM } from '../../../../core/presentation-models/online-ordering/VendorOnlineProfileUpdatePM';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList/index';
import { VgButton } from '@survv/commons/components/VgButton/index';
import { VgCheckbox } from '@survv/commons/components/VgCheckbox';
import { VgCover } from '@survv/commons/components/VgCover/index';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgGalleryLoader } from '@survv/commons/components/VgGalleryLoader/index';
import { VgImageLoader } from '@survv/commons/components/VgImageLoader/index';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { VgRadioButtons } from '@survv/commons/components/VgRadioButtons';
import { VgSelect } from '@survv/commons/components/VgSelect';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submit: 'submit',
  discard: 'discard',
};

export default Vue.extend({
  name: 'VendorOnlineProfileForm',
  components: {
    AddContactPersonBottomSheet,
    VendorOnlineProfileFormLegalInfo,
    VendorOnlineProfileFormLanguageSupport,
    VgCover,
    VendorOnlineProfileFormName,
    VendorOnlineProfileFormAttributes,
    VendorOnlineProfileFormDescription,
    VendorOnlineProfileFormTags,
    VendorOnlineProfileFormContactsTable,
    VgButton,
    VgImageLoader,
    VgGalleryLoader,
    VgBottomSheetList,
    VgDialog,
    VgSelect,
    VgPanel,
    VgTextField,
    VgFlex,
    VgRadioButtons,
    VgCheckbox,
  },
  props: {
    pm: {
      type: [VendorOnlineProfileCreationPM, VendorOnlineProfileUpdatePM],
      required: true,
    },
  },
  computed: {
    allowOpsVendorSelection(): boolean {
      return this.pm instanceof VendorOnlineProfileCreationPM;
    },
    mappedOrderingSystems() {
      return OrderingSystem.lookup().map((system) => {
        return {
          string: this.$t(system),
          value: system.valueOf(),
        };
      });
    },
    usersTableTitle() {
      return this.pm.form.orderingSystem === 'CALL_CENTER_DASHBOARD'
        ? this.$t('VENDOR_ONLINE_PROFILE_VENDOR_ADMINS')
        : this.$t('VENDOR_ONLINE_PROFILE_CONTACTS');
    },
    usersTableEmptyState() {
      return this.pm.form.orderingSystem === 'CALL_CENTER_DASHBOARD'
        ? this.$t('VENDOR_ONLINE_PROFILE_EMPTY_VENDOR_ADMINS')
        : this.$t('VENDOR_ONLINE_PROFILE_EMPTY_CONTACTS');
    },
    addUserTitle() {
      return this.pm.form.orderingSystem === 'CALL_CENTER_DASHBOARD'
        ? this.$t('VENDOR_ONLINE_PROFILE_ADD_VENDOR_ADMIN')
        : this.$t('VENDOR_ONLINE_PROFILE_ADD_CONTACT');
    },
  },
  methods: {
    async submitContactPersonForm() {
      if (await this.pm.contactPersonForm.submit()) {
        await this.pm.closeAddContactPersonForm();
      }
    },
    discard(): void {
      this.$emit(events.discard);
    },
    async submit(): Promise<void> {
      this.$emit(events.submit);
    },
    onOrderingSystemChanged(val: string) {
      this.pm.onOrderingSystemChanged(val);
    },
    async checkForUntaxedCataloguesAndSubmitOtherwise(): Promise<void> {
      const untaxedCataloguesCount =
        await this.pm.showAffectedUntaxedCataloguesDialog();

      if (untaxedCataloguesCount === 0) {
        await this.submit();
      }
    },
    updateVendorPosIntegrationStatus(status: boolean): void {
      this.pm.form.posIntegrated = status;
      if (status) {
        this.pm.form.posIntegrationType = this.pm.posIntegrationTypes[0].value;
      } else {
        this.pm.form.posIntegrationType = 'NONE';
      }
    },
  },
});
</script>

<style scoped lang="scss">
.gray-h {
  color: rgb(112, 112, 112);
}
.add-vendor-online-profile__vg-cover {
  &__content {
    display: grid;
    row-gap: var(--inset-large);
    &__vendor-status {
      padding: var(--inset-mid);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: var(--color-surface-light);
      border: 1px solid var(--color-border-light);
      border-radius: 4px;

      &__header {
        color: var(--color-on-surface-mid-emphasis);
        font-size: 16px;
      }
    }
    &__panel-button {
      align-self: flex-end;
    }
  }
  &__actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    &__save {
      margin-inline-start: var(--inset-mid);
    }
  }
}
</style>
