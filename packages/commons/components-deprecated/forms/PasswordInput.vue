<template>
  <v-text-field
    v-bind="$attrs"
    :append-icon="revealIcon"
    :type="type"
    v-on="$listeners"
    @click:append="togglePasswordReveal"
  ></v-text-field>
</template>

<script>
export default {
  name: 'PasswordInput',
  data() {
    return {
      revealPassword: false,
    };
  },
  computed: {
    type() {
      if (this.revealPassword) {
        return 'text';
      }
      return 'password';
    },
    revealIcon() {
      if (this.revealPassword) {
        return 'mdi-eye-off';
      }
      return 'mdi-eye';
    },
  },
  methods: {
    togglePasswordReveal() {
      this.revealPassword = !this.revealPassword;
    },
  },
};
</script>

<style scoped></style>
