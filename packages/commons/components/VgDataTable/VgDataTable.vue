<template>
  <v-data-table
    ref="table"
    :footer-props="footerProps"
    :multi-sort="multiSort"
    :headers="columns"
    :items="items"
    :server-items-length="totalItemsCount"
    :page="page"
    :items-per-page="itemsPerPage"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
    :loading="loading"
    :must-sort="mustSort"
    :hide-default-footer="hideFooter"
    :class="{ 'table--clickable-rows': clickableRows }"
    @update:options="onOptionsUpdate($event)"
    @click:row="onRowClick($event)"
  >
    <template
      v-for="scopedSlot in mappedScopedSlots"
      :slot="scopedSlot.vuetifyScopedSlot"
      slot-scope="{ item, index }"
    >
      <slot :name="scopedSlot.mappedName" v-bind="{ item, index }" />
    </template>
  </v-data-table>
</template>

<script>
import { VDataTable } from 'vuetify/lib/components/VDataTable';

const events = {
  updatePagination: 'update:pagination',
  updateSort: 'update:sort',
  clickRow: 'click:row',
};

export default {
  name: 'VgDataTable',
  components: { VDataTable },
  props: {
    items: {
      type: Array,
      default: undefined,
      required: true,
    },
    columns: {
      type: Array,
      default: undefined,
      required: true,
    },
    totalItemsCount: {
      type: Number,
      default: undefined,
      required: true,
    },
    sort: {
      type: Object,
      default: undefined,
    },
    skip: {
      type: Number,
      default: undefined,
    },
    limit: {
      type: Number,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    mustSort: {
      type: Boolean,
      default: false,
    },
    multiSort: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      footerProps: {
        itemsPerPageOptions: [10, 25, 50, 100],
      },
      mappedScopedSlots: [
        {
          mappedName: 'item',
          vuetifyScopedSlot: 'item',
        },
        {
          mappedName: 'expanded-item',
          vuetifyScopedSlot: 'expanded-item',
        },
        {
          mappedName: 'footer',
          vuetifyScopedSlot: 'body.append',
        },
      ],
    };
  },
  computed: {
    clickableRows() {
      return 'click:row' in this.$listeners;
    },
    page() {
      return this.skip / this.limit + 1;
    },
    itemsPerPage() {
      return this.limit;
    },
    sortBy() {
      return this.sort ? Object.keys(this.sort) : [];
    },
    sortDesc() {
      return this.sort
        ? Object.entries(this.sort).map(
            ([, value]) => value.toLowerCase() == 'desc'
          )
        : [];
    },
  },

  methods: {
    paginationHasChanged({ page, itemsPerPage }) {
      return page != this.page || itemsPerPage != this.itemsPerPage;
    },
    sortHasChanged({ sortBy, sortDesc }) {
      return sortBy[0] != this.sortBy[0] || sortDesc[0] !== this.sortDesc[0];
    },
    onOptionsUpdate({ page, itemsPerPage, sortBy, sortDesc }) {
      if (this.paginationHasChanged({ page, itemsPerPage })) {
        this.$emit(events.updatePagination, {
          skip: (page - 1) * itemsPerPage,
          limit: itemsPerPage,
        });
      }
      if (this.sortHasChanged({ sortBy, sortDesc })) {
        this.$emit(
          events.updateSort,
          Object.fromEntries(
            sortBy.map((key, index) => [key, sortDesc[index] ? 'desc' : 'asc'])
          )
        );
      }
    },
    onRowClick(item) {
      this.$emit(events.clickRow, item);
    },
  },
};
</script>

<style></style>
