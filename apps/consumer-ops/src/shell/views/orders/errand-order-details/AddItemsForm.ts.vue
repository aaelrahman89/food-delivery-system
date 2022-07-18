<template>
  <vg-overlay :open="open" type="bottom-sheet" @backdrop="backdrop">
    <v-form @submit.prevent="submit()">
      <div class="add-item-form">
        <div class="add-item-form__header">
          <h1>
            {{ $t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_ITEM_FORM_TITLE') }} ({{
              title
            }})
          </h1>
        </div>

        <vg-flex gap-size="mid">
          <vg-text-field
            v-model.trim="form.quantity"
            :validator="form.validators['quantity']"
            type="text"
            outlined
            :label="
              $t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_ITEM_FORM_QUANTITY')
            "
          ></vg-text-field>

          <vg-text-field
            v-model.trim="form.name"
            :validator="form.validators['name']"
            type="text"
            outlined
            :label="$t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_ITEM_FORM_NAME')"
          ></vg-text-field>

          <vg-text-field
            v-model.trim="form.brand"
            type="text"
            outlined
            :label="$t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_ITEM_FORM_BRAND')"
          ></vg-text-field>
        </vg-flex>

        <vg-text-field
          v-model.trim="form.notes"
          type="text"
          outlined
          max-width="100%"
          :label="$t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_ITEM_FORM_NOTES')"
        ></vg-text-field>

        <vg-flex gap-size="mid" justify-content="end">
          <div>
            <vg-button outlined large @click="discard()">
              {{ $t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_ITEM_FORM_CANCEL') }}
            </vg-button>
          </div>
          <div>
            <vg-button large :disabled="!form.isValid()" @click="submit()">
              {{
                $t('ONLINE_ORDER_DETAILS_STRUCTURE_ORDER_ITEM_FORM_ADD_ITEM')
              }}
            </vg-button>
          </div>
        </vg-flex>
      </div>
    </v-form>
  </vg-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { VgButton } from '@survv/commons/components/VgButton';
import { VgFlex } from '@survv/commons/components/VgFlex';
import { VgOverlay } from '@survv/commons/components/VgOverlay';
import { VgTextField } from '@survv/commons/components/VgTextField';

const events = {
  submitted: 'submitted',
  discard: 'discard',
  backdrop: 'backdrop',
};

export default Vue.extend({
  name: 'AddItemsForm',
  components: {
    VgOverlay,
    VgTextField,
    VgFlex,
    VgButton,
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
  },
  methods: {
    backdrop(): void {
      this.$emit(events.backdrop);
    },
    discard(): void {
      this.$emit(events.discard);
    },
    submit(): void {
      this.$emit(events.submitted);
    },
  },
});
</script>

<style scoped lang="scss">
.add-item-form {
  background-color: var(--color-surface-light);
  padding: var(--inset-mid);

  &__header {
    margin-bottom: var(--inset-mid);
  }
}
</style>
