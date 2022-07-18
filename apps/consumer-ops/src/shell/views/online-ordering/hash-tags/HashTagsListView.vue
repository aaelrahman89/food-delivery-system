<template>
  <vg-content
    :pm="pm"
    :breadcrumbs="breadcrumbs"
    class="hash-tags-list-container"
  >
    <div class="hash-tags-list-container__section">
      <vg-button color="primary" outlined @click="pm.openHashTagCreation()">
        {{ $t('CREATE_NEW_HASH_TAG') }}
      </vg-button>
    </div>
    <div class="tag-groups-list-container__section">
      <hash-tags-table
        class="elevation-1"
        :items="pm.list.items"
        :total-items-count="pm.list.totalItemsCount"
        :sort="pm.query.sort"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        @update:hash-tags="pm.openHashTagUpdate($event)"
        @update:pagination="pm.onPaginationUpdate($event)"
        @update:sort="pm.onSortUpdate($event)"
      >
      </hash-tags-table>
    </div>
    <div>
      <hash-tag-form
        :open="pm.shouldOpenHashTagForm"
        :pm="pm.hashTagFormPM"
        @discard="pm.closeHashTagForm()"
        @backdrop="pm.closeHashTagForm()"
        @submit="pm.onHashTagFormSubmit()"
      ></hash-tag-form>
    </div>
  </vg-content>
</template>

<script>
import HashTagForm from './HashTagForm.vue';
import HashTagsTable from './HashTagsTable.vue';
import { HashTagCreationPM } from '../../../../core/presentation-models/online-ordering/HashTagCreationPM';
import { HashTagUpdatePM } from '../../../../core/presentation-models/online-ordering/HashTagUpdatePM';
import { HashTagsListPM } from '../../../../core/presentation-models/online-ordering/HashTagsListPM';
import { HashTagsRepoImpl } from '../../../repositories/online-ordering/HashTagsRepoImpl';
import { ROUTE_NAMES } from '../../../../core/routes/routeNames';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default {
  name: 'HashTagsListView',
  components: { HashTagForm, VgContent, HashTagsTable, VgButton },
  data() {
    return {
      pm: new HashTagsListPM({
        hashTagsRepo: new HashTagsRepoImpl(),
        vendorType: this.$route.params.vendorType.toUpperCase(),
        notificationService,
        query: this.$parseJSONQuery(this.$route.query.q),
        children: {
          hashTagCreationPM: new HashTagCreationPM({
            vendorType: this.$route.params.vendorType.toUpperCase(),
            hashTagsRepo: new HashTagsRepoImpl(),
            notificationService,
          }),
          hashTagUpdatePM: new HashTagUpdatePM({
            vendorType: this.$route.params.vendorType.toUpperCase(),
            hashTagsRepo: new HashTagsRepoImpl(),
            notificationService,
          }),
        },
      }),
      dummyOpen: false,
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          routeName: ROUTE_NAMES.ONLINE_ORDERING_VENDOR_ONLINE_PROFILE_LIST,
          text: `NAV_VENDOR_ONLINE_PROFILE_${this.$route.params.vendorType}`.toUpperCase(),
        },
        {
          routeName: 'routes.online_ordering.application.hash-tags',
          text: 'HASH_TAGS',
        },
      ];
    },
  },
  async created() {
    await this.pm.init();
  },
};
</script>

<style scoped lang="scss">
.hash-tags-list-container__section {
  margin: var(--inset-large) 0;
}
</style>
