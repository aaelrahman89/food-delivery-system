<template>
  <v-breadcrumbs :items="pathSegments" class="px-0">
    <template #item="{ item: route }">
      <router-link
        :to="route.url"
        class="vg-darkgrey--text vg-no-underline"
        exact
        exact-active-class="font-weight-black"
      >
        {{ $t(route.text) }}
      </router-link>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'VgPathBreadcrumbs',
  computed: {
    pathSegments() {
      const { fullPath } = this.$route;
      const pathComponents = fullPath.split('/').slice(1);
      const segments = [{ url: '/', text: 'path_breadcrumbs.home' }];

      if (pathComponents[0]) {
        pathComponents.forEach((value, index) => {
          let text = '';
          const transformedValue = value
            .replace(/-/g, '_')
            .replace(/(?:\?.*)|(?:#.*)/g, '');

          const url = `/${pathComponents.slice(0, index + 1).join('/')}`;

          if (Number.isNaN(Number(transformedValue))) {
            text = `path_breadcrumbs.${transformedValue}`;
          } else {
            text = transformedValue;
          }

          segments.push({ url, text });
        });
      }

      return segments;
    },
  },
};
</script>

<style scoped></style>
