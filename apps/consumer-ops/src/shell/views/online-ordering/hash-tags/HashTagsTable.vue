<template>
  <vg-data-table :columns="columns" v-bind="$attrs" v-on="$listeners">
    <template #item="items">
      <tr>
        <td>
          {{ items.item.name.en }}
        </td>
        <td>
          {{ items.item.name.ar }}
        </td>
        <td>
          {{ $t(items.item.status) }}
        </td>
        <td>
          {{ items.item.vendorsCount }}
        </td>
        <td>
          {{ items.item.itemsCount }}
        </td>
        <td @click.stop>
          <vg-action-menu
            :actions="generateActions(items.item)"
          ></vg-action-menu>
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script>
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

const events = {
  updateHashTags: 'update:hash-tags',
};

export default {
  name: 'HashTagsTable',
  components: { VgDataTable, VgActionMenu },
  data() {
    return {
      columns: [
        {
          value: 'title.en',
          text: this.$t('HASH_TAG_EN_NAME'),
          sortable: true,
        },
        {
          value: 'title.ar',
          text: this.$t('HASH_TAG_AR_NAME'),
          sortable: true,
        },
        {
          value: 'status',
          text: this.$t('HASH_TAG_STATUS'),
          sortable: true,
        },
        {
          value: 'vendorsCount',
          text: this.$t('HASH_TAG_VENDOR_COUNT'),
          sortable: true,
        },
        {
          value: 'itemsCount',
          text: this.$t('HASH_TAG_ITEMS_COUNT'),
          sortable: true,
        },
        {
          value: '',
          text: '',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    generateActions(item) {
      return [
        {
          name: this.$t('UPDATE_HASH_TAG'),
          onClick: () => {
            this.$emit(events.updateHashTags, item);
          },
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.tag-icon-cell {
  width: 36px;
  height: 36px;
}
.tag-icon {
  width: 36px;
  height: 36px;
  position: relative;
  margin: var(--inset-tiny);

  img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
}
.linkable-cell {
  min-width: 120px;
  border: 1px dashed var(--color-primary);
  color: var(--color-primary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: var(--inset-small);

  &__icon {
    width: fit-content;
    &::after {
      content: '🠖';
    }
  }

  @at-root [dir='rtl'] & {
    &__icon {
      &::after {
        content: '🠔';
      }
    }
  }
}
.tags-count {
  width: 120px;
}
</style>
