<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs">
    <vg-panel
      class="vg-margin-block-end--large"
      :title="$t('CUSTOMER_DETAILS_BASIC_INFO')"
      collapsible
    >
      <div class="profile-container">
        <div class="vg-margin-inline-end--mid">
          <vg-img
            alt="customer-photo"
            :src="pm.customer.imageUrl"
            width="200px"
            height="200px"
            border-radius="50%"
          />
        </div>
        <div>
          <vg-flex gap-size="small">
            <vg-pair
              :label="$t('CUSTOMER_DETAILS_NAME')"
              :value="pm.customer.name"
              max-width="calc(33% - var(--inset-small))"
              dense
            />
            <vg-pair
              :label="$t('CUSTOMER_DETAILS_MOBILE_NUMBER')"
              :value="pm.customer.mobileNo"
              max-width="calc(33% - var(--inset-small))"
              dense
            />
            <vg-pair
              :label="$t('CUSTOMER_DETAILS_EMAIL')"
              :value="pm.customer.email"
              max-width="calc(33% - var(--inset-small))"
              dense
            />
            <vg-pair
              :label="$t('CUSTOMER_DETAILS_GENDER')"
              :value="$t(pm.customer.gender)"
              max-width="calc(33% - var(--inset-small))"
              dense
            />
            <vg-pair
              :label="$t('CUSTOMER_DETAILS_BIRTH_DATE')"
              :value="pm.customer.birthDate.toDateString()"
              max-width="calc(33% - var(--inset-small))"
              dense
            />
            <vg-pair
              :label="$t('CUSTOMER_DETAILS_CREATION_DATE')"
              :value="pm.customer.creationDate.toDateString()"
              max-width="calc(33% - var(--inset-small))"
              dense
            />
          </vg-flex>
        </div>
      </div>
    </vg-panel>
    <vg-panel
      class="vg-margin-block-end--large"
      :title="$t('CUSTOMER_DETAILS_ADDRESSES')"
      collapsible
    >
      <vg-panel
        v-for="address in pm.addresses"
        :key="address.id"
        :title="address.title"
        class="address-panel"
      >
        <div class="address-container">
          <div>
            <vg-flex gap-size="small">
              <vg-pair
                max-width="calc(100% - var(--inset-small))"
                :label="$t('CUSTOMER_ADDRESS_ADDRESS_LINE')"
                :value="address.addressLine1"
                dense
              />
              <vg-pair
                max-width="calc(50% - var(--inset-small))"
                :label="$t('CUSTOMER_ADDRESS_COUNTRY')"
                :value="$t(address.country.name)"
                dense
              />
              <vg-pair
                max-width="calc(50% - var(--inset-small))"
                :label="$t('CUSTOMER_ADDRESS_CITY')"
                :value="$t(address.city.name)"
                dense
              />
              <vg-pair
                max-width="calc(50% - var(--inset-small))"
                :label="$t('CUSTOMER_ADDRESS_AREA')"
                :value="$t(address.area.name)"
                dense
              />
              <vg-pair
                max-width="calc(50% - var(--inset-small))"
                :label="$t('CUSTOMER_ADDRESS_BUILDING')"
                :value="address.building"
                dense
              />
              <vg-pair
                max-width="calc(50% - var(--inset-small))"
                :label="$t('CUSTOMER_ADDRESS_FLOOR')"
                :value="address.floor"
                dense
              />
              <vg-pair
                max-width="calc(50% - var(--inset-small))"
                :label="$t('CUSTOMER_ADDRESS_APARTMENT')"
                :value="address.apartmentNo"
                dense
              />
              <vg-pair
                max-width="100%"
                :label="$t('CUSTOMER_ADDRESS_LANDMARK')"
                :value="address.landmark"
                dense
              />
            </vg-flex>
          </div>
          <div class="map-container">
            <zones-map
              :geojson="generateAddressMapGeoJSON(address)"
              :height="'200px'"
              :min-height="'200px'"
              :interactive="false"
            />
          </div>
        </div>
      </vg-panel>
    </vg-panel>
    <vg-panel
      class="vg-margin-block-end--large"
      :title="$t('CUSTOMER_DETAILS_PAYMENT')"
    >
      <vg-pair
        :label="$t('CUSTOMER_DETAILS_BALANCE')"
        :value="`${pm.customer.balance} ${$t(pm.customer.balance.currency)}`"
        dense
      />
    </vg-panel>
    <vg-panel
      class="vg-margin-block-end--large"
      :title="$t('CUSTOMER_DETAILS_DEBIT_CREDIT_NOTES')"
      collapsible
    >
      <div class="button-container">
        <div class="vg-margin-block-end--mid">
          <vg-button outlined @click="DebitCreditNotesPM.openDebitNoteForm()">{{
            $t('ADD_DEBIT_NOTE')
          }}</vg-button>
          <vg-button
            outlined
            @click="DebitCreditNotesPM.openCreditNoteForm()"
            >{{ $t('ADD_CREDIT_NOTE') }}</vg-button
          >
        </div>
      </div>
      <debit-credit-notes-table
        class="elevation-1"
        :items="DebitCreditNotesPM.list.items"
        :total-items-count="DebitCreditNotesPM.list.totalItemsCount"
        :sort="DebitCreditNotesPM.query.sort"
        :skip="DebitCreditNotesPM.query.skip"
        :limit="DebitCreditNotesPM.query.limit"
        :loading="DebitCreditNotesPM.loading"
        @update:sort="DebitCreditNotesPM.onSortUpdate($event)"
        @update:pagination="DebitCreditNotesPM.onPaginationUpdate($event)"
      />
    </vg-panel>
    <vg-panel
      :title="$t('CUSTOMER_DETAILS_ORDERS', { count: pm.orders.items.length })"
      collapsible
    >
      <customer-orders-table
        class="elevation-1"
        :items="pm.orders.items"
        :total-items-count="pm.orders.totalItemsCount"
        :sort="pm.query.sort"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        :loading="pm.loading"
        @update:sort="pm.onSortUpdate($event)"
        @update:pagination="pm.onPaginationUpdate($event)"
      ></customer-orders-table>
    </vg-panel>
    <debit-note-form
      :open="DebitCreditNotesPM.shouldOpenDebitNoteForm"
      :form="AddDebitCreditNotesPM.debitForm"
      @discard="closeDebitNoteForm"
      @backdrop="closeDebitNoteForm"
      @submitted="submitDebitNoteForm"
    />
    <credit-note-form
      :open="DebitCreditNotesPM.shouldOpenCreditNoteForm"
      :form="AddDebitCreditNotesPM.creditForm"
      @discard="closeCreditNoteForm"
      @backdrop="closeCreditNoteForm"
      @submitted="submitCreditNoteForm"
    />
  </vg-content>
</template>

<script lang="ts">
import CreditNoteForm from './CreditNoteForm.ts.vue';
import CustomerOrdersTable from './CustomerOrdersTable.ts.vue';
import DebitCreditNotesTable from './DebitCreditNotesTable.ts.vue';
import DebitNoteForm from './DebitNoteForm.ts.vue';
import Vue from 'vue';
import ZonesMap from '../../../components/ZonesMap.vue';
import { AddDebitCreditNotePM } from '../../../../core/presentation-models/customers/AddDebitCreditNotePM';
import { CustomerAddress } from '../../../../core/models/CustomerAddress';
import { CustomerAddressRepoImpl } from '../../../repositories/customers/CustomerAddressRepoImpl';
import { CustomerDetailsPM } from '../../../../core/presentation-models/customers/CustomerDetailsPM';
import { CustomersRepoImpl } from '../../../repositories/customers/CustomersRepoImpl';
import { DebitCreditNotesPM } from '../../../../core/presentation-models/customers/DebitCreditNotesPM';
import { GeojsonFeatureCollection } from '@survv/commons/core/models/GeoJSON';
import { NavSegment } from '@survv/commons/core/models/NavSegments';
import { OrdersRepoImpl } from '../../../repositories/orders/OrdersRepoImpl';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgImg } from '@survv/commons/components/VgImg';
import { VgPair } from '@survv/commons/components/VgPair';
import { VgPanel } from '@survv/commons/components/VgPanel';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default Vue.extend({
  name: 'CustomerDetails',
  components: {
    CustomerOrdersTable,
    CreditNoteForm,
    DebitCreditNotesTable,
    DebitNoteForm,
    ZonesMap,
    VgButton,
    VgContent,
    VgImg,
    VgFlex,
    VgPanel,
    VgPair,
  },
  data() {
    return {
      pm: new CustomerDetailsPM({
        customerId: Number(this.$route.params.customerId),
        customersRepo: new CustomersRepoImpl(),
        customerAddressRepo: new CustomerAddressRepoImpl(),
        ordersRepo: new OrdersRepoImpl(),
        notificationService,
      }),
      DebitCreditNotesPM: new DebitCreditNotesPM({
        customerId: Number(this.$route.params.customerId),
        customersRepo: new CustomersRepoImpl(),
        query: this.$parseJSONQuery(this.$route.query.q),
        notificationService,
      }),
      AddDebitCreditNotesPM: new AddDebitCreditNotePM({
        customerId: Number(this.$route.params.customerId),
        customersRepo: new CustomersRepoImpl(),
        notificationService,
      }),
    };
  },
  computed: {
    breadcrumbs(): NavSegment[] {
      return [
        {
          routeName: ROUTE_NAMES.CUSTOMERS,
          text: 'CUSTOMERS_LIST_PAGE_TITLE',
        },
        {
          routeName: ROUTE_NAMES.CUSTOMER_DETAILS,
          text: this.pm.customer.name,
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
    await this.DebitCreditNotesPM.init();
  },
  methods: {
    closeDebitNoteForm(): void {
      this.AddDebitCreditNotesPM.debitForm.reset();
      this.DebitCreditNotesPM.closeDebitNoteForm();
    },
    closeCreditNoteForm(): void {
      this.AddDebitCreditNotesPM.creditForm.reset();
      this.DebitCreditNotesPM.closeCreditNoteForm();
    },
    async submitDebitNoteForm(): Promise<void> {
      await this.DebitCreditNotesPM.onDebitNoteFormSubmitted();
      this.AddDebitCreditNotesPM.debitForm.reset();
    },
    async submitCreditNoteForm(): Promise<void> {
      await this.DebitCreditNotesPM.onCreditNoteFormSubmitted();
      this.AddDebitCreditNotesPM.creditForm.reset();
    },
    generateAddressMapGeoJSON(
      address: CustomerAddress
    ): GeojsonFeatureCollection {
      return {
        type: 'FeatureCollection',
        features: [address.pinnedLocation],
      };
    },
  },
});
</script>

<style scoped lang="scss">
.profile-container {
  display: grid;
  grid-template-columns: 1fr 5fr;
  gap: var(--inset-mid) var(--inset-mid);
  grid-template-areas: '. .';
}
.address-panel:not(:last-child) {
  margin-bottom: var(--inset-mid);
}
.address-container {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 0.5fr;
  gap: var(--inset-mid) var(--inset-mid);
  grid-template-areas: '. .';
}
.map-container {
  width: 350px;
  height: 200px;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
}
.debit-credit-notes {
  & > * + * {
    margin-top: var(--inset-mid);
  }
}
.button-container {
  display: flex;
  justify-content: flex-end;
}
</style>
