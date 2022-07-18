<template>
  <vg-content :pm="pm" :breadcrumbs="breadcrumbs" class="tags-list-container">
    <div class="tags-list-container__section">
      <vg-button color="primary" outlined @click="pm.openTagCreation()">
        {{ $t('CREATE_NEW_TAG') }}
      </vg-button>
    </div>
    <div class="tags-list-container__section">
      <tags-table
        class="elevation-1"
        :items="pm.list.items"
        :total-items-count="pm.list.totalItemsCount"
        :skip="pm.query.skip"
        :limit="pm.query.limit"
        @update:pagination="pm.onPaginationUpdate($event)"
        @update:sort="pm.onSortUpdate($event)"
        @update:tag="pm.openTagUpdate($event)"
      >
      </tags-table>
    </div>
    <div>
      <tag-form
        :open="pm.shouldOpenTagForm"
        :pm="pm.tagFormPM"
        @discard="pm.closeTagForm()"
        @backdrop="pm.closeTagForm()"
        @submit="pm.onTagFormSubmit()"
      ></tag-form>
    </div>
  </vg-content>
</template>

<script>
import TagForm from './TagForm.vue';
import TagsTable from './TagsTable.vue';
import { TagCreationPM } from '../../../../core/presentation-models/online-ordering/TagCreationPM';
import { TagUpdatePM } from '../../../../core/presentation-models/online-ordering/TagUpdatePM';
import { TagsListPM } from '../../../../core/presentation-models/online-ordering/TagsListPM';
import { TagsRepoImpl } from '../../../repositories/online-ordering/TagsRepoImpl';
import { VendorType } from '@survv/commons/core/models/VendorType';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgContent } from '@survv/commons/components/VgContent';
import { notificationService } from '@survv/commons/shell/services/notificationService';

export default {
  name: 'TagsListView',
  components: { TagForm, VgContent, TagsTable, VgButton },
  data() {
    return {
      pm: new TagsListPM({
        tagsRepo: new TagsRepoImpl(),
        tagType: this.$route.params.tagType.toUpperCase(),
        vendorType: new VendorType(this.$route.params.vendorType.toUpperCase()),
        query: this.$parseJSONQuery(this.$route.query.q),
        notificationService,
        children: {
          tagCreationPM: new TagCreationPM({
            vendorType: this.$route.params.vendorType.toUpperCase(),
            tagType: this.$route.params.tagType.toUpperCase(),
            tagsRepo: new TagsRepoImpl(),
            notificationService,
          }),
          tagUpdatePM: new TagUpdatePM({
            tagsRepo: new TagsRepoImpl(),
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
          routeName: 'routes.online_ordering.application.tags.list',
          text: `TAGS_${this.$route.params.tagType.toUpperCase()}`,
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
.tags-list-container__section {
  margin: var(--inset-large) 0;
}
</style>
