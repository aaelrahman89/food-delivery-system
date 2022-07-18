<template>
  <div ref="sortableItems">
    <div
      v-for="element in internalValue"
      :key="element[listKey]"
      class="sortable-item"
    >
      <slot name="item" :item="element"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Sortable, { SortableEvent } from 'sortablejs';
import Vue from 'vue';
import { PropValidator } from 'vue/types/options';

const events = {
  updateList: 'update:list',
};

export default Vue.extend({
  name: 'VgDraggable',
  props: {
    list: {
      type: Array,
      required: true,
    } as PropValidator<Record<string, unknown>[]>,
    listKey: {
      type: String,
      default: 'id',
    },
    handlerClass: {
      type: String,
      default: 'sortable-item',
    },
    gutters: {
      type: String,
      default: '0',
    },
  },
  computed: {
    internalValue(): Record<string, unknown>[] {
      return [...this.list];
    },
  },
  mounted(): void {
    Sortable.create(this.$refs.sortableItems as HTMLElement, {
      handle: `.${this.handlerClass}`,
      dragClass: 'sortable-drag',
      ghostClass: 'sortable-ghost',
      onEnd: this.onEnd,
      animation: 250,
    });
  },
  methods: {
    updateList(sortedList: unknown[]): void {
      this.$emit(events.updateList, sortedList);
    },
    onEnd({ oldIndex = 0, newIndex = 0 }: SortableEvent): void {
      const draggedItem =
        this.internalValue[oldIndex as NonNullable<SortableEvent['oldIndex']>];
      const tmpList = this.internalValue.filter(
        (item) => item[this.listKey] !== draggedItem[this.listKey]
      );
      tmpList.splice(
        newIndex as NonNullable<SortableEvent['newIndex']>,
        0,
        draggedItem
      );
      this.updateList(tmpList);
    },
  },
});
</script>

<style scoped>
.sortable-ghost {
  transform: translateY(1px);
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
.sortable-drag {
  opacity: 0;
}
</style>
