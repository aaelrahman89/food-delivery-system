<template>
  <ul class="vg-content__breadcrumbs">
    <router-link
      v-for="(segment, index) in segments"
      :key="index"
      v-slot="{ href, navigate }"
      :to="{ name: segment.routeName, params: segment.routeParams }"
    >
      <li class="vg-content__breadcrumbs__segment">
        <!-- bdi is necessary as we can have mixed content of rtl/ltr -->
        <bdi>
          <!--TODO: work with multilingual string-->
          <template v-if="segment.active">{{ $t(segment.text) }}</template>

          <template v-else>
            <a :href="href" @click="navigate">{{ $t(segment.text) }}</a>
          </template>
        </bdi>
      </li>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: 'VgContentBreadcrumbs',
  props: {
    breadcrumbs: {
      type: Array,
      default: undefined,
    },
  },
  computed: {
    segments() {
      return this.breadcrumbs.map((segment) => ({
        routeName: segment.routeName,
        routeParams: this.$route.params,
        text: segment.text ?? segment.routeName,
        active: this.$route.name == segment.routeName,
      }));
    },
  },
};
</script>

<style scoped lang="scss">
.vg-content__breadcrumbs {
  font-size: 20px;

  @at-root ul {
    list-style: none;
    padding: 0;

    li {
      display: inline-flex;
      align-items: center;
    }

    li + li::before {
      padding: 0 8px;
      content: '»';
    }
  }

  &__segment {
    a {
      color: var(--color-primary);
    }
  }
}
</style>
