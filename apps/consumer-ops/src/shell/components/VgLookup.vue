<template>
  <v-select
    :ref="'ctrl'"
    v-model="selectedItem"
    :items="options.data"
    :label="title"
    @input="$emit('input', selectedItem)"
  >
    <template #item="{ item }">
      <v-chip
        style="width: 100%"
        :dark="item.color ? true : false"
        class="pa-0"
        :color="item.color ? item.color : 'transparent'"
      >
        <span>{{ item.title }}</span>
      </v-chip>
    </template>
    <template #selection="{ item }">
      {{ item.title }}
    </template>
  </v-select>
</template>

<script>
export default {
  name: 'VgLookup',
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      selectedItem: '',
    };
  },
  methods: {
    value() {
      return this.selectedItem;
    },
    reset() {
      this.selectedItem = '';
    },
    /* remove(item) {
       this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
       this.selectedItems = [ ...this.selectedItems ];
       }, */
  },
};
</script>

<style scoped>
.v-list--dense {
  padding: 0;
}
</style>
