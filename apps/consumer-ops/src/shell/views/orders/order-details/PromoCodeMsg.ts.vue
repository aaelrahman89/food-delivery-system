<template>
  <div
    class="promocode-msg"
    :style="{
      color: colors[color].color,
      backgroundColor: colors[color].backgroundColor,
    }"
  >
    {{ msg }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'PromocodeMsg',
  props: {
    msg: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'success',
    },
  },
  data() {
    return {
      colors: {
        success: {
          color: '#16bb03',
          backgroundColor: 'rgba(12, 216, 22, 0.1)',
        },
        error: {
          color: 'rgb(255, 18, 67)',
          backgroundColor: 'rgb(255, 233, 236)',
        },
      },
    };
  },
});
</script>

<style scoped>
.promocode-msg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--inset-small);
  background-color: rgba(12, 216, 22, 0.1);
  color: #16bb03;
  border-radius: 4px;
  font-weight: bold;
}
</style>
