<template>
  <vg-content
    :pm="pm"
    :breadcrumbs="breadcrumbs"
    class="tag-groups-list-container"
  >
    <div class="tag-groups-list-container__section">
      <vg-button color="primary" outlined @click="pm.openTagGroupCreation()">
        {{ $t('CREATE_NEW_TAG_GROUP') }}
      </vg-button>
    </div>
    <div class="tag-groups-list-container__section">
      <tag-groups-table
        class="elevation-1"
        :items="pm.list.items"
        :total-items-count="pm.list.totalItemsCount"
        :sort="pm.query.sort"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        @update:pagination="pm.onPaginationUpdate($event)"
        @update:sort="pm.onSortUpdate($event)"
        @update:tag-group="pm.openTagGroupUpdate($event)"
        @view:linked-tags="pm.openLinkedTags($event)"
      >
      </tag-groups-table>
    </div>
    <div>
      <tag-group-form
        :open="pm.shouldOpenTagGroupForm"
        :pm="pm.tagGroupFormPM"
        @backdrop="pm.closeTagGroupForm()"
        @submit="pm.onTagGroupFormSubmit()"
        @discard="pm.closeTagGroupForm()"
        @open:selections="pm.openTagSelections()"
      ></tag-group-form>
    </div>
    <div>
      <tag-selection
        :open="pm.shouldOpenTagSelection"
        :pm="pm.tagGroupFormPM"
        @submit="pm.closeTagSelection()"
        @backdrop="pm.closeTagSelection()"
      ></tag-selection>
    </div>
    <div>
      <vg-bottom-sheet-list
        :open="pm.shouldOpenLinkedTags"
        :item-groups="pm.linkedTags"
        @backdrop="pm.closeLinkedTags()"
      >
        <template #header>
          {{ $t('LINKED_TAGS_HEADER') }}
        </template>
      </vg-bottom-sheet-list>
    </div>
  </vg-content>
</template>

<script>
import TagGroupForm from './TagGroupForm.ts.vue';
import TagGroupsTable from './TagGroupsTable.vue';
import TagSelection from './TagSelection.ts.vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';

import { TagGroupCreationPM } from '../../../../core/presentation-models/online-ordering/TagGroupCreationPM';
import { TagGroupUpdatePM } from '../../../../core/presentation-models/online-ordering/TagGroupUpdatePM';
import { TagGroupsListPM } from '../../../../core/presentation-models/online-ordering/TagGroupsListPM';
import { TagGroupsRepoImpl } from '../../../repositories/online-ordering/TagGroupsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgBottomSheetList } from '@survv/commons/components/VgBottomSheetList';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default {
  name: 'TagGroupsListView',
  components: {
    TagGroupForm,
    VgContent,
    TagGroupsTable,
    VgButton,
    TagSelection,
    VgBottomSheetList,
  },
  data() {
    return {
      pm: new TagGroupsListPM({
        tagGroupsRepo: new TagGroupsRepoImpl(),
        query: this.$parseJSONQuery(this.$route.query.q),
        vendorType: new VendorType(this.$route.params.vendorType.toUpperCase()),
        notificationService,
        children: {
          tagGroupCreationPM: new TagGroupCreationPM({
            tagGroupsRepo: new TagGroupsRepoImpl(),
            vendorType: this.$route.params.vendorType.toUpperCase(),
            notificationService,
          }),
          tagGroupUpdatePM: new TagGroupUpdatePM({
            tagGroupsRepo: new TagGroupsRepoImpl(),
            notificationService,
          }),
        },
      }),
    };
  },
  computed: {
    breadcrumbs() {
      return [
        {
          routeName: 'routes.online_ordering.application',
          text: 'APP_MANAGEMENT_APPLICATION',
        },
        {
          routeName: 'routes.online_ordering.application.tag-groups',
          text: `TAG_GROUPS`,
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
.tag-groups-list-container__section {
  margin: var(--inset-large) 0;
}
</style>
