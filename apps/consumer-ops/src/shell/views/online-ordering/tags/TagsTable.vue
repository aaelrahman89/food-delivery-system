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
  updateTag: 'update:tag',
};

export default {
  name: 'TagsTable',
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
          value: '',
          text: '',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    generateActions(tag) {
      return [
        {
          name: this.$t('EDIT_TAG'),
          onClick: () => {
            this.$emit(events.updateTag, tag);
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
    border-radius: 50%;
  }
}
</style>
