<template>
  <vg-data-table :columns="columns" v-bind="$attrs" v-on="$listeners">
    <template #item="{ item }">
      <tr>
        <td class="tag-icon-cell">
          <div class="tag-icon">
            <img :src="item.icon" alt="tag-icon" />
          </div>
        </td>
        <td>
          {{ item.name.en }}
        </td>
        <td>
          {{ item.name.ar }}
        </td>
        <td>
          <div class="linkable-cell tags-count" @click="viewLinkedTags(item)">
            <div class="tag-count__value">
              {{ item.tagsCount + item.hashTagsCount }}
            </div>
            <div class="linkable-cell__icon"></div>
          </div>
        </td>
        <td>
          {{ $t(item.status) }}
        </td>
        <td @click.stop>
          <vg-action-menu :actions="generateActions(item)"></vg-action-menu>
        </td>
      </tr>
    </template>
  </vg-data-table>
</template>

<script>
import { VgActionMenu } from '@survv/commons/components/VgActionMenu';
import { VgDataTable } from '@survv/commons/components/VgDataTable';

const events = {
  updateTagGroup: 'update:tag-group',
  viewLinkedTags: 'view:linked-tags',
};

export default {
  name: 'TagGroupsTable',
  components: { VgDataTable, VgActionMenu },
  data() {
    return {
      columns: [
        {
          value: '',
          text: '',
          sortable: false,
        },
        {
          value: 'title.en',
          text: this.$t('TAG_EN_NAME'),
          sortable: true,
        },
        {
          value: 'title.ar',
          text: this.$t('TAG_AR_NAME'),
          sortable: true,
        },
        {
          value: 'tagsCount',
          text: this.$t('TAG_COUNT'),
          sortable: true,
        },
        {
          value: 'status',
          text: this.$t('TAG_STATUS'),
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
    generateActions(tagGroup) {
      return [
        {
          name: this.$t('UPDATE_TAG_GROUP'),
          onClick: () => {
            this.$emit(events.updateTagGroup, tagGroup);
          },
        },
      ];
    },

    viewLinkedTags(tag) {
      this.$emit(events.viewLinkedTags, tag);
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
