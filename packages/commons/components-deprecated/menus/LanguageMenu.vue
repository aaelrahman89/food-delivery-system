<template>
  <v-menu v-model="openMenu" auto offset-y>
    <template #activator="{ on }">
      <v-btn v-bind="$attrs" v-on="on">
        {{ $t(localeCode) }}
        <v-icon>mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(locale, index) in $availableLocales"
        :key="index"
        @click="$changeLocale(locale.value)"
      >
        <v-list-item-title class="text-center">
          {{ $t(locale.code) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  name: 'LanguageMenu',
  data() {
    return {
      openMenu: false,
    };
  },
  computed: {
    localeCode() {
      return this.$availableLocales.find(
        (locale) => locale.value == this.$currentLocale
      ).code;
    },
  },
};
</script>
