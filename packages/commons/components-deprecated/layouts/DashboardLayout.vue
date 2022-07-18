<template>
  <v-row align="start" justify="start" class="fill-height overflow-auto">
    <v-col cols="12">
      <v-alert v-if="rootPM.alert" :color="rootPM.alert.type" tile>
        {{ $t(rootPM.alert.message) }}
      </v-alert>
      <h1 class="page-title">
        <bdi>
          <slot name="title"></slot>
        </bdi>
      </h1>
      <slot name="breadcrumbs">
        <v-breadcrumbs :items="breadcrumbItems" divider=">" class="px-0 py-2">
          <template #item="{ item }">
            <v-breadcrumbs-item
              :to="item.to"
              :disabled="shouldDisableBreadcrumbItem(item)"
              exact
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </slot>
      <slot></slot>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DashboardLayout',
  props: {
    breadcrumbItems: {
      type: Array,
      default: undefined,
    },
  },
  inject: ['rootPM'],
  methods: {
    shouldDisableBreadcrumbItem(item) {
      return item.to.name == this.$route.name;
    },
  },
};
</script>

<style scoped>
.page-title {
  font-size: 1.75rem !important;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em !important;
}
</style>
